import { useState } from 'react';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';
import LuggageSelector from '../components/LuggageSelector';
import PhotoUpload from '../components/PhotoUpload';
import ItemConfirmation from '../components/ItemConfirmation';
import PackingResults from '../components/PackingResults';
import VisualPackingResults from '../components/VisualPackingResults';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApi } from '../hooks/useApi';
import { apiService } from '../utils/api';

const STEPS = {
  LUGGAGE_SELECTION: 'luggage-selection',
  PHOTO_UPLOAD: 'photo-upload',
  ITEM_CONFIRMATION: 'item-confirmation',
  PACKING_RESULTS: 'packing-results',
  VISUAL_PACKING: 'visual-packing'
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(STEPS.LUGGAGE_SELECTION);
  const [selectedLuggage, setSelectedLuggage] = useLocalStorage('selectedLuggage', null);
  const [detectedItems, setDetectedItems] = useState(null);
  const [confirmedItems, setConfirmedItems] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [visualResults, setVisualResults] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [originalImageFile, setOriginalImageFile] = useState(null);
  const [useVisualPacking, setUseVisualPacking] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  
  const { loading, error, execute } = useApi();

  const handleLuggageSelect = (luggage) => {
    setSelectedLuggage(luggage);
    setCurrentStep(STEPS.PHOTO_UPLOAD);
  };

  const handleItemsDetected = (result, originalFile) => {
    setDetectedItems(result);
    setImageUrl(result.image_url);
    setOriginalImageFile(originalFile);
    setCurrentStep(STEPS.ITEM_CONFIRMATION);
  };

  const handleVisualPackingGenerated = (result) => {
    setVisualResults(result);
    setCurrentStep(STEPS.VISUAL_PACKING);
  };

  const handleItemsConfirmed = async (items, generateVisuals = false) => {
    setConfirmedItems(items);
    setUseVisualPacking(generateVisuals);
    
    try {
      if (generateVisuals) {
        // Immediately redirect to visual packing results page with loading state
        setCurrentStep(STEPS.VISUAL_PACKING);
        // Results will be loaded by the VisualPackingResults component
      } else {
        // Use traditional recommendations API
        const result = await execute(() => 
          apiService.getRecommendations(items, selectedLuggage.id, sessionId)
        );
        setRecommendations(result);
        setCurrentStep(STEPS.PACKING_RESULTS);
      }
    } catch (err) {
      console.error('Error getting recommendations:', err);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(STEPS.LUGGAGE_SELECTION);
    setSelectedLuggage(null);
    setDetectedItems(null);
    setConfirmedItems([]);
    setRecommendations(null);
    setVisualResults(null);
    setImageUrl(null);
    setOriginalImageFile(null);
    setUseVisualPacking(false);
  };

  const handleBack = () => {
    switch (currentStep) {
      case STEPS.PHOTO_UPLOAD:
        setCurrentStep(STEPS.LUGGAGE_SELECTION);
        break;
      case STEPS.ITEM_CONFIRMATION:
        setCurrentStep(STEPS.PHOTO_UPLOAD);
        break;
      case STEPS.PACKING_RESULTS:
        setCurrentStep(STEPS.ITEM_CONFIRMATION);
        break;
      case STEPS.VISUAL_PACKING:
        setCurrentStep(STEPS.PHOTO_UPLOAD);
        break;
      default:
        break;
    }
  };

  const getProgressPercentage = () => {
    switch (currentStep) {
      case STEPS.LUGGAGE_SELECTION:
        return 25;
      case STEPS.PHOTO_UPLOAD:
        return 50;
      case STEPS.ITEM_CONFIRMATION:
        return 75;
      case STEPS.PACKING_RESULTS:
        return 100;
      case STEPS.VISUAL_PACKING:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <>
      <Head>
        <title>Luggage Packing Assistant - AI-Powered Packing Recommendations</title>
        <meta name="description" content="Get intelligent packing recommendations based on your items and luggage size using AI vision technology." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Progressive Web App */}
        <meta name="theme-color" content="#0284c7" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Packing Assistant" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Progress Bar */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {Object.values(STEPS).indexOf(currentStep) + 1} of {useVisualPacking ? '5' : '4'}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(getProgressPercentage())}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {currentStep === STEPS.LUGGAGE_SELECTION && (
            <LuggageSelector
              onSelect={handleLuggageSelect}
              selectedId={selectedLuggage?.id}
            />
          )}

          {currentStep === STEPS.PHOTO_UPLOAD && (
            <PhotoUpload
              onItemsDetected={handleItemsDetected}
              onBack={handleBack}
            />
          )}

          {currentStep === STEPS.ITEM_CONFIRMATION && (
            <ItemConfirmation
              detectedItems={detectedItems}
              imageUrl={imageUrl}
              onItemsConfirmed={handleItemsConfirmed}
              onBack={handleBack}
            />
          )}

          {currentStep === STEPS.PACKING_RESULTS && (
            <PackingResults
              recommendations={recommendations}
              selectedLuggage={selectedLuggage}
              onStartOver={handleStartOver}
              onBack={handleBack}
            />
          )}

          {currentStep === STEPS.VISUAL_PACKING && (
            <VisualPackingResults
              visualResults={visualResults}
              selectedLuggage={selectedLuggage}
              originalImageFile={originalImageFile}
              confirmedItems={confirmedItems}
              onStartOver={handleStartOver}
              onBack={handleBack}
              onVisualResults={setVisualResults}
            />
          )}

          {/* Loading State */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-700 font-medium">Processing your request...</p>
                </div>
              </div>
            </div>
          )}

          {/* Global Error Display */}
          {error && !loading && (
            <div className="fixed bottom-4 right-4 max-w-sm">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Powered by AI vision technology • Built with Next.js and Tailwind CSS
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}