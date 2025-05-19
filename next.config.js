/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // If it's a server-side build, we can use node modules
    if (isServer) {
      return config;
    }

    // For client builds, return 'empty' modules for node-specific modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return config;
  },
  
  // Image configuration - enable image optimization
  images: {
    unoptimized: false,
    formats: ['image/webp'],
    domains: ['i.ibb.co', 'images.unsplash.com', 'source.unsplash.com'],
    // Accept all sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    // Allow dangerouslyAllowSVG for SVG images
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Configuration for content image access
  async rewrites() {
    return {
      afterFiles: [
        // Simple image path
        {
          source: '/images/:lang/:file',
          destination: '/api/content-images/:lang/:file',
        },
        // Path with date in filename
        {
          source: '/images/:lang/:year-:month-:day-:file',
          destination: '/api/content-images/:lang/:year-:month-:day-:file',
        },
        // Blog specific path
        {
          source: '/images/blog/:lang/:file*',
          destination: '/api/content-images/:lang/:file*',
        },
        // Fallback for all paths
        {
          source: '/images/:path*',
          destination: '/api/content-images/:path*',
        },
      ],
      fallback: [],
    };
  },
  
  // Disable strict mode for image optimization issues
  reactStrictMode: false,
  
  // Increase output tracing
  experimental: {
    outputFileTracingRoot: process.cwd(),
    outputFileTracingIncludes: {
      '/': ['content/**/*', 'public/**/*'],
    },
  },

  // Ignore build errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Config for dynamic routes
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Basic config
  poweredByHeader: false,
  swcMinify: true,
  
  // Specifically exclude problematic pages from static generation
  unstable_excludeDefaultDirectories: true,
  
  // Configure cache headers for static assets and API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' }
        ]
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=43200' }
        ]
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        source: '/favicon/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      }
    ];
  },
};

// Add environment variable to disable static optimization for problematic routes
process.env.NEXT_DISABLE_STATIC_OPTIMIZATION = 'true';

module.exports = nextConfig; 