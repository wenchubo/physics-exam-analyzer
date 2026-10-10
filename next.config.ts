import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/physics-exam-analyzer",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
