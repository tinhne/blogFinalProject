# Sử dụng Node.js phiên bản LTS
FROM node:18

# Cài đặt pnpm
RUN corepack enable && corepack prepare pnpm@10.6.5 --activate

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json, pnpm-lock.yaml vào container
COPY package.json pnpm-lock.yaml ./

# Cài đặt dependencies (Không chạy postinstall vì có thể gây lỗi)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Sao chép toàn bộ code vào container
COPY . .

# Chạy Prisma generate (tạo client)
RUN pnpm exec prisma generate

# Expose cổng mà Fastify sử dụng
EXPOSE 3000
EXPOSE 4000
EXPOSE 5000

# Khởi chạy server
ENTRYPOINT ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm run dev"]
