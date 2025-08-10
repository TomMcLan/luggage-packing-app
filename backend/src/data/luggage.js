const luggageSizes = [
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

module.exports = { luggageSizes };