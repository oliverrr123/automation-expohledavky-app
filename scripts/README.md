# Systém generování obsahu

Tento adresář obsahuje skripty pro automatické generování obsahu blogu v několika jazycích pro platformu ExpoHledávky.

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

## Výstupní adresáře

Vygenerované články jsou uloženy v následujících adresářích:

- Čeština: `/content/posts-cs/`
- Slovenština: `/content/posts-sk/`
- Němčina: `/content/posts-de/`
- Angličtina: `/content/posts-en/`

## Přizpůsobení

Pro přizpůsobení generování obsahu:

1. Upravte kategorie a autory v objektu `config` v souboru `generate-content.js`
2. Upravte prompty v `article-generation-utils.js`
3. Upravte generování metadat v `article-generation-utils.js`

## Rozšíření na další jazyky

Pro přidání podpory nového jazyka:

1. Přidejte konfiguraci pro nový jazyk do objektu `config` v `generate-content.js`
2. Upravte příslušné funkce v `article-generation-utils.js` pro generování obsahu v novém jazyce 