FROM node:18

WORKDIR /app

COPY package*.json ./

# 🔧 ติดตั้ง dependencies + native modules สำหรับ Linux
RUN npm install --legacy-peer-deps && \
    npm install @tailwindcss/oxide --force && \
    npm install lightningcss --force

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
