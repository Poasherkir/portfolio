// Checks the site data for mistakes that build and typecheck let through:
// missing screenshots or logos, duplicate slugs, slugs that point nowhere.
// Run with `npm run check:content` (Node 22.18+, which loads the .ts data files directly).

import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import {
  experience,
  keycapList,
  projects,
  skillGroups,
  workPage,
} from "../src/data/portfolio.ts";
import { TECH_LOGOS } from "../src/data/tech-logos.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const deviconDir = path.join(publicDir, "assets", "devicon");

const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

function duplicates(values) {
  return [...new Set(values.filter((v, i) => values.indexOf(v) !== i))];
}

function isHttps(url) {
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

async function checkImage(where, src, expected) {
  const file = path.join(publicDir, src);
  if (!src.startsWith("/") || !existsSync(file)) {
    fail(where, `${src} does not exist in public/`);
    return;
  }
  const { width, height } = await sharp(file).metadata();
  if (expected.width && width !== expected.width) {
    fail(where, `${src} is ${width} px wide, expected ${expected.width}`);
  }
  if (expected.height && height !== expected.height) {
    fail(where, `${src} is ${height} px high, expected ${expected.height}`);
  }
}

// Projects

const slugs = projects.map((p) => p.slug);
for (const slug of duplicates(slugs)) fail("projects", `duplicate slug "${slug}"`);

for (const p of projects) {
  const where = `projects/${p.slug}`;

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) fail(where, "slug must be lowercase kebab-case");
  if (!p.title.trim() || !p.tagline.trim() || !p.valueProp.trim()) {
    fail(where, "title, tagline and valueProp are required");
  }
  if (p.hasCaseStudy && (!p.problem.trim() || !p.approach.trim())) {
    fail(where, "a case study needs at least a problem and an approach");
  }

  for (const [kind, url] of Object.entries(p.links)) {
    if (url && !isHttps(url)) fail(where, `links.${kind} is not an https URL: ${url}`);
  }
  for (const repo of p.relatedRepos ?? []) {
    if (repo.url && !isHttps(repo.url)) fail(where, `relatedRepos "${repo.name}" is not an https URL`);
  }

  for (const image of p.images) {
    if (!image.alt.trim()) fail(where, `${image.src} has no alt text`);
    await checkImage(where, image.src, { width: 1600, height: 1000 });
  }
  for (const screen of p.screens ?? []) {
    if (!screen.alt.trim() || !screen.caption.trim()) {
      fail(where, `${screen.src} needs alt text and a caption`);
    }
    await checkImage(where, screen.src, { width: 582 });
  }
}

for (const slug of [workPage.heroSlug, ...workPage.featuredSlugs]) {
  if (!slugs.includes(slug)) fail("workPage", `"${slug}" is not a project slug`);
}
for (const slug of duplicates([workPage.heroSlug, ...workPage.featuredSlugs])) {
  fail("workPage", `"${slug}" is listed twice`);
}

// Logos and keycaps

for (const [name, file] of Object.entries(TECH_LOGOS)) {
  if (!existsSync(path.join(deviconDir, file))) fail("tech-logos", `${name}: ${file} is missing`);
}
for (const group of skillGroups) {
  for (const item of group.items) {
    for (const file of item.icons ?? []) {
      if (!existsSync(path.join(deviconDir, file))) {
        fail(`skillGroups/${group.title}`, `${item.name}: ${file} is missing`);
      }
    }
  }
}

const capIds = keycapList.map((c) => c.id);
for (const id of duplicates(capIds)) fail("keycaps", `duplicate id "${id}"`);
for (const key of duplicates(keycapList.map((c) => c.key))) {
  fail("keycaps", `two caps share the key "${key}"`);
}
for (const cap of keycapList) {
  if (!existsSync(path.join(deviconDir, cap.icon))) fail(`keycaps/${cap.id}`, `${cap.icon} is missing`);
}
for (const exp of experience) {
  for (const id of exp.skills) {
    if (!capIds.includes(id)) fail(`experience/${exp.id}`, `skill "${id}" is not a keycap id`);
  }
}

// Report

if (projects.length === 0 || keycapList.length === 0) {
  fail("data", "no projects or keycaps found, so nothing was checked");
}

if (errors.length > 0) {
  console.error(`Content check failed with ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const imageCount = projects.reduce((n, p) => n + p.images.length + (p.screens?.length ?? 0), 0);
console.log(
  `Content check passed: ${projects.length} projects, ${imageCount} screenshots, ${keycapList.length} keycaps.`
);
