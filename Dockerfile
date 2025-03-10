FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG MODE=production
RUN npm run build -- --mode $MODE

FROM nginx:alpine
COPY --from=builder /app/dist /var/www/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

