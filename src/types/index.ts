import type { ReactNode } from "react";

export type ProjectStatus = "production" | "active" | "archived";

/** Broad buckets used by the /projects filter bar. */
export type ProjectTag = "Mobile" | "Backend" | "Automation" | "Web";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  status: ProjectStatus;
  tags: ProjectTag[];
  stack: string[];
  /** Case-study body. Written as Problem -> Approach -> Hard part -> Result. */
  problem: string;
  approach: string;
  hardPart: string;
  result: string;
  links: { repo?: string; live?: string; store?: string };
  images: { src: string; alt: string }[];
  featured: boolean;
  /** Set when the source is private. Renders "walkthrough on request" instead of a dead link. */
  privateRepo?: boolean;
  /** Optional extra repos that belong to the same product. */
  relatedRepos?: { name: string; url?: string; note: string }[];
  /** Only render a metrics row when there are real numbers to show. */
  metrics?: { label: string; value: string }[];
  /** Long-form case study only exists for the top projects. */
  hasCaseStudy: boolean;
  accent?: string;
};

export type SkillGroup = {
  title: string;
  blurb: string;
  items: { name: string; note?: string }[];
};

export type Service = {
  id: string;
  title: string;
  outcome: string;
  includes: string[];
  timeline: string;
  /** Null until Malik decides the band — the price line is omitted rather than invented. */
  priceBand: string | null;
  icon: "mobile" | "server" | "automation" | "rescue";
};

export type NavLink = {
  title: string;
  href: string;
  description: string;
};

export type SocialLink = {
  title: string;
  href: string;
  handle: string;
  icon: "github" | "linkedin" | "upwork" | "fiverr" | "mail";
};

export type ProofPillar = {
  title: string;
  body: string;
  icon: ReactNode;
};

export type Experience = {
  id: number;
  /** Omitted where the real dates are not yet confirmed — never invented. */
  startDate?: string;
  endDate?: string;
  title: string;
  company: string;
  description: string[];
  /** Keycap ids, so the badges reuse the same logos as the 3D board. */
  skills: string[];
};
