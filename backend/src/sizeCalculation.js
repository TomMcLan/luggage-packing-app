class SizeCalculationEngine {
  constructor() {
    // Reference object real-world dimensions in mm
    this.referenceObjects = {
      'credit_card': { width: 85.6, height: 53.98, thickness: 0.76 },
      'coin': { diameter: 24.26, thickness: 1.75 }, // US quarter
      'bottle': { height: 200, diameter: 65, volume: 500 }, // standard water bottle
      'phone': { width: 71, height: 146, thickness: 7.4 }, // iPhone-like
      'pen': { length: 140, diameter: 8, thickness: 8 }
    };
  }

  calculatePixelRatio(referenceObject, imageWidth, imageHeight) {
    if (!referenceObject || !referenceObject.found || !referenceObject.boundingBox) {
      // Fallback: assume standard photo resolution and distance
      return 0.5; // Rough estimate: 0.5mm per pixel
    }

    const refType = referenceObject.type;
    const refSize = this.referenceObjects[refType];
    
    if (!refSize) {
      return 0.5; // Fallback
    }

    // Calculate pixel-to-mm ratio based on reference object
    let pixelRatio;
    if (refType === 'coin') {
      // Use diameter for circular objects
      pixelRatio = refSize.diameter / Math.max(referenceObject.boundingBox.width, referenceObject.boundingBox.height);
    } else {
      // Use width for rectangular objects
      pixelRatio = refSize.width / referenceObject.boundingBox.width;
    }

    // Sanity check: ratio should be reasonable (0.1 to 2.0 mm/pixel)
    return Math.max(0.1, Math.min(2.0, pixelRatio));
  }

  calculateItemDimensions(item, referenceObject, imageWidth = 1024, imageHeight = 1024) {
    const pixelRatio = this.calculatePixelRatio(referenceObject, imageWidth, imageHeight);
    
    // Calculate real-world dimensions
    const width = item.boundingBox.width * pixelRatio;
    const height = item.boundingBox.height * pixelRatio;
    
    // Estimate depth based on item category and properties
    const depth = this.estimateDepth(item.category, item.properties, width, height);
    
    // Calculate volume and weight estimates
    const volume = this.estimateVolume(item.category, width, height, depth);
    const weight = this.estimateWeight(item.category, item.properties, volume);

    return {
      width: Math.round(width * 10) / 10,  // Round to 1 decimal
      height: Math.round(height * 10) / 10,
      depth: Math.round(depth * 10) / 10,
      volume: Math.round(volume), // cm³
      weight: Math.round(weight), // grams
      flexibility: item.properties?.flexibility || 'semi-flexible',
      packability: item.properties?.packability || 'good'
    };
  }

  estimateDepth(category, properties, width, height) {
    const flexibility = properties?.flexibility || 'semi-flexible';
    
    // Base depth estimates by category (in mm)
    const baseDepths = {
      'clothing': {
        'rigid': Math.max(width, height) * 0.1,
        'semi-flexible': Math.max(width, height) * 0.05,
        'very-flexible': Math.max(width, height) * 0.02
      },
      'shoes': {
        'rigid': Math.max(width, height) * 0.4,
        'semi-flexible': Math.max(width, height) * 0.35,
        'very-flexible': Math.max(width, height) * 0.3
      },
      'electronics': {
        'rigid': Math.min(width, height) * 0.2,
        'semi-flexible': Math.min(width, height) * 0.15,
        'very-flexible': Math.min(width, height) * 0.1
      },
      'toiletries': {
        'rigid': Math.min(width, height) * 0.8,
        'semi-flexible': Math.min(width, height) * 0.6,
        'very-flexible': Math.min(width, height) * 0.4
      },
      'books': {
        'rigid': Math.max(width, height) * 0.03,
        'semi-flexible': Math.max(width, height) * 0.025,
        'very-flexible': Math.max(width, height) * 0.02
      },
      'accessories': {
        'rigid': Math.min(width, height) * 0.3,
        'semi-flexible': Math.min(width, height) * 0.2,
        'very-flexible': Math.min(width, height) * 0.1
      },
      'documents': {
        'rigid': Math.max(width, height) * 0.01,
        'semi-flexible': Math.max(width, height) * 0.008,
        'very-flexible': Math.max(width, height) * 0.005
      }
    };

    const categoryDepths = baseDepths[category] || baseDepths['accessories'];
    return categoryDepths[flexibility] || categoryDepths['semi-flexible'];
  }

  estimateVolume(category, width, height, depth) {
    // Convert mm to cm and calculate volume
    const volumeCm3 = (width / 10) * (height / 10) * (depth / 10);
    
    // Apply packing efficiency factors by category
    const efficiencyFactors = {
      'clothing': 0.6,      // Clothes compress well
      'shoes': 0.8,         // Shoes are mostly solid
      'electronics': 0.9,   // Electronics are dense
      'toiletries': 0.85,   // Bottles/containers
      'books': 0.95,        // Books are very dense
      'accessories': 0.7,   // Mixed density
      'documents': 0.3      // Paper can compress significantly
    };

    const efficiency = efficiencyFactors[category] || 0.7;
    return volumeCm3 * efficiency;
  }

  estimateWeight(category, properties, volume) {
    // Density estimates in g/cm³
    const densities = {
      'clothing': 0.3,      // Light fabrics
      'shoes': 0.6,         // Leather, rubber, fabric
      'electronics': 1.5,   // Metals, plastics, batteries
      'toiletries': 1.0,    // Mostly water-based
      'books': 0.7,         // Paper
      'accessories': 0.8,   // Mixed materials
      'documents': 0.6      // Paper, thin materials
    };

    const material = properties?.material || 'fabric';
    const materialMultipliers = {
      'metal': 1.8,
      'leather': 1.2,
      'plastic': 0.9,
      'fabric': 0.8,
      'cotton': 0.7,
      'paper': 0.6
    };

    const baseDensity = densities[category] || 0.8;
    const materialMultiplier = materialMultipliers[material] || 1.0;
    
    return volume * baseDensity * materialMultiplier;
  }

  calculatePackingEfficiency(items, luggageCapacity) {
    const totalVolume = items.reduce((sum, item) => sum + item.volume, 0);
    const efficiency = (totalVolume / luggageCapacity) * 100;
    
    return {
      totalItemVolume: Math.round(totalVolume),
      luggageCapacity: luggageCapacity,
      efficiency: Math.min(100, Math.round(efficiency * 10) / 10),
      remainingSpace: Math.max(0, luggageCapacity - totalVolume)
    };
  }
}

module.exports = new SizeCalculationEngine();