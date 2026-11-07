/**
 * Sunlight Researcher - Autonomous Multi-Agent AI Team Interface
 */

const AgentTeam = {
  agents: [],
  logs: [],

  async init() {
    await this.loadData();
    this.render();
  },

  async loadData() {
    try {
      const [resAgents, resLogs] = await Promise.all([
        window.API.fetchAgents(),
        window.API.fetchAgentLogs()
      ]);
      if (resAgents.success) this.agents = resAgents.agents;
      if (resLogs.success) this.logs = resLogs.logs;
    } catch (err) {
      console.error('Error loading agent team data:', err);
    }
  },

  render() {
    const container = document.getElementById('agentTeamContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Team Overview Banner -->
        <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400 pulse-dot"></span>
                <span>5 Agenți AI Autonomi Activi</span>
              </div>
              <h2 class="text-2xl font-bold font-heading">Echipa Autonomă de Intelligence & Optimizare</h2>
              <p class="text-white/90 text-sm mt-1 max-w-2xl">
                Agenți AI specializați care analizează continuu marile branduri de nișă, identifică audiențe cu conversie ridicată, construiesc texte de impact și prognozează tendințele viitoare.
              </p>
            </div>
            <button onclick="window.AgentTeam.runInvestigationModal()" class="bg-white text-amber-700 hover:bg-amber-50 font-bold px-5 py-2.5 rounded-xl shadow-md transition text-xs flex items-center space-x-2 shrink-0 cursor-pointer">
              <span>⚡</span>
              <span>Lansează Investigație Nouă</span>
            </button>
          </div>
        </div>

        <!-- 5 Agent Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${this.agents.map(a => `
            <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition">
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs" style="background-color: ${a.badgeColor}15; color: ${a.badgeColor};">
                    ${a.avatar}
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-900 font-heading text-sm">${a.name}</h3>
                    <p class="text-xs text-slate-500 font-medium">${a.role}</p>
                  </div>
                </div>
                <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot"></span>
                  <span>Activ</span>
                </span>
              </div>

              <p class="text-xs text-slate-600 mt-3 leading-relaxed">
                ${a.specialization}
              </p>

              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div class="flex items-center space-x-1 text-slate-500">
                  <span>Sarcini finalizate:</span>
                  <span class="font-bold text-slate-800">${a.tasksCompleted}</span>
                </div>
                <div class="text-[11px] text-amber-600 font-semibold truncate max-w-[150px]">
                  ${a.currentTask}
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Live Activity Log -->
        <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold font-heading text-slate-900 flex items-center space-x-2">
              <span>📡 Jurnal de Activitate & Decizii AI în Timp Real</span>
            </h3>
            <span class="text-xs text-slate-400">Actualizat la fiecare acțiune</span>
          </div>

          <div class="space-y-2.5">
            ${this.logs.map(log => `
              <div class="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <span class="text-amber-500 font-bold mt-0.5">✦</span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-800">${log.agent}</span>
                    <span class="text-[11px] text-slate-400">${new Date(log.timestamp).toLocaleTimeString('ro-RO')}</span>
                  </div>
                  <p class="text-slate-600 mt-0.5">${log.message}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  async runInvestigationModal() {
    const topic = prompt('Introdu subiectul sau competitorul pe care vrei ca echipa de agenți să îl investigheze:', 'Strategii scalare Reels fitness');
    if (!topic) return;

    try {
      const res = await window.API.investigateAgentTeam(topic, window.App.filters.niche);
      if (res.success) {
        alert(res.summary);
        await this.loadData();
        this.render();
      }
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  }
};

window.AgentTeam = AgentTeam;
