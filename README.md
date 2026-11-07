# ☀️ Sunlight Researcher
### Platformă Avansată de Ad Intelligence, Echipă Autonomă de Agenți AI & Campaign Engineering
Creată exclusiv pentru **Sunlight Studio WebDesign**.

---

## ⚡ Pornire Rapidă pe Windows (1-Click)

Dacă te afli în folderul proiectului (`meta-ads-intelligence-main`):
1. Fă pur și simplu **dublu-click pe `start.bat`**!
2. Scriptul va verifica dacă ai Node.js instalat, va rula `npm install` (dacă e prima rulare) și va deschide automat browserul la **`http://localhost:3000`**.

---

## 🤖 Echipa de Agenți AI Autonomi (Sunlight AI Team)

Aplicația integrează 5 agenți AI specializați care colaborează în timp real:
1. **🔍 NicheScout AI (Lead Market Researcher)**: Monitorizează continuu marile branduri de nișă, longevitatea reclamelor și scalarea formatelor video 9:16.
2. **🎯 AudienceEngine AI (Audience Strategist)**: Identifică publicul țintă ideal pentru Meta Ads (interese, vârstă, sex, Lookalike 1-3%) și Google Ads (cuvinte cheie de căutare, segmente In-Market, excluderi negative).
3. **✍️ CopyCraft AI (Creative Copy & Hook Architect)**: Construiește hook-uri de 0-3 secunde cu retenție maximă (>45% VTR), scripturi video pentru creatori și pachete de 15 titluri + 4 descrieri Responsive Google Ads.
4. **🔮 TrendCast AI (Trend Predictor & Premoniții)**: Analizează ce se caută cel mai mult în prezent (volume și procente de creștere) și formulează predicții la 30-90 de zile privind direcția pieței și sezonalitatea.
5. **⚡ CodeOptima AI (UI/UX & System Optimizer)**: Optimizează fluxurile de lucru, setările automate și viteza de analiză a platformei.

---

## 🎯 Configurator Campanie Meta Ads & Google Ads (Campaign Builder)

Când dorești să creezi o nouă reclamă pe Meta sau Google:
- Mergi în tab-ul **🎯 Campaign Builder**.
- Selectează nișa și introdu produsul sau serviciul tău.
- Primești instantaneu:
  - **Audiențe & Profil Client**: Vârstă, sex, locație, interese validate Meta, cuvinte cheie Google Ads și negative keywords.
  - **Texte Câștigătoare**: 3 variante de text gata de copiat (UGC Scurt, Storytelling Emoțional, Ofertă Directă) + 15 Titluri și 4 Descrieri Google.
  - **Ce Prinde Cel Mai Bine**: Hook-urile vizuale și auditive cu cele mai multe vizionări, formatul recomandat (Reels 9:16) și avertizări de Creative Fatigue.
  - **Tendințe Actuale & Premoniții Viitoare**: Volume de căutare curente și 3 premoniții strategice pentru următoarele 30-90 de zile.

---

## 🔑 Cum conectezi datele REALE din Meta Ads Library (În 2 minute)

Aplicația poate funcționa în două moduri:
1. **Mod Mock / Offline (Implicit)**: Include o bază de date cu reclame analizate, cu metrici de longevitate, hook-uri și oferte gata de explorat.
2. **Mod Live Meta Graph API (Reclame Reale 100%)**: Se conectează direct la arhiva oficială Meta (`/v21.0/ads_archive`) și descarcă reclamele oricărui brand din lume în timp real!

### Pasul 1: Obținerea Token-ului Gratuit de la Meta
1. Intră pe **[Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)** (conectează-te cu contul tău de Facebook).
2. În colțul din dreapta-sus:
   - La câmpul **Meta App**: Alege orice aplicație creată de tine (sau apasă *Create App* -> *Other* -> *Business/Consumer* -> Pune un nume, ex: `Sunlight AdSpy` -> Creează).
   - La câmpul **User or Page**: Lasă selectat **User Token**.
3. Apasă butonul albastru **Generate Access Token**.
4. Copiază token-ul generat (un șir lung de litere și cifre care începe cu `EAAB...` sau `EAA...`).

### Pasul 2: Introducerea Token-ului în Aplicație
Ai două opțiuni:

* **Opțiunea A (Direct din Interfață)**:
  1. În bara laterală din stânga, apasă pe **Configurare API & Conexiuni**.
  2. Selectează **Live Meta API**.
  3. Lipește token-ul `EAAB...` în căsuță.
  4. Apasă **Salvează & Sincronizează**.

* **Opțiunea B (Permanent în fișierul `.env`)**:
  1. Deschide fișierul `.env` din folderul proiectului cu Notepad.
  2. Completează linia:
     ```env
     META_ACCESS_TOKEN=EAABxxxxxxxxxxxxxxxxxxxxxxxxx
     META_TARGET_COUNTRY=RO
     ```
  3. Salvează fișierul și repornește serverul (`start.bat`).

---

## 🤖 Conectare Opțională OpenAI GPT-4o (Pentru Copilot Live)

Dacă dorești ca asistentul din dreapta (**Sunlight AI Copilot**) să converseze folosind modelul real **GPT-4o / GPT-4o-mini**, adaugă cheia ta OpenAI în fișierul `.env`:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
```
*Dacă nu adaugi cheie OpenAI, asistentul folosește motorul euristic intern dedicat de analiză de reclame, fără costuri suplimentare.*

---

## 🎨 Tipografie & Design
- **Titluri & Headings**: Poppins (Bold, Modern, Impactant)
- **Corp de Text & Interfață**: Inter (Claritate și lizibilitate maximă)
- **Paletă Vizuală**: Sunlight Amber & Slate (Sunlight Studio Design System)

---

Creat pentru **Sunlight Studio WebDesign**
