const db = require('./database');
const { v4: uuidv4 } = require('uuid');

class RecommendationEngine {
  constructor() {
    this.cachedMethods = null;
  }

  async getPackingMethods() {
    if (!this.cachedMethods) {
      this.cachedMethods = await db.getPackingMethods();
    }
    return this.cachedMethods;
  }

  async recommendPackingMethods(confirmedItems, luggageSize) {
    try {
      const packingMethods = await this.getPackingMethods();
      
      // Count items by category
      const itemCategories = confirmedItems.map(item => item.category);
      const categoryCount = itemCategories.reduce((acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      // Score each packing method
      const scoredMethods = packingMethods.map(method => {
        let score = 0;
        
        // Category compatibility (70% weight)
        method.best_for_categories.forEach(category => {
          if (categoryCount[category]) {
            score += categoryCount[category] * 0.7;
          }
        });
        
        // Efficiency rating (20% weight)  
        score += method.efficiency_rating * 0.2;
        
        // Difficulty preference (10% weight - favor easier methods)
        const difficultyScore = method.difficulty === 'Easy' ? 1 : 
                               method.difficulty === 'Medium' ? 0.7 : 0.4;
        score += difficultyScore * 0.1;
        
        return { ...method, score };
      });

      // Return top 4 methods with applicable items
      return scoredMethods
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(method => ({
          ...method,
          applicable_items: confirmedItems
            .filter(item => method.best_for_categories.includes(item.category))
            .map(item => item.name),
          estimated_space_used: this.calculateSpaceUsage(confirmedItems, method, luggageSize)
        }));
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  calculateSpaceUsage(items, method, luggageSize) {
    try {
      // Get luggage volume in liters
      const luggageVolumeMap = {
        'underseat': 22,
        'carryon': 45,
        'medium': 65,
        'large': 85
      };
      
      const luggageVolume = luggageVolumeMap[luggageSize] || 45;
      
      // Estimate space per item based on category and size
      const itemSpaceMap = {
        'clothing': { small: 1, medium: 2, large: 4 },
        'electronics': { small: 0.5, medium: 1.5, large: 3 },
        'toiletries': { small: 0.3, medium: 0.8, large: 1.5 },
        'shoes': { small: 3, medium: 4, large: 5 },
        'accessories': { small: 0.2, medium: 0.5, large: 1 },
        'books': { small: 0.5, medium: 1, large: 2 },
        'documents': { small: 0.1, medium: 0.2, large: 0.5 }
      };
      
      let totalItemVolume = 0;
      
      items.forEach(item => {
        const categorySpace = itemSpaceMap[item.category] || itemSpaceMap['clothing'];
        const sizeSpace = categorySpace[item.estimatedSize] || categorySpace['medium'];
        totalItemVolume += sizeSpace * (item.quantity || 1);
      });
      
      // Apply method efficiency
      const methodEfficiency = method.space_savings / 100;
      const optimizedVolume = totalItemVolume * (1 - methodEfficiency);
      
      // Calculate percentage of luggage used
      const percentageUsed = (optimizedVolume / luggageVolume) * 100;
      
      // Cap at 95% and ensure minimum of 20%
      return Math.min(95, Math.max(20, Math.round(percentageUsed))) + '%';
    } catch (error) {
      console.error('Error calculating space usage:', error);
      return '50%'; // Fallback percentage
    }
  }

  generateSessionId() {
    return uuidv4();
  }
}

module.exports = new RecommendationEngine();