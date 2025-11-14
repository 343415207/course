# API 接口文档

## 基础信息

- **Base URL**: `http://localhost:9000/api`
- **认证方式**: JWT Token (Bearer Token)
- **Content-Type**: `application/json` (除文件上传外)

## 认证相关

### 微信登录
- **接口**: `POST /api/auth/login`
- **请求参数**:
  ```json
  {
    "code": "微信登录code",
    "userInfo": {
      "nickName": "用户昵称",
      "avatarUrl": "用户头像URL"
    }
  }
  ```
- **响应**:
  ```json
  {
    "token": "JWT Token",
    "user": {
      "id": 1,
      "openid": "xxx",
      "nickName": "用户昵称",
      "avatarUrl": "头像URL",
      "role": "user"
    }
  }
  ```

### 获取当前用户信息
- **接口**: `GET /api/auth/user`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "id": 1,
    "openid": "xxx",
    "nickName": "用户昵称",
    "avatarUrl": "头像URL",
    "role": "user"
  }
  ```

## 课程相关

### 获取课程列表
- **接口**: `GET /api/courses`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  [
    {
      "id": 1,
      "name": "课程名称",
      "lastRecordTime": "2024-01-01T10:00:00Z",
      "totalCount": 10
    }
  ]
  ```

### 获取课程详情
- **接口**: `GET /api/courses/:id`
- **请求头**: `Authorization: Bearer {token}`

### 创建课程（管理员）
- **接口**: `POST /api/courses`
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
  ```json
  {
    "name": "课程名称",
    "userId": 1  // 可选，不传则创建给当前用户
  }
  ```

### 更新课程（管理员）
- **接口**: `PUT /api/courses/:id`
- **请求头**: `Authorization: Bearer {token}`

### 删除课程（管理员）
- **接口**: `DELETE /api/courses/:id`
- **请求头**: `Authorization: Bearer {token}`

## 记录相关

### 获取课程的所有记录
- **接口**: `GET /api/courses/:courseId/records`
- **请求头**: `Authorization: Bearer {token}`
- **响应**（按创建时间倒序）:
  ```json
  [
    {
      "id": 1,
      "courseId": 1,
      "note": "备注文字",
      "images": ["图片URL1", "图片URL2"],
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
  ```

### 获取记录详情
- **接口**: `GET /api/records/:id`
- **请求头**: `Authorization: Bearer {token}`
- **响应**:
  ```json
  {
    "id": 1,
    "courseId": 1,
    "note": "备注文字",
    "images": ["图片URL1", "图片URL2"],
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
  ```

### 创建新记录
- **接口**: `POST /api/courses/:courseId/records`
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
  ```json
  {
    "note": "备注文字"  // 可选
  }
  ```
- **响应**:
  ```json
  {
    "id": 1,
    "courseId": 1,
    "note": "备注文字",
    "createdAt": "2024-01-01T10:00:00Z"
  }
  ```

### 更新记录（主要是更新备注）
- **接口**: `PUT /api/records/:id`
- **请求头**: `Authorization: Bearer {token}`
- **请求参数**:
  ```json
  {
    "note": "更新后的备注文字"
  }
  ```

### 上传记录图片
- **接口**: `POST /api/records/:id/images`
- **请求头**: `Authorization: Bearer {token}`
- **Content-Type**: `multipart/form-data`
- **请求参数**: FormData (file)
- **响应**:
  ```json
  {
    "imageUrl": "https://mengu-1251481375.cos.ap-beijing.myqcloud.com/xxx.jpg"
  }
  ```

### 删除记录图片
- **接口**: `DELETE /api/records/:id/images/:imageId`
- **请求头**: `Authorization: Bearer {token}`

## Banner相关

### 获取Banner列表
- **接口**: `GET /api/banners`
- **响应**:
  ```json
  [
    {
      "id": 1,
      "imageUrl": "图片URL",
      "link": "跳转链接",
      "sort": 0
    }
  ]
  ```

### 创建Banner（管理员）
- **接口**: `POST /api/banners`
- **请求头**: `Authorization: Bearer {token}`

### 更新Banner（管理员）
- **接口**: `PUT /api/banners/:id`
- **请求头**: `Authorization: Bearer {token}`

### 删除Banner（管理员）
- **接口**: `DELETE /api/banners/:id`
- **请求头**: `Authorization: Bearer {token}`

## 错误响应格式

```json
{
  "error": "错误信息",
  "code": "错误代码"
}
```

## 状态码

- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未授权（Token无效或过期）
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器错误

