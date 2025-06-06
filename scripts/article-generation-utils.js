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
      systemPrompt = `You are an expert in ${category} with extensive industry experience. Your articles are detailed, authoritative, and backed by real-world experience and research. You write in a clear, direct, and professional style, avoiding generalizations and focusing on concrete, practical information.`;
      
      userPrompt = `Write a comprehensive article on "${topic}" for business professionals in ${category}.

The article should:
1. Be 1500-2000 words with a professional, factual tone that builds trust
2. Follow this structure:
   - Introduction establishing the topic's importance with a concrete business scenario
   - Main thesis: ${uniqueApproach.mainThesis}
   - Detailed sections covering: ${uniqueApproach.keyPoints.join(', ')}
   - Your expert perspective: ${uniqueApproach.uniquePerspective}
   - Practical, actionable advice with real-world examples
   - Conclusion with a clear call to action for the reader

Guidelines:
- Use ONLY verifiable information or logical reasoning based on business practice
- DO NOT include fictional experts, companies, or made-up statistics
- AVOID generic phrases like "is key to success" - use specific, concrete language instead
- Break up long text blocks and keep paragraphs short (3-5 sentences maximum)
- Use clear headings (## for main sections, ### for subsections)
- Include bullet points or numbered lists for key points and takeaways
- Add 2-3 specific examples from common business practice (e.g., dealing with unpaid invoices, cash flow problems, customer negotiations)
- Optimize for SEO with relevant keywords naturally incorporated throughout the text
- End with a meaningful call to action that offers readers a clear next step

STRICTLY AVOID any mention of AI, artificial intelligence, or language models.`;

    } else if (language === 'cs') {
      // Czech prompts
      systemPrompt = `Jste odborník v oblasti ${category} s rozsáhlými zkušenostmi z praxe. Vaše články jsou detailní, autoritativní a podložené skutečnými zkušenostmi. Píšete jasným, přímým a profesionálním stylem, vyhýbáte se obecným frázím a soustředíte se na konkrétní, praktické informace.`;
      
      userPrompt = `Napište komplexní článek na téma: "${topic}" pro obchodní profesionály v oblasti ${category}.

Článek by měl:
1. Mít 1500-2000 slov s profesionálním, faktickým tónem, který buduje důvěru
2. Sledovat tuto strukturu:
   - Úvod stanovující důležitost tématu s konkrétním obchodním scénářem
   - Hlavní teze: ${uniqueApproach.mainThesis}
   - Detailní sekce pokrývající: ${uniqueApproach.keyPoints.join(', ')}
   - Váš odborný pohled: ${uniqueApproach.uniquePerspective}
   - Praktické, realizovatelné rady s příklady z reálné praxe
   - Závěr s jasnou výzvou k akci pro čtenáře

Pokyny:
- Používejte POUZE ověřitelné informace nebo logické úvahy založené na obchodní praxi
- NEUVÁDĚJTE fiktivní odborníky, společnosti ani smyšlené statistiky
- VYHNĚTE SE obecným frázím jako "je klíčem k úspěchu" - místo toho používejte konkrétní jazyk
- Rozdělte dlouhé bloky textu a udržujte krátké odstavce (maximálně 3-5 vět)
- Používejte jasné nadpisy (## pro hlavní sekce, ### pro podsekce)
- Zahrňte odrážky nebo číslované seznamy pro klíčové body
- Přidejte 2-3 konkrétní příklady z běžné firemní praxe (např. řešení neuhrazených faktur, problémů s cash flow, vyjednávání se zákazníky)
- Optimalizujte pro SEO s relevantními klíčovými slovy přirozeně začleněnými do textu (např. vymáhání pohledávek, exekuce, promlčení, restrukturalizace)
- Zakončete smysluplnou výzvou k akci, která nabídne čtenářům jasný další krok

PŘÍSNĚ SE VYHNĚTE jakýmkoli zmínkám o umělé inteligenci nebo jazykových modelech.`;

    } else if (language === 'sk') {
      // Slovak prompts
      systemPrompt = `Ste odborník v oblasti ${category} s rozsiahlymi skúsenosťami z praxe. Vaše články sú detailné, autoritatívne a podložené skutočnými skúsenosťami. Píšete jasným, priamym a profesionálnym štýlom, vyhýbate sa všeobecným frázam a sústreďujete sa na konkrétne, praktické informácie.`;
      
      userPrompt = `Napíšte komplexný článok na tému: "${topic}" pre obchodných profesionálov v oblasti ${category}.

Článok by mal:
1. Mať 1500-2000 slov s profesionálnym, faktickým tónom, ktorý buduje dôveru
2. Sledovať túto štruktúru:
   - Úvod stanovujúci dôležitosť témy s konkrétnym obchodným scenárom
   - Hlavná téza: ${uniqueApproach.mainThesis}
   - Detailné sekcie pokrývajúce: ${uniqueApproach.keyPoints.join(', ')}
   - Váš odborný pohľad: ${uniqueApproach.uniquePerspective}
   - Praktické, realizovateľné rady s príkladmi z reálnej praxe
   - Záver s jasnou výzvou na akciu pre čitateľov

Pokyny:
- Používajte IBA overiteľné informácie alebo logické úvahy založené na obchodnej praxi
- NEUVÁDZAJTE fiktívnych odborníkov, spoločnosti ani vymyslené štatistiky
- VYHNITE SA všeobecným frázam ako "je kľúčom k úspechu" - namiesto toho používajte konkrétny jazyk
- Rozdeľte dlhé bloky textu a udržiavajte krátke odseky (maximálne 3-5 viet)
- Používajte jasné nadpisy (## pre hlavné sekcie, ### pre podsekcie)
- Zahrňte odrážky alebo číslované zoznamy pre kľúčové body
- Pridajte 2-3 konkrétne príklady z bežnej firemnej praxe (napr. riešenie neuhradených faktúr, problémov s cash flow, vyjednávanie so zákazníkmi)
- Optimalizujte pre SEO s relevantnými kľúčovými slovami prirodzene začlenenými do textu (napr. vymáhanie pohľadávok, exekúcia, premlčanie, reštrukturalizácia)
- Zakončite zmysluplnou výzvou na akciu, ktorá ponúkne čitateľom jasný ďalší krok

STRIKTNE SA VYHNITE akýmkoľvek zmienkam o umelej inteligencii alebo jazykových modeloch.`;

    } else if (language === 'de') {
      // German prompts
      systemPrompt = `Sie sind ein Experte auf dem Gebiet ${category} mit umfangreicher Branchenerfahrung. Ihre Artikel sind detailliert, maßgeblich und durch reale Erfahrungen gestützt. Sie schreiben in einem klaren, direkten und professionellen Stil, vermeiden Verallgemeinerungen und konzentrieren sich auf konkrete, praktische Informationen.`;
      
      userPrompt = `Schreiben Sie einen umfassenden Artikel zum Thema: "${topic}" für Geschäftsfachleute im Bereich ${category}.

Der Artikel sollte:
1. 1500-2000 Wörter mit einem professionellen, sachlichen Ton haben, der Vertrauen aufbaut
2. Dieser Struktur folgen:
   - Einleitung, die die Bedeutung des Themas mit einem konkreten Geschäftsszenario hervorhebt
   - Hauptthese: ${uniqueApproach.mainThesis}
   - Detaillierte Abschnitte zu: ${uniqueApproach.keyPoints.join(', ')}
   - Ihre Expertenperspektive: ${uniqueApproach.uniquePerspective}
   - Praktische, umsetzbare Ratschläge mit Beispielen aus der Praxis
   - Schlussfolgerung mit einer klaren Handlungsaufforderung für den Leser

Richtlinien:
- Verwenden Sie NUR überprüfbare Informationen oder logische Schlussfolgerungen basierend auf der Geschäftspraxis
- Führen Sie KEINE fiktiven Experten, Unternehmen oder erfundene Statistiken an
- VERMEIDEN Sie allgemeine Phrasen wie "ist der Schlüssel zum Erfolg" - verwenden Sie stattdessen spezifische, konkrete Sprache
- Teilen Sie lange Textblöcke auf und halten Sie Absätze kurz (maximal 3-5 Sätze)
- Verwenden Sie klare Überschriften (## für Hauptabschnitte, ### für Unterabschnitte)
- Fügen Sie Aufzählungspunkte oder nummerierte Listen für Schlüsselpunkte ein
- Fügen Sie 2-3 spezifische Beispiele aus der gängigen Geschäftspraxis hinzu (z.B. Umgang mit unbezahlten Rechnungen, Cashflow-Problemen, Kundenverhandlungen)
- Optimieren Sie für SEO mit relevanten Schlüsselwörtern, die natürlich in den Text eingebettet sind (z.B. Forderungsmanagement, Vollstreckung, Verjährung, Restrukturierung)
- Schließen Sie mit einer sinnvollen Handlungsaufforderung, die den Lesern einen klaren nächsten Schritt bietet

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
    // Return a fallback message if the API call fails - now language-specific
    let fallbackContent = '';
    
    if (language === 'cs') {
      fallbackContent = `# ${topic}

Tento článek se zabývá různými aspekty tématu ${topic} v kontextu ${category}.

Hlavní teze je: ${uniqueApproach.mainThesis}

## Klíčové body
${uniqueApproach.keyPoints.map(point => `- ${point}`).join('\n')}

## Unikátní perspektiva
${uniqueApproach.uniquePerspective}

*Poznámka: Toto je náhradní obsah kvůli chybě při generování obsahu.*`;
    } else if (language === 'sk') {
      fallbackContent = `# ${topic}

Tento článok sa zaoberá rôznymi aspektmi témy ${topic} v kontexte ${category}.

Hlavná téza je: ${uniqueApproach.mainThesis}

## Kľúčové body
${uniqueApproach.keyPoints.map(point => `- ${point}`).join('\n')}

## Unikátna perspektíva
${uniqueApproach.uniquePerspective}

*Poznámka: Toto je náhradný obsah kvôli chybe pri generovaní obsahu.*`;
    } else if (language === 'de') {
      fallbackContent = `# ${topic}

Dieser Artikel behandelt verschiedene Aspekte von ${topic} im Kontext von ${category}.

Die Hauptthese ist: ${uniqueApproach.mainThesis}

## Wichtige Punkte
${uniqueApproach.keyPoints.map(point => `- ${point}`).join('\n')}

## Einzigartige Perspektive
${uniqueApproach.uniquePerspective}

*Hinweis: Dies ist ein Platzhalterinhalt aufgrund eines Fehlers bei der Inhaltsgenerierung.*`;
    } else {
      // English fallback
      fallbackContent = `# ${topic}

This article explores various aspects of ${topic} within the context of ${category}.

## Key Points
${uniqueApproach.keyPoints.map(point => `- ${point}`).join('\n')}

## Unique Perspective
${uniqueApproach.uniquePerspective}

*Note: This is a placeholder content due to an error in content generation.*`;
    }
    
    return fallbackContent;
  }
}

// Function to get article image from Unsplash
async function getArticleImage(category, topic, language = 'en') {
  try {
    console.log(`Getting image for topic: ${topic}, category: ${category}`);
    
    // Search terms for better Unsplash results based on financial/legal content
    const searchTerms = [
      'business', 'finance', 'office', 'professional', 
      'document', 'contract', 'meeting', 'legal', 'corporate'
    ];
    
    // Select random search term and combine with category
    const searchTerm = `${getRandomElement(searchTerms)} ${category}`;
    console.log(`Using search term for Unsplash: "${searchTerm}"`);
    
    // Timestamp pro unikátní soubor
    const timestamp = Date.now();
    const slug = createSlug(topic);
    const imageName = `${slug}-${timestamp}.jpg`;
    
    // Cesta pro uložení obrázku
    const contentImageDir = path.join('content', 'images', language);
    const imagePath = path.join(contentImageDir, imageName);
    const publicPath = `/images/${language}/${imageName}`;
    
    // Ensure directory exists
    const dir = path.join(process.cwd(), contentImageDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Kontrola přítomnosti API klíče
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      console.error("⚠️ UNSPLASH_ACCESS_KEY is not set! Using fallback method.");
      // Fallback na neoficiální endpoint jako záloha
      const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(searchTerm)}`;
      const response = await fetch(fallbackUrl);
      if (response.ok) {
        const buffer = await response.buffer();
        fs.writeFileSync(path.join(process.cwd(), imagePath), buffer);
        console.log(`Image saved using fallback method: ${imagePath}`);
        return {
          path: publicPath,
          photographer: {
            name: "Unsplash",
            link: "https://unsplash.com"
          }
        };
      }
    } else {
      // Používáme oficiální Unsplash API s autorizací
      console.log("Using official Unsplash API with access key");
      const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchTerm)}&orientation=landscape&count=1&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
      
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Accept-Version': 'v1'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Unsplash API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || (Array.isArray(data) && data.length === 0)) {
          throw new Error("No images returned from Unsplash API");
        }
        
        // Zpracování výsledku - získáme první obrázek z výsledků
        const image = Array.isArray(data) ? data[0] : data;
        const imageUrl = image.urls.regular || image.urls.full;
        
        // Stažení obrázku
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status}`);
        }
        
        const buffer = await imageResponse.buffer();
        fs.writeFileSync(path.join(process.cwd(), imagePath), buffer);
        
        console.log(`Image saved to: ${imagePath}`);
        console.log(`Photo by: ${image.user.name} (${image.user.links.html})`);
        
        return {
          path: publicPath,
          photographer: {
            name: image.user.name,
            link: image.user.links.html
          }
        };
      } catch (apiError) {
        console.error("Error using Unsplash API:", apiError);
        // Fallback na neoficiální endpoint v případě chyby
        console.log("Falling back to unofficial Unsplash endpoint");
        const fallbackUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(searchTerm)}`;
        const response = await fetch(fallbackUrl);
        if (response.ok) {
          const buffer = await response.buffer();
          fs.writeFileSync(path.join(process.cwd(), imagePath), buffer);
          console.log(`Image saved using fallback method: ${imagePath}`);
          return {
            path: publicPath,
            photographer: {
              name: "Unsplash",
              link: "https://unsplash.com"
            }
          };
        }
      }
    }
    
    throw new Error("Failed to download image from Unsplash");
  } catch (error) {
    console.error("Error getting image:", error);
    
    // Vytvoření fallback placeholder obrázku
    console.log("Creating a basic placeholder image");
    
    // Zajistíme, že adresář pro placeholder existuje
    const contentImageDir = path.join('content', 'images', language);
    const dir = path.join(process.cwd(), contentImageDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Vytvoření jednoduchého placeholder obrázku s textem
    const timestamp = Date.now();
    const slug = createSlug(topic);
    const imageName = `placeholder-${slug}-${timestamp}.jpg`;
    const imagePath = path.join(contentImageDir, imageName);
    const publicPath = `/images/${language}/${imageName}`;
    
    // Kopírujeme základní placeholder z public do content/images
    const placeholderPath = path.join(process.cwd(), 'public', 'images', 'placeholder.jpg');
    if (fs.existsSync(placeholderPath)) {
      fs.copyFileSync(placeholderPath, path.join(process.cwd(), imagePath));
      console.log(`Copied placeholder image to: ${imagePath}`);
    } else {
      // Pokud není k dispozici placeholder, vytvoříme prázdný soubor
      fs.writeFileSync(path.join(process.cwd(), imagePath), Buffer.from(''));
      console.log(`Created empty placeholder file: ${imagePath}`);
    }
    
    return {
      path: publicPath,
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
    
    // We'll use the topic directly as the title since it's already in the "keyword: question" format
    const title = topic;
    
    let prompt;
    
    if (language === 'en') {
      prompt = `For an article with headline "${topic}" in the category "${category}", generate:
1. Subtitle (max 100 chars) - a short explanatory phrase that expands on the headline
2. Description (max 160 chars) - SEO-optimized summary that explains what readers will learn
3. Tags (5-7 relevant keywords, comma separated)
4. Read time (in "X minute read" format)
Respond in JSON format with keys: subtitle, description, tags, readTime.`;
    } else if (language === 'cs') {
      prompt = `Pro článek s headlinem "${topic}" v kategorii "${category}" vygenerujte:
1. Podtitulek (max 100 znaků) - krátkou vysvětlující frázi, která rozšiřuje headline
2. Popis (max 160 znaků) - SEO optimalizované shrnutí, které vysvětluje, co se čtenáři dozví
3. Tagy (5-7 relevantních klíčových slov, oddělených čárkou)
4. Doba čtení (ve formátu "X minut čtení")
Odpovězte ve formátu JSON s klíči: subtitle, description, tags, readTime.`;
    } else if (language === 'sk') {
      prompt = `Pre článok s headlinom "${topic}" v kategórii "${category}" vygenerujte:
1. Podtitulok (max 100 znakov) - krátku vysvetľujúcu frázu, ktorá rozširuje headline
2. Popis (max 160 znakov) - SEO optimalizované zhrnutie, ktoré vysvetľuje, čo sa čitatelia dozvedia
3. Tagy (5-7 relevantných kľúčových slov, oddelených čiarkou)
4. Čas čítania (vo formáte "X minút čítania")
Odpovedzte vo formáte JSON s kľúčmi: subtitle, description, tags, readTime.`;
    } else if (language === 'de') {
      prompt = `Für einen Artikel mit der Überschrift "${topic}" in der Kategorie "${category}" generieren Sie:
1. Untertitel (max. 100 Zeichen) - einen kurzen erklärenden Satz, der die Überschrift erweitert
2. Beschreibung (max. 160 Zeichen) - SEO-optimierte Zusammenfassung, die erklärt, was die Leser lernen werden
3. Tags (5-7 relevante Schlüsselwörter, durch Kommas getrennt)
4. Lesezeit (im Format "X Minuten Lesezeit")
Antworten Sie im JSON-Format mit den Schlüsseln: subtitle, description, tags, readTime.`;
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: language === 'cs' ? "Jste specialista na metadata pro profesionální obchodní články." :
                                   language === 'sk' ? "Ste špecialista na metadáta pre profesionálne obchodné články." :
                                   language === 'de' ? "Sie sind ein Spezialist für Metadaten für professionelle Geschäftsartikel." :
                                   "You are a metadata specialist for professional business articles." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const metadataResponse = JSON.parse(completion.choices[0].message.content);
    
    // Combine with our pre-set title (the original topic/headline)
    const metadata = {
      title: title, // Using the topic directly as title since it's already in the right format
      ...metadataResponse
    };
    
    // Ensure tags are in string format if they aren't already
    if (metadata.tags && typeof metadata.tags !== 'string' && !Array.isArray(metadata.tags)) {
      metadata.tags = String(metadata.tags);
    }
    
    return metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Fallback metadata - now language-specific
    let fallbackMetadata = {};
    
    if (language === 'cs') {
      fallbackMetadata = {
        title: topic,
        subtitle: `Profesionální poznatky o ${topic.split(':')[0]}`,
        description: `Naučte se o ${topic} s praktickými radami pro firmy v oblasti ${category}.`,
        tags: `${category}, ${topic.split(':')[0].toLowerCase()}, podnikání, profesionální, rady`,
        readTime: "5 minut čtení"
      };
    } else if (language === 'sk') {
      fallbackMetadata = {
        title: topic,
        subtitle: `Profesionálne poznatky o ${topic.split(':')[0]}`,
        description: `Naučte sa o ${topic} s praktickými radami pre firmy v oblasti ${category}.`,
        tags: `${category}, ${topic.split(':')[0].toLowerCase()}, podnikanie, profesionálne, rady`,
        readTime: "5 minút čítania"
      };
    } else if (language === 'de') {
      fallbackMetadata = {
        title: topic,
        subtitle: `Professionelle Einblicke in ${topic.split(':')[0]}`,
        description: `Lernen Sie über ${topic} mit praktischen Ratschlägen für Unternehmen im Bereich ${category}.`,
        tags: `${category}, ${topic.split(':')[0].toLowerCase()}, Geschäft, professionell, Beratung`,
        readTime: "5 Minuten Lesezeit"
      };
    } else {
      // English fallback
      fallbackMetadata = {
        title: topic,
        subtitle: `Professional insights on ${topic.split(':')[0]}`,
        description: `Learn about ${topic} with practical advice for businesses in ${category}.`,
        tags: `${category}, ${topic.split(':')[0].toLowerCase()}, business, professional, advice`,
        readTime: "5 minute read"
      };
    }
    
    return fallbackMetadata;
  }
}

// Function to get a unique approach for an article topic
async function generateUniqueApproach(openai, topic, category, language) {
  try {
    console.log(`Generating unique approach for ${language} article on "${topic}"...`);
    
    let prompt;
    
    if (language === 'en') {
      prompt = `For the topic "${topic}" in the category "${category}", suggest a professional, fact-based approach for an expert article.
Provide:
1. A clear, practical main thesis that addresses a specific business need or challenge
2. 5-6 key points to cover that would provide depth and comprehensive coverage, focusing on verifiable facts and practical advice
3. A professional perspective that offers genuine value to business readers
Avoid generic statements and focus on concrete, actionable insights.
Respond in JSON format with keys: mainThesis, keyPoints, uniquePerspective.`;
    } else if (language === 'cs') {
      prompt = `Pro téma "${topic}" v kategorii "${category}" navrhněte profesionální, faktický přístup pro odborný článek.
Poskytněte:
1. Jasnou, praktickou hlavní tezi, která řeší konkrétní obchodní potřebu nebo výzvu
2. 5-6 klíčových bodů k pokrytí, které poskytnou hloubku a komplexní pohled, zaměřené na ověřitelná fakta a praktické rady
3. Profesionální perspektivu, která nabízí skutečnou hodnotu obchodním čtenářům
Vyhněte se obecným tvrzením a zaměřte se na konkrétní, proveditelné poznatky.
Odpovězte ve formátu JSON s klíči: mainThesis, keyPoints, uniquePerspective.`;
    } else if (language === 'sk') {
      prompt = `Pre tému "${topic}" v kategórii "${category}" navrhnite profesionálny, faktický prístup pre odborný článok.
Poskytnite:
1. Jasnú, praktickú hlavnú tézu, ktorá rieši konkrétnu obchodnú potrebu alebo výzvu
2. 5-6 kľúčových bodov na pokrytie, ktoré poskytnú hĺbku a komplexný pohľad, zamerané na overiteľné fakty a praktické rady
3. Profesionálnu perspektívu, ktorá ponúka skutočnú hodnotu obchodným čitateľom
Vyhnite sa všeobecným tvrdeniam a zamerajte sa na konkrétne, realizovateľné poznatky.
Odpovedzte vo formáte JSON s kľúčmi: mainThesis, keyPoints, uniquePerspective.`;
    } else if (language === 'de') {
      prompt = `Für das Thema "${topic}" in der Kategorie "${category}" schlagen Sie einen professionellen, faktenbasierten Ansatz für einen Fachartikel vor.
Bieten Sie:
1. Eine klare, praktische Hauptthese, die auf ein spezifisches Geschäftsbedürfnis oder eine Herausforderung eingeht
2. 5-6 Schlüsselpunkte zur Abdeckung, die Tiefe und umfassende Betrachtung bieten würden, mit Fokus auf überprüfbare Fakten und praktische Ratschläge
3. Eine professionelle Perspektive, die Geschäftslesern einen echten Mehrwert bietet
Vermeiden Sie allgemeine Aussagen und konzentrieren Sie sich auf konkrete, umsetzbare Erkenntnisse.
Antworten Sie im JSON-Format mit den Schlüsseln: mainThesis, keyPoints, uniquePerspective.`;
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: language === 'cs' ? "Jste profesionální stratég obchodního obsahu, který se zaměřuje na faktický, praktický obsah pro obchodní publikum. Vyhýbáte se obecným radám a zaměřujete se na konkrétní, proveditelné poznatky." :
                                   language === 'sk' ? "Ste profesionálny stratég obchodného obsahu, ktorý sa zameriava na faktický, praktický obsah pre obchodné publikum. Vyhýbate sa všeobecným radám a zameriavate sa na konkrétne, realizovateľné poznatky." :
                                   language === 'de' ? "Sie sind ein professioneller Geschäftsinhalts-Stratege, der sich auf faktenbasierte, praktische Inhalte für Geschäftszielgruppen konzentriert. Sie vermeiden allgemeine Ratschläge und konzentrieren sich auf spezifische, umsetzbare Erkenntnisse." :
                                   "You are a professional business content strategist who focuses on fact-based, practical content for business audiences. You avoid generic advice and focus on specific, actionable insights." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error generating unique approach:", error);
    // Fallback approach - now language-specific
    let fallbackApproach = {};
    
    if (language === 'cs') {
      fallbackApproach = {
        mainThesis: `Efektivní řízení ${topic} vyžaduje konkrétní kroky, které přímo ovlivňují finanční zdraví a provozní stabilitu společnosti.`,
        keyPoints: [
          "Regulatorní požadavky a rámec compliance",
          "Hodnocení finančního dopadu a měřitelné výsledky",
          "Postupný proces implementace",
          "Identifikace rizik a strategie jejich zmírnění",
          "Požadavky na dokumentaci a vedení záznamů",
          "Integrace s existujícími obchodními procesy"
        ],
        uniquePerspective: `Praktický přístup zaměřený na měřitelné výsledky spíše než na teoretické rámce, s důrazem na efektivitu implementace a nákladovou efektivnost.`
      };
    } else if (language === 'sk') {
      fallbackApproach = {
        mainThesis: `Efektívne riadenie ${topic} vyžaduje konkrétne kroky, ktoré priamo ovplyvňujú finančné zdravie a prevádzkovú stabilitu spoločnosti.`,
        keyPoints: [
          "Regulačné požiadavky a rámec compliance",
          "Hodnotenie finančného dopadu a merateľné výsledky",
          "Postupný proces implementácie",
          "Identifikácia rizík a stratégie ich zmierňovania",
          "Požiadavky na dokumentáciu a vedenie záznamov",
          "Integrácia s existujúcimi obchodnými procesmi"
        ],
        uniquePerspective: `Praktický prístup zameraný na merateľné výsledky skôr ako na teoretické rámce, s dôrazom na efektívnosť implementácie a nákladovú efektívnosť.`
      };
    } else if (language === 'de') {
      fallbackApproach = {
        mainThesis: `Effektives Management von ${topic} erfordert konkrete Schritte, die sich direkt auf die finanzielle Gesundheit und operative Stabilität des Unternehmens auswirken.`,
        keyPoints: [
          "Regulatorische Anforderungen und Compliance-Rahmen",
          "Bewertung der finanziellen Auswirkungen und messbare Ergebnisse",
          "Schrittweiser Implementierungsprozess",
          "Risikoidentifikation und Minderungsstrategien",
          "Dokumentations- und Aufzeichnungsanforderungen",
          "Integration in bestehende Geschäftsprozesse"
        ],
        uniquePerspective: `Ein praktischer Ansatz, der sich auf messbare Ergebnisse statt auf theoretische Rahmen konzentriert, mit Schwerpunkt auf Implementierungseffizienz und Kosteneffektivität.`
      };
    } else {
      // English fallback
      fallbackApproach = {
        mainThesis: `Effective management of ${topic} requires concrete steps that directly impact a company's financial health and operational stability.`,
        keyPoints: [
          "Regulatory requirements and compliance framework",
          "Financial impact assessment and measurable outcomes",
          "Step-by-step implementation process",
          "Risk identification and mitigation strategies",
          "Documentation and record-keeping requirements",
          "Integration with existing business processes"
        ],
        uniquePerspective: `A practical approach focusing on measurable outcomes rather than theoretical frameworks, with emphasis on implementation efficiency and cost-effectiveness.`
      };
    }
    
    return fallbackApproach;
  }
}

// Function to generate a random topic for an article
async function generateRandomTopic(openai, category, language) {
  try {
    console.log(`Generating random topic for ${language} article in category: ${category}...`);
    
    let prompt;
    
    if (language === 'en') {
      prompt = `Generate a headline for a professional article about "${category}".
The headline MUST follow this format: "Strong Keyword: Short Question or Solution"
For example:
- Debt Collection: When to Outsource?
- Late Payment: 3 Effective Recovery Strategies
- Receivables: How to Manage Aging Accounts?
- Insolvency: What Creditors Need to Know?
- Collection Calls: Professional Communication Techniques
- Enforcement: Key Steps to Success
- Creditor Rights: Understanding Your Position
- Credit Check: Essential Pre-Agreement Steps
- Customer Screening: Red Flags to Watch
- Risk Management: Preventing Bad Debt

Here's a comprehensive list of headline examples for inspiration by category:

DEBT COLLECTION & RECOVERY:
- Debt Collection: When to Outsource?
- Receivables: How to Manage Aging Accounts?
- Late Payment: 3 Effective Strategies
- Collection Calls: Professional Communication Techniques
- Payment Terms: How to Optimize Compliance?
- Invoice: Best Practices for Faster Payments
- Reminder Letters: Creating Effective Templates
- Debt Recovery: International Best Practices
- Cash Flow: Managing During Collection Delays
- Credit Policy: Creating Effective Guidelines
- Mediation: Alternative to Legal Action?
- Collection Agencies: How to Choose Right?
- Default Interest: How to Calculate Correctly?

LEGAL ACTION & ENFORCEMENT:
- Legal Action: When Is It Worth Pursuing?
- Enforcement: Key Steps to Success
- Creditor Rights: Understanding Your Position
- Statute of Limitations: Avoiding Debt Expiration
- Court Proceedings: Preparation Checklist
- Judgments: Converting to Actual Payment
- Bankruptcy: Navigating Creditor Claims
- Execution Title: How to Obtain One?
- Small Claims: Cost-Effective Recovery Option
- Settlement: Negotiating Favorable Terms
- Legal Costs: Can They Be Recovered?
- Cross-Border Collection: Jurisdiction Challenges
- Debt Sale: When to Consider?

PREVENTION & RISK MANAGEMENT:
- Credit Check: Essential Pre-Agreement Steps
- Customer Screening: Red Flags to Watch
- Contract Terms: Security Against Defaults
- Security Interest: Types and Applications
- Financial Analysis: Evaluating Client Risk
- Debtor Registers: Effective Utilization
- Collateral: When and How to Require?
- Payment Guarantee: Best Practices
- Risk Management: Preventing Bad Debt
- Due Diligence: Comprehensive Client Assessment
- Credit Insurance: Is It Worth the Cost?
- Early Warning Signs: Detecting Payment Problems
- Credit Scoring: Implementing Effective Systems

Choose from these keyword categories for inspiration:
- Debt Collection & Recovery: Debt, Collection, Receivables, Late Payment, Payment Terms, Invoice
- Legal & Enforcement: Legal Action, Enforcement, Court, Judgment, Mediation, Bankruptcy, Execution
- Prevention & Risk: Credit Check, Due Diligence, Contract Terms, Security Interest, Collateral, Guarantee

The headline should be:
1. Starting with a strong, searchable keyword (like those shown in examples)
2. Followed by a specific question or solution (max 4-6 words)
3. Relevant for business professionals
4. Focus on practical problems businesses face
5. Match search queries people actually type into Google
6. Be clear, direct, and engaging

Return ONLY the headline in the format "Keyword: Question/Solution" - nothing else.`;
    } else if (language === 'cs') {
      prompt = `Vygenerujte headline pro odborný článek o "${category}".
Headline MUSÍ dodržet tento formát: "Silné klíčové slovo: Krátká otázka nebo řešení"
Například:
- Dluh: Jak ho vymoci legálně?
- Věřitel: Co dělat, když dlužník mlčí?
- Pohledávky: Kdy je postoupit specialistovi?
- Exekuce: Jaké má práva věřitel?
- Insolvence: Jak podat návrh na dlužníka?
- Lustrace: Jak zjistit majetek dlužníka?
- Faktura nezaplacena: Jak postupovat?
- Smlouva: 5 klauzulí pro ochranu věřitele
- Upomínka: Jak ji správně formulovat?
- Registr dlužníků: Jak ho efektivně využít?

Zde je obsáhlý seznam příkladů headlinů pro inspiraci podle kategorií:

VYMÁHÁNÍ POHLEDÁVEK:
- Dluh: Jak ho vymoci legálně?
- Věřitel: Co dělat, když dlužník mlčí?
- Faktura nezaplacena: Jak postupovat?
- Vymáhání dluhu: Mimosoudně nebo soudně?
- Upomínka: Jak ji správně formulovat?
- Předžalobní výzva: Jaké má náležitosti?
- Pohledávky: Kdy je postoupit specialistovi?
- Promlčení: Jak mu předejít u pohledávek?
- Inkaso: 5 kroků k rychlejšímu plnění
- Platební morálka: Jak ji podpořit u klientů?

EXEKUCE A INSOLVENCE:
- Exekuce: Jaké má práva věřitel?
- Exekuce: Kdy začít jednat?
- Insolvence: Jak podat návrh na dlužníka?
- Insolvence: Co to je a kdy nastává?
- Exekuční titul: Jak ho získat?
- Oddlužení: Co znamená pro věřitele?
- Konkurz: Jak se přihlásit s pohledávkou?
- Rozhodčí řízení: Výhody pro vymáhání
- Platební rozkaz: Postup podání
- Reorganizace: Dopad na pohledávky věřitelů
- Soudní poplatky: Kolik stojí vymáhání?
- Zabavení majetku: Postup a omezení
- Exekuce platu: Kalkulace srážek ze mzdy

LUSTRACE A PREVENCE:
- Lustrace: Jak zjistit majetek dlužníka?
- Bonita klienta: Jak ji ověřit zdarma?
- Prevence neplacení: 3 klíčové kroky
- Zajištění pohledávek: Jaké jsou možnosti?
- Insolvenční rejstřík: Jak ho správně používat?
- Zástavní právo: Kdy a jak ho zřídit?
- Registr dlužníků: Efektivní využití
- Finanční analýza: Předcházení rizikovým klientům
- Pojištění pohledávek: Kdy se vyplatí?
- Směnka: Výhody a rizika zajištění
- Scoring klientů: Interní systém hodnocení
- Zálohové platby: Strategie implementace
- Obchodní podmínky: Klauzule proti neplatičům

Inspirujte se těmito kategoriemi klíčových slov:
- Vymáhání pohledávek: Dluh, Pohledávky, Věřitel, Faktura, Upomínka, Vymáhání
- Exekuce a insolvence: Exekuce, Insolvence, Oddlužení, Konkurz, Exekuční titul, Soudní řízení
- Lustrace a prevence: Lustrace, Bonita, Prevence, Zajištění, Registr dlužníků, Zástava

Headline by měl:
1. Začínat silným, vyhledávaným klíčovým slovem (např. podobným jako v příkladech výše)
2. Následovat konkrétní otázkou nebo řešením (max 4-6 slov)
3. Být relevantní pro obchodní profesionály
4. Zaměřit se na praktické problémy firem
5. Odpovídat tomu, co lidé skutečně vyhledávají na Googlu
6. Být jasný, přímý a poutavý

Vraťte POUZE headline ve formátu "Klíčové slovo: Otázka/Řešení" - nic jiného.`;
    } else if (language === 'sk') {
      prompt = `Vygenerujte headline pre odborný článok o "${category}".
Headline MUSÍ dodržať tento formát: "Silné kľúčové slovo: Krátka otázka alebo riešenie"
Napríklad:
- Pohľadávky: Kedy ich odovzdať na vymáhanie?
- Exekúcia: Aké práva má veriteľ?
- Dlžník: Čo robiť pri neplatení?
- Faktúra: Čo robiť po uplynutí splatnosti?
- Upomienka: Ako ju správne napísať?
- Lustrácia: Ako preveriť obchodného partnera?
- Konkurz: Ako sa prihlásiť s pohľadávkou?
- Veriteľ: Ako chrániť svoje práva?
- Zabezpečenie pohľadávok: Najlepšie nástroje
- Bonita klienta: Ako ju jednoducho overiť?

Tu je rozsiahly zoznam príkladov headlinov pre inšpiráciu podľa kategórií:

VYMÁHANIE POHĽADÁVOK:
- Pohľadávky: Kedy ich odovzdať na vymáhanie?
- Dlžník: Čo robiť pri neplatení?
- Faktúra: Čo po vypršaní splatnosti?
- Upomienka: Ako ju správne napísať?
- Mimosúdne vymáhanie: Kedy sa oplatí?
- Premlčanie: Ako mu predísť včas?
- Postúpenie pohľadávky: Výhody a riziká
- Uznanie dlhu: Ako ho právne zabezpečiť?
- Platobná disciplína: Ako ju zlepšiť?
- Advokát: Kedy poveriť vymáhaním?
- Mandate inkaso: Ako ho efektívne zaviesť?
- Telefonické vymáhanie: Profesionálny postup
- Predžalobná výzva: Čo musí obsahovať?

EXEKÚCIE A INSOLVENCIA:
- Exekúcia: Aké práva má veriteľ?
- Exekútor: Ako s ním efektívne komunikovať?
- Exekučný titul: Ako ho získať?
- Konkurz: Ako sa prihlásiť s pohľadávkou?
- Reštrukturalizácia: Čo to znamená pre veriteľa?
- Oddlženie: Čo znamená pre podnikateľa?
- Platobný rozkaz: Ako ho správne podať?
- Súdne konanie: Kedy sa oplatí?
- Dobrovoľná dražba: Postup pre veriteľa
- Splátkový kalendár: Kedy ho akceptovať?
- Náklady exekúcie: Kto ich hradí?
- Exekučná imunita: Čo nemôže exekútor zabaviť?
- Dražba: Ako sa jej zúčastniť ako veriteľ?

PREVENCIA A LUSTRÁCIA:
- Lustrácia: Ako preveriť obchodného partnera?
- Bonita klienta: Metódy preverovania
- Registre dlžníkov: Ako ich správne využiť?
- Zabezpečenie pohľadávok: Najlepšie nástroje
- Záložné právo: Výhody pre veriteľa
- Obchodný register: Čo všetko odhalí?
- Finančná analýza: Ako odhaliť rizikového klienta?
- Poistenie pohľadávok: Kedy sa oplatí?
- Zmenka: Ako ju správne použiť?
- Zálohové platby: Optimálne nastavenie
- Kreditný limit: Ako ho správne stanoviť?
- Notárska zápisnica: Výhody priamej vykonateľnosti
- Monitorovanie klientov: Systematický prístup

Inšpirujte sa týmito kategóriami kľúčových slov:
- Vymáhanie pohľadávok: Pohľadávky, Dlžník, Faktúra, Upomienka, Veriteľ, Vymáhanie
- Exekúcie a insolvencia: Exekúcia, Exekútor, Insolvencia, Konkurz, Oddlženie, Reštrukturalizácia
- Prevencia a lustrácia: Lustrácia, Platobná disciplína, Registre dlžníkov, Zabezpečenie, Záložné právo

Headline by mal:
1. Začínať silným, vyhľadávaným kľúčovým slovom (napr. podobným ako v príkladoch vyššie)
2. Nasledovať konkrétnou otázkou alebo riešením (max 4-6 slov)
3. Byť relevantný pre obchodných profesionálov
4. Zamerať sa na praktické problémy firiem
5. Zodpovedať tomu, čo ľudia skutočne vyhľadávajú na Googli
6. Byť jasný, priamy a pútavý

Vráťte IBA headline vo formáte "Kľúčové slovo: Otázka/Riešenie" - nič iné.`;
    } else if (language === 'de') {
      prompt = `Generieren Sie eine Überschrift für einen Fachartikel über "${category}".
Die Überschrift MUSS diesem Format folgen: "Starkes Schlüsselwort: Kurze Frage oder Lösung"
Zum Beispiel:
- Inkasso: Wann lohnt sich ein Dienstleister?
- Forderungen: Wie optimiert man die Beitreibung?
- Zahlungsverzug: Sofort reagieren oder warten?
- Mahnwesen: Effizienter Ablauf erklärt
- Insolvenz: Welche Rechte haben Gläubiger?
- Vollstreckung: Die wichtigsten Schritte
- Bonitätsprüfung: Wie funktioniert sie richtig?
- Mahnbescheid: Wie stellt man ihn richtig?
- Schuldnerregister: Effektive Nutzung erklärt
- Vertragsgestaltung: Klauseln zum Gläubigerschutz

Hier ist eine umfassende Liste von Überschrift-Beispielen zur Inspiration nach Kategorien:

INKASSO UND FORDERUNGSMANAGEMENT:
- Inkasso: Wann lohnt sich ein Dienstleister?
- Forderungen: Wie optimiert man die Beitreibung?
- Zahlungsverzug: Sofort reagieren oder warten?
- Mahnwesen: Effizienter Ablauf erklärt
- Zahlungsmoral: Wie kann man sie verbessern?
- Mahngebühren: Was ist rechtlich durchsetzbar?
- Forderungsverkauf: Vor- und Nachteile
- Mahnschreiben: Wie formuliert man wirksam?
- Telefon-Inkasso: Professionelle Gesprächsführung
- Kundenbeziehung: Balance zwischen Inkasso und Service
- Liquidität: Maßnahmen zur Verbesserung
- Außergerichtliche Einigung: Verhandlungstechniken
- Zahlungsfristen: Optimale Gestaltung

VOLLSTRECKUNG UND INSOLVENZVERFAHREN:
- Vollstreckung: Die wichtigsten Schritte
- Mahnbescheid: Wie stellt man ihn richtig?
- Zwangsvollstreckung: Wann ist sie sinnvoll?
- Insolvenzantrag: Optimales Timing für Gläubiger
- Insolvenzverfahren: Was Gläubiger wissen müssen
- Gläubigerausschuss: Rolle und Einfluss
- Vollstreckungstitel: Wege zur Beschaffung
- Gerichtsvollzieher: Effektive Zusammenarbeit
- Pfändung: Grenzen und Möglichkeiten
- Verwertung: Optionen für gesicherte Gläubiger
- Insolvenzplan: Chancen für Gläubiger
- Restschuldbefreiung: Auswirkungen auf Gläubiger
- Vergleich: Alternative zur Vollstreckung?

PRÄVENTION UND BONITÄTSPRÜFUNG:
- Bonitätsprüfung: Wie funktioniert sie richtig?
- Schuldnerregister: Effektive Nutzung erklärt
- Gläubigerschutz: 4 präventive Maßnahmen
- Sicherheiten: Welche sind am zuverlässigsten?
- Vertragsgestaltung: Klauseln zum Gläubigerschutz
- Eigentumsvorbehand: Absicherung für Lieferanten
- Bürgschaft: Sinnvolle Gestaltung und Absicherung
- Kreditlimit: Wie bestimmt man es richtig?
- Schuldnerauskünfte: Legale Informationsquellen
- Bilanzanalyse: Frühwarnsignale erkennen
- Zahlungskonditionen: Optimierung für Sicherheit
- Forderungsversicherung: Kosten-Nutzen-Analyse
- Monitoring: Systematische Überwachung von Kunden

Lassen Sie sich von diesen Kategorien von Schlüsselwörtern inspirieren:
- Inkasso und Forderungsmanagement: Inkasso, Forderungen, Zahlungsverzug, Mahnwesen, Zahlungsmoral
- Vollstreckung und Insolvenzverfahren: Vollstreckung, Mahnbescheid, Insolvenzantrag, Zwangsvollstreckung
- Prävention und Bonitätsprüfung: Bonitätsprüfung, Schuldnerregister, Sicherheiten, Zahlungskonditionen

Die Überschrift sollte:
1. Mit einem starken, suchbaren Schlüsselwort beginnen (wie in den Beispielen oben)
2. Gefolgt von einer spezifischen Frage oder Lösung (max. 4-6 Wörter)
3. Relevant für Geschäftsfachleute sein
4. Sich auf praktische Probleme von Unternehmen konzentrieren
5. Suchbegriffen entsprechen, die Menschen tatsächlich bei Google eingeben
6. Klar, direkt und ansprechend sein

Geben Sie NUR die Überschrift im Format "Schlüsselwort: Frage/Lösung" zurück - nichts anderes.`;
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a specialist in generating engaging headlines for business content." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Generated headline: ${topic}`);
    
    return topic;
  } catch (error) {
    console.error("Error generating topic:", error);
    // Fallback headlines based on category and language
    let fallbackTopics = {
      en: [
        // Debt Collection & Recovery
        `Debt Collection: When to Outsource?`,
        `Receivables: How to Manage Aging Accounts?`,
        `Late Payment: 3 Effective Strategies`,
        `Insolvency: What Creditors Need to Know`,
        `Invoicing: Preventing Payment Delays`,
        `Collection Calls: Professional Communication Techniques`,
        `Payment Terms: How to Optimize Compliance?`,
        `Credit Policy: Creating Effective Guidelines`,
        `Default Interest: How to Calculate Correctly?`,
        `Debtor: How to Handle Non-Communication?`,
        
        // Legal & Enforcement
        `Legal Action: When Is It Worth Pursuing?`,
        `Enforcement: Key Steps to Success`,
        `Creditor Rights: Understanding Your Position`,
        `Statute of Limitations: Avoiding Debt Expiration`,
        `Court Proceedings: Preparation Checklist`,
        `Judgments: Converting to Actual Payment`,
        `Mediation: Alternative to Legal Action?`,
        `Bankruptcy: Navigating Creditor Claims`,
        `Execution Title: How to Obtain One?`,
        `Settlement: Negotiating Favorable Terms`,
        
        // Prevention & Risk Management
        `Credit Check: Essential Pre-Agreement Steps`,
        `Customer Screening: Red Flags to Watch`,
        `Contract Terms: Security Against Defaults`,
        `Security Interest: Types and Applications`,
        `Financial Analysis: Evaluating Client Risk`,
        `Debtor Registers: Effective Utilization`,
        `Collateral: When and How to Require?`,
        `Payment Guarantee: Best Practices`,
        `Risk Management: Preventing Bad Debt`,
        `Due Diligence: Comprehensive Client Assessment`
      ],
      cs: [
        // Vymáhání pohledávek
        `Dluh: Jak ho vymoci legálně?`,
        `Věřitel: Co dělat, když dlužník mlčí?`,
        `Faktura nezaplacena: Jak postupovat?`,
        `Vymáhání dluhu: Mimosoudně nebo soudně?`,
        `Upomínka: Jak ji správně formulovat?`,
        `Předžalobní výzva: Jaké má náležitosti?`,
        `Pohledávky: Kdy je postoupit specialistovi?`,
        `Promlčení: Jak mu předejít u pohledávek?`,
        `Inkaso: 5 kroků k rychlejšímu plnění`,
        `Platební morálka: Jak ji podpořit u klientů?`,
        
        // Exekuce a insolvence
        `Exekuce: Jaké má práva věřitel?`,
        `Exekuce: Kdy začít jednat?`,
        `Insolvence: Jak podat návrh na dlužníka?`,
        `Insolvence: Co to je a kdy nastává?`,
        `Exekuční titul: Jak ho získat?`,
        `Oddlužení: Co znamená pro věřitele?`,
        `Konkurz: Jak se přihlásit s pohledávkou?`,
        `Soudní řízení: Jak se správně připravit?`,
        `Náklady exekuce: Kdo je skutečně platí?`,
        `Rozhodčí řízení: Je lepší než soud?`,
        
        // Lustrace a prevence
        `Lustrace: Jak zjistit majetek dlužníka?`,
        `Bonita klienta: Jak ji ověřit zdarma?`,
        `Prevence neplacení: 3 klíčové kroky`,
        `Zajištění pohledávek: Jaké jsou možnosti?`,
        `Registr dlužníků: Jak ho efektivně využít?`,
        `Zástavní právo: Kdy a jak ho zřídit?`,
        `Platební morálka: Varovné signály klienta`,
        `Smlouva: 5 klauzulí pro ochranu věřitele`,
        `Due diligence: Prověření obchodního partnera`,
        `Uznání dluhu: Jak ho právně ošetřit?`
      ],
      sk: [
        // Vymáhanie pohľadávok
        `Pohľadávky: Kedy ich odovzdať na vymáhanie?`,
        `Exekúcia: Aké práva má veriteľ?`,
        `Dlžník: Čo robiť pri neplatení?`,
        `Insolvencia: Ako podať návrh efektívne?`,
        `Upomienka: Ako ju správne napísať?`,
        `Predžalobná výzva: Čo musí obsahovať?`,
        `Faktúra: Čo robiť po uplynutí splatnosti?`,
        `Vymáhanie: 5 krokov k úspešnému procesu`,
        `Veriteľ: Ako chrániť svoje práva?`,
        `Mimosúdne vymáhanie: Kedy sa vyplatí?`,
        
        // Exekúcie a insolvencia
        `Exekútor: Ako s ním efektívne komunikovať?`,
        `Exekučný titul: Ako ho získať?`,
        `Konkurz: Ako sa prihlásiť s pohľadávkou?`,
        `Reštrukturalizácia: Čo to znamená pre veriteľa?`,
        `Súdne konanie: Kedy sa oplatí?`,
        `Dobrovoľná dražba: Postup pre veriteľa`,
        `Oddlženie: Dopad na podnikateľské pohľadávky`,
        `Exekučná imunita: Čo nemôže exekútor zabaviť?`,
        `Splátkový kalendár: Kedy ho akceptovať?`,
        `Náklady exekúcie: Kto ich hradí?`,
        
        // Prevencia a lustrácia
        `Lustrácia: Ako preveriť obchodného partnera?`,
        `Platobná disciplína: Ako ju zlepšiť?`,
        `Registre dlžníkov: Ako ich správne využiť?`,
        `Zabezpečenie pohľadávok: Najlepšie nástroje`,
        `Uznanie dlhu: Prečo je dôležité?`,
        `Zmluvná pokuta: Aká výška je vymáhateľná?`,
        `Záložné právo: Kedy a ako ho zriadiť?`,
        `Bonita klienta: Ako ju jednoducho overiť?`,
        `Obchodný register: Čo všetko odhalí?`,
        `Notárska zápisnica: Výhody priamej vykonateľnosti`
      ],
      de: [
        // Inkasso und Forderungsmanagement
        `Inkasso: Wann lohnt sich ein Dienstleister?`,
        `Forderungen: Wie optimiert man die Beitreibung?`,
        `Zahlungsverzug: Sofort reagieren oder warten?`,
        `Insolvenz: Welche Rechte haben Gläubiger?`,
        `Mahnwesen: Effizienter Ablauf erklärt`,
        `Zahlungserinnerung: Wie formuliert man richtig?`,
        `Zahlungsmoral: Wie kann man sie verbessern?`,
        `Forderungsausfall: Wirksame Präventionsmaßnahmen`,
        `Mahngebühren: Was ist rechtlich durchsetzbar?`,
        `Schuldnerbeziehung: Professionelle Kommunikation`,
        
        // Vollstreckung und Insolvenzverfahren
        `Vollstreckung: Die wichtigsten Schritte`,
        `Mahnbescheid: Wie stellt man ihn richtig?`,
        `Zwangsvollstreckung: Wann ist sie sinnvoll?`,
        `Insolvenzantrag: Optimales Timing für Gläubiger`,
        `Gläubigerausschuss: Rolle und Einfluss`,
        `Vollstreckungstitel: Wege zur Beschaffung`,
        `Gerichtsvollzieher: Effektive Zusammenarbeit`,
        `Pfändung: Grenzen und Möglichkeiten`,
        `Verwertung: Optionen für gesicherte Gläubiger`,
        `Insolvenzplan: Chancen für Gläubiger`,
        `Restschuldbefreiung: Auswirkungen auf Gläubiger`,
        `Vergleich: Alternative zur Vollstreckung?`,
        
        // Prävention und Bonitätsprüfung
        `Bonitätsprüfung: Wie funktioniert sie richtig?`,
        `Schuldnerregister: Effektive Nutzung erklärt`,
        `Gläubigerschutz: 4 präventive Maßnahmen`,
        `Sicherheiten: Welche sind am zuverlässigsten?`,
        `Vertragsgestaltung: Klauseln zum Gläubigerschutz`,
        `Eigentumsvorbehand: Absicherung für Lieferanten`,
        `Bürgschaft: Sinnvolle Gestaltung und Absicherung`,
        `Kreditlimit: Wie bestimmt man es richtig?`,
        `Schuldnerauskünfte: Legale Informationsquellen`,
        `Bilanzanalyse: Frühwarnsignale erkennen`,
        `Zahlungskonditionen: Optimierung für Sicherheit`,
        `Forderungsversicherung: Kosten-Nutzen-Analyse`,
        `Monitoring: Systematische Überwachung von Kunden`
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
      if (positionKeywords.includes('finanční') || positionKeywords.includes('finančny') || positionKeywords.includes('finanz')) {
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