/**
 * Sunlight Researcher - Campaign Intelligence & Builder UI Module
 * End-to-end intelligence for Meta Ads & Google Ads campaigns
 */

const CampaignBuilder = {
  currentBlueprint: null,
  activeSubTab: 'audiences', // 'audiences', 'copy', 'hooks', 'trends'

  async init() {
    await this.generate();
  },

  setSubTab(subTab) {
    this.activeSubTab = subTab;
    this.renderBlueprint();
  },

  async generate() {
    const nicheEl = document.getElementById('campNicheSelect');
    const productEl = document.getElementById('campProductInput');
    const goalEl = document.getElementById('campGoalSelect');
    const platformEl = document.getElementById('campPlatformSelect');

    const niche = nicheEl ? nicheEl.value : 'fitness';
    const productName = productEl ? productEl.value.trim() : '';
    const targetGoal = goalEl ? goalEl.value : 'sales';
    const platform = platformEl ? platformEl.value : 'both';

    const container = document.getElementById('campaignBlueprintContainer');
    if (container) {
      container.innerHTML = `
        <div class="py-12 flex flex-col items-center justify-center text-slate-500">
          <div class="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p class="text-sm font-semibold">Echipa de agenți AI sintetizează audiențele, textele și premonițiile...</p>
        </div>
      `;
    }

    try {
      const blueprint = await window.API.generateCampaignBlueprint({
        niche,
        productName,
        targetGoal,
        platform,
        country: 'RO'
      });

      if (blueprint.success) {
        this.currentBlueprint = blueprint;
        this.renderBlueprint();
      }
    } catch (err) {
      if (container) {
        container.innerHTML = `<div class="p-6 text-red-600 bg-red-50 rounded-xl">Eroare la generarea strategiei: ${err.message}</div>`;
      }
    }
  },

  renderBlueprint() {
    const container = document.getElementById('campaignBlueprintContainer');
    if (!container || !this.currentBlueprint) return;

    const bp = this.currentBlueprint;
    const { audiences, copySuite, topViewsSignals, currentTrends, futurePredictions, metadata } = bp;

    const subTabs = [
      { id: 'audiences', label: '🎯 Audiențe & Țintire', badge: 'Meta & Google' },
      { id: 'copy', label: '✍️ Texte & Reclame', badge: 'Gata de copiat' },
      { id: 'hooks', label: '👀 Ce Prinde Cel Mai Bine', badge: 'Top Vizionări' },
      { id: 'trends', label: '🔮 Tendințe & Premoniții', badge: 'Next 30-90z' }
    ];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Blueprint Header Info -->
        <div class="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg border border-slate-800">
          <div>
            <div class="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <span>✦ Sunlight Campaign Intelligence Blueprint</span>
              <span>•</span>
              <span class="text-slate-400">Nișa: ${metadata.niche.toUpperCase()}</span>
            </div>
            <h2 class="text-xl font-bold font-heading text-white">
              Strategie Completă: ${metadata.productName}
            </h2>
            <p class="text-xs text-slate-300 mt-1">
              Validată prin analiza competitorilor cu peste 45 zile de rulare continuă pe Meta Ads Library și volume Google Search.
            </p>
          </div>

          <div class="flex items-center space-x-3 shrink-0">
            <button onclick="window.CampaignBuilder.copyAllBlueprint()" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition cursor-pointer">
              <span>📋</span>
              <span>Copiază Tot Pachetul</span>
            </button>
          </div>
        </div>

        <!-- Sub Tabs Navigation -->
        <div class="flex border-b border-slate-200 space-x-2 bg-slate-50 p-1.5 rounded-xl">
          ${subTabs.map(t => `
            <button onclick="window.CampaignBuilder.setSubTab('${t.id}')" class="flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer ${this.activeSubTab === t.id ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'}">
              <span>${t.label}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded ${this.activeSubTab === t.id ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-200 text-slate-600'}">${t.badge}</span>
            </button>
          `).join('')}
        </div>

        <!-- Sub Tab Content Area -->
        <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          ${this.renderSubTabContent(this.activeSubTab, bp)}
        </div>
      </div>
    `;
  },

  renderSubTabContent(subTab, bp) {
    if (subTab === 'audiences') {
      const meta = bp.audiences.metaAds;
      const google = bp.audiences.googleAds;

      return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Meta Ads Targeting Column -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2 pb-3 border-b border-slate-200">
              <span class="text-xl">🔵</span>
              <div>
                <h3 class="font-bold text-slate-900 font-heading text-sm">Țintire Meta Ads (Facebook & Instagram)</h3>
                <p class="text-xs text-slate-500">Demografice, interese afiliate și segmente Lookalike</p>
              </div>
            </div>

            <div class="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              <div class="flex justify-between"><span class="font-semibold text-slate-700">Interval Vârstă:</span><span class="font-bold text-slate-900">${meta.demographics.ageRange}</span></div>
              <div class="flex justify-between"><span class="font-semibold text-slate-700">Distribuție Sex:</span><span class="font-bold text-slate-900">${meta.demographics.gender}</span></div>
              <div class="flex justify-between"><span class="font-semibold text-slate-700">Locație Geografică:</span><span class="font-bold text-slate-900 text-right">${meta.demographics.locations}</span></div>
            </div>

            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Interese Detaliate Validate (Stacking):</h4>
              <div class="space-y-2">
                ${meta.detailedInterests.map(i => `
                  <div class="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/50 border border-blue-100 text-xs">
                    <div>
                      <span class="font-bold text-slate-800">${i.name}</span>
                      <span class="text-[11px] text-blue-700 ml-2 font-medium">(${i.intent})</span>
                    </div>
                    <span class="text-[11px] bg-white px-2 py-0.5 rounded font-semibold text-slate-600 border border-blue-200">${i.size}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Comportamente & Lookalikes Recomandate:</h4>
              <ul class="space-y-1.5 text-xs text-slate-700">
                ${meta.behaviorsAndLal.map(b => `
                  <li class="flex items-start space-x-2">
                    <span class="text-emerald-500 font-bold">✓</span>
                    <span>${b}</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="p-3 bg-red-50 rounded-xl border border-red-100 text-xs">
              <span class="font-bold text-red-800">🚫 Excluderi Obligatorii (Economisire Buget):</span>
              <p class="text-red-700 mt-0.5">${meta.exclusions.join(', ')}</p>
            </div>
          </div>

          <!-- Google Ads Targeting Column -->
          <div class="space-y-4">
            <div class="flex items-center space-x-2 pb-3 border-b border-slate-200">
              <span class="text-xl">🔴</span>
              <div>
                <h3 class="font-bold text-slate-900 font-heading text-sm">Țintire Google Ads (Search & In-Market)</h3>
                <p class="text-xs text-slate-500">Cuvinte cheie de intenție comercială ridicată</p>
              </div>
            </div>

            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Cuvinte Cheie cu Intenție de Cumpărare:</h4>
              <div class="space-y-2">
                ${google.searchIntentKeywords.map(k => `
                  <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <code class="font-bold text-slate-900 text-[13px]">${k.keyword}</code>
                      <span class="text-[10px] ml-2 px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">${k.matchType}</span>
                    </div>
                    <div class="text-right">
                      <div class="font-bold text-slate-800 text-[11px]">${k.volume}</div>
                      <div class="text-[10px] text-slate-500">CPC: ${k.cpcEstimate}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Segmente In-Market Google:</h4>
              <div class="flex flex-wrap gap-1.5">
                ${google.inMarketAudiences.map(im => `
                  <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">${im}</span>
                `).join('')}
              </div>
            </div>

            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <span class="font-bold text-amber-900">⛔ Listă Cuvinte Cheie Negative (Negative Keywords):</span>
              <p class="text-amber-800 mt-1 font-mono text-[11px] leading-relaxed">${google.negativeKeywords.join(', ')}</p>
            </div>
          </div>
        </div>
      `;
    }

    if (subTab === 'copy') {
      const meta = bp.copySuite.metaAds;
      const google = bp.copySuite.googleAds;

      return `
        <div class="space-y-8">
          <!-- Meta Ads Copy Section -->
          <div>
            <h3 class="text-sm font-bold font-heading text-slate-900 mb-4 flex items-center space-x-2">
              <span class="text-blue-600">●</span>
              <span>Variante de Text Meta Ads (Feed & Reels)</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Variant 1: UGC Scurt -->
              <div class="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Format 1: UGC Scurt</span>
                    <button onclick="navigator.clipboard.writeText(\`${meta.shortFormUgc.primaryText}\`); alert('Copiat!');" class="text-xs text-blue-600 hover:underline cursor-pointer">Copiază</button>
                  </div>
                  <h4 class="font-bold text-slate-900 text-xs mb-2">"${meta.shortFormUgc.headline}"</h4>
                  <p class="text-xs text-slate-700 whitespace-pre-line leading-relaxed mb-3">${meta.shortFormUgc.primaryText}</p>
                </div>
                <div class="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-semibold">
                  CTA: <span class="text-slate-900">${meta.shortFormUgc.cta}</span>
                </div>
              </div>

              <!-- Variant 2: Storytelling Emotional -->
              <div class="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">Format 2: Storytelling Emoțional</span>
                    <button onclick="navigator.clipboard.writeText(\`${meta.storytellingForm.primaryText}\`); alert('Copiat!');" class="text-xs text-blue-600 hover:underline cursor-pointer">Copiază</button>
                  </div>
                  <h4 class="font-bold text-slate-900 text-xs mb-2">"${meta.storytellingForm.headline}"</h4>
                  <p class="text-xs text-slate-700 whitespace-pre-line leading-relaxed mb-3">${meta.storytellingForm.primaryText}</p>
                </div>
                <div class="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-semibold">
                  CTA: <span class="text-slate-900">${meta.storytellingForm.cta}</span>
                </div>
              </div>

              <!-- Variant 3: Direct Offer -->
              <div class="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Format 3: Ofertă Directă</span>
                    <button onclick="navigator.clipboard.writeText(\`${meta.directOfferForm.primaryText}\`); alert('Copiat!');" class="text-xs text-blue-600 hover:underline cursor-pointer">Copiază</button>
                  </div>
                  <h4 class="font-bold text-slate-900 text-xs mb-2">"${meta.directOfferForm.headline}"</h4>
                  <p class="text-xs text-slate-700 whitespace-pre-line leading-relaxed mb-3">${meta.directOfferForm.primaryText}</p>
                </div>
                <div class="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-semibold">
                  CTA: <span class="text-slate-900">${meta.directOfferForm.cta}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Google Ads Responsive Suite -->
          <div class="pt-6 border-t border-slate-200">
            <h3 class="text-sm font-bold font-heading text-slate-900 mb-4 flex items-center space-x-2">
              <span class="text-red-600">●</span>
              <span>Pachet Google Responsive Search Ads (15 Titluri & 4 Descrieri)</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">15 Titluri Responsive (Max 30 Caractere):</h4>
                <div class="space-y-1.5 max-h-60 overflow-y-auto pr-2">
                  ${google.responsiveHeadlines.map((h, idx) => `
                    <div class="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                      <span class="font-medium text-slate-800">${idx + 1}. ${h}</span>
                      <span class="text-[10px] text-slate-400 font-mono">${h.length}/30</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">4 Descrieri Responsive (Max 90 Caractere):</h4>
                <div class="space-y-2">
                  ${google.responsiveDescriptions.map((d, idx) => `
                    <div class="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs">
                      <div class="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                        <span>Descrierea #${idx + 1}</span>
                        <span>${d.length}/90</span>
                      </div>
                      <p class="text-slate-800 leading-relaxed font-medium">${d}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (subTab === 'hooks') {
      const hooks = bp.topViewsSignals;

      return `
        <div class="space-y-6">
          <div class="bg-amber-50 rounded-xl p-4 border border-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-800">Formatul Câștigător Confirmat:</span>
              <h4 class="text-base font-bold text-amber-950 font-heading">${hooks.topViewedCreativeType}</h4>
              <p class="text-xs text-amber-900 mt-0.5">Obiectiv retenție: ${hooks.averageWatchTimeGoal}</p>
            </div>
            <div class="text-xs text-amber-900 bg-white/80 p-3 rounded-lg border border-amber-200 max-w-sm">
              <span class="font-bold">⚠️ Atenție la Creative Fatigue:</span>
              <p class="mt-0.5">${hooks.creativeFatigueWarning}</p>
            </div>
          </div>

          <h3 class="text-sm font-bold font-heading text-slate-900">
            Top 3 Hook-uri Vizuale & Auditive cu Cea Mai Mare Rată de Vizionare:
          </h3>

          <div class="space-y-4">
            ${hooks.winningHookArchetypes.map(h => `
              <div class="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-xs">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-2">
                    <span class="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">#${h.rank}</span>
                    <h4 class="font-bold text-slate-900 text-sm font-heading">${h.name}</h4>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Retenție Medie: ${h.viewThroughRate}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div class="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span class="font-bold text-slate-600 block mb-1">🎥 Cadrul Vizual (Secundele 0-3):</span>
                    <p class="text-slate-800">${h.visual}</p>
                  </div>
                  <div class="p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                    <span class="font-bold text-blue-800 block mb-1">💬 Script Audio / Voiceover:</span>
                    <p class="text-blue-950 font-medium italic">${h.audioHook}</p>
                  </div>
                </div>

                <div class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <span class="font-semibold text-slate-800">Mecanism psihologic de conversie:</span> ${h.whyItConverts}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (subTab === 'trends') {
      const trends = bp.currentTrends;
      const future = bp.futurePredictions;

      return `
        <div class="space-y-8">
          <!-- Current Market Trends -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Perioada Curentă</span>
                <h3 class="text-base font-bold font-heading text-slate-900">Ce Se Caută Cel Mai Mult în Prezent</h3>
              </div>
              <span class="text-xs bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full border border-blue-200">
                Piața Românească & Internațională
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              ${trends.trendingSearchQueries.map(q => `
                <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span class="text-[11px] font-semibold text-emerald-600 font-mono">${q.growth}</span>
                  <h4 class="font-bold text-slate-900 text-xs mt-1 truncate">"${q.term}"</h4>
                  <div class="text-xs text-slate-500 mt-2 font-medium">Volum: <span class="font-bold text-slate-800">${q.monthlySearches}</span> căutări/lună</div>
                </div>
              `).join('')}
            </div>

            <!-- Emotional Drivers -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Top Declanșatori Emoționali ai Cumpărătorilor:</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${trends.emotionalDrivers.map(d => `
                  <div>
                    <div class="flex justify-between text-xs mb-1">
                      <span class="font-bold text-slate-800">${d.driver}</span>
                      <span class="text-amber-600 font-bold">${d.strength}%</span>
                    </div>
                    <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${d.strength}%"></div>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-1">${d.detail}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Future Predictions & Forecasts ("Premonitii") -->
          <div class="pt-6 border-t border-slate-200">
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-purple-600">Inteligență Predictivă</span>
                <h3 class="text-base font-bold font-heading text-slate-900">🔮 Premoniții Strategice pentru Următoarele 30-90 Zile</h3>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-purple-900 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  Scor Oportunitate: ${future.overallOpportunityScore}/100
                </span>
              </div>
            </div>

            <div class="space-y-4">
              ${future.keyForecasts.map(f => `
                <div class="p-5 rounded-xl border border-purple-100 bg-gradient-to-r from-purple-50/40 to-transparent">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-bold text-slate-900 text-sm font-heading">${f.title}</h4>
                    <span class="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">${f.probability}</span>
                  </div>
                  <p class="text-xs text-slate-700 leading-relaxed mb-3">${f.forecast}</p>
                  <div class="p-3 bg-white rounded-lg border border-purple-200 text-xs">
                    <span class="font-bold text-purple-900">🚀 Acțiune Recomandată:</span>
                    <span class="text-slate-800 ml-1 font-medium">${f.strategicAction}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    return '';
  },

  copyAllBlueprint() {
    if (!this.currentBlueprint) return;
    const text = JSON.stringify(this.currentBlueprint, null, 2);
    navigator.clipboard.writeText(text);
    alert('Întregul pachet strategic a fost copiat în clipboard!');
  }
};

window.CampaignBuilder = CampaignBuilder;
