import type { NextConfig } from "next";

/**
 * Next.js Production Configuration
 *
 * Optimized for:
 * - Docker standalone deployment
 * - DevSecOps pipelines
 * - Better performance
 * - Smaller build output
 */

const nextConfig: NextConfig = {
  /**
   * Standalone output
   * Required for Docker production images
   * Generates `.next/standalone`
   */
  output: "standalone",

  /**
   * React strict mode disabled (optional)
   * Enable if you want stricter development checks
   */
  reactStrictMode: false,

  /**
   * Ignore TypeScript build errors
   * Useful in CI/CD pipelines if type checks run separately
   */
  typescript: {
    ignoreBuildErrors: true,
  },

  /**
   * Production optimizations
   */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  /**
   * Enable gzip compression
   */
  compress: true,

  /**
   * Improve bundle size
   */
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;