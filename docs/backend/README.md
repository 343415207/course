# 后端开发文档

## 项目结构

```
server/
├── config/                 # 配置文件
│   ├── database.js         # 数据库配置
│   └── config.js           # 应用配置
├── controllers/            # 控制器
│   ├── authController.js   # 认证控制器
│   ├── courseController.js # 课程控制器
│   ├── recordController.js # 记录控制器
│   └── bannerController.js # Banner控制器
├── models/                 # 数据模型
│   ├── User.js
│   ├── Course.js
│   ├── Record.js
│   └── Banner.js
├── routes/                 # 路由
│   ├── auth.js
│   ├── courses.js
│   ├── records.js
│   └── banners.js
├── middleware/             # 中间件
│   ├── auth.js             # 认证中间件
│   └── errorHandler.js     # 错误处理
├── utils/                  # 工具函数
│   ├── jwt.js              # JWT工具
│   └── upload.js           # 文件上传（COS）
├── uploads/                # 上传文件目录
├── Dockerfile              # Docker镜像构建文件
├── .dockerignore           # Docker忽略文件
├── app.js                  # 应用入口
└── package.json
```

## 技术栈

- **框架**: Express.js
- **数据库**: MySQL 8.0+ + Sequelize ORM
- **认证**: jsonwebtoken (JWT 身份认证)
- **文件上传**: multer + 腾讯云COS SDK (cos-nodejs-sdk-v5)
- **HTTP客户端**: Axios（用于调用微信API）
- **环境变量**: dotenv

## 开发步骤

### 第一阶段：项目初始化
1. 创建 Node.js 项目
2. 安装依赖（Express, MySQL, JWT等）
3. 配置 Docker 和 Docker Compose
   - 创建 Dockerfile
   - 创建 docker-compose.yml
   - 配置环境变量文件
4. 配置数据库连接
5. 创建数据库表结构
6. 配置路由和中间件
7. 实现错误处理和日志

### 第二阶段：认证模块
1. 实现微信登录接口（调用微信API获取openid）
2. 实现JWT Token生成和验证
3. 实现用户信息创建/更新
4. 实现认证中间件

### 第三阶段：业务接口
1. 实现课程相关接口
2. 实现记录相关接口（包含统计查询）
3. 实现Banner相关接口
4. 实现图片上传接口（COS）
5. 实现权限验证（用户只能操作自己的数据）

### 第四阶段：优化和测试
1. 性能优化（数据库索引、查询优化）
2. 错误处理和异常捕获
3. 接口测试
4. 安全性检查

## API 接口

详细接口文档请参考 [API 接口文档](../api/README.md)

## 数据库

数据库设计请参考 [数据库设计文档](../database/README.md)

## 配置

环境配置请参考 [配置文件管理文档](../config/README.md)

## Docker

Docker 配置请参考 [Docker 配置管理文档](../docker/README.md)

## 注意事项

1. **权限控制**
   - 用户只能查看和操作自己的课程和记录
   - 管理员可以管理所有内容
   - 所有接口需要JWT Token验证
   - 敏感操作需要角色验证

2. **数据安全**
   - 使用HTTPS协议
   - JWT Token设置过期时间
   - SQL注入防护（使用ORM或参数化查询）
   - 文件上传类型和大小限制
   - 用户输入验证和过滤

3. **性能优化**
   - 数据库索引优化
   - 图片压缩上传
   - 列表分页加载
   - 接口响应缓存（如Banner）
   - 数据库连接池

