const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const router = express.Router();

// 认证中间件
const { authenticateToken } = require('../middleware/auth');

// 生成UUID函数
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 发布招聘信息
router.post('/jobs', authenticateToken, [
  body('title').notEmpty().withMessage('职位名称不能为空'),
  body('company').notEmpty().withMessage('公司名称不能为空'),
  body('salary').notEmpty().withMessage('薪资范围不能为空'),
  body('phone').isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('description').notEmpty().withMessage('职位描述不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, company, salary, recruits, phone, tags, benefits, description } = req.body;
    const jobId = generateUUID();

    // 解析技能标签和福利待遇
    const skillTags = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    const benefitList = benefits ? benefits.split(',').map(benefit => benefit.trim()).filter(Boolean) : [];

    // 对于简化版本，先创建一个最小的公司记录（如果需要）
    const companyId = generateUUID();
    
    await pool.execute(
      `INSERT INTO jobs (id, publisher_id, title, description, requirements, location, 
                        contact_phone, recruits_count, skills_required, benefits, status)
       VALUES (?, ?, ?, ?, ?, '兰溪', ?, ?, ?, ?, 'active')`,
      [jobId, req.user.id, title, description, description, phone, 
       recruits || '若干', JSON.stringify(skillTags), JSON.stringify(benefitList)]
    );

    res.status(201).json({
      success: true,
      message: '招聘信息发布成功',
      data: { id: jobId }
    });

  } catch (error) {
    console.error('发布招聘信息失败:', error);
    res.status(500).json({ error: '发布失败，请稍后重试' });
  }
});

// 发布找活信息
router.post('/plaza', authenticateToken, [
  body('text').notEmpty().withMessage('详细说明不能为空'),
  body('phone').isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('category').isIn(['finding_job', 'recruiting']).withMessage('请选择正确的分类')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { text, tags, phone, category } = req.body;
    const plazaId = generateUUID();

    // 解析标签
    const tagList = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    await pool.execute(
      `INSERT INTO plaza_posts (id, user_id, content, contact_phone, tags, category, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [plazaId, req.user.id, text, phone, JSON.stringify(tagList), category]
    );

    const categoryText = category === 'finding_job' ? '找活' : '招人';
    res.status(201).json({
      success: true,
      message: `${categoryText}信息发布成功`,
      data: { id: plazaId }
    });

  } catch (error) {
    console.error('发布找活信息失败:', error);
    res.status(500).json({ error: '发布失败，请稍后重试' });
  }
});

// 创建/更新简历
router.post('/talent', authenticateToken, [
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('phone').isMobilePhone('zh-CN').withMessage('请输入有效的手机号'),
  body('role').notEmpty().withMessage('期望职位不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, phone, age, role, meta, skills, experience, education } = req.body;

    // 解析技能标签
    const skillList = skills ? skills.split(',').map(skill => skill.trim()).filter(Boolean) : [];

    // 检查是否已有简历
    const [existingTalents] = await pool.execute(
      'SELECT id FROM talents WHERE user_id = ?',
      [req.user.id]
    );

    if (existingTalents.length > 0) {
      // 更新现有简历
      await pool.execute(
        `UPDATE talents SET name = ?, contact_phone = ?, age = ?, desired_position = ?, 
                           self_introduction = ?, skills = ?, work_experience = ?, education_background = ?
         WHERE user_id = ?`,
        [name, phone, age || null, role, meta || '', JSON.stringify(skillList), 
         experience || '', education || '', req.user.id]
      );

      res.json({
        success: true,
        message: '简历更新成功',
        data: { id: existingTalents[0].id }
      });
    } else {
      // 创建新简历
      const talentId = generateUUID();
      
      await pool.execute(
        `INSERT INTO talents (id, user_id, name, contact_phone, age, desired_position, 
                             self_introduction, skills, work_experience, education_background, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [talentId, req.user.id, name, phone, age || null, role, meta || '', 
         JSON.stringify(skillList), experience || '', education || '']
      );

      res.status(201).json({
        success: true,
        message: '简历创建成功',
        data: { id: talentId }
      });
    }

  } catch (error) {
    console.error('保存简历失败:', error);
    res.status(500).json({ error: '保存失败，请稍后重试' });
  }
});

// 获取我的发布
router.get('/my', authenticateToken, async (req, res) => {
  try {
    // 获取我的招聘信息
    const [jobs] = await pool.execute(
      'SELECT * FROM jobs WHERE publisher_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // 获取我的找活信息
    const [plazaPosts] = await pool.execute(
      'SELECT * FROM plaza_posts WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // 获取我的简历
    const [talents] = await pool.execute(
      'SELECT * FROM talents WHERE user_id = ? ORDER BY updated_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        jobs,
        plazaPosts,
        talents
      }
    });

  } catch (error) {
    console.error('获取我的发布失败:', error);
    res.status(500).json({ error: '获取失败，请稍后重试' });
  }
});

// 公开接口 - 获取所有招聘信息
router.get('/jobs/public', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [jobs] = await pool.execute(
      `SELECT j.*, u.nickname as publisher_name FROM jobs j 
       LEFT JOIN users u ON j.publisher_id = u.id 
       WHERE j.status = 'active' 
       ORDER BY j.created_at DESC 
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: jobs
    });

  } catch (error) {
    console.error('获取招聘信息失败:', error);
    res.status(500).json({ error: '获取失败，请稍后重试' });
  }
});

// 公开接口 - 获取所有找活信息
router.get('/plaza/public', async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const offset = (page - 1) * limit;

    // 构建查询条件
    let whereClause = 'WHERE p.status = ?';
    let queryParams = ['active'];

    if (category && ['finding_job', 'recruiting'].includes(category)) {
      whereClause += ' AND p.category = ?';
      queryParams.push(category);
    }

    const [plazaPosts] = await pool.execute(
      `SELECT p.*, u.nickname as user_name FROM plaza_posts p 
       LEFT JOIN users u ON p.user_id = u.id 
       ${whereClause}
       ORDER BY p.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: plazaPosts
    });

  } catch (error) {
    console.error('获取找活信息失败:', error);
    res.status(500).json({ error: '获取失败，请稍后重试' });
  }
});

// 公开接口 - 获取所有求职简历
router.get('/talents/public', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [talents] = await pool.execute(
      `SELECT * FROM talents 
       WHERE status = 'active' 
       ORDER BY updated_at DESC 
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: talents
    });

  } catch (error) {
    console.error('获取求职信息失败:', error);
    res.status(500).json({ error: '获取失败，请稍后重试' });
  }
});

// 点赞/取消点赞找活信息
router.post('/plaza/:id/like', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 检查是否已经点赞过
    const [existingLikes] = await pool.execute(
      'SELECT id FROM plaza_likes WHERE plaza_post_id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingLikes.length > 0) {
      // 取消点赞
      await pool.execute(
        'DELETE FROM plaza_likes WHERE plaza_post_id = ? AND user_id = ?',
        [id, userId]
      );
      
      // 更新点赞数
      await pool.execute(
        'UPDATE plaza_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: '取消点赞成功',
        data: { isLiked: false }
      });
    } else {
      // 添加点赞
      await pool.execute(
        'INSERT INTO plaza_likes (id, plaza_post_id, user_id) VALUES (?, ?, ?)',
        [generateUUID(), id, userId]
      );
      
      // 更新点赞数
      await pool.execute(
        'UPDATE plaza_posts SET likes_count = likes_count + 1 WHERE id = ?',
        [id]
      );

      res.json({
        success: true,
        message: '点赞成功',
        data: { isLiked: true }
      });
    }

  } catch (error) {
    console.error('点赞操作失败:', error);
    res.status(500).json({ error: '操作失败，请稍后重试' });
  }
});

// 添加评论
router.post('/plaza/:id/comment', authenticateToken, [
  body('content').notEmpty().withMessage('评论内容不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const commentId = generateUUID();

    // 添加评论
    await pool.execute(
      `INSERT INTO plaza_comments (id, plaza_post_id, user_id, content, status) 
       VALUES (?, ?, ?, ?, 'active')`,
      [commentId, id, userId, content]
    );

    // 更新评论数
    await pool.execute(
      'UPDATE plaza_posts SET comments_count = comments_count + 1 WHERE id = ?',
      [id]
    );

    // 获取评论者信息返回
    const [comments] = await pool.execute(
      `SELECT c.*, u.nickname as user_name FROM plaza_comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.id = ?`,
      [commentId]
    );

    res.status(201).json({
      success: true,
      message: '评论成功',
      data: comments[0]
    });

  } catch (error) {
    console.error('添加评论失败:', error);
    res.status(500).json({ error: '评论失败，请稍后重试' });
  }
});

// 获取找活信息的评论
router.get('/plaza/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [comments] = await pool.execute(
      `SELECT c.*, u.nickname as user_name FROM plaza_comments c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.plaza_post_id = ? AND c.status = 'active' 
       ORDER BY c.created_at DESC 
       LIMIT ? OFFSET ?`,
      [id, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: comments
    });

  } catch (error) {
    console.error('获取评论失败:', error);
    res.status(500).json({ error: '获取失败，请稍后重试' });
  }
});

// 检查用户是否点赞过某条找活信息
router.get('/plaza/:id/like-status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [likes] = await pool.execute(
      'SELECT id FROM plaza_likes WHERE plaza_post_id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({
      success: true,
      data: { isLiked: likes.length > 0 }
    });

  } catch (error) {
    console.error('获取点赞状态失败:', error);
    res.status(500).json({ error: '获取失败，请稍后重试' });
  }
});

module.exports = router; 