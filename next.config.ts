import type { NextConfig } from "next";

// GitHub Pages serves static files from /<repo>/, so that build exports to ./out under a base path.
// Every other build (local dev, Vercel) is unchanged.
const pagesBasePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  reactCompiler: true,
  ...(pagesBasePath !== undefined && {
    output: "export",
    basePath: pagesBasePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
