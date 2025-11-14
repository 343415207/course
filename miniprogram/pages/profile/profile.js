// pages/profile/profile.js
const auth = require('../../utils/auth');

Page({
  data: {
    userInfo: null,
    isLoggedIn: false
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    // 每次显示时刷新用户信息
    this.loadUserInfo();
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const userInfo = auth.getUserInfo();
    this.setData({
      userInfo: userInfo,
      isLoggedIn: auth.checkLogin()
    });
  },

  /**
   * 登录（用户点击事件）
   */
  async onLogin() {
    try {
      wx.showLoading({ title: '登录中...' });
      
      // 先获取 code
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        });
      });

      if (!loginRes.code) {
        throw new Error('获取code失败');
      }

      // 尝试获取用户信息（可选，如果用户拒绝也可以继续登录）
      let userInfo = null;
      try {
        const profileRes = await new Promise((resolve, reject) => {
          wx.getUserProfile({
            desc: '用于完善用户资料',
            success: resolve,
            fail: reject
          });
        });
        userInfo = {
          nickName: profileRes.userInfo.nickName,
          avatarUrl: profileRes.userInfo.avatarUrl
        };
      } catch (profileError) {
        console.log('用户信息获取失败，继续使用 code 登录:', profileError);
        // 用户拒绝授权或获取失败，仍然可以登录（只使用 code）
        // userInfo 保持为 null，后端会使用已有信息或默认值
      }

      // 调用登录接口
      const app = getApp();
      const res = await app.request({
        url: '/auth/login',
        method: 'POST',
        data: {
          code: loginRes.code,
          userInfo: userInfo
        }
      });

      if (res.data && res.data.token) {
        // 保存token和用户信息
        wx.setStorageSync('token', res.data.token);
        app.globalData.token = res.data.token;
        app.globalData.userInfo = res.data.user;
        
        this.loadUserInfo();
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      } else {
        throw new Error('登录失败');
      }
    } catch (error) {
      console.error('登录失败:', error);
      let errorMsg = '登录失败';
      
      if (error.errMsg) {
        if (error.errMsg.includes('getUserProfile')) {
          errorMsg = '登录成功，但未获取到用户信息（可稍后在设置中完善）';
        } else if (error.errMsg.includes('request:fail')) {
          errorMsg = '网络错误，请检查网络连接';
        } else {
          errorMsg = error.errMsg;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      // 如果是网络错误或后端错误，显示错误提示
      if (!error.errMsg || !error.errMsg.includes('getUserProfile')) {
        wx.showToast({
          title: errorMsg,
          icon: 'none',
          duration: 2000
        });
      }
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 退出登录
   */
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.logout();
          this.setData({
            userInfo: null,
            isLoggedIn: false
          });
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }
});

