/**
 * AI Spy Copilot Chat Module
 */

const AiCopilot = {
  conversationHistory: [],

  toggle() {
    const panel = document.getElementById('copilotPanel');
    if (!panel) return;
    panel.classList.toggle('hidden');
  },

  async sendMessage(text) {
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer || !text || !text.trim()) return;

    const userText = text.trim();

    // Append User Bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'flex items-start justify-end space-x-2';
    userBubble.innerHTML = `
      <div class="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-xs leading-relaxed max-w-[85%] shadow-2xs">
        ${userText}
      </div>
    `;
    chatContainer.appendChild(userBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Loading indicator
    const loadingBubble = document.createElement('div');
    loadingBubble.id = 'copilotLoading';
    loadingBubble.className = 'flex items-start space-x-2.5';
    loadingBubble.innerHTML = `
      <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">AI</div>
      <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 text-slate-500 text-xs flex items-center space-x-1.5 shadow-2xs">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 pulse-dot"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 pulse-dot" style="animation-delay: 0.2s"></span>
        <span class="w-1.5 h-1.5 rounded-full bg-blue-500 pulse-dot" style="animation-delay: 0.4s"></span>
        <span class="text-[11px] font-medium ml-1">Analizez reclamele competitorilor...</span>
      </div>
    `;
    chatContainer.appendChild(loadingBubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
      const data = await window.API.sendCopilotMessage(userText, this.conversationHistory);
      const loader = document.getElementById('copilotLoading');
      if (loader) loader.remove();

      if (data.success) {
        this.conversationHistory.push({ role: 'user', content: userText });
        this.conversationHistory.push({ role: 'assistant', content: data.reply });

        // Format Markdown basic tags (###, **, *, tables)
        const formatted = this.formatMarkdown(data.reply);

        const aiBubble = document.createElement('div');
        aiBubble.className = 'flex items-start space-x-2.5';
        aiBubble.innerHTML = `
          <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">AI</div>
          <div class="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200 shadow-2xs text-slate-800 leading-relaxed text-xs space-y-2 max-w-[90%] overflow-x-auto">
            ${formatted}
          </div>
        `;
        chatContainer.appendChild(aiBubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Handle Action Triggers
        if (data.action) {
          this.executeActionTrigger(data.action);
        }
      }
    } catch (err) {
      console.error('Copilot error:', err);
      const loader = document.getElementById('copilotLoading');
      if (loader) loader.remove();
    }
  },

  executeActionTrigger(action) {
    if (action.type === 'switch_tab' && action.tab) {
      window.App.switchTab(action.tab);
    } else if (action.type === 'filter' && action.filter) {
      if (action.filter.longevity) window.App.setLongevityFilter(action.filter.longevity);
      if (action.filter.niche) {
        const nicheSel = document.getElementById('nicheSelect');
        if (nicheSel) nicheSel.value = action.filter.niche;
        window.App.applyFilters();
      }
    } else if (action.type === 'highlight_ads' && action.adIds) {
      // Smooth scroll to top of ads
      const mainScroll = document.getElementById('mainScrollArea');
      if (mainScroll) mainScroll.scrollTop = 0;
    }
  },

  formatMarkdown(text) {
    return text
      .replace(/^### (.*$)/gim, '<h4 class="font-bold text-slate-900 text-xs mt-2 mb-1">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 class="font-bold text-slate-900 text-sm mt-2 mb-1">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }
};

window.AiCopilot = AiCopilot;
