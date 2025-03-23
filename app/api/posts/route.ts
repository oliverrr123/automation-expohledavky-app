import { getAllPosts, searchPosts } from '@/lib/posts';
import { NextRequest, NextResponse } from 'next/server';

// Helper function to safely log errors without exposing sensitive details in production
function logError(error: any, context: string) {
  // In development, log the full error
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error in ${context}:`, error);
  } else {
    // In production, log limited information
    console.error(`Error in ${context}. Type: ${error.name}, Message: ${error.message}`);
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let query = searchParams.get('query');
    
    // Validate and sanitize query parameter
    if (query) {
      // Remove potentially dangerous characters, limit length
      query = query
        .replace(/[^\w\s.,?!-]/g, '') // Only allow alphanumeric, spaces and basic punctuation
        .substring(0, 100); // Limit length to 100 characters
    }
    
    let posts;
    
    if (query) {
      posts = await searchPosts(query);
    } else {
      posts = await getAllPosts();
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    // Log error safely without exposing sensitive details
    logError(error, 'posts API');
    
    // Return a generic error message
    return NextResponse.json(
      { error: "Chyba při načítání článků" },
      { status: 500 }
    );
  }
} 