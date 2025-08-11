const { GoogleGenerativeAI } = require('@google/generative-ai');

class GoogleImagenService {
  constructor() {
    this.genAI = null;
  }

  getGoogleAI() {
    if (!this.genAI) {
      if (!process.env.GOOGLE_AI_API_KEY) {
        throw new Error('GOOGLE_AI_API_KEY environment variable is required');
      }
      this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    }
    return this.genAI;
  }

  async generatePackingImage(prompt) {
    console.log('Note: Google Gemini API does not support image generation...');
    console.log('This will immediately fall back to DALL-E 3');
    
    // Google's Gemini API does not currently support image generation
    // The @google/generative-ai SDK is for text/vision, not image generation
    // Google's actual image generation API (Imagen) is not available through this SDK
    
    throw new Error('Google Gemini API does not support image generation - falling back to DALL-E 3');
  }

  async generateWithFallback(prompt) {
    try {
      // First try Google Imagen
      return await this.generatePackingImage(prompt);
    } catch (error) {
      console.error('Google Imagen failed, falling back to OpenAI:', error.message);
      
      // Fallback to OpenAI DALL-E 3
      const OpenAI = require('openai');
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('Both Google AI and OpenAI API keys are required for fallback');
      }
      
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });
      
      console.log('Fallback successful with DALL-E 3');
      return response.data[0].url;
    }
  }
}

module.exports = new GoogleImagenService();