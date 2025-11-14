/**
 * API请求封装
 */
const app = getApp();

/**
 * 请求方法
 */
const request = (options) => {
  return app.request(options);
};

/**
 * GET请求
 */
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
};

/**
 * POST请求
 */
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
};

/**
 * PUT请求
 */
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

/**
 * DELETE请求
 */
const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
};

/**
 * 上传文件
 */
const uploadFile = (url, filePath, formData = {}) => {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token;
    
    wx.uploadFile({
      url: app.globalData.apiBaseUrl + url,
      filePath: filePath,
      name: 'file',
      formData: formData,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(data);
          } else {
            wx.showToast({
              title: data.error || '上传失败',
              icon: 'none'
            });
            reject(new Error(data.error || '上传失败'));
          }
        } catch (error) {
          reject(error);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

module.exports = {
  request,
  get,
  post,
  put,
  del,
  uploadFile
};

