/**
 * Sequelize 数据库连接配置
 */
const { Sequelize } = require('sequelize')
const config = require('./index')

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'mysql',
  logging: config.isDev ? console.log : false,
  timezone: '+08:00',
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
})

// 测试连接
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('[DB] 数据库连接成功')
  } catch (error) {
    console.error('[DB] 数据库连接失败:', error.message)
  }
}

testConnection()

module.exports = sequelize
