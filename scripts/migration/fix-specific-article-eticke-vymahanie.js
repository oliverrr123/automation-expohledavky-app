const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Fix the specific article with 404 error
const fixSpecificArticle = () => {
  // Create correct article slug for the problematic article
  const articleTitle = 'Etické vymáhanie dlhov: Udržanie vzťahov a reputácie';
  const correctSlug = 'eticke-vymahanie-dlhov-udrzanie-vztahov-a-reputacie';
  const originalFilePath = path.join(
    process.cwd(), 
    'content', 
    'posts-sk', 
    '2025-03-27-eticke-dilemy-a-riesenia-pri-vymahani-pohladavok-v-oblasti-b2b-ako-zachovat-obchodne-vztahy-a-reputaciu-v-kontexte-slovenskeho-prava.mdx'
  );
  
  // Verify the file exists
  if (!fs.existsSync(originalFilePath)) {
    console.error(`File not found: ${originalFilePath}`);
    return { success: false, error: 'File not found' };
  }
  
  try {
    // Read the original file
    const fileContent = fs.readFileSync(originalFilePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Create the new file path with the correct slug
    const newFilePath = path.join(
      process.cwd(),
      'content',
      'posts-sk',
      `2025-03-27-${correctSlug}.mdx`
    );
    
    // Write the fixed content to the new file
    const updatedContent = matter.stringify(content, data);
    fs.writeFileSync(newFilePath, updatedContent);
    
    console.log(`Created new file with correct slug: ${newFilePath}`);
    console.log(`The article should now be accessible at: /blog/${correctSlug}`);
    
    return {
      success: true,
      originalFile: path.basename(originalFilePath),
      newFile: path.basename(newFilePath)
    };
  } catch (error) {
    console.error('Error fixing article:', error);
    return { success: false, error: error.message };
  }
};

// Execute the fix
try {
  const result = fixSpecificArticle();
  console.log('Result:', result);
} catch (error) {
  console.error('Error executing article fix script:', error);
} 