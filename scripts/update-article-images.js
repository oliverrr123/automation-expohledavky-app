const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Track used images to avoid duplicates
const usedImageUrls = new Set();

// Curated list of business/office photos from Unsplash with direct URLs
const BUSINESS_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&w=1600&h=900&q=80',
    name: 'Business Meeting',
    credit: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&h=900&q=80',
    name: 'Office Space',
    credit: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&h=900&q=80',
    name: 'Corporate Building',
    credit: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&h=900&q=80',
    name: 'Business Analysis',
    credit: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&h=900&q=80',
    name: 'Business Handshake',
    credit: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&h=900&q=80',
    name: 'Business Team',
    credit: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&h=900&q=80',
    name: 'Office Work',
    credit: 'Unsplash'
  }
];

/**
 * Get a random Unsplash image from our curated list
 */
async function getUnsplashImage(retryCount = 0) {
  const MAX_RETRIES = 3;
  
  try {
    // Get unused photos
    const unusedPhotos = BUSINESS_PHOTOS.filter(photo => !usedImageUrls.has(photo.url));
    
    // If all photos are used, reset the tracking
    if (unusedPhotos.length === 0) {
      usedImageUrls.clear();
      return getUnsplashImage(retryCount);
    }
    
    // Get a random unused photo
    const photo = unusedPhotos[Math.floor(Math.random() * unusedPhotos.length)];
    
    // Add the URL to our tracking set
    usedImageUrls.add(photo.url);
    
    return {
      url: photo.url,
      credit: {
        name: photo.credit,
        link: 'https://unsplash.com'
      }
    };
  } catch (error) {
    console.error('Error getting Unsplash image:', error);
    
    // If we've tried multiple times and still failed, use a default image
    if (retryCount >= MAX_RETRIES) {
      return {
        url: '/images/default-business.jpg',
        credit: {
          name: 'Default Image',
          link: 'https://expohledavky.cz'
        }
      };
    }
    
    return getUnsplashImage(retryCount + 1);
  }
}

/**
 * Update images for all English articles
 */
async function updateEnglishArticles() {
  const contentDir = path.join(process.cwd(), 'content', 'posts-en');
  
  if (!fs.existsSync(contentDir)) {
    console.log('English articles directory not found');
    return { processed: 0, updated: 0, skipped: 0 };
  }

  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));
  let processed = 0, updated = 0, skipped = 0;

  console.log(`Found ${files.length} English articles to process\n`);

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      processed++;

      // Get new image from Unsplash
      console.log(`\nProcessing: ${file}`);
      const imageData = await getUnsplashImage();
      
      // Update frontmatter with new image
      data.image = imageData.url;
      data.imageCredit = imageData.credit;

      // Write updated content back to file
      const updatedContent = matter.stringify(content, data);
      fs.writeFileSync(filePath, updatedContent);
      
      console.log(`✓ Updated image for ${file}`);
      console.log(`  New image: ${imageData.url}`);
      console.log(`  Credit: ${imageData.credit.name}`);
      updated++;
      
      // Add a small delay between files
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
      skipped++;
    }
  }

  return { processed, updated, skipped };
}

/**
 * Main function to update English article images
 */
async function updateAllArticleImages() {
  console.log('Starting English article image update process...');
  console.log('This will update all English articles with new, unique images from Unsplash');
  console.log('----------------------------------------');

  const results = await updateEnglishArticles();

  // Print summary
  console.log('\nUpdate Summary:');
  console.log('----------------------------------------');
  console.log('English Articles:');
  console.log(`  Processed: ${results.processed}`);
  console.log(`  Updated: ${results.updated}`);
  console.log(`  Skipped: ${results.skipped}`);
  console.log('----------------------------------------');
}

// Run the update if called directly
if (require.main === module) {
  updateAllArticleImages().catch(console.error);
}

module.exports = {
  updateAllArticleImages,
  updateEnglishArticles,
  getUnsplashImage
}; 