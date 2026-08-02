# 📚 Architektur-Übersicht

## 📱 Tech Stack

### Backend
| Technologie | Version | Zweck |
|---|---|---|
| Node.js | 20 LTS | Laufzeitumgebung |
| Express.js | 4.x | HTTP Framework |
| PostgreSQL | 16 | Datenbank |
| Redis | 7 | Session/Cache |
| bcrypt | 5.x | Passwort-Hashing |
| jsonwebtoken | 9.x | JWT Auth |

> FFmpeg (Video/GIF-Export) ist geplant, aber noch nicht implementiert (Issues #15, #23, #24).

### Frontend
| Technologie | Version | Zweck |
|---|---|---|
| React | 18 | UI Framework |
| Vite | 5 | Build Tool |
| Konva.js | 9 | Canvas/2D Rendering |
| Zustand | 4 | State Management |
| React Router | 6 | Routing |
| i18next | 23 | Internationalisierung |

> Icons werden aktuell über Unicode/Emoji dargestellt, keine Icon-Bibliothek im Einsatz.

### Infrastruktur
| Technologie | Zweck |
|---|---|
| Docker Compose | Multi-Container Orchestrierung |
| Nginx | Frontend-Serving + API-Proxy |
| GitHub Actions | CI/CD Pipeline |

## 🏛️ Container-Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Network (floorforge)                │
│                                                               │
│  ┌─────────────┐     ┌─────────────┐     ┌───────────┐  │
│  │  Frontend  │ →│  Backend   │ →│ PostgreSQL│  │
│  │ Nginx:80   │  │ Node:3001  │   │ Port:5432 │  │
│  └─────────────┘     └─────────────┘     └───────────┘  │
│       :3000               │ →│  Redis    │          │
│                           │   │ Port:6379 │          │
│                           │   └───────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Datenfluss: GIF-Export (geplant, Issue #15 – noch nicht implementiert)

```
Coach klickt "GIF exportieren"
  ↓
Frontend rendert Frames als PNG (Konva.js canvas.toDataURL())
  ↓
PNGs als Base64 an Backend (POST /api/export/gif)
  ↓
Backend speichert PNGs temporär
  ↓
FFmpeg kombiniert PNGs zu GIF
  ↓
GIF gespeichert in /app/exports/
  ↓
Download-URL zurück an Frontend
  ↓
Coach lädt GIF herunter
```
