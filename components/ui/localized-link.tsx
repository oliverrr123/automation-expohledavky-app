import React from 'react';
import Link from 'next/link';
import { transformPath } from '@/lib/route-mapping';
import { getCurrentLocale } from '@/lib/i18n';

type LocalizedLinkProps = React.ComponentProps<typeof Link> & {
  href: string;
  locale?: string; // Optional locale override
};

/**
 * A wrapper around Next.js Link component that automatically handles localization
 * Transforms routes to the appropriate localized version based on the current locale
 */
export const LocalizedLink: React.FC<LocalizedLinkProps> = ({
  href,
  locale,
  ...props
}) => {
  // Get the current locale or use the provided override
  const currentLocale = locale || getCurrentLocale();
  
  // Skip localization for external links, fragment links, or special paths
  if (
    typeof href !== 'string' || 
    href.startsWith('http') || 
    href.startsWith('#') || 
    href.startsWith('tel:') || 
    href.startsWith('mailto:')
  ) {
    return <Link href={href} {...props} />;
  }
  
  // Default to Czech if locale is missing
  const safeLocale = currentLocale || 'cs';
  
  // Make sure href starts with a slash for consistent handling
  const normalizedHref = href.startsWith('/') ? href : `/${href}`;
  
  // Transform the path to the appropriate localized version
  // For the destination, we always want the user's current locale
  const localizedHref = transformPath(normalizedHref, 'cs', safeLocale);
  
  return <Link href={localizedHref} {...props} />;
}; 