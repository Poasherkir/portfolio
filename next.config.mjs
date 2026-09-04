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
