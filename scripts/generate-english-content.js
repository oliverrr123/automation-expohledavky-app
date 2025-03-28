const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const matter = require('gray-matter');

// Import shared utilities
const { 
  getRandomElement,
  createSlug,
  generateArticleContent, 
  getArticleImage, 
  generateMetadata,
  generateUniqueApproach,
  generateRandomTopic
} = require('./article-generation-utils');

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Categories for English articles
const categories = [
  'Receivables Management',
  'Financial Analysis',
  'Debt Collection',
  'Collection Ethics',
  'Insolvency',
  'Prevention'
];

// Authors for English articles
const authors = [
  {
    name: "John Smith",
    position: "Receivables Management Specialist",
    bio: "Specialist in receivables management and debt collection with over 10 years of experience in the industry."
  },
  {
    name: "Sarah Johnson, LLB",
    position: "Legal Advisor",
    bio: "Legal professional specializing in business law and receivables management with extensive experience in legal consulting."
  },
  {
    name: "Michael Brown, CFA",
    position: "Financial Analyst",
    bio: "Financial analyst focusing on cash flow management and prevention of payment defaults."
  }
];

// Function to check if text contains AI references
function containsAIReference(text) {
  const lowerText = text.toLowerCase();
  // Redukovaný seznam základních termínů
  const forbiddenTerms = [
    'ai', 'artificial intelligence', 'machine learning', 
    'robot', 'automated', 'digital transformation'
  ];
  
  return forbiddenTerms.some(term => lowerText.includes(term));
}

// Function to count AI references in text
function countAIReferences(text) {
  const lowerText = text.toLowerCase();
  // Redukovaný seznam základních termínů
  const forbiddenTerms = [
    'ai', 'artificial intelligence', 'machine learning', 
    'robot', 'automated', 'digital transformation'
  ];
  
  let count = 0;
  forbiddenTerms.forEach(term => {
    const regex = new RegExp(term, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      count += matches.length;
    }
  });
  
  return count;
}

// Function to get an image from Unsplash
async function getUnsplashImage(category, topic) {
  try {
    console.log('Fetching image from Unsplash...');
    
    // First, try to get a specific image related to the topic and category
    const specificQuery = `${topic} ${category} business professional`;
    
    // Check if we have internet connectivity and valid API key
    const testResponse = await fetch('https://api.unsplash.com/photos/random?client_id=' + process.env.UNSPLASH_ACCESS_KEY);
    const isApiWorking = testResponse.ok;
    
    let finalImagePath;
    
    if (isApiWorking) {
      // Use the Unsplash API properly with your access key
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(specificQuery)}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
      
      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.urls.regular;
        const photographerName = data.user.name;
        const photographerLink = data.user.links.html;
        
        // Create a more specific path based on category and topic
        const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        const imagePath = `/images/unsplash/${category.toLowerCase()}-${topicSlug}.jpg`;
        const localImagePath = path.join(process.cwd(), 'public', imagePath);
        
        // Download and save the image
        const imageBuffer = await fetch(imageUrl).then(res => res.buffer());
        
        // Ensure directory exists
        const dir = path.dirname(localImagePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(localImagePath, imageBuffer);
        
        console.log(`Saved image to: ${localImagePath}`);
        finalImagePath = imagePath;
        
        return {
          path: finalImagePath,
          photographer: {
            name: photographerName,
            link: photographerLink
          }
        };
      }
    }
    
    // Fallback to using source.unsplash.com if the API call failed
    console.log('Falling back to source.unsplash.com...');
    const fallbackCategory = category.toLowerCase();
    const fallbackTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const searchQuery = `${fallbackCategory},${fallbackTopic},business,professional`;
    
    const fallbackImageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(searchQuery)}`;
    const imageResponse = await fetch(fallbackImageUrl);
    
    if (imageResponse.ok) {
      // Extract image ID from final URL after redirects
      const finalUrl = imageResponse.url;
      const imageId = finalUrl.split('/').pop().split('?')[0];
      
      // Create a specific path for this image
      const imagePath = `/images/unsplash/${fallbackCategory}-${fallbackTopic}-${imageId}.jpg`;
      const localImagePath = path.join(process.cwd(), 'public', imagePath);
      
      // Download and save the image
      const imageBuffer = await fetch(finalUrl).then(res => res.buffer());
      
      // Ensure directory exists
      const dir = path.dirname(localImagePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(localImagePath, imageBuffer);
      
      console.log(`Saved fallback image to: ${localImagePath}`);
      finalImagePath = imagePath;
      
      return {
        path: finalImagePath,
        photographer: {
          name: "Unsplash",
          link: "https://unsplash.com/"
        }
      };
    }
    
    // If all else fails, return a default path
    console.error('Failed to get image from Unsplash, using default image');
    return {
      path: "/images/default-business.jpg",
      photographer: {
        name: "Default Image",
        link: "https://expohledavky.cz"
      }
    };
  } catch (error) {
    console.error('Error getting Unsplash image:', error);
    return {
      path: "/images/default-business.jpg",
      photographer: {
        name: "Default Image",
        link: "https://expohledavky.cz"
      }
    };
  }
}

// Main function to generate English content
async function generateEnglishContent() {
  try {
    console.log('=== Starting English content generation ===');
    
    // 1. Select category
    console.log('Selecting category...');
    const category = getRandomElement(categories);
    console.log(`Selected category: ${category}`);
    
    // 2. Generate topic using OpenAI
    console.log('Generating topic using OpenAI...');
    const topic = await generateRandomTopic(openai, category, 'en');
    console.log(`Generated topic: ${topic}`);
    
    // 3. Generate unique approach for the topic
    console.log('Generating unique approach to the topic...');
    const uniqueApproach = await generateUniqueApproach(openai, topic, category, 'en');
    
    // 4. Select author
    console.log('Selecting author...');
    const author = getRandomElement(authors);
    console.log(`Selected author: ${author.name}, ${author.position}`);
    
    // 5. Generate article content using OpenAI
    console.log('Generating article content using OpenAI...');
    const articleContent = await generateArticleContent(openai, topic, category, uniqueApproach, 'en');
    
    // 6. Generate metadata
    console.log('Generating article metadata...');
    const metaData = await generateMetadata(openai, topic, category, 'en');
    
    // 7. Get image from Unsplash
    console.log("Getting image from Unsplash...");
    const imageData = await getArticleImage(category, topic, 'en');
    
    // 8. Create MDX file
    console.log('Creating MDX file...');
    
    // Create a slug for the article
    const slug = createSlug(topic);
    
    // Format the date - next day from today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format frontmatter
    const frontMatter = {
      title: metaData.title || topic,
      subtitle: metaData.subtitle,
      date: tomorrow.toISOString(),
      description: metaData.description,
      image: imageData.path,
      category: category,
      tags: metaData.tags.split(',').map(tag => tag.trim()),
      author: author.name,
      authorPosition: author.position,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: imageData.photographer,
      excerpt: metaData.description
    };
    
    // Create MDX content
    const mdxContent = matter.stringify(articleContent, frontMatter);
    
    // Create filename with date and slug
    const date = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const fileName = `${date}-${slug}.mdx`;
    const filePath = path.join(process.cwd(), 'content', 'posts-en', fileName);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, mdxContent);
    console.log(`MDX file created: ${filePath}`);
    
    console.log('=================================================');
    console.log('🎉 English article generation successfully completed!');
    console.log('=================================================');
    console.log(`Title: ${metaData.title || topic}`);
    console.log(`Slug: ${slug}`);
    console.log(`Category: ${category}`);
    
    return {
      success: true,
      title: metaData.title || topic,
      slug: slug,
      filePath: filePath
    };
  } catch (error) {
    console.error('❌ Error generating English content:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateEnglishContent()
    .then((result) => {
      if (result.success) {
        console.log(`✅ English content generation process completed.`);
        process.exit(0);
      } else {
        console.error(`❌ Generation failed: ${result.error}`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fatal error in main process:', error);
      process.exit(1);
    });
} 

// Export the function for potential use by other scripts
module.exports = generateEnglishContent; 