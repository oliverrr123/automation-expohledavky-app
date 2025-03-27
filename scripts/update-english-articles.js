require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { OpenAI } = require('openai');
const axios = require('axios');

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Unsplash configuration
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY;

// Specific high-quality business image collection IDs from Unsplash
const BUSINESS_COLLECTIONS = [
  "jS3gJBzE9gg", // Business and Finance
  "Uj0WTblTZvE", // Office Life
  "Tj2lrJHg1Jw", // Business Collection
  "MIYm6qGy880"  // Corporate
];

// Function to fetch an image from Unsplash with retry logic
async function getUnsplashImage(category) {
  console.log(`Getting image for category: ${category}`);
  
  // Maximum number of retry attempts
  const MAX_RETRIES = 3;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Select a random collection from our curated business collections
      const collectionId = BUSINESS_COLLECTIONS[Math.floor(Math.random() * BUSINESS_COLLECTIONS.length)];
      
      // Combine category with business keywords for better results
      const imageKeywords = `business document ${category.toLowerCase()} office professional`;
      
      // Prepare the request URL with collection and query parameters
      const requestUrl = `https://api.unsplash.com/photos/random?collections=${collectionId}&query=${encodeURIComponent(imageKeywords)}&orientation=landscape`;
      
      console.log(`Attempt ${attempt}: Fetching from ${requestUrl}`);
      
      // Make the request to Unsplash API
      const unsplashResponse = await axios.get(requestUrl, {
        headers: {
          Authorization: `Client-ID ${unsplashAccessKey}`,
        },
        timeout: 5000 // 5 second timeout
      });
      
      // Extract image information
      const imageUrl = unsplashResponse.data.urls.regular;
      const imageDownloadUrl = unsplashResponse.data.links.download;
      const photographer = unsplashResponse.data.user.name;
      const photographerUrl = unsplashResponse.data.user.links.html;
      
      console.log(`Successfully retrieved image by ${photographer}`);
      
      return {
        imageUrl,
        imageDownloadUrl,
        photographer,
        photographerUrl,
        success: true
      };
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      // If we've reached max retries, return failure
      if (attempt === MAX_RETRIES) {
        console.error('All attempts to fetch image failed');
        return {
          success: false,
          error: error.message
        };
      }
      
      // Wait before trying again (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Function to expand article content
async function expandArticleContent(title, originalContent, category) {
  console.log(`Expanding content for article: ${title}`);
  
  const prompt = `You are expanding an article about receivables management and debt collection to make it more substantial and professional. 
  
The current article title is: "${title}" and the category is "${category}".

The current article content is very short. Please expand it into a comprehensive, professional article about the topic, including:

1. Introduction explaining the importance of the topic
2. At least 3 main sections with detailed information, practical tips, and best practices
3. Real-world examples or case studies
4. Professional insights and analysis
5. A conclusion with key takeaways
6. Use proper markdown formatting with ## for headers and other markdown features

The article should be about 1200-1500 words and targeted at business professionals and financial experts. Make it detailed, accurate, and practical.

Current content to expand:
${originalContent}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are a professional financial and legal writer specializing in receivables management, debt collection, and international finance. Your task is to expand articles with professional, detailed, and accurate content that provides real value to business readers." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error expanding article content:", error);
    return originalContent;
  }
}

// Function to update all English articles
async function updateEnglishArticles() {
  const englishDir = path.join(process.cwd(), 'content', 'posts-en');
  const blogImageDir = path.join(process.cwd(), 'public', 'images', 'blog', 'en');
  
  // Ensure blog image directory exists
  if (!fs.existsSync(blogImageDir)) {
    fs.mkdirSync(blogImageDir, { recursive: true });
  }
  
  // Get all English articles
  const files = fs.readdirSync(englishDir).filter(file => file.endsWith('.mdx'));
  console.log(`Found ${files.length} English articles to update.`);
  
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    try {
      const filePath = path.join(englishDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data: frontMatter, content } = matter(fileContent);
      
      console.log(`Processing: ${file}`);
      
      // 1. Expand the content
      const category = frontMatter.category || 'Receivables Management';
      const expandedContent = await expandArticleContent(frontMatter.title, content, category);
      
      // 2. Get a new image from Unsplash
      const imageData = await getUnsplashImage(category);
      
      if (imageData.success) {
        // Download and save the image
        const imageFileName = `en-${path.basename(file, '.mdx')}.jpg`;
        const imagePath = path.join(blogImageDir, imageFileName);
        
        try {
          const imageResponse = await axios.get(imageData.imageDownloadUrl, { 
            responseType: 'arraybuffer',
            timeout: 10000
          });
          
          fs.writeFileSync(imagePath, imageResponse.data);
          console.log(`Image saved: ${imagePath}`);
          
          // Update frontmatter image path
          frontMatter.image = `/images/blog/en/${imageFileName}`;
          
          // Update image credit
          frontMatter.imageCredit = {
            photographer: imageData.photographer,
            url: imageData.photographerUrl
          };
        } catch (imageError) {
          console.error(`Error saving image for ${file}:`, imageError.message);
          // Keep current image if there's an error
        }
      }
      
      // Add image guidelines
      frontMatter.imageGuidelines = 'The image must be professional, related to the topic of receivables, finance, or law. Ideally photos of offices, legal documents, financial graphs, or business meetings.';
      
      // Ensure the article has an excerpt
      if (!frontMatter.description) {
        frontMatter.description = `Professional guide to ${frontMatter.title.toLowerCase()} in international business finance and debt collection.`;
      }
      
      // Set excerpt to be the same as description
      frontMatter.excerpt = frontMatter.description;
      
      // Ensure the article has tags
      if (!frontMatter.tags) {
        frontMatter.tags = ['receivables', 'finance', 'international', 'debt collection'];
      }
      
      // Ensure the article has a read time
      if (!frontMatter.readTime) {
        frontMatter.readTime = '10 min';
      }
      
      // Save updated article
      const updatedFileContent = matter.stringify(expandedContent, frontMatter);
      fs.writeFileSync(filePath, updatedFileContent);
      
      console.log(`Updated article: ${file}`);
      updatedCount++;
    } catch (error) {
      console.error(`Error updating article ${file}:`, error);
      errorCount++;
    }
  }
  
  console.log('\nUpdate Summary:');
  console.log('----------------------------------------');
  console.log(`Total articles: ${files.length}`);
  console.log(`Successfully updated: ${updatedCount}`);
  console.log(`Failed to update: ${errorCount}`);
}

// Run the update
updateEnglishArticles().then(() => {
  console.log('English article update completed.');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 