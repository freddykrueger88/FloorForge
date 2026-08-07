# 🗺️ Roadmap

Die vollständige, versionierte Roadmap liegt im Repository und wird
dort kontinuierlich aktualisiert:

👉 **[ROADMAP.md](../../ROADMAP.md)**

## Backlog-Highlights (Auszug)

**Feature-Ideen:**
- Video-/Spielfilm-Integration – Videoclips hochladen/abspielen pro
  Board, Zeichnen-Überlagerung, Player-seitiges Trimmen, Szenen-Marken
  live
- Echtzeit-Co-Editing – Präsenzanzeige live ("wer ist gerade auch hier").
  Offen: Live-Cursor-Positionen, Konflikt-Auflösung bei simultanem
  Bearbeiten (eigenes UX-Konzept nötig – wessen Änderung gewinnt?)
- Native App-Store-Präsenz (Google Play + Apple App Store) – App ist
  schon eine installierbare PWA (vite-plugin-pwa), naheliegender Weg
  wäre ein Wrapper wie Capacitor/Trusted Web Activity statt einer
  komplett separaten Codebasis

**Technisch:**
- Vite 7→8 (zurückgestellt, Peer-Dependency-Konflikt im
  Rolldown-Ökosystem)
- ESLint 10 im Frontend (blockiert durch `eslint-plugin-react`)
- Mobile/Tablet: dedizierte Touch-Optimierung
- Formale WCAG 2.1 AA / BITV 2.0 / EN 301 549 Zertifizierung durch Dritte

Alle abgeschlossenen und geplanten Meilensteine mit Details: siehe
verlinktes `ROADMAP.md`.
