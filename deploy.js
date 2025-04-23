// Simple script to help with manual deployment to GitHub Pages
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment to production
process.env.NODE_ENV = 'production';

console.log('🚀 Starting deployment to GitHub Pages...');

try {
  // Step 1: Build the project
  console.log('📦 Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Ensure .nojekyll file exists
  console.log('📄 Creating .nojekyll file...');
  const outDir = path.join(__dirname, 'out');
  const nojekyllPath = path.join(outDir, '.nojekyll');
  
  if (!fs.existsSync(nojekyllPath)) {
    fs.writeFileSync(nojekyllPath, '');
  }
  
  // Step 3: Check if index.html exists
  if (!fs.existsSync(path.join(outDir, 'index.html'))) {
    console.error('❌ index.html not found in the out directory!');
    process.exit(1);
  }
  
  console.log('✅ Build successful!');
  console.log('');
  console.log('To deploy to GitHub Pages:');
  console.log('1. Create a gh-pages branch if you haven\'t already');
  console.log('2. Copy the contents of the "out" directory to the gh-pages branch');
  console.log('3. Push the gh-pages branch to GitHub');
  console.log('');
  console.log('Or use a tool like "gh-pages" npm package:');
  console.log('npm install -g gh-pages');
  console.log('gh-pages -d out');
  
} catch (error) {
  console.error('❌ Deployment failed:', error);
  process.exit(1);
}
