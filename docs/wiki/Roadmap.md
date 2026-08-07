# 🗺️ Roadmap

Die vollständige, versionierte Roadmap liegt im Repository und wird
dort kontinuierlich aktualisiert:

👉 **[ROADMAP.md](../../ROADMAP.md)**

## Backlog-Highlights (Auszug)

**Feature-Ideen:**
- Video-/Spielfilm-Integration – Videoclips hochladen/abspielen pro
  Board, Zeichnen-Überlagerung, Player-seitiges Trimmen, Szenen-Marken
  live
- Echtzeit-Co-Editing – Präsenzanzeige, Live-Cursor und Live-Merging von
  Spielerzügen/Zeichnungen (nur fürs gerade gemeinsam betrachtete Frame)
  live
- Native App-Store-Präsenz (Google Play + Apple App Store) – App ist
  schon eine installierbare PWA (vite-plugin-pwa), naheliegender Weg
  wäre ein Wrapper wie Capacitor/Trusted Web Activity statt einer
  komplett separaten Codebasis

**Technisch:**
- Vite 7→8 (Stand 2026-08-07 erneut geprüft, weiterhin blockiert: jetzt
  `@vitejs/plugin-react@6` ↔ dessen optionale Peer-Dependency
  `@rolldown/plugin-babel` ↔ `@babel/core` – anderer Konflikt als zuvor,
  aber weiterhin im Rolldown-Ökosystem)
- ESLint 10 im Frontend (Stand 2026-08-07 erneut geprüft, weiterhin
  blockiert: `eslint-plugin-react@7.37.5` deklariert als Peer maximal
  `eslint@^9.7`)
- Formale WCAG 2.1 AA / BITV 2.0 / EN 301 549 Zertifizierung durch Dritte

Alle abgeschlossenen und geplanten Meilensteine mit Details: siehe
verlinktes `ROADMAP.md`.
