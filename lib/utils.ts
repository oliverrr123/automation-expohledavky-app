import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "dompurify"

// Remove the type declaration that wasn't working
// declare module 'dompurify' {
//   interface DOMPurifyI {
//     __configured?: boolean;
//   }
// }

// Track configuration state without modifying DOMPurify
let isPurifyConfigured = false;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Sanitizes HTML strings to prevent XSS attacks
 * @param html The HTML string to sanitize
 * @param options Optional DOMPurify configuration
 * @returns Sanitized HTML string safe for use with dangerouslySetInnerHTML
 */
export function sanitizeHTML(html: string, options?: {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  [key: string]: any;
}): string {
  // Default configuration with secure options
  const defaultOptions = {
    ALLOWED_TAGS: ['a', 'b', 'br', 'strong', 'em', 'i', 'span', 'p', 'ul', 'ol', 'li', 'mark'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ADD_ATTR: ['target'], // Auto add target attribute
    FORCE_HTTPS: true, // Force https for all URLs
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM: false,
    SANITIZE_DOM: true
  }
  
  // Configure URL sanitization hook for DOMPurify
  // This runs on initialization only
  if (typeof window !== 'undefined' && !isPurifyConfigured) {
    DOMPurify.addHook('afterSanitizeAttributes', function(node) {
      // Set all links to open in a new tab
      if ('target' in node) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
      
      // Sanitize href attributes to only allow safe protocols
      if (node.hasAttribute('href')) {
        const href = node.getAttribute('href');
        if (href) {
          // Allow relative URLs that start with / or ./
          if (href.startsWith('/') || href.startsWith('./') || href.startsWith('#')) {
            // Relative URLs are safe - keep them
            // But still enforce target and rel attributes for external navigation
            if (href.startsWith('/') || href.startsWith('./')) {
              node.setAttribute('target', '_blank');
              node.setAttribute('rel', 'noopener noreferrer');
            }
          } else {
            try {
              const url = new URL(href, window.location.origin);
              const safeProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
              
              if (!safeProtocols.includes(url.protocol)) {
                node.removeAttribute('href');
              } else if (url.protocol === 'http:' || url.protocol === 'https:') {
                // For HTTP/HTTPS URLs, enforce security attributes
                node.setAttribute('target', '_blank');
                node.setAttribute('rel', 'noopener noreferrer');
              }
            } catch (e) {
              // Invalid URL - remove it for safety
              node.removeAttribute('href');
            }
          }
        }
      }
    });
    
    // Flag to avoid setting up hooks multiple times
    isPurifyConfigured = true;
  }
  
  return DOMPurify.sanitize(html, options || defaultOptions)
}

