# ==========================================
# STAGE 1: Build
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy dependency manifests
COPY package*.json tsconfig.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY src/ ./src/

# Compile TypeScript
RUN npm run build

# Prune devDependencies to keep container light
RUN npm prune --production

# ==========================================
# STAGE 2: Production Runtime
# ==========================================
FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy built app and production dependencies from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Run as non-privileged system user for security
USER node

# Port is typically set dynamically by Cloud Run, fallback to 8080
EXPOSE 8080

CMD ["npm", "start"]
