import type { ReactNode } from "react";

export type ProjectStatus = "production" | "active" | "archived";

/** Broad buckets used by the /projects filter bar. */
export type ProjectTag = "Mobile" | "Backend" | "Automation" | "Web";

/** Layers a product passes through. A project only fills the ones it has. */
export type ArchLayerId =
  | "client"
  | "logic"
  | "api"
  | "data"
  | "integrations"
  | "automation"
  | "deploy";

/** Tech per layer. Layers with nothing in them are omitted. */
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
  /** Case-study body. Written as Problem -> Approach -> Hard part -> Result. */
  problem: string;
  approach: string;
  hardPart: string;
  result: string;
  links: { repo?: string; live?: string; store?: string };
  images: { src: string; alt: string }[];
  featured: boolean;
  /** Private source — renders a walkthrough offer instead of a dead link. */
  privateRepo?: boolean;
  /** Optional extra repos that belong to the same product. */
  relatedRepos?: { name: string; url?: string; note: string }[];
  /** Omitted when there are no figures to show. */
  metrics?: { label: string; value: string }[];
  /** One sentence on why it exists. Cards lead with this, not the stack. */
  valueProp: string;
  /** Absent where the stack is not documented. */
  architecture?: ProjectArchitecture;
  /** Portrait app screenshots, shown in device frames. `images` is landscape. */
  screens?: { src: string; alt: string; caption: string }[];
  /** Only where a manual process was replaced by an automated one. */
  beforeAfter?: { before: string[]; via: string; after: string[] };
  /** Case studies only. */
  whyItMatters?: string;
  /** Long-form case study only exists for the top projects. */
  hasCaseStudy: boolean;
  accent?: string;
};

export type SkillGroup = {
  title: string;
  blurb: string;
  items: {
    name: string;
    note?: string;
    /**
     * Devicon files in /public/assets/devicon, set only where the entry names
     * a real product. Two where the entry names two. Everything else here is
     * a discipline rather than a tool and deliberately carries none — there is
     * no logo for aviation data or for admin dashboards, and borrowing a
     * neighbouring one to fill the gap would be a lie.
     */
    icons?: string[];
  }[];
};

export type Service = {
  id: string;
  title: string;
  outcome: string;
  includes: string[];
  timeline: string;
  /** Null hides the price line rather than showing a guess. */
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
  /** Omitted where the dates are not confirmed. */
  startDate?: string;
  endDate?: string;
  title: string;
  company: string;
  description: string[];
  /** Keycap ids, so the badges reuse the same logos as the 3D board. */
  skills: string[];
};
