#!/usr/bin/env node

const generateCzechContent = require('./generate-czech-content');
const generateSlovakContent = require('./generate-slovak-content');
const generateGermanContent = require('./generate-german-content');
const generateEnglishContent = require('./generate-english-content');

/**
 * Main function to generate content for all languages
 */
async function generateAllContent() {
  console.log('======================================================');
  console.log('🌍 Starting content generation for all languages');
  console.log('======================================================');
  
  const results = {
    czech: null,
    slovak: null,
    german: null,
    english: null
  };
  
  try {
    // Generate Czech content
    console.log('\n🇨🇿 Starting Czech content generation...');
    results.czech = await generateCzechContent();
    console.log(`🇨🇿 Czech content: ${results.czech.success ? 'Success' : 'Failed'}`);
    
    // Generate Slovak content
    console.log('\n🇸🇰 Starting Slovak content generation...');
    results.slovak = await generateSlovakContent();
    console.log(`🇸🇰 Slovak content: ${results.slovak.success ? 'Success' : 'Failed'}`);
    
    // Generate German content
    console.log('\n🇩🇪 Starting German content generation...');
    results.german = await generateGermanContent();
    console.log(`🇩🇪 German content: ${results.german.success ? 'Success' : 'Failed'}`);
    
    // Generate English content
    console.log('\n🇬🇧 Starting English content generation...');
    results.english = await generateEnglishContent();
    console.log(`🇬🇧 English content: ${results.english.success ? 'Success' : 'Failed'}`);
    
    // Summary of results
    console.log('\n======================================================');
    console.log('📋 Content Generation Summary');
    console.log('======================================================');
    
    const allSuccessful = Object.values(results).every(r => r && r.success);
    
    if (allSuccessful) {
      console.log('✅ All content generated successfully!');
      
      // Output details of generated articles
      console.log('\n📝 Generated Articles:');
      if (results.czech.success) console.log(`🇨🇿 Czech: "${results.czech.title}" (${results.czech.slug})`);
      if (results.slovak.success) console.log(`🇸🇰 Slovak: "${results.slovak.title}" (${results.slovak.slug})`);
      if (results.german.success) console.log(`🇩🇪 German: "${results.german.title}" (${results.german.slug})`);
      if (results.english.success) console.log(`🇬🇧 English: "${results.english.title}" (${results.english.slug})`);
    } else {
      console.log('⚠️ Some content generation tasks failed:');
      if (results.czech && !results.czech.success) console.log(`🇨🇿 Czech: Failed - ${results.czech.error}`);
      if (results.slovak && !results.slovak.success) console.log(`🇸🇰 Slovak: Failed - ${results.slovak.error}`);
      if (results.german && !results.german.success) console.log(`🇩🇪 German: Failed - ${results.german.error}`);
      if (results.english && !results.english.success) console.log(`🇬🇧 English: Failed - ${results.english.error}`);
    }
    
    return allSuccessful;
  } catch (error) {
    console.error('❌ Fatal error in content generation process:', error);
    return false;
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  generateAllContent()
    .then(success => {
      console.log('\n======================================================');
      if (success) {
        console.log('✅ All content generation completed successfully.');
        process.exit(0);
      } else {
        console.log('⚠️ Content generation process completed with errors.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Fatal error in main process:', error);
      process.exit(1);
    });
}

module.exports = generateAllContent; 