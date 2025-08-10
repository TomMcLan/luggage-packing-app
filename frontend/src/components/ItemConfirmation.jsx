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
        <div className="flex justify-center pt-4">
          <button
            onClick={handleConfirmItems}
            className="btn-primary px-8"
          >
            Get Packing Recommendations ({items.length} items)
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemConfirmation;