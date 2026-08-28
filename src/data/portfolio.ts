import type {
  ArchLayerId,
  Experience,
  NavLink,
  Project,
  Service,
  SkillGroup,
  SocialLink,
} from "@/types";

/* ---------------------------------------------------------------------------
 * Site content.
 *
 * Everything the site says lives here; components read from it and never
 * hardcode copy. Unknown values are omitted rather than guessed, and the
 * component simply does not render that line. Outstanding items are listed in
 * CONTENT_CHECKLIST at the bottom.
 * ------------------------------------------------------------------------- */

export const profile = {
  name: "Malik Boudine",
  handle: "Poasherkir",
  /** Shown under the name in the hero. */
  role: "Full-stack & mobile developer",
  location: "Algiers, Algeria",
  timezone: "GMT+1",
  /** Registered to invoice and receive foreign payments. */
  legal: "Registered auto-entrepreneur (ANAE) — I invoice internationally.",
  languages: [
    { name: "English", level: "Professional" },
    { name: "French", level: "Professional" },
    { name: "Arabic", level: "Native" },
  ],

  email: "malikboudinee1e@gmail.com" as string | null,
  /** Null hides the "Book a call" button. */
  calendly: null as string | null,
  /** Null hides the CV buttons. */
  cv: {
    en: null as string | null,
    fr: null as string | null,
  },

  site: process.env.NEXT_PUBLIC_SITE_URL ?? "https://malikboudine.vercel.app",
  github: "https://github.com/Poasherkir",
};

export const seo = {
  title: `${profile.name} — Full-Stack & Mobile Developer`,
  description: {
    short:
      "Full-stack and mobile developer building production web and mobile applications with Flutter, React, Supabase and Python.",
    long:
      "Malik Boudine is a full-stack and mobile developer based in Algiers, working remotely with clients in Europe, North America and the Maghreb. Flutter and Dart for mobile, React and TypeScript for web, Supabase and Postgres on the backend, Python for automation and document pipelines. Flagship work is Briefing Point Go, an Electronic Flight Bag used by Air Algérie crew. Registered auto-entrepreneur, able to invoice internationally. Works in English, French and Arabic.",
  },
  keywords: [
    "Malik Boudine",
    "Poasherkir",
    "freelance Flutter developer",
    "Flutter developer Algeria",
    "Supabase developer",
    "React developer",
    "full stack developer",
    "mobile app developer",
    "Python automation",
    "PDF automation",
    "Electronic Flight Bag",
    "developpeur Flutter freelance",
  ],
  ogImage: "/assets/seo/og-image.png",
};

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export const navLinks: NavLink[] = [
  { title: "Home", href: "/", description: "Start here" },
  { title: "Projects", href: "/projects", description: "Everything, filterable" },
  { title: "Stack", href: "/stack", description: "Everything I work with" },
  { title: "Services", href: "/#services", description: "What you can hire me for" },
  { title: "About", href: "/about", description: "Who I am and how I work" },
  { title: "Contact", href: "/contact", description: "Start a project" },
];

export const socials: SocialLink[] = [
  { title: "GitHub", href: profile.github, handle: "@Poasherkir", icon: "github" },
  // Add LinkedIn / Upwork here and they appear in the header, footer and contact page.
];

/* -------------------------------------------------------------------------- */
/* Hero + proof                                                                */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: "Full-stack · Mobile · Automation",
  /** The big display type, one line per entry. */
  displayLines: ["I build", "software", "that ships."],
  subhead:
    "I build production apps end to end. Flutter on mobile, React on web, Supabase and Python behind them — architecture through to the signed release.",
  /** Set to null when booked up. */
  availability: "Available for selected freelance projects",
  primaryCta: { label: "View my work", href: "/projects" },
  secondaryCta: { label: "Let's work together", href: "/contact" },
};

/** Every line here is verifiable. */
export const proofStrip: string[] = [
  "Flagship: an Electronic Flight Bag in commercial aviation use",
  "Rewritten twice — React Native → Capacitor → Flutter",
  "Registered auto-entrepreneur — invoices internationally",
  "EN · FR · AR",
  "Mobile + backend + admin + release pipeline, solo",
];

export const proofPillars = [
  {
    id: "production",
    title: "Production, not portfolio-ware",
    body: "Signed release pipelines, encrypted credentials, live data feeds, real users. The projects below are things people open at work, not things I opened once for a screenshot.",
  },
  {
    id: "ownership",
    title: "End-to-end ownership",
    body: "Mobile app, backend schema, admin dashboard, deployment. I have shipped all four layers of the same product alone, so nothing gets thrown over a wall.",
  },
  {
    id: "integrations",
    title: "Hard integrations",
    body: "METAR weather and ADS-B tracking, authenticated roster scraping, PDF content-stream surgery, and a local payment gateway with no usable SDK. The parts other people quote around.",
  },
  {
    id: "languages",
    title: "Trilingual delivery",
    body: "English, French and Arabic — specs, calls and handover docs. Clients in three markets, no translator in the loop.",
  },
];

/* -------------------------------------------------------------------------- */
/* Skills                                                                      */
/* -------------------------------------------------------------------------- */

export const skillGroups: SkillGroup[] = [
  {
    title: "Mobile",
    blurb:
      "Flutter is the primary stack. Everything from architecture to a signed store build.",
    items: [
      { name: "Flutter / Dart", note: "primary" },
      { name: "go_router" },
      { name: "Custom state layer", note: "ChangeNotifier + InheritedWidget (AppScope)" },
      { name: "Design systems", note: "custom component libraries" },
      { name: "React Native" },
      { name: "Capacitor" },
      { name: "Android release engineering", note: "APK signing, ProGuard, FLAG_SECURE" },
      { name: "Encrypted credential storage" },
      { name: "APK reverse engineering", note: "jadx recovery" },
    ],
  },
  {
    title: "Frontend",
    blurb: "Client-facing web, plus the back-office nobody else wants to build.",
    items: [
      { name: "React" },
      { name: "TypeScript / JavaScript" },
      { name: "HTML / CSS" },
      { name: "Admin dashboards", note: "CRUD, auth, role gating" },
      { name: "PWA development" },
    ],
  },
  {
    title: "Backend & data",
    blurb: "Postgres-first. Auth and permissions enforced on the server, never in the client.",
    items: [
      { name: "Supabase", note: "Postgres, Auth, Storage, RLS, Edge Functions" },
      { name: "PHP / MySQL" },
      { name: "Python", note: "pipelines, scraping, automation" },
      { name: "Playwright", note: "authenticated scraping" },
      { name: "REST API integration" },
    ],
  },
  {
    title: "Specialities",
    blurb: "The narrow things that are hard to hire for.",
    items: [
      {
        name: "Document / PDF engineering",
        note: "PyMuPDF — watermark removal, A4 normalisation, merging",
      },
      { name: "Aviation data", note: "METAR/TAF, ADS-B, crew rosters, OFP" },
      { name: "Algerian payment gating", note: "BaridiMob" },
      { name: "Gamification & quiz engines" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Keycaps for the 3D keyboard in the background                               */
/* -------------------------------------------------------------------------- */

export type SkillLevel = "shipping" | "working" | "roadmap";

export type Keycap = {
  id: string;
  /** Devicon SVG in /public/assets/devicon. Full colour, MIT licensed. */
  icon: string;
  label: string;
  description: string;
  /** Surfaced in the read-out, so a logo never overstates the level. */
  level: SkillLevel;
  /** Brand hex. Used as a dark tint for the cap body, not at full strength. */
  color: string;
  /** Physical key that presses this cap when typed. */
  key: string;
  /** Omitted where there is nothing real to point at. */
  usedIn?: string;
};

/**
 * The board doubles as the skills matrix, so every cap carries its tier and
 * the read-out states it — a logo alone would overstate the roadmap entries.
 */
export const keycaps: Keycap[][] = [
  // Web core
  [
    { id: "html5", icon: "html5-plain.svg", label: "HTML5", level: "shipping", color: "#E34F26", key: "h", description: "Semantic structure first. Accessibility is not a plugin." },
    { id: "css3", icon: "css3-plain.svg", label: "CSS3", level: "shipping", color: "#1572B6", key: "c", description: "Grid, flexbox and design systems that survive a redesign." },
    { id: "javascript", icon: "javascript-plain.svg", label: "JavaScript", level: "shipping", color: "#F7DF1E", key: "j", description: "Still the language everything else negotiates with." },
    { id: "typescript", icon: "typescript-plain.svg", label: "TypeScript", level: "shipping", color: "#3178C6", key: "t", description: "Types at the boundary, so a bad API response fails at build.", usedIn: "TechSub · this site" },
    { id: "react", icon: "react-original.svg", label: "React", level: "shipping", color: "#61DAFB", key: "r", description: "Client-facing web and every admin dashboard behind a product.", usedIn: "TechSub admin · dashboards" },
    { id: "nextjs", icon: "nextjs-plain.svg", label: "Next.js", level: "shipping", color: "#9AA4B2", key: "n", description: "App Router and server components. This site runs on it.", usedIn: "TechSub storefront · this site" },
  ],
  // UI & mobile
  [
    { id: "tailwindcss", icon: "tailwindcss-original.svg", label: "Tailwind CSS", level: "shipping", color: "#38BDF8", key: "w", description: "Utility-first, with a real design system on top of it.", usedIn: "TechSub · this site" },
    { id: "vitejs", icon: "vitejs-plain.svg", label: "Vite", level: "working", color: "#646CFF", key: "v", description: "Fast dev server and build for React work." },
    { id: "figma", icon: "figma-plain.svg", label: "Figma", level: "shipping", color: "#F24E1E", key: "f", description: "Where a client hands me a design and I hand back a signed build." },
    { id: "flutter", icon: "flutter-plain.svg", label: "Flutter", level: "shipping", color: "#54C5F8", key: "1", description: "The primary stack. One codebase, Android and iOS, shipped signed.", usedIn: "Briefing Point Go · BAC Archive" },
    { id: "dart", icon: "dart-plain.svg", label: "Dart", level: "shipping", color: "#0175C2", key: "2", description: "Sound null safety and a compiler that catches what tests would not.", usedIn: "Briefing Point Go" },
    { id: "android", icon: "android-plain.svg", label: "Android", level: "shipping", color: "#3DDC84", key: "3", description: "APK signing, ProGuard, FLAG_SECURE, encrypted credential storage.", usedIn: "Briefing Point Go · BAC Archive" },
  ],
  // Data
  [
    { id: "supabase", icon: "supabase-plain.svg", label: "Supabase", level: "shipping", color: "#3ECF8E", key: "s", description: "Postgres, auth, storage and edge functions without a devops hire.", usedIn: "Briefing Point Go · BAC Archive" },
    { id: "postgresql", icon: "postgresql-plain.svg", label: "PostgreSQL", level: "shipping", color: "#4169E1", key: "g", description: "Relational modelling done properly, before any client code exists.", usedIn: "TechSub · Supabase apps" },
    { id: "mysql", icon: "mysql-original.svg", label: "MySQL", level: "shipping", color: "#4479A1", key: "q", description: "Relational schema design and CRUD backends on PHP stacks." },
    { id: "oracle", icon: "oracle-original.svg", label: "Oracle SQL", level: "working", color: "#F80000", key: "o", description: "Relational modelling and query work. No shipped project on this one." },
    { id: "mongodb", icon: "mongodb-plain.svg", label: "MongoDB", level: "working", color: "#47A248", key: "m", description: "Postgres covers the work today." },
    { id: "prisma", icon: "prisma-original.svg", label: "Prisma", level: "shipping", color: "#2D3748", key: "e", description: "Typed schema and migrations behind the TechSub API.", usedIn: "TechSub API" },
  ],
  // Backend
  [
    { id: "python", icon: "python-plain.svg", label: "Python", level: "shipping", color: "#3776AB", key: "p", description: "Pipelines, scraping and automation. The quiet money-saver.", usedIn: "PDF pipeline · BAC Archive importer" },
    { id: "php", icon: "php-plain.svg", label: "PHP", level: "shipping", color: "#777BB4", key: "u", description: "Legacy stacks are real work. I maintain them without complaining.", usedIn: "Gestion de la Scolarité" },
    { id: "nodejs", icon: "nodejs-plain.svg", label: "Node.js", level: "working", color: "#5FA04E", key: "4", description: "The next backend ecosystem after Supabase." },
    { id: "nestjs", icon: "nestjs-original.svg", label: "NestJS", level: "shipping", color: "#E0234E", key: "5", description: "Structured Node backend — the TechSub API runs on it.", usedIn: "TechSub API" },
    { id: "java", icon: "java-plain.svg", label: "Java", level: "working", color: "#E76F00", key: "7", description: "Fourth step on the path, after SQL." },
    { id: "fastapi", icon: "fastapi-original.svg", label: "FastAPI", level: "shipping", color: "#009688", key: "8", description: "The Amadeus load/pax and OFP services behind Briefing Point Go.", usedIn: "Briefing Point Go services" },
  ],
  // Tooling
  [
    { id: "git", icon: "git-plain.svg", label: "Git", level: "shipping", color: "#F03C2E", key: "a", description: "Small commits, milestone gates, a history you can read.", usedIn: "Every project" },
    { id: "github", icon: "github-original.svg", label: "GitHub", level: "shipping", color: "#9AA4B2", key: "y", description: "Issues, pull requests, releases. A workspace, not a folder of demos.", usedIn: "Every project" },
    { id: "linux", icon: "linux-plain.svg", label: "Linux", level: "working", color: "#FCC624", key: "l", description: "Terminal, permissions, processes, logs." },
    { id: "docker", icon: "docker-plain.svg", label: "Docker", level: "working", color: "#2496ED", key: "d", description: "The clearest gap between hobby and professional." },
    { id: "amazonwebservices", icon: "amazonwebservices-plain-wordmark.svg", label: "AWS", level: "working", color: "#FF9900", key: "0", description: "EC2, S3, RDS and IAM first." },
    { id: "jest", icon: "jest-plain.svg", label: "Jest", level: "working", color: "#C21325", key: "J", description: "Unit, integration and snapshot testing for React work." },
  ],
];

export const keycapList = keycaps.flat();

/* -------------------------------------------------------------------------- */
/* Experience                                                                  */
/* -------------------------------------------------------------------------- */

export const experience: Experience[] = [
  {
    id: 1,
    endDate: "Present",
    title: "Freelance full-stack & mobile developer",
    company: "Independent — registered auto-entrepreneur (ANAE)",
    description: [
      "Ships production Flutter apps end to end: mobile client, Supabase backend, React admin dashboard and a signed release pipeline — alone.",
      "Flagship work is Briefing Point Go, an Electronic Flight Bag in production with Air Algérie crew, integrating METAR weather, ADS-B tracking and authenticated eCrew roster data.",
      "Works and delivers in English, French and Arabic, invoicing international clients legally.",
    ],
    skills: ["flutter", "dart", "supabase", "postgresql", "react", "python"],
  },
];

/** One line, kept understated. */
export const foundations =
  "Also comfortable in: Postgres tuning, relational modelling, REST integration, release engineering.";

/* -------------------------------------------------------------------------- */
/* Capabilities                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The skills list is organised by technology. This is the same work organised
 * by what a client is actually buying — every entry names the project it can
 * be checked against, so nothing here is a claim without a receipt.
 */
export const capabilities: {
  id: string;
  title: string;
  body: string;
  proof: string;
}[] = [
  {
    id: "offline",
    title: "Works without a signal",
    body: "Local-first storage and background sync, so the app keeps working on a plane, in a basement or on a dead connection — and catches up quietly when the network returns.",
    proof: "BAC Archive · Briefing Point Go",
  },
  {
    id: "payments",
    title: "Payments that work locally",
    body: "Integration with the payment methods your customers actually hold, including Algerian rails like BaridiMob where there is no usable SDK and international checkout simply fails.",
    proof: "TechSub",
  },
  {
    id: "bilingual",
    title: "Arabic, French and English",
    body: "Full right-to-left layouts, not a translated string file. Mixed-direction text, mirrored navigation and number formatting that survives contact with real content.",
    proof: "TechSub · BAC Archive",
  },
  {
    id: "security",
    title: "Permissions enforced on the server",
    body: "Row-level security in Postgres and encrypted credential storage on device. If a request should be refused it is refused by the database, not by a hidden button.",
    proof: "Briefing Point Go · TechSub",
  },
  {
    id: "release",
    title: "Shipped to the store, not to a demo",
    body: "Signed release pipelines, ProGuard rules, screenshot blocking on sensitive screens, and remote config that can force an update or block a bad build after it is out.",
    proof: "Briefing Point Go",
  },
  {
    id: "integrations",
    title: "Hostile data sources",
    body: "Live third-party feeds normalised into something dependable — weather and aircraft tracking, authenticated scraping where there is no API, and document pipelines that rebuild broken PDFs.",
    proof: "Briefing Point Go · Aviation PDF Pipeline",
  },
];

/* -------------------------------------------------------------------------- */
/* Services                                                                    */
/* -------------------------------------------------------------------------- */

export const services: Service[] = [
  {
    id: "mobile-products",
    title: "Mobile products",
    outcome:
      "Flutter applications for Android and iOS from one codebase — from a Figma file or a rough idea to a signed build on the store.",
    includes: [
      "Flutter app for Android and iOS from one codebase",
      "Supabase backend: Postgres schema, auth, storage, row-level security",
      "Offline behaviour designed in, not bolted on",
      "Signed release pipeline and store submission",
      "Handover documentation in English or French",
    ],
    timeline: "4–8 weeks to a first release",
    priceBand: null,
    icon: "mobile",
  },
  {
    id: "business-platforms",
    title: "Business platforms",
    outcome:
      "Web applications, dashboards, authentication and databases — the back-office your team actually runs the product from.",
    includes: [
      "Postgres schema design and migrations",
      "Auth with role gating enforced server-side, not in the client",
      "Row-level security policies, reviewed and tested",
      "React admin dashboard over the whole thing",
      "Payment and third-party integration where the product needs it",
    ],
    timeline: "2–5 weeks",
    priceBand: null,
    icon: "server",
  },
  {
    id: "automation",
    title: "Automation",
    outcome:
      "Python, Playwright, APIs and document pipelines that delete a recurring manual task outright.",
    includes: [
      "PDF pipelines: watermark removal, page normalisation, merging, extraction",
      "Authenticated scraping with Playwright, run server-side",
      "Third-party API integration and normalisation",
      "Scheduled jobs with failure alerting",
      "A runbook so it survives without me",
    ],
    timeline: "1–3 weeks",
    priceBand: null,
    icon: "automation",
  },
  {
    id: "app-rescue",
    title: "Existing app rescue",
    outcome:
      "Architecture review, bug fixing and productionisation for an app that works in a demo but not in the world.",
    includes: [
      "Architecture and code review, written up plainly",
      "Diagnosis of the failures you can reproduce and the ones you cannot",
      "Security pass: auth, permissions, credential storage, input validation",
      "Release engineering — signing, obfuscation, a build you can ship again",
      "A prioritised list of what to fix now and what can wait",
    ],
    timeline: "1–2 weeks for the review",
    priceBand: null,
    icon: "rescue",
  },
];

/* -------------------------------------------------------------------------- */
/* Delivery process                                                            */
/* -------------------------------------------------------------------------- */

/** End-to-end delivery, not just the build step. */
export const deliveryProcess: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Discover",
    body: "What breaks today, who it breaks for, and what it should do instead. If a feature is a bad idea I say so in week one, not after invoicing for it.",
  },
  {
    step: "02",
    title: "Design",
    body: "Data model and architecture before any screens. Getting the schema and the permission boundary right is most of whether the thing survives contact with real users.",
  },
  {
    step: "03",
    title: "Build",
    body: "Small commits against milestones you review before I move on. You are never weeks away from the last thing you actually saw.",
  },
  {
    step: "04",
    title: "Test",
    body: "Real devices, real data shapes, and the failure cases — bad network, hostile API responses, permissions that should be refused.",
  },
  {
    step: "05",
    title: "Deploy",
    body: "Signed release pipeline, store submission, environment configuration and the monitoring to know when something breaks.",
  },
  {
    step: "06",
    title: "Handover",
    body: "An admin dashboard your team operates, documentation in English or French, and a walkthrough. The goal is that you do not need me on retainer.",
  },
];

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export const projects: Project[] = [
  {
    slug: "briefing-point-go",
    title: "Briefing Point Go",
    tagline: "Electronic Flight Bag for Air Algérie crew — a native Flutter rebuild.",
    role: "Sole developer — Flutter client, Supabase schema, FastAPI services, release pipeline",
    year: "Ongoing",
    status: "production",
    tags: ["Mobile", "Backend", "Automation"],
    stack: ["Flutter", "Dart", "go_router", "Supabase", "FastAPI", "Hive", "dio", "fl_chart"],
    valueProp: "Electronic Flight Bag for aviation crew workflows.",
    /* TODO: re-enable once the screenshots are in public/assets/projects/.

    // // Real screens from the production build.
    // screens: [
    //   {
    //     src: "/assets/projects/bpg-home.webp",
    //     alt: "Briefing Point Go home screen showing a layover in SRT, the next flight, and a pre-departure check scored 19 LOW",
    //     caption: "Duty status and a scored pre-departure check",
    //   },
    //   {
    //     src: "/assets/projects/bpg-roster.webp",
    //     alt: "Roster screen with Today, Classic, Monthly, Grid and Swap views, a check-in button, the next flight and rest minimums",
    //     caption: "Roster views, check-in and rest minimums",
    //   },
    //   {
    //     src: "/assets/projects/bpg-tools.webp",
    //     alt: "Tools screen listing flight calculation, time calculation, operations, airport data, logbook and other tool groups",
    //     caption: "Tools grouped by task",
    //   },
    //   {
    //     src: "/assets/projects/bpg-airports.webp",
    //     alt: "Airport lookup screen with a search field for ICAO, IATA or name and a list of recently viewed airports",
    //     caption: "Airport lookup by ICAO, IATA or name",
    //   },
    //   {
    //     src: "/assets/projects/bpg-settings.webp",
    //     alt: "Settings screen showing online status, credential storage and offline database sync state",
    //     caption: "Offline database sync and credential storage",
    //   },
    // ],
    // architecture: {
    //   client: ["Flutter", "Dart", "go_router", "fl_chart"],
    //   logic: ["ChangeNotifier controllers", "AppScope"],
    //   api: ["FastAPI (Amadeus load/pax, OFP)", "dio"],
    //   data: ["Supabase Postgres", "Hive offline cache", "flutter_secure_storage"],
    //   integrations: ["METAR/TAF", "ADS-B", "CTOT & delays", "eCrew", "Amadeus"],
    //   automation: ["Remote config — force update or block a build"],
    //   deploy: ["Shared nginx origin with the web app"],
    // },
    */
    problem:
      "A pilot assembles a duty day from a dozen disconnected sources: roster, operational flight plan, load and passenger figures, slot times and delays, weather, NOTAMs, radiation exposure. On a phone, in an airport, minutes before pushback. Anything not in one place does not get read.",
    approach:
      "One Flutter app, five tabs behind a go_router StatefulShellRoute.indexedStack — Home, Airports, Crew, Tools, Settings. State is plain ChangeNotifier controllers per feature, read through a top-level AppScope; no Provider, Riverpod or Bloc anywhere, so rebuild scope stays explicit and the dependency surface stays small. It speaks to the same Supabase backend and the same two internal FastAPI services (Amadeus load/pax, OFP) as the existing web app, through the same nginx origin — the rebuild required no server changes at all.",
    hardPart:
      "Breadth and trust, at once. Roughly 70 reference and calculation tools sit behind one dashboard, and the data underneath is hostile: METAR/TAF, ADS-B, CTOT and delay feeds, cosmic radiation dose per sector. eCrew and Amadeus credentials live in flutter_secure_storage, structured data caches to Hive so the app still works airside with no signal, and remote config can force an update or block a build outright when something ships wrong. Aviation is not a domain where “it mostly works” is a state you ship in.",
    result:
      "In production with Air Algérie crew. A native rebuild that reached feature parity with the web app without touching the backend — the same Supabase project and FastAPI services serve both.",
    whyItMatters:
      "Crew read this minutes before pushback, on a phone, in an airport. Every source it consolidates is one fewer thing to chase while doing something else — and in aviation the cost of missing one is not a bad user experience.",
    links: {},
    images: [],
    featured: true,
    hasCaseStudy: true,
    privateRepo: true,
    metrics: [
      { label: "Reference & calculation tools", value: "~70" },
      { label: "Main sections", value: "5" },
      { label: "Backend changes required", value: "None" },
    ],
  },
  {
    slug: "techsub",
    title: "TechSub",
    tagline: "Bilingual AR/FR subscription marketplace built on Algerian payment rails.",
    role: "Sole developer — NestJS API, Next.js storefront, admin panel, Prisma schema",
    year: "Ongoing",
    status: "production",
    tags: ["Web", "Backend"],
    stack: ["Next.js", "NestJS", "Prisma", "PostgreSQL", "Tailwind CSS", "Zod", "Vercel"],
    valueProp: "Bilingual subscription marketplace built around Algerian payment infrastructure.",
    architecture: {
      client: ["Next.js 15 App Router", "Tailwind CSS", "Arabic + French RTL"],
      logic: ["Order state machine", "Shared Zod schemas"],
      api: ["NestJS"],
      data: ["Prisma", "PostgreSQL"],
      integrations: ["Baridimob", "RedotPay"],
      automation: ["Admin verification and fulfilment queue"],
      deploy: ["Vercel — two projects from one monorepo"],
    },
    problem:
      "Algerians largely cannot buy digital subscriptions: the payment methods people actually hold do not work with international checkout. The workaround in the market is shared credentials, which is fragile and unsafe for everyone involved.",
    approach:
      "A monorepo — NestJS + Prisma + Postgres API, Next.js 15 App Router storefront, and a shared package of types and Zod schemas both sides validate against, so the contract cannot drift. Customers pay in dinars via Baridimob or dollars via RedotPay and upload a receipt; an admin verifies the transfer and a brand-new single-owner account is created under the customer's own email. No shared-credential pool anywhere. Fully bilingual Arabic and French with real RTL, not a mirrored stylesheet.",
    hardPart:
      "The order lifecycle is a genuine state machine with reserved inventory, not a status column. PENDING_PAYMENT to PENDING_VERIFICATION to VERIFIED — which decrements product capacity — then IN_PROGRESS to FULFILLED. Every terminal state reached after VERIFIED has to hand the reserved capacity back, or the shop slowly convinces itself it is sold out. Dual currency runs the whole way through: dinar and dollar prices are set independently per duration, and a plan with no dollar price is simply not offered for dollar checkout.",
    result:
      "Live and deployed, storefront and API running as two Vercel projects from one monorepo. The admin panel covers verification, the fulfilment queue, capacity, payment methods, coupons, support tickets and analytics — the owner never touches the database.",
    whyItMatters:
      "The market default is shared credentials — one account passed between strangers. This gives each customer an account in their own name, paid for with the money they actually hold, which is the difference between a workaround and a product.",
    links: { live: "https://subhub-three.vercel.app/fr" },
    // Captured from the live storefront. The only project with real product
    // shots, because it is the only one with a public URL to capture.
    images: [
      {
        src: "/assets/projects/techsub-fr.webp",
        alt: "TechSub storefront in French — subscription search and local payment methods",
      },
      {
        src: "/assets/projects/techsub-ar.webp",
        alt: "The same TechSub storefront in Arabic, laid out right-to-left",
      },
    ],
    featured: true,
    hasCaseStudy: true,
    privateRepo: true,
    metrics: [
      { label: "Languages", value: "AR + FR, full RTL" },
      { label: "Payment rails", value: "Baridimob + RedotPay" },
    ],
  },
  {
    slug: "bac-archive",
    title: "أرشيف البكالوريا — BAC Archive",
    tagline: "Offline-first archive of Algerian Baccalaureate papers, 2008 to 2026.",
    role: "Sole developer — Flutter app, admin dashboard, Python importer, Supabase backend",
    year: "Ongoing",
    status: "production",
    tags: ["Mobile", "Backend", "Automation"],
    stack: ["Flutter", "Riverpod", "go_router", "Supabase", "pdfx", "Python"],
    valueProp: "Offline-first archive of Algerian Baccalaureate papers from 2008 to 2026.",
    architecture: {
      client: ["Flutter", "go_router", "pdfx"],
      logic: ["Riverpod"],
      api: ["Supabase Auth", "Row-level security"],
      data: ["Supabase Postgres + Storage", "Full on-device mirror"],
      automation: ["Python importer — idempotent and resumable", "HTML/JS admin dashboard"],
      deploy: ["Public APK — anon key assumed compromised by design"],
    },
    problem:
      "Algerian bac students revise from photocopies and PDFs scattered across messaging apps, frequently on a connection that cannot be relied on. Anything that needs the network to open is useless in the room where the studying actually happens.",
    approach:
      "The app is a mirror, not a client. One sync on first launch pulls the whole archive to the device, and from then on every screen and every PDF reads from local storage with zero network calls — the network is only ever used to refresh the mirror. Three parts share one Supabase backend: the Flutter app, a dependency-free HTML/JS admin dashboard for uploads, and a stdlib-only Python importer for bulk-loading a local archive.",
    hardPart:
      "Making the offline guarantee actually hold. Downloads stream to a .part file and are renamed only on success, so an app killed mid-download never leaves a half-file that looks complete; the importer is idempotent and resumable, skipping what storage already has. Local paths are derived from the public URL rather than rebuilt, so the mirror cannot drift from whatever the dashboard uploaded. And because the anon key ships inside a public APK, security cannot rest on key secrecy — reads are public, every write is gated behind Auth and row-level security.",
    result:
      "Serving the full Experimental Sciences archive offline, with new uploads reaching students through a silent background delta-sync rather than an app update.",
    whyItMatters:
      "Revision happens where the connection does not reach. An archive that needs the network to open is an archive that is closed at exactly the moment it is needed.",
    links: {},
    images: [],
    featured: true,
    hasCaseStudy: true,
    privateRepo: true,
    metrics: [
      { label: "Exam entries", value: "171" },
      { label: "PDFs served", value: "343" },
      { label: "Years covered", value: "2008–2026" },
    ],
  },
  {
    slug: "ofp-api",
    title: "OFP API",
    tagline: "Turns an airline flight-planning portal with no API into clean JSON, on serverless.",
    role: "Sole developer — reverse engineering, parser, edge function",
    year: "2026",
    status: "production",
    tags: ["Backend", "Automation"],
    stack: ["Deno", "Supabase Edge Functions", "TypeScript", "Python", "pdf-parse"],
    valueProp: "Operational flight plans pulled from a portal with no API and served as structured JSON.",
    architecture: {
      logic: ["Deno edge function", "PDF text extraction"],
      api: ["Session auth against a Symfony app", "REST endpoints"],
      integrations: ["skybook.aero"],
      automation: ["Scheduled fetch and parse"],
    },
    problem:
      "A pilot's operational flight plan — fuel, weights, route, alternates — lives in a dispatch portal with no API and no export. Reading it on a phone meant logging into a desktop web app and scrolling a PDF minutes before departure.",
    approach:
      "The edge function calls the portal's own REST endpoints rather than driving a browser: find the sector id in the 7-day schedule, pull the OFP PDF for it, extract the text and parse the operational figures out. It returns the parsed fields and the full plan text together, so the client can dig for the richer items itself.",
    hardPart:
      "The login. It is a Symfony app, so GET /login sets a session cookie and embeds a CSRF token, and the POST that follows must be sent with redirect set to manual — the auth cookies ride on the 302 response, and following the redirect throws them away. Earlier versions drove a headless Chromium on a VPS, which the mobile client could not even call: it is a Capacitor WebView on an https origin, and plain-HTTP requests are blocked outright. Moving to an HTTPS edge function removed that whole class of failure.",
    result:
      "Five architectures ended at one that needs no server: a Deno isolate that answers in a few seconds. In production behind Briefing Point Go.",
    links: {},
    images: [],
    featured: false,
    hasCaseStudy: false,
    privateRepo: true,
    metrics: [
      { label: "Architectures before this one", value: "4" },
      { label: "Servers to maintain", value: "None" },
    ],
  },
  {
    slug: "amadeus-api",
    title: "Amadeus Load API",
    tagline: "Live load-control figures from an airline ground-ops portal, exposed to a mobile app.",
    role: "Sole developer — integration, session handling, backend",
    year: "2026",
    status: "production",
    tags: ["Backend", "Automation"],
    stack: ["Python", "FastAPI", "Session auth", "REST"],
    valueProp: "Passenger counts and loadsheets from a ground-operations portal, served to a mobile client.",
    architecture: {
      logic: ["Session lifecycle and token refresh"],
      api: ["Small serverless backend"],
      integrations: ["Amadeus Alt\u00e9a DCS"],
      automation: ["Automated document retrieval"],
    },
    problem:
      "Load control — boarding figures, weight and balance, the loadsheet sent at closeout — lives in a web application built for desktop ground agents. Crew who needed those numbers had no way to see them on a phone.",
    approach:
      "A small backend authenticates against the operations portal with an authorised staff account, keeps the session alive across its several token types, and re-exposes the figures the app actually needs as a narrow JSON interface.",
    hardPart:
      "Session lifecycle. Authentication issues one kind of token, the application itself expects a second in the URL and a third as a cookie, and all of them expire on different schedules. Getting a single request to succeed is straightforward; keeping a session valid for hours without a browser holding it open is the actual work.",
    result:
      "Live passenger and load figures inside Briefing Point Go, alongside the flight plan data from the OFP service.",
    links: {},
    images: [],
    featured: false,
    hasCaseStudy: false,
    privateRepo: true,
    whyItMatters:
      "Built against a private operations portal with an authorised staff account. Not affiliated with or endorsed by Amadeus or the airline.",
  },
  {
    slug: "briefing-pdf-pipeline",
    title: "Aviation Briefing PDF Pipeline",
    tagline: "Turns raw airport briefing packs into one clean, printable document — automatically.",
    role: "Sole developer",
    year: "Ongoing",
    status: "production",
    tags: ["Automation"],
    stack: ["Python", "PyMuPDF"],
    valueProp: "Converts raw aviation briefing packs into one clean printable document automatically.",
    architecture: {
      automation: ["Python", "PyMuPDF — content-stream editing"],
    },
    beforeAfter: {
      before: [
        "Watermarked pages from SelfBrief",
        "Inconsistent page geometry",
        "Cover, briefing and disclaimer in separate files",
        "Assembled and cleaned by hand before every flight",
      ],
      via: "Python + PyMuPDF",
      after: [
        "Watermark layer stripped from the content stream",
        "Every page normalised to A4",
        "One correctly ordered document",
        "One command",
      ],
    },
    problem:
      "Airport briefing documents come out of the SelfBrief platform watermarked, in inconsistent page geometries, and split across separate files. Before every flight someone was assembling and cleaning that by hand.",
    approach:
      "A Python pipeline over PyMuPDF: strip the watermark layer, normalise every page to A4 regardless of source geometry, then merge cover, briefing body and disclaimer into one correctly ordered document.",
    hardPart:
      "The watermarks are not a flat image you can delete. They are drawn into the page content stream, interleaved with the text that has to survive. Removing them means operating on the page draw operations without touching legible content — then re-normalising geometry so nothing shifts or crops when pages of different sizes are forced to A4.",
    result:
      "A manual, error-prone pre-flight chore reduced to one command. The same approach is the basis of my document-automation service package.",
    whyItMatters:
      "It replaces a recurring manual task that had to be done correctly, before every flight, by someone with better things to do. That is the shape of automation worth paying for.",
    links: {},
    images: [],
    featured: true,
    hasCaseStudy: true,
    privateRepo: true,
  },
  {
    slug: "bankidz",
    title: "BankiDZ",
    tagline: "Loan comparison and matching for the Algerian banking market.",
    role: "Sole developer",
    year: "Ongoing",
    status: "active",
    tags: ["Web"],
    stack: [],
    valueProp: "Loan comparison and matching for the Algerian banking market.",
    problem:
      "Algerian borrowers compare loan products by visiting branches and reading PDFs. Rate, duration and eligibility — the three things that decide the answer — are never in one comparable place.",
    approach:
      "A guided matcher: the borrower describes what they need and what they earn, and the app narrows it to the loan products they would actually qualify for.",
    hardPart: "",
    result: "",
    links: {},
    images: [],
    featured: true,
    hasCaseStudy: false,
    privateRepo: true,
  },
  {
    slug: "livreurpro",
    title: "LivreurPro",
    tagline: "Route-optimisation PWA for delivery riders — built by someone who did the job.",
    role: "Sole developer",
    year: "Ongoing",
    status: "active",
    tags: ["Web", "Mobile"],
    stack: ["PWA"],
    valueProp: "Route-optimisation PWA for delivery riders.",
    architecture: {
      client: ["PWA — installable, no store gatekeeping"],
    },
    problem:
      "Delivery riders in Algiers plan a day of drops in their head and lose time doubling back across the city. I know the shape of that problem because I did electric-bike delivery here — it is obvious from the saddle and invisible from a spreadsheet.",
    approach:
      "A PWA rather than a store app: installable, works on the cheap Android phones riders actually carry, no store gatekeeping and no install friction for a workforce that turns over. It sequences a day of drops into a route that stops the backtracking.",
    hardPart: "",
    result: "",
    links: {},
    images: [],
    featured: true,
    hasCaseStudy: false,
    privateRepo: true,
  },
];

/** Small strip at the bottom of /projects. Kept tiny on purpose. */
export const funProjects: { name: string; note: string; url?: string }[] = [
  { name: "wordle-solver", note: "Constraint solver. Algorithms flex." },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const caseStudies = projects.filter((p) => p.hasCaseStudy);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export const about = {
  lead: "Full-stack and mobile developer in Algiers. I build production software end to end.",
  body: [
    "I write Flutter and Dart for mobile, React and TypeScript for web, and Python when a problem turns out to be a pipeline wearing a UI. The backend is usually Supabase — Postgres with row-level security, because permissions belong on the server.",
    "The work I care most about is Briefing Point Go, an Electronic Flight Bag used by Air Algérie crew. Aviation is a hard teacher. Tolerance for \u201cit mostly works\u201d is zero, the data sources are hostile, and the person using your app is flying a plane at the same time.",
    "It has also been rewritten twice — React Native, then React + Capacitor, then Flutter. I mention that because migrations are where architectural judgement actually shows. Choosing a stack is easy. Knowing when the one you chose has stopped paying for itself is not.",
    "Outside the aviation work I have shipped a consumer exam-prep platform with its own payment gating and content pipeline, a loan-matching app for Algerian banking, and a route-optimisation PWA for delivery riders — that last one because I did electric-bike delivery in Algiers and knew exactly where the time went.",
    "I work in English, French and Arabic, remotely, from GMT+1. I am a registered auto-entrepreneur through ANAE, which means I can invoice international clients and receive foreign payments legally. No workarounds, no awkward conversation at the end of the project.",
  ],
  facts: [
    { label: "Based", value: "Algiers, Algeria — GMT+1, remote" },
    { label: "Languages", value: "English, French, Arabic" },
    { label: "Status", value: "Registered auto-entrepreneur (ANAE) — invoices internationally" },
    { label: "Primary stack", value: "Flutter · React · Supabase · Python" },
  ],
};

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export const faq: { q: string; a: string }[] = [
  {
    q: "Can I see the source code?",
    a: "Not the repos \u2014 they hold live user data. I will walk you through the architecture and the code on a call, or set up scoped read-only access.",
  },
  {
    q: "Do you work with clients outside Algeria?",
    a: "Most of my work is. I am on GMT+1, so a full day overlaps with Europe and the morning with North America.",
  },
  {
    q: "Can you invoice my company?",
    a: "Yes. Registered auto-entrepreneur through ANAE, so international invoices and foreign payments are all above board.",
  },
  {
    q: "Which languages can we work in?",
    a: "English, French or Arabic \u2014 including specs, commit messages and handover docs, not just the calls.",
  },
  {
    q: "How do you price?",
    a: "Fixed scope, fixed price, agreed before anything starts. Tell me what you need and I will come back with a number.",
  },
  {
    q: "How long does it take?",
    a: "A mobile app with a backend and dashboard: 4\u20138 weeks to first release. A backend on its own: 2\u20135 weeks. An automation: 1\u20133 weeks.",
  },
  {
    q: "What do I get at the end?",
    a: "Signed builds, the backend and its schema, an admin dashboard your team runs, and documentation in English or French.",
  },
];


/* -------------------------------------------------------------------------- */
/* Private source                                                              */
/* -------------------------------------------------------------------------- */

/**
 * The repositories are private — production apps with real user data, crew
 * rosters and payment flows. Stated plainly and once, framed as the deliberate
 * position it is, with a route to a live walkthrough so it ends in a
 * conversation rather than a dead end.
 */
export const privateSource = {
  short: "Private repo",
  label: "Private production repo",
  cta: "Request a walkthrough",
  /** One line, stated as policy rather than as an apology. */
  notice:
    "Source code is private where projects handle real user data. Architecture walkthroughs and scoped read-only access are available for serious enquiries.",
  reason:
    "These are live products handling real user data — crew rosters, student records, payments — so the source stays private. I will happily walk you through the architecture, the code and the decisions on a call, or share a scoped read-only repo for a serious enquiry.",
};

/* -------------------------------------------------------------------------- */
/* Architecture                                                                */
/* -------------------------------------------------------------------------- */

/**
 * The layers a product passes through, top to bottom.
 *
 * This is the spine of the "How I build" diagram on /projects. Selecting a
 * project fills the layers it genuinely has and dims the ones it does not —
 * which is why the PDF pipeline lights up exactly one. A diagram where every
 * project fills every layer would be decoration; this one is a claim.
 */
export const architectureLayers: { id: ArchLayerId; label: string; role: string }[] = [
  { id: "client", label: "Mobile / Web", role: "What the user actually touches" },
  { id: "logic", label: "Application logic", role: "State, rules and the flows between them" },
  { id: "api", label: "API / Auth", role: "The boundary, and who is allowed through it" },
  { id: "data", label: "Database", role: "The schema everything else depends on" },
  { id: "integrations", label: "Integrations", role: "Third-party data and payment rails" },
  { id: "automation", label: "Automation", role: "The work nobody should be doing by hand" },
  { id: "deploy", label: "Deployment", role: "How it reaches a real device" },
];

export const architectureIntro = {
  title: "How I build",
  lead: "I don't just build interfaces. I design the systems behind them.",
  body: "Pick a project to see the layers it actually has. Not every product needs all seven — a document pipeline is one layer deep and an Electronic Flight Bag is all of them, and pretending otherwise would make this a decoration rather than a description.",
};

/* -------------------------------------------------------------------------- */
/* Projects page                                                               */
/* -------------------------------------------------------------------------- */

export const workPage = {
  eyebrow: "Selected work",
  title: "Software I've built, shipped and learned from.",
  lead: "A selection of production applications, internal tools and automation systems across aviation, education, commerce and logistics.",
};

/**
 * The proof line under the page title. Every figure is read back out of the
 * project data, so it cannot drift from what the case studies say — and if a
 * metric is ever removed, the line shrinks instead of lying.
 */
export const workProof: string[] = [
  `${projects.filter((p) => p.status === "production").length} production applications`,
  ...(() => {
    const tools = getProject("briefing-point-go")?.metrics?.find((m) =>
      m.label.startsWith("Reference")
    )?.value;
    return tools ? [`${tools} aviation tools`] : [];
  })(),
  ...(() => {
    const pdfs = getProject("bac-archive")?.metrics?.find((m) => m.label === "PDFs served")?.value;
    return pdfs ? [`${pdfs} offline PDFs`] : [];
  })(),
];

/* -------------------------------------------------------------------------- */
/* Engineering practice                                                        */
/* -------------------------------------------------------------------------- */

/**
 * There is no contribution graph on this site on purpose. The work that would
 * fill one lives in private repositories, and a sparse public graph would say
 * something false about how much gets shipped. These are the practices instead
 * — each one is a thing a client can ask me to demonstrate on a call.
 */
export const engineering = {
  title: "How the code is actually written",
  body: "The repositories are private because they are live products holding real user data. What I can do is show you the inside of one.",
  practices: [
    {
      title: "Server-enforced permissions",
      body: "Row-level security policies in Postgres, not a hidden button in the client. If the request should be refused, it is refused by the database.",
    },
    {
      title: "Offline as a design constraint",
      body: "Local-first data and cached assets where the product is used somewhere with no signal — a cockpit, a classroom, a warehouse.",
    },
    {
      title: "Release engineering",
      body: "Signed builds, ProGuard rules, screenshot blocking on sensitive screens, and a pipeline that can ship the next version without me remembering a manual step.",
    },
    {
      title: "Written for the next developer",
      body: "Typed boundaries, small commits against reviewable milestones, and handover documentation in English or French so the project outlives the engagement.",
    },
  ],
  /** What is genuinely public, stated plainly rather than padded out. */
  openSource: "This portfolio is the public repository — the 3D keyboard, the audio synthesis and the whole site.",
};

export const contactCopy = {
  title: "Have a product to build?",
  body: "Tell me what you're building, what's currently broken, or what you want to automate. I come back with an approach, a timeline and a price — or tell you honestly that I am not the right person for it.",
  cta: "Start a conversation",
  responseTime: "I reply within one working day.",
};

/* -------------------------------------------------------------------------- */
/* Content checklist — dev-only overlay, never rendered in production.          */
/* -------------------------------------------------------------------------- */

export type ChecklistItem = { area: string; item: string; where: string };

export const CONTENT_CHECKLIST: ChecklistItem[] = [
  {
    area: "Projects",
    item: "GitHub shows only ONE public repo on this account (the profile README). Every project repo is private or elsewhere, so all repo links were removed rather than ship 404s. Make them public and add the URL back to links.repo.",
    where: "projects[].links.repo",
  },
  { area: "Contact", item: "Professional email address", where: "profile.email" },
  { area: "Contact", item: "Calendly / booking link", where: "profile.calendly" },
  { area: "Contact", item: "LinkedIn, Upwork and Fiverr URLs", where: "socials[]" },
  {
    area: "Contact",
    item: "Custom domain — a name-based domain beats *.vercel.app for client trust",
    where: "NEXT_PUBLIC_SITE_URL",
  },
  { area: "CV", item: "CV PDF in English and French, into /public/assets/cv/", where: "profile.cv" },
  {
    area: "Brand",
    item: "Professional photo or consistent avatar, into /public/assets/me.jpg",
    where: "public/assets",
  },
  {
    area: "Projects",
    item: "Screenshots for every featured project — sanitise all real crew/flight/user data first",
    where: "projects[].images",
  },
  {
    area: "Projects",
    item: "moto-pilot — still undescribed. (amadeus-api and ofp-api are now documented as the two FastAPI services behind Briefing Point Go.)",
    where: "projects[briefing-point-go]",
  },
  {
    area: "Projects",
    item: "Decide on healthdeep-pulse-dive, galaxy-pulse-pro, qahwa-books. (subhub is now featured as TechSub.)",
    where: "projects[]",
  },
  { area: "Projects", item: "BankiDZ — confirm stack and status", where: "projects[bankidz].stack" },
  { area: "Projects", item: "LivreurPro — repo name and full stack", where: "projects[livreurpro]" },
  {
    area: "Projects",
    item: "Confirm which repos can be public — every linked repo needs a real README with screenshots",
    where: "projects[].links.repo",
  },
  {
    area: "Projects",
    item: "aero-swift-guide (PatrickDine) — only list it if you actually contributed",
    where: "projects[]",
  },
  {
    area: "Metrics",
    item: "Real numbers still missing for BankiDZ and LivreurPro. (Briefing Point Go, TechSub and BAC Archive now carry real metrics from their READMEs.)",
    where: "projects[].metrics",
  },
  {
    area: "Services",
    item: "Price bands for the three packages — show ranges, not exact rates",
    where: "services[].priceBand",
  },
  {
    area: "SEO",
    item: "Optional: a hand-designed OG card to replace the generated one",
    where: "src/app/opengraph-image.tsx",
  },
  {
    area: "Deploy",
    item: "RESEND_API_KEY plus a verified sending domain for the contact form",
    where: ".env",
  },
];
