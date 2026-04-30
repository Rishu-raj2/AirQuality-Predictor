# Use the official lightweight Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests first for better Docker layer caching
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the application source
COPY . .

# Expose the application port
EXPOSE 3000

# Start the server
ENTRYPOINT ["node", "server.js"]