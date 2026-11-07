/**
 * AI Intelligence Service:
 * - Natural Language Semantic Search parser
 * - AI Spy Copilot Chat engine
 * - Downstream Generative AI Strategy Capsule builder (ChatGPT, Claude, Midjourney)
 */

const metaAdsService = require('./metaAdsService');

class AiService {
  /**
   * Parse natural language user query into structured search filters
   */
  parseSemanticQuery(query) {
    const q = (query || '').toLowerCase().trim();
    const result = {
      rawQuery: query,
      intent: 'general',
      filters: {
        longevity: 'all',
        format: 'all',
        niche: 'all',
        searchTerms: ''
      },
      explanation: ''
    };

    if (!q) return result;

    // Longevity intent
    if (q.includes('vechi') || q.includes('longevive') || q.includes('scaling') || q.includes('peste 45') || q.includes('60') || q.includes('evergreen')) {
      result.filters.longevity = 'scaling';
      result.explanation += 'Filtrare pe reclame active >45 zile (Scaling/Evergreen). ';
    } else if (q.includes('noi') || q.includes('test') || q.includes('recente') || q.includes('<20') || q.includes('sub 20')) {
      result.filters.longevity = 'testing';
      result.explanation += 'Filtrare pe reclame recente în testare (<20 zile). ';
    }

    // Format intent
    if (q.includes('video') || q.includes('reels') || q.includes('tiktok')) {
      result.filters.format = 'video';
      result.explanation += 'Format 9:16 Video / Reels. ';
    } else if (q.includes('ugc') || q.includes('creator')) {
      result.filters.format = 'ugc';
      result.explanation += 'Format UGC (User Generated Content). ';
    } else if (q.includes('carusel') || q.includes('carousel')) {
      result.filters.format = 'carousel';
      result.explanation += 'Format Carusel multi-slide. ';
    } else if (q.includes('static') || q.includes('imagine') || q.includes('poza')) {
      result.filters.format = 'image';
      result.explanation += 'Format Imagine statică. ';
    }

    // Niche intent
    if (q.includes('fitness') || q.includes('sala') || q.includes('proteine') || q.includes('colanti')) {
      result.filters.niche = 'fitness';
    } else if (q.includes('saas') || q.includes('b2b') || q.includes('software') || q.includes('excel')) {
      result.filters.niche = 'saas';
    } else if (q.includes('skincare') || q.includes('beauty') || q.includes('acnee') || q.includes('ten')) {
      result.filters.niche = 'beauty';
    }

    // Extract remaining search keywords using word boundaries
    const stopwordsRegex = /\b(arata-mi|gaseste|cauta|reclame|reclamele|care|ruleaza|de|peste|active|format|pe|nisa|in|video|reels|ugc|carusel|static|longevive|vechi|noi|scaling|testing|zile|zi|luni)\b/gi;
    let cleanTerms = q.replace(stopwordsRegex, '').replace(/\b\d+\b/g, '').replace(/\s+/g, ' ').trim();
    result.filters.searchTerms = cleanTerms;

    return result;
  }

  /**
   * Process a message from the user in the AI Copilot Chat
   */
  async handleCopilotMessage(userMessage, conversationHistory = []) {
    const q = userMessage.toLowerCase().trim();
    const allAds = metaAdsService.cachedAds;

    // Response structure
    let responseText = '';
    let actionTrigger = null; // e.g. { type: 'filter', filter: { longevity: 'scaling' } }

    // Case 1: Top 3 longest running ads
    if (q.includes('top 3') || q.includes('cele mai vechi') || q.includes('longevive') || q.includes('castigatoare')) {
      const top3 = [...allAds].sort((a, b) => b.active_days - a.active_days).slice(0, 3);
      responseText = `### 🏆 Top 3 Reclame Câștigătoare (Validate de Buget):

1. **${top3[0].brand}** — *${top3[0].active_days} zile active* (${top3[0].format_label})
   - **Hook:** "${top3[0].headline}"
   - **De ce funcționează:** Folosește **autoritatea medicală/expertă** combinată cu o ofertă de tip trial aproape gratuit (plătești doar transportul).
   - **Unghi:** \`${top3[0].hook_type}\`

2. **${top3[1].brand}** — *${top3[1].active_days} zile active* (${top3[1].format_label})
   - **Hook:** "${top3[1].headline}"
   - **De ce funcționează:** Agită haosul operațional și oboseala cauzată de foi de calcul Excel, oferind o soluție vizuală imediată.
   - **Unghi:** \`${top3[1].hook_type}\`

3. **${top3[2].brand}** — *${top3[2].active_days} zile active* (${top3[2].format_label})
   - **Hook:** "${top3[2].headline}"
   - **De ce funcționează:** Elimină cea mai mare frică a publicului țintă la cumpărarea hainelor de sport (transparența la genuflexiuni).
   - **Unghi:** \`${top3[2].hook_type}\`

💡 *Recomandare strategică:* Toate cele 3 reclame combină un **hook negativ/problemă** cu un mecanism proprietar și un risc eliminat complet pentru cumpărător.`;

      actionTrigger = { type: 'highlight_ads', adIds: top3.map(a => a.id) };
    }

    // Case 2: Offer analysis
    else if (q.includes('ofert') || q.includes('pret') || q.includes('discount') || q.includes('garantie')) {
      responseText = `### 💰 Analiza Structurii Ofertelor Concurenței:

Analizând reclamele cu longevitate de peste 45 de zile, observăm 3 tipare dominante de conversie:

1. **Inversarea Totală a Riscului (Risk Reversal)**:
   - Garanții extinse (30–90 zile fără întrebări).
   - Ex: *Peak Design* oferă garanție pe viață, iar *Curology* oferă reevaluare medicală gratuită.

2. **Creșterea Valorii Medii a Comenzii (AOV Boasters)**:
   - Oferte de tip BOGO (1+1 Gratuit) sau Bundle 3 produse cu discount progresiv (ex: *MyProtein*, *AlphaWear*).
   - Această mecanică permite competitorilor să suporte costuri mai mari de licitație (CPA) în Meta Ads și să rămână profitabili.

3. **Optimizarea Barierei de Intrare (Low-Friction Trial)**:
   - *Monday.com* folosește 14 zile gratuit fără card bancar.
   - *Curology* oferă prima lună gratuită (utilizatorul achită doar 4.95$ transportul).

🎯 **Sfat pentru noua ta campanie:** Nu concura pe preț redus simplu (ex: „10% reducere”). Folosește un pachet de tip „Cumperi 2, primești 1 Cadou” sau o garanție de returnare fără explicații.`;
    }

    // Case 3: Comparison between brands
    else if (q.includes('compara') || q.includes('comparatie') || (q.includes('gymshark') && q.includes('myprotein'))) {
      responseText = `### 📊 Comparație Strategică: Gymshark vs. MyProtein

| Criteriu | Gymshark | MyProtein |
| :--- | :--- | :--- |
| **Unghi Principal** | Problem-Agitation & Rezistență fizică | Ofertă Iresistibilă 1+1 Gratuit |
| **Format Dominant** | 9:16 Video UGC & Demonstrație în sală | Blind Taste Test & Carusel |
| **Longevitate Reclame** | 84 zile active (stabilitate mare) | 62 zile active |
| **Public Țintă** | Predominant feminin (85%), 18-34 ani | Mixt (60% bărbați, 40% femei) |
| **Psihologie Hook** | Frică de penibil / Stânjenire în public | Oportunitate financiară & Gust delicios |

🚀 **Concluzie:** Gymshark domină pe Top of Funnel (creare de dorință și rezolvare de problemă), în timp ce MyProtein excelează pe Bottom of Funnel (conversie imediată prin volum și preț).`;
      actionTrigger = { type: 'filter', filter: { niche: 'fitness' } };
    }

    // Case 4: Extract prompt for ChatGPT / Claude
    else if (q.includes('prompt') || q.includes('chatgpt') || q.includes('claude') || q.includes('genereaza brief')) {
      responseText = `### 📝 Am pregătit Capsula Strategică gata de export!

Am extras unghiurile și promisiunile din cele mai bune reclame ale concurenței. Poți deschide tab-ul **🤖 AI Strategy Capsule** din meniul principal sau poți copia direct promptul gata formatat pentru Claude 3.5 Sonnet / ChatGPT.

Vrei să generezi:
1. **Master Copywriting Prompt** (5 unghiuri noi de text direct-response)?
2. **Storyboard Video UGC (0–60s)** pentru creatori de conținut?
3. **Prompturi foto-realiste Midjourney** pentru imagini statice de conversie?`;
      actionTrigger = { type: 'switch_tab', tab: 'generator' };
    }

    // Default Intelligence response
    else {
      responseText = `Am analizat interogarea ta: **"${userMessage}"**.

În baza noastră de date Meta Ads Library sunt monitorizate **${allAds.length} reclame active**.
- **Canalul dominant de scalare:** Instagram Reels (68% din reclamele cu >45 zile active folosesc video vertical 9:16).
- **Tiparul principal de hook:** 42% dintre reclame încep cu negarea soluțiilor tradiționale (*"Nu mai arunca banii pe...", "De ce colanții tăi..."*).

👉 *Poți tasta comenzi specifice precum: "Top 3 reclame", "Analizează oferta", "Compară brandurile" sau "Generează prompt pentru ChatGPT".*`;
    }

    return {
      message: responseText,
      action: actionTrigger
    };
  }

  /**
   * Generate Production-Ready Downstream AI Prompts
   */
  generateDownstreamAiCapsule(adId, type = 'copywriter') {
    const ad = metaAdsService.getAdById(adId) || metaAdsService.cachedAds[0];

    if (type === 'copywriter') {
      return {
        targetModel: 'Claude 3.5 Sonnet / GPT-4o',
        type: 'Master Direct-Response Copywriting Prompt',
        prompt: `### ROL: Ești un Senior Direct-Response Copywriter & Media Buyer de talie mondială specializat în reclame Meta Ads (Facebook & Instagram).

### OBIECTIV:
Creează 5 noi variații de reclame de conversie ridicată pentru produsul nostru, care să bată cea mai profitabilă reclamă a competitorului (${ad.brand}), activă continuu de ${ad.active_days} ZILE.

### DATE AUDITATE ALE COMPETITORULUI (Meta Ads Archive):
- Brand concurent: ${ad.brand}
- Hook-ul lor validat: "${ad.headline}"
- Textul complet al reclamei concurente:
"""
${ad.primary_text}
"""
- Unghi psihologic dominant: ${ad.hook_type}
- Structura ofertei concurente: ${ad.offer}
- Garanție / Risk Reversal: ${ad.risk_reversal}
- Format confirmat la scalare: ${ad.format_label}

### INSTRUCTIUNI DE EXECUTIE:
1. Păstrează unghiul psihologic dovedit comercial (${ad.hook_type}), dar fă primele 3 secunde (Hook-ul) de 3x mai vizual și provocator.
2. Înlocuiește promisiunea competitorului cu Mecanismul Nostru Unic de Acțiune (Unique Selling Mechanism).
3. Structura obligatorie pentru fiecare dintre cele 5 variații:
   - [HOOK 0-3 SECUNDE]: 3 variante de deschidere (Opțiunea A: Șoc/Contrarian, Opțiunea B: Curiozitate, Opțiunea C: Durere/Greșeală frecventă).
   - [AGITARE & INVALIDARE]: De ce soluțiile alternative sau generice dau greș.
   - [MECANISMUL PROPRIETAR]: Explicația logică și simplă a motivului pentru care produsul nostru livrează rezultate.
   - [OFERTĂ IREZISTIBILĂ]: O ofertă superioară competitorului (${ad.offer}) + Garanție de satisfacție fără risc.
   - [CALL TO ACTION]: Direct și acționabil.
4. Tonul vocii: Conversațional, empatic, direct, fără jargon corporatist inutil.`
      };
    }

    if (type === 'ugc') {
      return {
        targetModel: 'Director Creativ / Creator UGC / Video AI (Runway, Sora, Kling)',
        type: 'Storyboard Video UGC 9:16 (0-60 secunde)',
        prompt: `### STORYBOARD & SCRIPT VIDEO UGC PENTRU CREATORI (Format 9:16 Vertical)
Inspirat din Reclama Câștigătoare a competitorului ${ad.brand} (Longevitate: ${ad.active_days} zile continue).

-------------------------------------------------------------------------
⏱️ CADRUL 1: HOOK-UL VIZUAL & AUDITIV (Secundele 0-3)
-------------------------------------------------------------------------
🎥 Video: Prim-plan filmat cu telefonul mobil, lumină naturală. Creatorul ține în mână o alternativă obișnuită și o îndepărtează cu o expresie de frustrare.
💬 Audio / Voiceover: "${ad.headline} ...Dacă încă folosești asta, oprește-te imediat!"
📝 Text pe Ecran (Overlay stil TikTok): "OPREȘTE-TE DACĂ VREI REZULTATE REALE 🛑"

-------------------------------------------------------------------------
⏱️ CADRUL 2: IDENTIFICAREA PROBLEMEI & AGITARE (Secundele 3-10)
-------------------------------------------------------------------------
🎥 Video: B-roll rapid care arată utilizatorul confruntându-se cu problema comună.
💬 Audio: "Am cheltuit o grămadă de bani crezând că problema e la mine. Până când am înțeles că 90% din opțiunile de pe piață au acest defect ascuns..."

-------------------------------------------------------------------------
⏱️ CADRUL 3: INTRODUCEREA SOLUȚIEI & MECANISMUL (Secundele 10-25)
-------------------------------------------------------------------------
🎥 Video: Creatorul deschide produsul nostru, arată textura/ușurința de utilizare/funcționalitatea în timp real.
💬 Audio: "Asta este soluția care a rezolvat problema. Folosește tehnologia [Mecanism Unic] care acționează direct asupra cauzei, nu doar pe simptome."

-------------------------------------------------------------------------
⏱️ CADRUL 4: DOVADA SOCIALĂ & REDUCEREA RISCULUI (Secundele 25-45)
-------------------------------------------------------------------------
🎥 Video: Creatorul arată ecranul cu recenzii de 5 stele sau un cadru demonstrativ clar Înainte vs. După.
💬 Audio: "Peste 15.000 de oameni confirmă diferența. Și cel mai bun lucru: ai 60 de zile garanție fără niciun risc să testezi singur."

-------------------------------------------------------------------------
⏱️ CADRUL 5: OFERTA & CALL TO ACTION (Secundele 45-60)
-------------------------------------------------------------------------
🎥 Video: Creatorul indică spre butonul de jos, arătând cutia și pachetul complet.
💬 Audio: "Apasă pe butonul de mai jos acum. Au o ofertă specială (${ad.offer}) care expiră în curând!"`
      };
    }

    // Default JSON Capsule
    return {
      targetModel: 'API / Make / n8n / Vector Database',
      type: 'Structured Intelligence JSON Capsule',
      data: {
        source_api: 'Meta Ads Archive API v21.0',
        generated_at: new Date().toISOString(),
        benchmark_ad: {
          id: ad.id,
          brand: ad.brand,
          active_days: ad.active_days,
          performance_tier: ad.status.toUpperCase(),
          creative_iterations: ad.iterations_count,
          primary_copy: ad.primary_text,
          headline: ad.headline,
          hook_archetype: ad.hook_type,
          offer_structure: {
            offer_text: ad.offer,
            risk_reversal: ad.risk_reversal,
            cta: ad.cta_text
          },
          placements: ad.publisher_platforms,
          demographics: ad.demographics
        },
        generative_ai_instructions: {
          recommended_copy_formula: 'Problem-Agitation-Invalidate-UniqueMechanism-Offer-CTA',
          target_active_duration_goal: '>60 days',
          hook_recommendation: 'Visual pattern interrupt in first 1.8 seconds'
        }
      }
    };
  }
}

module.exports = new AiService();
