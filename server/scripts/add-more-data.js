/**
 * 添加更多测试数据脚本
 * 使用方法: node scripts/add-more-data.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize } = require('../config/database');
const { User, Course, Record, RecordImage, Banner } = require('../models');

async function addMoreData() {
  try {
    console.log('开始添加更多测试数据...');

    // 添加更多 Banner
    const bannerCount = await Banner.count();
    if (bannerCount < 10) {
      const newBanners = [
        {
          imageUrl: 'https://via.placeholder.com/750x300/4CAF50/ffffff?text=欢迎使用课程记录系统',
          link: '',
          sort: 3,
          status: 1
        },
        {
          imageUrl: 'https://via.placeholder.com/750x300/2196F3/ffffff?text=记录每一次学习成长',
          link: '',
          sort: 4,
          status: 1
        },
        {
          imageUrl: 'https://via.placeholder.com/750x300/FF9800/ffffff?text=坚持学习成就未来',
          link: '',
          sort: 5,
          status: 1
        },
        {
          imageUrl: 'https://via.placeholder.com/750x300/9C27B0/ffffff?text=让学习更有条理',
          link: '',
          sort: 6,
          status: 1
        },
        {
          imageUrl: 'https://via.placeholder.com/750x300/E91E63/ffffff?text=每日进步一点点',
          link: '',
          sort: 7,
          status: 1
        }
      ];
      
      await Banner.bulkCreate(newBanners);
      console.log(`✅ 添加了 ${newBanners.length} 条 Banner`);
    } else {
      console.log('Banner 数据已足够，跳过添加');
    }

    // 添加更多用户
    const users = [
      { openid: 'user_001', nickName: '张三', role: 'user' },
      { openid: 'user_002', nickName: '李四', role: 'user' },
      { openid: 'user_003', nickName: '王五', role: 'user' },
      { openid: 'user_004', nickName: '赵六', role: 'user' },
      { openid: 'user_005', nickName: '钱七', role: 'user' },
      { openid: 'user_006', nickName: '孙八', role: 'user' },
      { openid: 'user_007', nickName: '周九', role: 'user' },
      { openid: 'user_008', nickName: '吴十', role: 'user' }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const [user, created] = await User.findOrCreate({
        where: { openid: userData.openid },
        defaults: {
          openid: userData.openid,
          nickName: userData.nickName,
          avatarUrl: `https://via.placeholder.com/100/3cc51f/ffffff?text=${userData.nickName.charAt(0)}`,
          role: userData.role
        }
      });
      if (created) {
        createdUsers.push(user);
      }
    }
    console.log(`✅ 添加了 ${createdUsers.length} 个新用户`);

    // 为每个用户创建课程和记录
    const allUsers = await User.findAll({ where: { role: 'user' } });
    const courseNames = [
      '数学', '英语', '编程', '物理', '化学', '生物',
      '历史', '地理', '语文', '音乐', '美术', '体育'
    ];

    let totalCourses = 0;
    let totalRecords = 0;

    for (const user of allUsers) {
      // 为每个用户创建 2-4 门课程
      const courseCount = Math.floor(Math.random() * 3) + 2;
      const userCourseNames = courseNames
        .sort(() => Math.random() - 0.5)
        .slice(0, courseCount);

      for (const courseName of userCourseNames) {
        // 检查课程是否已存在
        const existingCourse = await Course.findOne({
          where: {
            name: courseName,
            userId: user.id
          }
        });

        if (!existingCourse) {
          const course = await Course.create({
            name: courseName,
            userId: user.id
          });
          totalCourses++;

          // 为每门课程创建 1-5 条记录
          const recordCount = Math.floor(Math.random() * 5) + 1;
          const notes = [
            '今天学习了新内容，很有收获！',
            '完成了课后练习，正确率不错',
            '复习了前面的知识点',
            '做了笔记，整理思路',
            '遇到了一些问题，需要继续学习',
            '感觉进步很大，继续加油！',
            '今天状态不错，学习效率很高',
            '需要多练习才能掌握'
          ];

          for (let i = 0; i < recordCount; i++) {
            const daysAgo = Math.floor(Math.random() * 30); // 过去30天内的随机时间
            const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
            
            const record = await Record.create({
              courseId: course.id,
              userId: user.id,
              note: notes[Math.floor(Math.random() * notes.length)],
              created_at: createdAt,
              updated_at: createdAt
            });
            totalRecords++;
          }
        }
      }
    }

    console.log(`✅ 添加了 ${totalCourses} 门课程`);
    console.log(`✅ 添加了 ${totalRecords} 条记录`);

    // 统计信息
    const stats = {
      users: await User.count(),
      courses: await Course.count(),
      records: await Record.count(),
      banners: await Banner.count()
    };

    console.log('\n📊 数据统计:');
    console.log(`- 用户总数: ${stats.users}`);
    console.log(`- 课程总数: ${stats.courses}`);
    console.log(`- 记录总数: ${stats.records}`);
    console.log(`- Banner总数: ${stats.banners}`);

    console.log('\n✅ 测试数据添加完成！');

  } catch (error) {
    console.error('添加数据失败:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// 运行脚本
addMoreData();

