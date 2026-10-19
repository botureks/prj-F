# ── Stage 1: install all dependencies (including dev) ──────────────────────────
FROM node:18-alpine AS deps

RUN apk add --no-cache python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# ── Stage 2: compile TypeScript ────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ./node_modules/.bin/nest build

# ── Stage 3: production image ──────────────────────────────────────────────────
FROM node:18-alpine AS production

RUN apk add --no-cache openssl python3 make g++ //RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps --omit=dev && npm cache clean --force

RUN apk del python3 make g++

COPY --from=builder /app/dist ./dist

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/docker-entrypoint.sh"]
