const fs = require('fs');
const path = require('path');

// Define directories
const sourceDir = path.join(process.cwd(), 'content', 'posts');
const targetDir = path.join(process.cwd(), 'content', 'posts-cs');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`Created directory: ${targetDir}`);
}

// Get all files from source directory
const files = fs.readdirSync(sourceDir);

// Process each file
files.forEach(file => {
  // Only process MDX files
  if (!file.endsWith('.mdx')) return;
  
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  // Check if file already exists in target directory
  if (fs.existsSync(targetPath)) {
    console.log(`File already exists in target directory: ${file}`);
    return;
  }
  
  try {
    // Read the file content
    const content = fs.readFileSync(sourcePath, 'utf8');
    
    // Copy file to target directory
    fs.writeFileSync(targetPath, content);
    
    console.log(`Successfully migrated: ${file}`);
  } catch (error) {
    console.error(`Error migrating file ${file}:`, error);
  }
});

console.log('Migration complete!');
console.log(`Total files processed: ${files.length}`);
console.log(`Files moved to: ${targetDir}`);

// Update script configuration
const configPath = path.join(process.cwd(), 'scripts', 'generate-czech-content.js');

try {
  if (fs.existsSync(configPath)) {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check if the file already has the correct path
    if (configContent.includes('posts-cs')) {
      console.log('Configuration file already updated to use posts-cs directory.');
    } else {
      // Update the path in the configuration file
      configContent = configContent.replace(/content[\/\\]posts/g, 'content/posts-cs');
      fs.writeFileSync(configPath, configContent);
      console.log('Updated configuration file to use posts-cs directory.');
    }
  } else {
    console.log('Configuration file not found.');
  }
} catch (error) {
  console.error('Error updating configuration file:', error);
} 