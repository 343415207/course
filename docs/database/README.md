# 数据库设计文档

## 数据库概述

使用 MySQL 8.0+ 数据库，通过 Sequelize ORM 进行数据操作。

## 表结构设计

### users 表（用户表）

```sql
CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `openid` VARCHAR(100) UNIQUE NOT NULL COMMENT '微信openid',
  `unionid` VARCHAR(100) COMMENT '微信unionid',
  `nick_name` VARCHAR(100) COMMENT '昵称',
  `avatar_url` VARCHAR(500) COMMENT '头像URL',
  `role` ENUM('admin', 'user') DEFAULT 'user' COMMENT '角色：admin管理员，user普通用户',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### courses 表（课程表）

```sql
CREATE TABLE `courses` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL COMMENT '课程名称',
  `user_id` INT NOT NULL COMMENT '所属用户ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程表';
```

### records 表（学习记录表）

```sql
CREATE TABLE `records` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `course_id` INT NOT NULL COMMENT '所属课程ID',
  `user_id` INT NOT NULL COMMENT '所属用户ID',
  `note` TEXT COMMENT '备注文字',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_course_id` (`course_id`),
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_created_at` (`created_at`),
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习记录表';
```

### record_images 表（记录图片表）

```sql
CREATE TABLE `record_images` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `record_id` INT NOT NULL COMMENT '所属记录ID',
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX `idx_record_id` (`record_id`),
  FOREIGN KEY (`record_id`) REFERENCES `records`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='记录图片表';
```

### banners 表（轮播图表）

```sql
CREATE TABLE `banners` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `link` VARCHAR(500) COMMENT '跳转链接（可选）',
  `sort` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1启用，0禁用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_sort` (`sort`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';
```

## 表关系说明

1. **users** ← **courses** (一对多)
   - 一个用户可以有多个课程
   - 外键：`courses.user_id` → `users.id`

2. **courses** ← **records** (一对多)
   - 一个课程可以有多个学习记录
   - 外键：`records.course_id` → `courses.id`

3. **users** ← **records** (一对多)
   - 一个用户可以有多个学习记录
   - 外键：`records.user_id` → `users.id`

4. **records** ← **record_images** (一对多)
   - 一个记录可以有多张图片
   - 外键：`record_images.record_id` → `records.id`

## 索引设计

- `users.openid`: 唯一索引，用于快速查找用户
- `courses.user_id`: 索引，用于查询用户的课程列表
- `records.course_id`: 索引，用于查询课程的所有记录
- `records.user_id`: 索引，用于查询用户的所有记录
- `records.created_at`: 索引，用于按时间排序
- `record_images.record_id`: 索引，用于查询记录的所有图片
- `banners.sort`: 索引，用于排序
- `banners.status`: 索引，用于筛选启用的Banner

## 数据库管理

使用 phpMyAdmin 进行数据库可视化管理，通过 Docker Compose 部署。

详细配置请参考 [Docker 配置管理文档](../docker/README.md)

