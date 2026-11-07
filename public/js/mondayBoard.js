/**
 * Monday Board & Cards Module
 * Renders the visual ad cards and Monday-style compact table
 */

const MondayBoard = {
  renderGrid(ads, containerId = 'adsGridContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!ads || ads.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 p-8">
          <svg class="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h4 class="text-sm font-bold text-slate-700">Nicio reclamă găsită pentru aceste filtre</h4>
          <p class="text-xs text-slate-400 mt-1">Încearcă să resetezi filtrele sau să cauți alt termen.</p>
          <button onclick="window.App.resetFilters()" class="mt-4 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition">
            Resetează Filtrele
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = ads.map(ad => {
      // Longevity badge
      let statusBadge = '';
      if (ad.active_days >= 45) {
        statusBadge = `<span class="monday-badge px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300">🔥 Scaling (${ad.active_days}z)</span>`;
      } else if (ad.active_days >= 20) {
        statusBadge = `<span class="monday-badge px-2 py-0.5 text-[10px] bg-indigo-100 text-indigo-800 border border-indigo-300">⚡ Steady (${ad.active_days}z)</span>`;
      } else {
        statusBadge = `<span class="monday-badge px-2 py-0.5 text-[10px] bg-amber-100 text-amber-800 border border-amber-300">🔬 Testing (${ad.active_days}z)</span>`;
      }

      return `
        <div class="ad-card-hover bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between cursor-pointer" onclick="window.App.openAdModal('${ad.id}')">
          <!-- Thumbnail & Badges -->
          <div class="relative aspect-[4/3] bg-slate-900 overflow-hidden">
            <img src="${ad.thumbnail_url}" alt="${ad.brand} Ad" class="w-full h-full object-cover transition duration-300 hover:scale-105" loading="lazy">
            
            <div class="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white">
                ${(ad.format_label || 'Video').split(' ')[0]}
              </span>
            </div>

            <div class="absolute top-2.5 right-2.5">
              ${statusBadge}
            </div>

            <!-- Iterations count pill (Validation of creative clustering) -->
            <div class="absolute bottom-2.5 left-2.5">
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-600/90 text-white backdrop-blur-xs shadow-xs">
                ${ad.iterations_count || 1} iterații active
              </span>
            </div>
          </div>

          <!-- Content Details -->
          <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div class="flex items-center justify-between text-xs mb-1.5">
                <span class="font-bold text-slate-900">${ad.brand}</span>
                <span class="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">${ad.hook_type}</span>
              </div>
              <h3 class="font-bold text-xs text-slate-800 line-clamp-2 leading-snug">
                "${ad.headline}"
              </h3>
              <p class="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                ${ad.primary_text}
              </p>
            </div>

            <!-- Offer & Inspect -->
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div class="truncate pr-2">
                <span class="text-slate-400 block text-[10px]">Ofertă:</span>
                <span class="font-semibold text-emerald-700 truncate block">${(ad.offer || '').split('+')[0]}</span>
              </div>
              <button onclick="event.stopPropagation(); window.App.openAdModal('${ad.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-md text-slate-700 font-semibold transition shrink-0">
                Inspectează
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  renderTable(ads, tbodyId = 'adsTableBody') {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    tbody.innerHTML = (ads || []).map(ad => {
      let statusBadge = ad.active_days >= 45 
        ? `<span class="monday-badge px-2 py-0.5 text-[11px] bg-emerald-100 text-emerald-800">${ad.active_days} zile (Scaling)</span>`
        : ad.active_days >= 20
        ? `<span class="monday-badge px-2 py-0.5 text-[11px] bg-indigo-100 text-indigo-800">${ad.active_days} zile (Steady)</span>`
        : `<span class="monday-badge px-2 py-0.5 text-[11px] bg-amber-100 text-amber-800">${ad.active_days} zile (Testare)</span>`;

      return `
        <tr class="hover:bg-slate-50/80 transition cursor-pointer" onclick="window.App.openAdModal('${ad.id}')">
          <td class="py-2.5 px-4">
            <img src="${ad.thumbnail_url}" class="w-10 h-10 rounded-lg object-cover border border-slate-200">
          </td>
          <td class="py-2.5 px-4 font-bold text-slate-900">${ad.brand}</td>
          <td class="py-2.5 px-4">${statusBadge}</td>
          <td class="py-2.5 px-4 max-w-xs truncate font-medium text-slate-800">"${ad.headline}"</td>
          <td class="py-2.5 px-4">
            <span class="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[11px] font-semibold">${ad.hook_type}</span>
          </td>
          <td class="py-2.5 px-4 text-slate-500 text-[11px]">${(ad.publisher_platforms || ['Facebook'])[0]}</td>
          <td class="py-2.5 px-4 text-emerald-700 font-medium truncate max-w-xs">${ad.cta_text || 'Shop Now'}</td>
          <td class="py-2.5 px-4 text-right">
            <button onclick="event.stopPropagation(); window.App.openAdModal('${ad.id}')" class="text-blue-600 hover:text-blue-800 font-bold">Detalii &rarr;</button>
          </td>
        </tr>
      `;
    }).join('');
  }
};

window.MondayBoard = MondayBoard;
