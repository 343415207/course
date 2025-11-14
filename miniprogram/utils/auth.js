/**
 * 认证相关工具函数
 */
const app = getApp();

/**
 * 检查登录状态
 */
const checkLogin = () => {
  return !!app.globalData.token;
};

/**
 * 登录
 */
const login = async () => {
  try {
    const result = await app.login();
    return result;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 退出登录
 */
const logout = () => {
  app.logout();
};

/**
 * 获取用户信息
 */
const getUserInfo = () => {
  return app.globalData.userInfo;
};

/**
 * 需要登录的操作
 */
const requireLogin = async (callback) => {
  if (!checkLogin()) {
    try {
      await login();
      if (callback) {
        return await callback();
      }
    } catch (error) {
      wx.showModal({
        title: '提示',
        content: '需要登录后才能使用此功能',
        showCancel: false
      });
      throw error;
    }
  } else {
    if (callback) {
      return await callback();
    }
  }
};

module.exports = {
  checkLogin,
  login,
  logout,
  getUserInfo,
  requireLogin
};

