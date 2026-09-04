/**
 * Exact skill name to its Devicon file in /public/assets/devicon.
 *
 * Keyed on the full name and never matched loosely. A prefix match looks
 * harmless and then puts Java's logo on JavaScript, Spring's on anything
 * beginning "spring", and React's on React Router — which has its own mark and
 * is not React.
 *
 * Only entries naming a product with a real logo appear here. Most of the
 * stack list is practice rather than product — debugging, data structures,
 * authorisation, release engineering — and those carry none, because there is
 * no such logo and inventing one would say something untrue.
 */
export const TECH_LOGOS: Record<string, string> = {
  "HTML5": "html5-original.svg",
  "CSS3": "css3-original.svg",
  "JavaScript": "javascript-original.svg",
  "TypeScript": "typescript-original.svg",
  "Git": "git-original.svg",
  "GitHub": "github-original.svg",
  "GitHub Actions": "github-original.svg",
  "GitHub Projects": "github-original.svg",
  "Linux / terminal": "linux-original.svg",
  "Bash": "bash-original.svg",
  "React": "react-original.svg",
  // React Native's own mark is the React atom, so this one is not a stand-in.
  "React Native": "react-original.svg",
  "Next.js": "nextjs-original.svg",
  "Tailwind CSS": "tailwindcss-original.svg",
  "Flutter": "flutter-original.svg",
  "Dart": "dart-original.svg",
  "Android release engineering": "android-original.svg",
  "Supabase": "supabase-original.svg",
  "PHP": "php-original.svg",
  "Python": "python-original.svg",
  "Node.js": "nodejs-original.svg",
  "Express": "express-original.svg",
  "NestJS": "nestjs-original.svg",
  "Java": "java-original.svg",
  "Spring Boot": "spring-original.svg",
  "Spring Security": "spring-original.svg",
  "PostgreSQL": "postgresql-original.svg",
  "MySQL": "mysql-original.svg",
  "Oracle SQL": "oracle-original.svg",
  "Redis": "redis-original.svg",
  "MongoDB": "mongodb-original.svg",
  "Docker": "docker-original.svg",
  "Docker Compose": "docker-original.svg",
  "GraphQL": "graphql-plain.svg",
};
