# ── Stage 1: install all dependencies (including dev) ──────────────────────────
FROM node:18-alpine AS deps

RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# ── Stage 2: compile TypeScript ────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ./node_modules/.bin/nest build

# ── Stage 3: production image ──────────────────────────────────────────────────
FROM node:18-alpine AS production

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force

COPY --from=builder /app/dist ./dist

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/docker-entrypoint.sh"]
