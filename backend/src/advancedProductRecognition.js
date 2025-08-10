const OpenAI = require('openai');

class AdvancedProductRecognition {
  constructor() {
    this.openai = null;
    // Specialized product databases
    this.brandPatterns = {
      toys: {
        'jellycat': {
          keywords: ['jellycat', 'jelly cat', 'soft toy', 'plush'],
          commonProducts: [
            'Jellycat Bashful Bunny',
            'Jellycat Amuseables',
            'Jellycat Treasury Box',
            'Jellycat Vivacious Vegetable',
            'Jellycat Odyssey Octopus'
          ]
        },
        'steiff': {
          keywords: ['steiff', 'teddy bear', 'button in ear'],
          commonProducts: [
            'Steiff Classic Teddy Bear',
            'Steiff Soft Cuddly Friends',
            'Steiff Vintage Collection'
          ]
        }
      },
      electronics: {
        'apple': {
          keywords: ['apple', 'iphone', 'macbook', 'ipad', 'airpods'],
          commonProducts: [
            'iPhone 15 Pro',
            'MacBook Air M2',
            'AirPods Pro 2nd Gen',
            'iPad Pro 12.9"'
          ]
        },
        'sony': {
          keywords: ['sony', 'playstation', 'camera', 'headphones'],
          commonProducts: [
            'Sony WH-1000XM5',
            'Sony A7 IV Camera',
            'PlayStation 5 Controller'
          ]
        }
      },
      fashion: {
        'nike': {
          keywords: ['nike', 'swoosh', 'air max', 'jordan'],
          commonProducts: [
            'Nike Air Max 90',
            'Nike Air Force 1',
            'Nike Dunk Low'
          ]
        }
      }
    };
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

  async detectSpecificProducts(imageBase64, focusArea = null) {
    try {
      const openai = this.getOpenAI();
      
      // Enhanced prompt for specific product detection
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user", 
            content: [
              {
                type: "text",
                text: `You are an expert product identification specialist. Analyze this image and identify specific products with maximum detail.

For each item, provide:
1. EXACT product name/model if recognizable
2. Brand name if visible or identifiable
3. Specific product line/collection
4. Visual characteristics (color, pattern, text, logos)
5. Any visible text, labels, or markings
6. Product category and subcategory

IMPORTANT: Be as specific as possible. Instead of "toy", identify "Jellycat Bashful Bunny Pink Medium" or "Steiff Classic Teddy Bear with Button".

Look for:
- Brand logos, labels, tags
- Distinctive design elements
- Text on packaging or products
- Model numbers or product codes
- Characteristic shapes, patterns, colors
- Material textures (e.g., Jellycat's distinctive soft fur)

Return detailed JSON with this structure:
{
  "items": [
    {
      "specificName": "Exact product name if identifiable",
      "genericName": "General item description",
      "brand": "Brand name if visible/identifiable",
      "productLine": "Product collection/series",
      "category": "clothing|electronics|toys|accessories|etc",
      "subcategory": "specific type",
      "confidence": 0.95,
      "visualFeatures": ["distinctive characteristic 1", "feature 2"],
      "visibleText": ["any text/labels seen"],
      "colors": ["primary color", "accent colors"],
      "estimatedSize": "dimensions if identifiable",
      "boundingBox": {"x": 100, "y": 150, "width": 200, "height": 150}
    }
  ],
  "textDetected": ["any readable text in image"],
  "brandLogos": ["logos or brand marks visible"],
  "packagingVisible": true/false
}`
              },
              {
                type: "image_url",
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        max_tokens: 3000,
        temperature: 0.1
      });

      const content = response.choices[0].message.content;
      let cleanContent = content.trim();
      
      // Clean JSON response
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\n/, '').replace(/\n```$/, '');
      } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```\n/, '').replace(/\n```$/, '');
      }

      let result;
      try {
        result = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Failed to parse specific detection JSON:', cleanContent);
        return {
          items: [],
          textDetected: [],
          brandLogos: [],
          error: 'Failed to parse detection results'
        };
      }

      // Enhance with brand pattern matching
      result.items = result.items.map(item => this.enhanceWithBrandRecognition(item));

      return result;

    } catch (error) {
      console.error('Advanced product recognition error:', error);
      return {
        items: [],
        textDetected: [],
        brandLogos: [],
        error: error.message
      };
    }
  }

  enhanceWithBrandRecognition(item) {
    let enhanced = { ...item };

    // Try to match against known brand patterns
    for (const [category, brands] of Object.entries(this.brandPatterns)) {
      for (const [brandName, brandData] of Object.entries(brands)) {
        
        // Check if any keywords match
        const itemText = `${item.specificName} ${item.genericName} ${item.brand}`.toLowerCase();
        const keywordMatch = brandData.keywords.some(keyword => 
          itemText.includes(keyword.toLowerCase())
        );

        if (keywordMatch) {
          enhanced.recognizedBrand = brandName;
          enhanced.brandCategory = category;
          
          // Try to find specific product match
          const specificMatch = brandData.commonProducts.find(product =>
            this.calculateStringSimilarity(itemText, product.toLowerCase()) > 0.6
          );

          if (specificMatch) {
            enhanced.specificMatch = specificMatch;
            enhanced.confidence = Math.min(0.95, enhanced.confidence + 0.1);
          }
          break;
        }
      }
    }

    return enhanced;
  }

  calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // OCR + Brand recognition for text in images
  async detectTextAndBrands(imageBase64) {
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
                text: `Extract all visible text from this image with high precision. Look for:
- Product names and model numbers
- Brand names and logos
- Labels, tags, stickers
- Packaging text
- Serial numbers
- Any readable text on products

Return JSON format:
{
  "allText": ["every piece of readable text"],
  "brands": ["brand names identified"],
  "productNames": ["specific product names"],
  "modelNumbers": ["model/serial numbers"],
  "textLocations": [{"text": "example", "confidence": 0.9, "location": "top-left"}]
}`
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
      let cleanContent = content.trim();
      
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\n/, '').replace(/\n```$/, '');
      }

      try {
        return JSON.parse(cleanContent);
      } catch (parseError) {
        return {
          allText: [],
          brands: [],
          productNames: [],
          modelNumbers: [],
          textLocations: []
        };
      }

    } catch (error) {
      console.error('Text detection error:', error);
      return {
        allText: [],
        brands: [],
        productNames: [],
        modelNumbers: [],
        textLocations: [],
        error: error.message
      };
    }
  }

  // Combine specific detection with text recognition
  async comprehensiveProductAnalysis(imageBase64) {
    try {
      console.log('Starting comprehensive product analysis...');
      
      // Run both analyses in parallel
      const [specificDetection, textDetection] = await Promise.all([
        this.detectSpecificProducts(imageBase64),
        this.detectTextAndBrands(imageBase64)
      ]);

      console.log('Specific detection found:', specificDetection.items?.length || 0, 'items');
      console.log('Text detection found:', textDetection.allText?.length || 0, 'text elements');

      // Merge and enhance results
      const enhancedItems = specificDetection.items?.map(item => {
        let enhanced = { ...item };

        // Enhance with detected text
        if (textDetection.allText && textDetection.allText.length > 0) {
          enhanced.detectedText = textDetection.allText;
          
          // Try to find product name in detected text
          const relevantText = textDetection.productNames?.find(name =>
            this.calculateStringSimilarity(name.toLowerCase(), item.specificName?.toLowerCase() || '') > 0.5
          );
          
          if (relevantText) {
            enhanced.textBasedName = relevantText;
            enhanced.confidence = Math.min(0.98, enhanced.confidence + 0.15);
          }
        }

        return enhanced;
      }) || [];

      return {
        success: true,
        items: enhancedItems,
        textAnalysis: textDetection,
        specificAnalysis: specificDetection,
        analysisSteps: [
          `Detected ${enhancedItems.length} specific products`,
          `Extracted ${textDetection.allText?.length || 0} text elements`,
          `Identified ${textDetection.brands?.length || 0} brand names`,
          `Found ${textDetection.productNames?.length || 0} product names`
        ]
      };

    } catch (error) {
      console.error('Comprehensive analysis error:', error);
      return {
        success: false,
        items: [],
        error: error.message,
        analysisSteps: [`Error: ${error.message}`]
      };
    }
  }
}

module.exports = new AdvancedProductRecognition();