/**
 * 数据库初始化脚本
 * 使用 Sequelize 自动同步模型到数据库
 * 
 * 运行: npm run db:init
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const sequelize = require('../src/config/database')
const { User, TryonTask, Order } = require('../src/models')

async function init() {
  try {
    console.log('[DB Init] 开始同步数据库...')

    // sync({ force: true }) 会删除已有表重新创建 —— 仅开发环境使用！
    // 生产环境应使用 schema.sql 或 migrations
    const force = process.argv.includes('--force')

    await sequelize.sync({ force, alter: !force })

    console.log('[DB Init] 数据库同步完成！')
    console.log(`[DB Init] 模式: ${force ? 'FORCE (重建所有表)' : 'ALTER (增量更新)'}`)
    
    // 创建默认数据
    if (force) {
      console.log('[DB Init] 创建测试数据...')
      await User.create({
        openid: 'test_openid_001',
        nickname: '测试用户',
        credits: 100,
        status: 1
      })
      console.log('[DB Init] 测试用户创建成功')
    }

    process.exit(0)
  } catch (err) {
    console.error('[DB Init] 失败:', err)
    process.exit(1)
  }
}

init()
