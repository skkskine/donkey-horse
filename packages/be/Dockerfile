# STAGE 1

FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/be/package.json ./packages/be/
COPY packages/migrations/package*.json ./packages/migrations/

RUN npm ci --workspace=packages/be --workspace=packages/migrations

COPY packages/be ./packages/be
COPY packages/migrations ./packages/migrations

#STAGE 2

FROM node:22-alpine
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/packages/be ./packages/be
COPY --from=builder /app/packages/migrations ./packages/migrations

RUN npm ci --workspace=packages/be --workspace=packages/migrations --omit=dev

EXPOSE 4200

CMD sh -c "cd /app && npm run migrate:up --workspace=packages/migrations && cd /app/packages/be && node server.js"