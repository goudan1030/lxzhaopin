<template>
  <div class="demo-page">
    <div class="demo-container">
      <h1>兰溪招聘 - 功能演示</h1>
      <p class="demo-subtitle">点击下方按钮体验各个页面功能</p>
      
      <div class="demo-section">
        <h2>📱 主要页面</h2>
        <div class="demo-buttons">
          <button @click="$router.push('/')" class="demo-btn primary">
            🏠 主页 (三Tab)
          </button>
          <button @click="$router.push('/login')" class="demo-btn">
            🔐 登录/注册
          </button>
          <button @click="$router.push('/job/0')" class="demo-btn">
            💼 招聘详情页
          </button>
          <button @click="$router.push('/talent/0')" class="demo-btn">
            👤 人才详情页
          </button>
        </div>
      </div>

      <div class="demo-section">
        <h2>✨ 发布功能</h2>
        <div class="demo-buttons">
          <button @click="$router.push('/post')" class="demo-btn">
            📝 发布页面 (选择类型)
          </button>
          <button @click="$router.push('/post/job')" class="demo-btn">
            🏢 发布招聘
          </button>
          <button @click="$router.push('/post/plaza')" class="demo-btn">
            🎯 发布找活信息
          </button>
          <button @click="$router.push('/post/talent')" class="demo-btn">
            📋 完善简历
          </button>
        </div>
      </div>

      <div class="demo-section">
        <h2>⚙️ 用户功能</h2>
        <div class="demo-buttons">
          <button @click="$router.push('/complete-profile')" class="demo-btn">
            👤 完善个人信息
          </button>
          <button @click="$router.push('/agreement')" class="demo-btn">
            📄 用户协议
          </button>
          <button @click="$router.push('/privacy')" class="demo-btn">
            🔒 隐私政策
          </button>
        </div>
      </div>

      <div class="demo-section">
        <h2>🎨 设计特色</h2>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">📱</span>
            <div>
              <strong>移动端优先</strong>
              <p>完美适配手机屏幕，流畅的触摸体验</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎨</span>
            <div>
              <strong>严格遵循设计稿</strong>
              <p>完全按照HTML原型文档的颜色、字体、间距规范</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🚀</span>
            <div>
              <strong>现代化技术栈</strong>
              <p>Vue 3 + Vite + Vant UI，快速响应的用户界面</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💬</span>
            <div>
              <strong>完整交互功能</strong>
              <p>点赞、评论、分享、联系等社交功能</p>
            </div>
          </div>
        </div>
      </div>

      <div class="demo-footer">
        <p>🎯 项目已完成前端核心功能开发</p>
        <p>📋 后端API开发待启动</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 无需额外逻辑，所有导航通过模板中的 $router.push 完成
</script>

<style scoped>
.demo-page {
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--background-color) 100%);
  min-height: 100vh;
  padding: 20px;
}

.demo-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: var(--card-background);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: var(--primary-color);
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 10px;
}

.demo-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 40px;
  font-size: 1em;
}

.demo-section {
  margin-bottom: 35px;
}

.demo-section h2 {
  color: var(--text-primary);
  font-size: 1.3em;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--border-color);
}

.demo-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.demo-btn {
  padding: 15px 20px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background-color: var(--card-background);
  color: var(--text-primary);
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.demo-btn:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(49, 130, 206, 0.15);
}

.demo-btn.primary {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background-color: var(--background-color);
  border-radius: 12px;
  border-left: 4px solid var(--primary-color);
}

.feature-icon {
  font-size: 1.5em;
  flex-shrink: 0;
}

.feature-item strong {
  color: var(--text-primary);
  font-size: 1.1em;
  display: block;
  margin-bottom: 5px;
}

.feature-item p {
  color: var(--text-secondary);
  font-size: 0.9em;
  line-height: 1.5;
  margin: 0;
}

.demo-footer {
  text-align: center;
  padding-top: 30px;
  border-top: 2px solid var(--border-color);
  margin-top: 40px;
}

.demo-footer p {
  color: var(--text-secondary);
  margin: 8px 0;
  font-size: 0.95em;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .demo-container {
    padding: 20px;
    margin: 10px;
  }
  
  .demo-buttons {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 1.6em;
  }
}
</style> 