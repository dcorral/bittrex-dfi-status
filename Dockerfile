FROM node:16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN npm ci --only=production
COPY . .
CMD ["node", "index.js"]
