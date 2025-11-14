const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// 获取Banner列表（公开接口）
router.get('/', bannerController.getBanners);

// 创建Banner（管理员）
router.post('/', authenticate, requireAdmin, bannerController.createBanner);

// 更新Banner（管理员）
router.put('/:id', authenticate, requireAdmin, bannerController.updateBanner);

// 删除Banner（管理员）
router.delete('/:id', authenticate, requireAdmin, bannerController.deleteBanner);

module.exports = router;

