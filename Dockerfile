FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy production dependencies and built application
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/config ./config

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["node", "dist/main"] 