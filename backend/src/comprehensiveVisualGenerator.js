const enhancedVision = require('./enhancedVision');
const organizingProTips = require('./organizingProTips');
const referenceDatabase = require('./referenceDatabase');
const containerDatabase = require('./containerDatabase');
const organizationTemplates = require('./organizationTemplates');
const imageStorage = require('./imageStorage');

class ComprehensiveVisualGenerator {
  constructor() {
    this.generationSteps = [];
  }

  async generateComprehensivePackingVisuals(originalImageFile, luggageType, options = {}) {
    this.generationSteps = [];
    const startTime = Date.now();
    
    try {
      // Step 1: Store original image for reference
      this.generationSteps.push('Storing original image for reference...');
      const imageBase64 = `data:${originalImageFile.mimetype};base64,${originalImageFile.buffer.toString('base64')}`;
      
      const imageStorageResult = await imageStorage.storeOriginalImage(
        originalImageFile.buffer,
        {
          filename: originalImageFile.originalname,
          mimetype: originalImageFile.mimetype,
          sessionId: options.sessionId || `session-${Date.now()}`
        }
      );

      if (!imageStorageResult.success) {
        throw new Error('Failed to store original image: ' + imageStorageResult.error);
      }

      // Step 2: Analyze original image for reference objects and items
      this.generationSteps.push('Analyzing original image for items and reference objects...');
      const detectionResult = await enhancedVision.detectItemsWithSizeEstimation(imageBase64);
      
      // Step 3: Get container information
      this.generationSteps.push('Loading container specifications...');
      const container = containerDatabase.getContainer(luggageType);
      if (!container) {
        throw new Error(`Unknown luggage type: ${luggageType}`);
      }

      // Step 4: Determine reference scale
      this.generationSteps.push('Calculating size references and proportions...');
      let referenceCalibration = null;
      if (detectionResult.referenceObject && detectionResult.referenceObject.found) {
        const refObj = referenceDatabase.getReferenceObject(detectionResult.referenceObject.type);
        if (refObj) {
          referenceCalibration = referenceDatabase.calculatePixelRatio(
            detectionResult.referenceObject,
            detectionResult.referenceObject.boundingBox
          );
        }
      }

      // Step 5: Select organization template
      this.generationSteps.push('Selecting optimal organization template...');
      const template = organizationTemplates.recommendTemplate(
        luggageType, 
        detectedResult.items || [],
        options.travelType || 'leisure'
      );

      // Step 6: Get relevant pro tips
      this.generationSteps.push('Gathering professional organizing tips...');
      const relevantTips = organizingProTips.getTipsForItems(detectionResult.items || []);
      const efficiencyTips = organizingProTips.getEfficiencyTips('spaceSaving').slice(0, 3);

      // Step 7: Generate multiple packing layouts
      this.generationSteps.push('Creating multiple packing layout strategies...');
      const layouts = await this.generateMultipleLayouts(
        detectionResult.items || [],
        container,
        template,
        referenceCalibration,
        imageStorageResult.imageUrl
      );

      // Step 8: Generate AI visualizations for each layout
      this.generationSteps.push('Generating AI-powered packing visuals...');
      const visualResults = await this.generateAIVisuals(
        layouts,
        imageStorageResult.imageUrl,
        container,
        options.sessionId
      );

      // Step 9: Compile comprehensive results
      const comprehensiveResults = {
        success: true,
        sessionId: imageStorageResult.sessionId,
        originalImage: {
          url: imageStorageResult.imageUrl,
          secureUrl: imageStorageResult.secureUrl,
          metadata: imageStorageResult.metadata
        },
        container: container,
        detectedItems: detectionResult.items || [],
        referenceCalibration: referenceCalibration,
        organizationTemplate: template,
        packingLayouts: visualResults,
        professionalTips: {
          itemSpecific: relevantTips.slice(0, 5),
          efficiency: efficiencyTips,
          containerSpecific: this.getContainerSpecificTips(luggageType)
        },
        statistics: {
          totalItems: detectionResult.items?.length || 0,
          containerCapacity: container.internalDimensions.volume,
          estimatedEfficiency: this.calculatePackingEfficiency(detectionResult.items || [], container),
          referenceFound: detectionResult.referenceObject?.found || false,
          generationTime: Date.now() - startTime
        },
        generationSteps: this.generationSteps
      };

      return comprehensiveResults;

    } catch (error) {
      console.error('Error in comprehensive visual generation:', error);
      
      return {
        success: false,
        error: error.message,
        generationSteps: this.generationSteps,
        sessionId: options.sessionId || null
      };
    }
  }

  async generateMultipleLayouts(items, container, template, referenceCalibration, originalImageUrl) {
    const layouts = [];

    // Layout 1: Template-based organization
    if (template) {
      layouts.push({
        id: 'template-based',
        name: `${template.name}`,
        method: 'Template Organization',
        description: template.description,
        strategy: 'template-based',
        template: template,
        prompt: await this.createTemplateBasedPrompt(originalImageUrl, container, template, items)
      });
    }

    // Layout 2: Size-optimized based on reference calibration
    if (referenceCalibration && referenceCalibration.confidence > 0.7) {
      layouts.push({
        id: 'size-optimized',
        name: 'Precision Size-Based Layout',
        method: 'Size Optimization',
        description: 'Layout optimized using precise size measurements from reference objects',
        strategy: 'size-optimized',
        referenceCalibration: referenceCalibration,
        prompt: await this.createSizeOptimizedPrompt(originalImageUrl, container, items, referenceCalibration)
      });
    }

    // Layout 3: Professional efficiency layout
    layouts.push({
      id: 'pro-efficiency',
      name: 'Professional Efficiency Layout',
      method: 'Maximum Efficiency',
      description: 'Space-maximizing layout using professional packing techniques',
      strategy: 'pro-efficiency',
      tips: organizingProTips.getEfficiencyTips('spaceSaving').slice(0, 3),
      prompt: await this.createProEfficiencyPrompt(originalImageUrl, container, items)
    });

    // Layout 4: Travel-ready accessibility
    layouts.push({
      id: 'travel-ready',
      name: 'Travel Accessibility Layout',
      method: 'Easy Access',
      description: 'Organized for easy access to essentials during travel',
      strategy: 'accessibility',
      prompt: await this.createAccessibilityPrompt(originalImageUrl, container, items)
    });

    return layouts;
  }

  async createTemplateBasedPrompt(originalImageUrl, container, template, items) {
    const itemsList = items.map(item => `${item.name} (${item.category})`).join(', ');
    
    return `Professional packing photography: Transform the items from the reference photo into a perfectly organized ${container.visualDescription} using the ${template.name} method.

REFERENCE IMAGE: Use the uploaded photo showing: ${itemsList}

CONTAINER: ${container.name}
- Internal space: ${container.internalDimensions.width} × ${container.internalDimensions.height} × ${container.internalDimensions.depth}mm
- Volume: ${container.internalDimensions.volume}L

ORGANIZATION METHOD: ${template.name}
${template.description}

PACKING ZONES:
${template.zones.map(zone => `• ${zone.name}: ${zone.description}`).join('\n')}

PACKING SEQUENCE:
${template.packingOrder.map((step, i) => `${i+1}. ${step}`).join('\n')}

VISUAL REQUIREMENTS:
- Overhead view of open luggage showing perfect organization
- All items from reference photo visible and neatly arranged
- Each zone clearly defined with appropriate items
- Professional product photography lighting
- Realistic proportions and spacing
- Color coordination and visual appeal

Style: Clean, professional, tutorial-quality packing demonstration.`;
  }

  async createSizeOptimizedPrompt(originalImageUrl, container, items, referenceCalibration) {
    const referenceType = referenceCalibration.referenceUsed;
    const itemsList = items.map(item => `${item.name} (${item.category})`).join(', ');
    
    return `Precision packing photography: Pack all items from reference photo into ${container.visualDescription} with accurate size relationships.

REFERENCE IMAGE: Shows these items: ${itemsList}

SIZE CALIBRATION: Using ${referenceType} for precise measurements
- Scale ratio: ${referenceCalibration.ratio.toFixed(3)}mm per pixel
- Confidence: ${(referenceCalibration.confidence * 100).toFixed(1)}%

CONTAINER: ${container.name}
- Precise internal dimensions: ${container.internalDimensions.width} × ${container.internalDimensions.height} × ${container.internalDimensions.depth}mm

PACKING STRATEGY:
- Use exact size relationships from reference calibration
- Maximize space efficiency with precise item placement
- Consider real-world item proportions and constraints
- Pack heaviest items at bottom for stability

VISUAL OUTPUT:
- Top-down view of luggage with items perfectly sized
- Accurate spatial relationships between all items
- Professional lighting showing clear details
- Realistic material textures and colors
- Items arranged for optimal space utilization

Quality: Photorealistic packing demonstration with precise measurements.`;
  }

  async createProEfficiencyPrompt(originalImageUrl, container, items) {
    const tips = organizingProTips.getEfficiencyTips('spaceSaving').slice(0, 3);
    const itemsList = items.map(item => `${item.name} (${item.category})`).join(', ');
    
    return `Expert-level packing photography: Demonstrate professional space-maximizing techniques with all items from reference photo in ${container.visualDescription}.

REFERENCE ITEMS: ${itemsList}

PROFESSIONAL TECHNIQUES TO APPLY:
${tips.map(tip => `• ${tip.title}: ${tip.description} (${tip.spaceSaving}% space saving)`).join('\n')}

CONTAINER: ${container.name} (${container.internalDimensions.volume}L capacity)

EFFICIENCY STRATEGIES:
- Roll clothing items tightly to minimize space
- Use internal shoe space for small items
- Layer items by weight (heavy to light, bottom to top)
- Fill all gaps with flexible items
- Use compression techniques where possible

VISUAL DEMONSTRATION:
- Overhead view showing maximum space utilization
- Items packed with professional precision
- Visible compression and space-saving techniques
- Clean organization with no wasted space
- Professional travel consultant quality results

Result: Tutorial-quality demonstration of expert packing efficiency.`;
  }

  async createAccessibilityPrompt(originalImageUrl, container, items) {
    const accessibleCategories = ['electronics', 'documents', 'toiletries', 'medications'];
    const accessibleItems = items.filter(item => 
      accessibleCategories.includes(item.category) || 
      item.name.toLowerCase().includes('charger') ||
      item.name.toLowerCase().includes('phone')
    );
    
    const itemsList = items.map(item => `${item.name} (${item.category})`).join(', ');
    
    return `Travel-smart packing photography: Organize all items from reference photo in ${container.visualDescription} for maximum travel convenience.

REFERENCE ITEMS: ${itemsList}

ACCESSIBILITY PRIORITIES:
${accessibleItems.length > 0 ? 
  `High Priority Access: ${accessibleItems.map(item => item.name).join(', ')}` : 
  'Organize for general travel convenience'}

CONTAINER: ${container.name}

ACCESSIBILITY STRATEGY:
- Place frequently needed items in top layers and outer pockets
- Keep essentials easily reachable without unpacking
- Position electronics and chargers for quick access
- Store documents and travel items in accessible compartments
- Group related items together (all tech, all toiletries)

PACKING ZONES:
- Top layer: Daily essentials, electronics, documents
- Middle layer: Clothing and personal items
- Bottom layer: Shoes, books, and rarely-needed items
- Side pockets: Quick-access items

VISUAL RESULT:
- Clear organization showing accessibility hierarchy  
- Professional travel-ready arrangement
- Items grouped logically for travel convenience
- Clean, organized appearance suitable for business travel

Quality: Smart traveler's perfectly organized luggage demonstration.`;
  }

  async generateAIVisuals(layouts, originalImageUrl, container, sessionId) {
    const visualResults = [];
    
    for (let i = 0; i < layouts.length; i++) {
      const layout = layouts[i];
      this.generationSteps.push(`Generating visual ${i+1}/${layouts.length}: ${layout.name}...`);
      
      try {
        // Generate AI image using DALL-E
        const imageUrl = await enhancedVision.generatePackingImage(layout.prompt);
        
        // Store generated image
        const storageResult = await imageStorage.storeGeneratedImage(imageUrl, {
          sessionId: sessionId,
          method: layout.strategy,
          luggageType: container.id,
          itemCount: layout.itemCount || 0,
          originalImageUrl: originalImageUrl
        });

        visualResults.push({
          ...layout,
          imageUrl: storageResult.success ? storageResult.imageUrl : imageUrl,
          secureUrl: storageResult.secureUrl || imageUrl,
          generated: true,
          generatedAt: new Date().toISOString(),
          storageId: storageResult.imageId
        });

      } catch (error) {
        console.error(`Error generating visual for ${layout.name}:`, error);
        
        visualResults.push({
          ...layout,
          imageUrl: null,
          generated: false,
          error: error.message,
          fallbackAvailable: true
        });
      }
    }

    return visualResults;
  }

  calculatePackingEfficiency(items, container) {
    if (!items || items.length === 0) return 0;
    
    const totalItemVolume = items.reduce((sum, item) => {
      // Estimate volume if not provided
      const volume = item.volume || (item.estimatedDimensions ? 
        (item.estimatedDimensions.width * item.estimatedDimensions.height * item.estimatedDimensions.depth) / 1000000 : 1);
      return sum + volume;
    }, 0);

    return Math.min(100, (totalItemVolume / container.internalDimensions.volume) * 100);
  }

  getContainerSpecificTips(luggageType) {
    const containerTips = {
      underseat: [
        'Keep essentials in front pocket for easy flight access',
        'Pack heavy items at bottom to fit under seat properly',
        'Use every inch - underseat space is very limited'
      ],
      carryon: [
        'Use the 3-1-1 rule for liquids in easily accessible pockets',
        'Pack one full outfit in carry-on in case checked bag is lost',
        'Keep chargers and electronics easily accessible for security'
      ],
      medium: [
        'Use packing cubes to stay organized in larger space',
        'Pack shoes along edges to maximize central packing space',
        'Leave room for souvenirs and purchases'
      ],
      large: [
        'Create separate zones for different trip segments',
        'Use compression bags for bulky items',
        'Pack dirty laundry compartment for return journey'
      ]
    };

    return containerTips[luggageType] || [];
  }
}

module.exports = new ComprehensiveVisualGenerator();