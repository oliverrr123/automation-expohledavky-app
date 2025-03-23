# Scripts Directory

This directory contains utility scripts for development and maintenance of the application.

## Available Scripts

### Generate Localized Routes

The `generate-localized-routes.js` script automatically generates localized route files for the Next.js App Router.

#### Usage

```bash
# Make it executable (once)
chmod +x scripts/generate-localized-routes.js

# Run the script
node scripts/generate-localized-routes.js
```

#### What it does

1. Scans all content directories in the `app` folder
2. Recursively processes nested directories
3. For each directory with a `page.tsx` file:
   - Creates localized versions (`page.en.tsx`, `page.de.tsx`, `page.sk.tsx`)
   - Creates redirect pages for localized paths

#### Configuration

The script is configured with:

- Languages (`en`, `de`, `sk`)
- Mapping of Czech paths to localized paths (from `lib/route-mapping-node.js`)
- Templates for localized page and redirect page files

#### When to run

Run this script:

- After adding new pages to the app
- After changing route mappings in `lib/route-mapping.ts` and `lib/route-mapping-node.js`
- After modifying the script itself

#### Notes

- The script assumes that Czech is the default language for the file structure
- Pages that have no mapping in the route configuration will be skipped 