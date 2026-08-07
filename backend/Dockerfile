# ================================================
# OpenFloorball Backend – Multi-Stage Dockerfile
# ================================================

# ── Base ─────────────────────────────────────────
FROM node:24-alpine AS base
WORKDIR /app

# Systemabhängigkeiten (python3/make/g++ für bcrypt native bindings, ffmpeg
# für GIF-/MP4-Export, font-dejavu fürs MP4-Wasserzeichen – Issue #23)
RUN apk add --no-cache python3 make g++ ffmpeg font-dejavu

# Abhängigkeiten zuerst kopieren (Layer-Cache nutzen)
COPY package*.json ./

# ── Development ──────────────────────────────────
FROM base AS development
RUN npm ci
COPY . .
# Non-root User
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
EXPOSE 3001
CMD ["npm", "run", "dev"]

# ── Builder ──────────────────────────────────────
FROM base AS builder
RUN npm ci --omit=dev
COPY . .

# ── Production ───────────────────────────────────
FROM node:24-alpine AS production
WORKDIR /app

# ffmpeg wird zur Laufzeit für den GIF-/MP4-Export gebraucht (Issue #15,
# #23, exportController.js), font-dejavu fürs MP4-Wasserzeichen
RUN apk add --no-cache ffmpeg font-dejavu

# Nur Produktions-Abhängigkeiten
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json

# Export-/Backup-/Video-Ordner anlegen
RUN mkdir -p /app/exports /app/backups /app/videos

# Non-root User
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/health || exit 1

CMD ["node", "src/server.js"]
