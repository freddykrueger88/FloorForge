# ================================================
# FloorForge Backend – Multi-Stage Dockerfile
# ================================================

# ── Base ─────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app

# Systemabhängigkeiten (python3/make/g++ für bcrypt native bindings, ffmpeg für GIF-Export)
RUN apk add --no-cache python3 make g++ ffmpeg

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
FROM node:20-alpine AS production
WORKDIR /app

# ffmpeg wird zur Laufzeit für den GIF-Export gebraucht (Issue #15, exportController.js)
RUN apk add --no-cache ffmpeg

# Nur Produktions-Abhängigkeiten
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json

# Export-/Backup-Ordner anlegen
RUN mkdir -p /app/exports /app/backups

# Non-root User
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && chown -R appuser:appgroup /app
USER appuser

EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/health || exit 1

CMD ["node", "src/server.js"]
