# ====================================
# Mall-Admin-Web Dockerfile
# 方案2: 全Debian镜像构建
# ====================================

# ===== 构建阶段 - 使用完整的Debian环境 =====
FROM node:16-bullseye as build-stage

# 设置工作目录
WORKDIR /app

# 复制依赖配置文件
COPY package*.json ./

# 安装项目依赖
# Debian环境自带Python和g++,node-sass可以正常编译
RUN npm ci || npm install

# 复制项目源码
COPY . .

# 构建项目
RUN npm run build

# 验证构建产物
RUN ls -la /app/dist && echo "✅ 构建产物验证成功"

# ===== 生产阶段 - 使用Debian版nginx =====
FROM nginx:1.22 as production-stage

# 设置维护者信息
LABEL maintainer="mall-admin-web"
LABEL description="Mall电商后台管理系统前端 - 使用Debian镜像"

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 从构建阶段复制构建产物
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 创建日志目录
RUN mkdir -p /var/log/nginx

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
