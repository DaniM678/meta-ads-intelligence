/**
 * Monday Board & Cards Module
 * Renders authentic Monday.com group-based tables and media cards
 */

const MondayBoard = {
  renderTable(ads, tbodyId = 'adsTableBody') {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;

    if (!ads || ads.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" class="py-12 text-center text-[#808191]">
            <p class="font-semibold text-sm">Nicio reclamă găsită pentru aceste criterii</p>
            <button onclick="window.App.resetFilters()" class="mt-2 text-xs text-[#0073ea] hover:underline font-bold">Resetează filtrele</button>
          </td>
        </tr>
      `;
      return;
    }

    // Split ads into Monday-style groups
    const scalingAds = ads.filter(a => a.active_days >= 45);
    const steadyAds = ads.filter(a => a.active_days >= 20 && a.active_days < 45);
    const testingAds = ads.filter(a => a.active_days < 20);

    let html = '';

    // Render Group 1: Scaling Winners
    if (scalingAds.length > 0) {
      html += this.renderGroupHeader('🔥 Scaling Winners (>45 zile active - Profit Asigurat)', '#00c875', scalingAds.length);
      html += scalingAds.map(ad => this.renderTableRow(ad, 'scaling')).join('');
    }

    // Render Group 2: Steady Performance
    if (steadyAds.length > 0) {
      html += this.renderGroupHeader('⚡ Steady Performance (20-45 zile active)', '#0086c0', steadyAds.length);
      html += steadyAds.map(ad => this.renderTableRow(ad, 'steady')).join('');
    }

    // Render Group 3: Testing / New Ads
    if (testingAds.length > 0) {
      html += this.renderGroupHeader('🔬 Testing / New Experiments (<20 zile active)', '#fdab3d', testingAds.length);
      html += testingAds.map(ad => this.renderTableRow(ad, 'testing')).join('');
    }

    tbody.innerHTML = html;
  },

  renderGroupHeader(title, color, count) {
    return `
      <tr class="bg-[#fcfdfe]">
        <td colspan="10" class="py-2.5 px-3 border-b border-[#d0d4e4]" style="border-left: 6px solid ${color};">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 cursor-pointer" style="color: ${color};" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
            <span class="font-bold text-xs" style="color: ${color};">${title}</span>
            <span class="text-[11px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-[#676879]">${count} Reclame</span>
          </div>
        </td>
      </tr>
    `;
  },

  renderTableRow(ad, groupType) {
    // Status pill based on Monday specs
    let statusClass = 'status-pill-scaling';
    let statusLabel = `Scaling (${ad.active_days}z)`;
    if (groupType === 'steady') {
      statusClass = 'status-pill-steady';
      statusLabel = `Steady (${ad.active_days}z)`;
    } else if (groupType === 'testing') {
      statusClass = 'status-pill-testing';
      statusLabel = `Testing (${ad.active_days}z)`;
    }

    return `
      <tr class="hover:bg-[#f7f9fd] transition cursor-pointer" onclick="window.App.openAdModal('${ad.id}')">
        <!-- Checkbox -->
        <td class="text-center" onclick="event.stopPropagation()">
          <input type="checkbox" class="rounded text-[#0073ea]">
        </td>

        <!-- Headline & Thumbnail -->
        <td class="py-2 px-3">
          <div class="flex items-center space-x-2.5">
            <img src="${ad.thumbnail_url}" class="w-8 h-8 rounded object-cover border border-[#d0d4e4] shrink-0">
            <div class="truncate">
              <span class="font-semibold text-xs text-[#323338] block truncate leading-snug">"${ad.headline}"</span>
              <span class="text-[11px] text-[#808191] truncate block">${(ad.offer || '').split('+')[0]}</span>
            </div>
          </div>
        </td>

        <!-- Brand -->
        <td class="text-center font-bold text-xs text-[#323338]">
          <span class="px-2 py-0.5 rounded bg-[#f0f3f9] text-[#323338] border border-[#d0d4e4]">${ad.brand}</span>
        </td>

        <!-- Monday Status Pill -->
        <td class="p-1">
          <div class="status-pill ${statusClass}">
            ${statusLabel}
          </div>
        </td>

        <!-- Hook Archetype Tag -->
        <td class="text-center">
          <span class="text-[11px] font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
            ${ad.hook_type}
          </span>
        </td>

        <!-- Format -->
        <td class="text-center text-[#676879] text-[11px] font-medium">
          ${(ad.format_label || 'Video').split(' ')[0]}
        </td>

        <!-- Platforms -->
        <td class="text-center text-[#676879] text-[11px]">
          ${(ad.publisher_platforms || ['Instagram'])[0]}
        </td>

        <!-- Iterations Count Badge -->
        <td class="text-center">
          <span class="px-2 py-0.5 rounded-full bg-blue-50 text-[#0073ea] font-bold text-[11px]">
            ${ad.iterations_count || 1}
          </span>
        </td>

        <!-- Estimated ROAS -->
        <td class="text-center font-bold text-emerald-700 text-xs">
          ${ad.estimated_roas || 8.5}x ROAS
        </td>

        <!-- Action Button -->
        <td class="text-center" onclick="event.stopPropagation()">
          <button onclick="window.App.openAdModal('${ad.id}')" class="px-2.5 py-1 rounded bg-[#f5f6fa] hover:bg-[#0073ea] hover:text-white text-[#323338] text-[11px] font-semibold transition border border-[#d0d4e4]">
            Detalii
          </button>
        </td>
      </tr>
    `;
  },

  renderGrid(ads, containerId = 'adsGridContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!ads || ads.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-lg border border-[#d0d4e4] p-8">
          <h4 class="text-sm font-bold text-[#323338]">Nicio reclamă găsită</h4>
          <p class="text-xs text-[#808191] mt-1">Resetează filtrele pentru a vizualiza toate reclamele.</p>
          <button onclick="window.App.resetFilters()" class="btn-monday-primary mt-3 text-xs">Resetează Filtrele</button>
        </div>
      `;
      return;
    }

    container.innerHTML = ads.map(ad => {
      let statusClass = 'status-pill-scaling';
      let statusLabel = `🔥 Scaling (${ad.active_days}z)`;
      if (ad.active_days < 20) {
        statusClass = 'status-pill-testing';
        statusLabel = `🔬 Testing (${ad.active_days}z)`;
      } else if (ad.active_days < 45) {
        statusClass = 'status-pill-steady';
        statusLabel = `⚡ Steady (${ad.active_days}z)`;
      }

      return `
        <div class="ad-card-hover bg-white border border-[#d0d4e4] rounded-lg overflow-hidden shadow-xs flex flex-col justify-between cursor-pointer" onclick="window.App.openAdModal('${ad.id}')">
          <div class="relative aspect-[4/3] bg-[#1e1f23] overflow-hidden">
            <img src="${ad.thumbnail_url}" alt="${ad.brand} Ad" class="w-full h-full object-cover transition duration-300 hover:scale-105" loading="lazy">
            
            <div class="absolute top-2 left-2">
              <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-white">
                ${(ad.format_label || 'Video').split(' ')[0]}
              </span>
            </div>

            <div class="absolute top-2 right-2">
              <span class="status-pill ${statusClass} px-2 py-0.5 text-[10px] h-auto">
                ${statusLabel}
              </span>
            </div>

            <div class="absolute bottom-2 left-2">
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#0073ea] text-white shadow-xs">
                ${ad.iterations_count || 1} iterații active
              </span>
            </div>
          </div>

          <div class="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
            <div>
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-bold text-[#323338]">${ad.brand}</span>
                <span class="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">${ad.hook_type}</span>
              </div>
              <h3 class="font-bold text-xs text-[#323338] line-clamp-2 leading-snug">
                "${ad.headline}"
              </h3>
              <p class="text-[11px] text-[#676879] line-clamp-2 mt-1 leading-relaxed">
                ${ad.primary_text}
              </p>
            </div>

            <div class="pt-2 border-t border-[#e6e9ef] flex items-center justify-between text-[11px]">
              <span class="font-semibold text-emerald-700 truncate pr-2">${(ad.offer || '').split('+')[0]}</span>
              <button onclick="event.stopPropagation(); window.App.openAdModal('${ad.id}')" class="px-2 py-1 bg-[#f5f6fa] hover:bg-[#0073ea] hover:text-white rounded text-[#323338] font-semibold transition border border-[#d0d4e4] shrink-0">
                Inspectează
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
};

window.MondayBoard = MondayBoard;
