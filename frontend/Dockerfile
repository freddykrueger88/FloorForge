# ================================================
# FloorForge Frontend – Multi-Stage Dockerfile
# ================================================

# ── Build Stage ──────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Build-Argument für API-URL
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Production: Nginx ─────────────────────────────
FROM nginx:1.27-alpine AS production

# Non-root: nginx läuft als nginx user
RUN chown -R nginx:nginx /var/cache/nginx /var/run && \
    chmod -R 755 /var/cache/nginx

# Build-Artefakte kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
