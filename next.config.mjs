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
  /**
   * Response headers.
   *
   * Vercel already sends HSTS. These are the rest of the set that costs
   * nothing to be right about. Deliberately no Content-Security-Policy: the
   * Spline runtime needs WebAssembly, workers and blob URLs, so a policy
   * written without testing against the live scene would not fail loudly — it
   * would silently leave a blank rectangle where the keyboard used to be.
   * That one wants a session with a working browser in front of it.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Stop a browser second-guessing a declared Content-Type. An asset
          // served as text and sniffed as script is the whole attack.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Nothing here is meant to be framed, so no one gets to overlay it.
          { key: "X-Frame-Options", value: "DENY" },
          // Send the full URL within the site, only the origin when leaving it,
          // and nothing at all when leaving it for plain http.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // None of these are used. Saying so means an embedded frame cannot
          // reach for them either.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },

  webpack: (config, { webpack }) => {
    // @splinetool/runtime ships a WebAssembly module, so the import has to be
    // allowed at all. `layers` is required alongside it by Next's own config.
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // The runtime then references its WASM boolean solver and a set of Draco
    // decoders by paths that are not present in the published package — it
    // fetches them at run time instead. Webpack still tries to resolve them
    // statically and fails the build, so those requests are ignored here. The
    // run-time fetches are untouched.
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /(boolean_wasm_bg|libs[\\/]draco)/,
      })
    );

    return config;
  },
};

export default nextConfig;
