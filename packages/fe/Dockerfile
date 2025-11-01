FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/fe/package.json ./packages/fe/

RUN npm ci --workspace=packages/fe

COPY packages/fe ./packages/fe

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app/packages/fe
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/packages/fe/dist /usr/share/nginx/html

COPY packages/fe/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]