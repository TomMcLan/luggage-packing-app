import { useState } from 'react';
import { LUGGAGE_SIZES } from '../utils/constants';

const LuggageSelector = ({ onSelect, selectedId = null }) => {
  const [selected, setSelected] = useState(selectedId);

  const handleSelect = (luggage) => {
    setSelected(luggage.id);
    onSelect(luggage);
  };

  const getLuggageIcon = (id) => {
    const iconMap = {
      underseat: (
        <svg className="w-12 h-12 mx-auto text-primary-600" fill="currentColor" viewBox="0 0 100 100">
          <rect x="20" y="30" width="60" height="40" rx="4" fill="currentColor" opacity="0.8"/>
          <rect x="25" y="35" width="50" height="8" rx="2" fill="white"/>
          <circle cx="30" cy="75" r="3" fill="currentColor"/>
          <circle cx="70" cy="75" r="3" fill="currentColor"/>
        </svg>
      ),
      carryon: (
        <svg className="w-12 h-12 mx-auto text-primary-600" fill="currentColor" viewBox="0 0 100 100">
          <rect x="15" y="25" width="70" height="50" rx="6" fill="currentColor" opacity="0.8"/>
          <rect x="20" y="30" width="60" height="10" rx="3" fill="white"/>
          <rect x="45" y="15" width="10" height="15" rx="2" fill="currentColor"/>
          <circle cx="25" cy="80" r="4" fill="currentColor"/>
          <circle cx="75" cy="80" r="4" fill="currentColor"/>
        </svg>
      ),
      medium: (
        <svg className="w-12 h-12 mx-auto text-primary-600" fill="currentColor" viewBox="0 0 100 100">
          <rect x="10" y="20" width="80" height="60" rx="8" fill="currentColor" opacity="0.8"/>
          <rect x="15" y="25" width="70" height="12" rx="4" fill="white"/>
          <rect x="42" y="10" width="16" height="15" rx="3" fill="currentColor"/>
          <circle cx="25" cy="85" r="5" fill="currentColor"/>
          <circle cx="75" cy="85" r="5" fill="currentColor"/>
        </svg>
      ),
      large: (
        <svg className="w-12 h-12 mx-auto text-primary-600" fill="currentColor" viewBox="0 0 100 100">
          <rect x="5" y="15" width="90" height="70" rx="10" fill="currentColor" opacity="0.8"/>
          <rect x="10" y="20" width="80" height="15" rx="5" fill="white"/>
          <rect x="40" y="5" width="20" height="15" rx="4" fill="currentColor"/>
          <circle cx="25" cy="90" r="6" fill="currentColor"/>
          <circle cx="75" cy="90" r="6" fill="currentColor"/>
        </svg>
      )
    };
    return iconMap[id] || iconMap.carryon;
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Luggage</h1>
        <p className="text-gray-600">Select the luggage you'll be packing to get personalized recommendations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {LUGGAGE_SIZES.map((luggage) => (
          <div
            key={luggage.id}
            onClick={() => handleSelect(luggage)}
            className={`card card-hover cursor-pointer p-6 transition-all duration-200 ${
              selected === luggage.id
                ? 'ring-2 ring-primary-500 bg-primary-50 border-primary-200'
                : 'hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex-shrink-0">
                {getLuggageIcon(luggage.id)}
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className={`font-semibold text-lg ${
                  selected === luggage.id ? 'text-primary-700' : 'text-gray-900'
                }`}>
                  {luggage.name}
                </h3>
                
                <div className="space-y-1">
                  <p className={`text-sm font-medium ${
                    selected === luggage.id ? 'text-primary-600' : 'text-gray-700'
                  }`}>
                    {luggage.dimensions}
                  </p>
                  <p className={`text-sm ${
                    selected === luggage.id ? 'text-primary-600' : 'text-gray-600'
                  }`}>
                    {luggage.volume} • {luggage.description}
                  </p>
                </div>
              </div>

              {selected === luggage.id && (
                <div className="flex items-center justify-center w-6 h-6 bg-primary-600 rounded-full">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Selected: {LUGGAGE_SIZES.find(l => l.id === selected)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default LuggageSelector;