/**
 * Client-Side API Communication Module
 */

const API = {
  // Fetch ads with filters
  async fetchAds(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`/api/ads?${qs}`);
    return await res.json();
  },

  // Get ad by ID
  async getAdById(id) {
    const res = await fetch(`/api/ads/${id}`);
    return await res.json();
  },

  // AI Semantic Search
  async semanticSearch(query, accessToken = '') {
    const res = await fetch('/api/ai/semantic-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, accessToken })
    });
    return await res.json();
  },

  // AI Copilot Chat
  async sendCopilotMessage(message, conversationHistory = []) {
    const res = await fetch('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory })
    });
    return await res.json();
  },

  // Downstream AI Prompt Capsule Generator
  async generateStrategy(adId, format) {
    const res = await fetch('/api/ai/generate-strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adId, format })
    });
    return await res.json();
  },

  // Semrush Benchmark Matrix
  async getBenchmarkMatrix(niche = 'all') {
    const res = await fetch(`/api/benchmark/matrix?niche=${niche}`);
    return await res.json();
  },

  // Keyword Frequency Cloud
  async getKeywordCloud(niche = 'all') {
    const res = await fetch(`/api/benchmark/keywords?niche=${niche}`);
    return await res.json();
  },

  // Launch Velocity Timeline
  async getLaunchVelocity() {
    const res = await fetch('/api/benchmark/velocity');
    return await res.json();
  },

  // Ad Gap Analysis
  async getAdGapAnalysis() {
    const res = await fetch('/api/benchmark/gap');
    return await res.json();
  },

  // Swipe File
  async getSwipeAds() {
    const res = await fetch('/api/swipe');
    return await res.json();
  },

  async saveToSwipe(adId, notes = '', tags = []) {
    const res = await fetch(`/api/swipe/${adId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, tags })
    });
    return await res.json();
  },

  async removeFromSwipe(adId) {
    const res = await fetch(`/api/swipe/${adId}`, { method: 'DELETE' });
    return await res.json();
  }
};

window.API = API;
