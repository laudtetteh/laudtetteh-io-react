FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.mjs ./

RUN npm install --include=dev

COPY public ./public
COPY pages ./pages
COPY components ./components
COPY styles ./styles
COPY utils ./utils

CMD ["npm", "run", "dev"]
