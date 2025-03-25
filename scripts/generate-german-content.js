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

// Function to check if text contains AI references - localized for German
function containsAIReference(text) {
  const lowerText = text.toLowerCase();
  const forbiddenTerms = [
    'ai', 'ki', 'künstliche intelligenz', 'maschinelles lernen', 'automatisierung', 
    'roboter', 'algorithmus', 'digitalisierung', 'software', 'automatisch', 
    'automatisiert', 'big data', 'machine learning', 'chatbot'
  ];
  
  return forbiddenTerms.some(term => lowerText.includes(term));
}

// Function to count AI references in text
function countAIReferences(text) {
  const lowerText = text.toLowerCase();
  const forbiddenTerms = [
    'ai', 'ki', 'künstliche intelligenz', 'maschinelles lernen', 'automatisierung', 
    'roboter', 'algorithmus', 'digitalisierung', 'software', 'automatisch', 
    'automatisiert', 'big data', 'machine learning', 'chatbot'
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
      return generateRandomTopic(category); // Recursively generate a new topic
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
async function generateUniqueApproach(topic, category) {
  try {
    console.log("Generiere einzigartigen Ansatz zum Thema...");
    
    const prompt = `Für das Thema "${topic}" in der Kategorie "${category}" schlagen Sie einen einzigartigen Blickwinkel oder Ansatz vor, der den Artikel von üblichen Texten zu diesem Thema unterscheiden würde.

Vorschlagen Sie:
1. Die Hauptthese oder das Hauptargument des Artikels
2. 3-4 Schlüsselpunkte, die der Artikel abdecken sollte
3. Eine einzigartige Perspektive oder einen Ansatz zum Thema

WICHTIGE EINSCHRÄNKUNGEN:
- Vermeiden Sie JEGLICHE Erwähnungen von Technologien, KI, Automatisierung oder Digitalisierung
- Konzentrieren Sie sich auf den menschlichen Faktor, rechtliche Aspekte, Finanzstrategien, zwischenmenschliche Beziehungen und Kommunikation
- Betonen Sie praktische Aspekte, die keine fortschrittlichen Technologien erfordern
- Bevorzugen Sie traditionell geschäftliche, rechtliche und finanzielle Blickwinkel

Antworten Sie im JSON-Format mit den Schlüsseln "mainThesis", "keyPoints" und "uniquePerspective".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Sie sind ein kreativer Content-Stratege, der sich auf finanzielle und rechtliche Themen spezialisiert hat. Sie vermeiden Themen im Zusammenhang mit Technologien und KI." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const approach = JSON.parse(completion.choices[0].message.content);
    
    // Check if the approach contains AI references
    if (containsAIReference(approach.mainThesis) || 
        approach.keyPoints.some(point => containsAIReference(point)) || 
        containsAIReference(approach.uniquePerspective)) {
      console.log("Generierter Ansatz enthält Erwähnungen von KI oder Technologien, generiere neuen Ansatz...");
      return generateUniqueApproach(topic, category); 
    }
    
    return approach;
  } catch (error) {
    console.error("Fehler bei der Generierung des Ansatzes zum Thema:", error);
    // Fallback approach without technology mentions
    return {
      mainThesis: `Es ist wichtig, praktische und rechtliche Aspekte von ${topic} zu verstehen.`,
      keyPoints: [
        "Rechtsrahmen und aktuelle Änderungen",
        "Finanzielle Auswirkungen und Risiken",
        "Effektive Kommunikationsverfahren",
        "Strategische und präventive Maßnahmen"
      ],
      uniquePerspective: `Eine Perspektive des Gleichgewichts zwischen rechtlichen Ansprüchen und der Aufrechterhaltung von Geschäftsbeziehungen im Bereich ${category.toLowerCase()}.`
    };
  }
}

// Function to get an image from Unsplash
async function getUnsplashImage(category) {
  try {
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
    
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(searchQuery)}&orientation=landscape&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
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
    } else {
      // If the first attempt fails, try a purely professional prompt without the category
      const fallbackResponse = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(randomPrompt)}&orientation=landscape&content_filter=high&client_id=${process.env.UNSPLASH_ACCESS_KEY}`,
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
    }
    
    throw new Error('Fehler beim Abrufen des Bildes von Unsplash');
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
async function generateArticleContent(topic, category, uniquePerspective) {
  try {
    console.log(`Generiere Artikelinhalt für Thema: ${topic}...`);
    
    const prompt = `Erstellen Sie einen professionellen und informativen Artikel zum Thema "${topic}" in der Kategorie "${category}". 
    
Der Artikel sollte diesen einzigartigen Blickwinkel haben: "${uniquePerspective}"

Befolgen Sie diese Spezifikationen:
1. Schreiben Sie den Artikel auf Deutsch, in einer professionellen, aber zugänglichen Sprache für Geschäftsinhaber und Unternehmer
2. Konzentrieren Sie sich auf praktische Informationen, die für den deutschen Geschäftskontext relevant sind
3. Verwenden Sie Markdown für die Formatierung
4. Verwenden Sie keine H1-Überschrift (diese wird automatisch aus dem Titel generiert)
5. Verwenden Sie H2-Überschriften (##) für Hauptabschnitte und H3 (###) für Unterabschnitte
6. Formatieren Sie wichtige Begriffe fett (**Begriff**) und Schlüsselphrasen kursiv (*Phrase*)
7. Teilen Sie den Text in kurze Absätze auf (3-4 Sätze)
8. Verwenden Sie Aufzählungspunkte für Listen und nummerierte Listen für Prozesse
9. Fügen Sie 1-2 praktische Beispiele oder Zitate ein, formatiert als Blockzitat (> Zitat)
10. Die Artikellänge sollte 800-1200 Wörter betragen
11. Fügen Sie am Ende eine Zusammenfassung der Schlüsselpunkte ein

WICHTIGE EINSCHRÄNKUNGEN:
- KOMPLETT VERMEIDEN Sie Themen im Zusammenhang mit KI, künstlicher Intelligenz, maschinellem Lernen oder Automatisierung
- Der Artikel DARF NICHT technologische Lösungen oder Digitalisierung als Hauptlösung für Probleme propagieren
- Konzentrieren Sie sich auf traditionelle Geschäftsansätze, menschlichen Faktor, rechtliche Aspekte, Verhandlungen und Strategie
- Betonen Sie praktische Aspekte, die keine fortschrittlichen Technologien erfordern

Der Artikel sollte enthalten:
- Eine Einführung, die die Bedeutung des Themas erklärt
- 3-4 Hauptabschnitte, die verschiedene Aspekte des Themas diskutieren
- Praktische Tipps oder Empfehlungen
- Eine abschließende Zusammenfassung

Der Inhalt muss aktuell, sachlich korrekt und relevant für deutsche Unternehmen und Unternehmer sein.`;

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
    
    // Check if the content contains too many AI references
    if (countAIReferences(content) > 2) { // Allow max 2 mentions to keep the content natural
      console.log("Artikelinhalt enthält zu viele Erwähnungen von KI oder Technologien, generiere neuen Inhalt...");
      return generateArticleContent(topic, category, uniquePerspective);
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
async function generateMetadata(topic, category, articleContent) {
  try {
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
    
    // Check if the metadata contains AI references
    if (containsAIReference(metadata.title) || 
        containsAIReference(metadata.subtitle) || 
        (metadata.tags && containsAIReference(metadata.tags))) {
      console.log("Metadaten enthalten Erwähnungen von KI oder Technologien, generiere neue Metadaten...");
      return generateMetadata(topic, category, articleContent);
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