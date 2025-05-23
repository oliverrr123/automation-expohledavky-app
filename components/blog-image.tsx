'use client';

import React, { useState } from 'react';
import { getCurrentLocale } from '@/lib/client-locale';
import Image from 'next/image';

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
  locale?: string;
}

export function BlogImage({ 
  src, 
  alt, 
  className = 'rounded-lg shadow-md',
  locale: propLocale
}: BlogImageProps) {
  const [error, setError] = useState(false);
  const locale = propLocale || getCurrentLocale();
  
  // Funkce pro normalizaci cesty k obrázku
  const normalizeSrc = (imageSrc: string) => {
    if (!imageSrc) {
      console.error('Empty image src provided');
      return '/images/placeholder.jpg';
    }
    
    // Externí URL ponecháme beze změny
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    
    // Zpracování různých formátů cest
    if (imageSrc.startsWith('/images/blog/')) {
      // Starý formát: /images/blog/{lang}/{file}
      const parts = imageSrc.replace('/images/blog/', '').split('/');
      if (parts.length >= 2) {
        const imgLang = parts[0];
        const fileName = parts.slice(1).join('/');
        // Převést na nový formát
        return `/images/${imgLang}/${fileName}`;
      }
    } else if (imageSrc.startsWith('/content/images/')) {
      // Obsah z content/images/{lang}/... 
      const parts = imageSrc.replace('/content/images/', '').split('/');
      if (parts.length >= 2) {
        const imgLang = parts[0];
        const fileName = parts.slice(1).join('/');
        return `/images/${imgLang}/${fileName}`;
      }
    } else if (imageSrc.startsWith('/images/')) {
      // Již ve správném formátu
      return imageSrc;
    } else if (!imageSrc.startsWith('/')) {
      // Pro relativní cesty přidáme locale prefix
      return `/images/${locale}/${imageSrc}`;
    }
    
    return imageSrc;
  };
  
  // Obrázek pro případ chyby
  const fallbackSrc = '/images/placeholder.jpg';
  
  // Finální URL obrázku
  const imageSrc = error ? fallbackSrc : normalizeSrc(src);
  
  // Použití Next.js Image komponenty místo klasického img tagu
  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={800}
        height={600}
        style={{ 
          maxWidth: '100%',
          height: 'auto',
        }}
        onError={() => setError(true)}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
} 