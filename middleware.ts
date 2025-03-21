import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Simply pass through all requests without rate limiting
  return NextResponse.next();
}

// Only run the middleware on API routes to maintain the same matching pattern
export const config = {
  matcher: [
    // Apply middleware to API routes only
    '/api/:path*',
  ],
}; 