const fs = require('fs');
const path = require('path');

// Define paths to potential configuration files
const configPaths = [
  path.join(process.cwd(), 'app', 'config.js'),
  path.join(process.cwd(), 'app', 'config.ts'),
  path.join(process.cwd(), 'config', 'site.js'),
  path.join(process.cwd(), 'config', 'site.ts'),
  path.join(process.cwd(), 'src', 'config.js'),
  path.join(process.cwd(), 'src', 'config.ts'),
  path.join(process.cwd(), 'lib', 'config.js'),
  path.join(process.cwd(), 'lib', 'config.ts'),
  path.join(process.cwd(), 'app.config.js'),
  path.join(process.cwd(), 'next.config.js')
];

// Find existing configuration files
console.log('Searching for configuration files...');
const existingConfigFiles = configPaths.filter(filePath => fs.existsSync(filePath));

if (existingConfigFiles.length === 0) {
  console.log('No configuration files found.');
  
  // Look for any potential configuration files
  console.log('Searching for any other potential configuration files...');
  
  const searchDirs = ['app', 'config', 'src', 'lib', 'pages'];
  let potentialConfigFiles = [];
  
  searchDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      try {
        const files = fs.readdirSync(dirPath);
        potentialConfigFiles = potentialConfigFiles.concat(
          files
            .filter(file => file.includes('config') || file.includes('settings') || file.includes('constants'))
            .map(file => path.join(dirPath, file))
        );
      } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
      }
    }
  });
  
  if (potentialConfigFiles.length > 0) {
    console.log('Found potential configuration files:');
    potentialConfigFiles.forEach(file => console.log(`- ${file}`));
  } else {
    console.log('No potential configuration files found.');
  }
  
  // Check for blog-related components that might need updating
  console.log('\nSearching for blog-related components...');
  
  // Search for files containing "blog", "post", or "article"
  const componentsToSearch = [];
  ['app', 'components', 'src', 'pages'].forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      try {
        searchDirectory(dirPath, componentsToSearch);
      } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
      }
    }
  });
  
  if (componentsToSearch.length > 0) {
    console.log('Found blog-related components:');
    componentsToSearch.forEach(file => console.log(`- ${file}`));
    
    // Create backup of each file before modifying
    componentsToSearch.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        fs.writeFileSync(`${file}.bak`, content);
        console.log(`Created backup of ${file}`);
        
        // Update file content to use posts-cs instead of posts
        const updatedContent = content.replace(/content[\/\\]posts/g, 'content/posts-cs')
                                      .replace(/['"]posts['"]/g, '"posts-cs"')
                                      .replace(/\/posts\//g, '/posts-cs/')
                                      .replace(/path.+posts/g, (match) => match.replace('posts', 'posts-cs'));
        
        if (content !== updatedContent) {
          fs.writeFileSync(file, updatedContent);
          console.log(`Updated ${file} to use posts-cs directory`);
        }
      } catch (error) {
        console.error(`Error updating file ${file}:`, error);
      }
    });
  } else {
    console.log('No blog-related components found.');
  }
} else {
  console.log('Found configuration files:');
  existingConfigFiles.forEach(file => console.log(`- ${file}`));
  
  // Update each configuration file
  existingConfigFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      fs.writeFileSync(`${file}.bak`, content);
      console.log(`Created backup of ${file}`);
      
      // Update file content to use posts-cs instead of posts
      const updatedContent = content.replace(/content[\/\\]posts/g, 'content/posts-cs')
                                    .replace(/['"]posts['"]/g, '"posts-cs"')
                                    .replace(/\/posts\//g, '/posts-cs/')
                                    .replace(/path.+posts/g, (match) => match.replace('posts', 'posts-cs'));
      
      if (content !== updatedContent) {
        fs.writeFileSync(file, updatedContent);
        console.log(`Updated ${file} to use posts-cs directory`);
      } else {
        console.log(`No changes needed for ${file}`);
      }
    } catch (error) {
      console.error(`Error updating file ${file}:`, error);
    }
  });
}

console.log('\nUpdate complete!');

// Recursive function to search for blog-related files
function searchDirectory(directory, results) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        searchDirectory(filePath, results);
      }
    } else {
      // Check if file name or content relates to blog/posts
      const fileExt = path.extname(file);
      if (['.js', '.jsx', '.ts', '.tsx', '.mdx'].includes(fileExt)) {
        const fileName = file.toLowerCase();
        
        if (fileName.includes('blog') || fileName.includes('post') || fileName.includes('article')) {
          results.push(filePath);
        } else {
          // Check file content
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('posts') && content.includes('content')) {
              results.push(filePath);
            }
          } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
          }
        }
      }
    }
  });
} 