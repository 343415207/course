const COS = require('cos-nodejs-sdk-v5');
const config = require('../config/config');
const path = require('path');
const crypto = require('crypto');

// 初始化腾讯云COS客户端
const cos = new COS({
  SecretId: config.cos.secretId,
  SecretKey: config.cos.secretKey
});

/**
 * 上传文件到腾讯云COS
 * @param {Buffer} fileBuffer - 文件Buffer
 * @param {String} originalName - 原始文件名
 * @param {String} mimeType - 文件MIME类型
 * @returns {Promise<String>} 文件URL
 */
const uploadToCOS = async (fileBuffer, originalName, mimeType) => {
  try {
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(mimeType)) {
      throw new Error('不支持的文件类型，仅支持 jpg, jpeg, png, gif');
    }

    // 生成唯一文件名
    const ext = path.extname(originalName);
    const fileName = `${config.cos.basePath}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;

    // 上传到COS
    const result = await cos.putObject({
      Bucket: config.cos.bucketName,
      Region: config.cos.region,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType
    });

    // 返回完整的URL
    return `${config.cos.bucketUrl}/${fileName}`;
  } catch (error) {
    console.error('COS上传失败:', error);
    throw new Error('文件上传失败: ' + error.message);
  }
};

/**
 * 从COS删除文件
 * @param {String} fileUrl - 文件URL
 * @returns {Promise<void>}
 */
const deleteFromCOS = async (fileUrl) => {
  try {
    // 从URL中提取Key
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // 移除开头的 '/'

    await cos.deleteObject({
      Bucket: config.cos.bucketName,
      Region: config.cos.region,
      Key: key
    });
  } catch (error) {
    console.error('COS删除失败:', error);
    // 删除失败不抛出错误，避免影响主流程
  }
};

module.exports = {
  uploadToCOS,
  deleteFromCOS
};

