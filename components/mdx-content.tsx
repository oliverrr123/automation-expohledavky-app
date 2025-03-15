'use client';

import { useState, useEffect } from 'react';
import { MDXRemote } from 'next-mdx-remote';

interface MDXContentProps {
  source: any;
}

export default function MDXContent({ source }: MDXContentProps) {
  // Používáme useState a useEffect, abychom se ujistili, že komponenta bude renderována pouze na klientovi
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Pokud komponenta není namountovaná (tedy jsme na serveru), vrátíme placeholder
  if (!isMounted) {
    return <div className="animate-pulse bg-gray-100 h-64 rounded-md" />;
  }

  // Jinak vrátíme MDXRemote komponentu s obsahem
  return <MDXRemote {...source} />;
} 