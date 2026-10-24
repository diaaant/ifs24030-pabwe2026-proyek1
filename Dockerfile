FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci

COPY . .
# URL API dibakukan saat build (aplikasi berjalan sebagai SPA statis)
ARG VITE_API_BASEURL=http://localhost:8000/api
ENV VITE_API_BASEURL=$VITE_API_BASEURL
RUN npx nuxt generate

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
