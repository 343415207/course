# 后端服务

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp ../.env.example .env
```

### 3. 启动服务

#### 使用 Docker Compose（推荐）

在项目根目录执行：

```bash
docker-compose up -d
```

#### 本地开发

```bash
npm run dev
```

服务将在 `http://localhost:9000` 启动（Docker环境）或 `http://localhost:3000`（本地开发）

## 项目结构

```
server/
├── config/          # 配置文件
├── controllers/     # 控制器
├── models/          # 数据模型
├── routes/          # 路由
├── middleware/      # 中间件
├── utils/           # 工具函数
└── app.js           # 应用入口
```

## API 接口

详细接口文档请参考 `docs/api/README.md`

## 开发

### 本地开发模式

```bash
npm run dev
```

使用 nodemon 自动重启服务。

### 数据库同步

开发环境下，应用启动时会自动同步数据库模型。

生产环境请使用 Sequelize 迁移工具。

## 测试

健康检查接口：

```bash
curl http://localhost:9000/health
```

## 注意事项

1. 确保 MySQL 服务已启动
2. 确保 `.env` 文件配置正确
3. 开发环境会自动同步数据库模型
4. 生产环境请使用数据库迁移工具

