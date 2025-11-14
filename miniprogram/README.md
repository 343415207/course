# 微信小程序前端

## 项目结构

```
miniprogram/
├── pages/              # 页面
│   ├── index/          # 首页
│   ├── course-detail/  # 课程详情页
│   ├── record-detail/  # 记录详情页
│   └── profile/        # 我的页面
├── utils/              # 工具函数
│   ├── api.js          # API请求封装
│   ├── auth.js         # 认证相关
│   └── util.js         # 工具函数
├── app.js              # 应用入口
├── app.json            # 应用配置
└── app.wxss            # 全局样式
```

## 功能说明

### 1. 首页 (index)
- Banner轮播图展示
- 课程列表（双列卡片布局）
- 显示课程名称、最后记录时间、总次数
- 下拉刷新

### 2. 课程详情页 (course-detail)
- 显示课程的所有学习记录
- 按创建时间倒序排列
- 新增记录按钮
- 点击记录进入详情

### 3. 记录详情页 (record-detail)
- 显示记录创建时间
- 备注编辑功能
- 图片上传和预览
- 图片删除功能

### 4. 我的页面 (profile)
- 用户信息展示
- 登录/退出登录
- 管理员功能入口（预留）

## 配置说明

### 1. 修改 API 地址

在 `app.js` 中修改 `apiBaseUrl`：

```javascript
globalData: {
  apiBaseUrl: 'http://your-domain.com/api' // 生产环境域名
}
```

### 2. 配置小程序 AppID

在 `project.config.json` 中修改 `appid`：

```json
{
  "appid": "your-appid"
}
```

### 3. 配置服务器域名

在微信公众平台配置服务器域名：
- request合法域名：`http://your-domain.com`
- uploadFile合法域名：`http://your-domain.com`

## 开发步骤

### 1. 使用微信开发者工具打开项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `miniprogram` 目录
4. 填写 AppID（可使用测试号）

### 2. 配置本地开发

开发环境下，需要：
1. 确保后端服务运行在 `http://localhost:9000`
2. 在微信开发者工具中设置"不校验合法域名"（仅开发环境）

### 3. 测试功能

1. 启动后端服务
2. 在微信开发者工具中运行小程序
3. 测试各个功能模块

## 注意事项

1. **域名配置**：生产环境必须配置合法域名
2. **HTTPS**：生产环境必须使用 HTTPS
3. **图片资源**：tabBar 图标需要自行添加
4. **用户授权**：首次使用需要用户授权

## TabBar 图标

需要在 `miniprogram/images/` 目录下添加以下图标：
- `home.png` / `home-active.png` - 首页图标
- `profile.png` / `profile-active.png` - 我的图标

图标尺寸建议：81px × 81px

