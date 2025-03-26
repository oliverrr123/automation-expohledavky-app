const fs = require('fs');
const path = require('path');

const workflowsDir = path.join(process.cwd(), '.github', 'workflows');

// Files to keep - the newer ones with better structure
const filesToKeep = [
  'generate-czech-content.yml',
  'generate-english-content.yml',
  'generate-german-content.yml',
  'generate-slovak-content.yml'
];

// Files to remove - the duplicates
const filesToRemove = [
  'czech-content-generation.yml',
  'german-content-generation.yml',
  'slovak-content-generation.yml'
];

// Function to remove duplicate workflow files
function removeDuplicateWorkflows() {
  console.log('Checking for duplicate workflow files...');
  
  if (!fs.existsSync(workflowsDir)) {
    console.error(`Workflows directory not found: ${workflowsDir}`);
    return;
  }
  
  let removedCount = 0;
  
  for (const file of filesToRemove) {
    const filePath = path.join(workflowsDir, file);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Removed duplicate workflow file: ${file}`);
        removedCount++;
      } catch (error) {
        console.error(`Error removing ${file}: ${error.message}`);
      }
    } else {
      console.log(`File not found (already removed): ${file}`);
    }
  }
  
  console.log(`Removed ${removedCount} duplicate workflow files.`);
  console.log('Remaining workflow files:');
  
  // List remaining files
  const remainingFiles = fs.readdirSync(workflowsDir);
  remainingFiles.forEach(file => {
    console.log(`- ${file}`);
  });
}

// Execute the function
removeDuplicateWorkflows(); 