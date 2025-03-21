# Automation ExpoHledávky

Moderní webová stránka a blog pro společnost ExpoHledávky vytvořená pomocí Next.js, React a TailwindCSS.

## Funkce

- Moderní, responzivní design
- Blog s podporou MDX
- Stránky služeb
- Kontaktní formulář
- Kariérní stránka
- Ceník
- Sekce slovník a vzory

## Začínáme

### Požadavky

- Node.js 18.x nebo vyšší
- npm nebo yarn

### Instalace

1. Naklonujte repozitář
```bash
git clone https://github.com/yourusername/automation-expohledavky.git
cd automation-expohledavky
```

2. Nainstalujte závislosti
```bash
npm install
# nebo
yarn install
```

3. Spusťte vývojový server
```bash
npm run dev
# nebo
yarn dev
```

4. Otevřete [http://localhost:3000](http://localhost:3000) ve vašem prohlížeči.

## Struktura projektu

- `/app` - Next.js app adresář se stránkami a layouty
- `/components` - React komponenty
- `/content` - MDX obsah pro blogové příspěvky
- `/hooks` - Vlastní React hooky
- `/lib` - Utility funkce
- `/public` - Statické soubory
- `/styles` - Globální styly

## Použité technologie

- Next.js 15
- React 18
- TailwindCSS
- Shadcn UI Components
- MDX pro obsah blogu # automation-expohledavky

## Security Features

This application includes several production-ready security features:

### 1. CSRF Protection

All forms include server-validated CSRF tokens for protection against cross-site request forgery attacks.

To set up:

1. Add a secure, random string as `NEXTAUTH_SECRET` in your environment variables
2. For development, you can use `.env.local` to set this value

### 2. Content Security Policy (CSP)

The application includes a robust Content Security Policy configured in `next.config.mjs`.

### 3. Input Sanitization

User inputs are sanitized throughout the application:

- HTML content is sanitized with DOMPurify before rendering
- Form inputs are validated and sanitized on both client and server
- Search queries are validated to prevent injection attacks

## Development Setup

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and add your credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add the `NEXTAUTH_SECRET` environment variable
4. Deploy!

## Performance Considerations

- CSP headers are applied statically where possible to avoid middleware overhead

## Security Best Practices

- Regularly update dependencies with `npm audit fix`
- Review CSP headers regularly and adjust as needed
- Consider enabling [Vercel Edge Config](https://vercel.com/docs/storage/edge-config) for additional security configurations
