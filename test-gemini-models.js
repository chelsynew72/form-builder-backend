// test-gemini-models.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCbRzkEEg0fp41C5FcvWDZTg6BdKyHMi6I'; // Replace with your actual API key

async function testModels() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-pro',
    'gemini-1.0-pro',
    'gemini-1.0-pro-latest',
  ];
  
  console.log('Testing available Gemini models...\n');
  
  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} - WORKS`);
      console.log(`   Response: ${text.substring(0, 50)}...\n`);
    } catch (error) {
      console.log(`❌ ${modelName} - FAILED`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
}

testModels();