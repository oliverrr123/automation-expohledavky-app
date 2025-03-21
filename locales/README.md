# Localization System

This directory contains translation files for the ExPohledavky website.

## Directory Structure

```
locales/
├── cs/                      # Czech translations
│   ├── hero.json            # Hero component translations
│   ├── header.json          # Header component translations
│   └── ...                  # Other component translations
├── en/                      # English translations
│   ├── header.json          # Header component translations 
│   └── ...                  # Other component translations
└── ...                      # Other languages
```

## Usage

Import the translation utilities from `@/lib/i18n` in your component:

```tsx
import { useTranslations } from "@/lib/i18n"

export function MyComponent() {
  // Access a specific namespace (e.g., 'hero')
  const t = useTranslations('hero')
  
  return (
    <div>
      <h1>{t.headline1}</h1>
      <p>{t.description}</p>
    </div>
  )
}
```

Alternatively, you can use the dot notation with the `t` function:

```tsx
import { t } from "@/lib/i18n"

export function MyComponent() {
  return (
    <div>
      <h1>{t('hero.headline1')}</h1>
      <p>{t('hero.description')}</p>
    </div>
  )
}
```

## Dynamic Locale Loading

For components that need to dynamically load translations (like the Header), you can use dynamic imports:

```tsx
const [translations, setTranslations] = useState<any>(null)

useEffect(() => {
  const loadTranslations = async () => {
    try {
      const headerTranslations = await import(`@/locales/${locale || 'cs'}/header.json`)
      setTranslations(headerTranslations.default)
    } catch (error) {
      console.error("Failed to load translations:", error)
      // Fallback to default locale
      const fallbackTranslations = await import(`@/locales/cs/header.json`)
      setTranslations(fallbackTranslations.default)
    }
  }
  
  loadTranslations()
}, [locale])

// Don't render until translations are loaded
if (!translations) return null
```

## Adding New Languages

1. Create a new directory under `locales/` with the language code (e.g., `en` for English)
2. Copy the JSON files from the `cs` directory and translate the values
3. Update the `lib/i18n.ts` file to include the new language 