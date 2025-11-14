# 项目概述

## 项目简介

开发一个课程记录管理小程序，支持用户登录、课程管理和学习记录追踪。

## 技术栈

- **前端框架**: 微信小程序原生框架
- **后端**: Node.js + Express
- **数据库**: MySQL + Sequelize ORM
- **数据库管理**: phpMyAdmin
- **容器化**: Docker + Docker Compose
- **存储**: 腾讯云COS（用于图片上传）
- **认证**: JWT 身份认证
- **HTTP客户端**: Axios

## 功能模块

### 1. 用户认证模块
- 微信授权登录
- 用户角色管理（管理员/普通用户）

### 2. 首页模块
- Banner轮播图
- 课程列表（卡片式双列布局）
- 底部导航（首页、我的）

### 3. 课程详情模块
- 记录列表展示（按创建时间倒序）
- 新增记录功能

### 4. 记录详情模块
- 记录信息展示
- 备注编辑功能
- 图片上传功能

### 5. 我的页面模块
- 用户信息展示
- 退出登录
- 管理员功能入口

## 项目结构

```
course/
├── docs/                    # 项目文档
│   ├── README.md           # 文档索引
│   ├── overview.md         # 项目概述（本文件）
│   ├── frontend/           # 前端文档
│   ├── backend/            # 后端文档
│   ├── database/           # 数据库文档
│   ├── api/                # API文档
│   ├── config/             # 配置管理文档
│   └── docker/             # Docker文档
├── server/                 # 后端代码
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── models/             # 数据模型
│   ├── routes/             # 路由
│   ├── middleware/         # 中间件
│   ├── utils/              # 工具函数
│   └── Dockerfile          # Docker镜像构建文件
├── miniprogram/            # 前端小程序代码
│   ├── pages/              # 页面
│   └── utils/              # 工具函数
├── docker-compose.yml      # Docker Compose配置
├── .env                    # 环境变量文件
└── .cursorrules            # Cursor AI 规则文件
```

## 开发步骤概览

### 后端开发
1. 项目初始化和环境搭建（包含 Docker Compose 配置）
2. 数据库设计和创建
3. 认证模块开发
4. 业务接口开发
5. 图片上传功能（COS集成）
6. 测试和优化

### 前端开发
1. 项目初始化和配置
2. 用户认证
3. 首页开发
4. 课程详情页
5. 记录详情页
6. 我的页面
7. 联调和优化

详细开发步骤请参考：
- [后端开发文档](./backend/README.md)
- [前端开发文档](./frontend/README.md)

## 开发时间估算

- **后端开发**: 约8天
- **前端开发**: 约7天
- **前后端联调**: 1天
- **整体测试和优化**: 1天

**项目总计：约17天（约3-4周）**

## 相关文档

- [数据库设计](./database/README.md)
- [API 接口文档](./api/README.md)
- [配置文件管理](./config/README.md)
- [Docker 配置管理](./docker/README.md)

