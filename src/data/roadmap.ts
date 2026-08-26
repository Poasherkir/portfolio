/* ---------------------------------------------------------------------------
 * STACK
 *
 * Two tiers, both meaning "I work with this":
 *   shipping — the daily stack, what I reach for first.
 *   working  — used and comfortable in.
 * ------------------------------------------------------------------------- */

export type SkillLevel = "shipping" | "working" | "roadmap";

export type SkillItem = { name: string; level: SkillLevel; note?: string };

export type SkillArea = {
  id: string;
  title: string;
  blurb: string;
  items: SkillItem[];
};

export const LEVEL_LABEL: Record<SkillLevel, string> = {
  shipping: "Core stack",
  working: "Experienced",
  roadmap: "Experienced",
};

export const LEVEL_BLURB: Record<SkillLevel, string> = {
  shipping: "What I reach for first, and use daily.",
  working: "Worked with and comfortable in.",
  roadmap: "Worked with and comfortable in.",
};

export const languagePriority: {
  language: string;
  stars: number;
  why: string;
  level: SkillLevel;
}[] = [
  { language: "JavaScript", stars: 5, why: "Frontend and backend", level: "shipping" },
  { language: "TypeScript", stars: 5, why: "Professional modern web development", level: "shipping" },
  { language: "SQL", stars: 5, why: "Databases", level: "shipping" },
  { language: "Java", stars: 4, why: "Enterprise and backend", level: "working" },
  { language: "Python", stars: 3, why: "Automation, APIs, AI and data", level: "shipping" },
  { language: "C / C++", stars: 3, why: "CS fundamentals", level: "working" },
  { language: "C#", stars: 2, why: ".NET ecosystem", level: "working" },
  { language: "Go", stars: 2, why: "Modern backend and cloud", level: "working" },
  { language: "Rust", stars: 1, why: "Advanced systems and backend", level: "working" },
  { language: "PHP", stars: 1, why: "Specific web work", level: "shipping" },
  { language: "Kotlin", stars: 1, why: "Android and backend", level: "working" },
  { language: "Swift", stars: 1, why: "iOS", level: "working" },
];

export const skillAreas: SkillArea[] = [
  {
    id: "core",
    title: "Core programming",
    blurb: "The non-negotiables. Everything else assumes these.",
    items: [
      { name: "HTML5", level: "shipping" },
      { name: "CSS3", level: "shipping" },
      { name: "JavaScript", level: "shipping" },
      { name: "TypeScript", level: "shipping" },
      { name: "SQL", level: "shipping" },
      { name: "Git", level: "shipping" },
      { name: "GitHub", level: "shipping" },
      { name: "HTTP / REST APIs", level: "shipping" },
      { name: "JSON", level: "shipping" },
      { name: "Data structures & algorithms", level: "shipping", note: "interview-grade, plus solvers" },
      { name: "Debugging", level: "shipping" },
      { name: "Authentication & authorization", level: "shipping", note: "Supabase auth + RLS" },
      { name: "Linux / terminal", level: "working" },
      { name: "Basic networking", level: "working" },
      { name: "Testing", level: "working" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Figma or a rough idea, to a responsive production application.",
    items: [
      { name: "Semantic HTML", level: "shipping" },
      { name: "Flexbox", level: "shipping" },
      { name: "CSS Grid", level: "shipping" },
      { name: "Responsive design", level: "shipping" },
      { name: "Forms", level: "shipping" },
      { name: "DOM", level: "shipping" },
      { name: "ES6+", level: "shipping" },
      { name: "Promises / async-await", level: "shipping" },
      { name: "Fetch API", level: "shipping" },
      { name: "Modules", level: "shipping" },
      { name: "React", level: "shipping" },
      { name: "Next.js", level: "shipping", note: "this site" },
      { name: "Tailwind CSS", level: "shipping", note: "this site" },
      { name: "Component architecture", level: "shipping" },
      { name: "Error handling", level: "shipping" },
      { name: "Accessibility", level: "working" },
      { name: "Performance optimisation", level: "working" },
      { name: "React Router", level: "working" },
      { name: "TanStack Query", level: "working" },
      { name: "Zustand / Redux Toolkit", level: "working" },
      { name: "Form validation libraries", level: "working", note: "zod on this site" },
      { name: "Frontend testing", level: "working" },
    ],
  },
  {
    id: "mobile",
    title: "Mobile",
    blurb: "Not on the source list, but it is the strongest thing here.",
    items: [
      { name: "Flutter", level: "shipping", note: "primary" },
      { name: "Dart", level: "shipping" },
      { name: "go_router", level: "shipping" },
      { name: "Custom state layer", level: "shipping", note: "ChangeNotifier + InheritedWidget" },
      { name: "React Native", level: "shipping" },
      { name: "Capacitor", level: "shipping" },
      { name: "PWA", level: "shipping" },
      { name: "Android release engineering", level: "shipping", note: "signing, ProGuard, FLAG_SECURE" },
      { name: "jadx", level: "shipping", note: "APK recovery" },
      { name: "Kotlin", level: "working" },
      { name: "Swift", level: "working" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "Postgres-first today; a second ecosystem is the next deliberate step.",
    items: [
      { name: "Supabase", level: "shipping", note: "Postgres, Auth, Storage, RLS, Edge Functions" },
      { name: "REST API design", level: "shipping" },
      { name: "PHP", level: "shipping" },
      { name: "Python", level: "shipping", note: "pipelines, scraping, automation" },
      { name: "Playwright", level: "shipping", note: "server-side authenticated scraping" },
      { name: "JWT", level: "working" },
      { name: "Cookies & sessions", level: "working" },
      { name: "File uploads", level: "working" },
      { name: "Logging", level: "working" },
      { name: "Rate limiting", level: "working", note: "on this site's contact route" },
      { name: "Node.js", level: "working" },
      { name: "Express", level: "working" },
      { name: "NestJS", level: "working" },
      { name: "Java", level: "working" },
      { name: "Spring Boot", level: "working" },
      { name: "Spring Security", level: "working" },
      { name: "JPA / Hibernate", level: "working" },
      { name: "Maven", level: "working" },
      { name: "OAuth", level: "working" },
      { name: "WebSockets", level: "working" },
      { name: "Background jobs & queues", level: "working" },
      { name: "Email systems", level: "working" },
      { name: "Caching", level: "working" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    blurb: "The part most portfolios skip and most real work depends on.",
    items: [
      { name: "PostgreSQL", level: "shipping" },
      { name: "MySQL", level: "shipping" },
      { name: "Oracle SQL", level: "shipping" },
      { name: "SELECT / INSERT / UPDATE / DELETE", level: "shipping" },
      { name: "JOIN", level: "shipping" },
      { name: "GROUP BY / HAVING", level: "shipping" },
      { name: "Subqueries", level: "shipping" },
      { name: "Constraints", level: "shipping" },
      { name: "Normalisation", level: "shipping" },
      { name: "Transactions", level: "shipping" },
      { name: "Indexes", level: "working" },
      { name: "CTEs", level: "working" },
      { name: "Window functions", level: "working" },
      { name: "Query optimisation", level: "working" },
      { name: "Redis", level: "working" },
      { name: "MongoDB", level: "working" },
    ],
  },
  {
    id: "devops",
    title: "DevOps",
    blurb: "Where a beginner portfolio and a professional one visibly diverge.",
    items: [
      { name: "Bash", level: "working" },
      { name: "SSH", level: "working" },
      { name: "Environment variables", level: "working" },
      { name: "Permissions & processes", level: "working" },
      { name: "Logs", level: "working" },
      { name: "Vercel deployment", level: "shipping" },
      { name: "Docker", level: "working" },
      { name: "Docker Compose", level: "working" },
      { name: "GitHub Actions", level: "working" },
      { name: "CI/CD pipelines", level: "working" },
      { name: "AWS EC2", level: "working" },
      { name: "AWS S3", level: "working" },
      { name: "AWS RDS", level: "working" },
      { name: "AWS IAM", level: "working" },
      { name: "CloudFront", level: "working" },
      { name: "Route 53", level: "working" },
      { name: "VPC basics", level: "working" },
      { name: "CloudWatch", level: "working" },
    ],
  },
  {
    id: "security",
    title: "Security",
    blurb: "Not a login page — understanding why the login is safe.",
    items: [
      { name: "HTTPS", level: "shipping" },
      { name: "Row-level security", level: "shipping", note: "server decides, never the client" },
      { name: "Encrypted credential storage", level: "shipping", note: "Briefing Point Go" },
      { name: "FLAG_SECURE", level: "shipping" },
      { name: "Input validation", level: "shipping", note: "zod, server-side" },
      { name: "Rate limiting", level: "working" },
      { name: "SQL injection", level: "working" },
      { name: "XSS", level: "working" },
      { name: "CORS", level: "working" },
      { name: "Password hashing", level: "working", note: "bcrypt / Argon2" },
      { name: "JWT security", level: "working" },
      { name: "CSRF", level: "working" },
      { name: "Secrets management", level: "working" },
      { name: "OWASP Top 10", level: "working" },
    ],
  },
  {
    id: "testing",
    title: "Testing",
    blurb: "Honestly the biggest single gap, and the next thing being closed.",
    items: [
      { name: "Manual QA & debugging", level: "shipping" },
      { name: "Vitest / Jest", level: "working" },
      { name: "React Testing Library", level: "working" },
      { name: "Playwright E2E", level: "working", note: "used for scraping, not yet for tests" },
      { name: "Unit testing", level: "working" },
      { name: "Integration testing", level: "working" },
      { name: "API testing", level: "working" },
      { name: "Test databases", level: "working" },
      { name: "CI test pipeline", level: "working" },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    blurb: "A good modular monolith first. Microservices are not step one.",
    items: [
      { name: "Layered architecture", level: "shipping" },
      { name: "Service layer", level: "shipping" },
      { name: "MVC", level: "working" },
      { name: "SOLID", level: "working" },
      { name: "Dependency injection", level: "working" },
      { name: "DTOs", level: "working" },
      { name: "Repository pattern", level: "working" },
      { name: "Clean Architecture", level: "working" },
      { name: "Design patterns", level: "working" },
      { name: "Domain-driven design", level: "working" },
      { name: "Event-driven architecture", level: "working" },
      { name: "Message queues", level: "working" },
      { name: "Microservices", level: "working" },
    ],
  },
  {
    id: "apis",
    title: "APIs",
    blurb: "Integrating hostile third-party APIs is already the day job.",
    items: [
      { name: "REST", level: "shipping" },
      { name: "HTTP semantics", level: "shipping" },
      { name: "Third-party integration", level: "shipping", note: "METAR, ADS-B, payments" },
      { name: "API authentication", level: "shipping" },
      { name: "Pagination / filtering / sorting", level: "working" },
      { name: "Rate limiting", level: "working" },
      { name: "WebSockets", level: "working" },
      { name: "GraphQL", level: "working" },
      { name: "OpenAPI / Swagger", level: "working" },
      { name: "API versioning", level: "working" },
      { name: "API documentation", level: "working" },
    ],
  },
  {
    id: "ai",
    title: "AI engineering",
    blurb: "The newest column, and the one with the most headroom.",
    items: [
      { name: "LLM APIs", level: "working" },
      { name: "Prompt engineering", level: "working" },
      { name: "Structured outputs", level: "working" },
      { name: "Function / tool calling", level: "working" },
      { name: "Embeddings", level: "working" },
      { name: "Vector databases", level: "working", note: "pgvector" },
      { name: "RAG", level: "working" },
      { name: "AI agents", level: "working" },
      { name: "Streaming responses", level: "working" },
      { name: "AI evaluation", level: "working" },
      { name: "AI security", level: "working" },
      { name: "Cost optimisation", level: "working" },
    ],
  },
  {
    id: "workflow",
    title: "Git & workflow",
    blurb: "A workspace, not a folder of tutorials.",
    items: [
      { name: "Branches", level: "shipping" },
      { name: "Merge", level: "shipping" },
      { name: "Pull requests", level: "shipping" },
      { name: "Issues", level: "shipping" },
      { name: "README writing", level: "shipping" },
      { name: "Rebase", level: "working" },
      { name: "Tags & releases", level: "working" },
      { name: "Conventional commits", level: "working" },
      { name: "GitHub Actions", level: "working" },
      { name: "GitHub Projects", level: "working" },
    ],
  },
];

export const levelCounts = skillAreas
  .flatMap((a) => a.items)
  .reduce<Record<SkillLevel, number>>(
    (acc, item) => {
      acc[item.level] += 1;
      return acc;
    },
    { shipping: 0, working: 0, roadmap: 0 }
  );
