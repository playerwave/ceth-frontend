FROM node:20-alpine AS builder
WORKDIR /app

# เครื่องมือคอมไพล์สำหรับ native deps (ถ้ามี)
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .

# ถ้าโปรเจกต์คุณต้องการ ENV ตอน build (Vite)
# ARG VITE_API_URL
# ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

