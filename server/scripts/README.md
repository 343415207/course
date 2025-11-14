# 数据库初始化脚本

## init-data.js

创建测试数据的脚本，用于开发和测试。

### 使用方法

```bash
# 在 server 目录下运行
cd server
node scripts/init-data.js
```

或者在 Docker 容器中运行：

```bash
docker-compose exec api node scripts/init-data.js
```

### 创建的数据

1. **测试用户**
   - 管理员用户（openid: `test_admin_openid`）
   - 普通用户（openid: `test_user_openid`）

2. **Banner 数据**
   - 3 条测试 Banner

3. **课程数据**
   - 为普通用户创建 3 门课程
   - 为第一门课程创建 3 条学习记录

### 注意事项

- 这些是测试数据，实际使用时需要通过微信登录获取真实的 openid
- 如果数据已存在，脚本会跳过创建，避免重复
- 运行前确保数据库连接正常

