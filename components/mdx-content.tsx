'use client';

import { useState, useEffect } from 'react';
import { MDXRemote } from 'next-mdx-remote';

// Vlastní komponenty pro MDX
const components = {
  h1: (props: any) => <h1 {...props} className="text-3xl font-bold mt-10 mb-6 text-zinc-800" />,
  h2: (props: any) => <h2 {...props} className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-orange-100 text-zinc-800" />,
  h3: (props: any) => <h3 {...props} className="text-xl font-bold mt-6 mb-3 text-zinc-800" />,
  p: (props: any) => <p {...props} className="my-4 text-zinc-700 leading-relaxed" />,
  a: (props: any) => <a {...props} className="text-orange-600 font-medium hover:text-orange-700 hover:underline transition-colors" />,
  ul: (props: any) => <ul {...props} className="my-4 list-disc pl-6" />,
  ol: (props: any) => <ol {...props} className="my-4 list-decimal pl-6" />,
  li: (props: any) => <li {...props} className="my-2" />,
  blockquote: (props: any) => <blockquote {...props} className="border-l-4 border-orange-300 bg-orange-50/50 py-1 pl-4 italic my-4" />,
  strong: (props: any) => <strong {...props} className="font-semibold text-orange-700" />,
  img: (props: any) => (
    <div className="my-6">
      <img {...props} className="rounded-lg shadow-md mx-auto" />
    </div>
  ),
  code: (props: any) => {
    // Pokud je to inline kód (bez language)
    if (typeof props.className !== 'string') {
      return <code {...props} className="bg-orange-50 text-orange-700 px-1 py-0.5 rounded font-mono text-sm" />;
    }
    // Jinak je to blokový kód
    return (
      <div className="my-6 overflow-hidden rounded-lg shadow-md">
        <code {...props} className="block p-4 bg-zinc-800 text-white overflow-x-auto" />
      </div>
    );
  },
};

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
    return <div className="animate-pulse bg-orange-50 h-64 rounded-md" />;
  }

  // Jinak vrátíme MDXRemote komponentu s obsahem a vlastními komponentami
  return <MDXRemote {...source} components={components} />;
} 