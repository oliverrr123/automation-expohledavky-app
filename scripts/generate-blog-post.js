require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const axios = require('axios');
const matter = require('gray-matter');

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

// Image guidelines by language
const IMAGE_GUIDELINES = {
  cs: 'Obrázek musí být profesionální, související s tématem pohledávek, financí nebo práva. Ideálně fotografie kanceláří, právních dokumentů, finančních grafů nebo obchodních jednání.',
  sk: 'Obrázok musí byť profesionálny, súvisiaci s témou pohľadávok, financií alebo práva. Ideálne fotografie kancelárií, právnych dokumentov, finančných grafov alebo obchodných rokovaní.',
  de: 'Das Bild muss professionell sein und mit dem Thema Forderungen, Finanzen oder Recht zusammenhängen. Idealerweise Fotos von Büros, Rechtsdokumenten, Finanzdiagrammen oder Geschäftstreffen.',
  en: 'The image must be professional, related to the topic of receivables, finance, or law. Ideally photos of offices, legal documents, financial graphs, or business meetings.'
};

// Language-specific content configuration
const languageConfig = {
  cs: {
    topics: [
      'Vymáhání pohledávek v České republice',
      'Insolvence a její dopady na věřitele',
      'Preventivní opatření proti neplatičům',
      'Exekuční řízení - na co si dát pozor',
      'Vyrovnání pohledávek mimo soud',
      'Postoupení pohledávky - praktické rady',
      'Promlčení pohledávek v obchodních vztazích',
      'Jak správně vystavit fakturu, aby byla vymahatelná',
      'Předžalobní upomínka a její náležitosti',
      'Zástavní právo jako zajištění pohledávky'
    ],
    categories: ['Vymáhání pohledávek', 'Správa pohledávek', 'Exekuce', 'Insolvence', 'Právní aspekty', 'Finance'],
    authors: [
      {
        name: 'Jan Novák',
        position: 'Specialista na pohledávky',
        bio: 'Specialista na správu a vymáhání pohledávek s více než 10 lety zkušeností v oboru.'
      },
      {
        name: 'Mgr. Martin Dvořák',
        position: 'Právní specialista',
        bio: 'Právník specializující se na oblast obchodního práva a vymáhání pohledávek s praxí v advokacii.'
      },
      {
        name: 'Ing. Petra Svobodová',
        position: 'Finanční analytik',
        bio: 'Finanční analytička zaměřující se na řízení cash flow a prevenci platební neschopnosti.'
      }
    ],
    promptInstructions: 'Plně v českém jazyce',
    minWords: 1000,
    maxWords: 1500
  },
  sk: {
    topics: [
      'Vymáhanie pohľadávok na Slovensku',
      'Insolvenčné konanie a jeho vplyv na veriteľov',
      'Preventívne opatrenia proti neplatičom',
      'Exekučné konanie - na čo si dať pozor',
      'Mimosúdne vyrovnanie pohľadávok',
      'Postúpenie pohľadávky - praktické rady',
      'Premlčanie pohľadávok v obchodných vzťahoch',
      'Ako správne vystaviť faktúru, aby bola vymáhateľná',
      'Predžalobná upomienka a jej náležitosti',
      'Záložné právo ako zabezpečenie pohľadávky'
    ],
    categories: ['Vymáhanie pohľadávok', 'Správa pohľadávok', 'Exekúcia', 'Insolvencia', 'Právne aspekty', 'Financie'],
    authors: [
      {
        name: 'Ján Kováč',
        position: 'Špecialista na pohľadávky',
        bio: 'Špecialista na správu a vymáhanie pohľadávok s viac ako 10 rokmi skúseností v odbore.'
      },
      {
        name: 'Mgr. Martin Horváth',
        position: 'Právny špecialista',
        bio: 'Právnik špecializujúci sa na oblasť obchodného práva a vymáhania pohľadávok s praxou v advokácii.'
      },
      {
        name: 'Ing. Jana Svobodová',
        position: 'Finančný analytik',
        bio: 'Finančná analytička zameriavajúca sa na riadenie cash flow a prevenciu platobnej neschopnosti.'
      }
    ],
    promptInstructions: 'Plne v slovenskom jazyku',
    minWords: 1000,
    maxWords: 1500
  },
  de: {
    topics: [
      'Forderungsmanagement in Deutschland',
      'Insolvenz und ihre Auswirkungen auf Gläubiger',
      'Präventivmaßnahmen gegen Zahlungsausfälle',
      'Zwangsvollstreckung - Worauf zu achten ist',
      'Außergerichtliche Forderungsregulierung',
      'Forderungsabtretung - Praktische Ratschläge',
      'Verjährung von Forderungen im Geschäftsverkehr',
      'Korrekte Rechnungsstellung für Durchsetzbarkeit',
      'Mahnschreiben und seine Anforderungen',
      'Pfandrecht als Forderungssicherung'
    ],
    categories: ['Forderungsmanagement', 'Finanzanalyse', 'Inkasso', 'Insolvenz', 'Rechtliche Aspekte', 'Finanzen'],
    authors: [
      {
        name: 'Hans Schmidt',
        position: 'Forderungsmanagement-Spezialist',
        bio: 'Spezialist für Forderungsmanagement und Inkasso mit über 10 Jahren Erfahrung in der Branche.'
      },
      {
        name: 'Dr. Martin Weber',
        position: 'Rechtsexperte',
        bio: 'Jurist mit Spezialisierung auf Handelsrecht und Forderungsmanagement mit Erfahrung in der Anwaltschaft.'
      },
      {
        name: 'Dipl.-Kfm. Anna Fischer',
        position: 'Finanzanalystin',
        bio: 'Finanzanalystin mit Fokus auf Cashflow-Management und Prävention von Zahlungsunfähigkeit.'
      }
    ],
    promptInstructions: 'Vollständig in deutscher Sprache',
    minWords: 1000,
    maxWords: 1500
  },
  en: {
    topics: [
      'Receivables Management in International Business',
      'Insolvency and Its Impact on Creditors',
      'Preventive Measures Against Non-Payment',
      'Debt Collection Process - Key Considerations',
      'Out-of-Court Debt Settlement',
      'Debt Assignment - Practical Guidelines',
      'Limitation Periods in Commercial Relationships',
      'How to Issue Enforceable Invoices',
      'Pre-Legal Notice Requirements',
      'Security Interests in Debt Collection'
    ],
    categories: ['Receivables Management', 'Financial Analysis', 'Debt Collection', 'Insolvency', 'Legal Aspects', 'Finance'],
    authors: [
      {
        name: 'John Smith',
        position: 'Receivables Management Specialist',
        bio: 'Specialist in receivables management and debt collection with over 10 years of industry experience.'
      },
      {
        name: 'Martin Brown, Esq.',
        position: 'Legal Expert',
        bio: 'Attorney specializing in commercial law and debt collection with extensive practice experience.'
      },
      {
        name: 'Petra Wilson, CFA',
        position: 'Financial Analyst',
        bio: 'Financial analyst focusing on cash flow management and insolvency prevention.'
      }
    ],
    promptInstructions: 'Fully in English language',
    minWords: 1200,
    maxWords: 1800
  }
};

// Helper function to select a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to fetch an image from Unsplash with retry logic
async function getUnsplashImage(category, language) {
  console.log(`Getting image for category: ${category} in ${language}`);
  
  // Maximum number of retry attempts
  const MAX_RETRIES = 3;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Select a random collection from our curated business collections
      const collectionId = getRandomElement(BUSINESS_COLLECTIONS);
      
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

// Main function for generating an article
async function generateBlogPost(language = 'cs') {
  try {
    const config = languageConfig[language];
    if (!config) {
      throw new Error(`Unsupported language: ${language}`);
    }

    // 1. Select random topic and metadata
    const topic = getRandomElement(config.topics);
    const category = getRandomElement(config.categories);
    const author = getRandomElement(config.authors);
    
    console.log(`Generating article on topic: ${topic}`);
    
    // 2. Generate article using GPT-4
    const prompt = `Write a professional article about "${topic}" for a website focused on receivables management and debt collection.

The article must be:
- ${config.promptInstructions}
- Professional but understandable for business owners
- Structured with headings and subheadings (use markdown formatting)
- Include practical advice and tips
- Length between ${config.minWords}-${config.maxWords} words
- Contain current information relevant for the target market
- Category: ${category}
- Include at least 3 subheadings
- Include practical examples
- End with a conclusion section

Add a brief summary of key points at the end.

Format text in Markdown (## for headings, *italics*, **bold**, etc.). Skip the H1 heading as it will be automatically created from the title.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are a specialist in receivables management, legal aspects of debt administration and collection. Your task is to generate quality professional articles." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });
    
    const articleContent = completion.choices[0].message.content;
    
    // 3. Get title and other parameters
    const titlePrompt = `Based on the following article, create:
1. Catchy, professional title (max 70 characters)
2. Engaging subtitle (max 120 characters)
3. Brief description for meta description and excerpt (max 160 characters)
4. List of 4-6 relevant tags (keywords) separated by commas
5. Estimated reading time (in format "X min read")

Return the result as a JSON object with fields: title, subtitle, description, tags, and readTime.

Article:
${articleContent.substring(0, 1500)}...`;

    const titleCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: titlePrompt }],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    // Parse JSON from the response text
    const metaDataText = titleCompletion.choices[0].message.content;
    let metaData;
    try {
      // Extract JSON from the response if it's wrapped in code blocks or extra text
      const jsonMatch = metaDataText.match(/```json\s*(\{[\s\S]*?\})\s*```/) || 
                        metaDataText.match(/```\s*(\{[\s\S]*?\})\s*```/) || 
                        metaDataText.match(/(\{[\s\S]*?\})/);
                        
      const jsonString = jsonMatch ? jsonMatch[1] : metaDataText;
      metaData = JSON.parse(jsonString);
    } catch (error) {
      console.error("Failed to parse JSON metadata:", error);
      // Create default metadata if parsing fails
      metaData = {
        title: topic.substring(0, 70),
        subtitle: `Expert guide to ${topic.toLowerCase()}`,
        description: `Professional advice about ${topic.toLowerCase()} for businesses and financial specialists.`,
        tags: "receivables, finance, business, management",
        readTime: "8 min read"
      };
    }
    
    // 4. Get image from Unsplash
    console.log("Getting image from Unsplash");
    
    // Add image guidelines for the specific language
    const imageGuidelines = IMAGE_GUIDELINES[language];
    console.log(`Image guidelines: ${imageGuidelines}`);
    
    // Get image with retry logic
    const imageData = await getUnsplashImage(category, language);
    
    let imageFileName, imagePath, photographer, photographerUrl;
    
    if (imageData.success) {
      // Download and save image
      const imageDir = path.join(process.cwd(), 'public', 'images', 'blog');
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      
      imageFileName = `article-${language}-${Date.now()}.jpg`;
      imagePath = path.join(imageDir, imageFileName);
      
      const imageResponse = await axios.get(imageData.imageDownloadUrl, { 
        responseType: 'arraybuffer',
        timeout: 10000
      });
      
      fs.writeFileSync(imagePath, imageResponse.data);
      console.log(`Image saved: ${imagePath}`);
      
      photographer = imageData.photographer;
      photographerUrl = imageData.photographerUrl;
    } else {
      // Use a default image if we couldn't get one from Unsplash
      console.log("Using default image");
      imageFileName = 'default-business.jpg';
      
      // Check if default image exists, if not create it
      const defaultImagePath = path.join(process.cwd(), 'public', 'images', imageFileName);
      if (!fs.existsSync(defaultImagePath)) {
        // Create a placeholder image directory if needed
        const imageDir = path.join(process.cwd(), 'public', 'images');
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }
        
        // Copy a placeholder image or create an empty file
        fs.writeFileSync(defaultImagePath, '');
      }
      
      photographer = "Default Image";
      photographerUrl = "https://unsplash.com/";
    }
    
    // 5. Create MDX file
    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];
    
    // Create slug from title
    let slug = metaData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/[^a-z0-9]+/g, '-')     // replace special characters with dash
      .replace(/^-+|-+$/g, '');        // remove dashes from start and end
    
    // Add date to filename for better organization
    const fileName = `${formattedDate}-${slug}.mdx`;
    
    // Convert tags to array
    const tags = metaData.tags.split(',').map(tag => tag.trim());
    
    // Create frontmatter
    const frontMatter = {
      title: metaData.title,
      subtitle: metaData.subtitle,
      date: new Date().toISOString(),
      description: metaData.description,
      image: imageData.success ? `/images/blog/${imageFileName}` : `/images/${imageFileName}`,
      category: category,
      tags: tags,
      author: author.name,
      authorPosition: author.position,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: {
        photographer: photographer,
        url: photographerUrl
      },
      excerpt: metaData.description,
      imageGuidelines: imageGuidelines
    };
    
    // Combine frontmatter and content
    const fileContent = matter.stringify(articleContent, frontMatter);
    
    // Save MDX file in the appropriate language directory
    const postsDir = path.join(process.cwd(), 'content', `posts-${language}`);
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    const filePath = path.join(postsDir, fileName);
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`Article successfully generated and saved as: ${fileName}`);
    
    return {
      success: true,
      fileName,
      title: metaData.title,
      slug: slug,
      imagePath: imageData.success ? `/images/blog/${imageFileName}` : `/images/${imageFileName}`,
      imageCredit: {
        photographer: photographer,
        url: photographerUrl
      }
    };
    
  } catch (error) {
    console.error("Error generating article:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export the function
module.exports = generateBlogPost; 