import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/dosxm2",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
