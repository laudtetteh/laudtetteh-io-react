FROM node:20-alpine

# Set working directory
WORKDIR /app

# Accept build-time environment variables
ARG NEXT_PUBLIC_IS_DOCKER
ARG NEXT_PUBLIC_API_LOCAL
ARG NEXT_PUBLIC_API_DOCKER
ARG NEXT_PUBLIC_API_URL

# Export as ENV so Next.js can inline them during build
ENV NEXT_PUBLIC_IS_DOCKER=${NEXT_PUBLIC_IS_DOCKER}
ENV NEXT_PUBLIC_API_LOCAL=${NEXT_PUBLIC_API_LOCAL}
ENV NEXT_PUBLIC_API_DOCKER=${NEXT_PUBLIC_API_DOCKER}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

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

# Expose port
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]
