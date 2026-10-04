import type {
  ArchLayerId,
  Experience,
  NavLink,
  Project,
  Service,
  SkillGroup,
  SocialLink,
} from "@/types";

// All site copy. Optional values left as null are not rendered.

export const profile = {
  name: "Malik Boudine",
  handle: "Poasherkir",
  role: "Full-stack & mobile developer",
  location: "Algiers, Algeria",
  timezone: "GMT+1",
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
    "FastAPI developer",
    "Node.js developer",
    "school dismissal app",
    "duty roster software",
    "developpeur Flutter freelance",
  ],
  ogImage: "/assets/seo/og-image.png",
};

// Navigation

export const navLinks: NavLink[] = [
  { title: "Home", href: "/", description: "Start here" },
  { title: "Projects", href: "/projects", description: "Everything, filterable" },
  { title: "Stack", href: "/stack", description: "Everything I work with" },
  { title: "Services", href: "/#services", description: "What you can hire me for" },
  { title: "About", href: "/about", description: "Who I am and how I work" },
  { title: "Contact", href: "/contact", description: "Start a project" },
  { title: "CV", href: "/cv", description: "Printable résumé" },
];

export const socials: SocialLink[] = [
  { title: "GitHub", href: profile.github, handle: "@Poasherkir", icon: "github" },
];

// Hero + proof

export const hero = {
  eyebrow: "Full-stack · Mobile · Automation",
  displayLines: ["I build", "software", "that ships."],
  accentWord: "ships.",
  subhead:
    "Production apps, end to end. Flutter on mobile, React on web, Supabase and Python behind them — architecture through to the signed release.",
  /** Null hides the availability badge. */
  availability: "Available for selected freelance projects",
  primaryCta: { label: "View the work", href: "/projects" },
  secondaryCta: { label: "Start a project", href: "/contact" },
  pipeline: ["Interface", "Logic", "Data", "Automation", "Release"],
};

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
    body: "Signed release pipelines, encrypted credentials, live data feeds and real users, in aviation, education, healthcare and commerce.",
  },
  {
    id: "ownership",
    title: "End-to-end ownership",
    body: "Mobile app, backend schema, admin dashboard, deployment. I have shipped all four layers of the same product alone, so nothing gets thrown over a wall.",
  },
  {
    id: "integrations",
    title: "Hard integrations",
    body: "METAR weather and ADS-B tracking, authenticated roster scraping, PDF content-stream surgery, a constraint solver for hospital rosters, and a local payment gateway with no usable SDK.",
  },
  {
    id: "languages",
    title: "Trilingual delivery",
    body: "English, French and Arabic — specs, calls and handover docs. Clients in three markets, no translator in the loop.",
  },
];

// Skills

export const skillGroups: SkillGroup[] = [
  {
    title: "Mobile",
    blurb:
      "Flutter is the primary stack. Everything from architecture to a signed store build.",
    items: [
      { name: "Flutter / Dart", note: "primary", icons: ["flutter-original.svg", "dart-original.svg"] },
      { name: "go_router" },
      { name: "Custom state layer", note: "ChangeNotifier + InheritedWidget (AppScope)" },
      { name: "Design systems", note: "custom component libraries" },
      { name: "React Native", icons: ["react-original.svg"] },
      { name: "Capacitor" },
      { name: "Android release engineering", note: "APK signing, ProGuard, FLAG_SECURE", icons: ["android-original.svg"] },
      { name: "Encrypted credential storage" },
      { name: "APK reverse engineering", note: "jadx recovery" },
    ],
  },
  {
    title: "Frontend",
    blurb: "Client-facing web, plus the back-office nobody else wants to build.",
    items: [
      { name: "React", icons: ["react-original.svg"] },
      { name: "TypeScript / JavaScript", icons: ["typescript-original.svg", "javascript-original.svg"] },
      { name: "HTML / CSS", icons: ["html5-original.svg", "css3-original.svg"] },
      { name: "Admin dashboards", note: "CRUD, auth, role gating" },
      { name: "PWA development" },
    ],
  },
  {
    title: "Backend & data",
    blurb: "Postgres-first. Auth and permissions enforced on the server, never in the client.",
    items: [
      { name: "Supabase", note: "Postgres, Auth, Storage, RLS, Edge Functions", icons: ["supabase-original.svg", "postgresql-original.svg"] },
      { name: "PHP / MySQL", icons: ["php-original.svg", "mysql-original.svg"] },
      { name: "Python", note: "pipelines, scraping, automation", icons: ["python-original.svg"] },
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
        icons: ["python-original.svg"],
      },
      { name: "Aviation data", note: "METAR/TAF, ADS-B, crew rosters, OFP" },
      { name: "Algerian payment gating", note: "BaridiMob" },
      { name: "Gamification & quiz engines" },
    ],
  },
];

// Keycaps for the 3D keyboard in the background

export type SkillLevel = "shipping" | "working" | "roadmap";

export type Keycap = {
  id: string;
  /** File in /public/assets/devicon. */
  icon: string;
  label: string;
  description: string;
  level: SkillLevel;
  /** Brand colour, used as a tint on the cap. */
  color: string;
  /** Keyboard key that presses this cap. */
  key: string;
  usedIn?: string;
};

export const keycaps: Keycap[][] = [
  // Web core
  [
    { id: "html5", icon: "html5-plain.svg", label: "HTML5", level: "shipping", color: "#E34F26", key: "h", description: "Semantic markup, accessible by default." },
    { id: "css3", icon: "css3-plain.svg", label: "CSS3", level: "shipping", color: "#1572B6", key: "c", description: "Grid, flexbox and responsive layouts." },
    { id: "javascript", icon: "javascript-plain.svg", label: "JavaScript", level: "shipping", color: "#F7DF1E", key: "j", description: "The browser runtime under every web project." },
    { id: "typescript", icon: "typescript-plain.svg", label: "TypeScript", level: "shipping", color: "#3178C6", key: "t", description: "Types at the boundary, so a bad API response fails at build.", usedIn: "TechSub · GateFlow · this site" },
    { id: "react", icon: "react-original.svg", label: "React", level: "shipping", color: "#61DAFB", key: "r", description: "Client-facing web and every admin dashboard behind a product.", usedIn: "TechSub admin · GateFlow" },
    { id: "nextjs", icon: "nextjs-plain.svg", label: "Next.js", level: "shipping", color: "#9AA4B2", key: "n", description: "App Router and server components. This site runs on it.", usedIn: "TechSub storefront · DocRoster · this site" },
  ],
  // UI & mobile
  [
    { id: "tailwindcss", icon: "tailwindcss-original.svg", label: "Tailwind CSS", level: "shipping", color: "#38BDF8", key: "w", description: "Utility CSS with design tokens on top.", usedIn: "TechSub · GateFlow · DocRoster" },
    { id: "vitejs", icon: "vitejs-plain.svg", label: "Vite", level: "working", color: "#646CFF", key: "v", description: "Fast dev server and build for React work." },
    { id: "figma", icon: "figma-plain.svg", label: "Figma", level: "shipping", color: "#F24E1E", key: "f", description: "From a client's Figma file to built, signed screens." },
    { id: "flutter", icon: "flutter-plain.svg", label: "Flutter", level: "shipping", color: "#54C5F8", key: "1", description: "The primary stack. One codebase, Android and iOS, shipped signed.", usedIn: "Briefing Point Go · BAC Archive" },
    { id: "dart", icon: "dart-plain.svg", label: "Dart", level: "shipping", color: "#0175C2", key: "2", description: "Sound null safety, compiled ahead of time for release.", usedIn: "Briefing Point Go" },
    { id: "android", icon: "android-plain.svg", label: "Android", level: "shipping", color: "#3DDC84", key: "3", description: "APK signing, ProGuard, FLAG_SECURE, encrypted credential storage.", usedIn: "Briefing Point Go · BAC Archive · GateFlow" },
  ],
  // Data
  [
    { id: "supabase", icon: "supabase-plain.svg", label: "Supabase", level: "shipping", color: "#3ECF8E", key: "s", description: "Postgres, auth, storage and edge functions without a devops hire.", usedIn: "Briefing Point Go · BAC Archive" },
    { id: "postgresql", icon: "postgresql-plain.svg", label: "PostgreSQL", level: "shipping", color: "#4169E1", key: "g", description: "Schemas, constraints, row-level security and migrations.", usedIn: "DocRoster · TechSub · Supabase apps" },
    { id: "mysql", icon: "mysql-original.svg", label: "MySQL", level: "shipping", color: "#4479A1", key: "q", description: "Relational schema design and CRUD backends on PHP stacks." },
    { id: "oracle", icon: "oracle-original.svg", label: "Oracle SQL", level: "working", color: "#F80000", key: "o", description: "Relational modelling and query work. No shipped project on this one." },
    { id: "mongodb", icon: "mongodb-plain.svg", label: "MongoDB", level: "working", color: "#47A248", key: "m", description: "Postgres covers the work today." },
    { id: "prisma", icon: "prisma-original.svg", label: "Prisma", level: "shipping", color: "#2D3748", key: "e", description: "Typed schema and migrations behind the TechSub API.", usedIn: "TechSub API" },
  ],
  // Backend
  [
    { id: "python", icon: "python-plain.svg", label: "Python", level: "shipping", color: "#3776AB", key: "p", description: "Solvers, pipelines, scraping and API services.", usedIn: "DocRoster · PDF pipeline · BAC Archive importer" },
    { id: "php", icon: "php-plain.svg", label: "PHP", level: "shipping", color: "#777BB4", key: "u", description: "Features and maintenance on existing PHP and MySQL stacks.", usedIn: "Gestion de la Scolarité" },
    { id: "nodejs", icon: "nodejs-plain.svg", label: "Node.js", level: "shipping", color: "#5FA04E", key: "4", description: "Express and Socket.IO for realtime servers, NestJS for structured APIs.", usedIn: "GateFlow · TechSub API" },
    { id: "nestjs", icon: "nestjs-original.svg", label: "NestJS", level: "shipping", color: "#E0234E", key: "5", description: "Structured Node backend — the TechSub API runs on it.", usedIn: "TechSub API" },
    { id: "java", icon: "java-plain.svg", label: "Java", level: "working", color: "#E76F00", key: "7", description: "Native Android shells: WebView, notifications, foreground services.", usedIn: "GateFlow Android apps" },
    { id: "fastapi", icon: "fastapi-original.svg", label: "FastAPI", level: "shipping", color: "#009688", key: "8", description: "The DocRoster API and the services behind Briefing Point Go.", usedIn: "DocRoster · Briefing Point Go services" },
  ],
  // Tooling
  [
    { id: "git", icon: "git-plain.svg", label: "Git", level: "shipping", color: "#F03C2E", key: "a", description: "Small commits, milestone gates, a history you can read.", usedIn: "Every project" },
    { id: "github", icon: "github-original.svg", label: "GitHub", level: "shipping", color: "#9AA4B2", key: "y", description: "Issues, pull requests, Actions CI and releases.", usedIn: "Every project" },
    { id: "linux", icon: "linux-plain.svg", label: "Linux", level: "working", color: "#FCC624", key: "l", description: "Terminal, permissions, processes, logs." },
    { id: "docker", icon: "docker-plain.svg", label: "Docker", level: "working", color: "#2496ED", key: "d", description: "Compose stacks: API, worker, Postgres and a Caddy proxy.", usedIn: "DocRoster · GateFlow" },
    { id: "amazonwebservices", icon: "amazonwebservices-plain-wordmark.svg", label: "AWS", level: "working", color: "#FF9900", key: "0", description: "EC2, S3, RDS and IAM." },
    { id: "jest", icon: "jest-plain.svg", label: "Jest", level: "working", color: "#C21325", key: "J", description: "Unit, integration and snapshot testing for React work." },
  ],
];

export const keycapList = keycaps.flat();

// Experience

export const experience: Experience[] = [
  {
    id: 1,
    endDate: "Present",
    title: "Freelance full-stack & mobile developer",
    company: "Independent — registered auto-entrepreneur (ANAE)",
    description: [
      "Ships production Flutter apps end to end: mobile client, Supabase backend, React admin dashboard and a signed release pipeline — alone.",
      "Flagship work is Briefing Point Go, an Electronic Flight Bag in production with Air Algérie crew, integrating METAR weather, ADS-B tracking and authenticated crew roster data.",
      "Built GateFlow, a dismissal system for a school in Algiers with parent, guard, office and driver apps, and DocRoster, a solver-generated duty roster for hospital resident doctors.",
      "Invoices international clients and receives foreign payments legally.",
    ],
    skills: ["flutter", "dart", "supabase", "postgresql", "react", "python", "nodejs", "fastapi"],
  },
];

export const foundations =
  "Also comfortable in: Postgres tuning, relational modelling, REST integration, release engineering.";

// Capabilities

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
    proof: "BAC Archive · Briefing Point Go · GateFlow",
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
    proof: "TechSub · BAC Archive · GateFlow",
  },
  {
    id: "security",
    title: "Permissions enforced on the server",
    body: "Row-level security in Postgres and encrypted credential storage on device. If a request should be refused it is refused by the database, not by a hidden button.",
    proof: "Briefing Point Go · TechSub · DocRoster",
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

// Services

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
      "Handover documentation and a walkthrough",
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

// Delivery process

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
    body: "An admin dashboard your team operates, written documentation, and a walkthrough. The goal is that you do not need me on retainer.",
  },
];

// Projects

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
    screens: [
      {
        src: "/assets/projects/bpg-duty.webp",
        alt: "Briefing Point Go home screen showing no scheduled duty and a yearly cumulative cosmic radiation dose of 116.9 microsieverts",
        caption: "Duty status and cumulative radiation dose",
      },
      {
        src: "/assets/projects/bpg-roster.webp",
        alt: "Roster screen with Today, Classic, Monthly and Grid views, a check-in button, the next flight and rest minimums",
        caption: "Roster views, check-in and rest minimums",
      },
      {
        src: "/assets/projects/bpg-tools.webp",
        alt: "Tools screen listing flight calculation, time calculation, operations, airport data and logbook tool groups",
        caption: "Tools grouped by task",
      },
      {
        src: "/assets/projects/bpg-airports.webp",
        alt: "Airport lookup screen with a search field for ICAO, IATA or name and a list of recently viewed airports",
        caption: "Airport lookup by ICAO, IATA or name",
      },
      {
        src: "/assets/projects/bpg-settings.webp",
        alt: "Settings screen showing online status, credential storage and offline database sync state",
        caption: "Offline sync and credential storage",
      },
    ],
    problem:
      "A pilot assembles a duty day from a dozen disconnected sources: roster, operational flight plan, load and passenger figures, slot times and delays, weather, NOTAMs, radiation exposure. On a phone, in an airport, minutes before pushback. Anything not in one place does not get read.",
    approach:
      "One Flutter app, five tabs behind a go_router StatefulShellRoute.indexedStack — Home, Airports, Crew, Tools, Settings. State is plain ChangeNotifier controllers per feature, read through a top-level AppScope; no Provider, Riverpod or Bloc anywhere, so rebuild scope stays explicit and the dependency surface stays small. It speaks to the same Supabase backend and the same two internal FastAPI services (load figures and flight plans) as the existing web app, through the same nginx origin — the rebuild required no server changes at all.",
    hardPart:
      "Breadth and trust, at once. Roughly 70 reference and calculation tools sit behind one dashboard, and the data underneath is hostile: METAR/TAF, ADS-B, CTOT and delay feeds, cosmic radiation dose per sector. Operator credentials live in flutter_secure_storage, structured data caches to Hive so the app still works airside with no signal, and remote config can force an update or block a build outright when something ships wrong. Aviation is not a domain where “it mostly works” is a state you ship in.",
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
    slug: "gateflow",
    title: "GateFlow",
    tagline: "School dismissal for a school with one gate: parents queue from their phones and collect their children with a signed QR pass.",
    role: "Sole developer — Node.js server, React web app, four Android apps, in-browser demo",
    year: "2026",
    status: "active",
    tags: ["Web", "Mobile", "Backend"],
    stack: ["TypeScript", "React", "Node.js", "Express", "Socket.IO", "SQLite", "Leaflet", "Android"],
    valueProp: "A metered queue for school pickup: the guard calls each child, the parent comes forward only when the children are at the gate.",
    architecture: {
      client: ["React + Vite PWA", "Four Android WebView apps", "French, English, Arabic (RTL)"],
      logic: ["Server-side state machines", "Gate dispatcher and sibling batching", "Van round: nearest neighbour + 2-opt"],
      api: ["Express REST intents, idempotent by event id", "Socket.IO rooms", "Ed25519-signed passes"],
      data: ["SQLite (WAL)", "Append-only audit log", "Numbered migrations"],
      integrations: ["SMS: Twilio, Infobip or any HTTP gateway", "Web Push", "OSRM / Valhalla routing"],
      automation: ["Nightly backups, encrypted off-site copies", "Retention purge", "Load simulator"],
      deploy: ["Docker on Fly.io or Render", "Server-less demo on Vercel"],
    },
    screens: [
      {
        src: "/assets/projects/gateflow-pass.webp",
        alt: "Parent phone telling the parent to come to the gate now, with a QR pass that renews every 30 seconds, a six-digit fallback code and the four children waiting",
        caption: "Called to the gate with a signed, rotating pass",
      },
      {
        src: "/assets/projects/gateflow-queue.webp",
        alt: "Parent screen after check-in with a four-step tracker (arrived, children called, at the gate, handed over), position 1 of 1 in the queue and an estimated wait of one minute",
        caption: "Place in the queue and the expected wait",
      },
      {
        src: "/assets/projects/gateflow-queue-ar.webp",
        alt: "The same queue screen in Arabic, laid out right to left",
        caption: "The same screen in Arabic, right to left",
      },
      {
        src: "/assets/projects/gateflow-van.webp",
        alt: "Parent following the school van live on a street map of Algiers, with the driver, the vehicle, the way it has come and about three minutes to the family's stop",
        caption: "The school van, followed live to the family's stop",
      },
      {
        src: "/assets/projects/gateflow-rider.webp",
        alt: "Driver app showing the morning round on a map of Algiers with five numbered stops, and the three children to collect at the gate in the afternoon",
        caption: "The driver's round, stop by stop",
      },
    ],
    problem:
      "El Istikmal School in Algiers has one pedestrian gate, no parking and about 85 families leaving within ten minutes. Parents crowded the gate, the guard called names through a megaphone and children could not get out. Nobody recorded which adult had taken which child.",
    approach:
      "Parents tap “I'm here” on their phone and wait nearby instead of at the door. A dispatcher lets at most four families hold a place at the gate; when one frees up, the next family's children appear on the guard's tablet to be called, siblings from different classes together. The parent is called forward only once every child is at the gate, and shows a pass the guard scans to confirm the handover. One Node.js process is the source of truth: clients send REST intents, the engine validates each state transition inside a SQLite transaction, and Socket.IO pushes versioned updates to the parent, gate, office and driver screens.",
    hardPart:
      "The gate cannot stop when the network does. Passes are signed with Ed25519, change every 30 seconds and are bound to the family and the date, so the tablet verifies them with the public key alone and a stolen tablet cannot forge one. The tablet caches the roster, photos and salted hashes of pickup restrictions, keeps releasing children offline, and replays its outbox when the connection returns; replays are idempotent, and anything no longer legal is logged as a sync conflict. Custody restrictions are checked on every release path, online, offline and during an emergency.",
    result:
      "Ready for its pilot at El Istikmal School: parent, gate, office and driver screens in three languages, four Android apps, SMS and push notifications, emergency reunification and live tracking of the school van. A public demo runs the real server code in the browser on sql.js, so anyone can try it on their own devices.",
    whyItMatters:
      "Dismissal is the ten minutes a day when a school hands its children over to adults. A metered queue, a verified pass and an audit log turn a crowd at the gate into a record of who collected whom.",
    links: { live: "https://gateflow-demo.vercel.app" },
    images: [
      {
        src: "/assets/projects/gateflow-gate.webp",
        alt: "Guard tablet with children to call, the gate slots with three of four families present, families on their way with arrival times, and children who walk home alone",
      },
      {
        src: "/assets/projects/gateflow-simulation.webp",
        alt: "Office load simulation at 20× speed: 60 virtual parents, families at the gate held at the cap of four, the queue growing over time, and capacity never exceeded",
      },
      {
        src: "/assets/projects/gateflow-office.webp",
        alt: "Office live dashboard with the gate capacity control, families and pupils by state, average wait, time at the gate and throughput",
      },
    ],
    featured: true,
    hasCaseStudy: true,
    privateRepo: true,
    metrics: [
      { label: "Families per dismissal", value: "~85" },
      { label: "Android apps", value: "4" },
      { label: "REST routes", value: "180" },
    ],
  },
  {
    slug: "docroster",
    title: "DocRoster",
    tagline: "On-call rosters for hospital resident doctors, generated by a constraint solver and checked by one rules engine.",
    role: "Sole developer — FastAPI backend, CP-SAT solver, Next.js app, document generation",
    year: "2026",
    status: "active",
    tags: ["Web", "Backend", "Automation"],
    stack: ["Python", "FastAPI", "OR-Tools", "PostgreSQL", "Next.js", "TypeScript", "Docker"],
    valueProp: "Fair on-call rosters for hospital residents: a solver proposes, the department reviews, payroll receives signed documents.",
    architecture: {
      client: ["Next.js 16 + React 19 PWA", "Offline personal planning", "Android app (TWA)"],
      logic: ["One rules engine for solver, edits, swaps and transitions", "Roster state machine"],
      api: ["FastAPI, 77 operations", "Invitation-only accounts, argon2id", "Rotating refresh tokens, CSRF"],
      data: ["PostgreSQL 16, 28 tables", "Versioned rosters", "Append-only audit log"],
      integrations: ["SMTP e-mail", "iCalendar feed"],
      automation: ["OR-Tools CP-SAT solver", "Job queue worker (SKIP LOCKED)", "PDF and XLSX payroll documents"],
      deploy: ["Docker Compose + Caddy", "Next.js on Vercel", "GitHub Actions with Playwright"],
    },
    screens: [
      {
        src: "/assets/projects/docroster-home.webp",
        alt: "Resident home screen with the next night duty, tomorrow's post-call rest and seven duties this month against a target of 7.8",
        caption: "Next duty, rest days and the month's count",
      },
      {
        src: "/assets/projects/docroster-preferences.webp",
        alt: "November preference calendar with one day marked unavailable, two marked rather not and one wished for, and the submission deadline",
        caption: "Monthly preferences, one tap per state",
      },
      {
        src: "/assets/projects/docroster-planning.webp",
        alt: "Personal planning for November listing night duties, the post-call rest day after each, and a swap button on every duty",
        caption: "Personal planning, readable offline",
      },
      {
        src: "/assets/projects/docroster-swap.webp",
        alt: "Replacement request listing colleagues, all but one greyed out with the rule each would break, such as insufficient rest after a 24-hour duty",
        caption: "Swaps checked against the solver's own rules",
      },
      {
        src: "/assets/projects/docroster-grid-phone.webp",
        alt: "November department roster on a phone, validated, version 2, with the senior and junior on duty each day and the public holiday highlighted",
        caption: "The validated roster, version 2",
      },
    ],
    problem:
      "In an Algerian hospital department, the chief resident draws up the monthly on-call roster by hand and sends it to the administration, which pays the duty allowance from it. Totals, weekends and holidays end up uneven, rest rules get missed, and swaps agreed in the corridor never reach payroll.",
    approach:
      "Residents mark their availability for the month. The chief closes collection and the solver, OR-Tools CP-SAT, returns three distinct rosters (balanced, preference-first and fairness-first), each scored on fairness, preferences honoured and cost. The chief adjusts one in a grid, publishes it for review, then submits it to the administration, which validates it and downloads the official PDFs and payroll spreadsheet. Residents then swap duties among themselves, and every change after submission creates a new version flagged to the administration.",
    hardPart:
      "The hard constraints are never relaxed: exact coverage of every senior and junior slot, rest after each duty (three days after a 24-hour one), one duty per weekend block, absences and declared unavailability. They are defined once, in a pure Python rules engine that the solver, the manual editor, swap validation and every state transition all call. When no roster is possible the solver says why in French, for example “15/12: no senior available”. Fairness carries over from month to month against each doctor's fair share, so an uneven month is evened out by the next.",
    result:
      "The full cycle works from preferences to payroll, tested end to end on a demo department: four roles, 77 API operations over 28 tables, numbered PDF and XLSX documents carrying a data fingerprint, an installable app with offline planning and an Android package, and CI running backend, frontend and browser tests on every push.",
    whyItMatters:
      "The roster decides who sleeps, who works the holidays and what each resident is paid. A fair, rule-checked roster with a recorded history of every change settles the monthly disputes and gives payroll a document it can rely on.",
    links: {},
    images: [
      {
        src: "/assets/projects/docroster-grid.webp",
        alt: "Department duty grid for November 2026: four seniors and four juniors, night and 24-hour duties, post-call rest days, a public holiday, an absence, and each doctor's total against target",
      },
      {
        src: "/assets/projects/docroster-proposals.webp",
        alt: "Three solver proposals side by side, balanced, preferences and fairness, each optimal, with fairness indices, preferences honoured and computation time",
      },
      {
        src: "/assets/projects/docroster-rules.webp",
        alt: "Manual adjustment screen where replacing a doctor raises a blocking violation, insufficient rest after a 24-hour duty, before anything is saved",
      },
    ],
    featured: true,
    hasCaseStudy: true,
    privateRepo: true,
    metrics: [
      { label: "Solver proposals per month", value: "3" },
      { label: "API operations", value: "77" },
      { label: "Database tables", value: "28" },
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
    screens: [
      {
        src: "/assets/projects/bac-subjects.webp",
        alt: "BAC Archive home screen in Arabic, listing subjects with the number of years available for each",
        caption: "Browse by subject, 19 years each",
      },
      {
        src: "/assets/projects/bac-years.webp",
        alt: "Maths subject screen listing Baccalaureate years from 2026 down, each with paper and solution PDFs",
        caption: "Paper and solution per year",
      },
      {
        src: "/assets/projects/bac-viewer.webp",
        alt: "Built-in PDF viewer showing page one of a 2026 Baccalaureate maths paper",
        caption: "Built-in viewer, works offline",
      },
      {
        src: "/assets/projects/bac-theme.webp",
        alt: "Appearance sheet offering system, light and dark themes",
        caption: "System, light and dark",
      },
    ],
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
    links: { repo: "https://github.com/Poasherkir/bac-archive" },
    images: [],
    featured: true,
    hasCaseStudy: true,
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
      api: ["Session-based auth", "REST"],
      integrations: ["Airline dispatch portal"],
      automation: ["Scheduled fetch and parse"],
    },
    problem:
      "A pilot's operational flight plan — fuel, weights, route, alternates — lives in a dispatch portal with no API and no export. Reading it on a phone meant logging into a desktop web app and scrolling a PDF minutes before departure.",
    approach:
      "The edge function talks to the portal directly rather than driving a browser: locate the flight in the schedule, pull its plan document, extract the text and parse the operational figures out. It returns the parsed fields and the full text together, so the client can dig for the richer items itself.",
    hardPart:
      "Authentication. The portal hands back its session across a redirect, so the request has to be made without following it — follow the redirect and the credentials are simply gone, with no error explaining why. Earlier versions drove a headless browser on a plain-HTTP box, which the mobile client could not call at all: it runs in a WebView on a secure origin and refuses mixed content outright. Moving to an HTTPS edge function removed that whole class of failure.",
    result:
      "Five architectures ended at one that needs no server: a Deno isolate that answers in a few seconds. In production behind Briefing Point Go.",
    links: {},
    images: [],
    featured: false,
    hasCaseStudy: true,
    privateRepo: true,
    metrics: [
      { label: "Architectures before this one", value: "4" },
      { label: "Servers to maintain", value: "None" },
    ],
  },
  {
    slug: "amadeus-api",
    title: "Load Control API",
    tagline: "Live load-control figures from an airline operations platform, exposed to a mobile app.",
    role: "Sole developer — integration, session handling, backend",
    year: "2026",
    status: "production",
    tags: ["Backend", "Automation"],
    stack: ["Python", "FastAPI", "Session auth", "REST"],
    valueProp: "Passenger counts and loadsheets from a ground-operations portal, served to a mobile client.",
    architecture: {
      logic: ["Session lifecycle and token refresh"],
      api: ["Small serverless backend"],
      integrations: ["Airline operations platform"],
      automation: ["Automated document retrieval"],
    },
    problem:
      "Load control — boarding figures, weight and balance, the loadsheet sent at closeout — lives in a web application built for desktop ground agents. Crew who needed those numbers had no way to see them on a phone.",
    approach:
      "A small backend authenticates against the operations platform under an authorised account, keeps the session alive across its several token types, and re-exposes only the figures the app needs as a narrow JSON interface.",
    hardPart:
      "Session lifecycle. Authentication issues one kind of token, the application itself expects a second in the URL and a third as a cookie, and all of them expire on different schedules. Getting a single request to succeed is straightforward; keeping a session valid for hours without a browser holding it open is the actual work.",
    result:
      "Live passenger and load figures inside Briefing Point Go, alongside the flight plan data from the OFP service.",
    links: {},
    images: [],
    featured: false,
    hasCaseStudy: true,
    privateRepo: true,
  },
  {
    slug: "bac-dz",
    title: "Bac DZ",
    tagline: "Study companion for Algerian Baccalaureate students — curriculum, exams, planner and paid tiers.",
    role: "Sole developer — Flutter app, Supabase backend, React admin console",
    year: "2026",
    status: "production",
    tags: ["Mobile", "Backend", "Web"],
    stack: ["Flutter", "Dart", "Supabase", "PostgreSQL", "React", "TypeScript"],
    valueProp: "A full study platform for Algerian Bac students, with subscriptions and an admin console.",
    architecture: {
      client: ["Flutter", "Arabic RTL", "Runtime theming"],
      logic: ["Subscription gating", "Quiz scoring", "Spaced repetition"],
      data: ["Supabase Postgres", "Row-level security"],
      api: ["Supabase Auth"],
      integrations: ["Manual payment review"],
      automation: ["Remote maintenance, force-update and ban gates"],
    },
    screens: [
      {
        src: "/assets/projects/bacdz-home.webp",
        alt: "Bac DZ home screen in Arabic with a ring counting 270 days to the 2027 Baccalaureate session, tiles for rank, streak, XP and level, and three goals for the day each with a progress bar",
        caption: "Days to the exam session, and the day's goals",
      },
      {
        src: "/assets/projects/bacdz-papers.webp",
        alt: "Past paper browser asking the student to pick a stream, with cards for mathematics, experimental sciences, management and economics, technical mathematics, foreign languages, and literature and philosophy, above a notice that the device is offline and a saved copy is being shown",
        caption: "Past papers by stream, still readable from a saved copy offline",
      },
      {
        src: "/assets/projects/bacdz-tools.webp",
        alt: "Tools screen with a search field and tiles for a formula library, scientific calculator, Pomodoro timer, average calculator, error notebook and notes, a Pro exam simulation shown locked, and an academic section holding a grade predictor and a success probability calculator",
        caption: "The tools hub, with the Pro utilities gated in place",
      },
      {
        src: "/assets/projects/bacdz-settings.webp",
        alt: "Settings screen showing XP, level, streak and plan tiles above a profile card marked as the free tier, with rows for study preferences, notifications, appearance and focus settings",
        caption: "Account, plan tier and study preferences",
      },
      {
        src: "/assets/projects/bacdz-themes.webp",
        alt: "Colour theme picker rendered in light mode, showing ten themes as live preview cards including galaxy, night gold, midnight, pixel hero, turquoise, onyx, purple, emerald, mocha and crimson",
        caption: "Ten themes, each previewed as it will actually look",
      },
    ],
    problem:
      "Algerian Bac students juggle a curriculum, past papers, revision timing and their own morale across a dozen apps and group chats, on phones that are often offline and almost always Arabic-first.",
    approach:
      "One Flutter app over a Supabase backend: subjects broken into units and lessons, official past papers by filière, per-unit quizzes with scoring, a planner with a persistent Pomodoro timer, XP and badges, and offline downloads. Free and premium lessons are gated by subscription, and a separate React console handles content, users and payment review.",
    hardPart:
      "Shipping a paid product into a market with no usable card infrastructure. Subscriptions run on manual payment review with expiry handling, which means the app has to behave correctly for a user whose payment is pending, approved, rejected or lapsed — and keep working offline through all four. Remote maintenance, force-update and ban gates exist because a mistake reaches every student at once.",
    result:
      "In production, with a tools hub of more than thirty student utilities and a runtime-switchable theme set.",
    links: {},
    images: [],
    featured: true,
    hasCaseStudy: true,
    privateRepo: true,
    metrics: [
      { label: "Student tools", value: "30+" },
      { label: "Themes", value: "8" },
    ],
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
    featured: false,
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
    featured: false,
    hasCaseStudy: true,
    privateRepo: true,
  },
  {
    slug: "delivery-os",
    title: "Delivery OS",
    tagline: "Offline-first Android app for Algerian delivery drivers — built by someone who did the job.",
    role: "Sole developer",
    year: "Ongoing",
    status: "active",
    tags: ["Mobile"],
    stack: ["Flutter", "Dart", "Riverpod", "go_router", "Drift", "SQLCipher"],
    valueProp: "Offline Flutter app for delivery drivers: orders, customers and cash, reconciled to the dinar.",
    architecture: {
      client: ["Flutter, Android only", "Arabic, French, English — full RTL"],
      logic: ["Riverpod", "Pure-Dart domain layer", "Order state machine"],
      data: ["Drift over SQLite", "SQLCipher, key in the Android Keystore", "Outbox, written now, synced later"],
      deploy: ["CI: analyze, tests, 90% domain coverage gate, APK build"],
    },
    problem:
      "A driver in Algiers collects batches of parcels from several delivery companies each morning, plans the route in their head, and settles the cash with each agency at night. If the phone says 47,300 DA and the agency counts 47,250, the driver pays the difference. I did electric-bike delivery here, so I know where the time and the money leak.",
    approach:
      "Built for one person at a door, holding a parcel, often with no signal. Everything works offline: IDs are UUIDv7 generated on the phone, every write also lands in a local outbox, and the app makes no network call at all until the route milestone. Money is integer centimes end to end, and a payment rule produces exactly one rounded value per order, with every other amount derived by subtraction, so the day's totals add up to the dinar.",
    hardPart:
      "Data that has to be right with nobody around to fix it. The database is a list of households, their addresses and when they receive cash parcels, so it is encrypted with SQLCipher and no log line or exception ever carries a full phone number or coordinate. Phone numbers arrive pasted from WhatsApp with Arabic-Indic digits and invisible bidi marks, and are folded to one canonical form because they are the customer's identity key. Rules that cannot be made structural are enforced by guard tests, each proven by planting a real violation and watching it fail.",
    result:
      "In active development. Done: the encrypted database, Arabic, French and English with RTL, and customer and order entry. Batches are being built now; the money engine and the route optimiser come in later milestones.",
    links: { repo: "https://github.com/Poasherkir/delivery-os" },
    images: [],
    featured: false,
    hasCaseStudy: true,
    metrics: [
      { label: "Network calls", value: "None, by design" },
      { label: "Languages", value: "AR + FR + EN, full RTL" },
      { label: "Money", value: "Integer centimes" },
    ],
  },
];

export const funProjects: { name: string; note: string; url?: string }[] = [
  { name: "wordle-solver", note: "Constraint solver for Wordle guesses." },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const caseStudies = projects.filter((p) => p.hasCaseStudy);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

// About

export const about = {
  lead: "Full-stack and mobile developer in Algiers. I build production software end to end.",
  body: [
    "I write Flutter and Dart for mobile, React and TypeScript for web, and Python for automation and services. Backends are Supabase, or Postgres behind FastAPI or Node.js, with permissions enforced on the server.",
    "The work I care most about is Briefing Point Go, an Electronic Flight Bag used by Air Algérie crew. They read it minutes before departure, the data sources are unreliable, and \u201cit mostly works\u201d is not good enough.",
    "It has been rewritten twice, from React Native to React + Capacitor to Flutter. The Flutter rebuild reached parity with the web app without a single backend change.",
    "Outside aviation I have built GateFlow, a dismissal system for a school in Algiers; DocRoster, an on-call roster solver for hospital residents; a consumer exam-prep platform with its own payment gating; a loan-matching app for Algerian banking; and Delivery OS, an offline app for delivery drivers, because I did electric-bike delivery in Algiers and knew where the time went.",
    "I work in English, French and Arabic, remotely, from GMT+1. I am a registered auto-entrepreneur through ANAE, which means I can invoice international clients and receive foreign payments legally.",
  ],
  facts: [
    { label: "Based", value: "Algiers, Algeria — GMT+1, remote" },
    { label: "Languages", value: "English, French, Arabic" },
    { label: "Status", value: "Registered auto-entrepreneur (ANAE) — invoices internationally" },
    { label: "Primary stack", value: "Flutter · React · Supabase · Python · Node.js" },
  ],
};

// FAQ

export const faq: { q: string; a: string }[] = [
  {
    q: "Can I see the source code?",
    a: "Some of it. BAC Archive and Delivery OS are public on GitHub, and GateFlow has a public demo. Projects that hold real user data stay private; for those I can walk you through the architecture and the code on a call, or set up scoped read-only access.",
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
    a: "Signed builds, the backend and its schema, an admin dashboard your team runs, and the documentation to operate all three.",
  },
];

// Private source

export const privateSource = {
  short: "Private repo",
  label: "Private repository",
  cta: "Request a walkthrough",
  notice:
    "Source code is private where projects handle real user data. Architecture walkthroughs and scoped read-only access are available for serious enquiries.",
  reason:
    "Projects that hold real user data stay private: crew rosters, student and family records, hospital rosters, payments. For these I can walk you through the architecture and the code on a call, or arrange scoped read-only access.",
};

// Architecture

/** Layers of the "How I build" diagram, top to bottom. */
export const architectureLayers: { id: ArchLayerId; label: string; role: string }[] = [
  { id: "client", label: "Mobile / Web", role: "What the user touches" },
  { id: "logic", label: "Application logic", role: "State, rules and the flows between them" },
  { id: "api", label: "API / Auth", role: "The boundary, and who is allowed through it" },
  { id: "data", label: "Database", role: "The schema everything else depends on" },
  { id: "integrations", label: "Integrations", role: "Third-party data and payment rails" },
  { id: "automation", label: "Automation", role: "The work nobody should be doing by hand" },
  { id: "deploy", label: "Deployment", role: "How it reaches a real device" },
];

export const architectureIntro = {
  title: "How I build",
  lead: "Interfaces, and the systems behind them.",
  body: "Pick a project to see the layers it has. Not every product needs all seven: a document pipeline is one layer deep, while an Electronic Flight Bag or a school dismissal system uses every one.",
};

// Projects page

export const workPage = {
  eyebrow: "Selected work",
  title: "Software I've built, shipped and learned from.",
  lead: "Production applications, internal tools and automation systems across aviation, education, healthcare, commerce and logistics.",
};

/** Figures under the /projects title, read from the project data. */
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

// Engineering practice

export const engineering = {
  title: "How the code is written",
  body: "Projects that hold real user data stay private; the rest are on GitHub. For the private ones I can walk you through the code on a call.",
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
      body: "Typed boundaries, small commits against reviewable milestones, and handover documentation so the project outlives the engagement.",
    },
  ],
  openSource: "This portfolio is public too: the 3D keyboard, the audio synthesis and the whole site.",
};

export const contactCopy = {
  eyebrow: "Available for selected work",
  headline: "Have something worth building?",
  headlineAccent: "Let's ship it.",
  body:
    "Tell me what you are building, what is broken, or what you want automated. You get an approach, a timeline and a price — or an honest no if I am not the right person for it.",
  formTitle: "Start a conversation",
  cta: "Start a conversation",
  responseTime: "I reply within one working day.",
};
