/**
 * Swipe File & Moodboard Store Service
 * Allows users to bookmark winning competitor ads, tag them,
 * and export their curated swipe file.
 */

const metaAdsService = require('./metaAdsService');

class SwipeService {
  constructor() {
    this.swipeMap = new Map();
    // Pre-populate with 1 exemplary winner
    const firstAd = metaAdsService.cachedAds[0];
    if (firstAd) {
      this.swipeMap.set(firstAd.id, {
        ad: firstAd,
        savedAt: new Date().toISOString(),
        notes: 'Unghi excelent de atac al problemei (squat-proof). De replicat pentru produsele noastre.',
        tags: ['Hook Inspirant', 'Must-Model']
      });
    }
  }

  getAll() {
    return Array.from(this.swipeMap.values());
  }

  add(adId, notes = '', tags = []) {
    const ad = metaAdsService.getAdById(adId);
    if (!ad) throw new Error('Reclama nu a fost găsită');

    const entry = {
      ad,
      savedAt: new Date().toISOString(),
      notes: notes || 'Salvat pentru inspirație în campanii viitoare.',
      tags: tags.length ? tags : ['Swipe Favorite']
    };

    this.swipeMap.set(adId, entry);
    return entry;
  }

  remove(adId) {
    return this.swipeMap.delete(adId);
  }

  has(adId) {
    return this.swipeMap.has(adId);
  }

  exportMarkdown() {
    const items = this.getAll();
    let md = `# Competitor Ads Swipe File & Creative Inspiration\n\n`;
    md += `Exportat: ${new Date().toLocaleDateString('ro-RO')} | Total Reclame Salvate: ${items.length}\n\n---\n\n`;

    items.forEach((item, index) => {
      const a = item.ad;
      md += `## ${index + 1}. [${a.brand}] "${a.headline}"\n\n`;
      md += `- **Longevitate Activă:** ${a.active_days} zile (${a.status.toUpperCase()})\n`;
      md += `- **Unghi Psihologic:** ${a.hook_type}\n`;
      md += `- **Format:** ${a.format_label}\n`;
      md += `- **Ofertă & Risc:** ${a.offer} (${a.risk_reversal})\n`;
      md += `- **Notițe Interne:** *${item.notes}*\n\n`;
      md += `### Textul Reclamei:\n> ${a.primary_text.replace(/\n/g, '\n> ')}\n\n`;
      md += `---\n\n`;
    });

    return md;
  }
}

module.exports = new SwipeService();
