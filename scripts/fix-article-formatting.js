const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Language directories to process
const languageDirs = ['posts-cs', 'posts-sk', 'posts-de', 'posts-en'];

// Get all articles from all language directories
const getAllArticles = () => {
  const articles = [];
  
  languageDirs.forEach(langDir => {
    const dirPath = path.join(process.cwd(), 'content', langDir);
    
    // Skip if directory doesn't exist
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory ${dirPath} does not exist. Skipping.`);
      return;
    }
    
    // Get all MDX files
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mdx'));
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      articles.push({
        path: filePath,
        language: langDir,
        content: fileContent,
        slug: file
      });
    });
  });
  
  return articles;
};

// Improve formatting of articles
const improveFormatting = (articles) => {
  console.log(`Improving formatting for ${articles.length} articles...`);
  
  let improved = 0;
  
  articles.forEach(article => {
    const { data, content } = matter(article.content);
    
    // Skip articles that already have good formatting
    const hasGoodFormatting = 
      content.includes('**') && // Has bold text
      (content.match(/^#{2,3}\s/gm)?.length > 2); // Has at least 3 headings
    
    if (hasGoodFormatting) {
      console.log(`Article ${article.slug} already has good formatting. Skipping.`);
      return;
    }
    
    // Extract language from directory name
    const lang = article.language.replace('posts-', '');
    
    // Improve content formatting based on language
    let improvedContent = improveContentFormatting(content, lang);
    
    // Create updated content with frontmatter
    const updatedContent = matter.stringify(improvedContent, data);
    
    // Write updated content back to file
    fs.writeFileSync(article.path, updatedContent);
    
    console.log(`Improved formatting for ${article.slug}`);
    improved++;
  });
  
  console.log(`\nImproved formatting for ${improved} out of ${articles.length} articles.`);
};

// Function to improve content formatting based on language
const improveContentFormatting = (content, lang) => {
  // Split content into paragraphs
  const paragraphs = content.split(/\n\n+/);
  
  // Check if content already has structure of intro + headings
  const hasHeadings = paragraphs.some(p => p.startsWith('##'));
  
  if (hasHeadings) {
    // If it already has headings, just enhance formatting
    return enhanceExistingContent(content, lang);
  } else {
    // If it doesn't have proper structure, create one
    return createStructuredContent(paragraphs, lang);
  }
};

// Enhance existing content with better formatting
const enhanceExistingContent = (content, lang) => {
  // Replace boring paragraph starts with bold text
  content = content.replace(
    /^([A-Z][^.!?]{10,60}(?:\.|\?|!))/gm, 
    '**$1**'
  );
  
  // Add more emphasis to key terms based on language
  const keyTerms = getKeyTermsByLanguage(lang);
  
  keyTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    content = content.replace(regex, `**${term}**`);
  });
  
  // Add horizontal rules before major sections for better separation
  content = content.replace(/^##\s(.+)$/gm, '\n\n---\n\n## $1');
  
  return content;
};

// Create structured content from paragraphs
const createStructuredContent = (paragraphs, lang) => {
  // Determine language-specific section headings
  const sections = getSectionsByLanguage(lang);
  
  // Build the new content
  let structuredContent = '';
  
  // First paragraph is typically the introduction
  if (paragraphs.length > 0) {
    structuredContent += `**${paragraphs[0]}**\n\n`;
  }
  
  // Create main sections
  let remainingParagraphs = paragraphs.slice(1);
  let paraIndex = 0;
  
  sections.forEach((section, i) => {
    structuredContent += `## ${section}\n\n`;
    
    // Number of paragraphs per section (distribute evenly)
    const parasPerSection = Math.ceil(remainingParagraphs.length / (sections.length - i));
    
    // Add paragraphs to this section
    for (let j = 0; j < parasPerSection && paraIndex < remainingParagraphs.length; j++) {
      // Add some emphasis to the first sentence of each paragraph
      const paragraph = remainingParagraphs[paraIndex];
      const enhancedParagraph = enhanceParagraph(paragraph, lang);
      
      structuredContent += enhancedParagraph + "\n\n";
      paraIndex++;
    }
    
    // If this is not the last section, ensure we have enough paragraphs left
    remainingParagraphs = paragraphs.slice(1 + paraIndex);
  });
  
  return structuredContent;
};

// Function to enhance a paragraph with formatting
const enhanceParagraph = (paragraph, lang) => {
  // Bold the first sentence
  const sentenceMatch = paragraph.match(/^([^.!?]+[.!?])\s*/);
  
  if (sentenceMatch) {
    return `**${sentenceMatch[1]}** ${paragraph.substring(sentenceMatch[0].length)}`;
  }
  
  return paragraph;
};

// Function to get section headings based on language
const getSectionsByLanguage = (lang) => {
  switch (lang) {
    case 'cs':
      return ['Úvod', 'Hlavní teze', 'Klíčové faktory', 'Praktická implementace', 'Příklady z praxe', 'Doporučené postupy', 'Závěr'];
    case 'sk':
      return ['Úvod', 'Hlavná téza', 'Kľúčové faktory', 'Praktická implementácia', 'Príklady z praxe', 'Odporúčané postupy', 'Záver'];
    case 'de':
      return ['Einleitung', 'Hauptthese', 'Schlüsselfaktoren', 'Praktische Umsetzung', 'Praxisbeispiele', 'Empfehlungen', 'Fazit'];
    case 'en':
    default:
      return ['Introduction', 'Main Thesis', 'Key Factors', 'Practical Implementation', 'Case Studies', 'Recommendations', 'Conclusion'];
  }
};

// Function to get key terms by language
const getKeyTermsByLanguage = (lang) => {
  switch (lang) {
    case 'cs':
      return ['pohledávka', 'pohledávek', 'vymáhání', 'dlužník', 'věřitel', 'insolvence', 'mediace', 'inkaso', 'právo', 'zákon'];
    case 'sk':
      return ['pohľadávka', 'pohľadávok', 'vymáhanie', 'dlžník', 'veriteľ', 'insolvencia', 'mediácia', 'inkaso', 'právo', 'zákon'];
    case 'de':
      return ['Forderung', 'Forderungen', 'Inkasso', 'Schuldner', 'Gläubiger', 'Insolvenz', 'Mediation', 'Recht', 'Gesetz'];
    case 'en':
    default:
      return ['receivable', 'receivables', 'collection', 'debtor', 'creditor', 'insolvency', 'mediation', 'law', 'legal'];
  }
};

// Main execution
const articles = getAllArticles();
improveFormatting(articles);

console.log('Done improving article formatting.'); 