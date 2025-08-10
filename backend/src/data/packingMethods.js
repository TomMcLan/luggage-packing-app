const packingMethods = [
  {
    id: 1,
    name: "Rolling Method",
    description: "Roll clothes tightly to maximize space and minimize wrinkles",
    efficiency_rating: 4.2,
    difficulty: "Easy", 
    estimated_time_minutes: 15,
    space_savings_percent: 30,
    best_for_categories: ["clothing"],
    instructions: [
      { step: 1, text: "Lay garment flat on surface" },
      { step: 2, text: "Fold sleeves inward" },
      { step: 3, text: "Roll tightly from bottom to top" },
      { step: 4, text: "Secure with rubber band if needed" }
    ]
  },
  {
    id: 2,
    name: "Bundle Wrapping",
    description: "Wrap clothes around a central core to prevent wrinkles", 
    efficiency_rating: 4.5,
    difficulty: "Medium",
    estimated_time_minutes: 25,
    space_savings_percent: 35,
    best_for_categories: ["clothing"],
    instructions: [
      { step: 1, text: "Place heaviest item as core (jeans/jacket)" },
      { step: 2, text: "Wrap lighter items around core" },
      { step: 3, text: "Fold sleeves and excess fabric inward" },
      { step: 4, text: "Continue wrapping in layers" }
    ]
  },
  {
    id: 3,
    name: "Tetris Electronics Method",
    description: "Pack electronics and cables efficiently using compartments",
    efficiency_rating: 4.0,
    difficulty: "Easy",
    estimated_time_minutes: 10, 
    space_savings_percent: 25,
    best_for_categories: ["electronics"],
    instructions: [
      { step: 1, text: "Use hard cases for fragile items" },
      { step: 2, text: "Coil cables and secure with velcro" },
      { step: 3, text: "Fill gaps with small items" },
      { step: 4, text: "Place heaviest electronics at bottom" }
    ]
  },
  {
    id: 4,
    name: "Shoe Stuffing Strategy", 
    description: "Maximize shoe space by stuffing with small items",
    efficiency_rating: 3.8,
    difficulty: "Easy",
    estimated_time_minutes: 5,
    space_savings_percent: 20,
    best_for_categories: ["shoes", "accessories"],
    instructions: [
      { step: 1, text: "Place shoes in shoe bags" },
      { step: 2, text: "Stuff socks and underwear inside shoes" },
      { step: 3, text: "Fill with chargers or small accessories" },
      { step: 4, text: "Place shoes at bottom of luggage" }
    ]
  },
  {
    id: 5,
    name: "Compression Packing",
    description: "Use compression techniques to reduce bulk",
    efficiency_rating: 4.3,
    difficulty: "Medium", 
    estimated_time_minutes: 20,
    space_savings_percent: 40,
    best_for_categories: ["clothing"],
    instructions: [
      { step: 1, text: "Roll items as tightly as possible" },
      { step: 2, text: "Use packing cubes with compression zippers" },
      { step: 3, text: "Press out air before zipping" },
      { step: 4, text: "Stack compressed cubes efficiently" }
    ]
  },
  {
    id: 6,
    name: "Layering Method",
    description: "Layer items by weight and frequency of use",
    efficiency_rating: 3.9,
    difficulty: "Easy",
    estimated_time_minutes: 12,
    space_savings_percent: 25,
    best_for_categories: ["clothing"],
    instructions: [
      { step: 1, text: "Place heavy items at bottom" },
      { step: 2, text: "Add medium-weight items in middle" },
      { step: 3, text: "Put light items on top" },
      { step: 4, text: "Keep frequently used items accessible" }
    ]
  },
  {
    id: 7,
    name: "Folder Board Method",
    description: "Use folder boards for wrinkle-free formal wear",
    efficiency_rating: 4.1,
    difficulty: "Medium",
    estimated_time_minutes: 18,
    space_savings_percent: 28,
    best_for_categories: ["clothing"],
    instructions: [
      { step: 1, text: "Place shirt on folder board" },
      { step: 2, text: "Fold sleeves over the board" },
      { step: 3, text: "Fold bottom of shirt up over board" },
      { step: 4, text: "Remove board and stack folded items" }
    ]
  },
  {
    id: 8,
    name: "Military Roll",
    description: "Ultra-tight rolling technique for maximum space efficiency",
    efficiency_rating: 4.4,
    difficulty: "Hard",
    estimated_time_minutes: 30,
    space_savings_percent: 45,
    best_for_categories: ["clothing"],
    instructions: [
      { step: 1, text: "Fold item in half lengthwise" },
      { step: 2, text: "Roll extremely tightly from one end" },
      { step: 3, text: "Tuck loose ends to secure the roll" },
      { step: 4, text: "Pack rolled items tightly together" }
    ]
  }
];

module.exports = { packingMethods };