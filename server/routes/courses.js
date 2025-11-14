const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// 获取用户的课程列表
router.get('/', authenticate, courseController.getCourses);

// 获取课程详情
router.get('/:id', authenticate, courseController.getCourseById);

// 创建课程（普通用户也可以创建自己的课程）
router.post('/', authenticate, courseController.createCourse);

// 更新课程（管理员）
router.put('/:id', authenticate, requireAdmin, courseController.updateCourse);

// 删除课程（管理员）
router.delete('/:id', authenticate, requireAdmin, courseController.deleteCourse);

module.exports = router;

