# Localization and Route Mapping System

This document explains how the localization and route mapping system works in this Next.js application.

## Overview

The application is built to support multiple languages with localized routes based on the domain or subdomain:

- Czech (cs): expohledavky.cz (default language for file structure)
- English (en): expohledavky.com
- German (de): expohledavky.de
- Slovak (sk): expohledavky.sk

For development, we use subdomains on localhost:
- cs.localhost:3000
- en.localhost:3000
- de.localhost:3000
- sk.localhost:3000

## File Structure

The application uses Next.js App Router with the following structure:

1. Czech routes are the base files (e.g., `app/o-nas/page.tsx`)
2. Localized versions are created as parallel routes using the locale suffix (e.g., `app/o-nas/page.en.tsx`)
3. Additionally, redirect files are created for each localized route (e.g., `app/about-us/page.tsx` redirects to `/o-nas`)

## Route Mapping

Route mappings are defined in `lib/route-mapping.ts` which exports various utilities:

- `CS_TO_EN`, `CS_TO_DE`, `CS_TO_SK`: Direct path mapping objects
- `transformPath(path, fromLang, toLang)`: Function to transform paths between languages
- `getCanonicalPath(locale, path)`: Gets the English/canonical path for a localized path
- `getLocalizedPath(locale, canonicalPath)`: Gets the localized path for a canonical path

## How the System Works

1. **Middleware** (`middleware.ts`) detects the user's language based on domain/subdomain and sets cookies
2. **Page Components**:
   - Czech pages (`app/o-nas/page.tsx`) are the primary content pages
   - Localized pages (`app/o-nas/page.en.tsx`) check if user is on the right domain and redirect if needed
   - Redirect pages (`app/about-us/page.tsx`) redirect to the Czech content page

## Using the Scripts

### Generate Localized Routes

The `scripts/generate-localized-routes.js` script automatically generates all required language files:

```bash
# Make it executable first
chmod +x scripts/generate-localized-routes.js

# Then run it
node scripts/generate-localized-routes.js
```

This will:
1. Scan all content pages in the app directory
2. Generate localized files for each supported language
3. Create redirect files for all localized routes

### Adding a New Page

1. Create the primary Czech page (e.g., `app/nova-stranka/page.tsx`)
2. Add the path to route mappings in `lib/route-mapping.ts` and `lib/route-mapping-node.js`
3. Run the generation script to create all localized versions

### Adding a New Language

1. Add the new language code to the `LOCALES` array in `scripts/generate-localized-routes.js`
2. Create a mapping object in `lib/route-mapping.ts` (e.g., `CS_TO_FR` for French)
3. Update the `ROUTE_MAPPING` and `PATH_MAPPINGS` objects in both route mapping files
4. Add the new language to the middleware for detection
5. Run the generation script to create all localized files

## Technical Details

### Client-Side Navigation

When users navigate through the site, the `transformPath` function is used to convert URLs between languages.

### SEO Considerations

- Each language has its proper URL structure
- Middleware handles language detection and path rewrites
- Redirect files ensure proper indexing by search engines

## Troubleshooting

If localized routes are not working properly:

1. Check the middleware logs to ensure language detection works
2. Verify that route mappings exist for the path in question
3. Make sure you've run the generation script after adding new pages 