const OpenAI = require('openai');

class VisionService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
  }

  async detectItemsInImage(imageBase64) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user", 
            content: [
              {
                type: "text",
                text: `Analyze this travel packing photo and identify all items someone would pack in luggage. Look for reference objects (credit card, coin, water bottle, phone) to help estimate scale.

Return ONLY valid JSON in this exact format:
{
  "items": [
    {
      "name": "specific item name",
      "category": "clothing|electronics|toiletries|shoes|accessories|books|documents", 
      "confidence": 0.95,
      "estimatedSize": "small|medium|large",
      "quantity": 1
    }
  ],
  "referenceFound": true,
  "referenceType": "credit card|coin|bottle|phone|none"
}

Categories explained:
- clothing: shirts, pants, dresses, underwear, socks, jackets
- electronics: laptop, phone, chargers, headphones, camera, cables
- toiletries: toothbrush, shampoo, cosmetics, medications, skincare
- shoes: any footwear including sneakers, boots, sandals
- accessories: belts, jewelry, sunglasses, bags, wallets, watches
- books: books, notebooks, magazines
- documents: passport, tickets, papers, documents

Focus on items that would typically be packed for travel. Ignore background items like furniture or walls.`
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        max_tokens: 1500,
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

      const result = JSON.parse(cleanContent);
      
      // Validate the response structure
      if (!result.items || !Array.isArray(result.items)) {
        throw new Error('Invalid response structure: items array missing');
      }

      // Validate each item
      result.items.forEach((item, index) => {
        if (!item.name || !item.category) {
          throw new Error(`Invalid item at index ${index}: missing name or category`);
        }
        
        // Set defaults for missing fields
        item.confidence = item.confidence || 0.8;
        item.estimatedSize = item.estimatedSize || 'medium';
        item.quantity = item.quantity || 1;
      });

      // Set defaults for reference detection
      result.referenceFound = result.referenceFound || false;
      result.referenceType = result.referenceType || 'none';

      return result;
      
    } catch (error) {
      console.error('Vision API Error:', error);
      
      // Return a safe fallback response
      return { 
        items: [], 
        referenceFound: false, 
        referenceType: "none",
        error: error.message || "Failed to analyze image" 
      };
    }
  }
}

module.exports = new VisionService();