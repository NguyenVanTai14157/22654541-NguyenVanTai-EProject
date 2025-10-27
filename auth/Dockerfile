# Sử dụng image Node.js nhẹ (phiên bản 18, alpine = nhẹ hơn)
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container là /app
WORKDIR /app

# Sao chép 2 file package.json và package-lock.json vào container (để cài thư viện)
COPY package*.json ./

# Cài đặt toàn bộ các thư viện được khai báo trong package.json
RUN npm install --production

# Copy toàn bộ mã nguồn từ máy thật (host) vào container
COPY . .

# Mở port 3000 để container lắng nghe (port của service Auth)
EXPOSE 3000

# Lệnh khởi chạy ứng dụng khi container chạy
CMD ["npm", "start"]
