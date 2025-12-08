// list-available-models.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCbRzkEEg0fp41C5FcvWDZTg6BdKyHMi6I'; // Replace with your actual API key

async function listModels() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  try {
    console.log('Fetching available models...\n');
    
    // The SDK doesn't have a direct listModels method, so we'll try the API directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Available models:\n');
    data.models.forEach(model => {
      console.log(`📦 ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('');
    });
    
    // Filter for generateContent support
    console.log('\n🎯 Models that support generateContent:\n');
    const contentGenModels = data.models.filter(m => 
      m.supportedGenerationMethods.includes('generateContent')
    );
    
    contentGenModels.forEach(model => {
      const shortName = model.name.replace('models/', '');
      console.log(`✅ ${shortName}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nThis could mean:');
    console.error('1. Your API key is invalid');
    console.error('2. Your API key has restrictions');
    console.error('3. Your API key needs to be enabled for Gemini API');
    console.error('\nPlease check: https://aistudio.google.com/app/apikey');
  }
}

listModels();