const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  openid: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    comment: '微信 openid'
  },
  nickname: {
    type: DataTypes.STRING(64),
    defaultValue: '',
    comment: '昵称'
  },
  avatar_url: {
    type: DataTypes.STRING(512),
    defaultValue: '',
    comment: '头像URL'
  },
  credits: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 10,
    comment: '剩余换装次数'
  },
  total_used: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
    comment: '累计使用次数'
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    comment: '1=正常 0=禁用'
  },
  last_login_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [{ fields: ['openid'] }]
})

module.exports = User
