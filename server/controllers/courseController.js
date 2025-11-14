const { Course, Record } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

/**
 * 获取用户的课程列表（包含统计信息）
 */
const getCourses = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 查询课程列表
    const courses = await Course.findAll({
      where: { userId },
      include: [
        {
          model: Record,
          as: 'records',
          attributes: ['id', 'created_at'],
          required: false,
          order: [['created_at', 'DESC']],
          limit: 1
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // 格式化数据，计算统计信息
    const formattedCourses = await Promise.all(courses.map(async (course) => {
      const records = await Record.findAll({
        where: { courseId: course.id },
        attributes: ['id', 'created_at'],
        order: [['created_at', 'DESC']],
        limit: 1
      });

      const totalCount = await Record.count({
        where: { courseId: course.id }
      });

      // 格式化时间，确保返回 ISO 字符串格式
      let lastRecordTime = null;
      if (records[0] && records[0].created_at) {
        lastRecordTime = records[0].created_at instanceof Date 
          ? records[0].created_at.toISOString() 
          : records[0].created_at;
      }

      return {
        id: course.id,
        name: course.name,
        lastRecordTime: lastRecordTime,
        totalCount: totalCount
      };
    }));

    res.json(formattedCourses);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取课程详情
 */
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const course = await Course.findOne({
      where: {
        id,
        userId // 确保只能查看自己的课程
      }
    });

    if (!course) {
      return res.status(404).json({
        error: '课程不存在',
        code: 'COURSE_NOT_FOUND'
      });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建课程（普通用户创建自己的课程，管理员可以为其他用户创建）
 */
const createCourse = async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    const currentUser = req.user;

    if (!name) {
      return res.status(400).json({
        error: '课程名称不能为空',
        code: 'MISSING_NAME'
      });
    }

    // 普通用户只能为自己创建课程，管理员可以为其他用户创建
    let targetUserId = currentUser.id;
    if (userId && currentUser.role === 'admin') {
      // 管理员可以为其他用户创建课程
      targetUserId = userId;
    } else if (userId && userId !== currentUser.id) {
      // 普通用户不能为其他用户创建课程
      return res.status(403).json({
        error: '权限不足，只能为自己创建课程',
        code: 'PERMISSION_DENIED'
      });
    }

    const course = await Course.create({
      name,
      userId: targetUserId
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新课程（管理员）
 */
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        error: '课程不存在',
        code: 'COURSE_NOT_FOUND'
      });
    }

    if (name) {
      course.name = name;
      await course.save();
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除课程（管理员）
 */
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        error: '课程不存在',
        code: 'COURSE_NOT_FOUND'
      });
    }

    await course.destroy();

    res.json({ message: '课程删除成功' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};

