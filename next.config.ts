import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/v5", destination: "/", permanent: true },
      { source: "/v4", destination: "/", permanent: true },
      { source: "/v4/conocenos", destination: "/conocenos", permanent: true },
    ];
  },
};

export default nextConfig;
