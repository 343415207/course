const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { testConnection, sequelize } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// 导入路由
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const recordRoutes = require('./routes/records');
const bannerRoutes = require('./routes/banners');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/banners', bannerRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    error: '接口不存在',
    code: 'NOT_FOUND'
  });
});

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();

    // 同步数据库模型（开发环境）
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('数据库模型同步完成');
    }

    // 启动服务器
    app.listen(config.port, () => {
      console.log(`服务器运行在端口 ${config.port}`);
      console.log(`环境: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
};

startServer();

// 优雅关闭
process.on('SIGTERM', async () => {
  console.log('收到SIGTERM信号，正在关闭服务器...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('收到SIGINT信号，正在关闭服务器...');
  await sequelize.close();
  process.exit(0);
});

module.exports = app;

