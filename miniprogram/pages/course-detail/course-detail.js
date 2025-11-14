// pages/course-detail/course-detail.js
const api = require('../../utils/api');
const auth = require('../../utils/auth');
const util = require('../../utils/util');

Page({
  data: {
    courseId: null,
    courseName: '',
    records: [],
    loading: false
  },

  onLoad(options) {
    const { id, name } = options;
    if (id) {
      this.setData({ 
        courseId: id,
        courseName: name || '课程详情'
      });
      // 设置导航栏标题
      if (name) {
        wx.setNavigationBarTitle({ title: name });
      }
      this.loadRecords();
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  onShow() {
    // 每次显示时刷新记录列表
    if (this.data.courseId) {
      this.loadRecords();
    }
  },

  onPullDownRefresh() {
    this.loadRecords().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载记录列表
   */
  async loadRecords() {
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

      const res = await api.get(`/records/courses/${this.data.courseId}/records`);
      
      // 确保返回的数据格式正确
      const records = (res.data || []).map(record => ({
        id: record.id,
        courseId: record.courseId,
        note: record.note || '',
        createdAt: record.createdAt || record.created_at
      }));
      
      this.setData({
        records: records
      });
    } catch (error) {
      console.error('加载记录失败:', error);
      let errorMsg = '加载失败';
      
      if (error.errMsg) {
        if (error.errMsg.includes('401') || error.errMsg.includes('未授权') || error.errMsg.includes('登录')) {
          errorMsg = '请先登录';
          // 清除token，跳转到登录页
          auth.logout();
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          }, 1500);
        } else if (error.errMsg.includes('404') || error.errMsg.includes('不存在')) {
          errorMsg = '课程不存在或无权访问';
        } else if (error.errMsg.includes('403') || error.errMsg.includes('权限')) {
          errorMsg = '权限不足';
        } else if (error.errMsg.includes('网络') || error.errMsg.includes('request:fail')) {
          errorMsg = '网络错误，请检查网络连接';
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
      
      // 如果是课程不存在，返回上一页
      if (errorMsg.includes('不存在')) {
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 删除记录
   */
  async onDeleteRecord(e) {
    console.log('删除记录事件触发:', e);
    
    const { id } = e.currentTarget.dataset;
    console.log('要删除的记录ID:', id);
    
    if (!id) {
      wx.showToast({
        title: '记录ID不存在',
        icon: 'none'
      });
      return;
    }
    
    // 确认删除
    const res = await wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmText: '删除',
      confirmColor: '#ff3b30'
    });

    if (!res.confirm) {
      return;
    }

    try {
      wx.showLoading({ title: '删除中...' });
      
      console.log('发送删除请求:', `/records/${id}`);
      const result = await api.del(`/records/${id}`);
      console.log('删除请求结果:', result);

      wx.hideLoading();
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });

      // 刷新列表
      setTimeout(() => {
        this.loadRecords();
      }, 500);
    } catch (error) {
      console.error('删除记录失败:', error);
      wx.hideLoading();
      
      let errorMsg = '删除失败';
      
      if (error.errMsg) {
        console.log('错误信息:', error.errMsg);
        if (error.errMsg.includes('401') || error.errMsg.includes('未授权')) {
          errorMsg = '请先登录';
          auth.logout();
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          }, 1500);
        } else if (error.errMsg.includes('404') || error.errMsg.includes('不存在')) {
          errorMsg = '记录不存在';
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
    }
  },

  /**
   * 新增记录
   */
  async onAddRecord() {
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
      wx.showLoading({ title: '创建中...' });
      
      await api.post(`/records/courses/${this.data.courseId}/records`);

      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });

      // 刷新列表
      this.loadRecords();
    } catch (error) {
      console.error('创建记录失败:', error);
      let errorMsg = '创建失败';
      
      if (error.errMsg) {
        if (error.errMsg.includes('401') || error.errMsg.includes('未授权')) {
          errorMsg = '请先登录';
          // 清除token，跳转到登录页
          auth.logout();
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          }, 1500);
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
      wx.hideLoading();
    }
  },

  /**
   * 格式化时间
   */
  formatTime(time) {
    return util.formatTime(time, 'YYYY-MM-DD HH:mm');
  },

  /**
   * 相对时间
   */
  relativeTime(time) {
    return util.relativeTime(time);
  }
});

