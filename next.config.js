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
  
  // Add image domains configuration
  images: {
    domains: ['i.ibb.co', 'images.unsplash.com', 'source.unsplash.com'],
  },
};

module.exports = nextConfig; 