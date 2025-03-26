const fs = require('fs');
const path = require('path');

// Get the current file name
const sourceMdxFile = '2025-03-27-efektivita-mediace-v-procesu-vymahani-pohledavek-vyhody-uskali-a-strategie-pro-uspesne-reseni-sporu-v-ceskem-korporatnim-prostredi.mdx';

// The correct slug that should be displayed in the URL
const expectedSlug = 'efektivita-mediace-ve-vymahani-pohledavek-klic-k-uspechu';

// Create a symlink or update Next.js redirects to fix the issue
console.log('Creating a fix for the 404 issue with article URLs...');

// Path to next.config.js
const nextConfigPath = path.join(process.cwd(), 'next.config.js');

// Check if next.config.js exists
if (!fs.existsSync(nextConfigPath)) {
  console.error(`Could not find next.config.js at ${nextConfigPath}`);
  process.exit(1);
}

// Read current next.config.js
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

// Create backup
fs.writeFileSync(`${nextConfigPath}.bak.${Date.now()}`, nextConfigContent);
console.log(`Created backup of next.config.js`);

// Check if the file already has redirects configured
const hasRedirects = nextConfigContent.includes('redirects');

// Extract the slug from the mdx file name
const existingSlug = sourceMdxFile.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '');

if (existingSlug === expectedSlug) {
  console.log('The article slug already matches the expected URL. No action needed.');
  process.exit(0);
}

// Add or update redirects in next.config.js
let updatedConfig;

if (hasRedirects) {
  // If redirects already exist, we need to add to them carefully
  // Simple string replacement might be risky, so notify the user
  console.log('next.config.js already has redirects configured.');
  console.log('Please manually add this redirect to your next.config.js file:');
  console.log(`
  {
    source: '/blog/${expectedSlug}',
    destination: '/blog/${existingSlug}',
    permanent: true
  },`);
  
  console.log(`\nAlternatively, you can rename the file to match the expected URL:`);
  console.log(`mv content/posts-cs/${sourceMdxFile} content/posts-cs/2025-03-27-${expectedSlug}.mdx`);
} else {
  // If no redirects exist, we can safely add them
  updatedConfig = nextConfigContent.replace(
    /module\.exports\s*=\s*({[^}]*})/,
    `module.exports = {
  ...($1),
  async redirects() {
    return [
      {
        source: '/blog/${expectedSlug}',
        destination: '/blog/${existingSlug}',
        permanent: true
      },
    ]
  },`
  );

  // Write updated config
  fs.writeFileSync(nextConfigPath, updatedConfig);
  console.log(`Updated next.config.js with redirect from /blog/${expectedSlug} to /blog/${existingSlug}`);
}

// Create a second option: renaming the file
const renameScript = `
// Rename the file to match the expected URL
// Run this with:
// node -e "$(cat scripts/migration/rename-article-file.js)"

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'content', 'posts-cs');
const sourceFile = path.join(sourceDir, '${sourceMdxFile}');
const targetFile = path.join(sourceDir, '2025-03-27-${expectedSlug}.mdx');

if (fs.existsSync(sourceFile)) {
  // Read the content
  const content = fs.readFileSync(sourceFile, 'utf8');
  
  // Write to the new file
  fs.writeFileSync(targetFile, content);
  console.log(\`Created new file with correct slug: \${targetFile}\`);
  
  // Optionally remove the old file
  // fs.unlinkSync(sourceFile);
  // console.log(\`Removed old file: \${sourceFile}\`);
} else {
  console.error(\`Source file not found: \${sourceFile}\`);
}
`;

// Write rename script
fs.writeFileSync(path.join(process.cwd(), 'scripts', 'migration', 'rename-article-file.js'), renameScript);
console.log('Created rename script at scripts/migration/rename-article-file.js');

console.log('\nFix complete! You have two options:');
console.log('1. Use the redirect in next.config.js (already applied if no existing redirects were found)');
console.log('2. Rename the file using the script: node scripts/migration/rename-article-file.js');
console.log('\nChoose option 2 if you want a cleaner solution that doesn\'t rely on redirects.') 