import type { ReactNode } from "react";

export type ProjectStatus = "production" | "active" | "archived";

/** Filter categories on /projects. */
export type ProjectTag = "Mobile" | "Backend" | "Automation" | "Web";

/** Layers of the architecture diagram. */
export type ArchLayerId =
  | "client"
  | "logic"
  | "api"
  | "data"
  | "integrations"
  | "automation"
  | "deploy";

/** Technologies per layer; empty layers are omitted. */
export type ProjectArchitecture = Partial<Record<ArchLayerId, string[]>>;

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  status: ProjectStatus;
  tags: ProjectTag[];
  stack: string[];
  /** Case-study sections. */
  problem: string;
  approach: string;
  hardPart: string;
  result: string;
  links: { repo?: string; live?: string; store?: string };
  images: { src: string; alt: string }[];
  featured: boolean;
  /** Shows a walkthrough offer in place of a source link. */
  privateRepo?: boolean;
  /** Other repositories belonging to the same product. */
  relatedRepos?: { name: string; url?: string; note: string }[];
  metrics?: { label: string; value: string }[];
  /** One-line summary shown on cards. */
  valueProp: string;
  architecture?: ProjectArchitecture;
  /** Portrait screenshots shown in phone frames. */
  screens?: { src: string; alt: string; caption: string }[];
  beforeAfter?: { before: string[]; via: string; after: string[] };
  whyItMatters?: string;
  hasCaseStudy: boolean;
  accent?: string;
};

export type SkillGroup = {
  title: string;
  blurb: string;
  items: {
    name: string;
    note?: string;
    /** Devicon files in /public/assets/devicon, only for named products. */
    icons?: string[];
  }[];
};

export type Service = {
  id: string;
  title: string;
  outcome: string;
  includes: string[];
  timeline: string;
  /** Null hides the price line. */
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
  startDate?: string;
  endDate?: string;
  title: string;
  company: string;
  description: string[];
  /** Keycap ids, used for the badge logos. */
  skills: string[];
};
