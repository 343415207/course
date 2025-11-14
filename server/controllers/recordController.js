const { Record, RecordImage, Course } = require('../models');
const multer = require('multer');
const { uploadToCOS, deleteFromCOS } = require('../utils/upload');
const { getRandomEncouragement } = require('../utils/encouragements');

// 配置multer（内存存储）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型，仅支持 jpg, jpeg, png, gif'));
    }
  }
});

/**
 * 获取课程的所有记录
 */
const getRecordsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // 验证课程是否属于当前用户
    const course = await Course.findOne({
      where: {
        id: courseId,
        userId
      }
    });

    if (!course) {
      return res.status(404).json({
        error: '课程不存在',
        code: 'COURSE_NOT_FOUND'
      });
    }

    // 查询记录
    const records = await Record.findAll({
      where: {
        courseId,
        userId
      },
      order: [['created_at', 'DESC']]
    });

    // 格式化数据
    const formattedRecords = records.map(record => ({
      id: record.id,
      courseId: record.courseId,
      note: record.note || '',
      createdAt: record.created_at
    }));

    res.json(formattedRecords);
  } catch (error) {
    next(error);
  }
};

/**
 * 获取记录详情
 */
const getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const record = await Record.findOne({
      where: {
        id,
        userId // 确保只能查看自己的记录
      }
    });

    if (!record) {
      return res.status(404).json({
        error: '记录不存在',
        code: 'RECORD_NOT_FOUND'
      });
    }

    res.json({
      id: record.id,
      courseId: record.courseId,
      note: record.note,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 创建新记录
 */
const createRecord = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // 验证课程是否属于当前用户
    const course = await Course.findOne({
      where: {
        id: courseId,
        userId
      }
    });

    if (!course) {
      return res.status(404).json({
        error: '课程不存在',
        code: 'COURSE_NOT_FOUND'
      });
    }

    // 自动填充当前时间和鼓励语作为备注
    const now = new Date();
    // 明确指定时区为中国时区（UTC+8）
    const formattedTime = now.toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    // 随机获取一条鼓励语
    const encouragement = getRandomEncouragement();
    
    // 组合时间和鼓励语
    const note = `${formattedTime} ${encouragement}`;

    const record = await Record.create({
      courseId,
      userId,
      note: note
    });

    res.status(201).json({
      id: record.id,
      courseId: record.courseId,
      note: record.note,
      createdAt: record.created_at
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新记录（主要是更新备注）
 */
const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const userId = req.user.id;

    const record = await Record.findOne({
      where: {
        id,
        userId // 确保只能更新自己的记录
      }
    });

    if (!record) {
      return res.status(404).json({
        error: '记录不存在',
        code: 'RECORD_NOT_FOUND'
      });
    }

    if (note !== undefined) {
      record.note = note;
      await record.save();
    }

    res.json({
      id: record.id,
      note: record.note,
      updatedAt: record.updated_at
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 上传记录图片
 */
const uploadImage = [
  upload.single('file'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({
          error: '请选择要上传的图片',
          code: 'NO_FILE'
        });
      }

      // 验证记录是否属于当前用户
      const record = await Record.findOne({
        where: {
          id,
          userId
        }
      });

      if (!record) {
        return res.status(404).json({
          error: '记录不存在',
          code: 'RECORD_NOT_FOUND'
        });
      }

      // 上传到COS
      const imageUrl = await uploadToCOS(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // 保存图片记录
      const recordImage = await RecordImage.create({
        recordId: id,
        imageUrl,
        sort: 0
      });

      res.status(201).json({
        id: recordImage.id,
        imageUrl: recordImage.imageUrl
      });
    } catch (error) {
      next(error);
    }
  }
];

/**
 * 删除记录
 */
const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 验证记录是否属于当前用户
    const record = await Record.findOne({
      where: {
        id,
        userId
      },
      include: [
        {
          model: RecordImage,
          as: 'images'
        }
      ]
    });

    if (!record) {
      return res.status(404).json({
        error: '记录不存在',
        code: 'RECORD_NOT_FOUND'
      });
    }

    // 删除关联的图片（如果有，兼容旧数据）
    if (record.images && record.images.length > 0) {
      for (const image of record.images) {
        try {
          // 从COS删除
          await deleteFromCOS(image.imageUrl);
        } catch (cosError) {
          console.error('删除COS图片失败:', cosError);
          // 继续删除数据库记录
        }
        // 删除数据库记录
        await image.destroy();
      }
    }

    // 删除记录
    await record.destroy();

    res.json({ message: '记录删除成功' });
  } catch (error) {
    console.error('删除记录错误:', error);
    next(error);
  }
};

module.exports = {
  getRecordsByCourse,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord
};
