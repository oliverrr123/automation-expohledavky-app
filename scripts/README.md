# Content Generation System

This directory contains scripts for automatically generating blog content in multiple languages for the ExpoHledávky platform.

## Overview

The system generates expert articles on topics related to receivables management, debt collection, and financial management. Content is generated in four languages:

- 🇨🇿 Czech
- 🇸🇰 Slovak
- 🇩🇪 German
- 🇬🇧 English

Articles are generated using OpenAI GPT-4 and stored as MDX files in the `/content` directory. Images for articles are fetched from Unsplash.

## Scripts

### Core Utility

- `article-generation-utils.js` - Contains shared utilities used by all generators, including functions for generating content, getting images, and creating metadata.

### Language-Specific Generators

- `generate-czech-content.js` - Generates articles in Czech
- `generate-slovak-content.js` - Generates articles in Slovak
- `generate-german-content.js` - Generates articles in German
- `generate-english-content.js` - Generates articles in English

### Orchestration

- `generate-all-content.js` - Runs all language generators sequentially

## How to Run

### Prerequisites

- Node.js 18+
- OpenAI API key (set as `OPENAI_API_KEY` environment variable)
- Unsplash API key (set as `UNSPLASH_ACCESS_KEY` environment variable)

### Generate Content for All Languages

```bash
node scripts/generate-all-content.js
```

### Generate Content for Specific Language

```bash
node scripts/generate-czech-content.js
node scripts/generate-slovak-content.js
node scripts/generate-german-content.js
node scripts/generate-english-content.js
```

## Automated Workflow

Content generation is automated via GitHub Actions. The workflow is configured to run daily at 9:00 AM UTC. The workflow file is located at `.github/workflows/generate-daily-content.yml`.

## Article Structure

Each generated article includes:

- Frontmatter with metadata (title, author, date, tags, etc.)
- Introduction
- Main content divided into sections
- Conclusion
- Examples and quotes from fictional industry experts

## Output Directories

Generated articles are stored in the following directories:

- Czech: `/content/posts-cs/`
- Slovak: `/content/posts-sk/`
- German: `/content/posts-de/`
- English: `/content/posts-en/`

## Customization

To customize the content generation:

1. Edit categories and authors in the language-specific generator files
2. Modify prompts in `article-generation-utils.js`
3. Adjust metadata generation in `article-generation-utils.js` 