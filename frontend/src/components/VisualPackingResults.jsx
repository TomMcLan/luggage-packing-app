import { useState } from 'react';

const VisualPackingResults = ({ visualResults, selectedLuggage, onStartOver, onBack }) => {
  const [selectedLayout, setSelectedLayout] = useState(0);
  const [showLabels, setShowLabels] = useState(true);
  const [savedLayouts, setSavedLayouts] = useState(new Set());

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

  if (!visualResults?.packing_visuals || visualResults.packing_visuals.length === 0) {
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

  const currentLayout = visualResults.packing_visuals[selectedLayout];

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
        <p className="text-gray-600">5 optimal packing strategies visualized with AI</p>
      </div>

      {/* Layout Selection Tabs */}
      <div className="flex overflow-x-auto space-x-1 p-1 bg-gray-100 rounded-lg">
        {visualResults.packing_visuals.map((layout, index) => (
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
            <p className="font-semibold text-gray-900">{visualResults.packing_statistics?.luggage_type}</p>
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
      {visualResults.packing_statistics && (
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Packing Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{visualResults.packing_statistics.total_items}</p>
              <p className="text-sm text-gray-500">Total Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{visualResults.packing_statistics.efficiency}%</p>
              <p className="text-sm text-gray-500">Pack Efficiency</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{visualResults.packing_statistics.totalItemVolume}L</p>
              <p className="text-sm text-gray-500">Item Volume</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{visualResults.packing_statistics.remainingSpace}L</p>
              <p className="text-sm text-gray-500">Remaining Space</p>
            </div>
          </div>
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