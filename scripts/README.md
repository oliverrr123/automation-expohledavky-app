# Systém generování obsahu

Tento systém automaticky generuje obsah pro blog ExPohledávky v různých jazycích pomocí OpenAI GPT-4o a Unsplash API.

## Struktura

- **Články** jsou uloženy v adresářích podle jazyka:
  - `content/posts-cs/` - české články
  - `content/posts-sk/` - slovenské články 
  - `content/posts-de/` - německé články
  - `content/posts-en/` - anglické články
  - `content/posts/` - starší české články (pro zpětnou kompatibilitu)

- **Obrázky** jsou uloženy v `content/images/{jazyk}/`:
  - `content/images/cs/` - obrázky pro české články
  - `content/images/sk/` - obrázky pro slovenské články
  - `content/images/de/` - obrázky pro německé články
  - `content/images/en/` - obrázky pro anglické články

## Použité technologie

- **OpenAI GPT-4o** - generování textu článků
- **Unsplash API** - získávání obrázků
- **GitHub Actions** - automatické spouštění generování obsahu
- **Next.js** - zobrazování článků a obrázků

## Proces generování

1. Skript `generate-content.js` řídí celý proces generování
2. Pro každý jazyk:
   - Vybere kategorii
   - Vygeneruje téma pomocí OpenAI
   - Vygeneruje obsah článku pomocí OpenAI
   - Stáhne obrázek z Unsplash
   - Vytvoří MDX soubor s obsahem a metadaty

## Zobrazování

- Články jsou zobrazovány pomocí Next.js v `/blog/[slug]`
- Obrázky jsou servírovány přes API endpoint `/api/content-images/[lang]/[file]`
- Redirecty jsou nastaveny v `next.config.js`

## Spuštění manuálně

```bash
# Generování článků pro všechny jazyky
node scripts/generate-content.js

# Generování článků pro specifické jazyky
node scripts/generate-content.js cs sk
```

## GitHub Actions

Automatické generování obsahu probíhá každý den v 09:00 UTC.

Workflow je definován v `.github/workflows/generate-daily-content.yml`.

## Oprava 404 chyb u obrázků

Obrázky z Unsplash jsou nyní ukládány do `content/images/{jazyk}/` místo `public/images/blog/{jazyk}/`, což zajišťuje:

1. Verzování obrázků v Git repozitáři
2. Persistenci obrázků mezi buildy
3. Automatické commity změn v GitHub Actions

API endpoint `/api/content-images/[lang]/[...file]` zajišťuje servírování obrázků z této nové cesty.

### Vylepšení získávání obrázků

Systém nyní používá oficiální Unsplash API místo neoficiálního endpointu, což přináší:

- Spolehlivější stahování obrázků
- Informace o autorovi obrázku
- Dodržování limitů API a licenčních podmínek
- Více kontroly nad velikostí a kvalitou obrázků

V případě selhání Unsplash API nebo chybějícího API klíče systém poskytuje několik fallback mechanismů:

1. Pokus o získání obrázku z neoficiálního endpointu source.unsplash.com
2. Použití předgenerovaného placeholder obrázku
3. Vytvoření základního placeholder souboru jako poslední možnost

### Kontrola konfigurace

Před generováním obsahu systém nyní kontroluje:

- Přítomnost OPENAI_API_KEY a UNSPLASH_ACCESS_KEY
- Připojení k Unsplash API pomocí jednoduchého testu
- Vytváří placeholder obrázek pro fallback případy

## Přehled

Systém generuje odborné články na témata související se správou pohledávek, vymáháním dluhů a finančním řízením. Obsah je generován ve čtyřech jazycích:

- 🇨🇿 Čeština
- 🇸🇰 Slovenština
- 🇩🇪 Němčina
- 🇬🇧 Angličtina

Články jsou generovány pomocí OpenAI GPT-4 a ukládány jako MDX soubory v adresáři `/content`. Obrázky pro články jsou získávány z Unsplash.

## Skripty

### Hlavní skripty

- `generate-content.js` - Univerzální generátor obsahu pro všechny jazyky
- `article-generation-utils.js` - Sdílené utility používané generátorem

## Jak spustit

### Předpoklady

- Node.js 18+
- OpenAI API klíč (nastavený jako `OPENAI_API_KEY` proměnná prostředí)
- Unsplash API klíč (nastavený jako `UNSPLASH_ACCESS_KEY` proměnná prostředí)

### Generování obsahu pro všechny jazyky

```bash
node scripts/generate-content.js
```

### Generování obsahu pro konkrétní jazyky

```bash
# Generování pouze pro češtinu
node scripts/generate-content.js cs

# Generování pro češtinu a slovenštinu
node scripts/generate-content.js cs sk

# Generování pro němčinu a angličtinu
node scripts/generate-content.js de en
```

## Automatizovaný workflow

Generování obsahu je automatizováno pomocí GitHub Actions. Workflow je nakonfigurován tak, aby běžel denně v 9:00 UTC. Soubor workflow je umístěn v `.github/workflows/generate-daily-content.yml`.

Workflow lze také spustit ručně s možností určit, pro které jazyky má být obsah generován.

## Struktura článku

Každý vygenerovaný článek obsahuje:

- Frontmatter s metadaty (titulek, autor, datum, tagy atd.)
- Úvod
- Hlavní obsah rozdělený do sekcí
- Závěr
- Příklady a citace od fiktivních odborníků z oboru

## Přizpůsobení

Pro přizpůsobení generování obsahu:

1. Upravte kategorie a autory v objektu `config` v souboru `generate-content.js`
2. Upravte prompty v `article-generation-utils.js`
3. Upravte generování metadat v `article-generation-utils.js`

## Rozšíření na další jazyky

Pro přidání podpory nového jazyka:

1. Přidejte konfiguraci pro nový jazyk do objektu `config` v `generate-content.js`
2. Upravte příslušné funkce v `article-generation-utils.js` pro generování obsahu v novém jazyce 