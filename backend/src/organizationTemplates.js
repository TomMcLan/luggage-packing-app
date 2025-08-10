// Organization Templates for Container-Specific Packing
class OrganizationTemplates {
  constructor() {
    this.templates = this.initializeTemplates();
  }

  initializeTemplates() {
    return {
      // Under-seat personal item templates
      underseat: [
        {
          id: 'underseat-essentials',
          name: 'Travel Essentials Layout',
          description: 'Maximize access to important items during flight',
          containerType: 'underseat',
          difficulty: 'easy',
          zones: [
            {
              name: 'Front Pocket Zone',
              position: { x: 0, y: 0, width: 100, height: 25 },
              priority: 'high',
              accessibility: 'immediate',
              recommendedItems: ['documents', 'phone', 'charger', 'earphones'],
              packingMethod: 'flat-organization',
              description: 'Keep flight essentials easily accessible'
            },
            {
              name: 'Main Top Layer',
              position: { x: 0, y: 25, width: 100, height: 40 },
              priority: 'high', 
              accessibility: 'easy',
              recommendedItems: ['tablet', 'snacks', 'medications', 'small toiletries'],
              packingMethod: 'layered-flat',
              description: 'Items you may need during flight'
            },
            {
              name: 'Main Bottom Layer',
              position: { x: 0, y: 65, width: 100, height: 35 },
              priority: 'medium',
              accessibility: 'medium',
              recommendedItems: ['extra clothes', 'shoes', 'books'],
              packingMethod: 'rolled-compressed',
              description: 'Backup items and heavier objects'
            }
          ],
          packingOrder: [
            'Place heaviest items at bottom (shoes, books)',
            'Roll clothes tightly and place in bottom layer',
            'Add medium-weight items in middle',
            'Keep essentials in top layer and front pocket'
          ],
          proTips: [
            'Use packing cubes to separate clean/dirty clothes',
            'Keep one outfit easily accessible for delays',
            'Store liquids in outer pockets for easy TSA access'
          ]
        }
      ],

      // Carry-on luggage templates
      carryon: [
        {
          id: 'carryon-four-quadrant',
          name: 'Four Quadrant System',
          description: 'Divide space into four organized sections',
          containerType: 'carryon',
          difficulty: 'easy',
          zones: [
            {
              name: 'Bottom Left - Heavy Items',
              position: { x: 0, y: 50, width: 50, height: 50 },
              priority: 'high',
              accessibility: 'medium',
              recommendedItems: ['shoes', 'books', 'electronics'],
              packingMethod: 'bottom-heavy',
              description: 'Heaviest items for stability'
            },
            {
              name: 'Bottom Right - Toiletries & Liquids',
              position: { x: 50, y: 50, width: 50, height: 50 },
              priority: 'high',
              accessibility: 'easy',
              recommendedItems: ['toiletries', 'liquids', 'medications'],
              packingMethod: 'contained-upright',
              description: 'Easy access for security checks'
            },
            {
              name: 'Top Left - Clothing',
              position: { x: 0, y: 0, width: 50, height: 50 },
              priority: 'medium',
              accessibility: 'medium',
              recommendedItems: ['shirts', 'pants', 'underwear', 'socks'],
              packingMethod: 'rolled-tight',
              description: 'Flexible clothing items'
            },
            {
              name: 'Top Right - Accessories & Delicates',
              position: { x: 50, y: 0, width: 50, height: 50 },
              priority: 'medium',
              accessibility: 'easy',
              recommendedItems: ['ties', 'jewelry', 'chargers', 'documents'],
              packingMethod: 'protected-flat',
              description: 'Small valuable or fragile items'
            }
          ],
          packingOrder: [
            'Start with bottom-left quadrant: place shoes and heavy items',
            'Fill bottom-right with toiletries in leak-proof bags',
            'Pack clothing in top-left using rolling method',
            'Organize accessories and delicates in top-right'
          ],
          proTips: [
            'Use mesh bags to separate quadrants',
            'Pack one complete outfit in each clothing section',
            'Keep dirty laundry bag in bottom-left corner'
          ]
        },

        {
          id: 'carryon-business-travel',
          name: 'Business Travel Template',
          description: 'Professional packing for wrinkle-free business attire',
          containerType: 'carryon',
          difficulty: 'intermediate',
          zones: [
            {
              name: 'Suit Section',
              position: { x: 0, y: 0, width: 70, height: 60 },
              priority: 'critical',
              accessibility: 'medium',
              recommendedItems: ['suit jacket', 'dress pants', 'dress shirts'],
              packingMethod: 'bundle-wrap',
              description: 'Formal wear using bundle wrapping technique'
            },
            {
              name: 'Accessories Strip',
              position: { x: 70, y: 0, width: 30, height: 60 },
              priority: 'high',
              accessibility: 'easy',
              recommendedItems: ['ties', 'belt', 'cufflinks', 'watch'],
              packingMethod: 'rolled-accessories',
              description: 'Business accessories and small items'
            },
            {
              name: 'Shoes & Electronics',
              position: { x: 0, y: 60, width: 100, height: 40 },
              priority: 'high',
              accessibility: 'medium',
              recommendedItems: ['dress shoes', 'laptop', 'chargers'],
              packingMethod: 'protective-placement',
              description: 'Heavy items and electronics'
            }
          ],
          packingOrder: [
            'Place laptop and electronics at bottom in padded section',
            'Add dress shoes in shoe bags',
            'Create bundle wrap for suits starting with largest garment',
            'Fill accessory strip with ties, belts, and small items'
          ],
          proTips: [
            'Bring garment folder for critical pieces',
            'Pack dress shirt around bundle core',
            'Use shoe trees to maintain shape',
            'Keep backup collar stays and buttons'
          ]
        }
      ],

      // Medium luggage templates
      medium: [
        {
          id: 'medium-week-vacation',
          name: 'Week-Long Vacation Layout',
          description: 'Organized packing for 7-day trips with variety',
          containerType: 'medium',
          difficulty: 'easy',
          zones: [
            {
              name: 'Base Layer - Shoes & Heavy',
              position: { x: 0, y: 70, width: 100, height: 30 },
              priority: 'high',
              accessibility: 'low',
              recommendedItems: ['all shoes', 'books', 'souvenirs', 'electronics'],
              packingMethod: 'weight-distributed',
              description: 'Foundation layer for stability'
            },
            {
              name: 'Middle Layer - Main Clothing',
              position: { x: 0, y: 35, width: 100, height: 35 },
              priority: 'high',
              accessibility: 'medium',
              recommendedItems: ['jeans', 'sweaters', 'jackets', 'dresses'],
              packingMethod: 'category-grouped',
              description: 'Bulk clothing items organized by type'
            },
            {
              name: 'Top Layer - Daily Essentials',
              position: { x: 0, y: 0, width: 100, height: 35 },
              priority: 'high',
              accessibility: 'high',
              recommendedItems: ['underwear', 'socks', 't-shirts', 'pajamas'],
              packingMethod: 'daily-grouping',
              description: 'Frequently used items and daily wear'
            }
          ],
          packingOrder: [
            'Create stable base with shoes and heavy items',
            'Add main clothing in middle, grouped by type',
            'Place daily essentials and undergarments on top',
            'Use compression straps to secure layers'
          ],
          proTips: [
            'Pack outfits for each day together',
            'Use packing cubes to separate clean/dirty',
            'Leave space for souvenirs and purchases'
          ]
        }
      ],

      // Large luggage templates  
      large: [
        {
          id: 'large-extended-travel',
          name: 'Extended Travel System',
          description: 'Long-term travel organization with multiple climate zones',
          containerType: 'large',
          difficulty: 'intermediate',
          zones: [
            {
              name: 'Left Compartment - Cold Weather',
              position: { x: 0, y: 0, width: 50, height: 100 },
              priority: 'medium',
              accessibility: 'medium',
              recommendedItems: ['winter coats', 'boots', 'sweaters', 'thermal wear'],
              packingMethod: 'climate-specific',
              description: 'Cold weather and bulky items'
            },
            {
              name: 'Right Top - Warm Weather',
              position: { x: 50, y: 0, width: 50, height: 50 },
              priority: 'high',
              accessibility: 'high',
              recommendedItems: ['shorts', 't-shirts', 'sandals', 'swimwear'],
              packingMethod: 'lightweight-rolling',
              description: 'Warm weather essentials'
            },
            {
              name: 'Right Bottom - Shoes & Heavy',
              position: { x: 50, y: 50, width: 50, height: 30 },
              priority: 'high',
              accessibility: 'medium',
              recommendedItems: ['all shoes', 'electronics', 'books', 'gifts'],
              packingMethod: 'weight-foundation',
              description: 'Heavy items and footwear'
            },
            {
              name: 'Right Corner - Laundry & Misc',
              position: { x: 50, y: 80, width: 50, height: 20 },
              priority: 'low',
              accessibility: 'low',
              recommendedItems: ['dirty laundry', 'extra bags', 'travel gear'],
              packingMethod: 'containment',
              description: 'Overflow and laundry storage'
            }
          ],
          packingOrder: [
            'Fill right bottom with shoes and heavy electronics',
            'Pack cold weather items in left compartment',
            'Organize warm weather clothes in right top',
            'Reserve corner space for laundry and miscellaneous'
          ],
          proTips: [
            'Use vacuum bags for bulky winter items',
            'Pack by climate/destination order',
            'Keep electrical adapters easily accessible'
          ]
        }
      ]
    };
  }

  // Get templates for specific container
  getTemplatesForContainer(containerId) {
    return this.templates[containerId] || [];
  }

  // Get template by ID
  getTemplate(containerId, templateId) {
    const containerTemplates = this.templates[containerId] || [];
    return containerTemplates.find(template => template.id === templateId) || null;
  }

  // Get template by difficulty
  getTemplatesByDifficulty(difficulty) {
    const allTemplates = [];
    Object.values(this.templates).forEach(containerTemplates => {
      allTemplates.push(...containerTemplates.filter(template => 
        template.difficulty === difficulty
      ));
    });
    return allTemplates;
  }

  // Generate packing layout based on template and items
  generatePackingLayout(containerId, templateId, items) {
    const template = this.getTemplate(containerId, templateId);
    if (!template) return null;

    const layout = {
      template: template,
      itemPlacements: [],
      utilizationMap: {},
      recommendations: []
    };

    // Categorize items for placement
    const categorizedItems = this.categorizeItems(items);

    // Apply template zones to items
    template.zones.forEach(zone => {
      const zoneItems = this.matchItemsToZone(zone, categorizedItems);
      
      layout.itemPlacements.push({
        zone: zone,
        items: zoneItems,
        utilization: zoneItems.length > 0 ? 'used' : 'empty'
      });

      // Track utilization
      layout.utilizationMap[zone.name] = {
        capacity: zone.position.width * zone.position.height / 100, // Normalize to percentage
        used: zoneItems.length,
        efficiency: zoneItems.length / Math.max(1, zone.recommendedItems.length)
      };
    });

    // Generate specific recommendations
    layout.recommendations = this.generateLayoutRecommendations(layout, template);

    return layout;
  }

  categorizeItems(items) {
    const categories = {
      shoes: [],
      electronics: [],
      toiletries: [],
      clothing: [],
      accessories: [],
      books: [],
      documents: [],
      other: []
    };

    items.forEach(item => {
      const category = item.category || 'other';
      if (categories[category]) {
        categories[category].push(item);
      } else {
        categories.other.push(item);
      }
    });

    return categories;
  }

  matchItemsToZone(zone, categorizedItems) {
    const matchedItems = [];

    zone.recommendedItems.forEach(recommendedCategory => {
      // Direct category match
      if (categorizedItems[recommendedCategory]) {
        matchedItems.push(...categorizedItems[recommendedCategory]);
      }

      // Specific item matching
      Object.values(categorizedItems).flat().forEach(item => {
        if (item.name.toLowerCase().includes(recommendedCategory)) {
          if (!matchedItems.includes(item)) {
            matchedItems.push(item);
          }
        }
      });
    });

    return matchedItems;
  }

  generateLayoutRecommendations(layout, template) {
    const recommendations = [];

    // Check for empty zones
    layout.itemPlacements.forEach(placement => {
      if (placement.items.length === 0 && placement.zone.priority === 'high') {
        recommendations.push({
          type: 'empty_zone',
          message: `Consider using ${placement.zone.name} for ${placement.zone.recommendedItems.join(', ')}`,
          priority: 'medium'
        });
      }
    });

    // Check utilization efficiency
    Object.entries(layout.utilizationMap).forEach(([zoneName, utilization]) => {
      if (utilization.efficiency > 1.5) {
        recommendations.push({
          type: 'overcrowded',
          message: `${zoneName} may be overcrowded - consider redistributing items`,
          priority: 'high'
        });
      } else if (utilization.efficiency < 0.3 && utilization.used > 0) {
        recommendations.push({
          type: 'underutilized',
          message: `${zoneName} has extra space for additional items`,
          priority: 'low'
        });
      }
    });

    // Add template-specific tips
    if (template.proTips) {
      template.proTips.forEach(tip => {
        recommendations.push({
          type: 'pro_tip',
          message: tip,
          priority: 'medium'
        });
      });
    }

    return recommendations;
  }

  // Add new template (for easy expansion)
  addTemplate(containerId, templateData) {
    if (!this.templates[containerId]) {
      this.templates[containerId] = [];
    }

    const template = {
      id: templateData.id || `${containerId}-${Date.now()}`,
      name: templateData.name,
      description: templateData.description,
      containerType: containerId,
      difficulty: templateData.difficulty || 'easy',
      zones: templateData.zones || [],
      packingOrder: templateData.packingOrder || [],
      proTips: templateData.proTips || [],
      dateAdded: new Date().toISOString()
    };

    this.templates[containerId].push(template);
    return template.id;
  }

  // Get recommended template based on items and travel type
  recommendTemplate(containerId, items, travelType = 'leisure') {
    const templates = this.getTemplatesForContainer(containerId);
    if (templates.length === 0) return null;

    // Simple recommendation logic (can be enhanced)
    const itemCategories = [...new Set(items.map(item => item.category))];
    const hasBusinessItems = itemCategories.includes('formal') || 
                           items.some(item => item.name.toLowerCase().includes('suit'));

    if (travelType === 'business' || hasBusinessItems) {
      return templates.find(t => t.id.includes('business')) || templates[0];
    }

    if (items.length > 15) {
      return templates.find(t => t.id.includes('extended')) || templates[0];
    }

    return templates[0]; // Default to first template
  }

  // Get all templates
  getAllTemplates() {
    const allTemplates = [];
    Object.entries(this.templates).forEach(([containerId, containerTemplates]) => {
      allTemplates.push(...containerTemplates.map(template => ({
        ...template,
        containerId
      })));
    });
    return allTemplates;
  }
}

module.exports = new OrganizationTemplates();