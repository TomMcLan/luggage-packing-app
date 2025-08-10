const cloudinary = require('cloudinary').v2;

class CloudinaryService {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary environment variables not configured. Image storage may not work.');
    }
  }

  async uploadImage(buffer, options = {}) {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'luggage-packing',
            format: 'jpg',
            quality: 'auto:good',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto:good' }
            ],
            ...options
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                bytes: result.bytes,
                format: result.format
              });
            }
          }
        ).end(buffer);
      });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to cloud storage');
    }
  }

  async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image from cloud storage');
    }
  }

  getOptimizedUrl(publicId, options = {}) {
    try {
      return cloudinary.url(publicId, {
        format: 'auto',
        quality: 'auto:good',
        crop: 'limit',
        width: 800,
        height: 800,
        ...options
      });
    } catch (error) {
      console.error('Cloudinary URL generation error:', error);
      return null;
    }
  }
}

module.exports = new CloudinaryService();