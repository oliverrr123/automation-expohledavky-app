// Rename the file to match the expected URL

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'content', 'posts-cs');
const sourceMdxFile = '2025-03-27-efektivita-mediace-v-procesu-vymahani-pohledavek-vyhody-uskali-a-strategie-pro-uspesne-reseni-sporu-v-ceskem-korporatnim-prostredi.mdx';
const expectedSlug = 'efektivita-mediace-ve-vymahani-pohledavek-klic-k-uspechu';

const sourceFile = path.join(sourceDir, sourceMdxFile);
const targetFile = path.join(sourceDir, `2025-03-27-${expectedSlug}.mdx`);

console.log(`Renaming article file to match URL slug...`);
console.log(`Source: ${sourceFile}`);
console.log(`Target: ${targetFile}`);

if (fs.existsSync(sourceFile)) {
  // Read the content
  const content = fs.readFileSync(sourceFile, 'utf8');
  
  // Write to the new file
  fs.writeFileSync(targetFile, content);
  console.log(`Created new file with correct slug: ${targetFile}`);
  
  // Optionally remove the old file
  console.log(`Would you like to remove the old file? (y/n)`);
  process.stdout.write(`> `);
  
  process.stdin.once('data', (data) => {
    const response = data.toString().trim().toLowerCase();
    
    if (response === 'y' || response === 'yes') {
      fs.unlinkSync(sourceFile);
      console.log(`Removed old file: ${sourceFile}`);
    } else {
      console.log(`Kept old file: ${sourceFile}`);
    }
    
    console.log(`\nFile renamed successfully!`);
    console.log(`The article will now be accessible at: /blog/${expectedSlug}`);
    process.exit(0);
  });
} else {
  console.error(`Source file not found: ${sourceFile}`);
  process.exit(1);
} 