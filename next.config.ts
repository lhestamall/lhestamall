import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow Server Actions when accessed via tunnel (ngrok) or localhost
      allowedOrigins: [
        "localhost:3000",
        "127.0.0.1:3000",
        "*.ngrok-free.app",
        "*.ngrok-free.dev",
        "*.ngrok.io",
      ],
    },
  },
};

export default nextConfig;
