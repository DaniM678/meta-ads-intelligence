# 🚀 Meta Ads Intelligence & Competitor Spy Engine
### Platformă Avansată de Spionaj Reclame Meta Ads Library (Facebook & Instagram)
Inspirată din designul **Monday.com** și analiticele competitive **Semrush**.

---

## ⚡ Pornire Rapidă pe Windows (1-Click)

Dacă te afli în folderul proiectului (`meta-ads-intelligence-main`):
1. Fă pur și simplu **dublu-click pe `start.bat`**!
2. Scriptul va verifica dacă ai Node.js instalat, va rula `npm install` (dacă e prima rulare) și va deschide automat browserul la **`http://localhost:3000`**.

---

## 🔑 Cum conectezi datele REALE din Meta Ads Library (În 2 minute)

Aplicația poate funcționa în două moduri:
1. **Mod Mock / Offline (Implicit)**: Include deja o bază de date bogată cu reclame din Fitness, SaaS B2B, Skincare DTC și FinTech, cu metrici de longevitate, hook-uri și oferte gata de analiză.
2. **Mod Live Meta Graph API (Reclame Reale 100%)**: Se conectează direct la arhiva oficială Meta (`/v21.0/ads_archive`) și descarcă reclamele oricărui brand din lume în timp real!

### Pasul 1: Obținerea Token-ului Gratuit de la Meta
1. Intră pe **[Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)** (conectează-te cu contul tău de Facebook).
2. În colțul din dreapta-sus:
   - La câmpul **Meta App**: Alege orice aplicație creată de tine (sau apasă *Create App* -> *Other* -> *Business/Consumer* -> Pune un nume, ex: `AdSpy` -> Creează).
   - La câmpul **User or Page**: Lasă selectat **User Token**.
3. Apasă butonul albastru **Generate Access Token**.
4. Copiază token-ul generat (un șir lung de litere și cifre care începe de obicei cu `EAAB...` sau `EAA...`).

### Pasul 2: Introducerea Token-ului în Aplicație
Ai două opțiuni foarte simple:

* **Opțiunea A (Direct din Interfață)**:
  1. În bara laterală din stânga, apasă pe butonul **⚙️ Meta Ads API Config**.
  2. Selectează **Mod Activ: Live Meta Graph API**.
  3. Lipește token-ul `EAAB...` în căsuță.
  4. Apasă **Salvează & Sincronizează**.

* **Opțiunea B (Permanent în fișierul `.env`)**:
  1. Deschide fișierul `.env` din folderul proiectului cu Notepad sau VS Code.
  2. Completează linia:
     ```env
     META_ACCESS_TOKEN=EAABxxxxxxxxxxxxxxxxxxxxxxxxx
     META_TARGET_COUNTRY=RO
     ```
  3. Salvează fișierul și repornește serverul (`npm start` sau `start.bat`).

---

## 🤖 Conectare Opțională OpenAI GPT-4o (Pentru AI Copilot Live)

Dacă dorești ca asistentul din dreapta (**AI Spy Copilot**) să converseze folosind modelul real **GPT-4o / GPT-4o-mini**, adaugă cheia ta OpenAI în fișierul `.env`:
```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
```
*Dacă nu adaugi cheie OpenAI, asistentul folosește motorul euristic intern dedicat de analiză de reclame, fără costuri suplimentare.*

---

## 🎯 Ce poți face în aplicație?

- 🔎 **Căutare Semantică AI**: Scrie în limbaj natural (ex: *"reclame video active de peste 45 zile"*, *"oferte cu garanție extinsă"* sau brandul competitorului *"Gymshark"*).
- 🏆 **Main Table & Cards View**: Vizualizează reclamele organizate exact ca în Monday.com în grupuri de scalare (🔥 Scaling >45z, ⚡ Steady 20-45z, 🧪 Testare <20z).
- 📊 **Semrush Matrix**: Vezi matricea Head-to-Head a competitorilor, ponderea formatelor video Reels vs statice, viteza de lansare (Launch Velocity) și **Ad Gap Detector** (unghiuri neexploatate de concurență).
- 🤖 **AI Strategy Capsule**: Exportă într-un click brief-uri complete gata de încărcat în ChatGPT / Claude 3.5 Sonnet / Midjourney pentru a crea campanii noi pornind de la reclamele câștigătoare.
- ⭐ **Swipe File**: Salvează cele mai bune idei de reclame și descarcă-le ca raport Markdown.

---

Creat pentru **Sunlight Studio WebDesign**
