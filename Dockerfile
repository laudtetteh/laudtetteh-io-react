FROM node:20-alpine

# Set working directory
WORKDIR /app

# Accept build-time environment variables
ARG API_SERVER
ARG NEXT_PUBLIC_API_BROWSER
ARG NEXT_PUBLIC_AWS_S3_BUCKET

# Export as ENV so Next.js can inline them during build
ENV API_SERVER=${API_SERVER}
ENV NEXT_PUBLIC_API_BROWSER=${NEXT_PUBLIC_API_BROWSER}
ENV NEXT_PUBLIC_AWS_S3_BUCKET=${NEXT_PUBLIC_AWS_S3_BUCKET}

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
