const enhancedVision = require('./enhancedVision');
const productDatabase = require('./productDatabase');

class HybridDetectionService {
  constructor() {
    this.confidenceThresholds = {
      high: 0.85,
      medium: 0.65,
      low: 0.45
    };
  }

  async detectItemsWithMultipleApproaches(imageBase64) {
    const results = {
      success: true,
      approaches: {},
      finalItems: [],
      confidence: 'unknown',
      processingSteps: []
    };

    try {
      // Step 1: Enhanced Vision API Detection
      results.processingSteps.push('Starting enhanced vision detection...');
      const visionResult = await enhancedVision.detectItemsWithSizeEstimation(imageBase64);
      results.approaches.vision = visionResult;
      
      if (visionResult.error) {
        results.processingSteps.push(`Vision API error: ${visionResult.error}`);
      } else {
        results.processingSteps.push(`Vision API detected ${visionResult.items?.length || 0} items`);
      }

      // Step 2: Product Database Enhancement
      results.processingSteps.push('Enhancing items with product database...');
      let enhancedItems = [];
      
      if (visionResult.items && visionResult.items.length > 0) {
        enhancedItems = visionResult.items.map(item => {
          const enhanced = productDatabase.enhanceDetectedItem(item);
          if (enhanced.enhanced) {
            results.processingSteps.push(
              `Enhanced "${item.name}" -> "${enhanced.productMatch.productId}" (${Math.round(enhanced.productMatch.confidence * 100)}% confidence)`
            );
          }
          return enhanced;
        });
      }

      // Step 3: Confidence Analysis and Filtering
      results.processingSteps.push('Analyzing confidence levels...');
      const highConfidenceItems = enhancedItems.filter(item => 
        item.confidence >= this.confidenceThresholds.high
      );
      const mediumConfidenceItems = enhancedItems.filter(item => 
        item.confidence >= this.confidenceThresholds.medium && 
        item.confidence < this.confidenceThresholds.high
      );
      
      // Step 4: Smart Item Consolidation
      results.processingSteps.push('Consolidating duplicate detections...');
      const consolidatedItems = this.consolidateDuplicateItems(enhancedItems);
      
      // Step 5: Add Common Missing Items Suggestions
      const suggestions = this.suggestCommonMissingItems(consolidatedItems);
      if (suggestions.length > 0) {
        results.processingSteps.push(`Added ${suggestions.length} common item suggestions`);
        results.suggestions = suggestions;
      }

      // Step 6: Final Assembly
      results.finalItems = consolidatedItems;
      results.confidence = this.calculateOverallConfidence(consolidatedItems);
      results.processingSteps.push(`Final result: ${consolidatedItems.length} items with ${results.confidence} confidence`);

      // Maintain compatibility with existing API
      return {
        items: results.finalItems,
        referenceObject: visionResult.referenceObject || { found: false, type: 'none' },
        imageAnalysis: visionResult.imageAnalysis || { totalItems: results.finalItems.length },
        hybridResults: results
      };

    } catch (error) {
      console.error('Hybrid detection error:', error);
      results.processingSteps.push(`Error: ${error.message}`);
      
      return {
        items: [],
        referenceObject: { found: false, type: 'none' },
        imageAnalysis: { totalItems: 0, perspective: 'unknown', lighting: 'unknown' },
        error: error.message,
        hybridResults: results
      };
    }
  }

  consolidateDuplicateItems(items) {
    const consolidated = [];
    const seenItems = new Map();

    for (const item of items) {
      // Create a key for deduplication
      const key = this.generateItemKey(item);
      
      if (seenItems.has(key)) {
        const existing = seenItems.get(key);
        // Keep the item with higher confidence
        if (item.confidence > existing.confidence) {
          seenItems.set(key, item);
        }
      } else {
        seenItems.set(key, item);
      }
    }

    // Add quantity consolidation
    for (const [key, item] of seenItems.entries()) {
      const similarItems = items.filter(i => this.generateItemKey(i) === key);
      if (similarItems.length > 1) {
        item.quantity = similarItems.reduce((sum, i) => sum + (i.quantity || 1), 0);
        item.consolidatedFrom = similarItems.length;
      }
      consolidated.push(item);
    }

    return consolidated;
  }

  generateItemKey(item) {
    // Generate a key for deduplication based on item properties
    const category = item.category || 'unknown';
    const productId = item.productMatch?.productId || item.name.toLowerCase().replace(/\s+/g, '-');
    
    return `${category}:${productId}`;
  }

  calculateOverallConfidence(items) {
    if (items.length === 0) return 'none';
    
    const avgConfidence = items.reduce((sum, item) => sum + (item.confidence || 0.5), 0) / items.length;
    
    if (avgConfidence >= this.confidenceThresholds.high) return 'high';
    if (avgConfidence >= this.confidenceThresholds.medium) return 'medium';
    return 'low';
  }

  suggestCommonMissingItems(detectedItems) {
    const detectedCategories = new Set(detectedItems.map(item => item.category));
    const suggestions = [];

    // Common travel item combinations
    const commonCombinations = {
      'electronics': {
        'phone': ['charger', 'headphones'],
        'laptop': ['charger', 'mouse'],
        'camera': ['charger', 'memory-card']
      },
      'clothing': {
        'any': ['underwear', 'socks']
      },
      'toiletries': {
        'toothbrush': ['toothpaste'],
        'shampoo': ['conditioner']
      }
    };

    // Check for missing common pairs
    for (const item of detectedItems) {
      const category = item.category;
      const productId = item.productMatch?.productId;
      
      if (commonCombinations[category]) {
        const combos = commonCombinations[category][productId] || commonCombinations[category]['any'] || [];
        
        for (const combo of combos) {
          const alreadyDetected = detectedItems.some(detected => 
            detected.productMatch?.productId === combo || 
            detected.name.toLowerCase().includes(combo)
          );
          
          if (!alreadyDetected) {
            const product = productDatabase.products[combo];
            if (product) {
              suggestions.push({
                name: combo.replace('-', ' '),
                category: product.category,
                confidence: 0.6,
                estimatedSize: 'medium',
                quantity: 1,
                suggested: true,
                suggestedBecause: `Common with ${item.name}`,
                properties: product.properties
              });
            }
          }
        }
      }
    }

    return suggestions.slice(0, 3); // Limit suggestions
  }

  // Method to get detection statistics for debugging
  getDetectionStats(hybridResults) {
    const stats = {
      totalSteps: hybridResults.processingSteps.length,
      itemsDetected: hybridResults.finalItems.length,
      confidenceDistribution: {
        high: 0,
        medium: 0,
        low: 0
      },
      enhancementStats: {
        enhanced: 0,
        unenhanced: 0
      }
    };

    for (const item of hybridResults.finalItems) {
      // Confidence distribution
      if (item.confidence >= this.confidenceThresholds.high) {
        stats.confidenceDistribution.high++;
      } else if (item.confidence >= this.confidenceThresholds.medium) {
        stats.confidenceDistribution.medium++;
      } else {
        stats.confidenceDistribution.low++;
      }

      // Enhancement stats
      if (item.enhanced) {
        stats.enhancementStats.enhanced++;
      } else {
        stats.enhancementStats.unenhanced++;
      }
    }

    return stats;
  }

  // Method to validate and fix common detection issues
  validateAndFixItems(items) {
    return items.map(item => {
      const fixed = { ...item };

      // Fix missing or invalid categories
      if (!fixed.category || !['clothing', 'electronics', 'toiletries', 'shoes', 'accessories', 'books', 'documents'].includes(fixed.category)) {
        fixed.category = this.inferCategoryFromName(fixed.name);
      }

      // Fix missing confidence
      if (typeof fixed.confidence !== 'number' || fixed.confidence < 0 || fixed.confidence > 1) {
        fixed.confidence = 0.5;
      }

      // Fix missing quantity
      if (!fixed.quantity || fixed.quantity < 1) {
        fixed.quantity = 1;
      }

      // Fix missing size
      if (!fixed.estimatedSize) {
        fixed.estimatedSize = 'medium';
      }

      // Fix missing properties
      if (!fixed.properties) {
        fixed.properties = {
          material: 'fabric',
          flexibility: 'semi-flexible',
          packability: 'good'
        };
      }

      return fixed;
    });
  }

  inferCategoryFromName(name) {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('shirt') || nameLower.includes('pants') || nameLower.includes('dress')) {
      return 'clothing';
    }
    if (nameLower.includes('phone') || nameLower.includes('laptop') || nameLower.includes('charger')) {
      return 'electronics';
    }
    if (nameLower.includes('shoe') || nameLower.includes('boot') || nameLower.includes('sneaker')) {
      return 'shoes';
    }
    if (nameLower.includes('toothbrush') || nameLower.includes('shampoo') || nameLower.includes('soap')) {
      return 'toiletries';
    }
    if (nameLower.includes('book') || nameLower.includes('magazine')) {
      return 'books';
    }
    if (nameLower.includes('passport') || nameLower.includes('document')) {
      return 'documents';
    }
    
    return 'accessories';
  }
}

module.exports = new HybridDetectionService();