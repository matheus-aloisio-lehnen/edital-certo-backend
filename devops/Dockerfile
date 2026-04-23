# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# -------------------------
# deps
# -------------------------
FROM base AS deps
COPY package*.json ./
RUN npm ci

# -------------------------
# build
# -------------------------
FROM base AS build
ENV NODE_ENV=prod
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# -------------------------
# dev
# -------------------------
FROM base AS dev
ENV NODE_ENV=dev
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# -------------------------
# debug
# -------------------------
FROM base AS debug
ENV NODE_ENV=dev
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
EXPOSE 9229
CMD ["npm", "run", "start:debug:docker"]

# -------------------------
# hml
# -------------------------
FROM base AS hml
ENV NODE_ENV=prod
COPY package*.json ./
RUN npm ci
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "dist/main"]

# -------------------------
# prod deps
# -------------------------
FROM base AS prod-deps
ENV NODE_ENV=prod
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# -------------------------
# prod
# -------------------------
FROM base AS prod
ENV NODE_ENV=prod
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "dist/main"]