import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/workout-tracker-live",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
