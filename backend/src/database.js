const { luggageSizes } = require('./data/luggage');
const { packingMethods } = require('./data/packingMethods');

class HardcodedDB {
  constructor() {
    this.userSessions = []; // In-memory storage for user sessions
    console.log('Hardcoded database initialized with sample data');
  }

  async initialize() {
    // No initialization needed for hardcoded data
    return Promise.resolve();
  }

  async getLuggageSizes() {
    return Promise.resolve(luggageSizes.map(luggage => ({
      id: luggage.id,
      name: luggage.name,
      dimensions: luggage.dimensions,
      volume_liters: parseInt(luggage.volume.split(' ')[0]), // Extract number from "22 liters"
      description: luggage.description
    })));
  }

  async getPackingMethods() {
    return Promise.resolve(packingMethods.map(method => ({
      id: method.id,
      name: method.name,
      description: method.description,
      efficiency_rating: method.efficiency_rating,
      difficulty: method.difficulty,
      time_minutes: method.estimated_time_minutes,
      space_savings: method.space_savings_percent,
      best_for_categories: method.best_for_categories,
      instructions: method.instructions
    })));
  }

  async saveUserSession(sessionData) {
    // Store session in memory (in production, you might want to use a proper database)
    const session = {
      ...sessionData,
      timestamp: new Date().toISOString()
    };
    
    this.userSessions.push(session);
    
    // Keep only last 100 sessions to prevent memory issues
    if (this.userSessions.length > 100) {
      this.userSessions = this.userSessions.slice(-100);
    }
    
    console.log(`Saved user session: ${sessionData.session_id}`);
    return Promise.resolve(session);
  }

  async getLuggageById(id) {
    const allLuggage = await this.getLuggageSizes();
    return Promise.resolve(allLuggage.find(luggage => luggage.id === id));
  }

  // Optional: Get session statistics
  async getSessionStats() {
    return Promise.resolve({
      total_sessions: this.userSessions.length,
      recent_sessions: this.userSessions.slice(-10)
    });
  }
}

// Singleton instance
const db = new HardcodedDB();

module.exports = db;