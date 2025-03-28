// Shared utilities for article generation across languages
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const crypto = require('crypto');
const axios = require('axios');
const { createCanvas } = require('canvas');

// Function to check if text contains AI-related terms
function containsAIReference(text) {
  const aiPattern = /\b(ai|artificial intelligence|machine learning|ml|gpt|chatgpt|openai|language model|neural network|deep learning)\b/i;
  return aiPattern.test(text);
}

// Function to select a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to create a slug from a title
function createSlug(title) {
  return title
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to generate article content with optimized prompts by language
async function generateArticleContent(openai, topic, category, uniqueApproach, language) {
  try {
    console.log(`Generating article content for topic: ${topic} in language: ${language}...`);
    
    let systemPrompt = '';
    let userPrompt = '';
    
    // Language-specific prompts
    if (language === 'en') {
      // English prompts
      systemPrompt = `You are an expert in ${category} with extensive industry experience. Your articles are detailed, authoritative, and backed by real-world experience and research.`;
      
      userPrompt = `Write a comprehensive article on "${topic}" for business professionals in ${category}.

The article should:
1. Be 1500-2000 words with a professional, engaging tone
2. Follow this structure:
   - Introduction establishing the topic's importance
   - Main thesis: ${uniqueApproach.mainThesis}
   - Detailed sections covering: ${uniqueApproach.keyPoints.join(', ')}
   - Your unique perspective: ${uniqueApproach.uniquePerspective}
   - Practical advice and actionable takeaways
   - Conclusion reinforcing the main thesis

Include:
- 1-2 quotes from fictional industry experts
- 2-3 specific statistics or data points to support your arguments
- Clear headings (## for main sections, ### for subsections)
- Bullet points or numbered lists where appropriate

STRICTLY AVOID any mention of AI, artificial intelligence, or language models.`;

    } else if (language === 'cs') {
      // Czech prompts
      systemPrompt = `Jste odborník v oblasti ${category} s rozsáhlými zkušenostmi z praxe. Vaše články jsou detailní, autoritativní a podložené skutečnými zkušenostmi.`;
      
      userPrompt = `Napište komplexní článek na téma: "${topic}" pro obchodní profesionály v oblasti ${category}.

Článek by měl:
1. Mít 1500-2000 slov s profesionálním, poutavým tónem
2. Sledovat tuto strukturu:
   - Úvod stanovující důležitost tématu
   - Hlavní teze: ${uniqueApproach.mainThesis}
   - Detailní sekce pokrývající: ${uniqueApproach.keyPoints.join(', ')}
   - Váš jedinečný pohled: ${uniqueApproach.uniquePerspective}
   - Praktické rady a realizovatelné závěry
   - Závěr posilující hlavní tezi

Zahrňte:
- 1-2 citáty od fiktivních odborníků z oboru
- 2-3 konkrétní statistiky nebo datové body na podporu vašich argumentů
- Jasné nadpisy (## pro hlavní sekce, ### pro podsekce)
- Odrážky nebo číslované seznamy, kde je to vhodné

PŘÍSNĚ SE VYHNĚTE jakýmkoli zmínkám o umělé inteligenci nebo jazykových modelech.`;

    } else if (language === 'sk') {
      // Slovak prompts
      systemPrompt = `Ste odborník v oblasti ${category} s rozsiahlymi skúsenosťami z praxe. Vaše články sú detailné, autoritatívne a podložené skutočnými skúsenosťami.`;
      
      userPrompt = `Napíšte komplexný článok na tému: "${topic}" pre obchodných profesionálov v oblasti ${category}.

Článok by mal:
1. Mať 1500-2000 slov s profesionálnym, pútavým tónom
2. Sledovať túto štruktúru:
   - Úvod stanovujúci dôležitosť témy
   - Hlavná téza: ${uniqueApproach.mainThesis}
   - Detailné sekcie pokrývajúce: ${uniqueApproach.keyPoints.join(', ')}
   - Váš jedinečný pohľad: ${uniqueApproach.uniquePerspective}
   - Praktické rady a realizovateľné závery
   - Záver posilňujúci hlavnú tézu

Zahrňte:
- 1-2 citáty od fiktívnych odborníkov z odboru
- 2-3 konkrétne štatistiky alebo dátové body na podporu vašich argumentov
- Jasné nadpisy (## pre hlavné sekcie, ### pre podsekcie)
- Odrážky alebo číslované zoznamy, kde je to vhodné

STRIKTNE SA VYHNITE akýmkoľvek zmienkam o umelej inteligencii alebo jazykových modeloch.`;

    } else if (language === 'de') {
      // German prompts
      systemPrompt = `Sie sind ein Experte auf dem Gebiet ${category} mit umfangreicher Branchenerfahrung. Ihre Artikel sind detailliert, maßgeblich und durch reale Erfahrungen gestützt.`;
      
      userPrompt = `Schreiben Sie einen umfassenden Artikel zum Thema: "${topic}" für Geschäftsfachleute im Bereich ${category}.

Der Artikel sollte:
1. 1500-2000 Wörter mit einem professionellen, ansprechenden Ton haben
2. Dieser Struktur folgen:
   - Einleitung, die die Bedeutung des Themas hervorhebt
   - Hauptthese: ${uniqueApproach.mainThesis}
   - Detaillierte Abschnitte zu: ${uniqueApproach.keyPoints.join(', ')}
   - Ihre einzigartige Perspektive: ${uniqueApproach.uniquePerspective}
   - Praktische Ratschläge und umsetzbare Erkenntnisse
   - Schlussfolgerung, die die Hauptthese verstärkt

Berücksichtigen Sie:
- 1-2 Zitate von fiktiven Branchenexperten
- 2-3 spezifische Statistiken oder Datenpunkte zur Unterstützung Ihrer Argumente
- Klare Überschriften (## für Hauptabschnitte, ### für Unterabschnitte)
- Aufzählungspunkte oder nummerierte Listen, wo angebracht

VERMEIDEN SIE STRIKT jegliche Erwähnung von künstlicher Intelligenz oder Sprachmodellen.`;
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    // Generate article content with retry logic
    let attempts = 0;
    let articleContent = '';
    
    // Keep trying until we get content without AI references or hit max attempts
    while (attempts < 3) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });
      
      articleContent = completion.choices[0].message.content;
      
      // Check if the article contains AI references
      if (!containsAIReference(articleContent)) {
        return articleContent;
      }
      
      console.log(`Attempt ${attempts + 1}: Article contained AI references. Retrying...`);
      attempts++;
    }
    
    // If we've reached here, clean the content manually by replacing problematic phrases
    console.log("Cleaning AI references from the content...");
    articleContent = articleContent.replace(/\b(AI|artificial intelligence|language model|machine learning|ML|GPT|ChatGPT|OpenAI|neural network|deep learning)\b/gi, 'advanced analysis');
    articleContent = articleContent.replace(/As an AI|As a language model|As an assistant/gi, 'As an expert');
    
    return articleContent;
  } catch (error) {
    console.error("Error generating article content:", error);
    // Return a fallback message if the API call fails
    return `# ${topic}\n\nThis article explores various aspects of ${topic} within the context of ${category}.\n\n## Key Points\n${uniqueApproach.keyPoints.map(point => `- ${point}`).join('\n')}\n\n## Unique Perspective\n${uniqueApproach.uniquePerspective}\n\n*Note: This is a placeholder content due to an error in content generation.*`;
  }
}

// Function to get article image from Unsplash
async function getArticleImage(category, topic) {
  try {
    console.log(`Getting image for topic: ${topic}, category: ${category}`);
    
    // Search terms for better Unsplash results based on financial/legal content
    const searchTerms = [
      'business', 'finance', 'office', 'professional', 
      'document', 'contract', 'meeting', 'legal', 'corporate'
    ];
    
    // Select random search term and combine with category
    const searchTerm = `${getRandomElement(searchTerms)} ${category}`;
    
    // Create a timestamp-based unique ID to prevent caching
    const timestamp = Date.now();
    const imageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(searchTerm)}&t=${timestamp}`;
    
    // Create a specific path for this image
    const slug = createSlug(topic);
    const imageName = `${slug}-${timestamp}.jpg`;
    const imagePath = `/images/blog/${language}/${imageName}`;
    const localImagePath = path.join(process.cwd(), 'public', imagePath);
    
    // Ensure directory exists
    const dir = path.dirname(localImagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Download the image
    const response = await fetch(imageUrl);
    if (response.ok) {
      const buffer = await response.buffer();
      fs.writeFileSync(localImagePath, buffer);
      
      return {
        path: imagePath,
        photographer: {
          name: "Unsplash",
          link: "https://unsplash.com"
        }
      };
    }
    
    throw new Error("Failed to download image from Unsplash");
  } catch (error) {
    console.error("Error getting image:", error);
    return {
      path: "/images/placeholder.jpg",
      photographer: {
        name: "Placeholder",
        link: "#"
      }
    };
  }
}

// Function to generate metadata for articles
async function generateMetadata(openai, topic, category, language) {
  try {
    console.log(`Generating metadata for ${language} article on "${topic}"...`);
    
    let prompt;
    
    if (language === 'en') {
      prompt = `Generate metadata for an article titled "${topic}" in the category "${category}".
Include:
1. Title (max 60 chars)
2. Subtitle (max 100 chars)
3. Description (max 160 chars)
4. Tags (5-7 relevant keywords)
5. Read time (in "X minute read" format)
Respond in JSON format with keys: title, subtitle, description, tags, readTime.`;
    } else if (language === 'cs') {
      prompt = `Vygenerujte metadata pro článek s názvem "${topic}" v kategorii "${category}".
Zahrňte:
1. Titulek (max 60 znaků)
2. Podtitulek (max 100 znaků)
3. Popis (max 160 znaků)
4. Tagy (5-7 relevantních klíčových slov)
5. Doba čtení (ve formátu "X minut čtení")
Odpovězte ve formátu JSON s klíči: title, subtitle, description, tags, readTime.`;
    } else if (language === 'sk') {
      prompt = `Vygenerujte metadáta pre článok s názvom "${topic}" v kategórii "${category}".
Zahrňte:
1. Titulok (max 60 znakov)
2. Podtitulok (max 100 znakov)
3. Popis (max 160 znakov)
4. Tagy (5-7 relevantných kľúčových slov)
5. Čas čítania (vo formáte "X minút čítania")
Odpovedzte vo formáte JSON s kľúčmi: title, subtitle, description, tags, readTime.`;
    } else if (language === 'de') {
      prompt = `Generieren Sie Metadaten für einen Artikel mit dem Titel "${topic}" in der Kategorie "${category}".
Beinhalten Sie:
1. Titel (max. 60 Zeichen)
2. Untertitel (max. 100 Zeichen)
3. Beschreibung (max. 160 Zeichen)
4. Tags (5-7 relevante Schlüsselwörter)
5. Lesezeit (im Format "X Minuten Lesezeit")
Antworten Sie im JSON-Format mit den Schlüsseln: title, subtitle, description, tags, readTime.`;
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a metadata specialist for professional business articles." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata
    return {
      title: topic,
      subtitle: `Professional insights on ${topic}`,
      description: `Learn about ${topic} in the context of ${category} with practical advice for businesses.`,
      tags: `${category}, business, professional, advice, management`,
      readTime: "8 minute read"
    };
  }
}

// Function to get a unique approach for an article topic
async function generateUniqueApproach(openai, topic, category, language) {
  try {
    console.log(`Generating unique approach for ${language} article on "${topic}"...`);
    
    let prompt;
    
    if (language === 'en') {
      prompt = `For the topic "${topic}" in the category "${category}", suggest a unique approach for an expert article.
Provide:
1. A compelling main thesis that provides clear direction
2. 5-6 key points to cover that would provide depth and comprehensive coverage
3. A unique perspective that differentiates it from standard treatments
Respond in JSON format with keys: mainThesis, keyPoints, uniquePerspective.`;
    } else if (language === 'cs') {
      prompt = `Pro téma "${topic}" v kategorii "${category}" navrhněte jedinečný přístup pro odborný článek.
Poskytněte:
1. Přesvědčivou hlavní tezi, která poskytuje jasný směr
2. 5-6 klíčových bodů k pokrytí, které poskytnou hloubku a komplexní pokrytí
3. Jedinečnou perspektivu, která jej odliší od standardních pojednání
Odpovězte ve formátu JSON s klíči: mainThesis, keyPoints, uniquePerspective.`;
    } else if (language === 'sk') {
      prompt = `Pre tému "${topic}" v kategórii "${category}" navrhnite jedinečný prístup pre odborný článok.
Poskytnite:
1. Presvedčivú hlavnú tézu, ktorá poskytuje jasný smer
2. 5-6 kľúčových bodov na pokrytie, ktoré poskytnú hĺbku a komplexné pokrytie
3. Jedinečnú perspektívu, ktorá ho odlíši od štandardných pojednávaní
Odpovedzte vo formáte JSON s kľúčmi: mainThesis, keyPoints, uniquePerspective.`;
    } else if (language === 'de') {
      prompt = `Für das Thema "${topic}" in der Kategorie "${category}" schlagen Sie einen einzigartigen Ansatz für einen Fachartikel vor.
Bieten Sie:
1. Eine überzeugende Hauptthese, die eine klare Richtung vorgibt
2. 5-6 Schlüsselpunkte zur Abdeckung, die Tiefe und umfassende Abdeckung bieten würden
3. Eine einzigartige Perspektive, die ihn von Standardbehandlungen unterscheidet
Antworten Sie im JSON-Format mit den Schlüsseln: mainThesis, keyPoints, uniquePerspective.`;
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a content strategy specialist for professional articles." },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error generating unique approach:", error);
    // Fallback approach
    return {
      mainThesis: `A strategic approach to ${topic} can significantly improve outcomes for businesses.`,
      keyPoints: [
        "Legal framework and compliance",
        "Financial implications",
        "Effective communication strategies",
        "Risk management and prevention",
        "Long-term relationship maintenance",
        "Industry best practices"
      ],
      uniquePerspective: `A balanced approach that combines legal rigor with relationship preservation.`
    };
  }
}

// Function to generate a random topic for an article
async function generateRandomTopic(openai, category, language) {
  try {
    console.log(`Generating random topic for ${language} article in category: ${category}...`);
    
    let prompt;
    
    if (language === 'en') {
      prompt = `Generate an original, thought-provoking topic for a professional article about "${category}".
The topic should be:
1. Relevant for business professionals
2. Focused on practical and strategic aspects
3. Suitable for an in-depth expert article of 1500-2000 words
4. Specific enough to provide valuable insights
5. Innovative and exploring new perspectives
Avoid topics related to AI or technology. Return only the topic name.`;
    } else if (language === 'cs') {
      prompt = `Vygenerujte originální, podnětné téma pro odborný článek o "${category}".
Téma by mělo být:
1. Relevantní pro obchodní profesionály
2. Zaměřené na praktické a strategické aspekty
3. Vhodné pro hloubkový odborný článek o délce 1500-2000 slov
4. Dostatečně specifické, aby poskytovalo hodnotné poznatky
5. Inovativní a zkoumající nové perspektivy
Vyhněte se tématům souvisejícím s AI nebo technologiemi. Vraťte pouze název tématu.`;
    } else if (language === 'sk') {
      prompt = `Vygenerujte originálnu, podnetnú tému pre odborný článok o "${category}".
Téma by malo byť:
1. Relevantné pre obchodných profesionálov
2. Zamerané na praktické a strategické aspekty
3. Vhodné pre hĺbkový odborný článok s dĺžkou 1500-2000 slov
4. Dostatočne špecifické, aby poskytovalo hodnotné poznatky
5. Inovatívne a skúmajúce nové perspektívy
Vyhnite sa témam súvisiacim s AI alebo technológiami. Vráťte iba názov témy.`;
    } else if (language === 'de') {
      prompt = `Generieren Sie ein originelles, zum Nachdenken anregendes Thema für einen Fachartikel über "${category}".
Das Thema sollte:
1. Relevant für Geschäftsfachleute sein
2. Sich auf praktische und strategische Aspekte konzentrieren
3. Geeignet für einen vertiefenden Fachartikel von 1500-2000 Wörtern sein
4. Spezifisch genug sein, um wertvolle Erkenntnisse zu liefern
5. Innovativ sein und neue Perspektiven erkunden
Vermeiden Sie Themen im Zusammenhang mit KI oder Technologie. Geben Sie nur den Themennamen zurück.`;
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a specialist in generating business content ideas." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Generated topic: ${topic}`);
    
    return topic;
  } catch (error) {
    console.error("Error generating topic:", error);
    // Fallback topics based on category and language
    let fallbackTopics = {
      en: [
        `Strategic Approaches to Modern ${category}`,
        `Optimizing ${category} Processes for Small Businesses`,
        `Legal Aspects of ${category} in International Business`,
        `Building Client Relationships Through Effective ${category}`
      ],
      cs: [
        `Strategické přístupy k moderní ${category}`,
        `Optimalizace procesů ${category} pro malé podniky`,
        `Právní aspekty ${category} v mezinárodním obchodě`,
        `Budování vztahů s klienty prostřednictvím efektivního ${category}`
      ],
      sk: [
        `Strategické prístupy k modernej ${category}`,
        `Optimalizácia procesov ${category} pre malé podniky`,
        `Právne aspekty ${category} v medzinárodnom obchode`,
        `Budovanie vzťahov s klientmi prostredníctvom efektívneho ${category}`
      ],
      de: [
        `Strategische Ansätze zum modernen ${category}`,
        `Optimierung von ${category}-Prozessen für kleine Unternehmen`,
        `Rechtliche Aspekte von ${category} im internationalen Geschäft`,
        `Aufbau von Kundenbeziehungen durch effektives ${category}`
      ]
    };
    
    return getRandomElement(fallbackTopics[language] || fallbackTopics.en);
  }
}

// Function to get author profile image
async function getAuthorProfileImage(author, language) {
  try {
    console.log(`Getting profile image for author: ${author.name}, gender: ${author.gender}`);
    
    // Format filename
    const authorSlug = author.name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
    const fileName = `${authorSlug}.jpg`;
    
    // Define path for the author image based on language
    const imagePath = `public/images/authors/${language}/${fileName}`;
    const publicPath = `/images/authors/${language}/${fileName}`;
    
    // Create directory if it doesn't exist
    const dir = path.dirname(path.join(process.cwd(), imagePath));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // If file already exists, return the path
    if (fs.existsSync(path.join(process.cwd(), imagePath))) {
      console.log(`Author image already exists: ${publicPath}`);
      return publicPath;
    }
    
    // Use different queries based on gender and profession
    let imageQuery = author.gender === 'female' ? 'businesswoman professional headshot' : 'businessman professional headshot';
    
    // Add profession keyword if available
    if (author.position) {
      // Extract profession-related keywords
      const positionKeywords = author.position.toLowerCase();
      if (positionKeywords.includes('finanční') || positionKeywords.includes('finančný') || positionKeywords.includes('finanz')) {
        imageQuery += ' finance';
      } else if (positionKeywords.includes('právní') || positionKeywords.includes('právny') || positionKeywords.includes('rechts')) {
        imageQuery += ' legal';
      }
    }
    
    console.log(`Searching for author image with query: ${imageQuery}`);
    
    // Use source.unsplash.com direct URL
    const fallbackUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(imageQuery)}`;
    
    try {
      const imageResponse = await fetch(fallbackUrl);
      const buffer = await imageResponse.buffer();
      
      fs.writeFileSync(path.join(process.cwd(), imagePath), buffer);
      console.log(`Author image saved to: ${imagePath}`);
      
      return publicPath;
    } catch (error) {
      console.error("Error downloading author image:", error);
      // Return a default image path if all else fails
      return `/images/default-author-${author.gender}.jpg`;
    }
  } catch (error) {
    console.error("Error in getAuthorProfileImage:", error);
    return `/images/default-author-${author.gender || 'male'}.jpg`;
  }
}

// Function to get a random Unsplash image based on business keywords
const getRandomUnsplashImage = async (language = 'en') => {
  // Business keywords for more relevant images
  const businessKeywords = [
    'business', 'skyscrapers', 'meeting', 'notebook', 'consulting', 
    'receivables', 'activity', 'corporate', 'office', 'professional',
    'finance', 'document', 'contract', 'handshake', 'success',
    'strategy', 'analysis', 'growth', 'teamwork', 'leadership',
    'technology', 'innovation', 'suit', 'briefcase', 'conference',
    'business people', 'modern office', 'board meeting', 'financial district',
    'business deal', 'corporate finance', 'startup', 'entrepreneur',
    'bank', 'investment', 'accounting', 'economy', 'legal', 'lawyer',
    'executive', 'ceo', 'manager', 'business plan', 'marketing',
    'financial advisor', 'client meeting', 'business law', 'debt collection'
  ];

  // Get a random keyword
  const randomKeyword = businessKeywords[Math.floor(Math.random() * businessKeywords.length)];
  
  // Use a combination of business and language-specific terms for more variety
  let searchTerm = randomKeyword;
  
  // Add language-specific terms to make images more culturally relevant
  if (language === 'cs') {
    searchTerm += ' business prague';
  } else if (language === 'sk') {
    searchTerm += ' business bratislava';
  } else if (language === 'de') {
    searchTerm += ' business berlin';
  } else {
    searchTerm += ' business london';
  }
  
  try {
    const response = await axios.get(`https://source.unsplash.com/1600x900/?${encodeURIComponent(searchTerm)}`);
    return response.request.res.responseUrl;
  } catch (error) {
    console.error('Error getting Unsplash image:', error);
    return 'https://source.unsplash.com/1600x900/?business';
  }
};

// Function to create author placeholder image with initials
const createAuthorPlaceholderImage = async (author, language = 'en') => {
  // Get initials from author name
  const initials = author
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Create canvas for image (circular avatar)
  const size = 400;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background color based on language
  let bgColor = '#e6e6e6'; // Default gray
  switch(language) {
    case 'cs':
      bgColor = '#f0f0f0'; // Light gray for Czech
      break;
    case 'sk': 
      bgColor = '#e6e6e6'; // Gray for Slovak
      break;
    case 'de':
      bgColor = '#d9d9d9'; // Darker gray for German
      break;
    case 'en':
      bgColor = '#e6e6e6'; // Gray for English
      break;
  }

  // Draw circle
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2, true);
  ctx.fillStyle = bgColor;
  ctx.fill();

  // Add text
  ctx.font = `${size/2}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#333333';
  ctx.fillText(initials, size/2, size/2);

  // Convert to buffer
  const buffer = canvas.toBuffer('image/png');
  return buffer;
};

module.exports = {
  containsAIReference,
  getRandomElement,
  createSlug,
  generateArticleContent,
  getArticleImage,
  generateMetadata,
  generateUniqueApproach,
  generateRandomTopic,
  getAuthorProfileImage,
  getRandomUnsplashImage,
  createAuthorPlaceholderImage
}; 