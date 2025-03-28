'use client';

import React, { useState } from 'react';
import { getCurrentLocale } from '@/lib/client-locale';

interface BlogImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  locale?: string;
}

export function BlogImage({ 
  src, 
  alt, 
  width = 1600, 
  height = 900, 
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
        const imgFile = parts.slice(1).join('/');
        return `/images/${imgLang}/${imgFile}`;
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
  
  // Použití klasického img tagu místo Next.js Image
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        style={{ 
          maxWidth: '100%',
          height: 'auto',
          aspectRatio: `${width}/${height}`
        }}
        onError={() => setError(true)}
        loading="lazy"
      />
    </div>
  );
} 