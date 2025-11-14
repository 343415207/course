// pages/add-course/add-course.js
const api = require('../../utils/api');
const auth = require('../../utils/auth');

Page({
  data: {
    courseName: '',
    loading: false
  },

  onLoad() {
    // 检查登录状态
    if (!auth.checkLogin()) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: () => {
          wx.switchTab({
            url: '/pages/profile/profile'
          });
        }
      });
    }
  },

  /**
   * 输入课程名称
   */
  onInput(e) {
    this.setData({
      courseName: e.detail.value.trim()
    });
  },

  /**
   * 提交创建课程
   */
  async onSubmit() {
    const { courseName } = this.data;

    // 验证输入
    if (!courseName) {
      wx.showToast({
        title: '请输入课程名称',
        icon: 'none'
      });
      return;
    }

    if (courseName.length > 10) {
      wx.showToast({
        title: '课程名称不能超过10个字符',
        icon: 'none'
      });
      return;
    }

    // 检查登录状态
    if (!auth.checkLogin()) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success: () => {
          wx.switchTab({
            url: '/pages/profile/profile'
          });
        }
      });
      return;
    }

    try {
      this.setData({ loading: true });
      wx.showLoading({ title: '创建中...' });

      const res = await api.post('/courses', {
        name: courseName
      });

      if (res.data && res.data.id) {
        wx.showToast({
          title: '创建成功',
          icon: 'success'
        });
        
        // 延迟返回，让用户看到成功提示
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        throw new Error('创建失败');
      }
    } catch (error) {
      console.error('创建课程失败:', error);
      let errorMsg = '创建失败';
      
      if (error.errMsg) {
        if (error.errMsg.includes('401') || error.errMsg.includes('未授权')) {
          errorMsg = '请先登录';
        } else if (error.errMsg.includes('403') || error.errMsg.includes('权限')) {
          errorMsg = '权限不足';
        } else {
          errorMsg = error.errMsg;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      wx.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      });
    } finally {
      this.setData({ loading: false });
      wx.hideLoading();
    }
  }
});

