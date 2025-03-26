const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Fix the specific article with 404 error
const fixSpecificArticle = () => {
  // Create correct article slug for the problematic article
  const articleTitle = 'Jak optimalizovat postavení věřitele v insolvenci v ČR';
  const correctSlug = 'jak-optimalizovat-postaveni-veritele-v-insolvenci-v-cr';
  const originalFilePath = path.join(
    process.cwd(), 
    'content', 
    'posts-cs', 
    '2025-03-27-optimalizace-postaveni-veritele-v-insolvencnim-rizeni-strategie-pro-maximalizaci-navratnosti-pohledavek-v-ceskem-pravnim-prostredi.mdx'
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
      'posts-cs',
      `2025-03-27-${correctSlug}.mdx`
    );
    
    // Fix the author image path if incorrect
    if (data.authorImage && data.authorImage.includes('jan-novk.jpg')) {
      // Fix the author image path to point to the placeholder image
      data.authorImage = '/images/authors/jan-novk.png';
      console.log('Fixed author image path to use the placeholder image');
    }
    
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