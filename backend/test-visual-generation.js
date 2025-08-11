require('dotenv').config();
const comprehensiveVisualGenerator = require('./src/comprehensiveVisualGenerator');
const fs = require('fs');
const path = require('path');

async function testVisualGeneration() {
  console.log('Testing comprehensive visual generation...');
  
  // Create a mock image file for testing
  const mockImageFile = {
    buffer: Buffer.from('fake-image-data'), // Mock buffer
    mimetype: 'image/jpeg',
    originalname: 'test-image.jpg',
    size: 1024
  };
  
  const luggageType = 'carryon';
  const options = {
    travelType: 'leisure',
    sessionId: `test-session-${Date.now()}`
  };
  
  try {
    console.log('Starting comprehensive generation...');
    const result = await comprehensiveVisualGenerator.generateComprehensivePackingVisuals(
      mockImageFile,
      luggageType,
      options
    );
    
    if (result.success) {
      console.log('✅ Visual generation test successful!');
      console.log('Generated layouts:', result.packingLayouts?.length || 0);
      console.log('Generation steps:', result.generationSteps?.length || 0);
      console.log('Session ID:', result.sessionId);
      
      // Check if images were generated
      if (result.packingLayouts) {
        result.packingLayouts.forEach((layout, index) => {
          console.log(`Layout ${index + 1}: ${layout.name} - ${layout.generated ? '✅' : '❌'}`);
          if (layout.error) {
            console.log(`  Error: ${layout.error}`);
          }
        });
      }
      
    } else {
      console.error('❌ Visual generation failed:', result.error);
      console.log('Generation steps:', result.generationSteps);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testVisualGeneration();