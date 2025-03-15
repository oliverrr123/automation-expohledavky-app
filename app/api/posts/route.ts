import { getAllPosts, searchPosts } from '@/lib/posts';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    
    let posts;
    
    if (query) {
      posts = await searchPosts(query);
    } else {
      posts = await getAllPosts();
    }
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Chyba při získávání článků:", error);
    return NextResponse.json(
      { error: "Chyba při načítání článků" },
      { status: 500 }
    );
  }
} 