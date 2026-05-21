# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy backend dependency manifests first (cache-friendly layer)
COPY backend/package.json backend/package-lock.json ./

# Install ALL dependencies (including devDependencies for tsc)
RUN npm ci

# Copy the rest of the backend source
COPY backend/ ./

# Compile TypeScript → JavaScript
RUN npm run build

# ── Stage 2: Production Runtime ───────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only production dependency manifests
COPY backend/package.json backend/package-lock.json ./

# Install production-only dependencies (no devDependencies)
RUN npm ci --omit=dev

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Cloud Run injects PORT env var; default to 8080 to match .env.example
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Graceful startup: use the compiled entry point
CMD ["node", "dist/app.js"]
