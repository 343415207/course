const { Banner } = require('../models');

/**
 * 获取Banner列表
 */
const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.findAll({
      where: {
        status: 1 // 只返回启用的Banner
      },
      order: [['sort', 'ASC'], ['created_at', 'DESC']],
      attributes: ['id', 'imageUrl', 'link', 'sort']
    });

    res.json(banners);
  } catch (error) {
    next(error);
  }
};

/**
 * 创建Banner（管理员）
 */
const createBanner = async (req, res, next) => {
  try {
    const { imageUrl, link, sort, status } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        error: '图片URL不能为空',
        code: 'MISSING_IMAGE_URL'
      });
    }

    const banner = await Banner.create({
      imageUrl,
      link: link || null,
      sort: sort || 0,
      status: status !== undefined ? status : 1
    });

    res.status(201).json(banner);
  } catch (error) {
    next(error);
  }
};

/**
 * 更新Banner（管理员）
 */
const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { imageUrl, link, sort, status } = req.body;

    const banner = await Banner.findByPk(id);

    if (!banner) {
      return res.status(404).json({
        error: 'Banner不存在',
        code: 'BANNER_NOT_FOUND'
      });
    }

    if (imageUrl !== undefined) banner.imageUrl = imageUrl;
    if (link !== undefined) banner.link = link;
    if (sort !== undefined) banner.sort = sort;
    if (status !== undefined) banner.status = status;

    await banner.save();

    res.json(banner);
  } catch (error) {
    next(error);
  }
};

/**
 * 删除Banner（管理员）
 */
const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByPk(id);

    if (!banner) {
      return res.status(404).json({
        error: 'Banner不存在',
        code: 'BANNER_NOT_FOUND'
      });
    }

    await banner.destroy();

    res.json({ message: 'Banner删除成功' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
};

