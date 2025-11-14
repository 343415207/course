/**
 * 更新 Banner 图片 URL 脚本
 * 将占位符图片替换为可用的图片 URL
 * 使用方法: node scripts/update-banner-images.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize } = require('../config/database');
const { Banner } = require('../models');

// 使用一些公开可用的图片 URL（示例）
// 你可以替换为实际的图片 URL，或者上传到腾讯云 COS
// 注意：小程序要求图片必须使用 HTTPS，且域名需要在微信后台配置
const bannerImages = [
  // 使用 Unsplash 的图片源（更可靠）
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=750&h=300&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=750&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=750&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=750&h=300&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=750&h=300&fit=crop',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=750&h=300&fit=crop',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=750&h=300&fit=crop',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=750&h=300&fit=crop'
];

async function updateBannerImages() {
  try {
    console.log('开始更新 Banner 图片 URL...');

    // 获取所有启用的 Banner
    const banners = await Banner.findAll({
      where: { status: 1 },
      order: [['sort', 'ASC'], ['created_at', 'ASC']]
    });

    if (banners.length === 0) {
      console.log('没有找到 Banner，先创建一些默认 Banner...');
      
      // 创建默认 Banner
      await Banner.bulkCreate([
        {
          imageUrl: bannerImages[0],
          link: '',
          sort: 0,
          status: 1
        },
        {
          imageUrl: bannerImages[1],
          link: '',
          sort: 1,
          status: 1
        },
        {
          imageUrl: bannerImages[2],
          link: '',
          sort: 2,
          status: 1
        }
      ]);
      console.log('✅ 默认 Banner 创建完成');
    } else {
      // 更新现有 Banner 的图片 URL
      for (let i = 0; i < banners.length; i++) {
        const banner = banners[i];
        const newImageUrl = bannerImages[i % bannerImages.length];
        
        // 只更新占位符图片
        if (banner.imageUrl && banner.imageUrl.includes('via.placeholder.com')) {
          banner.imageUrl = newImageUrl;
          await banner.save();
          console.log(`✅ 更新 Banner ${banner.id}: ${newImageUrl}`);
        } else {
          console.log(`⏭️  跳过 Banner ${banner.id} (已有有效图片)`);
        }
      }
    }

    console.log('✅ Banner 图片 URL 更新完成');
    process.exit(0);
  } catch (error) {
    console.error('❌ 更新失败:', error);
    process.exit(1);
  }
}

// 运行脚本
updateBannerImages();

