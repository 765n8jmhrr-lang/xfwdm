# ========================
# 拍版宝 Node.js API 服务
# ========================
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装系统依赖（sharp需要）
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev

# 复制package文件
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm ci --production && npm cache clean --force

# 复制源码
COPY src/ ./src/
COPY database/ ./database/

# 创建非root用户
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# 启动
CMD ["node", "src/app.js"]
