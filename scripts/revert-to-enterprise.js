/**
 * Script to revert from reCAPTCHA v3 back to reCAPTCHA Enterprise
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
      /https:\/\/www\.google\.com\/recaptcha\/api\.js/g,
      'https://www.google.com/recaptcha/enterprise.js'
    );
    
    // Update reCAPTCHA token generation
    content = content.replace(
      /window\.grecaptcha\.ready/g,
      'window.grecaptcha.enterprise.ready'
    );
    
    content = content.replace(
      /window\.grecaptcha\.execute/g,
      'window.grecaptcha.enterprise.execute'
    );
    
    // Replace window.grecaptcha checks
    content = content.replace(
      /if\s*\(\s*window\.grecaptcha\s*\)/g,
      'if (window.grecaptcha && window.grecaptcha.enterprise)'
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

console.log('\nReverted back to reCAPTCHA Enterprise!');
console.log('\nReminder: Make sure to create a valid API key in Google Cloud Console and add it to your environment variables.'); 