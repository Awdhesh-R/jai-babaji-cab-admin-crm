# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_BASE_URL
ARG NEXT_IMG_BASE_URL
ARG NEXT_PUBLIC_MINI
ARG NEXT_PUBLIC_SEDAN
ARG NEXT_PUBLIC_SUV
ARG OLA_KEY
ARG OLA_STYLE_JSON_API
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Set environment variables for build
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_BASE_URL=$NEXT_BASE_URL
ENV NEXT_IMG_BASE_URL=$NEXT_IMG_BASE_URL
ENV NEXT_PUBLIC_MINI=$NEXT_PUBLIC_MINI
ENV NEXT_PUBLIC_SEDAN=$NEXT_PUBLIC_SEDAN
ENV NEXT_PUBLIC_SUV=$NEXT_PUBLIC_SUV
ENV OLA_KEY=$OLA_KEY
ENV OLA_STYLE_JSON_API=$OLA_STYLE_JSON_API
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

ENV NEXT_TELEMETRY_DISABLED=1
ENV STANDALONE=true

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set correct permissions for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
