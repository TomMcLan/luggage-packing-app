import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { apiService } from '../utils/api';

const VisualPackingResults = ({ 
  visualResults, 
  traditionalRecommendations,
  selectedLuggage, 
  originalImageFile, 
  confirmedItems,
  onStartOver, 
  onBack, 
  onVisualResults 
}) => {
  const [selectedLayout, setSelectedLayout] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [savedLayouts, setSavedLayouts] = useState(new Set());
  const [internalResults, setInternalResults] = useState(visualResults);
  const [progress, setProgress] = useState(0);
  
  const { loading, error, execute } = useApi();

  // Load visual packing results if not provided
  useEffect(() => {
    if (!internalResults && originalImageFile && selectedLuggage) {
      loadVisualPackingResults();
    }
  }, [internalResults, originalImageFile, selectedLuggage]);

  // Simulate progress bar during loading
  useEffect(() => {
    if (loading) {
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            return 95; // Stay at 95% until actual completion
          }
          // Use smaller, controlled increments to prevent overflow
          const increment = Math.random() * 5 + 2; // Random 2-7% increments
          const newProgress = prev + increment;
          return Math.min(newProgress, 95); // Cap at 95% max
        });
      }, 800); // Slightly slower for more realistic feel

      return () => clearInterval(progressInterval);
    } else if (!loading && internalResults) {
      // Small delay then smoothly animate to 100% when complete
      const completeTimeout = setTimeout(() => {
        setProgress(100);
      }, 200);
      return () => clearTimeout(completeTimeout);
    }
  }, [loading, internalResults]);

  const loadVisualPackingResults = async () => {
    try {
      const result = await execute(() => 
        apiService.generateVisualPacking(originalImageFile, selectedLuggage.id)
      );
      setInternalResults(result);
      if (onVisualResults) {
        onVisualResults(result);
      }
    } catch (err) {
      console.error('Error loading visual packing results:', err);
    }
  };

  const toggleSaveLayout = (layoutId) => {
    setSavedLayouts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layoutId)) {
        newSet.delete(layoutId);
      } else {
        newSet.add(layoutId);
      }
      return newSet;
    });
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return 'text-green-600 bg-green-100';
    if (efficiency >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getEfficiencyStars = (efficiency) => {
    const rating = efficiency / 20; // Convert to 5-star scale
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" viewBox="0 0 20 20">
          <path fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    
    return stars;
  };

  // Show loading state
  if (loading || (!internalResults && originalImageFile)) {
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
            Back to photo upload
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Visual Packing Generator</h1>
          <p className="text-gray-600">Creating optimized packing layouts...</p>
        </div>

        <div className="card p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Generating AI Visuals</span>
              <span className="text-sm text-gray-600">{Math.min(Math.round(progress), 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Loading Animation and Status */}
          <div className="text-center">
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Creating Your Packing Visuals</h3>
              <div className="space-y-1 text-sm text-gray-600">
                {progress < 20 && <p>🧠 Analyzing your items and luggage size...</p>}
                {progress >= 20 && progress < 40 && <p>📐 Calculating optimal space utilization...</p>}
                {progress >= 40 && progress < 60 && <p>🎨 Generating AI-powered packing layouts...</p>}
                {progress >= 60 && progress < 80 && <p>✨ Creating professional packing visuals...</p>}
                {progress >= 80 && progress < 95 && <p>🔧 Finalizing your personalized results...</p>}
                {progress >= 95 && <p>🎉 Almost ready! Preparing your packing strategies...</p>}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-medium">✨ AI Magic in Progress:</span> We're creating 2-3 different packing strategies with GPT-Image-1 professional-quality visuals tailored specifically for your items and {selectedLuggage?.name.toLowerCase() || 'luggage'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
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
            Back to photo upload
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Visual Packing Results</h1>
        </div>

        <div className="card p-8 text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Failed to generate visual packing results.</p>
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button onClick={loadVisualPackingResults} className="btn-primary mr-2">
              Try Again
            </button>
            <button onClick={onStartOver} className="btn-secondary">
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show no results state
  if (!internalResults?.packing_visuals || internalResults.packing_visuals.length === 0) {
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
            Back to photo upload
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Visual Packing Results</h1>
        </div>

        <div className="card p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">No visual packing results available.</p>
          <button onClick={onStartOver} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentLayout = internalResults.packing_visuals[selectedLayout];

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
          Back to photo upload
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">AI-Generated Packing Layouts</h1>
        <p className="text-gray-600">2-3 optimal packing strategies visualized with AI</p>
      </div>

      {/* Layout Selection Tabs */}
      <div className="flex overflow-x-auto space-x-1 p-1 bg-gray-100 rounded-lg">
        {internalResults.packing_visuals.map((layout, index) => (
          <button
            key={layout.id}
            onClick={() => setSelectedLayout(index)}
            className={`flex-shrink-0 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedLayout === index
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {layout.method}
          </button>
        ))}
      </div>

      {/* Main Visual Display */}
      <div className="card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{currentLayout.method}</h2>
            <p className="text-gray-600 mt-1">{currentLayout.description}</p>
          </div>
          
          <button
            onClick={() => toggleSaveLayout(currentLayout.id)}
            className={`p-2 rounded-lg transition-colors ${
              savedLayouts.has(currentLayout.id)
                ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill={savedLayouts.has(currentLayout.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* AI Generated Image */}
        <div className="relative mb-6">
          {currentLayout.imageUrl ? (
            <div className="relative">
              <img
                src={currentLayout.imageUrl}
                alt={`${currentLayout.method} packing layout`}
                className="w-full max-w-lg mx-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden w-full max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">Image failed to load</p>
              </div>
              
              {/* Toggle Labels Button */}
              <button
                onClick={() => setShowLabels(!showLabels)}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm transition-colors"
              >
                {showLabels ? 'Hide Labels' : 'Show Labels'}
              </button>
            </div>
          ) : (
            <div className="w-full max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 mb-2">Image generation failed</p>
              <p className="text-sm text-gray-400">Layout instructions still available below</p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getEfficiencyColor(currentLayout.spaceEfficiency)}`}>
              {currentLayout.spaceEfficiency}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Space Efficiency</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              {getEfficiencyStars(currentLayout.spaceEfficiency)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Overall Rating</p>
          </div>
          
          <div className="text-center">
            <p className="font-semibold text-gray-900">{currentLayout.itemCount}</p>
            <p className="text-xs text-gray-500 mt-1">Items Packed</p>
          </div>
          
          <div className="text-center">
            <p className="font-semibold text-gray-900">{internalResults.packing_statistics?.luggage_type}</p>
            <p className="text-xs text-gray-500 mt-1">Luggage Type</p>
          </div>
        </div>

        {/* Item Labels (if enabled) */}
        {showLabels && currentLayout.labels && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Item Labels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentLayout.labels.map((label) => (
                <div key={label.number} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-sm rounded-full flex items-center justify-center font-medium">
                    {label.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{label.itemName}</p>
                    <p className="text-sm text-gray-500">{label.dimensions} • {label.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        {currentLayout.instructions && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Packing Instructions</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ol className="space-y-2">
                {currentLayout.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-sm rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Benefits & Reasoning */}
        <div className="grid md:grid-cols-2 gap-6">
          {currentLayout.benefits && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Benefits</h3>
              <ul className="space-y-2">
                {currentLayout.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentLayout.reasoning && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Why This Works</h3>
              <ul className="space-y-2">
                {currentLayout.reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Overall Statistics */}
      {internalResults.packing_statistics && (
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Packing Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{internalResults.packing_statistics.total_items}</p>
              <p className="text-sm text-gray-500">Total Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{internalResults.packing_statistics.efficiency}%</p>
              <p className="text-sm text-gray-500">Pack Efficiency</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{internalResults.packing_statistics.totalItemVolume}L</p>
              <p className="text-sm text-gray-500">Item Volume</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{internalResults.packing_statistics.remainingSpace}L</p>
              <p className="text-sm text-gray-500">Remaining Space</p>
            </div>
          </div>
        </div>
      )}

      {/* Traditional Recommendations */}
      {traditionalRecommendations && (
        <div className="card p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Traditional Packing Recommendations</h3>
          </div>
          
          {traditionalRecommendations.packing_methods && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Recommended Packing Methods:</h4>
              <div className="grid gap-4 md:grid-cols-2">
                {traditionalRecommendations.packing_methods.map((method, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-gray-900 mb-2">{method.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                    {method.steps && (
                      <ol className="text-sm text-gray-700 space-y-1">
                        {method.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start space-x-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {stepIndex + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {traditionalRecommendations.tips && (
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Pro Tips:</h4>
              <div className="grid gap-3 md:grid-cols-2">
                {traditionalRecommendations.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2 bg-white p-3 rounded-lg border border-blue-200">
                    <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        {savedLayouts.size > 0 && (
          <button className="btn-primary">
            Export Saved Layouts ({savedLayouts.size})
          </button>
        )}
        <button onClick={onStartOver} className="btn-secondary">
          Start Over
        </button>
      </div>
    </div>
  );
};

export default VisualPackingResults;