/**
 * 数据库初始化脚本 - 创建测试数据
 * 使用方法: node scripts/init-data.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize } = require('../config/database');
const { User, Course, Record, RecordImage, Banner } = require('../models');

async function initData() {
  try {
    console.log('开始初始化测试数据...');

    // 同步数据库
    await sequelize.sync({ alter: false });
    console.log('数据库同步完成');

    // 创建测试用户（管理员）
    const adminUser = await User.findOrCreate({
      where: { openid: 'test_admin_openid' },
      defaults: {
        openid: 'test_admin_openid',
        nickName: '管理员',
        avatarUrl: 'https://via.placeholder.com/100',
        role: 'admin'
      }
    });
    console.log('管理员用户创建完成:', adminUser[0].id);

    // 创建测试用户（普通用户）
    const normalUser = await User.findOrCreate({
      where: { openid: 'test_user_openid' },
      defaults: {
        openid: 'test_user_openid',
        nickName: '测试用户',
        avatarUrl: 'https://via.placeholder.com/100',
        role: 'user'
      }
    });
    console.log('普通用户创建完成:', normalUser[0].id);

    // 创建测试 Banner
    const bannerCount = await Banner.count();
    if (bannerCount === 0) {
      await Banner.bulkCreate([
        {
          imageUrl: 'https://via.placeholder.com/750x300/3cc51f/ffffff?text=Banner+1',
          link: '',
          sort: 0,
          status: 1
        },
        {
          imageUrl: 'https://via.placeholder.com/750x300/2ea816/ffffff?text=Banner+2',
          link: '',
          sort: 1,
          status: 1
        },
        {
          imageUrl: 'https://via.placeholder.com/750x300/1a7a0a/ffffff?text=Banner+3',
          link: '',
          sort: 2,
          status: 1
        }
      ]);
      console.log('Banner 数据创建完成');
    } else {
      console.log('Banner 数据已存在，跳过创建');
    }

    // 创建测试课程（为普通用户）
    const courseCount = await Course.count({ where: { userId: normalUser[0].id } });
    if (courseCount === 0) {
      const courses = await Course.bulkCreate([
        {
          name: '数学课程',
          userId: normalUser[0].id
        },
        {
          name: '英语课程',
          userId: normalUser[0].id
        },
        {
          name: '编程课程',
          userId: normalUser[0].id
        }
      ]);
      console.log('课程数据创建完成:', courses.length, '个');

      // 为第一个课程创建测试记录
      if (courses[0]) {
        const records = await Record.bulkCreate([
          {
            courseId: courses[0].id,
            userId: normalUser[0].id,
            note: '今天学习了第一章内容，感觉很有收获！',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2天前
          },
          {
            courseId: courses[0].id,
            userId: normalUser[0].id,
            note: '完成了课后练习，正确率80%',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1天前
          },
          {
            courseId: courses[0].id,
            userId: normalUser[0].id,
            note: '今天复习了前面的内容',
            created_at: new Date() // 今天
          }
        ]);
        console.log('记录数据创建完成:', records.length, '条');
      }
    } else {
      console.log('课程数据已存在，跳过创建');
    }

    console.log('\n✅ 测试数据初始化完成！');
    console.log('\n测试账号信息:');
    console.log('管理员: openid = test_admin_openid');
    console.log('普通用户: openid = test_user_openid');
    console.log('\n注意: 这些是测试数据，实际使用时需要通过微信登录获取真实的 openid');

  } catch (error) {
    console.error('初始化数据失败:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// 运行初始化
initData();

