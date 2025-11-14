const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

/**
 * JWT 认证中间件
 */
const authenticate = async (req, res, next) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: '未提供认证令牌',
        code: 'UNAUTHORIZED'
      });
    }

    const token = authHeader.substring(7); // 移除 'Bearer ' 前缀

    // 验证 token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // 查找用户
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: '用户不存在',
        code: 'USER_NOT_FOUND'
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: '无效的认证令牌',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: '认证令牌已过期',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(500).json({
      error: '认证失败',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * 管理员权限检查中间件
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: '未认证',
      code: 'UNAUTHORIZED'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: '需要管理员权限',
      code: 'FORBIDDEN'
    });
  }

  next();
};

module.exports = {
  authenticate,
  requireAdmin
};

