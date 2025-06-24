const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// 生成UUID的辅助函数
function generateUUID() {
  return uuidv4();
}

// 注册路由
router.post('/register', [
  body('phone').isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6位')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { phone, password } = req.body;

    // 检查手机号是否已存在
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: '手机号已被注册' });
    }

    // 加密密码
    const passwordHash = await bcrypt.hash(password, 12);
    
    // 生成用户ID和邮箱
    const userId = generateUUID();
    const email = `${phone}@mobile.com`;

    // 插入用户记录
    await pool.execute(
      `INSERT INTO users (id, phone, email, password_hash, role, status) 
       VALUES (?, ?, ?, ?, 'user', 'active')`,
      [userId, phone, email, passwordHash]
    );

    // 生成JWT token
    const token = jwt.sign(
      { userId, phone, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: userId,
          phone,
          email,
          name: null,
          nickname: null,
          avatar_url: null,
          role: 'user',
          status: 'active',
          profile_completed: false
        },
        token
      }
    });

  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ error: '注册失败，请稍后重试' });
  }
});

// 登录路由
router.post('/login', [
  body('phone').isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('password').isLength({ min: 1 }).withMessage('密码不能为空')
], async (req, res) => {
  try {
    // 验证输入
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { phone, password } = req.body;

    // 查询用户
    const [users] = await pool.execute(
      'SELECT id, phone, email, password_hash, name, nickname, avatar_url, role, status, profile_completed FROM users WHERE phone = ?',
      [phone]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: '手机号或密码错误' });
    }

    const user = users[0];

    // 检查账户状态
    if (user.status !== 'active') {
      return res.status(401).json({ error: '账户已被禁用' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: '手机号或密码错误' });
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          avatar_url: user.avatar_url,
          role: user.role,
          status: user.status,
          profile_completed: Boolean(user.profile_completed)
        },
        token
      }
    });

  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败，请稍后重试' });
  }
});

// 获取当前用户信息
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT u.*, up.age, up.education, up.experience_years, up.location, up.bio, up.skills
       FROM users u 
       LEFT JOIN user_profiles up ON u.id = up.user_id 
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const user = users[0];
    // 移除敏感信息
    delete user.password_hash;
    
    // 确保布尔值正确转换
    if (user.profile_completed !== undefined) {
      user.profile_completed = Boolean(user.profile_completed);
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

// 更新用户信息
router.put('/profile', authenticateToken, [
  body('name').optional().isLength({ min: 1, max: 50 }).withMessage('姓名不超过50字符'),
  body('age').optional().isInt({ min: 1, max: 150 }).withMessage('年龄必须是1-150之间的数字'),
  body('location').optional().isLength({ max: 100 }).withMessage('地址不超过100字符')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const allowedFields = ['name', 'nickname', 'avatar_url'];
    const profileFields = ['age', 'education', 'experience_years', 'location', 'bio'];
    
    const userUpdates = {};
    const profileUpdates = {};

    // 分离用户表和用户详情表的字段
    for (const [key, value] of Object.entries(req.body)) {
      if (allowedFields.includes(key)) {
        userUpdates[key] = value;
      } else if (profileFields.includes(key)) {
        profileUpdates[key] = value;
      }
    }

    // 更新用户基本信息
    if (Object.keys(userUpdates).length > 0) {
      const updateFields = Object.keys(userUpdates).map(key => `${key} = ?`).join(', ');
      const updateValues = [...Object.values(userUpdates), req.user.id];
      
      await pool.execute(
        `UPDATE users SET ${updateFields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues
      );
    }

    // 更新用户详情信息
    if (Object.keys(profileUpdates).length > 0) {
      // 检查是否已存在用户详情记录
      const [existingProfiles] = await pool.execute(
        'SELECT id FROM user_profiles WHERE user_id = ?',
        [req.user.id]
      );

      if (existingProfiles.length > 0) {
        // 更新现有记录
        const updateFields = Object.keys(profileUpdates).map(key => `${key} = ?`).join(', ');
        const updateValues = [...Object.values(profileUpdates), req.user.id];
        
        await pool.execute(
          `UPDATE user_profiles SET ${updateFields}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
          updateValues
        );
      } else {
        // 创建新记录
        const profileId = generateUUID();
        const insertFields = ['id', 'user_id', ...Object.keys(profileUpdates)].join(', ');
        const placeholders = new Array(Object.keys(profileUpdates).length + 2).fill('?').join(', ');
        const insertValues = [profileId, req.user.id, ...Object.values(profileUpdates)];
        
        await pool.execute(
          `INSERT INTO user_profiles (${insertFields}) VALUES (${placeholders})`,
          insertValues
        );
      }
    }

    res.json({
      success: true,
      message: '用户信息更新成功'
    });

  } catch (error) {
    console.error('更新用户信息失败:', error);
    res.status(500).json({ error: '更新用户信息失败' });
  }
});

// 违禁词列表
const forbiddenWords = [
  // 管理员相关
  '管理员', '超级管理员', '系统管理员', 'admin', 'administrator', '站长', '客服',
  // 官方相关
  '官方', '官网', '系统', 'system', '兰溪招聘', '平台', '网站',
  // 敏感词汇
  '色情', '赌博', '毒品', '暴力', '恐怖', '政治', '反动', '邪教',
  // 特殊字符和数字
  'null', 'undefined', 'NaN', '测试', 'test', '临时'
];

// 验证昵称函数
function validateNickname(nickname) {
  const trimmed = nickname.trim();
  
  // 检查长度
  if (trimmed.length < 2) {
    return { isValid: false, message: '昵称至少需要2个字符' };
  }
  
  if (trimmed.length > 20) {
    return { isValid: false, message: '昵称不能超过20个字符' };
  }
  
  // 检查特殊字符
  const allowedPattern = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/;
  if (!allowedPattern.test(trimmed)) {
    return { isValid: false, message: '昵称只能包含中文、英文、数字、下划线和连字符' };
  }
  
  // 检查违禁词
  const lowerNickname = trimmed.toLowerCase();
  for (const word of forbiddenWords) {
    if (lowerNickname.includes(word.toLowerCase())) {
      return { isValid: false, message: `昵称不能包含敏感词汇: ${word}` };
    }
  }
  
  // 检查是否全是数字
  if (/^\d+$/.test(trimmed)) {
    return { isValid: false, message: '昵称不能全是数字' };
  }
  
  return { isValid: true };
}

// 完善用户资料 - 专门用于注册后的资料完善
router.post('/complete-profile', authenticateToken, [
  body('nickname').custom((value) => {
    if (!value || !value.trim()) {
      throw new Error('昵称不能为空');
    }
    
    const validation = validateNickname(value);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }
    
    return true;
  }),
  body('avatar_url').optional().custom((value) => {
    // 允许URL或base64格式的图片数据
    if (value && !value.match(/^https?:\/\//) && !value.match(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/)) {
      throw new Error('头像必须是有效的URL或base64格式的图片数据');
    }
    return true;
  })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { nickname, avatar_url } = req.body;

    // 更新用户信息，标记资料已完善
    const updateFields = ['nickname = ?', 'profile_completed = TRUE', 'updated_at = CURRENT_TIMESTAMP'];
    const updateValues = [nickname];

    if (avatar_url) {
      updateFields.push('avatar_url = ?');
      updateValues.push(avatar_url);
    }

    updateValues.push(req.user.userId);

    await pool.execute(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // 获取更新后的用户信息
    const [users] = await pool.execute(
      'SELECT id, phone, email, name, nickname, avatar_url, role, status, profile_completed FROM users WHERE id = ?',
      [req.user.userId]
    );

    const user = users[0];

    res.json({
      success: true,
      message: '资料完善成功',
      data: {
        user: {
          id: user.id,
          phone: user.phone,
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          avatar_url: user.avatar_url,
          role: user.role,
          status: user.status,
          profile_completed: Boolean(user.profile_completed)
        }
      }
    });

  } catch (error) {
    console.error('完善资料失败:', error);
    res.status(500).json({ error: '完善资料失败，请稍后重试' });
  }
});

module.exports = router; 