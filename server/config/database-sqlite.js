const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let db;

// 初始化SQLite数据库
async function initDatabase() {
  try {
    db = await open({
      filename: path.join(__dirname, '../data/lxzhaopin.sqlite'),
      driver: sqlite3.Database
    });

    console.log('✅ SQLite数据库连接成功!');
    
    // 创建必要的表
    await initTables();
    
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1);
  }
}

// 初始化表
async function initTables() {
  try {
    // 创建users表（如果不存在）
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        phone TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        nickname TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT 'user',
        status TEXT DEFAULT 'active',
        profile_completed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建jobs表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        publisher_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        location TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        recruits_count TEXT DEFAULT '若干',
        skills_required TEXT,
        benefits TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建plaza_posts表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS plaza_posts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        content TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        tags TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建talents表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS talents (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        age INTEGER,
        desired_position TEXT,
        self_introduction TEXT,
        skills TEXT,
        work_experience TEXT,
        education_background TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('📝 SQLite数据库表初始化完成');
  } catch (error) {
    console.error('❌ 表初始化失败:', error);
    throw error;
  }
}

// 模拟MySQL的execute方法
const pool = {
  async execute(sql, params = []) {
    try {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const rows = await db.all(sql, params);
        return [rows]; // 返回MySQL格式的结果
      } else {
        const result = await db.run(sql, params);
        return [{ insertId: result.lastID, affectedRows: result.changes }];
      }
    } catch (error) {
      console.error('SQL执行错误:', error);
      throw error;
    }
  }
};

// 测试连接函数
async function testConnection() {
  await initDatabase();
}

module.exports = {
  pool,
  testConnection
}; 