const OpenAI = require('openai');

class EnhancedVisionService {
  constructor() {
    this.openai = null;
  }

  getOpenAI() {
    if (!this.openai) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is required');
      }
      this.openai = new OpenAI({ 
        apiKey: process.env.OPENAI_API_KEY 
      });
    }
    return this.openai;
  }

  async detectItemsWithSizeEstimation(imageBase64) {
    try {
      const openai = this.getOpenAI();
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user", 
            content: [
              {
                type: "text",
                text: `Analyze this travel packing photo with advanced size estimation. Focus on:

1. ITEM DETECTION: Identify all packable items
2. SIZE CALIBRATION: Use reference objects for accurate measurements
3. SPATIAL RELATIONSHIPS: Estimate relative sizes and positions
4. BOUNDING BOXES: Provide pixel coordinates for each item

IMPORTANT: Always return valid JSON, even if no items are detected. If the image is unclear or contains no items, return empty arrays.

Return ONLY valid JSON in this exact format:
{
  "items": [
    {
      "name": "specific item name",
      "category": "clothing|electronics|toiletries|shoes|accessories|books|documents",
      "confidence": 0.95,
      "estimatedSize": "small|medium|large",
      "quantity": 1,
      "boundingBox": {
        "x": 100,
        "y": 150,
        "width": 200,
        "height": 150
      },
      "properties": {
        "material": "cotton|leather|plastic|metal|fabric",
        "flexibility": "rigid|semi-flexible|very-flexible",
        "packability": "excellent|good|fair|difficult"
      }
    }
  ],
  "referenceObject": {
    "found": true,
    "type": "credit_card|coin|bottle|phone|none",
    "boundingBox": {
      "x": 50,
      "y": 75,
      "width": 85,
      "height": 54
    },
    "realWorldSize": {
      "width": 85.6,
      "height": 53.98,
      "unit": "mm"
    }
  },
  "imageAnalysis": {
    "totalItems": 5,
    "perspective": "top_down|angled|side_view",
    "lighting": "good|fair|poor",
    "backgroundClutter": "minimal|moderate|high"
  }
}

REFERENCE OBJECT SIZES (for calibration):
- Credit Card: 85.6mm × 53.98mm
- US Quarter Coin: 24.26mm diameter
- Water Bottle: ~200mm height, 65mm diameter
- iPhone: ~146mm × 71mm
- Standard Pen: ~140mm length

Focus on accurate spatial relationships and provide precise bounding boxes for all detected objects.`
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.1
      });

      const content = response.choices[0].message.content;
      
      // Clean up the response to ensure it's valid JSON
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\n/, '').replace(/\n```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```\n/, '').replace(/\n```$/, '');
      }

      let result;
      try {
        result = JSON.parse(cleanContent);
        console.log('Enhanced Vision API Response:', JSON.stringify(result, null, 2));
      } catch (parseError) {
        console.error('Failed to parse JSON response. Raw content:', cleanContent);
        // If JSON parsing fails, return empty result
        result = {
          items: [],
          referenceObject: { found: false, type: 'none' },
          imageAnalysis: { totalItems: 0, perspective: 'unknown', lighting: 'poor' }
        };
      }
      
      // Validate and enhance the response
      if (!result.items) {
        console.error('No items array in response');
        result.items = [];
      }
      
      result.items = result.items.map(item => ({
        ...item,
        confidence: item.confidence || 0.8,
        estimatedSize: item.estimatedSize || 'medium',
        quantity: item.quantity || 1,
        boundingBox: item.boundingBox || { x: 0, y: 0, width: 100, height: 100 },
        properties: {
          material: item.properties?.material || 'fabric',
          flexibility: item.properties?.flexibility || 'semi-flexible',
          packability: item.properties?.packability || 'good',
          ...item.properties
        }
      }));
      
      console.log('Enhanced items after processing:', result.items.length);

      // Set defaults for reference object
      if (!result.referenceObject) {
        result.referenceObject = {
          found: false,
          type: 'none',
          boundingBox: null,
          realWorldSize: null
        };
      }

      return result;
      
    } catch (error) {
      console.error('Enhanced Vision API Error:', error);
      
      // Return safe fallback response
      return { 
        items: [], 
        referenceObject: { found: false, type: 'none' },
        imageAnalysis: { totalItems: 0, perspective: 'unknown', lighting: 'unknown' },
        error: error.message || "Failed to analyze image with size estimation" 
      };
    }
  }

  async generatePackingImage(prompt) {
    try {
      const openai = this.getOpenAI();
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",
        style: "natural"
      });
      
      return response.data[0].url;
      
    } catch (error) {
      console.error('DALL-E Image Generation Error:', error);
      throw new Error(`Failed to generate packing image: ${error.message}`);
    }
  }
}

module.exports = new EnhancedVisionService();