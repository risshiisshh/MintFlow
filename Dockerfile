# ── Stage 1: Build Frontend ──────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app
# Copy frontend root files
COPY package.json package-lock.json ./
RUN npm ci
# Copy all root source code (frontend)
COPY src ./src
COPY public ./public
COPY index.html vite.config.js tailwind.config.js postcss.config.js eslint.config.js ./
RUN npm run build

# ── Stage 2: Build Backend ───────────────────────────────────────────────────
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# ── Stage 3: Production Runtime ──────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Copy production backend manifests
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled backend output
COPY --from=backend-builder /app/dist ./dist

# Copy built frontend static files
COPY --from=frontend-builder /app/dist ./frontend-dist

# Cloud Run injects PORT env var; default to 8080
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/app.js"]
