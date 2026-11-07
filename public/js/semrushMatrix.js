/**
 * Semrush Analytics & Competitor Matrix Module
 */

const SemrushMatrix = {
  async renderMatrix(niche = 'all') {
    const tbody = document.getElementById('matrixTableBody');
    if (!tbody) return;

    try {
      const data = await window.API.getBenchmarkMatrix(niche);
      if (!data.success) return;

      tbody.innerHTML = data.matrix.map(b => `
        <tr class="hover:bg-slate-50 transition">
          <td class="py-3 px-4 font-bold text-slate-900">${b.brand}</td>
          <td class="py-3 px-4">${b.totalActiveAds} Reclame</td>
          <td class="py-3 px-4"><span class="font-bold text-slate-800">${b.avgLongevityDays} zile</span></td>
          <td class="py-3 px-4">
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full" style="width: ${b.evergreenRatioPct}%"></div>
              </div>
              <span class="text-[11px] font-bold text-emerald-700">${b.evergreenRatioPct}%</span>
            </div>
          </td>
          <td class="py-3 px-4 text-blue-600 font-semibold">${b.videoSharePct}% Reels/UGC</td>
          <td class="py-3 px-4"><span class="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">${b.primaryHookType}</span></td>
          <td class="py-3 px-4"><span class="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold">${b.offerAggressiveness}</span></td>
        </tr>
      `).join('');
    } catch (err) {
      console.error('Error rendering benchmark matrix:', err);
    }
  },

  async renderKeywordCloud(niche = 'all') {
    const cloud = document.getElementById('keywordCloud');
    if (!cloud) return;

    try {
      const data = await window.API.getKeywordCloud(niche);
      if (!data.success) return;

      cloud.innerHTML = data.keywords.map(k => {
        let colorClass = 'bg-slate-100 text-slate-700';
        if (k.category === 'offer') colorClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold';
        if (k.category === 'fear' || k.category === 'pain') colorClass = 'bg-rose-50 text-rose-700 border border-rose-200 font-bold';
        if (k.category === 'curiosity') colorClass = 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold';

        return `
          <button onclick="window.App.searchByKeyword('${k.word}')" class="px-3 py-1 rounded-full text-xs font-medium ${colorClass} hover:opacity-80 transition cursor-pointer flex items-center space-x-1.5 shadow-2xs">
            <span>#${k.word}</span>
            <span class="text-[10px] opacity-60">(${k.count})</span>
          </button>
        `;
      }).join('');
    } catch (err) {
      console.error('Error rendering keyword cloud:', err);
    }
  },

  async renderVelocityChart() {
    const container = document.getElementById('velocityChartContainer');
    if (!container) return;

    try {
      const data = await window.API.getLaunchVelocity();
      if (!data.success) return;

      container.innerHTML = data.velocity.map(m => `
        <div class="flex-1 flex flex-col items-center justify-end h-full px-2 group cursor-pointer">
          <span class="text-[10px] font-bold text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition">${m.adsCount} reclame</span>
          <div class="w-full max-w-[42px] bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-indigo-600 shadow-xs" style="height: ${m.indexPct}%"></div>
        </div>
      `).join('');
    } catch (err) {
      console.error('Error rendering velocity chart:', err);
    }
  },

  async renderAdGapAnalysis() {
    const container = document.getElementById('adGapContainer');
    if (!container) return;

    try {
      const data = await window.API.getAdGapAnalysis();
      if (!data.success) return;

      container.innerHTML = data.gaps.map(g => `
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 hover:bg-white transition">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-slate-800">${g.angle}</span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">${g.opportunityScore}</span>
          </div>
          <p class="text-[11px] text-slate-500">${g.recommendation}</p>
        </div>
      `).join('');
    } catch (err) {
      console.error('Error rendering ad gap analysis:', err);
    }
  }
};

window.SemrushMatrix = SemrushMatrix;
