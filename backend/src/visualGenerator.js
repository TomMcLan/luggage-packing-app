const enhancedVision = require('./enhancedVision');
const sizeCalculation = require('./sizeCalculation');
const packingSimulation = require('./packingSimulation');

class VisualGenerator {
  constructor() {
    this.luggageDescriptions = {
      'underseat': '16-inch black wheeled personal item underseat luggage case',
      'carryon': '20-inch black wheeled carry-on luggage suitcase',
      'medium': '24-inch black wheeled medium check-in luggage suitcase',
      'large': '28-inch black wheeled large check-in luggage suitcase'
    };
  }

  async generatePackingVisuals(detectedItems, luggageSize, referenceObject, imageUrl) {
    try {
      // Step 1: Calculate real-world dimensions for all items
      const itemsWithDimensions = detectedItems.map(item => ({
        ...item,
        ...sizeCalculation.calculateItemDimensions(item, referenceObject)
      }));

      // Step 2: Generate 5 different packing layouts
      const packingLayouts = packingSimulation.generatePackingLayouts(itemsWithDimensions, luggageSize);

      // Step 3: Generate AI images for each layout
      const visualResults = await Promise.all(
        packingLayouts.map(async (layout, index) => {
          try {
            const prompt = this.generateDALLEPrompt(layout, luggageSize, itemsWithDimensions);
            const imageUrl = await enhancedVision.generatePackingImage(prompt);
            
            return {
              id: layout.id,
              method: layout.method,
              description: layout.description,
              strategy: layout.strategy,
              imageUrl: imageUrl,
              spaceEfficiency: layout.spaceEfficiency,
              labels: this.generateLabels(layout),
              instructions: layout.instructions,
              benefits: layout.benefits,
              itemCount: layout.positions.length,
              reasoning: this.generateLayoutReasoning(layout)
            };
          } catch (error) {
            console.error(`Failed to generate image for layout ${index + 1}:`, error);
            
            // Return layout with placeholder image
            return {
              id: layout.id,
              method: layout.method,
              description: layout.description,
              strategy: layout.strategy,
              imageUrl: null,
              spaceEfficiency: layout.spaceEfficiency,
              labels: this.generateLabels(layout),
              instructions: layout.instructions,
              benefits: layout.benefits,
              itemCount: layout.positions.length,
              reasoning: this.generateLayoutReasoning(layout),
              error: 'Image generation failed, but layout is still valid'
            };
          }
        })
      );

      // Step 4: Calculate overall packing statistics
      const luggageCapacity = this.getLuggageCapacity(luggageSize);
      const packingStats = sizeCalculation.calculatePackingEfficiency(itemsWithDimensions, luggageCapacity);

      return {
        success: true,
        packing_visuals: visualResults,
        packing_statistics: {
          ...packingStats,
          total_items: itemsWithDimensions.length,
          luggage_type: luggageSize,
          reference_object_used: referenceObject?.type || 'none'
        },
        original_image: imageUrl
      };

    } catch (error) {
      console.error('Error generating packing visuals:', error);
      throw new Error(`Failed to generate packing visuals: ${error.message}`);
    }
  }

  generateDALLEPrompt(layout, luggageSize, items) {
    const luggageDescription = this.luggageDescriptions[luggageSize];
    const maxItems = Math.min(8, layout.positions.length); // Limit to prevent prompt overflow
    
    // Create detailed item descriptions
    const itemDescriptions = layout.positions.slice(0, maxItems).map((pos, index) => {
      const item = pos.item;
      const position = pos.position;
      
      return `${index + 1}. ${item.name} (${Math.round(item.dimensions.width)}x${Math.round(item.dimensions.height)}mm ${item.category}) ${this.getItemVisualDescription(item)}`;
    }).join('\n');

    const strategyDescription = this.getStrategyVisualDescription(layout.strategy);

    const prompt = `
Professional product photography of an open ${luggageDescription}, shot from directly above (top-down view).

The luggage is fully opened and laid flat, showing the main compartment clearly. Inside the luggage, the following items are arranged using ${layout.method.toLowerCase()}:

${itemDescriptions}

${strategyDescription}

Items should be arranged realistically with proper proportions relative to each other and the luggage size. Each item should be clearly visible and identifiable. The packing should look organized and intentional, not random.

Style: Clean, professional product photography with even lighting. No shadows obscuring items. Neutral background. High quality, sharp focus. The luggage fabric should be black or dark gray. No text, labels, or numbers in the image.

Perspective: Directly overhead view, like looking down into an open suitcase on a bed.
`.trim();

    return prompt;
  }

  getItemVisualDescription(item) {
    const descriptions = {
      'clothing': {
        'rolled': 'tightly rolled into a compact cylinder',
        'folded': 'neatly folded',
        'compressed': 'compressed flat'
      },
      'shoes': 'pair of shoes placed sole-to-sole',
      'electronics': 'in protective black case or original packaging',
      'toiletries': 'bottles and containers in clear toiletry bag',
      'accessories': 'small items grouped together',
      'books': 'stacked neatly',
      'documents': 'in clear folder or envelope'
    };

    if (item.category === 'clothing') {
      const state = item.isRolled ? 'rolled' : item.isCompressed ? 'compressed' : 'folded';
      return descriptions.clothing[state];
    }

    return descriptions[item.category] || 'placed neatly';
  }

  getStrategyVisualDescription(strategy) {
    const descriptions = {
      'bottom-heavy': 'Heavy items like shoes and electronics are placed at the bottom. Lighter, flexible clothing items are layered on top. The arrangement shows clear weight distribution with rigid items providing a stable base.',
      
      'rolling': 'Clothing items are tightly rolled and arranged in rows like logs. The rolls are placed efficiently to maximize space, with gaps filled by smaller accessories and toiletries.',
      
      'compartmentalized': 'Items are organized by category into distinct sections. Electronics in one area, clothing in another, toiletries grouped together. Each category has its dedicated space.',
      
      'accessibility': 'Frequently used items like chargers and toiletries are placed on top and easily accessible. Less frequently used items are placed deeper in the luggage.',
      
      'compression': 'Items are packed as tightly as possible with maximum compression. Clothing is compressed flat, shoes are stuffed with smaller items, and every available space is utilized.'
    };

    return descriptions[strategy] || 'Items are arranged efficiently and organized.';
  }

  generateLabels(layout) {
    return layout.positions.map((pos, index) => {
      const item = pos.item;
      const position = pos.position;
      
      return {
        number: index + 1,
        itemName: item.name,
        category: item.category,
        dimensions: `${Math.round(item.dimensions.width)}×${Math.round(item.dimensions.height)}×${Math.round(item.dimensions.depth)}mm`,
        weight: `~${Math.round((item.dimensions.width * item.dimensions.height * item.dimensions.depth) / 10000)}g`,
        position: {
          x: Math.round((position.x / 600) * 100), // Convert to percentage for overlay
          y: Math.round((position.y / 400) * 100)
        },
        reasoning: pos.reasoning || `${item.category} placed optimally`,
        properties: {
          flexibility: item.properties?.flexibility || 'semi-flexible',
          packability: item.properties?.packability || 'good',
          isRolled: item.isRolled || false,
          isCompressed: item.isCompressed || false
        }
      };
    });
  }

  generateLayoutReasoning(layout) {
    const reasoningMap = {
      'bottom-heavy': [
        'Heavy items create a stable base for the luggage',
        'Protects fragile electronics from damage',
        'Improves wheel-ability when traveling',
        'Prevents lighter items from being crushed'
      ],
      'rolling': [
        'Rolling reduces wrinkles in clothing significantly',
        'Maximizes space efficiency by up to 30%',
        'Makes items easier to see and access',
        'Creates compact, organized bundles'
      ],
      'compartmentalized': [
        'Prevents items from mixing and getting lost',
        'Makes security screening easier at airports',
        'Allows quick access to specific item categories',
        'Keeps similar items together for organization'
      ],
      'accessibility': [
        'Reduces need to unpack during travel',
        'Keeps essentials within easy reach',
        'Minimizes disruption to other packed items',
        'Optimizes for travel convenience'
      ],
      'compression': [
        'Maximizes luggage capacity utilization',
        'Fits more items in same space',
        'Reduces luggage weight distribution issues',
        'Ideal for longer trips with more items'
      ]
    };

    return reasoningMap[layout.strategy] || ['Optimally arranged for your specific items'];
  }

  getLuggageCapacity(luggageSize) {
    // Return capacity in liters
    const capacities = {
      'underseat': 22,
      'carryon': 45,
      'medium': 65,
      'large': 85
    };
    
    return capacities[luggageSize] || 45;
  }
}

module.exports = new VisualGenerator();