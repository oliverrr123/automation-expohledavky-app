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
  
  // Image configuration - completely disable image optimization
  images: {
    unoptimized: true,
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
    return [
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
    ];
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
};

module.exports = nextConfig; 