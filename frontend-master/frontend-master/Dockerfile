# ── Stage 1: install dependencies ─────────────────────────────────────────────
FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# ── Stage 2: build Next.js (standalone output) ─────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG GRAPHQL_URL
ENV GRAPHQL_URL=${GRAPHQL_URL}

ENV SENTRY_IGNORE_API_ERROR=1

RUN npm run build

# ── Stage 3: production image ──────────────────────────────────────────────────
FROM node:18-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV GRAPHQL_URL=${GRAPHQL_URL}

CMD ["node", "server.js"]
