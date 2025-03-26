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

// Function to generate article content
async function generateArticleContent(openai, topic, category, uniqueApproach, language) {
  try {
    console.log(`Generating article content for topic: ${topic} in language: ${language}...`);
    
    let systemPrompt = '';
    let userPrompt = '';
    
    // Language-specific prompts
    if (language === 'en') {
      // English prompts
      systemPrompt = `You are an expert in ${category} with extensive industry experience. Your articles are detailed, authoritative, and backed by real-world experience and up-to-date research. You write in a clear, professional style that engages business professionals while providing actionable insights.`;
      
      userPrompt = `Write a comprehensive, in-depth article on the topic: "${topic}" for business professionals interested in ${category}.

The article should be 1500-2000 words long and follow this structure:
1. Introduction - Engaging opening that establishes the importance of the topic
2. Main thesis: ${uniqueApproach.mainThesis}
3. Detailed exploration of these key points:
${uniqueApproach.keyPoints.map(point => `   - ${point}`).join('\n')}
4. A section that offers your unique perspective: ${uniqueApproach.uniquePerspective}
5. Practical advice and actionable takeaways
6. Conclusion that reinforces the main thesis

Guidelines:
- Use a professional but engaging tone aimed at business leaders
- Include 1-2 relevant quotes from (fictional) industry experts
- Mention 2-3 specific statistics or data points to support your arguments (create realistic ones if needed)
- Provide practical, actionable advice that readers can implement
- Include both strategic insights and tactical recommendations
- Avoid technical jargon unless explained
- Structure with clear headings, subheadings, and bullet points for readability

Absolutely avoid:
- Any mention of AI, artificial intelligence, language models, or machine learning
- References to yourself as an AI or language model
- Phrases like "As an AI" or "As a language model"
- Generic advice without specific examples
- Obvious or basic information without depth

Write a complete, publication-ready article that demonstrates expertise and provides genuine value to professionals in the field.`;
    } else if (language === 'cs') {
      // Czech prompts
      systemPrompt = `Jste odborník v oblasti ${category} s rozsáhlými zkušenostmi z praxe. Vaše články jsou detailní, autoritativní a podložené skutečnými zkušenostmi a aktuálním výzkumem. Píšete jasným, profesionálním stylem, který oslovuje obchodní profesionály a zároveň poskytuje praktické poznatky.`;
      
      userPrompt = `Napište komplexní, hloubkový článek na téma: "${topic}" pro obchodní profesionály se zájmem o ${category}.

Článek by měl mít 1500-2000 slov a následovat tuto strukturu:
1. Úvod - Poutavé zahájení, které stanoví důležitost tématu
2. Hlavní teze: ${uniqueApproach.mainThesis}
3. Detailní prozkoumání těchto klíčových bodů:
${uniqueApproach.keyPoints.map(point => `   - ${point}`).join('\n')}
4. Sekce, která nabízí váš jedinečný pohled: ${uniqueApproach.uniquePerspective}
5. Praktické rady a realizovatelné závěry
6. Závěr, který posiluje hlavní tezi

Pokyny:
- Používejte profesionální, ale poutavý tón zaměřený na business leadery
- Zahrňte 1-2 relevantní citáty od (fiktivních) odborníků z oboru
- Zmiňte 2-3 konkrétní statistiky nebo datové body na podporu vašich argumentů (v případě potřeby vytvořte realistické)
- Poskytněte praktické, realizovatelné rady, které mohou čtenáři implementovat
- Zahrňte jak strategické poznatky, tak taktická doporučení
- Vyhněte se odbornému žargonu, pokud není vysvětlen
- Strukturujte s jasnými nadpisy, podnadpisy a odrážkami pro lepší čitelnost

Absolutně se vyhněte:
- Jakýmkoli zmínkám o umělé inteligenci, jazykových modelech nebo strojovém učení
- Odkazům na sebe jako na umělou inteligenci nebo jazykový model
- Frázím jako "Jako umělá inteligence" nebo "Jako jazykový model"
- Obecným radám bez konkrétních příkladů
- Zřejmým nebo základním informacím bez hloubky

Napište kompletní, publikačně připravený článek, který demonstruje odbornost a poskytuje skutečnou hodnotu profesionálům v oboru.`;
    } else if (language === 'sk') {
      // Slovak prompts
      systemPrompt = `Ste odborník v oblasti ${category} s rozsiahlymi skúsenosťami z praxe. Vaše články sú detailné, autoritatívne a podložené skutočnými skúsenosťami a aktuálnym výskumom. Píšete jasným, profesionálnym štýlom, ktorý oslovuje obchodných profesionálov a zároveň poskytuje praktické poznatky.`;
      
      userPrompt = `Napíšte komplexný, hĺbkový článok na tému: "${topic}" pre obchodných profesionálov so záujmom o ${category}.

Článok by mal mať 1500-2000 slov a nasledovať túto štruktúru:
1. Úvod - Pútavé začatie, ktoré stanoví dôležitosť témy
2. Hlavná téza: ${uniqueApproach.mainThesis}
3. Detailné preskúmanie týchto kľúčových bodov:
${uniqueApproach.keyPoints.map(point => `   - ${point}`).join('\n')}
4. Sekcia, ktorá ponúka váš jedinečný pohľad: ${uniqueApproach.uniquePerspective}
5. Praktické rady a realizovateľné závery
6. Záver, ktorý posilňuje hlavnú tézu

Pokyny:
- Používajte profesionálny, ale pútavý tón zameraný na business lídrov
- Zahrňte 1-2 relevantné citáty od (fiktívnych) odborníkov z odboru
- Spomeňte 2-3 konkrétne štatistiky alebo dátové body na podporu vašich argumentov (v prípade potreby vytvorte realistické)
- Poskytnite praktické, realizovateľné rady, ktoré môžu čitatelia implementovať
- Zahrňte ako strategické poznatky, tak taktické odporúčania
- Vyhnite sa odbornému žargónu, pokiaľ nie je vysvetlený
- Štruktúrujte s jasnými nadpismi, podnadpismi a odrážkami pre lepšiu čitateľnosť

Absolútne sa vyhnite:
- Akýmkoľvek zmienkam o umelej inteligencii, jazykových modeloch alebo strojovom učení
- Odkazom na seba ako na umelú inteligenciu alebo jazykový model
- Frázam ako "Ako umelá inteligencia" alebo "Ako jazykový model"
- Všeobecným radám bez konkrétnych príkladov
- Zrejmým alebo základným informáciám bez hĺbky

Napíšte kompletný, publikačne pripravený článok, ktorý demonštruje odbornosť a poskytuje skutočnú hodnotu profesionálom v odbore.`;
    } else if (language === 'de') {
      // German prompts
      systemPrompt = `Sie sind ein Experte auf dem Gebiet ${category} mit umfangreicher Branchenerfahrung. Ihre Artikel sind detailliert, maßgeblich und durch reale Erfahrungen und aktuelle Forschung gestützt. Sie schreiben in einem klaren, professionellen Stil, der Geschäftsfachleute anspricht und gleichzeitig praktische Erkenntnisse vermittelt.`;
      
      userPrompt = `Schreiben Sie einen umfassenden, tiefgehenden Artikel zum Thema: "${topic}" für Geschäftsfachleute, die sich für ${category} interessieren.

Der Artikel sollte 1500-2000 Wörter lang sein und dieser Struktur folgen:
1. Einleitung - Packender Einstieg, der die Bedeutung des Themas etabliert
2. Hauptthese: ${uniqueApproach.mainThesis}
3. Ausführliche Untersuchung dieser Schlüsselpunkte:
${uniqueApproach.keyPoints.map(point => `   - ${point}`).join('\n')}
4. Ein Abschnitt, der Ihre einzigartige Perspektive bietet: ${uniqueApproach.uniquePerspective}
5. Praktische Ratschläge und umsetzbare Erkenntnisse
6. Schlussfolgerung, die die Hauptthese verstärkt

Richtlinien:
- Verwenden Sie einen professionellen, aber ansprechenden Ton, der auf Unternehmensführer ausgerichtet ist
- Beziehen Sie 1-2 relevante Zitate von (fiktiven) Branchenexperten ein
- Erwähnen Sie 2-3 spezifische Statistiken oder Datenpunkte zur Unterstützung Ihrer Argumente (erstellen Sie bei Bedarf realistische)
- Bieten Sie praktische, umsetzbare Ratschläge, die Leser implementieren können
- Schließen Sie sowohl strategische Erkenntnisse als auch taktische Empfehlungen ein
- Vermeiden Sie Fachjargon, es sei denn, er wird erklärt
- Strukturieren Sie mit klaren Überschriften, Unterüberschriften und Aufzählungspunkten für bessere Lesbarkeit

Vermeiden Sie unbedingt:
- Jegliche Erwähnung von KI, künstlicher Intelligenz, Sprachmodellen oder maschinellem Lernen
- Bezüge auf sich selbst als KI oder Sprachmodell
- Phrasen wie "Als KI" oder "Als Sprachmodell"
- Allgemeine Ratschläge ohne konkrete Beispiele
- Offensichtliche oder grundlegende Informationen ohne Tiefe

Schreiben Sie einen vollständigen, publikationsreifen Artikel, der Fachwissen demonstriert und Fachleuten in diesem Bereich echten Mehrwert bietet.`;
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    // Generate article content
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
    
    // If we've reached here, we couldn't get AI-free content after max attempts
    // Clean the content manually by replacing known problematic phrases
    console.log("Cleaning AI references from the content...");
    articleContent = articleContent.replace(/\b(AI|artificial intelligence|language model|machine learning|ML|GPT|ChatGPT|OpenAI|neural network|deep learning)\b/gi, 'advanced analysis');
    articleContent = articleContent.replace(/As an AI|As a language model|As an assistant/gi, 'As an expert');
    
    return articleContent;
  } catch (error) {
    console.error("Error generating article content:", error);
    // Return a fallback message if the API call fails
    return `# ${topic}\n\nThis article explores various aspects of ${topic} within the context of ${category}.\n\nThe main thesis is: ${uniqueApproach.mainThesis}\n\n## Key Points\n${uniqueApproach.keyPoints.map(point => `- ${point}`).join('\n')}\n\n## Unique Perspective\n${uniqueApproach.uniquePerspective}\n\n*Note: This is a placeholder content due to an error in content generation.*`;
  }
}

// Function to get article image from Unsplash
const getArticleImage = async (topic, language = 'en') => {
  try {
    // Use our custom Unsplash image function with business keywords
    const imageUrl = await getRandomUnsplashImage(language);
    return {
      path: imageUrl,
      photographer: "Unsplash Photographer"
    };
  } catch (error) {
    console.error('Error getting article image:', error);
    return {
      path: 'https://source.unsplash.com/1600x900/?business',
      photographer: "Unsplash Photographer"
    };
  }
};

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
    'technology', 'innovation', 'suit', 'briefcase', 'conference'
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
  generateArticleContent,
  getArticleImage,
  getAuthorProfileImage,
  getRandomUnsplashImage,
  createAuthorPlaceholderImage
}; 