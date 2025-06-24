const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// JWT认证中间件
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: '访问令牌不存在' });
  }

  try {
    // 验证JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 查询用户信息
    const [rows] = await pool.execute(
      'SELECT id, phone, email, name, role, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: '用户不存在' });
    }

    const user = rows[0];
    
    if (user.status !== 'active') {
      return res.status(401).json({ error: '账户已被禁用' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('认证失败:', error);
    return res.status(403).json({ error: '无效的访问令牌' });
  }
};

// 检查管理员权限
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin
}; 