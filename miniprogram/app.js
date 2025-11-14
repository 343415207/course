// app.js
App({
  globalData: {
    userInfo: null,
    token: null,
    // 开发环境使用 localhost，生产环境需要配置实际域名
    // 注意：小程序真机调试时，localhost 无法访问，需要使用局域网IP或域名
    // 修改这里的地址为你的实际 API 地址
    apiBaseUrl: 'http://localhost:9000/api' // 开发环境
    // apiBaseUrl: 'https://your-domain.com/api' // 生产环境
  },

  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
  },

  /**
   * 检查登录状态
   */
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      // 验证token是否有效
      this.getUserInfo();
    }
  },

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    try {
      const res = await this.request({
        url: '/auth/user',
        method: 'GET'
      });
      if (res.data) {
        this.globalData.userInfo = res.data;
      }
    } catch (error) {
      // token无效，清除
      this.logout();
    }
  },

  /**
   * 登录（必须在用户点击事件中调用）
   */
  async login() {
    return new Promise((resolve, reject) => {
      // 先获取 code
      wx.login({
        success: async (loginRes) => {
          if (loginRes.code) {
            try {
              // 获取用户信息（必须在用户点击事件中调用）
              const profileRes = await new Promise((profileResolve, profileReject) => {
                wx.getUserProfile({
                  desc: '用于完善用户资料',
                  success: profileResolve,
                  fail: profileReject
                });
              });

              // 调用登录接口
              const res = await this.request({
                url: '/auth/login',
                method: 'POST',
                data: {
                  code: loginRes.code,
                  userInfo: {
                    nickName: profileRes.userInfo.nickName,
                    avatarUrl: profileRes.userInfo.avatarUrl
                  }
                }
              });
              
              if (res.data && res.data.token) {
                // 保存token和用户信息
                wx.setStorageSync('token', res.data.token);
                this.globalData.token = res.data.token;
                this.globalData.userInfo = res.data.user;
                resolve(res.data);
              } else {
                reject(new Error('登录失败'));
              }
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error('获取code失败'));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  /**
   * 退出登录
   */
  logout() {
    wx.removeStorageSync('token');
    this.globalData.token = null;
    this.globalData.userInfo = null;
  },

  /**
   * 统一请求方法
   */
  request(options) {
    return new Promise((resolve, reject) => {
      const { url, method = 'GET', data = {} } = options;
      
      // 显示加载提示
      if (options.showLoading !== false) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        });
      }

      wx.request({
        url: this.globalData.apiBaseUrl + url,
        method: method,
        data: data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': this.globalData.token ? `Bearer ${this.globalData.token}` : ''
        },
        success: (res) => {
          wx.hideLoading();
          
          // 200 表示成功，201 表示创建成功
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(res);
          } else if (res.statusCode === 401) {
            // token过期或无效，清除并跳转到登录
            this.logout();
            wx.showToast({
              title: '登录已过期',
              icon: 'none'
            });
            reject(new Error('登录已过期'));
          } else {
            wx.showToast({
              title: res.data?.error || '请求失败',
              icon: 'none'
            });
            reject(new Error(res.data?.error || '请求失败'));
          }
        },
        fail: (err) => {
          wx.hideLoading();
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
          reject(err);
        }
      });
    });
  }
});

