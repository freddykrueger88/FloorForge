# 🎨 Frontend-Struktur

React 19 + Vite, kein zentrales Redux – Server-State über eigene
Hooks pro Ressource, Client-State über schlanke Zustand-Stores.

```
frontend/src/
├── pages/          Eine Datei pro Route (React Router)
├── components/      Nach Fachbereich gruppiert (siehe unten)
├── hooks/           Ein Hook pro Backend-Ressource + UI-Verhalten
├── store/           Zustand-Stores (globaler Client-State)
├── constants/        Statische Konfiguration (Feldmaße, Farben, Tools)
├── i18n/locales/     de.json / en.json
└── utils/            API-Client, Formatierung, Offline-Queue
```

## Seiten (`pages/`)

| Route | Datei |
|---|---|
| `/boards` | `BoardsPage.jsx` |
| `/board/:id` | `BoardEditorPage.jsx` |
| `/trainings` | `TrainingsPage.jsx` |
| `/trainings/:id` | `TrainingSessionPage.jsx` |
| `/roster` | `RosterPage.jsx` |
| `/settings` | `SettingsPage.jsx` |
| `/share/:token` | `SharePage.jsx` (öffentlich, kein Login) |
| `/privacy` | `PrivacyPage.jsx` |
| `/rules` | `RulesPage.jsx` |
| `/login`, `/register` | `LoginPage.jsx`, `RegisterPage.jsx` |

Alle Seiten sind `lazy()`-geladen (Code-Splitting pro Route).

## Komponenten (`components/`)

| Ordner | Inhalt |
|---|---|
| `field/` | Spielfeld-Rendering (Konva), Spieler-Tokens, Feld-Einstellungen |
| `drawing/` | Zeichenwerkzeuge, Koordinaten-Formular |
| `frames/` | Frame-Timeline |
| `playback/` | Play/Pause/Speed/Loop-Steuerung |
| `lines/` | Lines-Panel |
| `formations/` | Formationen-Panel |
| `board/` | Notizen, Export-Panels, Kollaboratoren-Modal, Tab-Menü (`BoardSidePanelTabs`) |
| `boards/` | Board-Übersicht (Kacheln, Postkarten-Galerie, Playbook-Filter) |
| `trainings/` | Trainingsplaner-UI |
| `layout/` | Header, Skip-Links |
| `a11y/` | Barrierefreiheits-Hilfskomponenten |
| `settings/` | Einstellungen-UI-Bausteine |

## Wichtigste Hooks (`hooks/`)

Ein Hook pro Backend-Ressource kapselt üblicherweise: Laden, Anlegen,
Ändern, Löschen sowie lokalen Zustand.

| Hook | Zuständig für |
|---|---|
| `useBoardsApi` | Boards CRUD |
| `useFrames` | Frames + aktiver Frame |
| `useDrawing` | Zeichenwerkzeuge, Undo/Redo, Tastaturkürzel |
| `useLines`, `useFormations`, `usePlaybooks` | jeweiliges Backend-Modul |
| `useRoster` | Kader |
| `useTrainingSessions`, `useTrainingSessionItems` | Trainingsplaner |
| `useBoardCollaborators` | Board-Sharing |
| `useAutoSave` | Debounced + Intervall-Speichern, Status-Anzeige |
| `useAnimation` | Frame-Wiedergabe, Interpolation, Tastaturkürzel |
| `useExport`, `usePdfExport` | GIF/MP4/PDF-Export inkl. Job-Polling |
| `useShare` | Öffentliche Share-Links |
| `useSettings` | Account-Einstellungen |
| `useBackup` | Admin-Backup-Konfiguration |
| `useField` | Feldtyp, Grid, Zoom |

## Stores (`store/`)

| Store | Zweck |
|---|---|
| `authStore` | Eingeloggter Nutzer |
| `themeStore` | Aktives Theme (dark/light/vikings/iff) |
| `announceStore` | ARIA-Live-Ankündigungen für Screenreader |
| `offlineStore` | Online/Offline-Status, Warteschlange für PWA (siehe [Architektur](./Architektur.md#offline-modus-pwa)) |

## Internationalisierung

`i18next` + `react-i18next`, zwei Sprachen (`de`, `en`) als flache
JSON-Dateien unter `i18n/locales/`. Sprachwahl in den
[Einstellungen](./Einstellungen.md).
