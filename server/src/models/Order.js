const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Order = sequelize.define('orders', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  order_no: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    comment: '订单号'
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  plan_id: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    comment: '套餐ID（1=10次 2=50次 3=100次）'
  },
  plan_name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    comment: '套餐名称'
  },
  credits: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    comment: '购买的换装次数'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: '支付金额（元）'
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded', 'closed'),
    defaultValue: 'pending'
  },
  wx_prepay_id: {
    type: DataTypes.STRING(128),
    defaultValue: null,
    comment: '微信预支付ID'
  },
  wx_transaction_id: {
    type: DataTypes.STRING(64),
    defaultValue: null,
    comment: '微信支付交易号'
  },
  paid_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [
    { fields: ['order_no'] },
    { fields: ['user_id'] }
  ]
})

module.exports = Order
