const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const { authenticate } = require('../middleware/auth');

// 获取课程的所有记录
router.get('/courses/:courseId/records', authenticate, recordController.getRecordsByCourse);

// 获取记录详情
router.get('/:id', authenticate, recordController.getRecordById);

// 创建新记录
router.post('/courses/:courseId/records', authenticate, recordController.createRecord);

// 更新记录（主要是更新备注）
router.put('/:id', authenticate, recordController.updateRecord);

// 删除记录
router.delete('/:id', authenticate, recordController.deleteRecord);

module.exports = router;

