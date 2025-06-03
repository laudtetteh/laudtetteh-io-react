FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.mjs ./
RUN npm install --include=dev

# Copy source files
COPY . .

# Build the production-ready app
RUN npm run build

# Expose port (optional, but helpful)
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]
