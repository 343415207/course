// pages/index/index.js
const api = require('../../utils/api');
const auth = require('../../utils/auth');
const util = require('../../utils/util');

Page({
  data: {
    banners: [],
    courses: [],
    loading: false,
    refreshing: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    // 每次显示时刷新数据
    if (auth.checkLogin()) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true });
    this.loadData().finally(() => {
      this.setData({ refreshing: false });
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载数据
   */
  async loadData() {
    try {
      this.setData({ loading: true });

      // 并行加载Banner和课程列表
      const [bannersRes, coursesRes] = await Promise.all([
        api.get('/banners').catch(() => ({ data: [] })), // Banner失败不影响页面
        auth.checkLogin() ? api.get('/courses').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
      ]);

      // 处理课程数据，确保时间格式正确
      const courses = (coursesRes.data || []).map(course => {
        // 限制课程名称长度
        const name = course.name || '';
        const displayName = name.length > 10 ? name.substring(0, 10) : name;
        
        // 处理时间，确保格式正确
        let lastRecordTime = null;
        let lastRecordTimeText = '';
        if (course.lastRecordTime) {
          // 如果是字符串，直接使用；如果是 Date 对象，转换为字符串
          lastRecordTime = typeof course.lastRecordTime === 'string' 
            ? course.lastRecordTime 
            : course.lastRecordTime.toISOString ? course.lastRecordTime.toISOString() : course.lastRecordTime;
          
          // 计算相对时间文本
          try {
            lastRecordTimeText = util.relativeTime(lastRecordTime);
            console.log(`计算时间 - 原始: ${lastRecordTime}, 结果: ${lastRecordTimeText}`);
          } catch (error) {
            console.error(`计算时间失败 - 课程: ${name}, 时间: ${lastRecordTime}`, error);
            lastRecordTimeText = '';
          }
        }
        
        const courseData = {
          id: course.id,
          name: displayName,
          originalName: name, // 保留原始名称
          lastRecordTime: lastRecordTime, // 保持原值，null 或字符串
          lastRecordTimeText: lastRecordTimeText, // 相对时间文本
          totalCount: course.totalCount || 0
        };
        
        console.log(`课程 ${courseData.name} - lastRecordTime:`, courseData.lastRecordTime, 'text:', courseData.lastRecordTimeText, 'totalCount:', courseData.totalCount);
        
        return courseData;
      });

      console.log('课程数据:', courses);
      // 打印有时间的课程
      const coursesWithTime = courses.filter(c => c.lastRecordTime);
      const coursesWithTimeText = courses.filter(c => c.lastRecordTimeText);
      console.log('有时间的课程:', coursesWithTime);
      console.log('有时间文本的课程:', coursesWithTimeText);
      console.log('时间文本详情:', coursesWithTimeText.map(c => ({ name: c.name, text: c.lastRecordTimeText })));
      this.setData({
        banners: bannersRes.data || [],
        courses: courses
      });
    } catch (error) {
      console.error('加载数据失败:', error);
      // 如果未登录，不自动登录（需要用户点击登录按钮）
      // 只显示提示信息
      if (!auth.checkLogin()) {
        console.log('未登录，请点击"我的"页面进行登录');
      }
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * Banner点击事件
   */
  onBannerTap(e) {
    const { index } = e.detail;
    const banner = this.data.banners[index];
    if (banner && banner.link) {
      // 可以跳转到链接页面
      console.log('Banner链接:', banner.link);
    }
  },

  /**
   * Banner图片加载错误
   */
  onBannerImageError(e) {
    const { index } = e.currentTarget.dataset;
    console.error(`Banner ${index} 图片加载失败:`, e.detail);
    
    // 使用默认占位图
    const banners = this.data.banners;
    if (banners[index]) {
      banners[index].imageUrl = 'https://via.placeholder.com/750x300/f5f5f5/999999?text=图片加载失败';
      this.setData({ banners });
    }
  },

  /**
   * 课程卡片点击
   */
  onCourseTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/course-detail/course-detail?id=${id}`
    });
  },

  /**
   * 添加课程
   */
  onAddCourse() {
    wx.navigateTo({
      url: '/pages/add-course/add-course'
    });
  },

  /**
   * 格式化时间
   */
  formatTime(time) {
    return util.formatTime(time, 'MM-DD HH:mm');
  },

  /**
   * 相对时间
   */
  relativeTime(time) {
    return util.relativeTime(time);
  }
});

