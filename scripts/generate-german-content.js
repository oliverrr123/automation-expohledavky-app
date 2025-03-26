const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const matter = require('gray-matter');

// Import shared utilities
const { 
  generateArticleContent, 
  getArticleImage, 
  getAuthorProfileImage,
  containsAIReference 
} = require('./article-generation-utils');

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

// Authors for German articles with gender specification for profile images
const authors = [
  {
    name: "Thomas Schmidt",
    position: "Forderungsspezialist",
    bio: "Forderungsspezialist mit mehr als 10 Jahren Erfahrung im Bereich Forderungsmanagement und Inkasso.",
    gender: "male"
  },
  {
    name: "Dr. Michael Weber",
    position: "Rechtsexperte",
    bio: "Jurist mit Spezialisierung auf Handelsrecht und Forderungsmanagement, mit umfangreicher Erfahrung in der Rechtsberatung.",
    gender: "male"
  },
  {
    name: "Dipl.-Kfm. Anna Fischer",
    position: "Finanzanalystin",
    bio: "Finanzanalystin mit Fokus auf Cashflow-Management und Prävention von Zahlungsunfähigkeit.",
    gender: "female"
  }
];

// Function to select a random element from an array
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to generate random topic based on category
async function generateRandomTopic(category) {
  try {
    console.log(`Generiere ein zufälliges Thema für die Kategorie: ${category}...`);
    
    const prompt = `Generiere ein originelles, interessantes und anregendes Thema für einen Fachartikel über Forderungen in der Kategorie "${category}".
    
Das Thema sollte:
1. Relevant für den deutschen Rechtsrahmen und attraktiv für Geschäftsfachleute sein
2. Auf praktische und strategische Aspekte des Forderungsmanagements und Inkassos ausgerichtet sein
3. Geeignet für einen umfassenden Fachartikel mit einer Länge von 1500-2000 Wörtern sein
4. Spezifisch genug sein, um wertvolle Erkenntnisse zu liefern, anstatt einen allgemeinen Überblick zu geben
5. Innovativ sein und neue Perspektiven oder neue Trends untersuchen

Vermeide Themen im Zusammenhang mit künstlicher Intelligenz, Automatisierung oder Technologien.
Gib nur den Namen des Themas ohne weitere Kommentare zurück.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Du bist ein Spezialist für Forderungen und rechtliche Aspekte ihrer Verwaltung mit umfangreicher Erfahrung in der Erstellung von Inhalten für Fachleute. Generiere praktische, spezifische und innovative Themen für Fachartikel." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.9,
      max_tokens: 100,
    });
    
    const topic = completion.choices[0].message.content.trim();
    console.log(`Generiertes Thema: ${topic}`);
    
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
      `Aktuelle Trends im Bereich ${category.toLowerCase()}`,
      `Praktischer Leitfaden: ${category}`,
      `Wie man ${category.toLowerCase()} im Jahr ${new Date().getFullYear()} optimiert`,
      `Häufige Fehler im ${category.toLowerCase()}`,
      `Die Zukunft des ${category.toLowerCase()} in einem sich verändernden wirtschaftlichen Umfeld`,
      `Rechtliche Aspekte des ${category.toLowerCase()} nach Gesetzesänderungen`,
      `Finanzielle Auswirkungen eines guten ${category.toLowerCase()}`,
      `Strategischer Ansatz zum ${category.toLowerCase()} für kleine Unternehmen`
    ]);
    
    return {
      topic: fallbackTopic,
      mainThesis: `Es ist wichtig, die Aspekte des ${fallbackTopic} zu verstehen.`,
      keyPoints: [
        "Rechtlicher Rahmen und aktuelle Änderungen",
        "Praktische Verfahren und Empfehlungen",
        "Fallstudien und praktische Beispiele",
        "Finanzielle und rechtliche Aspekte des Themas"
      ],
      uniquePerspective: `Eine Perspektive unter dem Gesichtspunkt der Effizienz und Prozessoptimierung im Bereich ${category.toLowerCase()}.`
    };
  }
}

// Function to generate a unique approach to a topic
async function generateUniqueApproach(topic, category) {
  try {
    console.log("Generiere einen einzigartigen Ansatz zum Thema...");
    
    const prompt = `Für das Thema "${topic}" in der Kategorie "${category}" entwickle einen durchdachten und einzigartigen Ansatz für einen Fachartikel.

Schlage vor:
1. Eine überzeugende Hauptthese, die eine klare Richtung für einen Artikel mit einer Länge von 1500-2000 Wörtern bietet
2. 5-6 Schlüsselpunkte, die Tiefe und umfassende Abdeckung des Themas bieten
3. Eine wirklich einzigartige Perspektive, die den Artikel von Standardabhandlungen unterscheidet
4. Spezifikation der Zielgruppe und wie dieser Ansatz gerade für sie von Nutzen sein wird

Konzentriere dich auf rechtliche, finanzielle und geschäftliche Aspekte und stelle sicher, dass der Ansatz theoretisches Wissen mit praktischer Anwendung kombiniert.
Antworte im JSON-Format mit den Schlüsseln "mainThesis", "keyPoints", "uniquePerspective" und "targetAudience".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Du bist ein kreativer Content-Stratege, spezialisiert auf Finanz- und Rechtsthemen mit Fachkenntnissen in der Erstellung hochwertiger Inhalte für Geschäftsfachleute." 
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
    console.error("Fehler bei der Generierung des Ansatzes:", error);
    return {
      mainThesis: `Der Schlüssel zu einer erfolgreichen Lösung im Bereich ${category.toLowerCase()} ist ein strukturierter und systematischer, ergebnisorientierter Ansatz.`,
      keyPoints: [
        "Rechtlicher Rahmen und seine praktischen Auswirkungen",
        "Effektive Kommunikation und Verhandlung",
        "Finanzielle Perspektive und Planung",
        "Prävention von Problemen und Risiken",
        "Langfristige Strategie zur Nachhaltigkeit von Beziehungen"
      ],
      uniquePerspective: `Fokus auf Beziehungsmanagement als Schlüsselfaktor für den Erfolg im Forderungsmanagement.`,
      targetAudience: "Finanzmanager und Direktoren kleiner und mittlerer Unternehmen"
    };
  }
}

// Function to generate metadata for the article
async function generateMetadata(topic, category, articleContent) {
  try {
    console.log('Generiere Metadaten für den Artikel...');
    
    const prompt = `Für einen Artikel zum Thema "${topic}" in der Kategorie "${category}" erstelle Metadaten.

Generiere:
1. Einen ansprechenden Titel: max. 70 Zeichen
2. Einen Untertitel: kurze Zusammenfassung des Hauptthemas
3. Eine Beschreibung: max. 150 Zeichen, die zusammenfassen, worum es in dem Artikel geht
4. Schlüsselwörter: 4-7 relevante Tags, durch Kommas getrennt
5. Lesezeit: geschätzte Lesezeit in Minuten

Antworte im JSON-Format mit den Schlüsseln "title", "subtitle", "description", "tags", "readTime".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Du bist ein Experte für SEO und Content-Erstellung. Du erstellst präzise und ansprechende Metadaten für Fachartikel." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });
    
    const metaData = JSON.parse(completion.choices[0].message.content);
    return metaData;
  } catch (error) {
    console.error('Fehler bei der Generierung von Metadaten:', error);
    // Default metadata if the API call fails
    return {
      title: topic,
      subtitle: `Praktischer Leitfaden im Bereich ${category}`,
      description: `Umfassender Überblick über das Thema ${topic} mit praktischen Ratschlägen und Verfahren für deutsche Unternehmer`,
      tags: `Forderungen, ${category.toLowerCase()}, Finanzen, Recht, Unternehmensführung`,
      readTime: '8 min'
    };
  }
}

// Function to create a slug from a title
function createSlug(title) {
  return title
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Main function to generate German content
async function generateGermanContent() {
  try {
    console.log('Starte die Generierung deutscher Inhalte...');
    
    // 1. Select category
    console.log('Wähle eine Kategorie...');
    const category = getRandomElement(categories);
    console.log(`Ausgewählte Kategorie: ${category}`);
    
    // 2. Generate topic using OpenAI
    console.log('Generiere ein Thema mit OpenAI...');
    const topicResult = await generateRandomTopic(category);
    const topic = topicResult.topic;
    
    // 3. Select author
    console.log('Wähle einen Autor...');
    const author = getRandomElement(authors);
    console.log(`Ausgewählter Autor: ${author.name}, ${author.position}`);
    
    // 4. Generate author profile image
    const authorImagePath = await getAuthorProfileImage(author, 'de');
    
    // 5. Generate article content using OpenAI
    console.log('Generiere Artikelinhalt mit OpenAI...');
    const articleContent = await generateArticleContent(openai, topic, category, topicResult, 'de');
    
    // 6. Generate metadata
    console.log('Generiere Metadaten für den Artikel...');
    const metaData = await generateMetadata(topic, category, articleContent);
    
    // 7. Get image from Unsplash
    console.log("Lade ein Bild von Unsplash...");
    const imageData = await getArticleImage(category, topic);
    
    // 8. Create MDX file
    console.log('Erstelle MDX-Datei...');
    
    // Create a slug for the article
    const slug = createSlug(topic);
    
    // Format the date - next day from today
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format frontmatter
    const frontMatter = {
      title: metaData.title || topic,
      subtitle: metaData.subtitle,
      date: tomorrow.toISOString(),
      description: metaData.description,
      image: imageData.path,
      category: category,
      tags: metaData.tags.split(',').map(tag => tag.trim()),
      author: author.name,
      authorPosition: author.position,
      authorImage: authorImagePath,
      authorBio: author.bio,
      readTime: metaData.readTime,
      imageCredit: imageData.photographer,
      generatedTopic: topic,
      uniqueApproach: topicResult.uniquePerspective
    };
    
    // Serialize frontmatter to YAML
    const mdxContent = matter.stringify(articleContent, frontMatter);
    
    // Create filename with date and slug
    const date = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const fileName = `${date}-${createSlug(topic)}.mdx`;
    const filePath = path.join(process.cwd(), 'content', 'posts-de', fileName);
    
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(filePath, mdxContent);
    console.log(`MDX-Datei erstellt: ${filePath}`);
    
    console.log('----------------------------------------');
    console.log('🎉 Artikelgenerierung erfolgreich abgeschlossen!');
    console.log('----------------------------------------');
    console.log(`Titel: ${metaData.title || topic}`);
    console.log(`Slug: ${slug}`);
    console.log(`Kategorie: ${category}`);
    
    // Return basic article info for potential further use
    return {
      title: metaData.title || topic,
      slug: slug,
      imagePath: imageData.path,
      topic: topic,
      category: category
    };
  } catch (error) {
    console.error('Fehler bei der Generierung deutscher Inhalte:', error);
    throw error;
  }
}

// Run the function
generateGermanContent()
  .then(() => console.log('Prozess der Generierung deutscher Inhalte abgeschlossen'))
  .catch(error => console.error('Fehler im Hauptprozess:', error)); 