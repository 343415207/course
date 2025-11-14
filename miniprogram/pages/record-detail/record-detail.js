// pages/record-detail/record-detail.js
const api = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    recordId: null,
    record: null,
    note: '',
    images: [], // 存储图片对象数组 {id, imageUrl}
    editingNote: false
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ recordId: id });
      this.loadRecord();
    }
  },

  /**
   * 加载记录详情
   */
  async loadRecord() {
    try {
      wx.showLoading({ title: '加载中...' });

      const res = await api.get(`/records/${this.data.recordId}`);
      
      // 处理图片数据，确保包含id和imageUrl
      const images = (res.data.images || []).map((img, index) => {
        if (typeof img === 'string') {
          // 如果是字符串URL，需要从record中查找对应的id
          const imageObj = res.data.record?.images?.find(i => i.imageUrl === img);
          return {
            id: imageObj?.id || index,
            imageUrl: img
          };
        }
        return img;
      });

      this.setData({
        record: res.data,
        note: res.data.note || '',
        images: images
      });
    } catch (error) {
      console.error('加载记录失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 编辑备注
   */
  onEditNote() {
    this.setData({ editingNote: true });
  },

  /**
   * 备注输入
   */
  onNoteInput(e) {
    this.setData({ note: e.detail.value });
  },

  /**
   * 保存备注
   */
  async onSaveNote() {
    try {
      wx.showLoading({ title: '保存中...' });

      await api.put(`/records/${this.data.recordId}`, {
        note: this.data.note
      });

      this.setData({ editingNote: false });
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });

      // 重新加载记录
      this.loadRecord();
    } catch (error) {
      console.error('保存备注失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 取消编辑
   */
  onCancelEdit() {
    // 恢复原始备注
    this.setData({
      editingNote: false,
      note: this.data.record?.note || ''
    });
  },

  /**
   * 选择图片
   */
  onChooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.uploadImages(res.tempFilePaths);
      }
    });
  },

  /**
   * 上传图片
   */
  async uploadImages(filePaths) {
    try {
      wx.showLoading({ title: '上传中...' });

      for (const filePath of filePaths) {
        const res = await api.uploadFile(`/records/${this.data.recordId}/images`, filePath);
        if (res.imageUrl) {
          this.data.images.push({
            id: res.id,
            imageUrl: res.imageUrl
          });
        }
      }

      this.setData({ images: this.data.images });
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      });

      // 重新加载记录
      this.loadRecord();
    } catch (error) {
      console.error('上传图片失败:', error);
      wx.showToast({
        title: '上传失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 预览图片
   */
  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset;
    const urls = this.data.images.map(img => img.imageUrl || img);
    wx.previewImage({
      urls: urls,
      current: url
    });
  },

  /**
   * 删除图片
   */
  async onDeleteImage(e) {
    const { imageid, imageurl } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '删除中...' });

            await api.del(`/records/${this.data.recordId}/images/${imageid}`);

            // 从列表中移除
            const images = this.data.images.filter(img => {
              const imgUrl = img.imageUrl || img;
              return imgUrl !== imageurl;
            });
            this.setData({ images });

            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } catch (error) {
            console.error('删除图片失败:', error);
            wx.showToast({
              title: '删除失败',
              icon: 'none'
            });
          } finally {
            wx.hideLoading();
          }
        }
      }
    });
  },

  /**
   * 格式化时间
   */
  formatTime(time) {
    return util.formatTime(time, 'YYYY-MM-DD HH:mm:ss');
  }
});

