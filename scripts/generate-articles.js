const generateBlogPost = require('./generate-blog-post');

async function generateArticles() {
  const languages = ['cs', 'sk', 'de', 'en'];
  const results = {
    success: 0,
    failed: 0,
    articles: []
  };

  for (const lang of languages) {
    try {
      console.log(`\nGenerating article for ${lang.toUpperCase()} language...`);
      console.log('----------------------------------------');
      
      const result = await generateBlogPost(lang);
      
      if (result.success) {
        results.success++;
        results.articles.push({
          language: lang,
          title: result.title,
          file: result.fileName
        });
      } else {
        results.failed++;
        console.error(`Failed to generate article for ${lang}:`, result.error);
      }
    } catch (error) {
      results.failed++;
      console.error(`Error generating article for ${lang}:`, error);
    }
  }

  console.log('\nGeneration Summary:');
  console.log('----------------------------------------');
  console.log(`Successful: ${results.success}`);
  console.log(`Failed: ${results.failed}`);
  console.log('\nGenerated Articles:');
  results.articles.forEach(article => {
    console.log(`- [${article.language.toUpperCase()}] ${article.title} (${article.file})`);
  });
}

// Run the generator
generateArticles().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 