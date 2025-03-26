const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const matter = require('gray-matter');

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
    position: "Receivables Specialist",
    image: "/placeholder.svg?height=120&width=120",
    bio: "A specialist in receivables management and collection with more than 10 years of experience in the field."
  },
  {
    name: "Sarah Johnson",
    position: "Legal Specialist",
    image: "/placeholder.svg?height=120&width=120",
    bio: "A legal professional specializing in commercial law and debt collection with extensive practice in legal consultancy."
  },
  {
    name: "Michael Brown",
    position: "Financial Analyst",
    image: "/placeholder.svg?height=120&width=120",
    bio: "A financial analyst focusing on cash flow management and prevention of payment insolvency."
  }
];

// Function to select a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

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

// Function to generate random topic based on category
async function generateRandomTopic(category) {
  try {
    console.log(`Generating random topic for category: ${category}...`);
    
    const prompt = `Generate an original, interesting, and thought-provoking topic for an expert article about receivables in the category "${category}".
    
The topic should be:
1. Relevant for international business contexts and appealing to business professionals
2. Focused on practical and strategic aspects of receivables management and collection
3. Suitable for an in-depth expert article of 1500-2000 words
4. Specific enough to provide valuable insights rather than general overview
5. Innovative and exploring new perspectives or emerging trends

Please avoid topics related to AI, artificial intelligence, machine learning, or technology-driven solutions.
Return only the topic name without additional comments.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a specialist in receivables management and business finance with extensive expertise in creating engaging content for professionals. Generate practical, specific, and innovative topic ideas for expert articles." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Generated topic: ${topic}`);
    
    // Get a unique approach to the topic
    const approach = await generateUniqueApproach(topic, category);
    
    return {
      topic: topic,
      mainThesis: approach.mainThesis,
      keyPoints: approach.keyPoints,
      uniquePerspective: approach.uniquePerspective
    };
  } catch (error) {
    console.error("Error generating topic:", error);
    // Fallback topics in case of API failure
    const fallbackTopic = getRandomElement([
      `Current trends in ${category.toLowerCase()}`,
      `Practical guide: ${category}`,
      `How to optimize ${category.toLowerCase()} in ${new Date().getFullYear()}`,
      `Common mistakes in ${category.toLowerCase()}`,
      `The future of ${category.toLowerCase()} in a changing economic environment`,
      `Legal aspects of ${category.toLowerCase()} after law amendments`,
      `Financial impacts of proper ${category.toLowerCase()} management`,
      `Strategic approach to ${category.toLowerCase()} for small businesses`
    ]);
    
    return {
      topic: fallbackTopic,
      mainThesis: `It's important to understand aspects of ${fallbackTopic}.`,
      keyPoints: [
        "Legal framework and current changes",
        "Practical procedures and recommendations",
        "Case studies and practical examples",
        "Financial and legal aspects of the topic"
      ],
      uniquePerspective: `A perspective of efficiency and process optimization in the area of ${category.toLowerCase()}.`
    };
  }
}

// Function to generate a unique approach to a topic
async function generateUniqueApproach(topic, category) {
  try {
    console.log("Generating unique approach to the topic...");
    
    const prompt = `For the topic "${topic}" in the category "${category}", suggest a unique and sophisticated angle or approach for the article.

Suggest:
1. A compelling main thesis that provides a clear direction for a 1500-2000 word article
2. 5-6 key points to cover that would provide depth and comprehensive coverage
3. A truly unique perspective on the topic that differentiates it from standard treatments
4. A target audience specification and how this approach will particularly benefit them

Focus on business, legal, and financial perspectives, ensuring the approach combines theoretical knowledge with practical application.
Respond in JSON format with keys "mainThesis", "keyPoints", "uniquePerspective", and "targetAudience".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a creative content strategist specializing in financial and legal topics with expert knowledge in creating high-value content for business professionals." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });
    
    const approach = JSON.parse(completion.choices[0].message.content);
    
    return approach;
  } catch (error) {
    console.error("Error generating approach to topic:", error);
    // Fallback approach without technology mentions
    return {
      mainThesis: `It's important to understand practical and legal aspects of ${topic}.`,
      keyPoints: [
        "Legal framework and current changes",
        "Financial impacts and risks",
        "Effective communication procedures",
        "Strategic and preventive measures"
      ],
      uniquePerspective: `A perspective of balance between legal claims and maintaining business relationships in the area of ${category.toLowerCase()}.`
    };
  }
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

// Function to generate article content
async function generateArticleContent(topic, category, uniqueApproach) {
  try {
    console.log(`Generating article content for topic: ${topic}...`);

    const prompt = `Write a comprehensive, expert article on "${topic}" in the category of "${category}".

Main thesis: ${uniqueApproach.mainThesis}

Key points to cover:
${uniqueApproach.keyPoints.map(point => `- ${point}`).join('\n')}

Unique perspective: ${uniqueApproach.uniquePerspective}

The article should:
1. Be approximately 1500-2000 words with proper structure and sections
2. Include a compelling introduction with context and relevance
3. Have clearly defined sections with informative headings (use ## for main headings and ### for subheadings)
4. Include professional quotes and examples from industry experts (create realistic but fictional examples)
5. Present practical advice, processes, or frameworks
6. Contain relevant statistics or data points (create realistic but fictional data)
7. End with a substantial and actionable conclusion
8. Be written in a professional, authoritative tone suitable for business leaders and finance professionals

Do NOT include any references to AI, artificial intelligence, machine learning, robots, or automation technologies.
Format the article in Markdown.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an expert in financial management, receivables, and business operations with exceptional content creation skills. You create comprehensive, insightful articles that provide genuine value to business professionals." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    let content = completion.choices[0].message.content.trim();
    
    // Check for AI references and regenerate if found
    if (containsAIReference(content)) {
      console.log("AI references found in content, regenerating...");
      return generateArticleContent(topic, category, uniqueApproach);
    }
    
    return content;
  } catch (error) {
    console.error("Error generating article content:", error);
    // Fallback content without technology mentions
    return `
## Introduction to ${topic}

In today's business environment, the topic of "${topic}" is increasingly important. This article focuses on key aspects from the perspective of "${uniqueApproach.uniquePerspective}".

## Legal Framework

International laws in this area define several important rules that businesses must follow.

## Practical Procedures

For effective resolution of this issue, we recommend following these steps:

1. Analyze the current situation
2. Consult with an expert
3. Implement preventive measures

## Case Studies

> "In our company, we implemented a new communication system with debtors, which improved collection success by 35%." - Experienced entrepreneur

## Concluding Summary

The topic of "${topic}" requires a strategic approach and knowledge of current legislation. By implementing the recommended procedures, you can significantly improve your results.
`;
  }
}

// Function to generate article metadata
async function generateMetadata(topic, category, articleContent) {
  try {
    console.log("Generating article metadata...");
    
    const prompt = `Based on this article about "${topic}" in the category "${category}", generate:

1. Title (max 60 characters)
2. Subtitle (max 100 characters)
3. Short description (max 160 characters)
4. 5-7 relevant tags separated by commas
5. Estimated reading time in the format "X minute read"

Respond in JSON format with keys "title", "subtitle", "description", "tags", and "readTime".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a specialist in SEO and metadata creation for expert articles."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const metadata = JSON.parse(completion.choices[0].message.content);
    
    return metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    
    // Create estimated reading time (assuming an average reading speed of 200 words per minute)
    const wordCount = articleContent.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    
    // Fallback metadata without technology mentions
    return {
      title: topic,
      subtitle: `Practical information about ${topic} for international businesses`,
      description: `Expert article on ${topic} in the category ${category}. Practical advice and tips for entrepreneurs.`,
      tags: `${category.toLowerCase()}, receivables, receivables management, international business, entrepreneurship, legal aspects`,
      readTime: `${readTimeMinutes} minute read`
    };
  }
}

// Create a slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Main function to control the article generation process
async function generateEnglishContent() {
  try {
    // 1. Randomly select a category from the predefined list
    console.log("Selecting category...");
    const category = getRandomElement(categories);
    console.log(`Selected category: ${category}`);
    
    // 2. Generate a random topic within the selected category
    console.log("Generating topic using OpenAI...");
    const topicResult = await generateRandomTopic(category);
    const topic = topicResult.topic;
    console.log(`Generated topic: ${topic}`);
    
    // 3. Randomly select an author
    console.log("Selecting author...");
    const author = getRandomElement(authors);
    console.log(`Selected author: ${author.name}, ${author.position}`);
    
    // 4. Generate article content
    console.log("Generating article content using OpenAI...");
    const articleContent = await generateArticleContent(topic, category, topicResult.uniquePerspective);
    
    // 5. Generate metadata (title, subtitle, description, tags, reading time)
    console.log("Generating article metadata...");
    const metaData = await generateMetadata(topic, category, articleContent);
    
    // Create SEO-friendly slug from the title
    const slug = createSlug(metaData.title);
    
    // 6. Get an image from Unsplash
    console.log("Getting image from Unsplash...");
    const imageData = await getUnsplashImage(category, topic);
    
    // 7. Create MDX file
    console.log("Creating MDX file...");
    const frontMatter = {
      title: metaData.title,
      subtitle: metaData.subtitle,
      date: new Date().toISOString(),
      description: metaData.description,
      image: imageData.path,
      category: category,
      tags: metaData.tags.split(',').map(tag => tag.trim()),
      author: author.name,
      authorPosition: author.position,
      authorImage: author.image,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: imageData.photographer,
      generatedTopic: topic,
      uniqueApproach: topicResult.uniquePerspective
    };
    
    const mdxContent = `---
${Object.entries(frontMatter).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}:\n  ${value.map(item => `- "${item}"`).join('\n  ')}`;
  } else if (typeof value === 'object') {
    return `${key}:\n  ${Object.entries(value).map(([k, v]) => `${k}: '${v}'`).join('\n  ')}`;
  } else {
    return `${key}: "${String(value).replace(/"/g, '\\"')}"`;
  }
}).join('\n')}
---

${articleContent}`;
    
    // Create directory if it doesn't exist
    const contentDir = path.join(process.cwd(), 'content', 'posts-en');
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    // Format the current date for the filename (YYYY-MM-DD)
    const today = new Date();
    const datePrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Save MDX file
    const mdxFilePath = path.join(contentDir, `${datePrefix}-${slug}.mdx`);
    fs.writeFileSync(mdxFilePath, mdxContent);
    console.log(`MDX file created: ${mdxFilePath}`);
    
    console.log("----------------------------------------");
    console.log("🎉 Article generation successfully completed!");
    console.log("----------------------------------------");
    console.log(`Title: ${metaData.title}`);
    console.log(`Slug: ${slug}`);
    console.log(`Category: ${category}`);
    console.log("----------------------------------------");
    
    return {
      success: true,
      title: metaData.title,
      slug: slug,
      imagePath: imageData.path,
      topic: topic,
      category: category
    };
  } catch (error) {
    console.error("Error generating article:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the script
generateEnglishContent().catch(console.error); 