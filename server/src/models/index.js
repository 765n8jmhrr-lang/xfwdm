/**
 * 数据库模型统一导出
 */
const User = require('./User')
const TryonTask = require('./TryonTask')
const Order = require('./Order')

// 关联关系
User.hasMany(TryonTask, { foreignKey: 'user_id', as: 'tasks' })
TryonTask.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' })
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

module.exports = { User, TryonTask, Order }
