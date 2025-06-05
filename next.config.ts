import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_IS_DOCKER: process.env.NEXT_PUBLIC_IS_DOCKER,
    NEXT_PUBLIC_API_LOCAL: process.env.NEXT_PUBLIC_API_LOCAL,
    NEXT_PUBLIC_API_DOCKER: process.env.NEXT_PUBLIC_API_DOCKER,
  },
};

export default nextConfig;
