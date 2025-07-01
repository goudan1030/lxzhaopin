<template>
  <div class="talent-detail-page">
    <!-- Detail Page Content Area -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <main class="detail-content">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-text">加载中...</div>
        </div>
        
        <!-- 内容区域 -->
        <div v-else>
          <!-- The header card inside the detail content -->
          <div class="detail-card-header">
            <div class="title">{{ talent.name || '求职者' }}</div>
            <div class="salary">{{ talent.role || '求职中' }}</div>
            <div class="meta">{{ talent.meta }}</div>
            <div class="tags" v-if="talent.skills && talent.skills.length > 0">
              <span v-for="skill in talent.skills" :key="skill" class="tag">{{ skill }}</span>
            </div>
          </div>

          <!-- Content Sections -->
          <div class="detail-section">
            <h2>工作经历</h2>
            <div v-if="talent.experience" v-html="talent.experience"></div>
            <p v-else>暂无工作经历</p>
          </div>

          <div class="detail-section">
            <h2>教育背景</h2>
            <p>{{ talent.education || '暂无教育背景' }}</p>
          </div>
        </div>
      </main>
    </van-pull-refresh>

    <!-- Sticky Footer with Actions -->
    <footer class="detail-footer">
      <button class="btn-action" @click="collectTalent">收藏</button>
      <button class="btn-action btn-primary" @click="contactTalent">立即沟通</button>
    </footer>

    <!-- Floating Back Button -->
    <button class="floating-back-btn" @click="goBack">&lt;</button>

    <!-- 联系方式弹窗 -->
    <div v-if="showContactModal" class="modal-overlay" @click="closeContactModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">联系方式</h3>
        <div class="modal-body">
          <p class="contact-info">联系电话：{{ talent.contactPhone }}</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-primary" @click="closeContactModal">确定</button>
        </div>
      </div>
    </div>

    <!-- 收藏成功弹窗 -->
    <div v-if="showCollectModal" class="modal-overlay" @click="closeCollectModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">提示</h3>
        <div class="modal-body">
          <p class="contact-info">已收藏该人才</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-primary" @click="closeCollectModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { PullRefresh } from 'vant';
import { apiService } from '../services/index.js';

const route = useRoute();
const router = useRouter();
const { requireAuth } = useAuth();

// 联系方式弹窗控制
const showContactModal = ref(false);
// 收藏弹窗控制
const showCollectModal = ref(false);
// 加载状态
const loading = ref(true);
const refreshing = ref(false);

// 简历信息数据
const talent = ref({
  name: '',
  role: '',
  meta: '',
  age: null,
  contactPhone: '',
  skills: [],
  experience: '',
  education: ''
});

// 加载简历详情
const loadTalentDetail = async () => {
  try {
    loading.value = true;
    const talentId = route.params.id;
    
    // 从列表数据中获取详情
    const response = await apiService.posts.getPublicTalents();
    
    if (response.success && response.data) {
      // 根据索引或ID查找对应的简历信息
      let talentData;
      if (isNaN(talentId)) {
        // 如果是UUID，按ID查找
        talentData = response.data.find(item => item.id === talentId);
      } else {
        // 如果是索引，按索引获取
        talentData = response.data[parseInt(talentId)];
      }
      
      if (talentData) {
        // 转换数据格式
        talent.value = {
          name: talentData.name,
          role: `求职：${talentData.desired_position || '不限'}`,
          meta: `${talentData.age ? talentData.age + '岁' : ''} ${talentData.age ? '·' : ''}`,
          age: talentData.age,
          contactPhone: talentData.contact_phone,
          skills: Array.isArray(talentData.skills) ? talentData.skills : 
                  (talentData.skills ? JSON.parse(talentData.skills) : []),
          experience: talentData.work_experience || '暂无工作经历',
          education: talentData.education_background || '暂无教育背景',
          selfIntroduction: talentData.self_introduction || ''
        };
      } else {
        console.error('简历信息不存在');
        router.back();
      }
    }
  } catch (error) {
    console.error('加载简历详情失败:', error);
    router.back();
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  await loadTalentDetail();
  refreshing.value = false;
};

const goBack = () => {
  router.back();
};

const collectTalent = () => {
  if (!requireAuth()) return;
  showCollectModal.value = true;
};

const contactTalent = () => {
  if (!requireAuth()) return;
  if (talent.value.contactPhone) {
    showContactModal.value = true;
  } else {
    alert('对方暂未提供联系方式。');
  }
};

const closeContactModal = () => {
  showContactModal.value = false;
};

const closeCollectModal = () => {
  showCollectModal.value = false;
};

onMounted(() => {
  loadTalentDetail();
});
</script>

<style scoped>
.talent-detail-page {
  background-color: var(--background-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Detail Page Content Area - 严格按照HTML文档样式 */
.detail-content {
  flex-grow: 1;
  padding: 20px 15px;
  background-color: var(--background-color);
  padding-bottom: 100px; /* 为底部按钮留出空间 */
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1em;
}

/* The header card inside the detail content */
.detail-card-header {
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 20px;
  margin: -5px 0 20px 0; /* Pull up slightly to overlap with padding */
  border: 1px solid var(--border-color);
}

.detail-card-header .title {
  font-size: 1.4em;
  font-weight: 600;
  margin-bottom: 8px;
}

.detail-card-header .salary {
  font-size: 1.2em;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 12px;
}

.detail-card-header .meta {
  font-size: 0.9em;
  color: var(--text-secondary);
}

.detail-card-header .tags {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-card-header .tags .tag {
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-weight: 500;
  font-size: 0.8em;
  padding: 4px 10px;
  border-radius: 20px;
}

/* Content Sections - 严格按照HTML文档样式 */
.detail-section {
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid var(--border-color);
}

.detail-section h2 {
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

.detail-section p,
.detail-section ul {
  font-size: 1em;
  line-height: 1.7;
  color: var(--text-primary);
}

.detail-section ul {
  padding-left: 20px;
}

/* 工作经历中的HTML内容样式 */
.detail-section :deep(h4) {
  font-size: 1em;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: 10px;
  margin-bottom: 8px;
}

.detail-section :deep(p) {
  font-size: 1em;
  line-height: 1.7;
  color: var(--text-primary);
  margin-bottom: 15px;
}

/* Sticky Footer with Actions */
.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: var(--card-background);
  padding: 12px 20px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 15px;
  z-index: 102;
  border-top: 1px solid var(--border-color);
  box-sizing: border-box;
}

/* Floating Back Button - 恢复到原来的悬浮位置 */
.floating-back-btn {
  position: fixed;
  bottom: 95px; /* Position above detail page footer */
  left: 20px;
  width: 45px;
  height: 45px;
  background-color: var(--primary-color);
  opacity: 0.8;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  line-height: 45px;
  text-align: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  /* 覆盖全局button样式 */
  padding: 0;
  font-family: inherit;
  font-weight: normal;
}

.floating-back-btn:focus,
.floating-back-btn:focus-visible {
  outline: none;
}

.btn-action {
  flex-grow: 1;
  padding: 12px;
  font-size: 1em;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid var(--primary-color);
  background-color: var(--primary-light);
  color: var(--primary-color);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn-action:active {
  transform: scale(0.97);
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:active {
  transform: scale(0.97);
}

/* 联系方式弹窗样式 - 严格按照设计稿 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(45, 55, 72, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 0px;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  width: calc(100% - 40px);
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-title {
  font-size: 1.125em;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  padding: 28px 24px 4px 24px;
  margin: 0;
}

.modal-body {
  padding: 16px 24px 24px 24px;
  text-align: center;
}

.contact-info {
  font-size: 1em;
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

.modal-footer {
  padding: 0 24px 28px 24px;
  text-align: center;
}

.modal-btn {
  padding: 14px 0;
  font-size: 1em;
  font-weight: 500;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  width: 100%;
}

.modal-btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.modal-btn:active {
  transform: scale(0.97);
}
</style> 