FROM ghcr.io/puppeteer/puppeteer:19.4.0
WORKDIR /usr/src/app
COPY package*.json ./
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]
