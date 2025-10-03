#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up TravelPocket...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template');
    console.log('⚠️  Please add your Gemini API key to the .env file\n');
  } else {
    fs.writeFileSync(envPath, 'REACT_APP_GEMINI_API_KEY=your-gemini-api-key-here\n');
    console.log('✅ Created .env file');
    console.log('⚠️  Please add your Gemini API key to the .env file\n');
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('Run: npm install\n');
} else {
  console.log('✅ Dependencies already installed\n');
}

console.log('🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Add your Gemini API key to .env file');
console.log('2. Run: npm install');
console.log('3. Run: npm start');
console.log('4. Open http://localhost:3000 in your browser\n');
