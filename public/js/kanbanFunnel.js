/**
 * Kanban Funnel Pipeline Module (Eugene Schwartz Awareness Stages)
 */

const KanbanFunnel = {
  async render(ads = []) {
    const tofList = document.getElementById('kanbanTofList');
    const mofList = document.getElementById('kanbanMofList');
    const bofList = document.getElementById('kanbanBofList');
    const swipeList = document.getElementById('kanbanSwipeList');

    if (!tofList || !mofList || !bofList || !swipeList) return;

    const tofAds = ads.filter(a => a.funnel_stage === 'tof');
    const mofAds = ads.filter(a => a.funnel_stage === 'mof');
    const bofAds = ads.filter(a => a.funnel_stage === 'bof');

    document.getElementById('kbCountTof').innerText = tofAds.length;
    document.getElementById('kbCountMof').innerText = mofAds.length;
    document.getElementById('kbCountBof').innerText = bofAds.length;

    tofList.innerHTML = tofAds.map(a => this.renderCard(a)).join('');
    mofList.innerHTML = mofAds.map(a => this.renderCard(a)).join('');
    bofList.innerHTML = bofAds.map(a => this.renderCard(a)).join('');

    // Fetch and render Swipe File items
    try {
      const swipeData = await window.API.getSwipeAds();
      document.getElementById('kbCountSwipe').innerText = swipeData.total || 0;

      if (!swipeData.items || swipeData.items.length === 0) {
        swipeList.innerHTML = `
          <div class="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-300 rounded-xl">
            Apasă pe butonul de salvare (⭐) dintr-o reclamă pentru a o adăuga în Swipe File.
          </div>
        `;
      } else {
        swipeList.innerHTML = swipeData.items.map(item => this.renderCard(item.ad, true)).join('');
      }
    } catch (err) {
      console.error('Error rendering swipe file in kanban:', err);
    }
  },

  renderCard(ad, isSwipe = false) {
    return `
      <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:shadow-xs transition cursor-pointer" onclick="window.App.openAdModal('${ad.id}')">
        <div class="flex items-center justify-between mb-2">
          <span class="font-bold text-xs text-slate-900">${ad.brand}</span>
          <span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">${ad.active_days}z active</span>
        </div>
        <p class="text-xs text-slate-800 font-semibold line-clamp-2 mb-2 leading-snug">"${ad.headline}"</p>
        <div class="flex items-center justify-between text-[10px] text-slate-400">
          <span>${(ad.format_label || 'Video').split(' ')[0]}</span>
          <span class="text-indigo-600 font-semibold">${ad.hook_type}</span>
        </div>
      </div>
    `;
  }
};

window.KanbanFunnel = KanbanFunnel;
