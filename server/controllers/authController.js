const axios = require('axios');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const config = require('../config/config');

/**
 * 微信登录
 */
const login = async (req, res, next) => {
  try {
    const { code, userInfo } = req.body;

    if (!code) {
      return res.status(400).json({
        error: '缺少code参数',
        code: 'MISSING_CODE'
      });
    }

    let openid, unionid;

    // 开发环境：如果微信配置未设置，使用测试模式
    const nodeEnv = config.nodeEnv || process.env.NODE_ENV || 'development';
    if (nodeEnv === 'development' && 
        (!config.wechat.appId || config.wechat.appId === 'your_wechat_appid' || config.wechat.appId === '')) {
      console.log('⚠️  开发环境：使用测试登录模式（微信配置未设置）');
      
      // 测试模式：根据 code 生成固定的测试 openid
      // 这样可以测试不同用户
      const testOpenIds = [
        'test_user_openid',      // 测试用户（已有数据）
        'test_admin_openid',     // 管理员（已有数据）
        'user_001', 'user_002', 'user_003', 'user_004', 'user_005',
        'user_006', 'user_007', 'user_008'
      ];
      
      // 使用 code 的哈希值来选择测试用户，或者使用第一个
      const codeHash = code.length % testOpenIds.length;
      openid = testOpenIds[codeHash] || testOpenIds[0];
      unionid = null;
      
      console.log(`测试登录：使用 openid = ${openid}`);
    } else {
      // 生产环境：调用微信API获取openid
      const wxResponse = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
          appid: config.wechat.appId,
          secret: config.wechat.secret,
          js_code: code,
          grant_type: 'authorization_code'
        }
      });

      const { openid: wxOpenid, unionid: wxUnionid, errcode, errmsg } = wxResponse.data;

      if (errcode) {
        return res.status(400).json({
          error: `微信登录失败: ${errmsg}`,
          code: 'WECHAT_LOGIN_FAILED'
        });
      }

      if (!wxOpenid) {
        return res.status(400).json({
          error: '获取openid失败',
          code: 'GET_OPENID_FAILED'
        });
      }

      openid = wxOpenid;
      unionid = wxUnionid;
    }

    // 查找或创建用户
    let user = await User.findOne({ where: { openid } });

    if (user) {
      // 更新用户信息（如果有新信息）
      if (userInfo) {
        if (userInfo.nickName) {
          user.nickName = userInfo.nickName;
        }
        if (userInfo.avatarUrl) {
          user.avatarUrl = userInfo.avatarUrl;
        }
        if (unionid) {
          user.unionid = unionid;
        }
        await user.save();
      }
    } else {
      // 创建新用户（即使没有用户信息也可以创建）
      user = await User.create({
        openid,
        unionid: unionid || null,
        nickName: userInfo?.nickName || `用户_${openid.substring(0, 8)}`, // 如果没有昵称，使用默认值
        avatarUrl: userInfo?.avatarUrl || null,
        role: 'user'
      });
    }

    // 生成JWT Token
    const token = generateToken({ userId: user.id });

    res.json({
      token,
      user: {
        id: user.id,
        openid: user.openid,
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取当前用户信息
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
      id: user.id,
      openid: user.openid,
      nickName: user.nickName,
      avatarUrl: user.avatarUrl,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getCurrentUser
};

