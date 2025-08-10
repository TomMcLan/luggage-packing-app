export const LUGGAGE_SIZES = [
  {
    id: 'underseat',
    name: '16" Personal/Underseat',
    dimensions: '16" × 13" × 6"',
    volume: '22 liters',
    description: 'Fits under airline seat'
  },
  {
    id: 'carryon',
    name: '20" Carry-on',
    dimensions: '22" × 14" × 9"',
    volume: '45 liters', 
    description: 'Standard overhead bin'
  },
  {
    id: 'medium',
    name: '24" Medium Check-in',
    dimensions: '24" × 16" × 10"',
    volume: '65 liters',
    description: 'Week-long trips'
  },
  {
    id: 'large',
    name: '28" Large Check-in', 
    dimensions: '28" × 18" × 11"',
    volume: '85 liters',
    description: 'Extended travel'
  }
];

export const ITEM_CATEGORIES = [
  'clothing',
  'electronics', 
  'toiletries',
  'shoes',
  'accessories',
  'books',
  'documents'
];

export const API_ENDPOINTS = {
  LUGGAGE: '/api/luggage',
  LUGGAGE_SELECT: '/api/luggage/select',
  DETECT_ITEMS: '/api/items/detect',
  RECOMMENDATIONS: '/api/recommendations',
  METHODS: '/api/methods'
};