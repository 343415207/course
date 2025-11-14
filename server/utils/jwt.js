const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * 生成 JWT Token
 * @param {Object} payload - 载荷数据
 * @returns {String} Token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

/**
 * 验证 JWT Token
 * @param {String} token - Token字符串
 * @returns {Object} 解码后的数据
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

module.exports = {
  generateToken,
  verifyToken
};

