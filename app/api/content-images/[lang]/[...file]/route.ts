import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string; file: string[] } }
) {
  try {
    const { lang, file } = params;
    
    // Bezpečnostní kontrola parametrů
    if (!['cs', 'sk', 'de', 'en'].includes(lang)) {
      return new NextResponse('Invalid language', { status: 400 });
    }
    
    // Sestavení cesty k souboru
    const filename = Array.isArray(file) ? file.join('/') : file;
    const filePath = path.join(process.cwd(), 'content', 'images', lang, filename);
    
    // Zabránění path traversal útokům
    const resolvedPath = path.resolve(filePath);
    const contentImagesPath = path.resolve(path.join(process.cwd(), 'content', 'images'));
    
    if (!resolvedPath.startsWith(contentImagesPath)) {
      console.error(`Path traversal attempt detected: ${filePath}`);
      return new NextResponse('Invalid file path', { status: 400 });
    }
    
    // Kontrola existence souboru
    if (!fs.existsSync(filePath)) {
      console.error(`Image not found at path: ${filePath}`);
      
      // Fallback na placeholder
      const placeholderPath = path.join(process.cwd(), 'public', 'images', 'placeholder.jpg');
      
      if (fs.existsSync(placeholderPath)) {
        const placeholderData = fs.readFileSync(placeholderPath);
        return new NextResponse(placeholderData, {
          status: 200,
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
      
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Načtení souboru
    const data = fs.readFileSync(filePath);
    
    // Určení MIME typu podle přípony souboru
    let contentType = 'image/jpeg'; // Výchozí
    if (filename.endsWith('.png')) {
      contentType = 'image/png';
    } else if (filename.endsWith('.gif')) {
      contentType = 'image/gif';
    } else if (filename.endsWith('.webp')) {
      contentType = 'image/webp';
    } else if (filename.endsWith('.svg')) {
      contentType = 'image/svg+xml';
    }
    
    // Vrácení obrázku s příslušnými hlavičkami
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache na 24 hodin
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Error serving image', { status: 500 });
  }
} 