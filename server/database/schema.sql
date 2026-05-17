-- =============================================
-- 拍版宝 数据库初始化脚本
-- MySQL 8.0+
-- =============================================

CREATE DATABASE IF NOT EXISTS `paibanbao`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `paibanbao`;

-- -------------------------------------------
-- 用户表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `openid` VARCHAR(64) NOT NULL COMMENT '微信openid',
  `nickname` VARCHAR(64) DEFAULT '' COMMENT '昵称',
  `avatar_url` VARCHAR(512) DEFAULT '' COMMENT '头像URL',
  `credits` INT UNSIGNED DEFAULT 10 COMMENT '剩余换装次数',
  `total_used` INT UNSIGNED DEFAULT 0 COMMENT '累计使用次数',
  `status` TINYINT DEFAULT 1 COMMENT '1=正常 0=禁用',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- -------------------------------------------
-- 换装任务表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `tryon_tasks` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id` VARCHAR(64) NOT NULL COMMENT '任务唯一ID（UUID）',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `garment_url` VARCHAR(512) NOT NULL COMMENT '服装图片URL',
  `model_url` VARCHAR(512) NOT NULL COMMENT '模特图片URL',
  `result_url` VARCHAR(512) DEFAULT NULL COMMENT '换装结果图URL',
  `category` ENUM('upper_body','lower_body','full_body') DEFAULT 'upper_body' COMMENT '换装部位',
  `status` ENUM('pending','processing','completed','failed') DEFAULT 'pending' COMMENT '任务状态',
  `error_msg` VARCHAR(256) DEFAULT NULL COMMENT '失败原因',
  `retry_count` TINYINT UNSIGNED DEFAULT 0 COMMENT '重试次数',
  `completed_at` DATETIME DEFAULT NULL COMMENT '完成时间',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '软删除 0=正常 1=已删除',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_task_id` (`task_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_user_deleted` (`user_id`, `is_deleted`, `created_at`),
  CONSTRAINT `fk_task_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='换装任务表';

-- -------------------------------------------
-- 订单表
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(64) NOT NULL COMMENT '订单号',
  `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `plan_id` TINYINT UNSIGNED NOT NULL COMMENT '套餐ID',
  `plan_name` VARCHAR(32) NOT NULL COMMENT '套餐名称',
  `credits` INT UNSIGNED NOT NULL COMMENT '购买的换装次数',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '支付金额（元）',
  `status` ENUM('pending','paid','refunded','closed') DEFAULT 'pending' COMMENT '订单状态',
  `wx_prepay_id` VARCHAR(128) DEFAULT NULL COMMENT '微信预支付ID',
  `wx_transaction_id` VARCHAR(64) DEFAULT NULL COMMENT '微信支付交易号',
  `paid_at` DATETIME DEFAULT NULL COMMENT '支付时间',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- -------------------------------------------
-- 额度变动流水表（可选，用于审计）
-- -------------------------------------------
CREATE TABLE IF NOT EXISTS `credit_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `change_amount` INT NOT NULL COMMENT '变动数量（正数=增加，负数=扣减）',
  `balance_after` INT UNSIGNED NOT NULL COMMENT '变动后余额',
  `reason` VARCHAR(64) NOT NULL COMMENT '变动原因：tryon/recharge/refund/gift',
  `ref_id` VARCHAR(64) DEFAULT NULL COMMENT '关联ID（task_id或order_no）',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='额度变动流水表';
