require('dotenv').config();

module.exports = {
  // 服务器配置
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'course_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // 微信小程序配置
  wechat: {
    appId: process.env.WX_APPID || '',
    secret: process.env.WX_SECRET || ''
  },

  // 腾讯云COS配置
  cos: {
    secretId: process.env.COS_SECRET_ID || '',
    secretKey: process.env.COS_SECRET_KEY || '',
    region: process.env.COS_REGION || 'ap-beijing',
    bucketName: process.env.COS_BUCKET_NAME || '',
    bucketUrl: process.env.COS_BUCKET_URL || '',
    basePath: process.env.COS_BASE_PATH || ''
  }
};

