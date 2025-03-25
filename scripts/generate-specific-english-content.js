const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const matter = require('gray-matter');

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Specific topic and category
const specificTopic = "Adapting Receivables Management Practices to Navigate Post-Brexit Trade Regulations: A Guide for UK and International Businesses";
const category = "Receivables Management";

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
  const forbiddenTerms = [
    'ai', 'artificial intelligence', 'machine learning', 'automation', 
    'robot', 'algorithm', 'digitalization', 'software', 'automatic', 
    'automated', 'big data', 'chatbot', 'digital transformation', 
    'technology', 'digital', 'tech', 'technological', 'smart', 'intelligent', 
    'ml', 'data science', 'predictive analytics', 'digital solution',
    'online platform', 'saas', 'cloud-based', 'neural', 'computer', 
    'digital tool', 'analytics', 'virtual', 'algorithm-based'
  ];
  
  return forbiddenTerms.some(term => lowerText.includes(term));
}

// Function to count AI references in text
function countAIReferences(text) {
  const lowerText = text.toLowerCase();
  const forbiddenTerms = [
    'ai', 'artificial intelligence', 'machine learning', 'automation', 
    'robot', 'algorithm', 'digitalization', 'software', 'automatic', 
    'automated', 'big data', 'chatbot', 'digital transformation', 
    'technology', 'digital', 'tech', 'technological', 'smart', 'intelligent', 
    'ml', 'data science', 'predictive analytics', 'digital solution',
    'online platform', 'saas', 'cloud-based', 'neural', 'computer', 
    'digital tool', 'analytics', 'virtual', 'algorithm-based'
  ];
  
  let count = 0;
  forbiddenTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      count += matches.length;
    }
  });
  
  return count;
}

// Function to generate a unique approach to the specific topic
async function generateUniqueApproach() {
  try {
    console.log("Generating unique approach to the Brexit receivables topic...");
    
    const prompt = `For the topic "${specificTopic}" in the category "${category}", suggest a unique angle or approach that would differentiate the article from common texts on this topic.

Suggest:
1. The main thesis or argument of the article
2. 3-4 key points that the article should cover
3. A unique perspective or approach to the topic

The article should focus specifically on how businesses can adapt their receivables management practices in the post-Brexit environment, considering:
- Changes in VAT regulations
- New customs procedures and documentation
- Contract law differences between UK and EU
- Financial implications for cash flow management
- Practical solutions for businesses of all sizes

IMPORTANT CONSTRAINTS:
- Avoid ANY mentions of technologies, AI, automation, digitalization, software, platforms, or tools
- Do NOT suggest any technology-based solutions or digital transformation approaches
- Focus on human factor, legal aspects, financial strategies, interpersonal relationships, and communication
- Emphasize practical aspects that don't require technology
- Prefer traditionally business, legal, and financial angles
- Focus on human expertise, manual processes, and traditional business practices
- Avoid terms like "smart", "intelligent", "digital", or "automated" solutions

Respond in JSON format with keys "mainThesis", "keyPoints", and "uniquePerspective".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a Brexit and international trade expert specializing in financial and legal topics, particularly related to receivables management. You avoid topics related to technologies and AI." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const approach = JSON.parse(completion.choices[0].message.content);
    
    // Check if the approach contains AI references
    if (containsAIReference(JSON.stringify(approach))) {
      console.log("Generated approach contains mentions of AI or technologies, generating new approach...");
      return generateUniqueApproach(); 
    }
    
    return approach;
  } catch (error) {
    console.error("Error generating approach to topic:", error);
    // Fallback approach without technology mentions
    return {
      mainThesis: "Post-Brexit trade regulations require businesses to fundamentally rethink their receivables management practices to maintain cash flow stability and ensure compliance with new cross-border requirements.",
      keyPoints: [
        "New VAT regulations and their impact on invoice processing and payment terms",
        "Revised customs documentation requirements affecting payment verification and debt collection",
        "Contract law changes influencing enforceability of payment terms",
        "Practical strategies for maintaining effective cash flow across UK-EU borders"
      ],
      uniquePerspective: "Viewing post-Brexit challenges as an opportunity to strengthen business relationships through clear communication and collaborative problem-solving, rather than purely as a compliance burden."
    };
  }
}

// Function to get an image from Unsplash
async function getUnsplashImage() {
  try {
    console.log("Finding an appropriate Brexit-related business image...");
    
    // Business/Brexit related search queries
    const searchTerms = [
      "uk eu business",
      "brexit trade documents",
      "international business meeting",
      "financial documents",
      "uk business handshake",
      "international contract signing",
      "business uk europe bridge"
    ];
    
    // Randomly select one of the search terms
    const searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchTerm)}&orientation=landscape&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
      { method: 'GET' }
    );
    
    if (response.ok) {
      const data = await response.json();
      return {
        url: data.urls.regular,
        credit: {
          name: data.user.name,
          link: data.user.links.html
        }
      };
    }
    
    // Fallback to a generic business image
    const fallbackResponse = await fetch(
      `https://api.unsplash.com/photos/random?query=business%20documents&orientation=landscape&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
      { method: 'GET' }
    );
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      return {
        url: fallbackData.urls.regular,
        credit: {
          name: fallbackData.user.name,
          link: fallbackData.user.links.html
        }
      };
    }
    
    throw new Error('Failed to get image from Unsplash');
  } catch (error) {
    console.error('Error getting image from Unsplash:', error);
    // Fallback to a default image
    return {
      url: '/images/default-brexit-business.jpg',
      credit: {
        name: 'Default Image',
        link: 'https://expohledavky.cz'
      }
    };
  }
}

// Function to generate article content
async function generateArticleContent(uniquePerspective) {
  try {
    console.log(`Generating article content for Brexit receivables topic...`);
    
    const prompt = `Create a professional and informative article on the topic "${specificTopic}" in the category "${category}". 
    
The article should have this unique angle: "${uniquePerspective.uniquePerspective}"

Main thesis: "${uniquePerspective.mainThesis}"

Key points to cover:
${uniquePerspective.keyPoints.map(point => `- ${point}`).join('\n')}

Follow these specifications:
1. Write the article in English, in a professional but accessible language for business owners and entrepreneurs
2. Focus on practical information relevant for UK and international businesses dealing with post-Brexit challenges
3. Use Markdown for formatting
4. Don't use H1 heading (it will be automatically generated from the title)
5. Use H2 headings (##) for main sections and H3 (###) for subsections
6. Format important terms in bold (**term**) and key phrases in italics (*phrase*)
7. Split text into short paragraphs (3-4 sentences)
8. Use bullet points for lists and numbered lists for processes
9. Include 1-2 practical examples or quotes from business leaders, formatted as block quotes (> quote)
10. The article length should be 1000-1500 words
11. Include a summary of key points at the end

The article should specifically address:
- How Brexit has changed VAT, customs, and regulatory environments affecting receivables
- Practical contract adjustments needed for UK-EU trade relationships
- Managing currency fluctuation risks in receivables
- Updated documentation requirements for cross-border invoicing
- Strategies for credit assessment in the new regulatory environment
- Effective collection approaches that respect both UK and EU jurisdictions
- Case example of a business successfully adapting to these changes

IMPORTANT CONSTRAINTS:
- COMPLETELY AVOID topics related to AI, artificial intelligence, machine learning, or automation
- The article MUST NOT mention technological solutions or digitalization as solutions to problems
- AVOID ALL terminology related to software, digital tools, platforms, or automation
- Focus on traditional business approaches, human expertise, legal aspects, negotiation, and strategy
- Emphasize practical aspects that rely on human skills and traditional business processes
- Do not use terms like "smart", "intelligent", "digital", "automated", "technological", or "online"
- Present solutions that are accessible to all businesses without requiring technology

The content must be current, factually correct, and relevant for businesses in the UK and EU.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are an expert on Brexit, international trade law, receivables management, and cross-border financial regulations. You write practical, factually accurate articles for business owners and financial managers, focusing on human-centered solutions without emphasizing technology." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });
    
    const content = completion.choices[0].message.content.trim();
    
    // Check if the content contains AI references
    if (countAIReferences(content) > 0) {
      console.log("Article content contains mentions of AI or technologies, generating new content...");
      return generateArticleContent(uniquePerspective);
    }
    
    return content;
  } catch (error) {
    console.error("Error generating article content:", error);
    // Fallback content without technology mentions
    return `
## The Changing Landscape of Receivables Management Post-Brexit

Brexit has fundamentally altered the trading relationship between the UK and EU, creating new challenges for businesses on both sides of the Channel. This article explores practical approaches to managing receivables in this new environment.

## Key Regulatory Changes Affecting Receivables

### VAT Considerations

The UK's departure from the EU VAT regime has significant implications for how businesses invoice, collect, and reconcile payments. UK businesses must now treat EU customers as international rather than domestic, affecting both the timing and process of receivables collection.

### New Customs Documentation Requirements

Proper documentation is now essential for smooth trading and timely payments:

- Commercial invoices must include additional details
- Proof of origin documentation affects tariff treatment
- Import/export declarations impact payment timing

## Practical Contract Adjustments

### Updating Payment Terms

Businesses should review and amend payment terms to account for:

1. Potential customs delays
2. New banking procedures for cross-border transfers
3. Currency fluctuation risks

### Jurisdiction and Dispute Resolution

> "We've completely revised our standard contracts to specify jurisdiction and applicable law, which has prevented several potential disputes with EU customers." - UK Manufacturing Business Owner

## Effective Collection Strategies in the New Environment

Successful receivables management now requires:

- Earlier involvement of credit control teams
- Clear communication about new documentation requirements
- Relationship-based approach to resolving payment delays
- Country-specific knowledge of collection practices within the EU

## Summary

The post-Brexit environment requires a proactive, relationship-focused approach to receivables management. By understanding the new regulatory requirements, updating contracts appropriately, and maintaining clear communication with trading partners, businesses can maintain healthy cash flow despite the additional complexities.
`;
  }
}

// Function to generate article metadata
async function generateMetadata(articleContent) {
  try {
    console.log("Generating article metadata...");
    
    const prompt = `Based on this article on the topic "${specificTopic}" in the category "${category}", generate the following metadata:

1. Catchy title (max 60 characters, should contain "Brexit")
2. Engaging subtitle (max 100 characters)
3. Short SEO description (max 160 characters)
4. 5-7 relevant tags separated by commas (should include "Brexit", "receivables", "international trade")
5. Estimated reading time in the format "X minute read"

IMPORTANT CONSTRAINTS:
- Avoid ANY mentions of AI, technologies, automation, software, digital tools, or platforms
- Do not use words like "smart", "intelligent", "digital", "automated", "technological", or "online"
- Prefer tags focused on finance, law, business relationships, and practical aspects
- Focus on traditional business concepts and human expertise

Respond in JSON format with keys "title", "subtitle", "description", "tags", and "readTime".

Article content:
${articleContent.substring(0, 1500)}...`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a specialist in SEO and metadata creation for expert articles on Brexit and international business. Your task is to create catchy but professional titles and descriptions without emphasis on technologies."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const metadata = JSON.parse(completion.choices[0].message.content);
    
    // Check if the metadata contains AI references
    if (containsAIReference(metadata.title) || 
        containsAIReference(metadata.subtitle) || 
        (metadata.tags && containsAIReference(metadata.tags))) {
      console.log("Metadata contains mentions of AI or technologies, generating new metadata...");
      return generateMetadata(articleContent);
    }
    
    return metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    
    // Create estimated reading time (assuming an average reading speed of 200 words per minute)
    const wordCount = articleContent.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    
    // Fallback metadata without technology mentions
    return {
      title: "Navigating Post-Brexit Receivables: A Practical Guide",
      subtitle: "Essential strategies for UK and EU businesses managing cross-border payments in the new trade environment",
      description: "Discover how to adapt your receivables management practices to post-Brexit regulations with this practical guide for UK and international businesses.",
      tags: "Brexit, receivables, international trade, cash flow, EU-UK trade, VAT changes, customs procedures",
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
async function generateSpecificBrexitContent() {
  try {
    console.log("Starting generation of Brexit receivables article...");
    
    // Generate unique approach for the specific topic
    console.log("Generating unique approach to Brexit topic...");
    const approachResult = await generateUniqueApproach();
    console.log(`Main thesis: ${approachResult.mainThesis}`);
    console.log(`Key points: ${approachResult.keyPoints.join(', ')}`);
    
    // Randomly select an author
    console.log("Selecting author...");
    const author = getRandomElement(authors);
    console.log(`Selected author: ${author.name}, ${author.position}`);
    
    // Generate article content
    console.log("Generating article content using OpenAI...");
    const articleContent = await generateArticleContent(approachResult);
    
    // Generate metadata
    console.log("Generating article metadata...");
    const metaData = await generateMetadata(articleContent);
    
    // Create SEO-friendly slug from the title
    const slug = createSlug(metaData.title);
    
    // Get an image from Unsplash
    console.log("Getting Brexit-related image from Unsplash...");
    const imageData = await getUnsplashImage();
    
    // Create MDX file
    console.log("Creating MDX file...");
    const frontMatter = {
      title: metaData.title,
      subtitle: metaData.subtitle,
      date: new Date().toISOString(),
      description: metaData.description,
      image: imageData.url,
      category: category,
      tags: metaData.tags.split(',').map(tag => tag.trim()),
      author: author.name,
      authorPosition: author.position,
      authorImage: author.image,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: imageData.credit,
      generatedTopic: specificTopic,
      uniqueApproach: approachResult.uniquePerspective
    };
    
    const mdxContent = `---
${Object.entries(frontMatter).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}:\n  ${value.map(item => `- "${item}"`).join('\n  ')}`;
  } else if (typeof value === 'object') {
    return `${key}:\n  ${Object.entries(value).map(([k, v]) => `${k}: "${v}"`).join('\n  ')}`;
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
    console.log("🎉 Brexit article generation successfully completed!");
    console.log("----------------------------------------");
    console.log(`Title: ${metaData.title}`);
    console.log(`Slug: ${slug}`);
    console.log(`Category: ${category}`);
    console.log("----------------------------------------");
    
    return {
      success: true,
      title: metaData.title,
      slug: slug,
      imagePath: imageData.url,
      category: category
    };
  } catch (error) {
    console.error("Error generating Brexit article:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the script
generateSpecificBrexitContent().catch(console.error); 