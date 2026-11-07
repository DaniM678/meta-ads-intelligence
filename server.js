/**
 * Meta Ads Intelligence & Competitor Spy Engine Server
 * Express full-stack API server + frontend static host
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const metaAdsService = require('./services/metaAdsService');
const aiService = require('./services/aiService');
const benchmarkService = require('./services/benchmarkService');
const swipeService = require('./services/swipeService');
const agentTeamService = require('./services/agentTeamService');
const campaignService = require('./services/campaignService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    name: 'Sunlight Researcher',
    status: 'ok',
    uptime: process.uptime(),
    version: '2.0.0',
    metaApiEngine: 'Active (v21.0 compatibility)',
    autonomousAgents: '5 Agents Active'
  });
});

// 1. Search & Filter Ads
app.get('/api/ads', async (req, res) => {
  try {
    const {
      accessToken,
      searchTerms,
      niche,
      brand,
      country,
      longevity,
      format,
      funnelStage,
      sortBy
    } = req.query;

    const ads = await metaAdsService.searchAds({
      accessToken,
      searchTerms,
      niche,
      brand,
      country,
      longevity,
      format,
      funnelStage,
      sortBy
    });

    res.json({
      success: true,
      total: ads.length,
      ads
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get Single Ad by ID
app.get('/api/ads/:id', (req, res) => {
  const ad = metaAdsService.getAdById(req.params.id);
  if (!ad) {
    return res.status(404).json({ success: false, error: 'Reclama nu a fost găsită' });
  }
  res.json({ success: true, ad });
});

// 3. AI Natural Language Semantic Search
app.post('/api/ai/semantic-search', async (req, res) => {
  try {
    const { query, accessToken } = req.body;
    const parsed = aiService.parseSemanticQuery(query);
    const ads = await metaAdsService.searchAds({
      accessToken,
      searchTerms: parsed.filters.searchTerms,
      longevity: parsed.filters.longevity,
      format: parsed.filters.format,
      niche: parsed.filters.niche
    });

    res.json({
      success: true,
      query,
      parsedIntent: parsed,
      total: ads.length,
      ads
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. AI Spy Copilot Chat
app.post('/api/ai/copilot', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Mesajul este obligatoriu' });
    }

    const copilotResult = await aiService.handleCopilotMessage(message, conversationHistory);
    res.json({
      success: true,
      reply: copilotResult.message,
      action: copilotResult.action
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. AI Strategy Capsule Prompt Generator
app.post('/api/ai/generate-strategy', (req, res) => {
  try {
    const { adId, format } = req.body;
    const capsule = aiService.generateDownstreamAiCapsule(adId, format);
    res.json({ success: true, capsule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Semrush Benchmarking Endpoints
app.get('/api/benchmark/matrix', (req, res) => {
  const { niche } = req.query;
  const matrix = benchmarkService.getCompetitorMatrix(niche);
  res.json({ success: true, matrix });
});

app.get('/api/benchmark/keywords', (req, res) => {
  const { niche } = req.query;
  const keywords = benchmarkService.getKeywordCloud(niche);
  res.json({ success: true, keywords });
});

app.get('/api/benchmark/velocity', (req, res) => {
  const velocity = benchmarkService.getLaunchVelocity();
  res.json({ success: true, velocity });
});

app.get('/api/benchmark/gap', (req, res) => {
  const gaps = benchmarkService.getAdGapAnalysis();
  res.json({ success: true, gaps });
});

// 7. Swipe File Management Endpoints
app.get('/api/swipe', (req, res) => {
  const items = swipeService.getAll();
  res.json({ success: true, total: items.length, items });
});

app.post('/api/swipe/:id', (req, res) => {
  try {
    const { notes, tags } = req.body;
    const saved = swipeService.add(req.params.id, notes, tags);
    res.json({ success: true, saved });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/swipe/:id', (req, res) => {
  const removed = swipeService.remove(req.params.id);
  res.json({ success: true, removed });
});

app.get('/api/swipe/export/markdown', (req, res) => {
  const md = swipeService.exportMarkdown();
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="competitor_swipe_file.md"');
  res.send(md);
});

// 8. Autonomous Multi-Agent AI Team Endpoints
app.get('/api/agents', (req, res) => {
  res.json({
    success: true,
    agents: agentTeamService.getAgents()
  });
});

app.get('/api/agents/logs', (req, res) => {
  res.json({
    success: true,
    logs: agentTeamService.getActivityLog()
  });
});

app.post('/api/agents/investigate', async (req, res) => {
  try {
    const { topic, niche } = req.body;
    const result = await agentTeamService.runTeamInvestigation(topic, niche);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Meta & Google Ads Campaign Intelligence Builder
app.post('/api/campaigns/blueprint', async (req, res) => {
  try {
    const { niche, productName, platform, targetGoal, country } = req.body;
    const blueprint = await campaignService.generateCampaignBlueprint({
      niche,
      productName,
      platform,
      targetGoal,
      country
    });
    res.json(blueprint);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`☀️  SUNLIGHT RESEARCHER — INTELLIGENCE PLATFORM`);
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`🤖 Autonomous Multi-Agent AI Team Active`);
  console.log(`🎯 Meta & Google Ads Campaign Builder Engine Ready`);
  console.log(`====================================================`);
});
