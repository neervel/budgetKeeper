FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm install --prefer-offline --no-audit

FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

CMD ["npm", "start"]
