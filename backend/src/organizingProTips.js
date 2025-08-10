// Professional Organizing Tips Database
class OrganizingProTips {
  constructor() {
    this.tips = this.initializeTips();
  }

  initializeTips() {
    return {
      // General packing principles
      general: [
        {
          id: 'rolling-technique',
          title: 'Master the Rolling Technique',
          description: 'Roll clothes tightly starting from the bottom, expelling air as you go',
          category: 'clothing',
          difficulty: 'easy',
          timeSaving: '30%',
          spaceSaving: '40%',
          steps: [
            'Lay garment flat on a clean surface',
            'Fold sleeves in (for shirts/dresses)',
            'Start rolling from the bottom hem',
            'Keep tension consistent while rolling',
            'Secure with rubber band if needed'
          ],
          applicableItems: ['t-shirts', 'pants', 'dresses', 'shorts'],
          avoidFor: ['formal shirts', 'delicate fabrics']
        },
        
        {
          id: 'heavy-items-bottom',
          title: 'Heavy Items at Bottom Rule',
          description: 'Always place heaviest items at the bottom for stability',
          category: 'weight-distribution',
          difficulty: 'easy',
          importance: 'critical',
          steps: [
            'Identify heaviest items (shoes, books, electronics)',
            'Place them flat against the bottom of luggage',
            'Distribute weight evenly across the base',
            'Build lighter layers on top'
          ],
          benefits: ['Better balance', 'Protects fragile items', 'Easier wheeling']
        },

        // Add more general tips here...
      ],

      // Category-specific tips
      clothing: [
        {
          id: 'bundle-wrapping',
          title: 'Bundle Wrapping Method',
          description: 'Wrap multiple garments around a central core to minimize wrinkles',
          difficulty: 'intermediate',
          spaceSaving: '25%',
          wrinklePrevention: '90%',
          steps: [
            'Choose a soft core item (underwear bundle)',
            'Lay largest garment flat (jacket/dress)',
            'Place smaller items on top alternating direction',
            'Wrap around the core tightly',
            'Secure the bundle'
          ],
          bestFor: ['business trips', 'formal wear', 'wrinkle-prone fabrics']
        }
        // Add more clothing tips...
      ],

      electronics: [
        {
          id: 'cable-organization',
          title: 'Cable Management System',
          description: 'Organize cables and chargers to prevent tangling and save space',
          difficulty: 'easy',
          steps: [
            'Use small pouches or zip-lock bags for each device',
            'Wrap cables in figure-8 pattern',
            'Label cables with tape if multiple similar ones',
            'Keep frequently used chargers easily accessible'
          ],
          tools: ['small pouches', 'cable ties', 'labels']
        }
        // Add more electronics tips...
      ],

      shoes: [
        {
          id: 'shoe-stuffing',
          title: 'Maximize Shoe Space',
          description: 'Use interior space of shoes for small items',
          spaceSaving: '20%',
          steps: [
            'Clean shoes thoroughly before packing',
            'Stuff with socks, underwear, or chargers',
            'Use shoe bags to protect other items',
            'Place shoes heel-to-toe to save space'
          ],
          hygieneTips: ['Use shoe bags', 'Pack dirty shoes separately']
        }
        // Add more shoe tips...
      ],

      toiletries: [
        {
          id: 'leak-prevention',
          title: 'Leak-Proof Toiletry Packing',
          description: 'Prevent spills and leaks that can ruin your entire luggage',
          importance: 'critical',
          steps: [
            'Use travel-sized containers only',
            'Remove air from bottles before sealing',
            'Place plastic wrap under caps',
            'Double-bag all liquids',
            'Keep toiletries in separate compartment'
          ],
          emergencyTips: ['Pack a few extra zip-lock bags', 'Bring cleaning wipes']
        }
        // Add more toiletry tips...
      ]
    };
  }

  // Get tips by category
  getTipsByCategory(category) {
    return this.tips[category] || [];
  }

  // Get tips by difficulty level
  getTipsByDifficulty(difficulty) {
    const allTips = [];
    Object.values(this.tips).forEach(categoryTips => {
      allTips.push(...categoryTips.filter(tip => tip.difficulty === difficulty));
    });
    return allTips;
  }

  // Get tips for specific items
  getTipsForItems(items) {
    const relevantTips = [];
    const itemCategories = [...new Set(items.map(item => item.category))];
    
    // Add general tips
    relevantTips.push(...this.tips.general);
    
    // Add category-specific tips
    itemCategories.forEach(category => {
      if (this.tips[category]) {
        relevantTips.push(...this.tips[category]);
      }
    });

    // Filter tips based on specific items
    const itemNames = items.map(item => item.name.toLowerCase());
    return relevantTips.filter(tip => {
      if (tip.applicableItems) {
        return tip.applicableItems.some(applicable => 
          itemNames.some(itemName => itemName.includes(applicable))
        );
      }
      return true;
    });
  }

  // Get tips with time/space saving metrics
  getEfficiencyTips(prioritizeBy = 'spaceSaving') {
    const allTips = [];
    Object.values(this.tips).forEach(categoryTips => {
      allTips.push(...categoryTips.filter(tip => tip[prioritizeBy]));
    });
    
    return allTips.sort((a, b) => {
      const aValue = parseInt(a[prioritizeBy]) || 0;
      const bValue = parseInt(b[prioritizeBy]) || 0;
      return bValue - aValue;
    });
  }

  // Add new tip (for easy expansion)
  addTip(category, tip) {
    if (!this.tips[category]) {
      this.tips[category] = [];
    }
    
    tip.id = tip.id || `${category}-${Date.now()}`;
    tip.dateAdded = new Date().toISOString();
    
    this.tips[category].push(tip);
    return tip.id;
  }

  // Get tip by ID
  getTipById(tipId) {
    for (const categoryTips of Object.values(this.tips)) {
      const tip = categoryTips.find(t => t.id === tipId);
      if (tip) return tip;
    }
    return null;
  }

  // Search tips by keywords
  searchTips(query) {
    const searchTerm = query.toLowerCase();
    const results = [];
    
    Object.entries(this.tips).forEach(([category, categoryTips]) => {
      categoryTips.forEach(tip => {
        if (
          tip.title.toLowerCase().includes(searchTerm) ||
          tip.description.toLowerCase().includes(searchTerm) ||
          (tip.applicableItems && tip.applicableItems.some(item => 
            item.toLowerCase().includes(searchTerm)
          ))
        ) {
          results.push({ ...tip, category });
        }
      });
    });
    
    return results;
  }
}

module.exports = new OrganizingProTips();