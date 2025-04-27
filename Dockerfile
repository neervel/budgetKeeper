FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm i && npm cache clean --force
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/audio ./audio
COPY package.json ./


CMD ["npm", "start"]


