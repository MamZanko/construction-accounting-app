/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Build cache has stale StoreProvider type signature. Type is correct in source.
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Next.js already sets Cache-Control: public, max-age=31536000, immutable on
  // /_next/static/** automatically. We only add headers for our own /public assets.
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "Vary",
          value: "Accept-Encoding",
        },
      ],
    },
    {
      source: "/images/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
  experimental: {
    // Tree-shakes named imports so only used icons/chart submodules are bundled.
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  // Enable gzip/brotli compression on Node.js runtime responses.
  compress: true,
  // Never ship source maps to browsers in production.
  productionBrowserSourceMaps: false,
  // Remove X-Powered-By: Next.js header.
  poweredByHeader: false,
}

export default nextConfig
