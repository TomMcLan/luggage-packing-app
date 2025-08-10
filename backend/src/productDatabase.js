// Product Database for common travel items
class ProductDatabase {
  constructor() {
    this.products = this.initializeDatabase();
  }

  initializeDatabase() {
    return {
      // Electronics
      'laptop': {
        keywords: ['laptop', 'macbook', 'notebook computer', 'gaming laptop', 'ultrabook'],
        category: 'electronics',
        commonSizes: {
          '13-inch': { width: 304, height: 212, depth: 16 },
          '15-inch': { width: 357, height: 243, depth: 18 },
          '17-inch': { width: 399, height: 276, depth: 20 }
        },
        avgWeight: 1500,
        properties: {
          material: 'metal',
          flexibility: 'rigid',
          packability: 'fair'
        }
      },
      
      'phone': {
        keywords: ['phone', 'iphone', 'smartphone', 'mobile', 'android'],
        category: 'electronics',
        commonSizes: {
          'standard': { width: 71, height: 146, depth: 7.4 }
        },
        avgWeight: 180,
        properties: {
          material: 'metal',
          flexibility: 'rigid',
          packability: 'excellent'
        }
      },

      'charger': {
        keywords: ['charger', 'power adapter', 'usb cable', 'charging cable', 'power bank'],
        category: 'electronics',
        commonSizes: {
          'phone-charger': { width: 50, height: 25, depth: 25 },
          'laptop-charger': { width: 120, height: 60, depth: 30 },
          'power-bank': { width: 140, height: 70, depth: 15 }
        },
        avgWeight: 200,
        properties: {
          material: 'plastic',
          flexibility: 'semi-flexible',
          packability: 'good'
        }
      },

      'headphones': {
        keywords: ['headphones', 'earbuds', 'airpods', 'earphones', 'headset'],
        category: 'electronics',
        commonSizes: {
          'earbuds': { width: 50, height: 20, depth: 30 },
          'over-ear': { width: 180, height: 200, depth: 80 }
        },
        avgWeight: 150,
        properties: {
          material: 'plastic',
          flexibility: 'semi-flexible',
          packability: 'good'
        }
      },

      // Clothing
      't-shirt': {
        keywords: ['t-shirt', 'tee', 'shirt', 'top', 'blouse'],
        category: 'clothing',
        commonSizes: {
          'small': { width: 450, height: 600, depth: 5 },
          'medium': { width: 480, height: 640, depth: 5 },
          'large': { width: 520, height: 680, depth: 5 }
        },
        avgWeight: 150,
        properties: {
          material: 'cotton',
          flexibility: 'very-flexible',
          packability: 'excellent'
        }
      },

      'jeans': {
        keywords: ['jeans', 'pants', 'trousers', 'denim'],
        category: 'clothing',
        commonSizes: {
          'small': { width: 400, height: 1000, depth: 8 },
          'medium': { width: 420, height: 1050, depth: 8 },
          'large': { width: 450, height: 1100, depth: 8 }
        },
        avgWeight: 600,
        properties: {
          material: 'cotton',
          flexibility: 'semi-flexible',
          packability: 'good'
        }
      },

      'underwear': {
        keywords: ['underwear', 'boxers', 'briefs', 'panties', 'bra'],
        category: 'clothing',
        commonSizes: {
          'standard': { width: 300, height: 250, depth: 3 }
        },
        avgWeight: 50,
        properties: {
          material: 'cotton',
          flexibility: 'very-flexible',
          packability: 'excellent'
        }
      },

      'socks': {
        keywords: ['socks', 'stockings', 'hosiery'],
        category: 'clothing',
        commonSizes: {
          'standard': { width: 200, height: 300, depth: 5 }
        },
        avgWeight: 50,
        properties: {
          material: 'cotton',
          flexibility: 'very-flexible',
          packability: 'excellent'
        }
      },

      // Shoes
      'sneakers': {
        keywords: ['sneakers', 'running shoes', 'athletic shoes', 'trainers'],
        category: 'shoes',
        commonSizes: {
          'size-8': { width: 280, height: 110, depth: 320 },
          'size-9': { width: 290, height: 115, depth: 330 },
          'size-10': { width: 300, height: 120, depth: 340 }
        },
        avgWeight: 800,
        properties: {
          material: 'fabric',
          flexibility: 'semi-flexible',
          packability: 'fair'
        }
      },

      'sandals': {
        keywords: ['sandals', 'flip-flops', 'slippers'],
        category: 'shoes',
        commonSizes: {
          'standard': { width: 280, height: 20, depth: 320 }
        },
        avgWeight: 300,
        properties: {
          material: 'rubber',
          flexibility: 'semi-flexible',
          packability: 'good'
        }
      },

      // Toiletries
      'toothbrush': {
        keywords: ['toothbrush', 'dental care'],
        category: 'toiletries',
        commonSizes: {
          'standard': { width: 15, height: 190, depth: 15 }
        },
        avgWeight: 20,
        properties: {
          material: 'plastic',
          flexibility: 'rigid',
          packability: 'excellent'
        }
      },

      'shampoo': {
        keywords: ['shampoo', 'conditioner', 'body wash', 'soap'],
        category: 'toiletries',
        commonSizes: {
          'travel-size': { width: 40, height: 120, depth: 40 },
          'standard': { width: 65, height: 200, depth: 65 }
        },
        avgWeight: 300,
        properties: {
          material: 'plastic',
          flexibility: 'rigid',
          packability: 'good'
        }
      },

      'toothpaste': {
        keywords: ['toothpaste', 'dental hygiene'],
        category: 'toiletries',
        commonSizes: {
          'travel-size': { width: 25, height: 100, depth: 25 },
          'standard': { width: 35, height: 150, depth: 35 }
        },
        avgWeight: 100,
        properties: {
          material: 'plastic',
          flexibility: 'semi-flexible',
          packability: 'good'
        }
      },

      // Accessories
      'wallet': {
        keywords: ['wallet', 'purse', 'money clip'],
        category: 'accessories',
        commonSizes: {
          'standard': { width: 110, height: 90, depth: 20 }
        },
        avgWeight: 150,
        properties: {
          material: 'leather',
          flexibility: 'semi-flexible',
          packability: 'excellent'
        }
      },

      'sunglasses': {
        keywords: ['sunglasses', 'glasses', 'eyewear'],
        category: 'accessories',
        commonSizes: {
          'standard': { width: 140, height: 50, depth: 140 }
        },
        avgWeight: 30,
        properties: {
          material: 'plastic',
          flexibility: 'rigid',
          packability: 'good'
        }
      },

      'belt': {
        keywords: ['belt', 'leather belt'],
        category: 'accessories',
        commonSizes: {
          'standard': { width: 1000, height: 30, depth: 5 }
        },
        avgWeight: 200,
        properties: {
          material: 'leather',
          flexibility: 'very-flexible',
          packability: 'excellent'
        }
      },

      // Books and Documents
      'book': {
        keywords: ['book', 'novel', 'paperback', 'hardcover'],
        category: 'books',
        commonSizes: {
          'paperback': { width: 127, height: 203, depth: 20 },
          'hardcover': { width: 140, height: 216, depth: 30 }
        },
        avgWeight: 300,
        properties: {
          material: 'paper',
          flexibility: 'rigid',
          packability: 'fair'
        }
      },

      'passport': {
        keywords: ['passport', 'id', 'documents'],
        category: 'documents',
        commonSizes: {
          'standard': { width: 88, height: 125, depth: 5 }
        },
        avgWeight: 50,
        properties: {
          material: 'paper',
          flexibility: 'semi-flexible',
          packability: 'excellent'
        }
      }
    };
  }

  // Find product matches based on detected text
  findMatches(detectedName, confidence = 0.7) {
    const name = detectedName.toLowerCase();
    const matches = [];

    for (const [productId, product] of Object.entries(this.products)) {
      // Direct name match
      if (name.includes(productId)) {
        matches.push({
          productId,
          product,
          confidence: 0.95,
          matchType: 'direct'
        });
        continue;
      }

      // Keyword matching
      const keywordMatch = product.keywords.find(keyword => 
        name.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(name)
      );

      if (keywordMatch) {
        // Calculate confidence based on keyword match quality
        const matchConfidence = this.calculateMatchConfidence(name, keywordMatch);
        if (matchConfidence >= confidence) {
          matches.push({
            productId,
            product,
            confidence: matchConfidence,
            matchType: 'keyword',
            matchedKeyword: keywordMatch
          });
        }
      }
    }

    // Sort by confidence descending
    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  calculateMatchConfidence(detectedName, keyword) {
    const name = detectedName.toLowerCase();
    const key = keyword.toLowerCase();

    if (name === key) return 0.95;
    if (name.includes(key) || key.includes(name)) return 0.85;
    
    // Fuzzy matching for partial matches
    const similarity = this.calculateStringSimilarity(name, key);
    return Math.max(0.6, similarity);
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

  // Enhance detected item with product database info
  enhanceDetectedItem(detectedItem) {
    const matches = this.findMatches(detectedItem.name);
    
    if (matches.length === 0) {
      return {
        ...detectedItem,
        enhanced: false,
        productMatch: null
      };
    }

    const bestMatch = matches[0];
    const product = bestMatch.product;
    
    // Estimate size based on detected size category
    let estimatedDimensions;
    const sizeKeys = Object.keys(product.commonSizes);
    
    if (detectedItem.estimatedSize === 'small' && sizeKeys.includes('small')) {
      estimatedDimensions = product.commonSizes.small;
    } else if (detectedItem.estimatedSize === 'large' && sizeKeys.includes('large')) {
      estimatedDimensions = product.commonSizes.large;
    } else {
      // Use first available size or standard
      const defaultSize = sizeKeys.includes('standard') ? 'standard' : sizeKeys[0];
      estimatedDimensions = product.commonSizes[defaultSize];
    }

    return {
      ...detectedItem,
      enhanced: true,
      productMatch: {
        productId: bestMatch.productId,
        confidence: bestMatch.confidence,
        matchType: bestMatch.matchType
      },
      // Override with database values
      category: product.category,
      estimatedDimensions,
      properties: {
        ...detectedItem.properties,
        ...product.properties
      },
      estimatedWeight: product.avgWeight
    };
  }

  // Get all products in a category
  getProductsByCategory(category) {
    return Object.entries(this.products)
      .filter(([_, product]) => product.category === category)
      .map(([id, product]) => ({ id, ...product }));
  }

  // Get product suggestions for autocomplete
  getProductSuggestions(query, limit = 10) {
    const suggestions = [];
    const queryLower = query.toLowerCase();

    for (const [productId, product] of Object.entries(this.products)) {
      // Check product ID
      if (productId.includes(queryLower)) {
        suggestions.push({
          id: productId,
          name: productId.replace('-', ' '),
          category: product.category,
          confidence: 0.9
        });
      }

      // Check keywords
      product.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(queryLower)) {
          suggestions.push({
            id: productId,
            name: keyword,
            category: product.category,
            confidence: 0.8
          });
        }
      });
    }

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }
}

module.exports = new ProductDatabase();