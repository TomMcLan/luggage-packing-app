const cloudinaryService = require('./cloudinary');
const fs = require('fs').promises;
const path = require('path');

// Image Storage Service for managing uploaded images and references
class ImageStorageService {
  constructor() {
    this.storageProvider = 'cloudinary'; // Can be expanded to support multiple providers
    this.localStoragePath = path.join(__dirname, '../storage/images');
    this.ensureStorageDirectory();
  }

  async ensureStorageDirectory() {
    try {
      await fs.access(this.localStoragePath);
    } catch (error) {
      await fs.mkdir(this.localStoragePath, { recursive: true });
    }
  }

  // Store original uploaded image with metadata
  async storeOriginalImage(imageBuffer, metadata = {}) {
    try {
      const timestamp = Date.now();
      const sessionId = metadata.sessionId || `session-${timestamp}`;
      
      // Upload to Cloudinary with specific folder structure
      const uploadResult = await cloudinaryService.uploadImage(imageBuffer, {
        folder: `luggage-packing/original-uploads/${sessionId}`,
        public_id: `original-${timestamp}`,
        resource_type: 'image',
        tags: ['original-upload', 'packing-analysis']
      });

      // Store metadata
      const imageRecord = {
        id: uploadResult.public_id,
        sessionId: sessionId,
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        uploadedAt: new Date().toISOString(),
        metadata: {
          ...metadata,
          originalFilename: metadata.filename,
          userAgent: metadata.userAgent,
          ipAddress: metadata.ipAddress
        },
        type: 'original-upload',
        status: 'stored'
      };

      // Save metadata locally for reference
      await this.saveImageMetadata(imageRecord);

      return {
        success: true,
        imageId: imageRecord.id,
        imageUrl: imageRecord.url,
        secureUrl: imageRecord.secureUrl,
        sessionId: sessionId,
        metadata: imageRecord
      };

    } catch (error) {
      console.error('Error storing original image:', error);
      return {
        success: false,
        error: error.message,
        imageId: null,
        imageUrl: null
      };
    }
  }

  // Store generated packing visualization images
  async storeGeneratedImage(imageUrl, generationData = {}) {
    try {
      const timestamp = Date.now();
      const sessionId = generationData.sessionId || `session-${timestamp}`;
      
      // Download generated image from URL (e.g., DALL-E)
      const response = await fetch(imageUrl);
      const imageBuffer = Buffer.from(await response.arrayBuffer());

      // Upload to Cloudinary in generated images folder
      const uploadResult = await cloudinaryService.uploadImage(imageBuffer, {
        folder: `luggage-packing/generated-visuals/${sessionId}`,
        public_id: `generated-${generationData.method || 'packing'}-${timestamp}`,
        resource_type: 'image',
        tags: ['generated-visual', 'packing-layout', generationData.method || 'unknown']
      });

      const imageRecord = {
        id: uploadResult.public_id,
        sessionId: sessionId,
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        generatedAt: new Date().toISOString(),
        originalImageUrl: imageUrl,
        generationData: {
          ...generationData,
          method: generationData.method || 'unknown',
          luggageType: generationData.luggageType,
          itemCount: generationData.itemCount,
          aiModel: generationData.aiModel || 'google-imagen'
        },
        type: 'generated-visual',
        status: 'stored'
      };

      await this.saveImageMetadata(imageRecord);

      return {
        success: true,
        imageId: imageRecord.id,
        imageUrl: imageRecord.url,
        secureUrl: imageRecord.secureUrl,
        metadata: imageRecord
      };

    } catch (error) {
      console.error('Error storing generated image:', error);
      return {
        success: false,
        error: error.message,
        imageId: null,
        imageUrl: null
      };
    }
  }

  // Save image metadata to local storage for quick access
  async saveImageMetadata(imageRecord) {
    try {
      const metadataFile = path.join(this.localStoragePath, `${imageRecord.id}.json`);
      await fs.writeFile(metadataFile, JSON.stringify(imageRecord, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving image metadata:', error);
      return false;
    }
  }

  // Get image metadata by ID
  async getImageMetadata(imageId) {
    try {
      const metadataFile = path.join(this.localStoragePath, `${imageId}.json`);
      const metadata = await fs.readFile(metadataFile, 'utf8');
      return JSON.parse(metadata);
    } catch (error) {
      console.error('Error reading image metadata:', error);
      return null;
    }
  }

  // Get all images for a session
  async getSessionImages(sessionId) {
    try {
      const files = await fs.readdir(this.localStoragePath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      const sessionImages = [];
      
      for (const file of jsonFiles) {
        try {
          const metadata = await this.getImageMetadata(file.replace('.json', ''));
          if (metadata && metadata.sessionId === sessionId) {
            sessionImages.push(metadata);
          }
        } catch (error) {
          console.error(`Error reading metadata from ${file}:`, error);
        }
      }

      return sessionImages.sort((a, b) => 
        new Date(a.uploadedAt || a.generatedAt) - new Date(b.uploadedAt || b.generatedAt)
      );

    } catch (error) {
      console.error('Error getting session images:', error);
      return [];
    }
  }

  // Create image reference for DALL-E generation
  createImageReference(originalImageUrl, analysisData = {}) {
    return {
      originalImageUrl: originalImageUrl,
      analysisData: analysisData,
      referenceCreatedAt: new Date().toISOString(),
      usage: 'ai-image-reference'
    };
  }

  // Generate comprehensive image prompt with reference
  async generateImagePromptWithReference(originalImageUrl, packingRequest = {}) {
    const {
      luggageType = 'carryon',
      detectedItems = [],
      organizationTemplate = null,
      packingMethod = 'optimized'
    } = packingRequest;

    // Get container information
    const containerDatabase = require('./containerDatabase');
    const container = containerDatabase.getContainer(luggageType);
    
    // Get organization template if specified
    const organizationTemplates = require('./organizationTemplates');
    const template = organizationTemplate ? 
      organizationTemplates.getTemplate(luggageType, organizationTemplate) : 
      organizationTemplates.recommendTemplate(luggageType, detectedItems);

    // Create detailed prompt based on your requirements
    const prompt = this.buildDetailedPackingPrompt(
      originalImageUrl,
      container,
      template,
      detectedItems,
      packingMethod
    );

    return {
      prompt: prompt,
      reference: {
        originalImageUrl: originalImageUrl,
        container: container,
        template: template,
        items: detectedItems,
        method: packingMethod
      }
    };
  }

  buildDetailedPackingPrompt(originalImageUrl, container, template, items, method) {
    const containerDesc = container ? container.visualDescription : 'luggage container';
    const itemsList = items.map(item => item.name).join(', ');
    
    let prompt = `Professional packing photography showing all items from the reference photo expertly organized inside a ${containerDesc}.

REFERENCE: Use the uploaded photo as the source of truth for all items. Every visible item in the reference photo should appear in the final packed luggage.

CONTAINER: ${container ? `${container.name} with internal dimensions ${container.internalDimensions?.width}x${container.internalDimensions?.height}x${container.internalDimensions?.depth}mm` : 'Selected luggage container'}

ITEMS TO PACK: ${itemsList || 'All items visible in reference photo'}

ORGANIZATION METHOD: ${method}`;

    if (template) {
      prompt += `\n\nORGANIZATION TEMPLATE: ${template.name} - ${template.description}

PACKING ZONES:`;
      template.zones.forEach(zone => {
        prompt += `\n- ${zone.name}: ${zone.description} (${zone.recommendedItems.join(', ')})`;
      });

      prompt += `\n\nPACKING ORDER:`;
      template.packingOrder.forEach((step, index) => {
        prompt += `\n${index + 1}. ${step}`;
      });
    }

    prompt += `\n\nVISUAL REQUIREMENTS:
- Top-down view of open luggage showing all packed items
- Each item from reference photo clearly visible and identifiable
- Professional lighting with no shadows obscuring items
- Realistic proportions and spatial relationships
- Items organized according to specified template/method
- Clean, organized appearance suitable for packing tutorial

STYLE: Product photography, high quality, sharp focus, neutral background, professional presentation.`;

    return prompt;
  }

  // Clean up old images (maintenance function)
  async cleanupOldImages(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const files = await fs.readdir(this.localStoragePath);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      let cleanedCount = 0;

      for (const file of jsonFiles) {
        try {
          const metadata = await this.getImageMetadata(file.replace('.json', ''));
          const imageDate = new Date(metadata.uploadedAt || metadata.generatedAt);
          
          if (imageDate < cutoffDate) {
            // Delete from Cloudinary
            try {
              await cloudinaryService.deleteImage(metadata.cloudinaryId);
            } catch (cloudinaryError) {
              console.error('Error deleting from Cloudinary:', cloudinaryError);
            }
            
            // Delete local metadata
            await fs.unlink(path.join(this.localStoragePath, file));
            cleanedCount++;
          }
        } catch (error) {
          console.error(`Error processing ${file} for cleanup:`, error);
        }
      }

      return {
        success: true,
        cleanedCount: cleanedCount,
        message: `Cleaned up ${cleanedCount} old images`
      };

    } catch (error) {
      console.error('Error during image cleanup:', error);
      return {
        success: false,
        error: error.message,
        cleanedCount: 0
      };
    }
  }
}

module.exports = new ImageStorageService();