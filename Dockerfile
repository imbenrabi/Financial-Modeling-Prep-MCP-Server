# ---- Build stage ----
FROM node:25.3.0-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:25.3.0-alpine AS runner
WORKDIR /app

# Copy manifests and install prod deps as root
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built app; make sure files are owned by the non-root user
COPY --from=builder /app/dist ./dist
# If base image has the 'node' user (it does in node:lts-alpine):
RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["node", "dist/index.js"]
