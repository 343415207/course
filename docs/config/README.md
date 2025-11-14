# 配置文件管理文档

## 配置文件说明

项目使用环境变量文件 `.env` 管理所有配置，通过 `dotenv` 加载。

## 环境变量配置

### .env 文件位置

项目根目录下的 `.env` 文件。

### 配置项说明

```env
# ============================================
# 数据库配置
# ============================================
# Docker Compose 环境中使用 mysql 作为主机名
DB_HOST=mysql
DB_PORT=3306
DB_NAME=course_db
DB_USER=root
DB_PASSWORD=your_password

# ============================================
# JWT配置
# ============================================
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# ============================================
# 微信小程序配置
# ============================================
WX_APPID=your_wechat_appid
WX_SECRET=your_wechat_secret

# ============================================
# 服务器配置
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# 腾讯云COS配置（测试环境）
# ============================================
COS_SECRET_ID=your_cos_secret_id
COS_SECRET_KEY=your_cos_secret_key
COS_REGION=ap-beijing
COS_BUCKET_NAME=mengu-1251481375
COS_BUCKET_URL=https://mengu-1251481375.cos.ap-beijing.myqcloud.com
COS_BASE_PATH=mengu-1251481375
```

## 配置说明

### 数据库配置

- **DB_HOST**: 数据库主机地址
  - Docker Compose 环境：`mysql`（容器服务名）
  - 本地开发：`localhost`
- **DB_PORT**: 数据库端口，容器内部为 `3306`，主机映射端口为 `9306`
- **DB_NAME**: 数据库名称
- **DB_USER**: 数据库用户名
- **DB_PASSWORD**: 数据库密码

### JWT配置

- **JWT_SECRET**: JWT 密钥，用于签名和验证 Token
- **JWT_EXPIRES_IN**: Token 过期时间，如 `7d`（7天）、`24h`（24小时）

### 微信小程序配置

- **WX_APPID**: 微信小程序 AppID
- **WX_SECRET**: 微信小程序 AppSecret

### 服务器配置

- **PORT**: 后端服务端口，容器内部为 `3000`，主机映射端口为 `9000`
- **NODE_ENV**: 运行环境
  - `development`: 开发环境
  - `production`: 生产环境

### 腾讯云COS配置

- **COS_SECRET_ID**: 腾讯云 SecretId
- **COS_SECRET_KEY**: 腾讯云 SecretKey
- **COS_REGION**: COS 地域，如 `ap-beijing`
- **COS_BUCKET_NAME**: COS 存储桶名称
- **COS_BUCKET_URL**: COS 存储桶访问地址
- **COS_BASE_PATH**: COS 基础路径

## 配置文件管理

### 开发环境

使用 `.env` 文件，**不要提交到版本控制系统**。

### 生产环境

1. 使用环境变量（推荐）
2. 或使用 `.env.production` 文件（不提交到版本控制）

### .gitignore

确保 `.env` 文件已添加到 `.gitignore`：

```
.env
.env.local
.env.production
```

## 配置加载

后端代码中使用 `dotenv` 加载配置：

```javascript
require('dotenv').config();

const config = {
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  // ...
};
```

## Docker Compose 配置

Docker Compose 会自动读取 `.env` 文件中的环境变量，并在容器中设置。

详细说明请参考 [Docker 配置管理文档](../docker/README.md)

## 安全注意事项

1. **不要提交敏感信息到版本控制**
   - `.env` 文件应添加到 `.gitignore`
   - 敏感信息（密码、密钥）不要硬编码

2. **生产环境配置**
   - 使用环境变量或密钥管理服务
   - 定期轮换密钥和密码

3. **配置验证**
   - 启动时验证必需配置项是否存在
   - 提供清晰的错误提示

