const sizeCalculation = require('./sizeCalculation');

class PackingSimulationEngine {
  constructor() {
    // Luggage internal dimensions in mm (accounting for structure)
    this.luggageDimensions = {
      'underseat': { width: 380, height: 310, depth: 140, volume: 16.5 }, // liters
      'carryon': { width: 530, height: 340, depth: 210, volume: 38.0 },
      'medium': { width: 580, height: 380, depth: 230, volume: 50.5 },
      'large': { width: 680, height: 430, depth: 260, volume: 76.0 }
    };
  }

  generatePackingLayouts(itemsWithDimensions, luggageSize) {
    const luggage = this.luggageDimensions[luggageSize];
    
    if (!luggage) {
      throw new Error(`Invalid luggage size: ${luggageSize}`);
    }

    return [
      this.bottomHeavyLayout(itemsWithDimensions, luggage, luggageSize),
      this.rollingOptimizedLayout(itemsWithDimensions, luggage, luggageSize),
      this.compartmentalizedLayout(itemsWithDimensions, luggage, luggageSize),
      this.accessibilityLayout(itemsWithDimensions, luggage, luggageSize),
      this.compressionLayout(itemsWithDimensions, luggage, luggageSize)
    ];
  }

  bottomHeavyLayout(items, luggage, luggageSize) {
    // Sort by weight (heaviest first) and rigidity
    const sortedItems = [...items].sort((a, b) => {
      if (b.weight !== a.weight) return b.weight - a.weight;
      
      // Secondary sort by rigidity (rigid items first)
      const rigidityOrder = { 'rigid': 3, 'semi-flexible': 2, 'very-flexible': 1 };
      return (rigidityOrder[b.flexibility] || 2) - (rigidityOrder[a.flexibility] || 2);
    });

    const positions = this.calculatePositions(sortedItems, luggage, 'bottom-up');
    
    return {
      id: 1,
      method: 'Bottom-Heavy Strategy',
      description: 'Heavy and rigid items placed at the bottom for stability and protection',
      strategy: 'bottom-heavy',
      positions: positions,
      spaceEfficiency: this.calculateSpaceEfficiency(positions, luggage),
      instructions: [
        'Place heaviest items (shoes, books) at the bottom of the luggage',
        'Add rigid electronics and toiletries in the middle layer', 
        'Fill remaining space with flexible clothing items',
        'Use clothing to cushion and protect rigid items',
        'Keep weight distribution balanced left-to-right'
      ],
      benefits: ['Stable base', 'Protected electronics', 'Easy wheeling'],
      luggageSize: luggageSize
    };
  }

  rollingOptimizedLayout(items, luggage, luggageSize) {
    // Prioritize clothing items for rolling, others fill gaps
    const clothingItems = items.filter(item => item.category === 'clothing');
    const otherItems = items.filter(item => item.category !== 'clothing');
    
    // Modify clothing items to account for rolling compression
    const rolledClothing = clothingItems.map(item => ({
      ...item,
      width: item.width * 0.3,  // Rolling reduces width significantly
      height: item.height * 0.8, // Slight height reduction
      depth: item.depth * 2.5,   // But increases depth/thickness
      isRolled: true
    }));

    const allItems = [...rolledClothing, ...otherItems];
    const sortedItems = this.sortByPackingOrder(allItems, 'rolling');
    const positions = this.calculatePositions(sortedItems, luggage, 'rolling');

    return {
      id: 2,
      method: 'Rolling Optimization',
      description: 'Clothes rolled tightly to maximize space and minimize wrinkles',
      strategy: 'rolling',
      positions: positions,
      spaceEfficiency: this.calculateSpaceEfficiency(positions, luggage),
      instructions: [
        'Roll all clothing items as tightly as possible',
        'Place rolled clothes in rows along the length of luggage',
        'Fill gaps between rolls with small accessories',
        'Place shoes and toiletries in designated compartments',
        'Use remaining flat space for documents and electronics'
      ],
      benefits: ['Maximum space efficiency', 'Wrinkle reduction', 'Easy visibility'],
      luggageSize: luggageSize
    };
  }

  compartmentalizedLayout(items, luggage, luggageSize) {
    // Group items by category for organized packing
    const categories = this.groupByCategory(items);
    const sortedItems = this.sortByCompartment(categories, luggage);
    const positions = this.calculatePositions(sortedItems, luggage, 'compartmentalized');

    return {
      id: 3,
      method: 'Compartmentalized Organization',
      description: 'Items grouped by category in dedicated sections',
      strategy: 'compartmentalized',
      positions: positions,
      spaceEfficiency: this.calculateSpaceEfficiency(positions, luggage),
      instructions: [
        'Dedicate left side for clothing items',
        'Reserve right side for electronics and accessories',
        'Place toiletries in a separate waterproof section',
        'Keep shoes in protective bags at the bottom',
        'Store documents in easily accessible flat compartment'
      ],
      benefits: ['Easy organization', 'Quick access', 'Category separation'],
      luggageSize: luggageSize
    };
  }

  accessibilityLayout(items, luggage, luggageSize) {
    // Sort by frequency of use and accessibility needs
    const sortedItems = [...items].sort((a, b) => {
      const accessibilityScore = this.getAccessibilityScore(a) - this.getAccessibilityScore(b);
      if (accessibilityScore !== 0) return accessibilityScore;
      return a.weight - b.weight; // Lighter items on top
    });

    const positions = this.calculatePositions(sortedItems, luggage, 'accessibility');

    return {
      id: 4,
      method: 'Accessibility-Focused',
      description: 'Frequently used items placed for easy access during travel',
      strategy: 'accessibility',
      positions: positions,
      spaceEfficiency: this.calculateSpaceEfficiency(positions, luggage),
      instructions: [
        'Place frequently needed items (phone charger, toiletries) on top',
        'Keep change of clothes easily accessible',
        'Store travel documents in outer compartments',
        'Pack heavy/rarely used items at the bottom',
        'Ensure zippers and openings are not blocked'
      ],
      benefits: ['Easy access', 'Travel convenience', 'Reduced unpacking'],
      luggageSize: luggageSize
    };
  }

  compressionLayout(items, luggage, luggageSize) {
    // Maximize compression for ultimate space efficiency
    const compressedItems = items.map(item => this.applyCompression(item));
    const sortedItems = [...compressedItems].sort((a, b) => {
      // Sort by compressibility (most compressible first)
      return this.getCompressibilityScore(b) - this.getCompressibilityScore(a);
    });

    const positions = this.calculatePositions(sortedItems, luggage, 'compression');

    return {
      id: 5,
      method: 'Maximum Compression',
      description: 'Ultimate space efficiency through strategic compression techniques',
      strategy: 'compression',
      positions: positions,
      spaceEfficiency: this.calculateSpaceEfficiency(positions, luggage),
      instructions: [
        'Use packing cubes with compression zippers',
        'Vacuum-seal bulky clothing items if possible',
        'Fill every gap with small, flexible items',
        'Compress shoes by stuffing with socks and accessories',
        'Layer thin items between larger ones'
      ],
      benefits: ['Maximum capacity', 'Tight organization', 'Space optimization'],
      luggageSize: luggageSize
    };
  }

  calculatePositions(items, luggage, strategy) {
    const positions = [];
    const occupiedSpaces = [];
    
    let currentX = 10; // Start with small margin
    let currentY = 10;
    let currentLayer = 0;
    const layerHeight = Math.min(100, luggage.depth / 3); // Dynamic layer height

    for (const item of items) {
      const position = this.findOptimalPosition(
        item, 
        luggage, 
        occupiedSpaces, 
        strategy,
        { x: currentX, y: currentY, layer: currentLayer }
      );

      if (position) {
        positions.push({
          item: {
            name: item.name,
            category: item.category,
            dimensions: {
              width: item.width,
              height: item.height,
              depth: item.depth
            },
            properties: item.properties || {},
            isRolled: item.isRolled || false,
            isCompressed: item.isCompressed || false
          },
          position: {
            x: position.x,
            y: position.y,
            z: position.z,
            rotation: position.rotation || 0
          },
          reasoning: position.reasoning
        });

        // Mark space as occupied
        occupiedSpaces.push({
          x: position.x,
          y: position.y,
          z: position.z,
          width: item.width,
          height: item.height,
          depth: item.depth
        });

        // Update current position for next item
        currentX = position.x + item.width + 5; // 5mm gap
        if (currentX > luggage.width - 50) {
          currentX = 10;
          currentY = position.y + item.height + 5;
          if (currentY > luggage.height - 50) {
            currentY = 10;
            currentLayer++;
          }
        }
      }
    }

    return positions;
  }

  findOptimalPosition(item, luggage, occupiedSpaces, strategy, suggestion) {
    // Try multiple positions and orientations
    const attempts = [
      { x: suggestion.x, y: suggestion.y, z: suggestion.layer * 80, rotation: 0 },
      { x: suggestion.x, y: suggestion.y, z: suggestion.layer * 80, rotation: 90 },
      { x: 10, y: suggestion.y + 50, z: suggestion.layer * 80, rotation: 0 },
      { x: suggestion.x + 50, y: 10, z: suggestion.layer * 80, rotation: 0 }
    ];

    for (const attempt of attempts) {
      if (this.isPositionValid(item, attempt, luggage, occupiedSpaces)) {
        return {
          ...attempt,
          reasoning: this.getPositionReasoning(item, attempt, strategy)
        };
      }
    }

    // If no valid position found, place in next available layer
    return {
      x: 10,
      y: 10,
      z: (suggestion.layer + 1) * 80,
      rotation: 0,
      reasoning: `Placed in layer ${suggestion.layer + 1} due to space constraints`
    };
  }

  isPositionValid(item, position, luggage, occupiedSpaces) {
    // Check if item fits within luggage boundaries
    if (position.x + item.width > luggage.width ||
        position.y + item.height > luggage.height ||
        position.z + item.depth > luggage.depth) {
      return false;
    }

    // Check for collisions with existing items
    return !occupiedSpaces.some(occupied => 
      this.doBoxesOverlap(
        { x: position.x, y: position.y, z: position.z, 
          width: item.width, height: item.height, depth: item.depth },
        occupied
      )
    );
  }

  doBoxesOverlap(box1, box2) {
    return !(box1.x + box1.width <= box2.x || 
             box2.x + box2.width <= box1.x ||
             box1.y + box1.height <= box2.y || 
             box2.y + box2.height <= box1.y ||
             box1.z + box1.depth <= box2.z || 
             box2.z + box2.depth <= box1.z);
  }

  calculateSpaceEfficiency(positions, luggage) {
    const totalItemVolume = positions.reduce((sum, pos) => {
      const item = pos.item;
      return sum + (item.dimensions.width * item.dimensions.height * item.dimensions.depth) / 1000; // Convert to liters
    }, 0);

    const luggageVolume = (luggage.width * luggage.height * luggage.depth) / 1000000; // Convert to liters
    return Math.min(100, Math.round((totalItemVolume / luggageVolume) * 100 * 10) / 10);
  }

  // Helper methods
  groupByCategory(items) {
    return items.reduce((groups, item) => {
      const category = item.category;
      groups[category] = groups[category] || [];
      groups[category].push(item);
      return groups;
    }, {});
  }

  getAccessibilityScore(item) {
    const accessibilityRanks = {
      'electronics': 1, // Most frequently accessed
      'toiletries': 2,
      'accessories': 3,
      'clothing': 4,
      'shoes': 5,
      'books': 6,
      'documents': 7   // Least frequently accessed during travel
    };
    return accessibilityRanks[item.category] || 4;
  }

  applyCompression(item) {
    const compressionFactors = {
      'very-flexible': 0.4,  // 60% compression
      'semi-flexible': 0.7,  // 30% compression
      'rigid': 1.0           // No compression
    };

    const factor = compressionFactors[item.flexibility] || 0.7;
    
    return {
      ...item,
      depth: item.depth * factor,
      isCompressed: factor < 1.0
    };
  }

  getCompressibilityScore(item) {
    const scores = {
      'very-flexible': 3,
      'semi-flexible': 2,
      'rigid': 1
    };
    return scores[item.flexibility] || 2;
  }

  sortByPackingOrder(items, strategy) {
    switch (strategy) {
      case 'rolling':
        return items.sort((a, b) => {
          if (a.isRolled && !b.isRolled) return -1;
          if (!a.isRolled && b.isRolled) return 1;
          return b.width - a.width; // Wider items first
        });
      default:
        return items;
    }
  }

  sortByCompartment(categories, luggage) {
    const order = ['shoes', 'electronics', 'toiletries', 'clothing', 'accessories', 'books', 'documents'];
    const sortedItems = [];
    
    order.forEach(category => {
      if (categories[category]) {
        sortedItems.push(...categories[category]);
      }
    });
    
    return sortedItems;
  }

  getPositionReasoning(item, position, strategy) {
    const reasons = {
      'bottom-heavy': `Heavy ${item.category} placed at z=${position.z} for stability`,
      'rolling': `${item.isRolled ? 'Rolled' : 'Standard'} ${item.category} optimized for space`,
      'compartmentalized': `${item.category} grouped in dedicated compartment`,
      'accessibility': `${item.category} positioned for ${this.getAccessibilityScore(item) <= 2 ? 'easy' : 'standard'} access`,
      'compression': `${item.category} ${item.isCompressed ? 'compressed' : 'optimally placed'} for maximum efficiency`
    };

    return reasons[strategy] || `${item.category} positioned optimally`;
  }
}

module.exports = new PackingSimulationEngine();