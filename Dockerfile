# ---- Build stage ----
FROM node:lts-alpine AS builder
WORKDIR /app

# Install all dependencies (including dev) for building
COPY package.json package-lock.json ./
RUN npm install --no-fund --no-audit

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:lts-alpine AS runner
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev --no-fund --no-audit

# Copy built app; make sure files are owned by the non-root user
COPY --from=builder /app/dist ./dist
# If base image has the 'node' user (it does in node:lts-alpine):
RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["node", "dist/index.js"]