const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const matter = require('gray-matter');

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Categories for German articles
const categories = [
  'Forderungsmanagement',
  'Finanzanalyse',
  'Inkasso',
  'Inkasso-Ethik',
  'Insolvenz',
  'Prävention'
];

// Authors for German articles
const authors = [
  {
    name: "Hans Müller",
    position: "Forderungsspezialist",
    image: "/placeholder.svg?height=120&width=120",
    bio: "Ein Experte für Forderungsmanagement und Inkasso mit mehr als 10 Jahren Erfahrung in diesem Bereich."
  },
  {
    name: "Dr. Claudia Weber",
    position: "Rechtsspezialistin",
    image: "/placeholder.svg?height=120&width=120",
    bio: "Eine Juristin, die sich auf Handelsrecht und Forderungseintreibung spezialisiert hat, mit umfangreicher Praxis in der Rechtsberatung."
  },
  {
    name: "Thomas Schmidt",
    position: "Finanzanalytiker",
    image: "/placeholder.svg?height=120&width=120",
    bio: "Ein Finanzanalytiker, der sich auf Cashflow-Management und Prävention von Zahlungsunfähigkeit konzentriert."
  }
];

// Function to select a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to check if text contains AI references
function containsAIReference(text) {
  const lowerText = text.toLowerCase();
  // Simplified list of basic terms
  const forbiddenTerms = [
    'ai', 'künstliche intelligenz'
  ];
  
  // More permissive check - only flag if multiple terms appear
  let count = 0;
  forbiddenTerms.forEach(term => {
    if (lowerText.includes(term)) count++;
  });
  
  return count > 1; // Only consider it AI reference if multiple terms appear
}

// Function to count AI references in text
function countAIReferences(text) {
  const lowerText = text.toLowerCase();
  // Redukovaný seznam základních termínů
  const forbiddenTerms = [
    'ai', 'künstliche intelligenz'
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
async function generateRandomTopic(category, retryCount = 0) {
  try {
    // Add retry limit to prevent infinite recursion
    if (retryCount > 3) {
      console.log("Maximale Anzahl von Versuchen bei der Themengenerierung erreicht, Fallback-Lösung wird verwendet...");
      // Return fallback topic
      const fallbackTopic = getRandomElement([
        `Aktuelle Trends im ${category.toLowerCase()}`,
        `Praktischer Leitfaden: ${category}`,
        `Wie man ${category.toLowerCase()} im Jahr ${new Date().getFullYear()} optimiert`,
        `Häufige Fehler im ${category.toLowerCase()}`,
        `Die Zukunft des ${category.toLowerCase()} in einer sich verändernden Wirtschaftsumgebung`,
        `Rechtliche Aspekte des ${category.toLowerCase()} nach Gesetzesänderungen`,
        `Finanzielle Auswirkungen des richtigen ${category.toLowerCase()}`,
        `Strategischer Ansatz zum ${category.toLowerCase()} für kleine Unternehmen`
      ]);
      
      return {
        topic: fallbackTopic,
        mainThesis: `Es ist wichtig, die Aspekte von ${fallbackTopic} zu verstehen.`,
        keyPoints: [
          "Rechtsrahmen und aktuelle Änderungen",
          "Praktische Verfahren und Empfehlungen",
          "Fallstudien und praktische Beispiele",
          "Finanzielle und rechtliche Aspekte des Themas"
        ],
        uniquePerspective: `Eine Perspektive der Effizienz und Prozessoptimierung im Bereich ${category.toLowerCase()}.`
      };
    }
    
    console.log(`Generiere zufälliges Thema für Kategorie: ${category}...`);
    
    const prompt = `Generiere ein originelles, spezifisches und interessantes Thema für einen Fachartikel über Forderungen in der Kategorie "${category}".
    
Das Thema sollte:
1. Relevant für den deutschen Rechtsrahmen sein
2. Auf praktische Aspekte des Forderungsmanagements und Inkassos für Unternehmen fokussiert sein
3. Spezifisch sein (nicht allgemein wie "Inkasso", sondern eher "Strategien für die Forderungseintreibung bei KMUs in Zeiten wirtschaftlicher Rezession")
4. Aktuell sein und aktuelle Geschäftstrends und wirtschaftliche Situationen widerspiegeln
5. Interessant für Geschäftsinhaber und Unternehmer sein
6. Geeignet für einen Fachartikel mit 800-1200 Wörtern sein

WICHTIGE EINSCHRÄNKUNGEN:
- KOMPLETT VERMEIDEN Sie Themen im Zusammenhang mit KI, künstlicher Intelligenz, maschinellem Lernen oder Automatisierung
- NIEMALS KI oder Automatisierung im Titel oder als Hauptthema erwähnen
- Konzentrieren Sie sich AUSSCHLIESSLICH auf traditionelle finanzielle, rechtliche, prozedurale und beziehungsorientierte Aspekte von Forderungen
- Das Thema muss relevant für reguläre Unternehmer ohne Kenntnisse fortschrittlicher Technologien sein
- Bevorzugen Sie Themen über spezifische Verfahren, rechtliche Aspekte, Verhandlungen und Finanzstrategien

Geben Sie nur den Themennamen ohne zusätzliche Kommentare oder Erklärungen zurück. Das Thema muss auf Deutsch sein.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Sie sind ein Spezialist für Forderungen, rechtliche Aspekte ihres Managements und ihrer Eintreibung. Ihre Aufgabe ist es, originelle und spezifische Themen für Fachartikel zu generieren, die sich auf Geschäft, Finanzen und Recht konzentrieren. Sie vermeiden ALLE Themen im Zusammenhang mit Technologien und KI. Sie konzentrieren sich auf praktische Aspekte der Forderungseintreibung aus rechtlicher, finanzieller und zwischenmenschlicher Sicht." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Generiertes Thema: ${topic}`);
    
    // Check if the topic contains AI references
    if (containsAIReference(topic)) {
      console.log("Thema enthält Erwähnung von KI oder Automatisierung, generiere neues Thema...");
      return generateRandomTopic(category, retryCount + 1); // Pass retry count
    }
    
    // Get a unique approach to the topic
    const approach = await generateUniqueApproach(topic, category);
    
    return {
      topic: topic,
      mainThesis: approach.mainThesis,
      keyPoints: approach.keyPoints,
      uniquePerspective: approach.uniquePerspective
    };
  } catch (error) {
    console.error("Fehler bei der Generierung des Themas:", error);
    // Fallback topics in case of API failure
    const fallbackTopic = getRandomElement([
      `Aktuelle Trends im ${category.toLowerCase()}`,
      `Praktischer Leitfaden: ${category}`,
      `Wie man ${category.toLowerCase()} im Jahr ${new Date().getFullYear()} optimiert`,
      `Häufige Fehler im ${category.toLowerCase()}`,
      `Die Zukunft des ${category.toLowerCase()} in einer sich verändernden Wirtschaftsumgebung`,
      `Rechtliche Aspekte des ${category.toLowerCase()} nach Gesetzesänderungen`,
      `Finanzielle Auswirkungen des richtigen ${category.toLowerCase()}`,
      `Strategischer Ansatz zum ${category.toLowerCase()} für kleine Unternehmen`
    ]);
    
    return {
      topic: fallbackTopic,
      mainThesis: `Es ist wichtig, die Aspekte von ${fallbackTopic} zu verstehen.`,
      keyPoints: [
        "Rechtsrahmen und aktuelle Änderungen",
        "Praktische Verfahren und Empfehlungen",
        "Fallstudien und praktische Beispiele",
        "Finanzielle und rechtliche Aspekte des Themas"
      ],
      uniquePerspective: `Eine Perspektive der Effizienz und Prozessoptimierung im Bereich ${category.toLowerCase()}.`
    };
  }
}

// Function to generate a unique approach to a topic
async function generateUniqueApproach(topic, category, retryCount = 0) {
  try {
    // Add retry limit to prevent infinite recursion
    if (retryCount > 3) {
      console.log("Maximale Anzahl von Versuchen bei der Ansatzgenerierung erreicht, Fallback-Lösung wird verwendet...");
      return {
        mainThesis: `Der Schlüssel zu einer erfolgreichen Lösung im Bereich ${category.toLowerCase()} ist ein strukturierter und systematischer Ansatz mit Fokus auf Ergebnisse.`,
        keyPoints: [
          "Rechtlicher Rahmen und seine praktischen Auswirkungen",
          "Effektive Kommunikation und Verhandlung",
          "Finanzielle Perspektive und Planung",
          "Prävention von Problemen und Risiken"
        ],
        uniquePerspective: `Fokus auf Beziehungsmanagement als Schlüsselfaktor für den Erfolg bei der Forderungsabwicklung.`
      };
    }
    
    console.log("Generiere einzigartigen Ansatz zum Thema...");
    
    const prompt = `Für das Thema "${topic}" in der Kategorie "${category}" schlage einen Ansatz für einen Fachartikel vor.

Schlage vor:
1. Die Hauptthese des Artikels
2. 3-4 Kernpunkte, die der Artikel abdecken sollte
3. Eine einzigartige Perspektive oder einen Ansatz zum Thema

Konzentriere dich auf rechtliche, finanzielle und geschäftliche Aspekte.
Vermeide Erwähnungen von KI und Technologie.
Antworte im JSON-Format mit den Schlüsseln "mainThesis", "keyPoints" und "uniquePerspective".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Du bist ein kreativer Content-Stratege, der sich auf Finanz- und Rechtsthemen spezialisiert hat." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const approach = JSON.parse(completion.choices[0].message.content);
    
    // Simplified AI reference check
    if (containsAIReference(JSON.stringify(approach))) {
      console.log("Generierter Ansatz enthält Erwähnungen von KI oder Technologien, generiere neuen Ansatz...");
      return generateUniqueApproach(topic, category, retryCount + 1); // Pass retry count
    }
    
    return approach;
  } catch (error) {
    console.error("Fehler beim Generieren des Ansatzes:", error);
    return {
      mainThesis: `Der Schlüssel zu einer erfolgreichen Lösung im Bereich ${category.toLowerCase()} ist ein strukturierter und systematischer Ansatz mit Fokus auf Ergebnisse.`,
      keyPoints: [
        "Rechtlicher Rahmen und seine praktischen Auswirkungen",
        "Effektive Kommunikation und Verhandlung",
        "Finanzielle Perspektive und Planung",
        "Prävention von Problemen und Risiken"
      ],
      uniquePerspective: `Fokus auf Beziehungsmanagement als Schlüsselfaktor für den Erfolg bei der Forderungsabwicklung.`
    };
  }
}

// Function to get an image from Unsplash
async function getUnsplashImage(category) {
  try {
    console.log('Rufe Bild von Unsplash ab...');
    
    // Professional business prompts without technological focus
    const businessPrompts = [
      "professional business meeting",
      "corporate office",
      "business people handshake",
      "modern office",
      "business professionals",
      "corporate team meeting",
      "financial documents",
      "executive desk",
      "business contract signing",
      "professional corporate environment",
      "business negotiation",
      "legal documents",
      "handshake agreement",
      "business consultation",
      "office meeting room"
    ];
    
    // Randomly select one of the professional prompts
    const randomPrompt = businessPrompts[Math.floor(Math.random() * businessPrompts.length)];
    
    // Add the category as a supplement to the main professional prompt
    const searchQuery = `${randomPrompt} ${category}`;
    
    // Access Unsplash API via proxy (or direct if you have API key setup)
    const response = await fetch(`https://source.unsplash.com/1600x900/?${encodeURIComponent(searchQuery)}`);
    
    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen des Bildes: ${response.statusText}`);
    }
    
    // Get the final URL after redirects (this will be the actual image URL)
    const imageUrl = response.url;
    
    // Get the image ID from the URL
    const imageId = imageUrl.match(/photo-([^/]+)/)?.[1] || 'unknown';
    
    // Create directory for images if it doesn't exist
    const imageDir = path.join(process.cwd(), 'public', 'images', 'unsplash');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Fehler beim Herunterladen des Bildes: ${imageResponse.statusText}`);
    }
    
    // Convert the response to a buffer
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    const imageBuffer = Buffer.from(imageArrayBuffer);
    
    // Save the image to the local file system
    const localImageFilename = `unsplash-${imageId}-${Date.now()}.jpg`;
    const localImagePath = path.join(imageDir, localImageFilename);
    fs.writeFileSync(localImagePath, imageBuffer);
    
    console.log(`Bild erfolgreich heruntergeladen und gespeichert als: ${localImagePath}`);
    
    // Return the image URL and credit for use in the article
    return {
      url: `/images/unsplash/${localImageFilename}`,
      credit: {
        name: 'Unsplash',
        link: 'https://unsplash.com'
      }
    };
  } catch (error) {
    console.error('Fehler beim Abrufen des Bildes von Unsplash:', error);
    // Fallback to a default image
    return {
      url: '/images/default-business.jpg',
      credit: {
        name: 'Default Image',
        link: 'https://expohledavky.cz'
      }
    };
  }
}

// Function to generate article content
async function generateArticleContent(topic, category, uniquePerspective, retryCount = 0) {
  try {
    // Add retry limit to prevent infinite recursion
    if (retryCount > 3) {
      console.log("Maximale Anzahl von Versuchen bei der Inhaltsgenerierung erreicht, Fallback-Lösung wird verwendet...");
      // Return fallback content
      return `
## Einführung zu ${topic}

Im heutigen Geschäftsumfeld wird das Thema "${topic}" immer wichtiger. Dieser Artikel konzentriert sich auf Schlüsselaspekte aus der Perspektive "${uniquePerspective}".

## Rechtlicher Rahmen

Deutsche Gesetze in diesem Bereich definieren mehrere wichtige Regeln, die Unternehmen befolgen müssen.

## Praktische Verfahren

Für eine effektive Lösung dieses Problems empfehlen wir, diese Schritte zu befolgen:

1. Analysieren Sie die aktuelle Situation
2. Konsultieren Sie einen Experten
3. Implementieren Sie vorbeugende Maßnahmen

## Fallstudien

> "In unserem Unternehmen haben wir ein neues Kommunikationssystem mit Schuldnern eingeführt, das den Erfolg bei der Eintreibung um 35% verbessert hat." - Erfahrener Unternehmer

## Abschließende Zusammenfassung

Das Thema "${topic}" erfordert einen strategischen Ansatz und Kenntnis der aktuellen Gesetzgebung. Durch die Implementierung der empfohlenen Verfahren können Sie Ihre Ergebnisse deutlich verbessern.
`;
    }
    
    console.log(`Generiere Artikelinhalt für Thema: ${topic}...`);
    
    const prompt = `Erstellen Sie einen professionellen Artikel zum Thema "${topic}" in der Kategorie "${category}".

Hauptthese: "${uniquePerspective.mainThesis}"

Wichtige Punkte:
${uniquePerspective.keyPoints.map(point => `- ${point}`).join('\n')}

Einzigartige Perspektive: "${uniquePerspective.uniquePerspective}"

WICHTIGE EINSCHRÄNKUNGEN:
- ABSOLUT VERMEIDEN Sie jegliche Erwähnung von Technologie, Automatisierung, Digitalisierung oder künstlicher Intelligenz
- Konzentrieren Sie sich auf traditionelle Geschäftsansätze, zwischenmenschliche Beziehungen, rechtliche Aspekte und Strategie
- Betonen Sie praktische Aspekte, die keine fortschrittlichen Technologien erfordern

Schreiben Sie für ein Publikum aus Unternehmern, Managern und Finanzexperten.
Konzentrieren Sie sich auf den deutschen Geschäfts- und Rechtskontext.
Bieten Sie praktische Beispiele und konkrete Vorgehensweisen.
Der Artikel sollte etwa 800-1200 Wörter umfassen.

Formatieren Sie den Text in Markdown:
- Verwenden Sie ## für Hauptüberschriften
- ### für Unterüberschriften
- Aufzählungspunkte für Listen
- > für Zitate
- **Fettschrift** für wichtige Begriffe
- *Kursiv* für Betonung`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Sie sind ein Experte für Forderungen, Finanzmanagement und deutsches Handelsrecht. Sie schreiben professionelle, sachlich korrekte und praktisch ausgerichtete Artikel für Unternehmer ohne Schwerpunkt auf Technologien. Sie verwenden immer qualitativ hochwertige Textstrukturierung, Überschriften, Aufzählungspunkte und andere Elemente für eine bessere Lesbarkeit." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });
    
    const content = completion.choices[0].message.content.trim();
    
    // More permissive check for AI references
    if (countAIReferences(content) > 3) { // Increased threshold to 3
      console.log("Artikelinhalt enthält zu viele Erwähnungen von KI oder Technologien, generiere neuen Inhalt...");
      return generateArticleContent(topic, category, uniquePerspective, retryCount + 1);
    }
    
    return content;
  } catch (error) {
    console.error("Fehler bei der Generierung des Artikelinhalts:", error);
    // Fallback content without technology mentions
    return `
## Einführung zu ${topic}

Im heutigen Geschäftsumfeld wird das Thema "${topic}" immer wichtiger. Dieser Artikel konzentriert sich auf Schlüsselaspekte aus der Perspektive "${uniquePerspective}".

## Rechtlicher Rahmen

Deutsche Gesetze in diesem Bereich definieren mehrere wichtige Regeln, die Unternehmen befolgen müssen.

## Praktische Verfahren

Für eine effektive Lösung dieses Problems empfehlen wir, diese Schritte zu befolgen:

1. Analysieren Sie die aktuelle Situation
2. Konsultieren Sie einen Experten
3. Implementieren Sie vorbeugende Maßnahmen

## Fallstudien

> "In unserem Unternehmen haben wir ein neues Kommunikationssystem mit Schuldnern eingeführt, das den Erfolg bei der Eintreibung um 35% verbessert hat." - Erfahrener Unternehmer

## Abschließende Zusammenfassung

Das Thema "${topic}" erfordert einen strategischen Ansatz und Kenntnis der aktuellen Gesetzgebung. Durch die Implementierung der empfohlenen Verfahren können Sie Ihre Ergebnisse deutlich verbessern.
`;
  }
}

// Function to generate article metadata
async function generateMetadata(topic, category, articleContent, retryCount = 0) {
  try {
    // Add retry limit to prevent infinite recursion
    if (retryCount > 3) {
      console.log("Maximale Anzahl von Versuchen bei der Metadatengenerierung erreicht, Fallback-Lösung wird verwendet...");
      
      // Create estimated reading time
      const wordCount = articleContent.split(/\s+/).length;
      const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
      
      // Return fallback metadata
      return {
        title: topic,
        subtitle: `Praktische Informationen über ${topic} für deutsche Unternehmen`,
        description: `Fachartikel zum Thema ${topic} in der Kategorie ${category}. Praktische Ratschläge und Tipps für Unternehmer.`,
        tags: `${category.toLowerCase()}, forderungen, forderungsmanagement, deutsche unternehmen, unternehmertum, rechtliche aspekte`,
        readTime: `${readTimeMinutes} Minuten Lesezeit`
      };
    }
    
    console.log("Generiere Artikelmetadaten...");
    
    const prompt = `Basierend auf diesem Artikel zum Thema "${topic}" in der Kategorie "${category}" generieren Sie die folgenden Metadaten:

1. Ansprechender Titel (max. 60 Zeichen)
2. Fesselnder Untertitel (max. 100 Zeichen)
3. Kurze SEO-Beschreibung (max. 160 Zeichen)
4. 5-7 relevante Tags, durch Kommas getrennt
5. Geschätzte Lesezeit im Format "X Minuten Lesezeit"

WICHTIGE EINSCHRÄNKUNGEN:
- Vermeiden Sie JEGLICHE Erwähnungen von KI, Technologien oder Automatisierung im Titel und Untertitel
- Bevorzugen Sie Tags, die sich auf Finanzen, Recht, Geschäftsbeziehungen und praktische Aspekte konzentrieren

Antworten Sie im JSON-Format mit den Schlüsseln "title", "subtitle", "description", "tags" und "readTime".

Artikelinhalt:
${articleContent.substring(0, 1500)}...`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Sie sind ein Spezialist für SEO und die Erstellung von Metadaten für Fachartikel. Ihre Aufgabe ist es, ansprechende, aber professionelle Titel und Beschreibungen ohne Schwerpunkt auf Technologien zu erstellen."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const metadata = JSON.parse(completion.choices[0].message.content);
    
    // More permissive check for AI references
    if (containsAIReference(metadata.title) && containsAIReference(metadata.subtitle)) {
      console.log("Metadaten enthalten Erwähnungen von KI oder Technologien, generiere neue Metadaten...");
      return generateMetadata(topic, category, articleContent, retryCount + 1);
    }
    
    return metadata;
  } catch (error) {
    console.error("Fehler bei der Generierung von Metadaten:", error);
    
    // Create estimated reading time (assuming an average reading speed of 200 words per minute)
    const wordCount = articleContent.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    
    // Fallback metadata without technology mentions
    return {
      title: topic,
      subtitle: `Praktische Informationen über ${topic} für deutsche Unternehmen`,
      description: `Fachartikel zum Thema ${topic} in der Kategorie ${category}. Praktische Ratschläge und Tipps für Unternehmer.`,
      tags: `${category.toLowerCase()}, forderungen, forderungsmanagement, deutsche unternehmen, unternehmertum, rechtliche aspekte`,
      readTime: `${readTimeMinutes} Minuten Lesezeit`
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
async function generateGermanContent() {
  try {
    // 1. Randomly select a category from the predefined list
    console.log("Kategorie auswählen...");
    const category = getRandomElement(categories);
    console.log(`Ausgewählte Kategorie: ${category}`);
    
    // 2. Generate a random topic within the selected category
    console.log("Thema mit OpenAI generieren...");
    const topicResult = await generateRandomTopic(category);
    const topic = topicResult.topic;
    console.log(`Generiertes Thema: ${topic}`);
    
    // 3. Randomly select an author
    console.log("Autor auswählen...");
    const author = getRandomElement(authors);
    console.log(`Ausgewählter Autor: ${author.name}, ${author.position}`);
    
    // 4. Generate article content
    console.log("Artikelinhalt mit OpenAI generieren...");
    const articleContent = await generateArticleContent(topic, category, topicResult.uniquePerspective);
    
    // 5. Generate metadata (title, subtitle, description, tags, reading time)
    console.log("Artikelmetadaten generieren...");
    const metaData = await generateMetadata(topic, category, articleContent);
    
    // Create SEO-friendly slug from the title
    const slug = createSlug(metaData.title);
    
    // 6. Get an image from Unsplash
    console.log("Bild von Unsplash abrufen...");
    const imageData = await getUnsplashImage(category);
    
    // 7. Create MDX file
    console.log("MDX-Datei erstellen...");
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
    const contentDir = path.join(process.cwd(), 'content', 'posts-de');
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    // Format the current date for the filename (YYYY-MM-DD)
    const today = new Date();
    const datePrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Save MDX file
    const mdxFilePath = path.join(contentDir, `${datePrefix}-${slug}.mdx`);
    fs.writeFileSync(mdxFilePath, mdxContent);
    console.log(`MDX-Datei erstellt: ${mdxFilePath}`);
    
    console.log("----------------------------------------");
    console.log("🎉 Artikelgenerierung erfolgreich abgeschlossen!");
    console.log("----------------------------------------");
    console.log(`Titel: ${metaData.title}`);
    console.log(`Slug: ${slug}`);
    console.log(`Kategorie: ${category}`);
    console.log("----------------------------------------");
    
    return {
      success: true,
      title: metaData.title,
      slug: slug,
      imagePath: imageData.url,
      topic: topic,
      category: category
    };
  } catch (error) {
    console.error("Fehler bei der Generierung des Artikels:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the script
generateGermanContent().catch(console.error); 