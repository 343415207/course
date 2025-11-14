# 课程记录管理小程序

## 项目简介

一个基于微信小程序的课程记录管理系统，支持用户登录、课程管理和学习记录追踪。

## 技术栈

- **前端**: 微信小程序原生框架
- **后端**: Node.js + Express + MySQL + Sequelize
- **容器化**: Docker + Docker Compose
- **存储**: 腾讯云COS

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd course
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填写：
- 数据库配置
- 微信小程序配置（AppID、Secret）
- JWT密钥
- 腾讯云COS配置

### 3. 启动服务

使用 Docker Compose 启动所有服务：

```bash
docker-compose up -d
```

服务包括：
- **MySQL**: 端口 `9306`
- **phpMyAdmin**: `http://localhost:9080`
- **API服务**: `http://localhost:9000`

### 4. 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看API服务日志
docker-compose logs -f api
```

### 5. 停止服务

```bash
docker-compose down
```

## 项目结构

```
course/
├── docs/              # 项目文档
├── server/            # 后端代码
├── miniprogram/       # 前端小程序代码（待开发）
├── docker-compose.yml  # Docker Compose配置
└── .env               # 环境变量配置
```

## 开发文档

详细文档请查看 `docs/` 目录：

- [文档索引](./docs/README.md)
- [项目概述](./docs/overview.md)
- [后端开发文档](./docs/backend/README.md)
- [前端开发文档](./docs/frontend/README.md)
- [API接口文档](./docs/api/README.md)
- [数据库设计](./docs/database/README.md)
- [配置文件管理](./docs/config/README.md)
- [Docker配置管理](./docs/docker/README.md)

## API 接口

Base URL: `http://localhost:9000/api`

详细接口文档请参考 [API 接口文档](./docs/api/README.md)

## 数据库管理

访问 phpMyAdmin: `http://localhost:9080`

- 服务器: `mysql`
- 用户名: `root`
- 密码: `.env` 文件中的 `DB_PASSWORD`

## 开发进度

### ✅ 已完成

- [x] 后端项目初始化
- [x] 数据库设计和模型
- [x] 认证模块（微信登录、JWT）
- [x] 业务接口（课程、记录、Banner）
- [x] 图片上传功能（腾讯云COS）
- [x] Docker 配置
- [x] 前端小程序项目初始化
- [x] 前端页面实现（首页、课程详情、记录详情、我的）
- [x] API请求封装和认证管理

### 🚧 进行中

- [ ] 前后端联调测试
- [ ] 功能优化

### 📋 待完成

- [ ] 添加 TabBar 图标
- [ ] 完善错误处理
- [ ] 性能优化
- [ ] 用户体验优化

## 常用命令

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f api

# 进入API容器
docker-compose exec api sh

# 重启服务
docker-compose restart api
```

## 许可证

ISC

