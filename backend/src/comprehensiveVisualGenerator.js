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
      let detectionResult;
      try {
        detectionResult = await enhancedVision.detectItemsWithSizeEstimation(imageBase64);
        console.log('Detected items for visual generation:', JSON.stringify(detectionResult.items, null, 2));
      } catch (detectionError) {
        console.error('Vision detection failed, using fallback:', detectionError);
        detectionResult = {
          items: [{ name: 'travel items', category: 'accessories', confidence: 0.5 }],
          referenceObject: { found: false, type: 'none' },
          imageAnalysis: { totalItems: 1, perspective: 'unknown', lighting: 'good' }
        };
        this.generationSteps.push('Vision detection failed, using basic fallback');
      }
      
      // Step 3: Get container information
      this.generationSteps.push('Loading container specifications...');
      let container = containerDatabase.getContainer(luggageType);
      if (!container) {
        console.error(`Unknown luggage type: ${luggageType}, using fallback`);
        // Create fallback container
        container = {
          id: luggageType,
          name: `${luggageType} luggage`,
          visualDescription: `${luggageType} travel luggage`,
          internalDimensions: { width: 500, height: 350, depth: 200, volume: 35 }
        };
        this.generationSteps.push(`Using fallback container for ${luggageType}`);
      }
      const finalContainer = container;

      // Step 4: Determine reference scale
      this.generationSteps.push('Calculating size references and proportions...');
      let referenceCalibration = null;
      try {
        if (detectionResult.referenceObject && detectionResult.referenceObject.found) {
          const refObj = referenceDatabase.getReferenceObject(detectionResult.referenceObject.type);
          if (refObj) {
            referenceCalibration = referenceDatabase.calculatePixelRatio(
              detectionResult.referenceObject,
              detectionResult.referenceObject.boundingBox
            );
          }
        }
      } catch (refError) {
        console.error('Reference calibration failed:', refError);
        this.generationSteps.push('Reference calibration failed, proceeding without calibration');
      }

      // Step 5: Select organization template
      this.generationSteps.push('Selecting optimal organization template...');
      let template = null;
      try {
        template = organizationTemplates.recommendTemplate(
          luggageType, 
          detectionResult.items || [],
          options.travelType || 'leisure'
        );
      } catch (templateError) {
        console.error('Template selection failed:', templateError);
        this.generationSteps.push('Template selection failed, using basic organization');
      }

      // Step 6: Get relevant pro tips
      this.generationSteps.push('Gathering professional organizing tips...');
      let relevantTips = [], efficiencyTips = [];
      try {
        relevantTips = organizingProTips.getTipsForItems(detectionResult.items || []);
        efficiencyTips = organizingProTips.getEfficiencyTips('spaceSaving').slice(0, 3);
      } catch (tipsError) {
        console.error('Pro tips failed:', tipsError);
        this.generationSteps.push('Pro tips unavailable, using basic guidance');
        relevantTips = [];
        efficiencyTips = [];
      }

      // Step 7: Generate multiple packing layouts
      this.generationSteps.push('Creating 2 complementary packing layout strategies...');
      const layouts = await this.generateMultipleLayouts(
        detectionResult.items || [],
        finalContainer,
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
        container: finalContainer,
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
          containerCapacity: finalContainer.internalDimensions.volume,
          estimatedEfficiency: this.calculatePackingEfficiency(detectionResult.items || [], finalContainer),
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

    try {
      // OPTIMIZED: Generate TWO complementary layouts for variety within timeout limits
      // This provides options while keeping generation time ~60-120 seconds
      
      // Layout 1: Best primary option (Template > Size-optimized > Pro-efficiency)
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
      } else if (referenceCalibration && referenceCalibration.confidence > 0.7) {
        layouts.push({
          id: 'size-optimized',
          name: 'Precision Size-Based Layout',
          method: 'Size Optimization',
          description: 'Layout optimized using precise size measurements from reference objects',
          strategy: 'size-optimized',
          referenceCalibration: referenceCalibration,
          prompt: await this.createSizeOptimizedPrompt(originalImageUrl, container, items, referenceCalibration)
        });
      } else {
        let efficiencyTips = [];
        try {
          efficiencyTips = organizingProTips.getEfficiencyTips('spaceSaving').slice(0, 3);
        } catch (e) {
          console.error('Failed to get efficiency tips:', e);
        }

        layouts.push({
          id: 'pro-efficiency',
          name: 'Professional Efficiency Layout',
          method: 'Maximum Efficiency',
          description: 'Space-maximizing layout using professional packing techniques',
          strategy: 'pro-efficiency',
          tips: efficiencyTips,
          prompt: await this.createProEfficiencyPrompt(originalImageUrl, container, items)
        });
      }

      // Layout 2: Complementary alternative approach
      // If we have template, add accessibility; if we have size-optimized, add efficiency; if we have efficiency, add accessibility
      if (template) {
        // Template + Accessibility combination
        layouts.push({
          id: 'travel-ready',
          name: 'Travel Accessibility Layout',
          method: 'Easy Access',
          description: 'Organized for easy access to essentials during travel',
          strategy: 'accessibility',
          prompt: await this.createAccessibilityPrompt(originalImageUrl, container, items)
        });
      } else if (referenceCalibration && referenceCalibration.confidence > 0.7) {
        // Size-optimized + Efficiency combination
        let efficiencyTips = [];
        try {
          efficiencyTips = organizingProTips.getEfficiencyTips('spaceSaving').slice(0, 3);
        } catch (e) {
          console.error('Failed to get efficiency tips:', e);
        }

        layouts.push({
          id: 'pro-efficiency',
          name: 'Professional Efficiency Layout',
          method: 'Maximum Efficiency',
          description: 'Space-maximizing layout using professional packing techniques',
          strategy: 'pro-efficiency',
          tips: efficiencyTips,
          prompt: await this.createProEfficiencyPrompt(originalImageUrl, container, items)
        });
      } else {
        // Efficiency + Accessibility combination
        layouts.push({
          id: 'travel-ready',
          name: 'Travel Accessibility Layout',
          method: 'Easy Access',
          description: 'Organized for easy access to essentials during travel',
          strategy: 'accessibility',
          prompt: await this.createAccessibilityPrompt(originalImageUrl, container, items)
        });
      }

      // Fallback: If no layouts generated, create a basic one
      if (layouts.length === 0) {
        layouts.push({
          id: 'basic-packing',
          name: 'Basic Packing Layout',
          method: 'Simple Organization',
          description: 'Basic organized packing layout',
          strategy: 'basic',
          prompt: await this.createBasicPrompt(originalImageUrl, container, items)
        });
      }

    } catch (error) {
      console.error('Error generating layouts:', error);
      // Ensure at least one basic layout
      layouts.push({
        id: 'fallback-packing',
        name: 'Fallback Packing Layout',
        method: 'Basic Packing',
        description: 'Simple packing arrangement',
        strategy: 'fallback',
        prompt: await this.createBasicPrompt(originalImageUrl, container, items)
      });
    }

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
    let tips = [];
    try {
      tips = organizingProTips.getEfficiencyTips('spaceSaving').slice(0, 3);
    } catch (e) {
      console.error('Failed to get efficiency tips in prompt:', e);
      tips = []; // Use empty array as fallback
    }
    
    // Get detailed description of the original items
    let detailedItemDescription = '';
    try {
      detailedItemDescription = await this.createDetailedItemDescription(originalImageUrl, items);
    } catch (error) {
      console.error('Failed to create detailed item description:', error);
      detailedItemDescription = `${items.length} items including ${items.map(item => item.name).join(', ')}`;
    }
    
    return `Professional overhead photograph of expertly packed ${container.visualDescription || 'black travel suitcase'} demonstrating maximum space efficiency.

SPECIFIC ITEMS TO PACK: ${detailedItemDescription}

EXPERT PACKING TECHNIQUES SHOWN:
- Clothes tightly rolled to minimize space usage
- Shoes utilized as containers for small items (socks, cables, chargers)
- Strategic layering: heaviest items at bottom, progressively lighter items on top
- Every available gap filled with flexible or small items
- Visible compression and space-saving methods applied

VISUAL COMPOSITION:
- Top-down view of open suitcase interior
- All items from the description clearly visible and identifiable
- Expert-level organization with zero wasted space
- Professional arrangement showing maximum efficiency
- Clean, well-lit product photography
- Realistic textures and colors matching the original items

STYLE: Professional travel packing tutorial demonstration, expert-level efficiency showcase.`;
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

  async createBasicPrompt(originalImageUrl, container, items) {
    const itemsList = items.length > 0 ? items.map(item => item.name).join(', ') : 'travel items';
    const itemCount = items.length;
    
    // Use GPT-4o Vision to create a detailed description of the original items
    let detailedItemDescription = '';
    try {
      detailedItemDescription = await this.createDetailedItemDescription(originalImageUrl, items);
    } catch (error) {
      console.error('Failed to create detailed item description:', error);
      detailedItemDescription = `${itemCount} items including ${itemsList}`;
    }
    
    return `Professional overhead photograph of an open ${container.visualDescription || 'black travel suitcase'} with items neatly organized inside.

SPECIFIC ITEMS TO RECREATE: ${detailedItemDescription}

LAYOUT REQUIREMENTS:
- Top-down view of open suitcase interior
- Each item positioned clearly and identifiable
- Professional organization with logical grouping
- Items arranged by size: heavy items at bottom, lighter on top
- Efficient use of space with items fitting neatly

VISUAL SPECIFICATIONS:
- Clean product photography lighting
- Sharp focus on all items
- Realistic colors and textures matching described items
- Professional travel photography style
- Neutral background
- No text, labels, or branding

COMPOSITION: Overhead shot showing efficient packing of the specific items described above in ${container.name || 'travel luggage'}.`;
  }

  async createDetailedItemDescription(originalImageUrl, items) {
    console.log('Creating detailed item description using GPT-4o Vision...');
    
    try {
      const openai = this.getOpenAI();
      
      // Use the stored original image to create detailed descriptions
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please provide a detailed visual description of each item in this image for AI image generation. Focus on:
- Specific colors, materials, and textures
- Approximate sizes relative to each other
- Distinctive features, patterns, or shapes
- How items are positioned or arranged
- Any unique characteristics that would help recreate them visually

Format as: "Item 1: [detailed description], Item 2: [detailed description]" etc.

Detected items list: ${items.map(item => item.name).join(', ')}`
              },
              {
                type: "image_url",
                image_url: {
                  url: originalImageUrl,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      });

      const detailedDescription = response.choices[0].message.content;
      console.log('Detailed item description created:', detailedDescription);
      return detailedDescription;
      
    } catch (error) {
      console.error('Error creating detailed item description:', error);
      return items.map(item => `${item.name} (${item.category || 'travel item'})`).join(', ');
    }
  }

  getOpenAI() {
    if (!this.openai) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is required');
      }
      const OpenAI = require('openai');
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return this.openai;
  }

  async generateAIVisuals(layouts, originalImageUrl, container, sessionId) {
    const visualResults = [];
    
    for (let i = 0; i < layouts.length; i++) {
      const layout = layouts[i];
      this.generationSteps.push(`Generating visual ${i+1}/${layouts.length}: ${layout.name}...`);
      
      try {
        // Log the prompt being sent to DALL-E
        console.log(`\n=== DALL-E PROMPT FOR ${layout.name} ===`);
        console.log(layout.prompt);
        console.log('=== END PROMPT ===\n');
        
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