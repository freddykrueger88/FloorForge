# 📤 Export & Teilen

Alle Optionen im "Export"-Tab des unteren Menüs im Board-Editor.

## GIF / MP4

Rendert die Frame-Sequenz als Video-Datei (via FFmpeg im Backend).

| Option | Werte |
|---|---|
| Format | GIF oder MP4 |
| FPS | 1–15 |
| Breite | 480 / 720 / 1280 px |
| Loop (nur GIF) | ein/aus |
| Wasserzeichen (nur MP4) | ein/aus |

Mindestens 2 Frames erforderlich, maximal 60 Frames pro Export. Der
Export läuft asynchron (Status-Polling), die fertige Datei ist danach
24h zum Download verfügbar, danach automatisch entfernt.

## PDF-Taktikblatt

Rendert einen oder mehrere Frames als druckfertiges PDF.

| Option | Werte |
|---|---|
| Frames pro Seite | 1, 2 oder 4 |
| Papierformat | A4 oder Letter |

Läuft synchron (kein Job-Status nötig), direkter Download.

## Link teilen (öffentlich, ohne Login)

Erzeugt einen öffentlichen Link zu einer schreibgeschützten Ansicht des
Boards – z. B. um Spielern einen Spielzug ohne eigenen FloorForge-Account
zu zeigen. Der Link läuft automatisch nach `SHARE_LINK_EXPIRES_HOURS`
(Standard 72h) ab und ist danach nicht mehr aufrufbar.

## Board teilen (Kollaboratoren)

Anders als der öffentliche Link: ein **anderer registrierter
FloorForge-Nutzer** bekommt dauerhaften Zugriff auf das Board.

- **Voraussetzung**: die eingeladene Person hat bereits einen
  FloorForge-Account (kein Einladungslink für neue Nutzer, siehe
  [FAQ](./FAQ.md))
- **Berechtigungsstufen**: Lesen oder Bearbeiten
- Maximal 10 Kollaboratoren pro Board
- Ist [SMTP konfiguriert](./E-Mail-Versand.md), bekommt die
  hinzugefügte Person eine kurze Benachrichtigungsmail

Nur der Board-Owner kann Kollaboratoren verwalten (hinzufügen, Rechte
ändern, entfernen).
