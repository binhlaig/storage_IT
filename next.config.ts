import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors:true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns:[
     {
      protocol: "https",
      hostname: "www.google.com",
     },
     {
      protocol: "https",
      hostname: "cloud.appwrite.io",
     }
    ]
  },
};

export default nextConfig;
