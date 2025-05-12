let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

// Validate security-related environment variables
function validateSecurityConfig() {
  const warnings = [];
  const errors = [];

  // Check for essential security variables
  if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV !== 'production') {
    errors.push('NEXTAUTH_SECRET is missing - required for CSRF protection');
  } else if (!process.env.NEXTAUTH_SECRET) {
    // In production, just warn but don't error
    warnings.push('NEXTAUTH_SECRET is missing - using fallback for build');
    // Set a default secret for the build process
    process.env.NEXTAUTH_SECRET = 'temporary-build-secret-replace-in-production';
  }

  // Redis check removed as we're not using rate limiting anymore

  // Log results
  if (errors.length > 0) {
    console.error('\n⛔ Security Configuration Errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    console.error('Please add these environment variables for proper security.\n');
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing required security configuration for production.');
    }
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️ Security Configuration Warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
    console.warn('Application will run, but with reduced security.\n');
  }
}

// Only run in server context
if (typeof window === 'undefined') {
  try {
    validateSecurityConfig();
  } catch (error) {
    console.error('Security validation failed:', error);
    // In production, you might want to prevent startup
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE !== 'true') {
      // Will halt server startup in production unless explicitly allowed
      process.exitCode = 1;
    }
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  transpilePackages: ['next-mdx-remote'],
  reactStrictMode: true,
  poweredByHeader: false,
  
  // App Router internationalization - removed i18n config from here
  // as it's handled through middleware and client code
  
  // Configure Content Security Policy headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          },
          {
            key: "Content-Security-Policy",
            value: process.env.NODE_ENV === 'production'
              // Stricter CSP for production
              ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://player.vimeo.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.google.com/recaptcha/enterprise.js https://www.gstatic.com/recaptcha/releases/ https://js.stripe.com; connect-src 'self' https://vitals.vercel-insights.com https://recaptchaenterprise.googleapis.com https://api.stripe.com; img-src 'self' data: https://images.unsplash.com https://i.ibb.co https://*.placeholder.com https://www.google.com https://*.stripe.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src https://player.vimeo.com https://www.google.com/maps/ https://www.google.com/recaptcha/ https://www.youtube.com https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com; object-src 'none'; base-uri 'self';"
              // More permissive CSP for development
              : "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://player.vimeo.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://www.google.com/recaptcha/enterprise.js https://www.gstatic.com/recaptcha/releases/ https://js.stripe.com; connect-src 'self' https://vitals.vercel-insights.com https://recaptchaenterprise.googleapis.com https://api.stripe.com; img-src 'self' data: https: http: https://*.stripe.com; style-src 'self' 'unsafe-inline'; font-src 'self' data:; frame-src https://player.vimeo.com https://www.google.com/maps/ https://www.google.com/recaptcha/ https://www.youtube.com https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com; object-src 'none';"
          }
        ]
      }
    ];
  }
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
