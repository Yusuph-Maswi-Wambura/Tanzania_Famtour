FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY Tanzania_Famtour.ejs ./
COPY package*.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
