// Reference Objects Database for Size Estimation
class ReferenceDatabase {
  constructor() {
    this.references = this.initializeReferences();
  }

  initializeReferences() {
    return {
      // Credit cards and payment cards
      creditCard: {
        id: 'credit-card',
        name: 'Credit Card',
        aliases: ['credit card', 'debit card', 'bank card', 'payment card'],
        standardSize: {
          width: 85.6,    // mm - ISO/IEC 7810 ID-1 standard
          height: 53.98,  // mm
          thickness: 0.76 // mm
        },
        variations: {
          'us-standard': { width: 85.6, height: 53.98, thickness: 0.76 },
          'metal-card': { width: 85.6, height: 53.98, thickness: 0.84 }
        },
        reliability: 0.95,
        commonness: 0.9,
        identificationFeatures: [
          'rectangular shape',
          'rounded corners',
          'typically has numbers/text',
          'logo visible'
        ],
        estimationAccuracy: 0.92,
        notes: 'Most reliable reference object worldwide due to standardization'
      },

      // Coins
      usCoin: {
        id: 'us-coin',
        name: 'US Coin',
        aliases: ['quarter', 'coin', 'us quarter', 'twenty five cents'],
        standardSize: {
          diameter: 24.26,  // mm - US Quarter
          thickness: 1.75   // mm
        },
        variations: {
          'quarter': { diameter: 24.26, thickness: 1.75 },
          'nickel': { diameter: 21.21, thickness: 1.95 },
          'dime': { diameter: 17.91, thickness: 1.35 },
          'penny': { diameter: 19.05, thickness: 1.55 }
        },
        reliability: 0.85,
        commonness: 0.7,
        identificationFeatures: [
          'circular shape',
          'metallic appearance',
          'embossed designs',
          'text around edges'
        ],
        estimationAccuracy: 0.88,
        notes: 'Good for circular reference, varies by country'
      },

      // Smartphones
      smartphone: {
        id: 'smartphone',
        name: 'Smartphone',
        aliases: ['phone', 'iphone', 'android', 'mobile phone', 'cell phone'],
        standardSize: {
          width: 71.5,    // mm - Average modern smartphone
          height: 146.7,  // mm
          thickness: 7.65  // mm
        },
        variations: {
          'iphone-15': { width: 70.6, height: 147.6, thickness: 7.80 },
          'iphone-15-plus': { width: 77.8, height: 160.9, thickness: 7.80 },
          'iphone-15-pro': { width: 70.6, height: 147.6, thickness: 8.25 },
          'samsung-s24': { width: 70.6, height: 147.0, thickness: 7.60 },
          'generic-large': { width: 77.0, height: 165.0, thickness: 8.50 },
          'generic-compact': { width: 65.0, height: 140.0, thickness: 7.00 }
        },
        reliability: 0.75,
        commonness: 0.95,
        identificationFeatures: [
          'rectangular with rounded corners',
          'screen visible',
          'camera bump',
          'charging port at bottom'
        ],
        estimationAccuracy: 0.78,
        notes: 'Very common but varies significantly between models'
      },

      // Water bottles
      waterBottle: {
        id: 'water-bottle',
        name: 'Water Bottle',
        aliases: ['bottle', 'water bottle', 'plastic bottle', 'drink bottle'],
        standardSize: {
          height: 200,     // mm - Standard 500ml bottle
          diameter: 65,    // mm
          volume: 500      // ml
        },
        variations: {
          '500ml-standard': { height: 200, diameter: 65, volume: 500 },
          '330ml-small': { height: 170, diameter: 60, volume: 330 },
          '1l-large': { height: 280, diameter: 75, volume: 1000 },
          'sports-bottle': { height: 240, diameter: 70, volume: 750 }
        },
        reliability: 0.70,
        commonness: 0.8,
        identificationFeatures: [
          'cylindrical shape',
          'cap at top',
          'label visible',
          'transparent/translucent'
        ],
        estimationAccuracy: 0.72,
        notes: 'Good for height reference but diameter varies significantly'
      },

      // Pens
      pen: {
        id: 'pen',
        name: 'Pen',
        aliases: ['pen', 'ballpoint pen', 'biro', 'writing pen'],
        standardSize: {
          length: 140,     // mm - Standard ballpoint pen
          diameter: 8      // mm
        },
        variations: {
          'bic-standard': { length: 140, diameter: 8 },
          'pilot-g2': { length: 145, diameter: 11 },
          'luxury-pen': { length: 135, diameter: 12 },
          'pencil': { length: 175, diameter: 7 }
        },
        reliability: 0.65,
        commonness: 0.6,
        identificationFeatures: [
          'elongated cylindrical',
          'tip at one end',
          'clip visible',
          'brand markings'
        ],
        estimationAccuracy: 0.68,
        notes: 'Good for length reference but varies between brands'
      },

      // Add more reference objects as needed...
    };
  }

  // Get reference object by ID or alias
  getReferenceObject(identifier) {
    const id = identifier.toLowerCase();
    
    // Direct ID match
    if (this.references[id]) {
      return this.references[id];
    }
    
    // Search by alias
    for (const [refId, refData] of Object.entries(this.references)) {
      if (refData.aliases.some(alias => alias.toLowerCase() === id)) {
        return refData;
      }
    }
    
    return null;
  }

  // Detect reference object from image analysis
  identifyReferenceFromDetection(detectedObjects, imageAnalysis = {}) {
    const potentialReferences = [];
    
    detectedObjects.forEach(obj => {
      const objName = obj.name.toLowerCase();
      
      // Check against all reference objects
      Object.values(this.references).forEach(ref => {
        const matchScore = this.calculateMatchScore(objName, ref);
        if (matchScore > 0.6) {
          potentialReferences.push({
            reference: ref,
            detectedObject: obj,
            matchScore: matchScore,
            reliability: ref.reliability * matchScore
          });
        }
      });
    });
    
    // Sort by reliability and return best match
    potentialReferences.sort((a, b) => b.reliability - a.reliability);
    
    return potentialReferences.length > 0 ? potentialReferences[0] : null;
  }

  calculateMatchScore(detectedName, reference) {
    let maxScore = 0;
    
    // Check against name and all aliases
    const namesToCheck = [reference.name.toLowerCase(), ...reference.aliases];
    
    namesToCheck.forEach(refName => {
      const similarity = this.stringSimilarity(detectedName, refName);
      maxScore = Math.max(maxScore, similarity);
    });
    
    return maxScore;
  }

  stringSimilarity(str1, str2) {
    if (str1 === str2) return 1.0;
    if (str1.includes(str2) || str2.includes(str1)) return 0.9;
    
    // Simple Levenshtein-based similarity
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Calculate pixel-to-mm ratio using reference object
  calculatePixelRatio(referenceObject, detectedBoundingBox, imageWidth = 1024, imageHeight = 1024) {
    if (!referenceObject || !detectedBoundingBox) {
      return { ratio: 0.5, confidence: 0.3, method: 'fallback' }; // Default fallback
    }

    const refData = this.getReferenceObject(referenceObject.type);
    if (!refData) {
      return { ratio: 0.5, confidence: 0.3, method: 'unknown_reference' };
    }

    // Use appropriate dimension based on object type
    let realWorldSize, pixelSize;
    
    if (referenceObject.type.includes('coin')) {
      // For circular objects, use diameter
      pixelSize = Math.max(detectedBoundingBox.width, detectedBoundingBox.height);
      realWorldSize = refData.standardSize.diameter;
    } else if (referenceObject.type.includes('bottle')) {
      // For bottles, use height
      pixelSize = detectedBoundingBox.height;
      realWorldSize = refData.standardSize.height;
    } else {
      // For rectangular objects (cards, phones), use width
      pixelSize = detectedBoundingBox.width;
      realWorldSize = refData.standardSize.width;
    }

    const ratio = realWorldSize / pixelSize;
    const confidence = refData.estimationAccuracy * refData.reliability;

    return {
      ratio: Math.max(0.1, Math.min(3.0, ratio)), // Sanity bounds
      confidence: confidence,
      method: 'reference_calibration',
      referenceUsed: refData.id,
      realWorldSize: realWorldSize,
      pixelSize: pixelSize
    };
  }

  // Add new reference object
  addReference(referenceData) {
    const id = referenceData.id || referenceData.name.toLowerCase().replace(/\s+/g, '-');
    
    // Ensure required fields
    const reference = {
      id: id,
      name: referenceData.name,
      aliases: referenceData.aliases || [referenceData.name.toLowerCase()],
      standardSize: referenceData.standardSize,
      variations: referenceData.variations || {},
      reliability: referenceData.reliability || 0.7,
      commonness: referenceData.commonness || 0.5,
      identificationFeatures: referenceData.identificationFeatures || [],
      estimationAccuracy: referenceData.estimationAccuracy || 0.7,
      notes: referenceData.notes || '',
      dateAdded: new Date().toISOString()
    };

    this.references[id] = reference;
    return id;
  }

  // Get all reference objects
  getAllReferences() {
    return Object.values(this.references);
  }

  // Get references by commonality
  getMostCommonReferences(limit = 5) {
    return Object.values(this.references)
      .sort((a, b) => b.commonness - a.commonness)
      .slice(0, limit);
  }

  // Get references by reliability
  getMostReliableReferences(limit = 5) {
    return Object.values(this.references)
      .sort((a, b) => b.reliability - a.reliability)
      .slice(0, limit);
  }
}

module.exports = new ReferenceDatabase();