const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const TryonTask = sequelize.define('tryon_tasks', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  task_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    comment: '任务唯一ID（UUID）'
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '用户ID'
  },
  garment_url: {
    type: DataTypes.STRING(512),
    allowNull: false,
    comment: '服装图片URL'
  },
  model_url: {
    type: DataTypes.STRING(512),
    allowNull: false,
    comment: '模特图片URL'
  },
  result_url: {
    type: DataTypes.STRING(512),
    defaultValue: null,
    comment: '换装结果图URL'
  },
  category: {
    type: DataTypes.ENUM('upper_body', 'lower_body', 'full_body'),
    defaultValue: 'upper_body',
    comment: '换装部位'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending',
    comment: '任务状态'
  },
  error_msg: {
    type: DataTypes.STRING(256),
    defaultValue: null,
    comment: '失败原因'
  },
  retry_count: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
    comment: '重试次数'
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_deleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    comment: '软删除标志'
  }
}, {
  indexes: [
    { fields: ['task_id'] },
    { fields: ['user_id'] },
    { fields: ['status'] }
  ]
})

module.exports = TryonTask
