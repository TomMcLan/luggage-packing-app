require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const multer = require('multer');

// Import services
const db = require('./src/database');
const visionService = require('./src/vision');
const recommendationEngine = require('./src/recommendations');
const cloudinaryService = require('./src/cloudinary');
const visualGenerator = require('./src/visualGenerator');
const enhancedVision = require('./src/enhancedVision');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Request logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limiting for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 AI requests per minute
  message: 'Too many AI requests, please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'luggage-packing-backend'
  });
});

// GET /api/luggage - Get all luggage sizes
app.get('/api/luggage', async (req, res) => {
  try {
    const luggageSizes = await db.getLuggageSizes();
    res.json({ 
      success: true, 
      luggage_sizes: luggageSizes 
    });
  } catch (error) {
    console.error('Error fetching luggage sizes:', error);
    res.status(500).json({ 
      error: 'Failed to fetch luggage sizes',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/luggage/select - Select luggage size
app.post('/api/luggage/select', async (req, res) => {
  try {
    const { size } = req.body;
    
    if (!size) {
      return res.status(400).json({ error: 'Luggage size is required' });
    }

    const luggage = await db.getLuggageById(size);
    
    if (!luggage) {
      return res.status(404).json({ error: 'Luggage size not found' });
    }
    
    res.json({ success: true, luggage });
  } catch (error) {
    console.error('Error selecting luggage:', error);
    res.status(500).json({ 
      error: 'Failed to select luggage',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/items/detect - Detect items in image using Enhanced AI
app.post('/api/items/detect', aiLimiter, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary for storage
    const uploadResult = await cloudinaryService.uploadImage(req.file.buffer);

    // Convert to base64 for OpenAI Vision
    const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Use enhanced vision service for detailed item detection with size estimation
    console.log('Starting enhanced vision detection...');
    const detection = await enhancedVision.detectItemsWithSizeEstimation(imageBase64);
    console.log('Detection completed, items found:', detection.items?.length || 0);
    
    // Transform enhanced vision format to match existing frontend expectations
    const compatibleResponse = {
      success: true,
      items: detection.items || [],
      referenceFound: detection.referenceObject?.found || false,
      referenceType: detection.referenceObject?.type || 'none',
      image_url: uploadResult.url,
      image_id: uploadResult.public_id,
      // Include enhanced data for advanced features
      enhancedData: {
        referenceObject: detection.referenceObject,
        imageAnalysis: detection.imageAnalysis,
        boundingBoxes: detection.items?.map(item => item.boundingBox) || []
      }
    };
    
    res.json(compatibleResponse);
  } catch (error) {
    console.error('Error detecting items:', error);
    
    // Clean up uploaded image if detection failed
    if (req.uploadResult?.public_id) {
      try {
        await cloudinaryService.deleteImage(req.uploadResult.public_id);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded image:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to detect items in image',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/generate-packing-visuals - Generate visual packing with AI
app.post('/api/generate-packing-visuals', aiLimiter, upload.single('image'), async (req, res) => {
  try {
    const { luggage_size } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    if (!luggage_size) {
      return res.status(400).json({ error: 'Luggage size is required' });
    }

    // Upload to Cloudinary for storage
    const uploadResult = await cloudinaryService.uploadImage(req.file.buffer);
    
    // Convert to base64 for OpenAI Vision
    const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Use enhanced vision service for detailed item detection with size estimation
    const detectionResult = await enhancedVision.detectItemsWithSizeEstimation(imageBase64);
    
    if (!detectionResult.items || detectionResult.items.length === 0) {
      return res.status(400).json({ 
        error: 'No items detected in the image',
        details: 'Please ensure your photo shows clear items to pack'
      });
    }

    // Generate visual packing layouts with AI-generated images
    const visualResults = await visualGenerator.generatePackingVisuals(
      detectionResult.items,
      luggage_size,
      detectionResult.referenceObject,
      uploadResult.url
    );
    
    res.json({
      success: true,
      ...visualResults,
      image_analysis: detectionResult.imageAnalysis,
      upload_info: {
        image_url: uploadResult.url,
        image_id: uploadResult.public_id
      }
    });
    
  } catch (error) {
    console.error('Error generating packing visuals:', error);
    
    // Clean up uploaded image if generation failed
    if (req.uploadResult?.public_id) {
      try {
        await cloudinaryService.deleteImage(req.uploadResult.public_id);
      } catch (cleanupError) {
        console.error('Failed to cleanup uploaded image:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      error: 'Failed to generate packing visuals',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/recommendations - Get packing recommendations
app.post('/api/recommendations', async (req, res) => {
  try {
    const { items, luggage_size, session_id } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and cannot be empty' });
    }
    
    if (!luggage_size) {
      return res.status(400).json({ error: 'Luggage size is required' });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.name || !item.category) {
        return res.status(400).json({ error: 'Each item must have a name and category' });
      }
    }

    // Get recommendations
    const recommendations = await recommendationEngine.recommendPackingMethods(items, luggage_size);
    
    // Generate session ID if not provided
    const finalSessionId = session_id || recommendationEngine.generateSessionId();
    
    // Save session to database
    try {
      await db.saveUserSession({
        session_id: finalSessionId,
        luggage_size,
        detected_items: [],
        confirmed_items: items
      });
    } catch (dbError) {
      console.error('Failed to save user session:', dbError);
      // Continue with response even if session save failed
    }
    
    res.json({ 
      success: true,
      recommended_methods: recommendations,
      session_id: finalSessionId,
      total_items: items.length
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to get packing recommendations',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/methods - Get all packing methods
app.get('/api/methods', async (req, res) => {
  try {
    const methods = await db.getPackingMethods();
    res.json({ 
      success: true, 
      methods 
    });
  } catch (error) {
    console.error('Error fetching packing methods:', error);
    res.status(500).json({ 
      error: 'Failed to fetch packing methods',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  // Handle multer file upload errors
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Only one file allowed.' });
    }
  }
  
  // Handle JSON parsing errors
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Handle 404 for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Initialize database connection and start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize database
    console.log('Initializing database connection...');
    await db.initialize();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();