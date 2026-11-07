/**
 * Downstream AI Strategy Capsule Generator Module
 */

const StrategyGenerator = {
  currentFormat: 'copywriter',
  selectedAdId: null,

  setFormat(format) {
    this.currentFormat = format;

    const b1 = document.getElementById('btnStratCopy');
    const b2 = document.getElementById('btnStratUgc');
    const b3 = document.getElementById('btnStratJson');

    [b1, b2, b3].forEach(b => {
      if (b) {
        b.className = 'p-4 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-left shadow-2xs transition';
        const dot = b.querySelector('span:last-child');
        if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-transparent border border-slate-300';
      }
    });

    const activeBtn = format === 'copywriter' ? b1 : format === 'ugc' ? b2 : b3;
    if (activeBtn) {
      activeBtn.className = 'p-4 bg-white border-2 border-blue-600 rounded-xl text-left shadow-2xs transition';
      const dot = activeBtn.querySelector('span:last-child');
      if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-blue-600';
    }

    const titleEl = document.getElementById('promptTitle');
    if (titleEl) {
      titleEl.innerText = format === 'copywriter'
        ? 'Prompt Master Direct-Response pentru Claude 3.5 Sonnet / GPT-4o'
        : format === 'ugc'
        ? 'Storyboard & Script Video UGC 9:16 (0-60s) pentru Creatori'
        : 'Capsulă Structurată JSON (Gata pentru API, Make, n8n)';
    }

    this.generatePrompt();
  },

  async generatePrompt(adId = null) {
    if (adId) this.selectedAdId = adId;
    const targetAdId = this.selectedAdId || (window.App && window.App.currentAds[0] && window.App.currentAds[0].id);

    const output = document.getElementById('strategyPromptOutput');
    if (!output) return;

    output.value = 'Generez promptul optimizat bazat pe datele de longevitate...';

    try {
      const data = await window.API.generateStrategy(targetAdId, this.currentFormat);
      if (data.success && data.capsule) {
        if (this.currentFormat === 'json') {
          output.value = JSON.stringify(data.capsule.data, null, 2);
        } else {
          output.value = data.capsule.prompt;
        }
      }
    } catch (err) {
      console.error('Error generating strategy prompt:', err);
      output.value = 'Eroare la generarea promptului. Te rugăm să încerci din nou.';
    }
  },

  copyPrompt() {
    const output = document.getElementById('strategyPromptOutput');
    if (!output) return;

    navigator.clipboard.writeText(output.value).then(() => {
      const btnText = document.getElementById('copyPromptText');
      if (btnText) {
        btnText.innerText = 'Copiat cu Succes! ✓';
        setTimeout(() => { btnText.innerText = 'Copiază Promptul'; }, 2000);
      }
    });
  },

  downloadFile() {
    const output = document.getElementById('strategyPromptOutput');
    if (!output) return;

    const ext = this.currentFormat === 'json' ? 'json' : 'txt';
    const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meta_ad_strategy_${this.currentFormat}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

window.StrategyGenerator = StrategyGenerator;
