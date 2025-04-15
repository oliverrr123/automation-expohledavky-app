/**
 * Script to update reCAPTCHA Enterprise to reCAPTCHA v3 across the codebase
 */

const fs = require('fs');
const path = require('path');

// Files that need updating
const filesToUpdate = [
  'app/poziadavka/page.tsx',
  'app/inquiry/page.tsx',
  'app/kontakt/page.tsx',
  'app/nase-sluzby/layout.tsx',
  'app/cenik/page.tsx',
  'app/anfrage/page.tsx',
  'app/poptavka/page.tsx',
  'app/o-nas/page.tsx',
];

// Update script source and usage
function updateFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update reCAPTCHA script tag
    content = content.replace(
      /https:\/\/www\.google\.com\/recaptcha\/enterprise\.js/g,
      'https://www.google.com/recaptcha/api.js'
    );
    
    // Update reCAPTCHA token generation
    content = content.replace(
      /window\.grecaptcha\.enterprise\.ready/g,
      'window.grecaptcha.ready'
    );
    
    content = content.replace(
      /window\.grecaptcha\.enterprise\.execute/g,
      'window.grecaptcha.execute'
    );
    
    // Replace window.grecaptcha && window.grecaptcha.enterprise checks
    content = content.replace(
      /if\s*\(\s*window\.grecaptcha\s*&&\s*window\.grecaptcha\.enterprise\s*\)/g,
      'if (window.grecaptcha)'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Update each file
filesToUpdate.forEach(updateFile);

console.log('\nreCAPTCHA update complete!');
console.log('\nReminder: You may need to update TypeScript declarations for grecaptcha in these files.'); 