# Changelog

Alle wichtigen Änderungen an OpenFloorball werden in dieser Datei dokumentiert.
Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/).
Versionierung nach [Semantic Versioning](https://semver.org/lang/de/).

> ⚠️ **Hinweis:** Dieses Projekt wurde als Konzept von einem Menschen erdacht.
> Die Implementierung erfolgte durch KI (AI-Slop). Bei kommerziellem Einsatz
> wird der Ideengeber als Urheber genannt und erhält lebenslang kostenlosen
> Top-Premium-Tier-Zugang, unwiderruflich.

---

## [Unreleased]

### Added
- UI/UX-Design-Review umgesetzt (alle 13 Punkte aus dem Design-Audit):
  Emoji-Icon-System vollständig auf `lucide-react` migriert (33 Dateien,
  betrifft praktisch jede Seite), gemeinsame `Button`-Komponente ersetzt
  37 unabhängig gestylte Buttons (behebt gemessene 36/44/48px-Höhen-
  Streuung und uneinheitliche Fokus-Ring-Stile), `SettingsPage.jsx`
  (1011 Zeilen) in sechs eigenständige Section-Komponenten mit echter
  Tab-Navigation aufgeteilt (Progressive Disclosure statt einer langen
  Formular-Wand), Board-Editor-Tab-Leiste bekommt Scroll-Fade +
  thematische Gruppierung (Bearbeiten/Medien/Info), eigenständige
  Display-Schrift (Oswald) für Überschriften statt überall derselben
  Fließtext-Schrift, neues `--color-info`-Token, Empty States mit
  Erklärung statt bloßem "nichts da" vereinheitlicht, Speicherstatus im
  Board-Header mit Icon+Farbe statt reinem Textwechsel. Neues Feature:
  eigenes Farbthema erstellbar (4 Farbwähler, alle übrigen Töne werden
  automatisch abgeleitet – siehe `deriveCustomThemeTokens()` in
  `utils/color.js`), rein persönliche Einstellung über die bestehende
  `settings.preferences_json`-Ablage, keine neue Backend-Tabelle nötig.
  Bei der optischen Seite (Icon-Look, Farbwähler-Vorschau, Tab-Optik)
  wie bei früheren Runden ohne echten Browser unterwegs – strukturell
  verifiziert (Lint/91 Tests/Build grün), bitte selbst gegenchecken.
- Mobile/Tablet-Touch-Optimierung (ROADMAP-Backlog): `touch-action: none`
  auf dem Spielfeld-Canvas (verhindert, dass Ziehen von Spielern/Zeichnen
  auf Touch-Geräten mit Seiten-Scroll/Pinch-Zoom kollidiert), Werkzeug-
  Leiste-Buttons von 40×40px auf 44×44px (Apple/Material-Mindestgröße für
  Touch-Targets) angehoben, Werkzeug-Leiste wird auf schmalen Bildschirmen
  (≤640px) zu einer horizontalen Leiste über dem Feld statt einer
  vertikalen Seitenleiste (Floorball-Feld sonst auf Handy-Portrait stark
  gequetscht). Ohne echtes Gerät zum optischen Gegentesten – strukturell
  verifiziert (Build/Tests grün), bitte auf einem echten Handy gegenchecken.
- Echtzeit-Präsenz MVP (ROADMAP-Backlog "Echtzeit-Co-Editing"): zeigt im
  Board-Header an, wer gerade dasselbe Board geöffnet hat ("👥 2 weitere
  Personen hier"). Neue WebSocket-Infrastruktur (`ws`-Paket,
  `services/presenceServer.js`, `/api/ws/presence`), nginx leitet
  Upgrade-Requests darüber bereits über die bestehende `/api/`-Location
  durch. Bewusst NICHT enthalten: Live-Cursor-Positionen, Konflikt-
  Auflösung bei simultanem Bearbeiten – beides bräuchte ein eigenes
  UX-Konzept, siehe `presenceServer.js`-Kommentar.
- Echtzeit-Co-Editing ausgebaut: die beiden zurückgestellten Teile der
  Präsenz-MVP sind jetzt da. Live-Cursor – die Mausposition anderer
  Personen erscheint sofort als farbiger Punkt mit Namen auf dem eigenen
  Spielfeld (gedrosselt über dieselbe Presence-WebSocket, keine neue
  Verbindung nötig). Echtes Live-Merging statt bloßem Konflikt-Hinweis –
  Spielerzüge und fertig gezeichnete Pfeile/Freihand-Elemente werden
  sofort an alle verteilt, die GERADE dasselbe Frame offen haben, nicht
  erst nach dem nächsten Autosave. `useDrawing.js` wendet empfangene
  Operationen über einen neuen `REMOTE_OP`-Reducer-Zweig an, bewusst OHNE
  die eigene Undo/Redo-Historie zu berühren – Strg+Z macht auf jedem
  Client immer nur die eigenen Aktionen rückgängig, nie eine fremde.
  Bewusst NICHT enthalten: Frame-Wechsel bleibt rein lokal (kein
  "Entführen" der Ansicht anderer), Punkt-für-Punkt-Streaming während
  einer laufenden Zeichen-Geste (Peers sehen ein Element erst fertig),
  Zustands-Snapshot für neu dazustoßende Mitbearbeiter (Basis ist der
  zuletzt autogespeicherte Stand, max. 30s alt), siehe
  `presenceServer.js`-Kommentar.
- Video-Integration MVP (ROADMAP-Backlog): bis zu 5 kurze Videoclips pro
  Board hochladen (MP4/WebM/MOV, je max. 200MB), nativer Player mit
  Scrubbing (Range-Requests). Neuer Tab "🎥 Video" im Board-Editor.
  Bewusst NICHT enthalten: Zeichnen über dem Video, Schnitt/Trimmen,
  Szenen-Timeline – eigene, deutlich größere Ausbaustufen mit eigenem
  UX-Konzept, siehe `videoController.js`-Kommentar. Ablage auf Disk
  (neues `videos_data`-Volume), Dateien werden beim Board-Löschen (auch
  Soft-Delete) automatisch mitgelöscht.
- Video-Integration ausgebaut: die drei in der MVP zurückgestellten Teile
  sind jetzt da. Zeichnen über dem Video – eine feste Überlagerung pro
  Video (Video pausieren, mit denselben Zeichen-Werkzeugen wie im Board-
  Editor drüberzeichnen, Zeichnung bleibt fürs ganze Video sichtbar),
  bewusst kein zeitstempel-gebundenes Mehrfach-Annotationssystem. Trimmen
  – rein Player-seitige Start-/Endgrenzen, kein serverseitiger ffmpeg-
  Schnitt, Originaldatei bleibt immer vollständig erhalten und die Grenzen
  sind jederzeit zurücksetzbar. Szenen-Marken – Zeitstempel mit Label
  unter dem Player, Klick springt zur Position. Neuer PUT-Endpoint
  `/api/boards/:id/videos/:videoId` für partielle Updates (Zeichnung/Trim/
  Marken/Titel einzeln änderbar). Bei der Konva-Overlay-Optik bin ich wie
  beim Touch-Umbau ohne echten Browser unterwegs – strukturell verifiziert
  (Build/Tests grün), bitte selbst gegenchecken.
- Undo/Redo (Strg+Z / Strg+Y) deckt jetzt auch Spieler-Positionen ab –
  bisher war nur das Zeichnen (Pfeile, Freihand) rückgängig machbar,
  Spieler ziehen/per Pfeiltaste verschieben hatte gar keine Undo-
  Anbindung. `useDrawing.js` verwaltet Spieler und Elemente jetzt über
  einen gemeinsamen `useReducer`-Verlauf – Strg+Z macht immer die
  zeitlich letzte Aktion rückgängig, egal ob Zeichnung oder Spielerzug.
  Formation-Vorlagen laden ist ebenfalls undo-bar; Namensänderungen/
  Roster-Zuweisungen bewusst nicht (keine Taktik-Entscheidung). Zusätzlich
  zu den bestehenden Buttons in der Zeichnen-Werkzeugleiste jetzt auch
  ↩/↪-Buttons direkt im Board-Header, unabhängig vom aktiven Tab/Werkzeug
  immer sichtbar – nicht jeder kennt Strg+Z/Strg+Y.
- Fertige GIF-/MP4-Exporte lassen sich jetzt direkt über das native
  Teilen-Menü des Geräts verschicken (u.a. WhatsApp), über die
  Web-Share-API (`navigator.share`). Button erscheint nur, wenn der
  Browser die API unterstützt (v.a. mobil) – der normale Download-Link
  bleibt als Fallback immer bestehen (z.B. Desktop-Firefox).
- E-Mail-Einladungsflow für Board-Sharing: eine noch nicht registrierte
  Adresse bekommt jetzt statt eines 404-Fehlers eine Einladungsmail mit
  Link (`/invite/:token`, neue `board_invites`-Tabelle). Registriert sich
  die Adresse später (unabhängig davon, ob über den Link oder direkt),
  wird sie automatisch als Kollaborator zum Board hinzugefügt – kein
  Sonderfall im Registrierungsformular nötig. Bestehende
  Kollaborator-Verwaltung (`ShareBoardModal`) zeigt offene Einladungen
  mit "⏳ Eingeladen"-Badge, Berechtigung ändern/zurückziehen funktioniert
  identisch zu echten Kollaboratoren.
- Postkarten-Galerie-Miniatur zeigt jetzt die hinterlegte Taktik statt
  nur eines leeren Feldes: `GET /api/boards` liefert zusätzlich
  `players_json` (bewusst ohne `elements_json` – Freihand-Zeichnungen
  können groß werden, für die reine Übersicht nicht nötig),
  `FieldMiniature` zeichnet die Spielerpositionen als kleine Punkte in
  derselben 90°-Drehung wie das Feld.
- Optionaler SMTP-Mailversand (`backend/src/utils/mailer.js`,
  `nodemailer`): wird beim Hinzufügen eines Kollaborators (Issue #51)
  genutzt, um eine kurze Benachrichtigungsmail zu verschicken. Ohne
  `SMTP_HOST` bleibt die App unverändert voll funktionsfähig, es wird
  nur nichts verschickt – bewusst kein Zwang zur Mailserver-Einrichtung
  für Self-Hoster. Neue Env-Vars in `.env.example`/`docker-compose.yml`:
  `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`,
  `SMTP_PASSWORD`, `SMTP_FROM`.
- Gegner-Tagging: Boards können beim Anlegen oder im Editor-
  "Einstellungen"-Tab mit einem freien Gegner-Textfeld markiert werden
  ("vs. Team X"), sichtbar als Badge auf Kachel/Postkarte, durchsuchbar
  über ein neues Suchfeld in der Board-Übersicht.
- Einzel-Frame-Share: der aktuell aktive Frame lässt sich als PNG-Link
  ohne Login teilen (z. B. für WhatsApp), unabhängig vom vollen
  Board-Share-Link. Nutzt die in der `exports`-Tabelle bereits
  vorgesehene, aber nie implementierte `format='png'`-Option.
- Übungsbibliothek-Metadaten (OpenFloorball-Roadmap Phase 3): Boards
  lassen sich optional als Trainings-Übung einordnen – Kategorie
  (Technik/Taktik/Kondition/Spielverständnis/Nachwuchs), Altersklasse,
  Ziel und Material, editierbar im Editor-"Einstellungen"-Tab, in der
  Board-Übersicht nach Kategorie filterbar. Additive Spalten auf der
  bestehenden `boards`-Tabelle statt eines separaten Exercise-Modells.
- Erstes Vitest-Setup für das Frontend (bisher kein Test-Tooling
  vorhanden): Stores, `useShare`-Hook und i18n-Schlüsselparität
  zwischen `de.json`/`en.json` sind jetzt automatisiert getestet.
- **Team-Konzept** (ROADMAP Phase 2 – Team und Organisation): Teams mit
  drei Rollen (owner/coach/member), Mitgliederverwaltung per Einladung
  über eine bereits registrierte E-Mail-Adresse. Kader, Playbooks,
  Trainingspläne und Formations-Vorlagen lassen sich optional einem
  Team statt nur der eigenen Person zuordnen und sind dann für alle
  Team-Mitglieder sichtbar/nutzbar – Boards bleiben bewusst außen vor,
  die granularere Einzel-Freigabe (`board_collaborators`) deckt das
  bereits ab. Neue "Teams"-Sektion in den Einstellungen.
- **Kommentare** (ROADMAP Phase 2): auf Boards und Trainingseinheiten,
  jeweils als eigener Tab bzw. Abschnitt. Lesen/Schreiben braucht nur
  Lesezugriff auf die Ressource, Löschen darf der Autor selbst oder wer
  Schreibzugriff auf die Ressource hat (Moderation).
- **Automatische Board-Versionierung** (ROADMAP Phase 2): bei jedem
  Speichern entsteht automatisch ein Snapshot aller Frames, mit einer
  Obergrenze von 50 Versionen pro Board (Datensparsamkeit). Neuer
  "Verlauf"-Tab im Board-Editor: Zeitstempel-Liste + Wiederherstellen
  (sichert vorher selbst den aktuellen Stand, damit nichts verloren
  geht).
- **Vereins-Ebene** (ROADMAP Phase 2): ein Verein bündelt mehrere Teams
  rein organisatorisch (2 Rollen: admin/member) – teilt aber selbst
  keine Inhalte, Kader/Playbooks/Trainingspläne/Formationen bleiben wie
  gehabt team-gebunden. Vereins-Admins sehen zugeordnete Teams auch
  ohne eigene Team-Mitgliedschaft. Neue "Vereine"-Sektion in den
  Einstellungen.
- Team-Auswahl beim Anlegen von Playbooks und Formations-Vorlagen –
  Backend unterstützte `teamId` bereits, dem kompakten Chip-UI fehlte
  die Auswahlmöglichkeit (analog Kader/Trainingseinheiten).
- Datum und Ziel für Trainingseinheiten (ROADMAP Phase 3): die Roadmap
  nennt "Datum, Dauer, Ziel, Übungen" als Kernfelder – Dauer/Übungen
  waren über die Einheiten-Items bereits abgedeckt, Datum und Ziel
  fehlten im Datenmodell. Beide jetzt in der Detailseite editierbar,
  das Datum zusätzlich als Badge auf der Übersichts-Kachel.
- Slogan ("Weil Taktik mehr als nur Kreide an der Tafel ist.") unter
  dem Logo auf Login-/Registrierungsseite, plus eine zentrierte
  "Mit ❤️ für die Floorball-Community entwickelt"-Zeile im globalen
  Footer.
- Echtes OpenFloorball-Logo (Ball + Taktik-Klemmbrett) ersetzt den
  bisherigen "FF"-Platzhalter – als Browser-Tab-Favicon/PWA-Icon sowie
  auf Login-/Registrierungsseite. Verlustbehaftet komprimiert
  (pngquant) ohne sichtbaren Qualitätsverlust, relevant für den
  PWA/Offline-Modus in Hallen mit schlechtem WLAN (#49).
- Dasselbe Logo auch in der globalen Kopfzeile (bisher dort ebenfalls
  nur "FF"), damit auf jeder eingeloggten Seite sichtbar statt nur auf
  Login/Register. Der Slogan sitzt dafür im globalen Footer statt in
  der Kopfzeile – unter dem kleinen Logo in der schmalen, sticky
  Kopfzeile wirkte er gequetscht statt gut lesbar.
- Admin-Benachrichtigungsmail bei jeder Neuregistrierung (nur bei
  konfiguriertem SMTP), Text variiert zufällig zwischen mehreren
  augenzwinkernden Formulierungen statt immer derselben trockenen
  Meldung. Der erste Nutzer (wird automatisch Admin) bekommt keine Mail
  über die eigene Registrierung.
- Konfliktlösung für Offline-Sync bei mehreren Geräten (ROADMAP Phase 4):
  Frames (Taktik-Inhalt) haben jetzt wie Boards ein `updatedAt`. Gepufferte
  Offline-Änderungen an Frames/Boards werden vor dem erneuten Abschicken
  gegengeprüft – wurde die Ressource zwischenzeitlich auf einem anderen
  Gerät geändert, wird NICHT automatisch überschrieben, sondern als
  Konflikt markiert. Neuer Hinweis im Offline-Banner öffnet einen Dialog
  mit allen betroffenen Änderungen zur manuellen Prüfung/zum Verwerfen.
  Alle anderen puffer-fähigen Ressourcen (Teams, Kader, Kommentare, …)
  bleiben bewusst beim bisherigen Last-Write-Wins.

### Changed
- Board-Editor: Gegner + Übungsbibliothek-Metadaten (Kategorie/Altersklasse/
  Ziel/Material) aus dem "Einstellungen"-Tab in einen umbenannten "Info"-Tab
  (vormals "Notizen") verschoben, zusammen mit den bestehenden Notizen
  (neue Komponente `BoardDetailsPanel`). Passt inhaltlich besser dorthin
  ("worum geht's bei diesem Board" statt Anzeige-/Verhaltens-Einstellungen)
  und macht nebenbei den Unterschied zu "Kommentare" klarer (Info = ein
  Dokument zum Board, Kommentare = Diskussions-Thread zwischen
  Kollaboratoren). "Einstellungen" enthält jetzt nur noch Namen/Hinweise/
  Feldtyp/Teilen.
- Board-Editor: rechtes Menü (Zeichnen-Koordinaten, Lines, Formationen,
  Export, PDF-Export, Notizen) von einer schmalen 220px-Seitenleiste in
  eine Tab-Leiste unter der Frame-Timeline verschoben – das Feld bekommt
  dadurch die volle Breite (neue Komponente `BoardSidePanelTabs`). Das
  Menü ist standardmäßig eingeklappt (nur die Tab-Leiste sichtbar) und
  klappt erst auf Klick auf, damit der Fokus auf dem Spielfeld bleibt
  statt auf einem dauerhaft großen Panel darunter.
- Board-Editor: Frame-Timeline (Frame 1, Frame 2, …) sitzt jetzt über
  dem Tab-Menü statt darunter.
- Board-Editor: "Namen anzeigen", Positions-Hinweise, Spielfeld-Typ und
  "Board teilen" aus dem Header-Menü heraus in einen eigenen
  "Einstellungen"-Tab im unteren Menü verschoben (neue Komponente
  `FieldSettingsPanel`, nutzt intern `FieldNamesBar`). Teamfarben und
  Tastaturkürzel bleiben bewusst im Header, da sie ohne Menü-Klick
  schnell erreichbar sein sollen. Die nun ungenutzte `FieldToolbar`
  wurde entfernt.
- Neun Dokument-Dopplungen in `docs/planning/` konsolidiert, dabei u.a.
  einen echten Inhaltsfehler behoben (`PRIVACY.md` enthielt
  Security-Konzept-Inhalte statt Datenschutz-Inhalten) und drei
  widersprüchliche Repository-Struktur-Vorschläge auf einen
  gemeinsamen, kanonischen Stand gebracht.

### Fixed
- GIF-/MP4-Export funktionierte über das echte Frontend nie (413
  "Payload Too Large"), obwohl die Live-Verifikation per curl zuvor
  erfolgreich aussah – lag an zwei unabhängigen Bugs, die sich mit
  winzigen Test-Bildern gegenseitig verdeckt hatten:
  1. `useExport.js` hängte `/api/export/...` an eine bereits `/api`
     enthaltende Basis-URL (`VITE_API_URL`) – Requests gingen an das
     nicht existierende `/api/api/export/...`.
  2. Selbst mit korrigierter URL: ein globaler `express.json({ limit:
     '10kb' })` in `server.js` konsumierte den Request-Body, bevor der
     `/export`-Sub-Router mit seinem eigentlich vorgesehenen 50mb-Limit
     überhaupt zum Zug kam – der Body kann nur einmal geparst werden.
     `/api/export/*` ist jetzt vom globalen Parser ausgenommen.
  3. Zusätzlich fehlte in der Nginx-Konfiguration `client_max_body_size`
     (Standard 1MB) – auch das hätte realistische Export-Anfragen
     unabhängig von 1./2. weiterhin blockiert, jetzt auf 50mb gesetzt.
- Helmet sendete unconditional einen `Strict-Transport-Security`-Header
  (HSTS, 1 Jahr, `includeSubDomains`). Läuft die Instanz hinter einem
  Reverse-Proxy/Tunnel, der HTTPS nicht zuverlässig terminiert (z.B.
  Dynamic-DNS-Tunnel-Dienste wie home64.de), zwingt der Browser die Seite
  nach dem ersten Aufruf dauerhaft auf HTTPS – führte zu endlosen
  Reload-/Redirect-Schleifen und Logins, die nach jedem Reload verloren
  gingen (Cookie unter dem erzwungenen Schema nicht wiedergefunden). HSTS
  ist jetzt an dieselbe `COOKIE_SECURE`-Weiche gekoppelt wie die
  Cookie-Optionen (`utils/cookies.js`) – wer `COOKIE_SECURE=false` setzt
  (Homelab ohne verlässliches TLS davor), bekommt bewusst kein HSTS.
  **Bereits im Browser gespeicherte HSTS-Regeln für die eigene Domain
  müssen einmalig manuell gelöscht werden** (Chrome:
  `chrome://net-internals/#hsts` → Domain löschen; Firefox: Website-Daten
  für die Domain löschen), da eine bereits akzeptierte Regel nicht allein
  durch das Fehlen des Headers zurückgesetzt wird.
- Gelöschte Boards gaben zuvor erzeugte Einzel-Frame-Share-Links
  (`/api/share/frame/:token`) weiterhin öffentlich frei – anders als der
  volle Board-Share-Link, der `deleted_at` bei jedem Aufruf korrekt prüft,
  fehlte dieser Check bei `getSharedFrame` komplett. Bild blieb bis zum
  natürlichen Ablauf (Standard 72h) abrufbar, obwohl das Board längst
  gelöscht war. Query prüft jetzt zusätzlich `boards.deleted_at IS NULL`.
- Export-Status-Polling (`useExport.js`, GIF/MP4) prüfte die Antwort des
  Status-Endpunkts nicht auf HTTP-Fehler – ging der Job serverseitig
  verloren (z.B. durch einen Backend-Neustart während eines laufenden
  Exports, da der Job-Store nur In-Memory existiert), lieferte
  `GET /api/export/status/:id` 404, `data.status` war `undefined`, traf
  weder den "done"- noch den "error"-Zweig, und die UI blieb ohne jede
  Fehlermeldung dauerhaft im "processing"-Zustand hängen. Zusätzlich
  wurde das Polling-Intervall beim Schließen des Export-Panels nie
  aufgeräumt und lief unbegrenzt im Hintergrund weiter, auch nach dem
  Unmounten der Komponente.
- Boards ließen sich in der Postkarten-Galerie-Ansicht nicht löschen –
  `BoardPostcard.jsx` hatte (anders als die Kachel-Ansicht `BoardCard.jsx`)
  gar keinen Lösch-Button/`onDelete`-Prop verdrahtet. Nachgerüstet nach
  demselben Muster (Eigentümer-Check, Klick öffnet `DeleteConfirmDialog`).
- Allgemeines `/api/`-Limit (100 Anfragen/15min) war für echte
  interaktive Nutzung zu knapp bemessen – `useAutoSave.js` debounced
  Speichern schon 300ms nach jeder Änderung (nicht nur alle 30s),
  aktives Verschieben von Spielern beim Taktik-Zeichnen feuert dadurch
  viele Requests pro Minute, dazu kommen mehrere API-Aufrufe pro
  Seitenwechsel und ggf. mehrere gleichzeitig aktive Nutzer hinter
  derselben IP. Ein frisch registrierter Nutzer konnte dadurch schon
  beim ersten Ausprobieren (Spielfeld anlegen) blockiert werden – wirkte
  wie eine fehlende Berechtigung, war aber ein zu enges Limit (keine
  Rollen-Beschränkung existiert im Code). Limit auf 500 angehoben.
- Registrierung wurde weiterhin vom allgemeinen `/api/`-Limit (100/15min)
  blockiert, obwohl sie längst ein eigenes, dediziertes Budget hatte –
  Express beendet die Middleware-Kette nicht, nur weil später im Code
  noch ein spezifischerer `app.use()` für denselben Pfad folgt. War das
  geteilte 100er-Budget durch normale App-Nutzung mehrerer Nutzer
  hinter derselben IP aufgebraucht, kam wieder die falsche "Zu viele
  Anfragen"-Meldung statt der eigentlich zutreffenden – exakt das
  Symptom des ursprünglichen Fixes darunter, nur über einen anderen
  Pfad. `/api/auth/login` und `/api/auth/register` sind jetzt vom
  allgemeinen Limiter ausgenommen.
- Getrennte Rate-Limiter für `/api/auth/login` und
  `/api/auth/register` statt eines gemeinsamen Budgets für den ganzen
  `/api/auth/`-Pfad: eine Registrierung (nach mehreren
  Validierungsfehlern) oder normale, bereits authentifizierte Aufrufe
  wie `/me` konnten das 10-Anfragen-Limit für Login mit ausschöpfen –
  die Fehlermeldung sagte dann fälschlich "Zu viele Login-Versuche",
  obwohl gar keine Login-Versuche stattgefunden hatten. Bei einer
  gemeinsam genutzten IP (Verein/Büro hinter einem NAT) reichte das oft
  schon durch einen einzigen Kollegen, um alle anderen mit
  auszusperren.
- Neues-Spielfeld-Dialog: fehlendes `max-height` ließ den Dialog bei
  viel Inhalt (Name, Gegner, Kategorie, 4 Feldtyp-Karten) höher werden
  als der Viewport – durch die vertikale Zentrierung rutschte der
  Header dabei über den sichtbaren Bereich hinaus. Jetzt wie bei den
  übrigen Dialogen auf 80vh begrenzt mit intern scrollendem
  Formularbereich, Header und Aktions-Buttons bleiben fix sichtbar.
  Abbrechen/Anlegen-Buttons füllen außerdem die volle Breite statt
  rechtsbündig zusammengedrängt zu wirken.
- Verwaiste Kommentare beim Account-Löschen: `boards.user_id` und
  `training_sessions.user_id` haben `ON DELETE CASCADE` auf `users` –
  beim Löschen eines Accounts (Selbstlöschung oder durch einen Admin)
  wurden dessen Boards/Trainingseinheiten dadurch hart gelöscht, ohne
  über `deleteBoard`/`deleteSession` zu laufen, wo die
  Kommentar-Aufräumung sitzt. Kommentare anderer Nutzer auf den
  gelöschten Ressourcen blieben dadurch als verwaiste Zeilen zurück, da
  `comments` bewusst kein DB-seitiges FK hat (polymorph über zwei
  Zieltabellen).
- Ersteller-Account-Löschung riss Team/Verein für alle mit:
  `teams.created_by`/`organizations.created_by` hatten `ON DELETE
  CASCADE`, obwohl beide Spalten reine Provenienz sind (nie an die API
  exponiert) – die eigentliche Berechtigung läuft über
  `team_members.role='owner'`/`organization_members.role='admin'`, die
  unabhängig davon geändert werden kann. Ein Nutzer konnte die
  Owner-/Admin-Rolle übertragen, die Gruppe komplett verlassen und
  Monate später seinen damit gar nicht mehr verbundenen persönlichen
  Account löschen – das komplette Team/den Verein riss es dann für alle
  verbleibenden Mitglieder mit. Jetzt wie `board_versions.created_by`
  korrekt `ON DELETE SET NULL`.
- Board-Editor: bei aufgeklapptem unterem Tab-Menü schrumpft der
  Feldbereich – die Zeichen-Werkzeugleiste (u.a. Linienstärke-Auswahl)
  und das Spieler-Info-Fenster (Namen eintragen) hatten kein eigenes
  Scrolling und wurden dadurch vom `overflow: hidden` des Feldbereichs
  teilweise unsichtbar abgeschnitten statt sich anzupassen. Beide
  scrollen jetzt intern, wenn der verfügbare Platz nicht mehr reicht.
- CI: `EXPORTS_DIR` im Backend-Testjob (`.github/workflows/ci.yml`) auf
  `/tmp/openfloorball-exports-ci` gesetzt statt des Produktions-Defaults
  `/app/exports`, der nur innerhalb des Docker-Containers beschreibbar
  ist – auf dem bare GitHub-Actions-Runner (non-root) führte das seit
  dem MP4-Export-Feature (Commit `b6a5a2e`) durchgehend zu `EACCES` in
  `POST /api/export/gif`/`mp4` und damit zu 3 fehlschlagenden Tests in
  `export.test.js`. Die produktive Docker-Umgebung war davon nie
  betroffen. (Erster Fix-Versuch nutzte `${{ runner.temp }}` – der
  `runner`-Kontext steht in einem Job-`env`-Block aber nicht zur
  Verfügung, was den gesamten Workflow ungültig machte; korrigiert
  auf einen literalen Pfad.) Nach Behebung des EACCES-Problems zeigte
  sich ein zweiter, unabhängiger Fehler: `ffmpeg` ist auf dem bare
  GitHub-Actions-Runner nicht vorinstalliert (nur im Docker-Image via
  `apk add ffmpeg`) – Backend-CI installiert jetzt `ffmpeg` +
  `fonts-dejavu-core` per `apt-get` vor den Tests; da Ubuntu die
  DejaVu-Schrift unter einem anderen Pfad als Alpine ablegt, wird sie
  zusätzlich nach `/usr/share/fonts/dejavu/` kopiert (exakter Pfad aus
  `WATERMARK_FONT` in `exportController.js`). Zusätzlich: verschluckte Fehlermeldungen in
  `exportController.js`/`backupCron.js` behoben (`err` statt
  `err.message` an den Logger übergeben – Winstons Format gibt einen
  reinen String-Zweitparameter sonst nicht aus), was die Diagnose
  unnötig erschwert hat.
- Gezeichnete Pfeile/Linien im Board-Editor gingen beim Wechsel des
  Frames verloren (#54): Autosave beobachtete bisher nur `livePlayers`,
  nicht `drawing.elements` – reines Zeichnen löste dadurch nie ein
  Speichern aus. Der anschließende Frame-Wechsel überschrieb den
  lokalen Zeichenstatus dann mit dem (noch leeren) gespeicherten Stand
  des neuen Frames. Autosave beobachtet jetzt beide zusammen, zusätzlich
  wird vor einem manuellen Frame-Wechsel explizit ein ausstehendes
  Speichern abgewartet, damit auch sehr kurz aufeinanderfolgende
  Aktionen (zeichnen → sofort Frame wechseln) nichts verlieren.

---

## [0.9.0] – 2026-08-04

Mit Abstand größtes Release bisher: 25 abgeschlossene Issues, sieben neue
Funktionsbereiche und eine vollständige Abhängigkeits-/Runtime-Modernisierung.

### Added
- **Formationen-/Startaufstellungs-Vorlagen-Bibliothek** (#46): Aufstellungen
  als wiederverwendbare Vorlage speichern, über alle Boards hinweg laden,
  automatische Neuskalierung bei abweichendem Feldtyp.
- **Playbooks** (#52): Boards zu benannten Sammlungen gruppieren (z. B. alle
  Standardsituationen einer Saison), Filter-Leiste in der Board-Übersicht.
- **Trainings-/Übungsplaner** (#45): Trainingseinheiten als geordnete
  Sequenz mehrerer Boards mit Dauer/Notiz je Übung, eigener PDF-Export für
  den kompletten Trainingsplan.
- **Zentraler Team-Kader** (#53): Spieler mit Name/Rückennummer/Position
  einmal anlegen, im Board-Editor per Dropdown zuweisen statt Freitext –
  rein additiv, Board-Spieler bleiben weiterhin frei editierbar.
- **PWA/Offline-Modus** (#49): Service Worker cacht App-Shell + zuletzt
  gesehene Board-Daten; Schreibzugriffe werden bei Verbindungsabbruch in
  einer IndexedDB-Queue gepuffert und beim Wiederverbinden automatisch
  synchronisiert (Last-Write-Wins). Global sichtbarer Offline-Banner.
- **Board-Sharing** (#51, reduziertes MVP): Boards mit anderen Nutzern
  teilen (Lese-/Schreibzugriff), Kollaboratoren-Verwaltung im Editor.
  Bewusst ohne Echtzeit-Sync/WebSocket – siehe ROADMAP für die volle,
  zurückgestellte Ausbaustufe.
- Tastaturkürzel-Übersicht (Hilfe-Overlay) + sichtbarer Undo/Redo-Verlauf
  statt nur Einzelschritt (#47, #48)
- Zeichenwerkzeuge (Linien/Pfeile/Freihand) per Koordinaten-Formular
  vollständig tastaturbedienbar (#38, WCAG 2.1.1)
- TLS/HTTPS-Beispiel mit Caddy (`docker-compose.tls.yml`) (#39)
- Dedizierte Tests für Frames-/Lines-CRUD-Endpunkte (#44)

### Changed
- Stürmer stehen bei Anstoß jetzt korrekt in der eigenen Hälfte (vorher
  exakt vertauscht); Löschbestätigung für Boards von drei auf einen
  Bestätigungsschritt reduziert
- Standard-Aufstellung wird jetzt sofort beim Anlegen eines Boards gesetzt
  (serverseitig, transaktional) statt erst client-seitig nachzuladen;
  Auto-Speicherung von 2s auf 300ms Debounce beschleunigt
- Marken-Redesign: neue globale Kopfzeile mit Sprachauswahl-Button
  (Deutsch/Englisch), sportlichere Eigenmarke bei unverändertem
  Vikings-/IFF-Theme
- Spielfeld-Rendering IFF-korrekt überarbeitet: Anspielpunkte statt
  Mittelkreis (Floorball nutzt keinen Mittelkreis), Torraum-Abstand zur
  Bande (bespielbarer Raum hinter dem Tor), grüne statt fußballtypische
  Spielfläche
- `/boards` ist jetzt die direkte Startseite nach Login/Registrierung
  statt einer separaten Zwischenseite (siehe Removed)
- **Vollständige Abhängigkeits- und Runtime-Modernisierung** (5 Phasen,
  jede einzeln verifiziert und committed):
  - Backend: Express 4→5, redis-Client 4→6 (RESP3-Default), archiver 7→8
    (ESM-Rewrite, `ZipArchive`-Klasse statt Factory-Funktion), dotenv
    16→17, express-rate-limit 7→8, jest 29→30, eslint 9→10
  - Frontend: zustand 4→5, konva 9→10 (`Konva.legacyTextRendering = true`
    gesetzt, um das bisherige Text-Rendering pixelgenau zu erhalten),
    i18next 23→26, react-i18next 14→17
  - Infrastruktur: Node 20/22→24 (Active LTS) in allen Dockerfiles + CI,
    nginx 1.27→1.30, **Postgres 16→18** (Live-Migration der
    Produktivdatenbank per pg_dump/pg_restore in ein neues Volume –
    Postgres-Datenverzeichnisse sind zwischen Majors nicht kompatibel,
    altes Volume bleibt als Fallback erhalten), Redis-Server 7→8, alle
    GitHub Actions auf aktuelle Major-Versionen
  - Bewusst zurückgestellt: Vite 7→8 + `@vitejs/plugin-react` 5→6
    (ungelöster Peer-Konflikt mit einer Pre-Release-Version von
    `@babel/core` im Rolldown-Ökosystem), ESLint 10 im Frontend
    (`eslint-plugin-react` unterstützt aktuell nur `eslint ^9.7`)

### Fixed
- Fünf Dependency-Sicherheitslücken behoben (#32), u. a. bcrypt→tar-Kette
- Vite 5→7 + `@vitejs/plugin-react` aktualisiert – Sicherheitslücke im
  esbuild-Dev-Server geschlossen (#34)
- react-router v8 + React 19 – CSRF-Bypass-Lücke GHSA-qwww-vcr4-c8h2
  geschlossen (#35)
- `JWT_SECRET` wird beim Start jetzt auf Vorhandensein und Mindestlänge
  geprüft, statt stillschweigend mit einem schwachen Wert zu starten (#40)
- Line konnte nicht mehr losgelassen werden, sobald man mit dem Zeichnen
  einer Linie/eines Pfeils begonnen hatte (Konva-Hit-Testing-Bug)
- `<html lang>` wird jetzt synchron mit der UI-Sprache gehalten (#0849a5d,
  WCAG 3.1.1) – Screenreader lasen sonst mit falschen Ausspracheregeln vor
- Team-Farben (`homeColor`/`awayColor`) wurden beim Speichern kaputt
  persistiert (#33)
- Positions-Bezeichnungen an den tatsächlichen Floorball-Standard
  angepasst statt Eishockey-Terminologie (#28)
- Weißer Text auf weißem Button im Vikings-Theme
- Datenschutzerklärung ergänzt: Backup-Aufbewahrungsfristen nach
  Kontolöschung waren nicht dokumentiert (#41)
- **archiver v8**: ESM-Rewrite ohne Default-Export brach den
  Account-Export/Backup-Cron kommentarlos – auf die neue `ZipArchive`-API
  umgestellt
- **nginx-Cache-Regel**: Service-Worker-Datei (`sw.js`) wurde von der
  generischen Static-Asset-Regel fälschlich 1 Jahr lang gecacht, was
  PWA-Updates nie beim Client hätte ankommen lassen
- **Postgres-18-Image**: neue Mount-Konvention (`/var/lib/postgresql`
  statt `.../data`) erkannt und Compose-Konfiguration entsprechend
  angepasst, bevor produktiv migriert wurde

### Security
- Datensparsamkeit in Logs: keine E-Mail-Adressen/Klarnamen mehr in
  Log-Statements, wo eine User-ID zur Nachverfolgung ausreicht; Log-Datei
  mit Größen-/Rotationsgrenze versehen
- Ungenutzte DB-Spalte `exports.file_path` entfernt (#42, Datensparsamkeit)
- Kein persistenter Admin-Audit-Trail eingeführt – als nicht notwendig
  bewertet, da Alleinbetrieb (#43, geschlossen als „wontfix")

### Removed
- **Dashboard-Seite** entfernt (reine Begrüßungs-/Zwischenseite ohne
  Eigenwert) – `/boards` ist jetzt die direkte Startseite. Das
  Statistik-Widget (#50, „Statistiken zu genutzten Formationen/Lines")
  wurde mitentfernt, da es ausschließlich auf dem jetzt entfernten
  Dashboard angezeigt wurde; ebenso der zugehörige Backend-Endpunkt
  `GET /api/user/stats`, um keinen toten Code zu hinterlassen.

---

## [0.8.0] – 2026-08-02

### Added
- **MP4-Video-Export** via FFmpeg, wahlweise mit Wasserzeichen (#23)
- **PDF-Taktikblatt-Export** via pdfkit, mehrere Frames pro Seite (#24)
- **Mehrsprachigkeit**: Englisch als zweite Sprache (i18n vollständig) (#25)

### Fixed
- Vite 5→7 + `@vitejs/plugin-react` – esbuild-Dev-Server-Sicherheitslücke
  geschlossen (#34)
- react-router v8 + React 19 – CSRF-Bypass-Lücke GHSA-qwww-vcr4-c8h2 (#35)
- `<html lang>`-Attribut wird bei Sprachwechsel synchron gehalten (WCAG 3.1.1)

---

## [0.7.0] – 2026-08-02

### Added
- **Barrierefreiheit Teil 1** (#19): Skip-Links, Fokus-Management,
  vollständige Tastaturnavigation, Formularmuster/-validierung
- **Barrierefreiheit Teil 2** (#19): Screenreader-Live-Ankündigungen,
  Legasthenie-freundliche Schrift (OpenDyslexic), Farbblindheits-Modi
- **DSGVO-Konformität** (#20): Datenschutzseite, Auskunftsrecht Art. 15,
  IP-Anonymisierung in Logs
- **Backup & Export** (#21): manueller Datenexport/-import (ZIP) +
  automatische, konfigurierbare Admin-Backups mit Aufbewahrungsfrist
- **Datenvernichtung** (#22): Account inkl. aller Daten löschen, mit
  E-Mail-Bestätigung

### Fixed
- Positions-Bezeichnungen an den Floorball-Standard angepasst (#28)
- Datensparsamkeit: keine E-Mail-Adressen in Logs, Log-Größenbegrenzung

---

## [0.6.0] – 2026-08-01

### Added
- **Team-Farben**: Heim-/Auswärtsfarbe + Ballfarbe konfigurierbar,
  IFF-konforme Farbpalette (#14)
- **Einstellungsseite** (`/settings`) mit Passwort ändern, E-Mail ändern,
  Account löschen (#18, #17, #31, #22)
- **Admin-Panel**: Benutzerverwaltung für den ersten registrierten
  Account (automatisch Admin) (#26)
- Dashboard-Redesign: personalisierte, zentrierte Begrüßungsseite
  *(in v0.9.0 wieder entfernt, siehe dort)*

### Fixed
- Team-Farben (`homeColor`/`awayColor`) wurden beim Speichern kaputt
  persistiert (#33)
- Weißer Text auf weißem Button im Vikings-Theme
- Fünf Dependency-Sicherheitslücken behoben (#32)
- Dashboard verlinkte fälschlich nicht zu den Spielfeldern

---

## [0.5.0] – 2026-08-01

### Added
- **GIF-Export** via FFmpeg, serverseitig gerendert aus Konva-Offscreen-PNGs (#15)
- **Share-Link mit Ablaufzeit**: Spielzug ohne Login ansehen, konfigurierbare
  Gültigkeitsdauer (#16)
- Positions-Hinweise/Tooltips für jede Spielerposition, tastaturzugänglich (#27)

### Fixed
- Export: Backend-Absturz durch fehlende ffmpeg-Installation im
  Produktions-Image behoben

---

## [0.4.0] – 2026-08-02

### Added
- **Lines-System** (Issue #12): Sturm-/Defensivreihen anlegen, Spieler zuweisen,
  Farben & Typ (offense/defense/special) konfigurieren, aktive Line auf dem
  Feld hervorheben. Max. 10 Lines pro Board.
- **Spielfeld-Varianten** (Issue #13): Kleinfeld (20×14m), 3v3 (22×11m) und
  Street Floorball (25×15m) zusätzlich zum Großfeld, wählbar bei Board-
  Erstellung und nachträglich im Editor änderbar (mit Warnung + proportionaler
  Neuskalierung bestehender Positionen/Zeichnungen)
- Automatisches Seeding feldtyp-passender Standardpositionen für neue Boards

### Fixed
- Login/Register: CORS-Origin-Mismatch bei Zugriff über LAN-IP behoben
- Session-Cookie wurde mit `Secure`-Flag über reines HTTP ausgeliefert und
  vom Browser verworfen (neu: `COOKIE_SECURE` konfigurierbar)
- Axios-Interceptor leitete bei jedem 401 sofort zum Login um – auch beim
  Login/Register-Request selbst, wodurch Fehlermeldungen sofort verschwanden
- Fehlende i18n-Keys (`auth.*`, `a11y.skipToContent`) auf Login/Register-Seite
- Zeichen-Werkzeugleiste (`DrawingToolbar`) war nirgends eingebunden –
  Farbe/Strichstärke/Undo/Redo/Clear waren über die UI nicht erreichbar
- Spielerpositionen wurden beim Ziehen nicht an die Feldgrenzen geklemmt
- Docker-Healthchecks (Compose + Dockerfiles) nutzten `localhost`, was durch
  IPv6-Auflösung in Alpine-Containern fälschlich als "unhealthy" galt

---

## [0.3.0] – 2026-08-01

### Added
- **Frame-System** (Issue #10)
  - `FrameSchema` als Sub-Document im Board-Modell: Felder `order`, `label`, `players`, `elements`, `duration`
  - `framesController.js`: 5 REST-Endpunkte (GET, POST, PUT, DELETE, Reorder)
  - `frames.js` Router mit express-validator Validierung
  - Max. 50 Frames pro Board (server- und clientseitig erzwungen)
  - `useFrames.js` Hook: vollständiges State-Management (CRUD, Reihenfolge, aktiver Frame, goNext/goPrev, optimistisches Reorder + Rollback)
  - `FrameTimeline.jsx`: Timeline-Komponente am unteren Spielfeldrand
    - Drag & Drop zum Sortieren
    - Hover-Delete (× Button)
    - „+ Frame“ Button
    - Frame-Zähler (1 / 5)
    - Barrierefreiheit: aria-label, aria-pressed, aria-live
  - `FrameTimeline.module.css`: vollständiges Styling mit CSS-Variablen
- **Board Model** (Issues #5, #7, #10)
  - `notes`-Feld ergänzt (max. 500 Zeichen) für Coach-Notizen
  - `frames[]` Sub-Array für Frame-by-Frame System
  - `activeFrameIndex` persistiert
  - `lines[]` Sub-Schema für Lines-System vorbereitet
- **Animation** (#11): Play/Pause/Stop, Geschwindigkeit einstellbar,
  Spieler-Interpolation zwischen Frames
- **Postcard-Galerie** (#30): Board-Übersicht als Postkarten
  (Spielfeld-Miniatur links, Notizen rechts, nur lesbar in der Galerie)
- Spielername auf Spielertoken anzeigen, Line-abhängig ein-/ausblendbar (#29)

---

## [0.2.0] – 2026-08-01

### Added
- `FloorballField.jsx`: IFF-konformes 2D Großfeld mit Konva.js
  - Alle IFF-Linien: Mittellinie, Mittelkreis (r=2.85m), Torraum (4×5m)
  - Torwartfläche (2.5×1m), Tore (160×115cm), abgerundete Ecken
  - Theme-aware Farben (dark / light / vikings / iff)
- `FieldContainer.jsx`: responsiver Wrapper mit ResizeObserver
- `fieldConfig.js`: alle IFF-Maße als Konstanten (Groß-, Kleinfeld, Street, 3v3)
  - IFF-Ballfarben-Definitionen
  - Standard-Spielerpositionen Großfeld
  - Snapping-Raster-Optionen
- `useField.js`: Hook für Spielfeld-State (Typ, Grid, Zoom)
- `FieldContainer.module.css`: Shimmer-Ladeanimation
- i18n Locale-Dateien: `de.json` + `en.json` (vollständig)
- CSS Design-Tokens: alle 4 Themes (dark, light, vikings, iff)
- CI-Workflows repariert: fehlende Dateien, ESLint-Configs, Jest-Setup
- `index.html` + `main.jsx` als Vite-Einsteigspunkte
- `base.css` + `tokens.css` als CSS-Grundlage

### Fixed
- `dependency-review.yml`: nur noch auf Pull Requests (nicht push)
- `security.yml`: cron-Syntax korrigiert
- `release.yml`: `workflow_dispatch` als Trigger ergänzt
- `label-sync.yml`: `continue-on-error` bei Permission-Fehlern
- `ci.yml`: Cache-Key und `npm install` statt `npm ci`
- ESLint-Configs für Frontend (JSX) und Backend (Node.js Globals)
- Jest-Config für native ES Modules

---

## [0.1.0] – 2026-07-31

### Added
- Backend-Grundstruktur: Express.js, Helmet, CORS, Morgan, Rate-Limiting
- JWT-Authentifizierung (Register, Login, Refresh, Logout)
- PostgreSQL-Datenbankschema: `users`, `settings`, `boards`, `frames`, `lines`, `exports`
- Redis-Session-Management
- Docker Compose: backend, frontend, postgres, redis, nginx
- Nginx-Reverse-Proxy-Konfiguration
- GitHub Repository-Struktur: Labels, Issue-Templates, Milestones
- Automatisierte Workflows: CI, Release, Security, Dependency Review, Label Sync
- CHANGELOG, Wiki, Roadmap
- `.env.example` für alle Services
- Seed-Skript mit Demo-Admin und Demo-Board
- AI-Slop-Hinweis + Ideengeber-Klausel in README
