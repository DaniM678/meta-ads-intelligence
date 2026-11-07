/**
 * Main Application Orchestrator
 */

const App = {
  currentAds: [],
  selectedAd: null,
  activeTab: 'board',
  viewLayout: 'grid', // 'grid' or 'table'
  apiMode: 'mock',
  accessToken: '',
  filters: {
    niche: 'fitness',
    longevity: 'all',
    format: 'all',
    sortBy: 'longevity-desc',
    searchTerms: ''
  },

  async init() {
    await this.applyFilters();
    window.SemrushMatrix.renderMatrix(this.filters.niche);
    window.SemrushMatrix.renderKeywordCloud(this.filters.niche);
    window.SemrushMatrix.renderVelocityChart();
    window.SemrushMatrix.renderAdGapAnalysis();
    window.StrategyGenerator.generatePrompt();
  },

  async switchTab(tabId) {
    this.activeTab = tabId;
    const tabs = ['board', 'matrix', 'kanban', 'generator'];
    tabs.forEach(t => {
      const content = document.getElementById('tabContent' + t.charAt(0).toUpperCase() + t.slice(1));
      const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
      const sideItem = document.getElementById('sideNav' + t.charAt(0).toUpperCase() + t.slice(1));

      if (t === tabId) {
        if (content) content.classList.remove('hidden');
        if (btn) {
          btn.classList.add('tab-monday-active');
          btn.classList.remove('text-[#676879]');
        }
        if (sideItem) {
          sideItem.classList.add('active');
        }
      } else {
        if (content) content.classList.add('hidden');
        if (btn) {
          btn.classList.remove('tab-monday-active');
          btn.classList.add('text-[#676879]');
        }
        if (sideItem) {
          sideItem.classList.remove('active');
        }
      }
    });

    if (tabId === 'kanban') {
      window.KanbanFunnel.render(this.currentAds);
    } else if (tabId === 'matrix') {
      window.SemrushMatrix.renderMatrix(this.filters.niche);
      window.SemrushMatrix.renderKeywordCloud(this.filters.niche);
    } else if (tabId === 'generator') {
      window.StrategyGenerator.generatePrompt();
    }
  },

  setViewLayout(mode) {
    this.viewLayout = mode;
    const grid = document.getElementById('adsGridContainer');
    const table = document.getElementById('adsTableContainer');
    const btnBoard = document.getElementById('tabBtnBoard');
    const btnGrid = document.getElementById('tabBtnGrid');

    if (mode === 'grid') {
      if (grid) grid.classList.remove('hidden');
      if (table) table.classList.add('hidden');
      if (btnGrid) {
        btnGrid.classList.add('tab-monday-active');
        btnGrid.classList.remove('text-[#676879]');
      }
      if (btnBoard) {
        btnBoard.classList.remove('tab-monday-active');
        btnBoard.classList.add('text-[#676879]');
      }
    } else {
      if (grid) grid.classList.add('hidden');
      if (table) table.classList.remove('hidden');
      if (btnBoard) {
        btnBoard.classList.add('tab-monday-active');
        btnBoard.classList.remove('text-[#676879]');
      }
      if (btnGrid) {
        btnGrid.classList.remove('tab-monday-active');
        btnGrid.classList.add('text-[#676879]');
      }
    }
  },

  async applyFilters() {
    const nicheEl = document.getElementById('nicheSelect');
    const formatEl = document.getElementById('formatFilter');
    const sortEl = document.getElementById('sortBy');

    if (nicheEl) this.filters.niche = nicheEl.value;
    if (formatEl) this.filters.format = formatEl.value;
    if (sortEl) this.filters.sortBy = sortEl.value;

    const params = {
      niche: this.filters.niche,
      longevity: this.filters.longevity,
      format: this.filters.format,
      sortBy: this.filters.sortBy,
      searchTerms: this.filters.searchTerms,
      accessToken: this.accessToken
    };

    try {
      const data = await window.API.fetchAds(params);
      if (data.success) {
        this.currentAds = data.ads;
        window.MondayBoard.renderGrid(this.currentAds);
        window.MondayBoard.renderTable(this.currentAds);
        this.updateKpis(this.currentAds);

        if (this.activeTab === 'kanban') {
          window.KanbanFunnel.render(this.currentAds);
        }
      }
    } catch (err) {
      console.error('Error fetching filtered ads:', err);
    }
  },

  setLongevityFilter(type) {
    this.filters.longevity = type;
    const btns = {
      all: document.getElementById('fltAll'),
      scaling: document.getElementById('fltScaling'),
      steady: document.getElementById('fltSteady'),
      testing: document.getElementById('fltTesting')
    };

    Object.keys(btns).forEach(key => {
      if (btns[key]) {
        btns[key].className = 'px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ' + 
          (key === type ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200');
      }
    });

    const badge = document.getElementById('activeFilterBadge');
    const desc = document.getElementById('filterDesc');
    if (type === 'all') {
      if (badge) badge.classList.add('hidden');
    } else {
      if (badge) badge.classList.remove('hidden');
      if (desc) desc.innerText = type === 'scaling' ? 'Scaling (>45z)' : type === 'steady' ? 'Steady (20-45z)' : 'Testare (<20z)';
    }

    this.applyFilters();
  },

  resetFilters() {
    const nicheEl = document.getElementById('nicheSelect');
    const formatEl = document.getElementById('formatFilter');
    const searchEl = document.getElementById('aiSearchInput');

    if (nicheEl) nicheEl.value = 'all';
    if (formatEl) formatEl.value = 'all';
    if (searchEl) searchEl.value = '';

    this.filters.searchTerms = '';
    this.setLongevityFilter('all');
  },

  changeNiche(val) {
    this.filters.niche = val;
    this.applyFilters();
    window.SemrushMatrix.renderMatrix(val);
    window.SemrushMatrix.renderKeywordCloud(val);
  },

  searchByKeyword(word) {
    const searchInput = document.getElementById('aiSearchInput');
    if (searchInput) {
      searchInput.value = word;
      this.executeAiSearch();
    }
  },

  async executeAiSearch() {
    const searchInput = document.getElementById('aiSearchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (!query) {
      this.filters.searchTerms = '';
      this.applyFilters();
      return;
    }

    try {
      const data = await window.API.semanticSearch(query);
      if (data.success) {
        this.currentAds = data.ads;
        window.MondayBoard.renderGrid(this.currentAds);
        window.MondayBoard.renderTable(this.currentAds);
        this.updateKpis(this.currentAds);

        const badge = document.getElementById('activeFilterBadge');
        const desc = document.getElementById('filterDesc');
        if (badge) badge.classList.remove('hidden');
        if (desc) desc.innerText = `Căutare AI: "${query}" (${data.total} rezultate)`;
      }
    } catch (err) {
      console.error('Semantic search error:', err);
    }
  },

  updateKpis(ads) {
    const totalEl = document.getElementById('kpiTotalAds');
    const avgEl = document.getElementById('kpiAvgLongevity');

    if (totalEl) totalEl.innerText = `${ads.length} Reclame`;
    if (avgEl) {
      if (ads.length > 0) {
        const avg = Math.round(ads.reduce((acc, a) => acc + (a.active_days || 0), 0) / ads.length);
        avgEl.innerText = `${avg} Zile active`;
      } else {
        avgEl.innerText = '0 Zile';
      }
    }
  },

  /* Ad Modal Deep Dive */
  async openAdModal(adId) {
    try {
      const data = await window.API.getAdById(adId);
      if (!data.success || !data.ad) return;
      const ad = data.ad;
      this.selectedAd = ad;

      document.getElementById('modalBrandName').innerText = ad.brand;
      document.getElementById('modalBrandAvatar').innerText = (ad.brand || 'B').slice(0, 2).toUpperCase();
      document.getElementById('modalAdId').innerText = `Meta Ad ID: ${ad.id}`;
      document.getElementById('modalActiveStatus').innerText = ad.active_days >= 45 
        ? `🔥 Scaling (${ad.active_days} Zile Active)` 
        : `⚡ Active (${ad.active_days} Zile)`;

      document.getElementById('modalAdImage').src = ad.thumbnail_url;
      document.getElementById('modalOverlayFormat').innerText = ad.format_label || 'Video';
      document.getElementById('modalOverlayHook').innerText = `"${ad.headline}"`;
      document.getElementById('modalPlatformsText').innerText = `Canale: ${(ad.publisher_platforms || []).join(', ')}`;
      document.getElementById('modalMetaLibraryLink').href = `https://www.facebook.com/ads/library/?id=${ad.id}`;

      document.getElementById('modalHookArchetype').innerText = ad.hook_type;
      document.getElementById('modalHookExplanation').innerText = `Unghi axat pe ${ad.hook_type}: Oprește scroll-ul și anulează frica de achiziție.`;

      document.getElementById('modalAdCopy').innerText = ad.primary_text;
      document.getElementById('modalHeadline').innerText = ad.headline;
      document.getElementById('modalCta').innerText = ad.cta_text || 'Cumpără Acum';
      document.getElementById('modalOfferDetails').innerText = `${ad.offer} (${ad.iterations_count || 1} variații active)`;

      document.getElementById('adModal').classList.remove('hidden');
    } catch (err) {
      console.error('Error opening ad modal:', err);
    }
  },

  closeAdModal() {
    const modal = document.getElementById('adModal');
    if (modal) modal.classList.add('hidden');
  },

  async addCurrentAdToSwipe() {
    if (!this.selectedAd) return;
    try {
      await window.API.saveToSwipe(this.selectedAd.id, 'Salvat pentru modelare strategică.');
      alert(`Reclama ${this.selectedAd.brand} a fost salvată în Swipe File!`);
      if (this.activeTab === 'kanban') {
        window.KanbanFunnel.render(this.currentAds);
      }
    } catch (err) {
      alert('Eroare la salvare: ' + err.message);
    }
  },

  stealHookToAi() {
    this.closeAdModal();
    this.switchTab('generator');
    if (this.selectedAd) {
      window.StrategyGenerator.generatePrompt(this.selectedAd.id);
    }
  },

  /* API Modal Settings */
  openApiModal() {
    const modal = document.getElementById('apiModal');
    if (modal) modal.classList.remove('hidden');
  },

  closeApiModal() {
    const modal = document.getElementById('apiModal');
    if (modal) modal.classList.add('hidden');
  },

  setApiMode(mode) {
    this.apiMode = mode;
    const bMock = document.getElementById('btnModeMock');
    const bLive = document.getElementById('btnModeLive');
    const liveInputs = document.getElementById('liveApiInputs');

    if (mode === 'mock') {
      if (bMock) bMock.className = 'p-2.5 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-blue-700 font-bold text-left transition';
      if (bLive) bLive.className = 'p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-left transition';
      if (liveInputs) liveInputs.classList.add('opacity-50', 'pointer-events-none');
    } else {
      if (bLive) bLive.className = 'p-2.5 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-blue-700 font-bold text-left transition';
      if (bMock) bMock.className = 'p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-left transition';
      if (liveInputs) liveInputs.classList.remove('opacity-50', 'pointer-events-none');
    }
  },

  saveApiSettings() {
    const dot = document.getElementById('apiStatusDot');
    const text = document.getElementById('apiStatusText');
    const tokenInput = document.getElementById('inputAccessToken');

    if (this.apiMode === 'live') {
      const token = tokenInput ? tokenInput.value.trim() : '';
      if (!token) {
        alert('Te rugăm să introduci un Access Token Meta Graph API valid pentru modul Live.');
        return;
      }
      this.accessToken = token;
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-blue-500 pulse-dot';
      if (text) text.innerText = 'Meta API: Conectat Live';
      alert('Conexiune Meta Graph API inițializată cu succes!');
    } else {
      this.accessToken = '';
      if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-500 pulse-dot';
      if (text) text.innerText = 'Meta API: Mock Mode Activ';
    }

    this.closeApiModal();
    this.applyFilters();
  }
};

window.App = App;

document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
