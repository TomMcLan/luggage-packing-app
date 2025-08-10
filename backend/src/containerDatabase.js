// Container Database for Luggage and Storage Options
class ContainerDatabase {
  constructor() {
    this.containers = this.initializeContainers();
  }

  initializeContainers() {
    return {
      // Main luggage types
      underseat: {
        id: 'underseat',
        name: 'Under-Seat Personal Item',
        category: 'luggage',
        type: 'wheeled',
        externalDimensions: {
          width: 400,   // mm
          height: 330,  // mm  
          depth: 160,   // mm
          volume: 21.1  // liters
        },
        internalDimensions: {
          width: 380,   // mm (accounting for shell thickness)
          height: 310,  // mm
          depth: 140,   // mm
          volume: 16.5  // liters usable space
        },
        weight: {
          empty: 2.8,   // kg
          maxCapacity: 10 // kg total allowed
        },
        features: [
          'wheels',
          'telescoping handle',
          'main compartment',
          'front organization pocket',
          'interior compression straps'
        ],
        restrictions: {
          airline: 'Must fit under airplane seat',
          dimensions: '16 x 13 x 6 inches max',
          placement: 'Under seat in front of you'
        },
        visualDescription: '16-inch black wheeled personal item underseat luggage case',
        referenceImages: [
          // Add image URLs when available
        ],
        packingStrategy: 'maximize-essentials',
        compartments: {
          main: { volume: 14, accessLevel: 'medium' },
          front: { volume: 2, accessLevel: 'easy' },
          interior: { volume: 0.5, accessLevel: 'hard' }
        }
      },

      carryon: {
        id: 'carryon',
        name: 'Carry-On Luggage',
        category: 'luggage',
        type: 'wheeled',
        externalDimensions: {
          width: 560,   // mm (22 inches)
          height: 360,  // mm (14 inches)
          depth: 230,   // mm (9 inches)
          volume: 46.4  // liters
        },
        internalDimensions: {
          width: 530,   // mm
          height: 340,  // mm
          depth: 210,   // mm
          volume: 38.0  // liters usable space
        },
        weight: {
          empty: 3.5,   // kg
          maxCapacity: 23 // kg total (varies by airline)
        },
        features: [
          'four spinner wheels',
          'telescoping handle',
          'main compartment with divider',
          'exterior pockets',
          'compression zippers',
          'TSA-approved lock'
        ],
        restrictions: {
          airline: 'Must fit in overhead bin',
          dimensions: '22 x 14 x 9 inches standard',
          placement: 'Overhead compartment'
        },
        visualDescription: '20-inch black wheeled carry-on luggage suitcase',
        referenceImages: [],
        packingStrategy: 'layered-organization',
        compartments: {
          main: { volume: 32, accessLevel: 'medium' },
          divider: { volume: 4, accessLevel: 'easy' },
          exterior: { volume: 2, accessLevel: 'easy' }
        }
      },

      medium: {
        id: 'medium',
        name: 'Medium Check-In Luggage',
        category: 'luggage',
        type: 'wheeled',
        externalDimensions: {
          width: 610,   // mm (24 inches)
          height: 400,  // mm
          depth: 250,   // mm
          volume: 61.0  // liters
        },
        internalDimensions: {
          width: 580,   // mm
          height: 380,  // mm
          depth: 230,   // mm
          volume: 50.5  // liters usable space
        },
        weight: {
          empty: 4.2,   // kg
          maxCapacity: 23 // kg for most airlines
        },
        features: [
          'four double spinner wheels',
          'multi-stage telescoping handle',
          'main compartment with full divider',
          'multiple exterior pockets',
          'compression system',
          'expandable design (+15%)',
          'interior organization pockets'
        ],
        restrictions: {
          airline: 'Checked baggage',
          dimensions: '24 inches linear',
          weight: '50 lbs (23kg) standard'
        },
        visualDescription: '24-inch black wheeled medium check-in luggage suitcase',
        referenceImages: [],
        packingStrategy: 'compartmentalized',
        compartments: {
          main: { volume: 35, accessLevel: 'medium' },
          divider: { volume: 12, accessLevel: 'easy' },
          exterior: { volume: 3, accessLevel: 'easy' },
          expansion: { volume: 7.5, accessLevel: 'hard' }
        }
      },

      large: {
        id: 'large', 
        name: 'Large Check-In Luggage',
        category: 'luggage',
        type: 'wheeled',
        externalDimensions: {
          width: 710,   // mm (28 inches)
          height: 450,  // mm  
          depth: 280,   // mm
          volume: 89.6  // liters
        },
        internalDimensions: {
          width: 680,   // mm
          height: 430,  // mm
          depth: 260,   // mm
          volume: 76.0  // liters usable space
        },
        weight: {
          empty: 5.1,   // kg
          maxCapacity: 23 // kg (weight limit, not size)
        },
        features: [
          'eight-wheel spinner system',
          'premium telescoping handle',
          'dual compartment design',
          'multiple exterior pockets',
          'compression straps both sides',
          'expandable (+20%)',
          'interior shoe bags',
          'laundry compartment'
        ],
        restrictions: {
          airline: 'Checked baggage only',
          dimensions: '28 inches linear',
          weight: '50 lbs (23kg) standard',
          oversizeNote: 'May incur oversize fees'
        },
        visualDescription: '28-inch black wheeled large check-in luggage suitcase',
        referenceImages: [],
        packingStrategy: 'zone-based',
        compartments: {
          main: { volume: 45, accessLevel: 'medium' },
          secondary: { volume: 20, accessLevel: 'medium' },
          exterior: { volume: 4, accessLevel: 'easy' },
          expansion: { volume: 15, accessLevel: 'hard' },
          shoes: { volume: 3, accessLevel: 'easy' },
          laundry: { volume: 5, accessLevel: 'medium' }
        }
      },

      // Add space for additional container types
      // You can easily add: backpacks, duffel bags, packing cubes, etc.
    };
  }

  // Get container by ID
  getContainer(containerId) {
    return this.containers[containerId] || null;
  }

  // Get all containers
  getAllContainers() {
    return Object.values(this.containers);
  }

  // Get containers by category
  getContainersByCategory(category) {
    return Object.values(this.containers).filter(container => 
      container.category === category
    );
  }

  // Get containers by volume range
  getContainersByVolume(minVolume, maxVolume) {
    return Object.values(this.containers).filter(container => {
      const volume = container.internalDimensions.volume;
      return volume >= minVolume && volume <= maxVolume;
    });
  }

  // Calculate if items fit in container
  calculateFitAnalysis(containerId, items) {
    const container = this.getContainer(containerId);
    if (!container) return null;

    const totalItemVolume = items.reduce((sum, item) => {
      return sum + (item.volume || 0);
    }, 0);

    const efficiency = (totalItemVolume / container.internalDimensions.volume) * 100;
    
    return {
      container: container,
      totalItemVolume: totalItemVolume,
      containerVolume: container.internalDimensions.volume,
      efficiency: Math.min(100, efficiency),
      fits: totalItemVolume <= container.internalDimensions.volume,
      remainingSpace: Math.max(0, container.internalDimensions.volume - totalItemVolume),
      recommendations: this.generateFitRecommendations(efficiency, container)
    };
  }

  generateFitRecommendations(efficiency, container) {
    const recommendations = [];
    
    if (efficiency > 95) {
      recommendations.push('Consider a larger container or reduce items');
      recommendations.push('Pack carefully to avoid overstuffing');
    } else if (efficiency > 85) {
      recommendations.push('Good fit - use compression techniques');
      recommendations.push('Consider packing cubes for organization');
    } else if (efficiency > 60) {
      recommendations.push('Comfortable fit with room for souvenirs');
      recommendations.push('Use the extra space for organization');
    } else {
      recommendations.push('You have plenty of extra space');
      recommendations.push('Consider a smaller container for efficiency');
    }

    return recommendations;
  }

  // Get container dimensions for DALL-E prompts
  getContainerVisualDescription(containerId) {
    const container = this.getContainer(containerId);
    if (!container) return '';

    return container.visualDescription || `${container.name} container`;
  }

  // Get container internal layout for packing visualization
  getContainerLayout(containerId) {
    const container = this.getContainer(containerId);
    if (!container) return null;

    return {
      id: containerId,
      name: container.name,
      dimensions: container.internalDimensions,
      compartments: container.compartments,
      features: container.features,
      packingStrategy: container.packingStrategy
    };
  }

  // Add new container (for easy expansion)
  addContainer(containerData) {
    const id = containerData.id || containerData.name.toLowerCase().replace(/\s+/g, '-');
    
    const container = {
      id: id,
      name: containerData.name,
      category: containerData.category || 'luggage',
      type: containerData.type || 'standard',
      externalDimensions: containerData.externalDimensions,
      internalDimensions: containerData.internalDimensions,
      weight: containerData.weight || { empty: 0, maxCapacity: 23 },
      features: containerData.features || [],
      restrictions: containerData.restrictions || {},
      visualDescription: containerData.visualDescription || containerData.name,
      referenceImages: containerData.referenceImages || [],
      packingStrategy: containerData.packingStrategy || 'standard',
      compartments: containerData.compartments || { main: { volume: containerData.internalDimensions?.volume || 20, accessLevel: 'medium' } },
      dateAdded: new Date().toISOString()
    };

    this.containers[id] = container;
    return id;
  }

  // Update container images
  updateContainerImages(containerId, imageUrls) {
    if (this.containers[containerId]) {
      this.containers[containerId].referenceImages = imageUrls;
      return true;
    }
    return false;
  }

  // Get container recommendations based on items
  recommendContainer(items, travelType = 'leisure') {
    const totalVolume = items.reduce((sum, item) => sum + (item.volume || 0), 0);
    const recommendations = [];

    Object.values(this.containers).forEach(container => {
      const efficiency = (totalVolume / container.internalDimensions.volume) * 100;
      
      if (efficiency >= 60 && efficiency <= 85) {
        recommendations.push({
          container: container,
          efficiency: efficiency,
          fit: 'optimal',
          reason: 'Good space utilization with room for organization'
        });
      } else if (efficiency > 45 && efficiency < 95) {
        recommendations.push({
          container: container,
          efficiency: efficiency,
          fit: efficiency > 85 ? 'tight' : 'loose',
          reason: efficiency > 85 ? 'Tight fit - pack carefully' : 'Extra space available'
        });
      }
    });

    return recommendations.sort((a, b) => Math.abs(75 - a.efficiency) - Math.abs(75 - b.efficiency));
  }
}

module.exports = new ContainerDatabase();