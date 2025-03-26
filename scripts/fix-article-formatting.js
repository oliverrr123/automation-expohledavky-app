const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Language directories to process
const languageDirs = ['posts-cs', 'posts-sk', 'posts-de', 'posts-en'];

// Get all articles from a directory
const getArticles = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist. Skipping.`);
    return [];
  }
  
  const files = fs.readdirSync(dirPath).filter(file => file.endsWith('.mdx'));
  return files.map(file => ({
    filename: file,
    path: path.join(dirPath, file)
  }));
};

// Function to improve formatting with better headings, bold text, etc.
const improveFormatting = (content, language) => {
  // Check if the content already has good formatting (multiple headers and emphasis)
  const headingCount = (content.match(/^#+\s/gm) || []).length;
  const emphasisCount = (content.match(/\*\*([^*]+)\*\*/g) || []).length;
  
  // If content already has good formatting, return it unchanged
  if (headingCount >= 3 && emphasisCount >= 5) {
    return { content, improved: false };
  }
  
  // Common keywords to emphasize based on language
  const keywords = {
    'cs': ['důležité', 'klíčové', 'efektivní', 'strategické', 'výhody', 'nevýhody', 'řešení', 'analýza', 'pohledávky', 'vymáhání', 'právní', 'finance'],
    'sk': ['dôležité', 'kľúčové', 'efektívne', 'strategické', 'výhody', 'nevýhody', 'riešenie', 'analýza', 'pohľadávky', 'vymáhanie', 'právne', 'financie'],
    'de': ['wichtig', 'Schlüssel', 'effektiv', 'strategisch', 'Vorteile', 'Nachteile', 'Lösung', 'Analyse', 'Forderungen', 'Eintreibung', 'rechtlich', 'Finanzen'],
    'en': ['important', 'key', 'effective', 'strategic', 'advantages', 'disadvantages', 'solution', 'analysis', 'receivables', 'collection', 'legal', 'finance']
  };
  
  // If language is not supported, default to English
  const langKeywords = keywords[language] || keywords['en'];
  
  // Identify paragraphs
  const paragraphs = content.split(/\n\n+/);
  let enhancedContent = '';
  let headingAdded = 0;
  
  // Process each paragraph
  paragraphs.forEach((paragraph, index) => {
    // Skip existing headings
    if (paragraph.match(/^#+\s/)) {
      enhancedContent += paragraph + '\n\n';
      return;
    }
    
    // Skip short paragraphs (likely not full paragraphs)
    if (paragraph.trim().length < 40) {
      enhancedContent += paragraph + '\n\n';
      return;
    }
    
    // Add headings strategically (to longer paragraphs that might be introducing sections)
    if (headingAdded < 4 && paragraph.length > 150 && !paragraph.startsWith('#') && index > 0) {
      // Extract the first sentence as a potential heading
      const firstSentence = paragraph.split(/[.!?][\s\n]/)[0];
      
      if (firstSentence && firstSentence.length > 20 && firstSentence.length < 100) {
        // Add heading before paragraph
        enhancedContent += `## ${firstSentence.trim()}\n\n`;
        headingAdded++;
        
        // Remove the first sentence from paragraph if it was used as heading
        paragraph = paragraph.substring(firstSentence.length + 1).trim();
      } else if (index % 3 === 0) {
        // Create a generic heading if appropriate
        const headings = {
          'cs': ['Podrobná analýza', 'Praktické řešení', 'Strategický přístup', 'Klíčové faktory', 'Právní aspekty'],
          'sk': ['Podrobná analýza', 'Praktické riešenie', 'Strategický prístup', 'Kľúčové faktory', 'Právne aspekty'],
          'de': ['Detaillierte Analyse', 'Praktische Lösung', 'Strategischer Ansatz', 'Schlüsselfaktoren', 'Rechtliche Aspekte'],
          'en': ['Detailed Analysis', 'Practical Solution', 'Strategic Approach', 'Key Factors', 'Legal Aspects']
        };
        
        const langHeadings = headings[language] || headings['en'];
        const headingText = langHeadings[headingAdded % langHeadings.length];
        enhancedContent += `## ${headingText}\n\n`;
        headingAdded++;
      }
    }
    
    // Add emphasis to important words and phrases
    let enhancedParagraph = paragraph;
    
    // Emphasize keywords
    langKeywords.forEach(keyword => {
      // Don't add emphasis if already emphasized
      const regex = new RegExp(`(?<!\\*)\\b${keyword}\\b(?!\\*)`, 'gi');
      enhancedParagraph = enhancedParagraph.replace(regex, (match) => {
        // Only add emphasis to a limited number per paragraph, and randomly (70% chance)
        if (Math.random() < 0.7) {
          return `**${match}**`;
        }
        return match;
      });
    });
    
    enhancedContent += enhancedParagraph + '\n\n';
  });
  
  // Add a conclusion heading if there isn't one already
  if (!enhancedContent.match(/závěr|závěrem|souhrn|shrnutí|závery|zhrnutie|zusammenfassung|fazit|conclusion|summary/i)) {
    const conclusionHeadings = {
      'cs': 'Závěr',
      'sk': 'Záver',
      'de': 'Fazit',
      'en': 'Conclusion'
    };
    
    enhancedContent += `## ${conclusionHeadings[language] || 'Conclusion'}\n\n`;
  }
  
  return { content: enhancedContent.trim(), improved: true };
};

// Process all articles
const fixArticleFormatting = () => {
  let improvedCount = 0;
  let totalCount = 0;
  
  languageDirs.forEach(langDir => {
    // Extract language code (e.g., 'cs' from 'posts-cs')
    const language = langDir.replace('posts-', '') || 'en';
    
    const dirPath = path.join(process.cwd(), 'content', langDir);
    const articles = getArticles(dirPath);
    
    console.log(`Processing ${articles.length} articles in ${langDir}...`);
    totalCount += articles.length;
    
    articles.forEach(article => {
      try {
        const fileContent = fs.readFileSync(article.path, 'utf8');
        let { data, content } = matter(fileContent);
        
        // Fix any emphasis in frontmatter fields (which can cause YAML parsing errors)
        if (data.title && data.title.includes('**')) {
          data.title = data.title.replace(/\*\*/g, '');
          console.log(`Fixed emphasis in title for ${article.filename}`);
        }
        
        if (data.description && data.description.includes('**')) {
          data.description = data.description.replace(/\*\*/g, '');
          console.log(`Fixed emphasis in description for ${article.filename}`);
        }
        
        // Improve formatting
        const { content: enhancedContent, improved } = improveFormatting(content, language);
        
        if (improved) {
          // Write updated content back to file with fixed frontmatter
          const updatedContent = matter.stringify(enhancedContent, data);
          fs.writeFileSync(article.path, updatedContent);
          
          console.log(`Improved formatting for ${article.filename}`);
          improvedCount++;
        } else {
          console.log(`Skipping ${article.filename} - already has good formatting`);
          
          // Even if we don't improve the content, still write back the fixed frontmatter
          if (data.title.includes('**') || (data.description && data.description.includes('**'))) {
            const updatedContent = matter.stringify(content, data);
            fs.writeFileSync(article.path, updatedContent);
            console.log(`Updated frontmatter for ${article.filename} (fixed emphasis)`);
          }
        }
      } catch (error) {
        console.error(`Error processing ${article.filename}:`, error.message);
        
        // Try to fix the file by directly handling the file as text
        try {
          const fileContent = fs.readFileSync(article.path, 'utf8');
          
          // Find and replace any ** in the frontmatter section
          const frontmatterEndIndex = fileContent.indexOf('---', 4) + 3;
          const frontmatter = fileContent.substring(0, frontmatterEndIndex);
          const content = fileContent.substring(frontmatterEndIndex);
          
          // Remove any ** from the frontmatter
          const fixedFrontmatter = frontmatter.replace(/\*\*/g, '');
          
          // Combine and write back
          fs.writeFileSync(article.path, fixedFrontmatter + content);
          console.log(`Fixed YAML error in ${article.filename} by manually removing emphasis from frontmatter`);
        } catch (fixError) {
          console.error(`Failed to fix ${article.filename}:`, fixError.message);
        }
      }
    });
  });
  
  console.log(`\nImproved formatting for ${improvedCount} out of ${totalCount} articles.`);
  return { improvedCount, totalCount };
};

// Main execution
try {
  const result = fixArticleFormatting();
  console.log('Done fixing article formatting.');
} catch (error) {
  console.error('Error fixing article formatting:', error);
} 