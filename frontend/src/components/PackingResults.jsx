import { useState } from 'react';

const PackingResults = ({ recommendations, selectedLuggage, onStartOver, onBack }) => {
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [savedMethods, setSavedMethods] = useState(new Set());

  const toggleMethodExpansion = (methodId) => {
    setExpandedMethod(expandedMethod === methodId ? null : methodId);
  };

  const toggleSaveMethod = (methodId) => {
    setSavedMethods(prev => {
      const newSet = new Set(prev);
      if (newSet.has(methodId)) {
        newSet.delete(methodId);
      } else {
        newSet.add(methodId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      Easy: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Hard: 'bg-red-100 text-red-800'
    };
    return colorMap[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getEfficiencyStars = (rating) => {
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
          Back to item confirmation
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Packing Recommendations</h1>
        <p className="text-gray-600">Optimized packing methods for your items and luggage</p>
      </div>

      {selectedLuggage && (
        <div className="card p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 100 100">
                <rect x="15" y="25" width="70" height="50" rx="6" fill="currentColor" opacity="0.8"/>
                <rect x="20" y="30" width="60" height="10" rx="3" fill="white"/>
                <rect x="45" y="15" width="10" height="15" rx="2" fill="currentColor"/>
                <circle cx="25" cy="80" r="4" fill="currentColor"/>
                <circle cx="75" cy="80" r="4" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{selectedLuggage.name}</h3>
              <p className="text-sm text-gray-600">
                {selectedLuggage.dimensions} • {selectedLuggage.volume}
              </p>
            </div>
          </div>
        </div>
      )}

      {!recommendations?.recommended_methods || recommendations.recommended_methods.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">No packing recommendations available.</p>
          <button onClick={onStartOver} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recommended Methods ({recommendations.recommended_methods.length})
            </h2>
            {savedMethods.size > 0 && (
              <span className="text-sm text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                {savedMethods.size} saved
              </span>
            )}
          </div>

          {recommendations.recommended_methods.map((method) => (
            <div key={method.id} className="card p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{method.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(method.difficulty)}`}>
                        {method.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{method.description}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          {getEfficiencyStars(method.efficiency_rating)}
                          <span className="text-gray-600 ml-1">({method.efficiency_rating})</span>
                        </div>
                        <p className="text-gray-500">Efficiency</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{method.time_minutes} min</p>
                        <p className="text-gray-500">Time needed</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{method.space_savings}%</p>
                        <p className="text-gray-500">Space saved</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{method.estimated_space_used}</p>
                        <p className="text-gray-500">Luggage used</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleSaveMethod(method.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      savedMethods.has(method.id)
                        ? 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={savedMethods.has(method.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {method.applicable_items && method.applicable_items.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Your applicable items ({method.applicable_items.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {method.applicable_items.map((item, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <button
                    onClick={() => toggleMethodExpansion(method.id)}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <span>
                      {expandedMethod === method.id ? 'Hide' : 'Show'} step-by-step instructions
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${expandedMethod === method.id ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedMethod === method.id && method.instructions && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Step-by-step instructions:</h4>
                      <ol className="space-y-2">
                        {method.instructions.map((instruction, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white text-sm rounded-full flex items-center justify-center font-medium">
                              {instruction.step}
                            </span>
                            <p className="text-gray-700">{instruction.text}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        {savedMethods.size > 0 && (
          <button className="btn-primary">
            Export Saved Methods ({savedMethods.size})
          </button>
        )}
        <button onClick={onStartOver} className="btn-secondary">
          Start Over
        </button>
      </div>
    </div>
  );
};

export default PackingResults;