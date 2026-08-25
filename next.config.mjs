import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the trace root to this project. Without it Next walks up and finds the
  // lockfile in the home directory, then warns on every build.
  outputFileTracingRoot: dir,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
