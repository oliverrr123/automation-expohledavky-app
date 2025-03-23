# Route Localization System

This document explains the route localization system implemented for the ExPohledavky website to support different domains across multiple languages (CS, SK, DE, EN).

## Overview

The website runs on 4 domains, each representing a different country and language:

- **expohledavky.cz** - Czech Republic (Czech language)
- **expohledavky.sk** - Slovakia (Slovak language)
- **expohledavky.de** - Germany/Austria/Switzerland (German language)
- **expohledavky.com** - International (English language)

Each domain needs to have paths in its respective language for proper SEO, while internally using a shared codebase.

## How It Works

### Core Concepts

1. **Route Mapping**: Each localized path is mapped to a canonical (English) path
2. **Middleware Rewriting**: The Next.js middleware internally rewrites requests to the appropriate files
3. **Localized Links**: A custom `LocalizedLink` component translates routes automatically
4. **Language Switching**: The language switcher preserves the user's position by transforming routes

### Key Files

- **`lib/route-mapping.ts`**: Defines the mapping between localized routes across languages
- **`middleware.ts`**: Handles language detection and route rewriting
- **`components/ui/localized-link.tsx`**: Custom link component for automatic route translation
- **`lib/navigation.ts`**: Helper functions for generating localized routes
- **`components/language-switcher.tsx`**: Handles language switching while preserving position

## Route Definition

All routes are defined in `lib/route-mapping.ts` with mappings between each language:

```typescript
export const ROUTES: RouteMap = {
  // Czech routes
  cs: {
    "o-nas": "about-us",
    "nase-sluzby": "services",
    // ...more routes
  },
  
  // Slovak routes
  sk: {
    "o-nas": "about-us",
    "nase-sluzby": "services",
    // ...more routes
  },
  
  // German routes
  de: {
    "uber-uns": "about-us",
    "unsere-leistungen": "services",
    // ...more routes
  },
  
  // English routes (canonical)
  en: {
    "about-us": "about-us",
    "services": "services",
    // ...more routes
  }
};
```

English routes serve as the "canonical" routes, providing a consistent reference point.

## Usage

### In Navigation Files

Navigation links should use canonical route names without leading slashes:

```json
{
  "navigation": [
    { "name": "About Us", "href": "about-us" },
    { "name": "Services", "href": "services" }
  ]
}
```

The `LocalizedLink` component automatically translates these routes to the appropriate language.

### In Components

Use the `LocalizedLink` component to create links that automatically localize:

```tsx
import { LocalizedLink } from "@/components/ui/localized-link";

// Will render as /o-nas on Czech domain, /uber-uns on German domain, etc.
<LocalizedLink href="about-us">About Us</LocalizedLink>
```

### Using Route Helpers

For programmatic navigation, use the helper functions:

```tsx
import { Routes } from "@/lib/navigation";

// Will get the correct localized path for the current language
const aboutUsPath = Routes.aboutUs();
const servicesPath = Routes.services();
```

## How Routing Works

1. When a user visits a localized path (e.g., `/o-nas` on the Czech domain):
   - The middleware detects the locale from the domain
   - It looks up the canonical path (`about-us`) for this localized path
   - It rewrites the request internally to the correct page component while preserving the URL

2. When switching languages:
   - The language switcher gets the current path
   - It transforms the path to the equivalent in the target language
   - It redirects to the new domain with the transformed path

## Adding New Routes

1. Add the route to each language mapping in `lib/route-mapping.ts`
2. Add a helper function to `lib/navigation.ts` if needed
3. Use `LocalizedLink` or route helpers in your components

## Development Environment

There are two ways to test localization in development:

### 1. Using Subdomains (Recommended for Production-Like Testing)

Requires editing your hosts file to support subdomains on localhost:

- `cs.localhost:3000` - Czech
- `sk.localhost:3000` - Slovak
- `de.localhost:3000` - German
- `en.localhost:3000` - English

To set up subdomains in your hosts file:
1. Edit `/etc/hosts` on Mac/Linux or `C:\Windows\System32\drivers\etc\hosts` on Windows
2. Add these lines:
   ```
   127.0.0.1 cs.localhost
   127.0.0.1 sk.localhost
   127.0.0.1 de.localhost
   127.0.0.1 en.localhost
   127.0.0.1 localhost
   ```

### 2. Using URL Parameters (Easier for Quick Testing)

Use the `_locale` URL parameter to simulate different domains:

- `http://localhost:3000?_locale=cs` - Czech
- `http://localhost:3000?_locale=sk` - Slovak
- `http://localhost:3000?_locale=de` - German
- `http://localhost:3000?_locale=en` - English

This approach is simpler but doesn't fully test the domain-based routing.

## Debugging

If you encounter issues with route localization, visit the debug page at:
- `/debug-routes` - Shows all route mappings and the current detected locale

## Implementation Notes

- The middleware handles the rewriting of routes internally
- The app directory structure still uses Czech route paths for now
- For non-Czech domains, the middleware maps localized routes to the Czech file structure
- Use the `Routes` helper functions to generate URLs for links programmatically 