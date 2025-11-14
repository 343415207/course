# Docker 配置管理文档

## 概述

使用 Docker Compose 统一管理所有后端服务（Node.js、MySQL、phpMyAdmin）。

## 文件结构

```
course/
├── docker-compose.yml      # Docker Compose配置文件
├── .env                    # 环境变量文件
└── server/
    ├── Dockerfile          # Node.js 服务 Dockerfile
    └── .dockerignore       # Docker 忽略文件
```

## docker-compose.yml 配置

```yaml
version: '3.8'

services:
  # MySQL 数据库服务
  mysql:
    image: mysql:8.0
    container_name: course_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    ports:
      - "9306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - course_network

  # phpMyAdmin 数据库管理工具
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: course_phpmyadmin
    restart: always
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
    ports:
      - "9080:80"
    depends_on:
      - mysql
    networks:
      - course_network

  # Node.js 后端服务
  api:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: course_api
    restart: always
    ports:
      - "9000:3000"
    environment:
      - NODE_ENV=${NODE_ENV}
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=${DB_NAME}
      - DB_USER=root
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=${JWT_EXPIRES_IN}
      - WX_APPID=${WX_APPID}
      - WX_SECRET=${WX_SECRET}
      - COS_SECRET_ID=${COS_SECRET_ID}
      - COS_SECRET_KEY=${COS_SECRET_KEY}
      - COS_REGION=${COS_REGION}
      - COS_BUCKET_NAME=${COS_BUCKET_NAME}
      - COS_BUCKET_URL=${COS_BUCKET_URL}
      - COS_BASE_PATH=${COS_BASE_PATH}
    volumes:
      - ./server:/app
      - /app/node_modules
    depends_on:
      - mysql
    networks:
      - course_network

volumes:
  mysql_data:

networks:
  course_network:
    driver: bridge
```

## 服务说明

### MySQL 服务

- **容器名**: `course_mysql`
- **端口**: `9306`（主机端口，容器内部仍为3306）
- **数据持久化**: `mysql_data` volume
- **初始化脚本**: `./init.sql`（可选）

### phpMyAdmin 服务

- **容器名**: `course_phpmyadmin`
- **端口**: `9080`（主机端口，容器内部仍为80）
- **访问地址**: `http://localhost:9080`
- **登录信息**:
  - 服务器：`mysql`（容器服务名）
  - 用户名：`root`
  - 密码：从 `.env` 文件中的 `DB_PASSWORD` 获取

### Node.js API 服务

- **容器名**: `course_api`
- **端口**: `9000`（主机端口，容器内部仍为3000）
- **访问地址**: `http://localhost:9000`
- **代码热更新**: 通过 volume 挂载实现

## 常用命令

### 启动服务

```bash
# 启动所有服务（后台运行）
docker-compose up -d

# 启动所有服务（前台运行，查看日志）
docker-compose up
```

### 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止服务并删除 volumes（注意：会删除数据库数据）
docker-compose down -v
```

### 查看服务状态

```bash
# 查看运行中的服务
docker-compose ps

# 查看所有服务（包括停止的）
docker-compose ps -a
```

### 查看日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs api
docker-compose logs mysql

# 实时跟踪日志
docker-compose logs -f api
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart api
```

### 进入容器

```bash
# 进入 API 容器
docker-compose exec api sh

# 进入 MySQL 容器
docker-compose exec mysql bash
```

### 构建镜像

```bash
# 重新构建 API 服务镜像
docker-compose build api

# 重新构建所有服务镜像
docker-compose build
```

## Dockerfile 示例

`server/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

## .dockerignore 示例

`server/.dockerignore`:

```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
```

## 数据持久化

### MySQL 数据

MySQL 数据存储在 `mysql_data` volume 中，即使容器删除，数据也会保留。

### 备份数据

```bash
# 备份数据库
docker-compose exec mysql mysqldump -u root -p${DB_PASSWORD} ${DB_NAME} > backup.sql
```

### 恢复数据

```bash
# 恢复数据库
docker-compose exec -T mysql mysql -u root -p${DB_PASSWORD} ${DB_NAME} < backup.sql
```

## 网络配置

所有服务在 `course_network` 网络中，可以通过服务名互相访问：

- API 服务访问 MySQL：`mysql:3306`
- phpMyAdmin 访问 MySQL：`mysql:3306`

## 环境变量

Docker Compose 会自动读取项目根目录下的 `.env` 文件，并在容器中设置环境变量。

详细配置请参考 [配置文件管理文档](../config/README.md)

## 开发建议

1. **代码热更新**: 通过 volume 挂载实现，修改代码后自动生效
2. **数据库管理**: 使用 phpMyAdmin 进行可视化管理
3. **日志查看**: 使用 `docker-compose logs -f` 实时查看日志
4. **数据备份**: 定期备份数据库数据

## 故障排查

### 服务无法启动

1. 检查端口是否被占用
2. 查看服务日志：`docker-compose logs [service_name]`
3. 检查环境变量配置是否正确

### 数据库连接失败

1. 确认 MySQL 服务已启动：`docker-compose ps`
2. 检查数据库配置（`.env` 文件）
3. 确认网络配置正确

### 权限问题

1. 检查文件权限
2. 确认 Docker 用户权限

