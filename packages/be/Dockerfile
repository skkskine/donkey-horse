FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/be/package.json ./packages/be/

RUN npm ci --workspace=packages/be

COPY packages/be ./packages/be

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/packages/be ./packages/be

WORKDIR /app
RUN npm ci --workspace=packages/be --omit=dev

WORKDIR /app/packages/be

EXPOSE 4200

CMD ["node", "server.js"]