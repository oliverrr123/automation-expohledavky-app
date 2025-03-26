const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Fix the specific article with 404 error
const fixSpecificArticle = () => {
  // Create correct article slug for the problematic article
  const articleTitle = 'Etické vymáhanie dlhov: Udržanie vzťahov a reputácie';
  const correctSlug = 'eticke-vymahanie-dlhov-udrzanie-vztahov-a-reputacie';
  const date = '2025-03-27';
  
  // Find the problematic article in posts-sk directory
  const dirPath = path.join(process.cwd(), 'content', 'posts-sk');
  
  // List all files
  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mdx'));
  
  // Look for the article that matches or is similar to our target
  let targetFile = null;
  let targetPath = null;
  
  // First pass: look for exact title match
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    
    if (data.title === articleTitle) {
      targetFile = file;
      targetPath = filePath;
      console.log(`Found exact title match: ${file}`);
      break;
    }
  }
  
  // Second pass: look for partial title match
  if (!targetFile) {
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      if (data.title && data.title.includes('Etické vymáhanie')) {
        targetFile = file;
        targetPath = filePath;
        console.log(`Found partial title match: ${file} with title "${data.title}"`);
        break;
      }
    }
  }
  
  // If still not found, look for keywords in the content
  if (!targetFile) {
    for (const file of files) {
      if (file.includes('eticke') || file.includes('vymahanie') || file.includes('etika')) {
        const filePath = path.join(dirPath, file);
        targetFile = file;
        targetPath = filePath;
        console.log(`Found matching keywords in filename: ${file}`);
        break;
      }
    }
  }
  
  // If not found, use the file that contains "eticke-dilemy" in the name
  if (!targetFile) {
    targetFile = '2025-03-27-eticke-dilemy-a-riesenia-pri-vymahani-pohladavok-v-oblasti-b2b-ako-zachovat-obchodne-vztahy-a-reputaciu-v-kontexte-slovenskeho-prava.mdx';
    targetPath = path.join(dirPath, targetFile);
    console.log(`Using default file: ${targetFile}`);
  }
  
  // Now create a new file with the correct slug
  if (targetFile && targetPath) {
    console.log(`Creating new file with correct slug for: ${targetFile}`);
    
    const fileContent = fs.readFileSync(targetPath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Update title if not already matching
    if (data.title !== articleTitle) {
      data.title = articleTitle;
    }
    
    // Make sure author is set correctly
    data.author = 'Mgr. Martin Novotný';
    data.authorPosition = 'Právny špecialista';
    
    // Update the date to today
    const dateObj = new Date();
    const formattedDate = dateObj.toISOString();
    data.date = formattedDate;
    
    // Save with new correct slug
    const newFileName = `${date}-${correctSlug}.mdx`;
    const newFilePath = path.join(dirPath, newFileName);
    
    // Write updated content
    const updatedContent = matter.stringify(content, data);
    fs.writeFileSync(newFilePath, updatedContent);
    
    console.log(`Created new file: ${newFileName}`);
    console.log(`This file should now be accessible at: /blog/${correctSlug}`);
    
    return {
      success: true,
      originalFile: targetFile,
      newFile: newFileName
    };
  } else {
    console.log('Could not find a matching article to fix.');
    return {
      success: false
    };
  }
};

// Execute the fix
try {
  const result = fixSpecificArticle();
  console.log('Result:', result);
} catch (error) {
  console.error('Error fixing the specific article:', error);
} 