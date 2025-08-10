import { useState, useEffect } from 'react';
import { ITEM_CATEGORIES } from '../utils/constants';

const ItemConfirmation = ({ detectedItems, imageUrl, onItemsConfirmed, onBack }) => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (detectedItems?.items) {
      setItems(detectedItems.items.map((item, index) => ({
        ...item,
        id: `item-${index}`,
        tempName: item.name,
        tempCategory: item.category
      })));
    }
  }, [detectedItems]);

  const handleEditItem = (itemId) => {
    setEditingItem(itemId);
  };

  const handleSaveEdit = (itemId) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          name: item.tempName,
          category: item.tempCategory
        };
      }
      return item;
    }));
    setEditingItem(null);
  };

  const handleCancelEdit = (itemId) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          tempName: item.name,
          tempCategory: item.category
        };
      }
      return item;
    }));
    setEditingItem(null);
  };

  const handleNameChange = (itemId, newName) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, tempName: newName };
      }
      return item;
    }));
  };

  const handleCategoryChange = (itemId, newCategory) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, tempCategory: newCategory };
      }
      return item;
    }));
  };

  const handleRemoveItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: 'New Item',
      tempName: 'New Item',
      category: 'clothing',
      tempCategory: 'clothing',
      confidence: 1.0,
      estimatedSize: 'medium',
      quantity: 1
    };
    setItems(prev => [...prev, newItem]);
    setEditingItem(newItem.id);
  };

  const handleConfirmItems = () => {
    const confirmedItems = items.map(({ id, tempName, tempCategory, ...rest }) => ({
      ...rest,
      name: tempName,
      category: tempCategory
    }));
    onItemsConfirmed(confirmedItems);
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      clothing: 'bg-blue-100 text-blue-800',
      electronics: 'bg-purple-100 text-purple-800',
      toiletries: 'bg-green-100 text-green-800',
      shoes: 'bg-yellow-100 text-yellow-800',
      accessories: 'bg-pink-100 text-pink-800',
      books: 'bg-indigo-100 text-indigo-800',
      documents: 'bg-gray-100 text-gray-800'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
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
          Back to photo upload
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Items</h1>
        <p className="text-gray-600">Review and edit the detected items before getting packing recommendations</p>
      </div>

      {imageUrl && (
        <div className="card p-4">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 mb-4">
            <img
              src={imageUrl}
              alt="Your items"
              className="w-full h-full object-contain"
            />
          </div>
          
          {detectedItems?.referenceFound && (
            <div className="flex items-center justify-center space-x-2 text-success-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">
                Reference object detected ({detectedItems.referenceType})
              </span>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Detected Items ({items.length})
          </h2>
          <button
            onClick={handleAddItem}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Item
          </button>
        </div>

        {items.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">No items detected in your photo.</p>
            <button onClick={handleAddItem} className="btn-primary">
              Add Item Manually
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 relative group">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="space-y-3">
                  {editingItem === item.id ? (
                    <>
                      <input
                        type="text"
                        value={item.tempName}
                        onChange={(e) => handleNameChange(item.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Item name"
                      />
                      <select
                        value={item.tempCategory}
                        onChange={(e) => handleCategoryChange(item.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {ITEM_CATEGORIES.map(category => (
                          <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </option>
                        ))}
                      </select>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="flex-1 px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelEdit(item.id)}
                          className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <div className="mt-1 flex items-center justify-between">
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                          {item.confidence && (
                            <span className="text-xs text-gray-500">
                              {Math.round(item.confidence * 100)}% confident
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Size: {item.estimatedSize}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <button
                        onClick={() => handleEditItem(item.id)}
                        className="w-full px-3 py-1 text-primary-600 hover:text-primary-700 text-sm font-medium border border-primary-200 rounded-md hover:bg-primary-50 transition-colors"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="space-y-6 pt-4">
          {/* Feature Selection */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Packing Experience</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Traditional Recommendations */}
              <div className="relative">
                <button
                  onClick={() => onItemsConfirmed(items.map(({ id, tempName, tempCategory, ...rest }) => ({
                    ...rest,
                    name: tempName,
                    category: tempCategory
                  })), false)}
                  className="w-full p-6 text-left border-2 border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                        Traditional Recommendations
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Get text-based packing methods and step-by-step instructions
                      </p>
                      <div className="flex items-center mt-3 text-xs text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Fast • Free
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Visual AI Packing */}
              <div className="relative">
                <button
                  onClick={() => onItemsConfirmed(items.map(({ id, tempName, tempCategory, ...rest }) => ({
                    ...rest,
                    name: tempName,
                    category: tempCategory
                  })), true)}
                  className="w-full p-6 text-left border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-purple-50 rounded-lg hover:border-primary-300 hover:from-primary-100 hover:to-purple-100 transition-all group relative"
                >
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      ✨ AI Powered
                    </span>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-pink-200 transition-colors">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                        Visual AI Packing
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Get AI-generated images showing 5 optimal packing layouts
                      </p>
                      <div className="flex items-center mt-3 text-xs text-purple-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Advanced • DALL-E 3 • Size Estimation
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">Visual AI Packing Features</p>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Real-world size estimation using reference objects</li>
                    <li>• 5 different packing strategies with AI-generated visuals</li>
                    <li>• 3D simulation with optimal item placement</li>
                    <li>• Detailed labeling and instructions for each layout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemConfirmation;