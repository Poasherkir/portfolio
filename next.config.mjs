import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Stops Next from picking up a lockfile in a parent directory.
  outputFileTracingRoot: dir,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Vercel already sends HSTS. No CSP yet: the Spline runtime needs
  // WebAssembly, workers and blob URLs, and a wrong policy fails silently.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },

  webpack: (config, { webpack }) => {
    // @splinetool/runtime ships a WebAssembly module.
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // The runtime references its boolean solver and Draco decoders by paths
    // missing from the package and fetches them at run time; webpack would
    // otherwise fail trying to resolve them.
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /(boolean_wasm_bg|libs[\\/]draco)/,
      })
    );

    return config;
  },
};

export default nextConfig;
