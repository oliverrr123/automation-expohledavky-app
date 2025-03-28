import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Validní jazyky pro obrázky
const VALID_LANGUAGES = ['cs', 'sk', 'de', 'en'];

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string; file: string[] } }
) {
  try {
    const { lang, file } = params;
    
    console.log(`Požadavek na obrázek: lang=${lang}, file=${Array.isArray(file) ? file.join('/') : file}`);
    
    // Možné varianty cesty k souboru
    const possiblePaths = [];
    
    // Sestavení cesty k souboru
    const filename = Array.isArray(file) ? file.join('/') : file;
    
    // 1. Standardní cesta v content/images/{lang}/{file}
    if (VALID_LANGUAGES.includes(lang)) {
      const contentLangPath = path.join(process.cwd(), 'content', 'images', lang, filename);
      possiblePaths.push(contentLangPath);
      console.log(`Zkouším cestu: ${contentLangPath}`);
    }
    
    // 2. Cesta s datem v názvu souboru
    const dirMatch = /^(\d{4}-\d{2}-\d{2})-(.+)$/.exec(filename);
    if (dirMatch && VALID_LANGUAGES.includes(lang)) {
      const [_, date, name] = dirMatch;
      const dateContentPath = path.join(process.cwd(), 'content', 'images', lang, `${name}`);
      possiblePaths.push(dateContentPath);
      console.log(`Zkouším cestu s datem: ${dateContentPath}`);
    }
    
    // 3. Obecná cesta v content/images/{filename}
    const contentPath = path.join(process.cwd(), 'content', 'images', filename);
    possiblePaths.push(contentPath);
    console.log(`Zkouším obecnou content cestu: ${contentPath}`);
    
    // 4. Cesta v public/images/{lang}/{filename}
    if (VALID_LANGUAGES.includes(lang)) {
      const publicLangPath = path.join(process.cwd(), 'public', 'images', lang, filename);
      possiblePaths.push(publicLangPath);
      console.log(`Zkouším public language cestu: ${publicLangPath}`);
    }
    
    // 5. Obecná cesta v public/images/{filename}
    const publicPath = path.join(process.cwd(), 'public', 'images', filename);
    possiblePaths.push(publicPath);
    console.log(`Zkouším obecnou public cestu: ${publicPath}`);
    
    // 6. Starý formát pro blog
    if (VALID_LANGUAGES.includes(lang)) {
      const oldBlogPath = path.join(process.cwd(), 'public', 'images', 'blog', lang, filename);
      possiblePaths.push(oldBlogPath);
      console.log(`Zkouším starou blog cestu: ${oldBlogPath}`);
    }
    
    // 7. Cesta v content/images/blog/{lang}/{filename}
    if (VALID_LANGUAGES.includes(lang)) {
      const contentBlogPath = path.join(process.cwd(), 'content', 'images', 'blog', lang, filename);
      possiblePaths.push(contentBlogPath);
      console.log(`Zkouším content blog cestu: ${contentBlogPath}`);
    }
    
    // 8. Pokud je to path v formátu /images/blog/{lang}/{file}, zkusím alternativní cestu
    if (filename.includes('blog') && VALID_LANGUAGES.some(locale => filename.includes(`blog/${locale}/`))) {
      const parts = filename.split('blog/');
      if (parts.length > 1) {
        const afterBlog = parts[1];
        const langAndRest = afterBlog.split('/');
        if (langAndRest.length > 1 && VALID_LANGUAGES.includes(langAndRest[0])) {
          const imgLang = langAndRest[0];
          const restPath = langAndRest.slice(1).join('/');
          const fixedPath = path.join(process.cwd(), 'content', 'images', imgLang, restPath);
          possiblePaths.push(fixedPath);
          console.log(`Zkouším fixovanou cestu: ${fixedPath}`);
        }
      }
    }
    
    // Kontrola existence souboru ve všech možných cestách
    let filePath = '';
    for (const tryPath of possiblePaths) {
      // Zabránění path traversal útokům
      const resolvedPath = path.resolve(tryPath);
      const contentImagesPath = path.resolve(path.join(process.cwd()));
      
      if (!resolvedPath.startsWith(contentImagesPath)) {
        console.error(`Path traversal pokus detekován: ${tryPath}`);
        continue;
      }
      
      try {
        if (fs.existsSync(tryPath)) {
          filePath = tryPath;
          console.log(`Nalezen obrázek: ${filePath}`);
          break;
        }
      } catch (err) {
        console.error(`Chyba při kontrole existence souboru ${tryPath}:`, err);
      }
    }
    
    // Pokud nebyl nalezen žádný soubor, použijeme placeholder
    if (!filePath) {
      console.log(`Obrázek nenalezen, používám placeholder`);
      
      // Zkusíme několik různých cest k placeholderu
      const placeholderPaths = [
        path.join(process.cwd(), 'public', 'images', 'placeholder.jpg'),
        path.join(process.cwd(), 'public', 'placeholder.jpg'),
        path.join(process.cwd(), 'public', 'images', 'default.jpg'),
        path.join(process.cwd(), 'public', 'default.jpg')
      ];
      
      let placeholderPath = '';
      for (const tryPath of placeholderPaths) {
        try {
          if (fs.existsSync(tryPath)) {
            placeholderPath = tryPath;
            console.log(`Nalezen placeholder: ${placeholderPath}`);
            break;
          }
        } catch (err) {
          console.error(`Chyba při kontrole placeholder souboru ${tryPath}:`, err);
        }
      }
      
      if (placeholderPath) {
        const placeholderData = fs.readFileSync(placeholderPath);
        return new NextResponse(placeholderData, {
          status: 200,
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=86400',
          },
        });
      }
      
      // Pokud nenajdeme ani placeholder, vrátíme prázdný obrázek base64
      console.log('Nenalezen ani placeholder, vrátím inline base64 obrázek');
      const emptyImageBase64 = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // 1x1 transparent GIF
      const emptyImageBuffer = Buffer.from(emptyImageBase64, 'base64');
      
      return new NextResponse(emptyImageBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
    
    // Načtení souboru
    const data = fs.readFileSync(filePath);
    
    // Určení MIME typu podle přípony souboru
    const extension = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.avif': 'image/avif'
    };
    
    // Výchozí MIME typ je JPEG
    const contentType = mimeTypes[extension] || 'image/jpeg';
    
    // Vrácení obrázku s příslušnými hlavičkami
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache na 24 hodin
      },
    });
  } catch (error) {
    console.error('Chyba při servírování obrázku:', error);
    
    // V případě chyby se pokusíme vrátit placeholder
    try {
      // Pokusíme se najít placeholder na různých místech
      const placeholderPaths = [
        path.join(process.cwd(), 'public', 'images', 'placeholder.jpg'),
        path.join(process.cwd(), 'public', 'placeholder.jpg'),
        path.join(process.cwd(), 'public', 'images', 'default.jpg'),
        path.join(process.cwd(), 'public', 'default.jpg')
      ];
      
      for (const placeholderPath of placeholderPaths) {
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
      }
      
      // Pokud nenajdeme ani placeholder, vrátíme prázdný obrázek base64
      console.log('Nenalezen ani placeholder, vrátím inline base64 obrázek');
      const emptyImageBase64 = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // 1x1 transparent GIF
      const emptyImageBuffer = Buffer.from(emptyImageBase64, 'base64');
      
      return new NextResponse(emptyImageBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/gif',
          'Cache-Control': 'public, max-age=86400',
        },
      });
      
    } catch (placeholderError) {
      console.error('Chyba při načítání placeholderu:', placeholderError);
    }
    
    return new NextResponse('Error serving image', { status: 500 });
  }
} 