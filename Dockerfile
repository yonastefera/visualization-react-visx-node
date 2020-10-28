FROM node:14.1-alpine AS builder

WORKDIR app
COPY package.json package-lock.json ./
RUN npm install

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
RUN npm run build
CMD NODE_ENV=production PORT=80 npm run server-production
