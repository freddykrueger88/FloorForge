FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# --- Runtime ---
FROM node:20-alpine

# FFmpeg für Export-Funktionen
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Non-root user
RUN addgroup -S floorforge && adduser -S floorforge -G floorforge
RUN mkdir -p /app/exports /app/uploads && chown -R floorforge:floorforge /app
USER floorforge

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "src/server.js"]
