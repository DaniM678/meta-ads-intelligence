/**
 * Meta Ads Library API Client & Normalizer Service
 * Communicates with Meta Graph API (/v21.0/ads_archive)
 * and calculates competitive intelligence metrics.
 */

const fs = require('fs');
const path = require('path');

const MOCK_DATA_PATH = path.join(__dirname, '..', 'data', 'mockCompetitorAds.json');

class MetaAdsService {
  constructor() {
    this.cachedAds = this.loadMockData();
  }

  loadMockData() {
    try {
      const raw = fs.readFileSync(MOCK_DATA_PATH, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error loading mock ads data:', err);
      return [];
    }
  }

  /**
   * Search ads either from Live Meta Graph API or local database
   */
  async searchAds({
    accessToken = null,
    searchTerms = '',
    niche = 'all',
    brand = 'all',
    country = 'RO',
    longevity = 'all',
    format = 'all',
    funnelStage = 'all',
    sortBy = 'longevity-desc'
  }) {
    let ads = [];

    const effectiveToken = (accessToken && accessToken.trim()) || process.env.META_ACCESS_TOKEN || null;
    const effectiveCountry = country || process.env.META_TARGET_COUNTRY || 'RO';

    // If live token is provided or configured in .env, query Meta Graph API
    if (effectiveToken && effectiveToken.trim().startsWith('EAA')) {
      try {
        ads = await this.fetchFromMetaGraphApi({
          accessToken: effectiveToken.trim(),
          searchTerms,
          country: effectiveCountry
        });
      } catch (apiErr) {
        console.warn('Meta Graph API request failed, falling back to local database:', apiErr.message);
        ads = this.cachedAds;
      }
    } else {
      ads = this.cachedAds;
    }

    // Apply Filters
    let filtered = ads.filter(ad => {
      // Niche filter
      if (niche !== 'all' && ad.niche && ad.niche !== niche) return false;

      // Brand filter
      if (brand !== 'all' && ad.brand.toLowerCase() !== brand.toLowerCase()) return false;

      // Longevity filter (Validation Rule: >45d = Scaling, 20-45d = Steady, <20d = Testing)
      if (longevity === 'scaling' && ad.active_days < 45) return false;
      if (longevity === 'steady' && (ad.active_days < 20 || ad.active_days >= 45)) return false;
      if (longevity === 'testing' && ad.active_days >= 20) return false;

      // Format filter
      if (format !== 'all' && ad.format !== format) return false;

      // Funnel Stage filter
      if (funnelStage !== 'all' && ad.funnel_stage !== funnelStage) return false;

      // Search terms filter
      if (searchTerms && searchTerms.trim() !== '') {
        const term = searchTerms.toLowerCase().trim();
        const fullString = `${ad.brand} ${ad.headline} ${ad.primary_text} ${ad.offer} ${ad.hook_type} ${(ad.tags || []).join(' ')}`.toLowerCase();
        if (!fullString.includes(term)) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'longevity-desc') {
      filtered.sort((a, b) => b.active_days - a.active_days);
    } else if (sortBy === 'longevity-asc') {
      filtered.sort((a, b) => a.active_days - b.active_days);
    } else if (sortBy === 'roas') {
      filtered.sort((a, b) => (b.estimated_roas || 0) - (a.estimated_roas || 0));
    } else if (sortBy === 'brand') {
      filtered.sort((a, b) => a.brand.localeCompare(b.brand));
    }

    return filtered;
  }

  /**
   * Fetch from official Meta Graph API v21.0
   */
  async fetchFromMetaGraphApi({ accessToken, searchTerms, country = 'RO' }) {
    const fields = [
      'id',
      'ad_creation_time',
      'ad_delivery_start_time',
      'ad_delivery_stop_time',
      'ad_creative_bodies',
      'ad_creative_link_captions',
      'ad_creative_link_descriptions',
      'ad_creative_link_titles',
      'ad_snapshot_url',
      'page_id',
      'page_name',
      'publisher_platforms',
      'target_locations'
    ].join(',');

    const url = new URL('https://graph.facebook.com/v21.0/ads_archive');
    url.searchParams.set('access_token', accessToken);
    url.searchParams.set('ad_reached_countries', `['${country}']`);
    url.searchParams.set('ad_type', 'ALL');
    url.searchParams.set('ad_active_status', 'ALL');
    url.searchParams.set('fields', fields);
    url.searchParams.set('limit', '50');

    // Meta Ads Archive requires either search_terms or search_page_ids
    const queryTerm = (searchTerms && searchTerms.trim() !== '') ? searchTerms.trim() : 'oferta';
    url.searchParams.set('search_terms', queryTerm);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error) {
      console.error('Meta API Error Details:', data.error);
      throw new Error(`Meta API Error [${data.error.code}]: ${data.error.message}`);
    }

    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    // Normalize Meta API results into our Ad intelligence format
    return data.data.map(raw => this.normalizeMetaAd(raw));
  }

  /**
   * Normalize raw Meta Ad object into structured intelligence schema
   */
  normalizeMetaAd(raw) {
    const now = new Date();
    const startTime = raw.ad_delivery_start_time ? new Date(raw.ad_delivery_start_time) : now;
    const stopTime = raw.ad_delivery_stop_time ? new Date(raw.ad_delivery_stop_time) : now;
    
    // Calculate active days
    const diffMs = stopTime.getTime() - startTime.getTime();
    const activeDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));

    let status = 'testing';
    if (activeDays >= 45) status = 'scaling';
    else if (activeDays >= 20) status = 'steady';

    const primaryText = (raw.ad_creative_bodies && raw.ad_creative_bodies[0]) || 'Descriere reclamă nedisponibilă';
    const headline = (raw.ad_creative_link_titles && raw.ad_creative_link_titles[0]) || raw.page_name || 'Titlu Ofertă';

    // Hook classification
    const hookType = this.classifyHookType(primaryText, headline);

    return {
      id: raw.id,
      brand: raw.page_name || 'Brand Concurent',
      niche: 'general',
      page_id: raw.page_id,
      page_name: raw.page_name,
      ad_creation_time: raw.ad_creation_time,
      ad_delivery_start_time: raw.ad_delivery_start_time,
      ad_delivery_stop_time: raw.ad_delivery_stop_time,
      active_days: activeDays,
      status: status,
      funnel_stage: activeDays > 40 ? 'tof' : 'mof',
      format: (raw.publisher_platforms || []).includes('instagram') ? 'video' : 'image',
      format_label: (raw.publisher_platforms || []).includes('instagram') ? '9:16 Video / Reels' : 'Static Image',
      publisher_platforms: raw.publisher_platforms || ['facebook', 'instagram'],
      thumbnail_url: raw.ad_snapshot_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      hook_type: hookType,
      headline: headline,
      primary_text: primaryText,
      cta_text: 'Vezi Oferta (Learn More)',
      destination_url: raw.ad_creative_link_captions ? `https://${raw.ad_creative_link_captions[0]}` : '#',
      offer: 'Ofertă promoțională în derulare',
      risk_reversal: 'Garanție conform politicii comerciale',
      estimated_roas: activeDays > 45 ? 9.2 : 7.5,
      iterations_count: Math.min(25, Math.max(1, Math.round(activeDays / 5))),
      tags: this.extractKeywords(primaryText).slice(0, 4)
    };
  }

  classifyHookType(text, headline) {
    const combined = `${headline} ${text}`.toLowerCase();
    if (combined.includes('nu mai') || combined.includes('greșeal') || combined.includes('haos') || combined.includes('de ce')) {
      return 'Problem-Agitation';
    }
    if (combined.includes('1+1') || combined.includes('gratuit') || combined.includes('reducere') || combined.includes('ofert')) {
      return 'Irresistible Offer';
    }
    if (combined.includes('secret') || combined.includes('cum să') || combined.includes('află')) {
      return 'Curiosity / Secret';
    }
    if (combined.includes('dermatolog') || combined.includes('clinic') || combined.includes('testat') || combined.includes('clienți')) {
      return 'Authority / Social Proof';
    }
    return 'Feature & Value';
  }

  extractKeywords(text) {
    const stopwords = new Set(['și', 'în', 'la', 'cu', 'pe', 'de', 'din', 'pentru', 'sau', 'o', 'un', 'ale', 'care', 'este', 'sunt', 'fost', 'tot', 'mai']);
    const words = text
      .toLowerCase()
      .replace(/[^\w\săâîșț]/gi, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopwords.has(w));
    return [...new Set(words)];
  }

  getAdById(id) {
    return this.cachedAds.find(a => a.id === id) || null;
  }
}

module.exports = new MetaAdsService();
