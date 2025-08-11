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
    console.log('Generating packing image with Google Imagen 4...');
    
    try {
      const genAI = this.getGoogleAI();
      
      // Use Imagen 4 model for image generation
      const model = genAI.getGenerativeModel({ 
        model: "imagen-3.0-generate-001" // Current available model
      });

      // Enhanced prompt for better packing visuals
      const enhancedPrompt = `High-quality professional product photography: ${prompt}

TECHNICAL SPECIFICATIONS:
- Resolution: 1024x1024 pixels
- Style: Clean product photography
- Lighting: Professional studio lighting, even illumination
- Background: Neutral, clean background
- Focus: Sharp focus on all items
- Composition: Overhead view, well-balanced layout

QUALITY REQUIREMENTS:
- Photorealistic rendering
- Accurate colors and textures
- Clear visibility of all items
- Professional presentation quality
- No text, labels, or branding visible`;

      const result = await model.generateContent([{
        text: enhancedPrompt
      }]);
      
      const response = await result.response;
      
      if (response.candidates && response.candidates[0]) {
        const candidate = response.candidates[0];
        
        // Check if the response contains image data
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.mimeType === 'image/png') {
              // Convert base64 to data URL
              const base64Data = part.inlineData.data;
              const imageUrl = `data:${part.inlineData.mimeType};base64,${base64Data}`;
              console.log('Successfully generated image with Google Imagen');
              return imageUrl;
            }
          }
        }
        
        throw new Error('No image data found in Google Imagen response');
      } else {
        throw new Error('No candidates in Google Imagen response');
      }
      
    } catch (error) {
      console.error('Google Imagen generation error:', error);
      throw new Error(`Failed to generate packing image with Google Imagen: ${error.message}`);
    }
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