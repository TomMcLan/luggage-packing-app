import { useState, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
import { apiService } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const PhotoUpload = ({ onItemsDetected, onBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const { loading, error, execute, clearError } = useApi();

  const handleFileSelect = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      clearError();
    }
  }, [clearError]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDetectItems = async () => {
    if (!selectedFile) return;

    try {
      const result = await execute(() => apiService.detectItems(selectedFile));
      onItemsDetected(result, selectedFile);
    } catch (err) {
      console.error('Error detecting items:', err);
    }
  };

  const handleRetake = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    clearError();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to luggage selection
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Items</h1>
        <p className="text-gray-600">Take a photo of the items you want to pack</p>
      </div>

      <ErrorMessage message={error} onRetry={handleDetectItems} onDismiss={clearError} />

      {!previewUrl ? (
        <div>
          <div
            className={`card p-8 border-2 border-dashed transition-colors duration-200 ${
              dragOver
                ? 'border-primary-400 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your photo here or click to browse
                </p>
                <p className="text-gray-600 mb-4">
                  Supports JPG, PNG up to 10MB
                </p>
                <label htmlFor="file-upload" className="btn-primary cursor-pointer inline-block">
                  Choose File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="card p-6 mt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-warning-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">For best results:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Place a credit card, coin, or water bottle next to your items for size reference</li>
                  <li>• Lay items flat on a clean, contrasting background</li>
                  <li>• Ensure good lighting and clear visibility of all items</li>
                  <li>• Take photo from directly above for best item detection</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="card p-4">
              <div className="flex items-center space-x-2 text-success-600 mb-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Good Example</span>
              </div>
              <p className="text-xs text-gray-600">Items spread out with credit card for scale, good lighting</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center space-x-2 text-error-600 mb-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10 11.414l1.293-1.293a1 1 0 001.414 1.414L10 13.828l-1.293-1.293a1 1 0 00-1.414 1.414L10 14.242l1.293-1.293a1 1 0 001.414 1.414L10 16.656z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Avoid</span>
              </div>
              <p className="text-xs text-gray-600">Items piled up, no reference object, poor lighting</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card p-4">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 flex justify-center space-x-4">
              <button onClick={handleRetake} className="btn-secondary">
                Retake Photo
              </button>
              <button
                onClick={handleDetectItems}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Detecting Items...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>

          {loading && (
            <LoadingSpinner size="lg" text="AI is analyzing your photo and detecting items..." />
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;