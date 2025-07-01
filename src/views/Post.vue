<template>
  <div class="post-page">
    <!-- Modal for post type selection -->
    <van-popup v-model:show="showTypeModal" position="bottom" style="border-radius: 16px 16px 0 0;">
      <div class="action-sheet">
        <button @click="selectPostType('job')">发布招聘</button>
        <button @click="selectPostType('plaza')">发布找活信息</button>
        <button @click="selectPostType('talent')">完善我的简历</button>
        <button class="cancel" @click="cancelPost">取消</button>
      </div>
    </van-popup>

    <!-- Post form content -->
    <main v-if="currentPostType" class="detail-content">
      <div class="post-form-container">
        <!-- Job posting form -->
        <div v-if="currentPostType === 'job'" class="form-content">
          <h2 class="form-title">发布新招聘</h2>
          <div class="form-group">
            <label>职位名称</label>
            <input type="text" v-model="jobForm.title" placeholder="如：前端工程师" class="form-input">
          </div>
          <div class="form-group">
            <label>公司名称</label>
            <input type="text" v-model="jobForm.company" placeholder="如：技术有限公司" class="form-input">
          </div>
          <div class="form-group">
            <label>薪资范围</label>
            <input type="text" v-model="jobForm.salary" placeholder="如：25-45K·14薪" class="form-input">
          </div>
          <div class="form-group">
            <label>招聘人数</label>
            <input type="text" v-model="jobForm.recruits" placeholder="如：5人 或 若干" class="form-input">
          </div>
          <div class="form-group">
            <label>联系电话</label>
            <input type="tel" v-model="jobForm.phone" placeholder="请输入你的手机号" maxlength="11" class="form-input">
          </div>
          <div class="form-group">
            <label>技能要求 (逗号分隔)</label>
            <input type="text" v-model="jobForm.tags" placeholder="如：React,TypeScript,Node.js" class="form-input">
          </div>
          <div class="form-group">
            <label>福利待遇 (逗号分隔)</label>
            <input type="text" v-model="jobForm.benefits" placeholder="如：五险一金,带薪年假" class="form-input">
          </div>
          <div class="form-group">
            <label>职位描述</label>
            <textarea v-model="jobForm.description" placeholder="详细描述工作职责..." class="form-textarea"></textarea>
          </div>
          <button @click="submitJobPost" class="btn-submit">立即发布</button>
        </div>

        <!-- Plaza posting form -->
        <div v-if="currentPostType === 'plaza'" class="form-content">
          <h2 class="form-title">发布找活信息</h2>
          <div class="form-group">
            <label>发布类型</label>
            <div class="category-selection">
              <div 
                class="category-option" 
                :class="{ active: plazaForm.category === 'finding_job' }"
                @click="plazaForm.category = 'finding_job'"
              >
                <span class="category-icon">👨‍💼</span>
                <span class="category-text">我要找活</span>
              </div>
              <div 
                class="category-option"
                :class="{ active: plazaForm.category === 'recruiting' }"
                @click="plazaForm.category = 'recruiting'"
              >
                <span class="category-icon">💼</span>
                <span class="category-text">我要招人</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>详细说明</label>
            <textarea 
              v-model="plazaForm.text" 
              :placeholder="plazaForm.category === 'recruiting' ? '介绍你的招聘需求、工作内容和要求...' : '介绍下你的技能、经验和想找什么样的活...'" 
              class="form-textarea"
            ></textarea>
          </div>
          <div class="form-group">
            <label>标签 (逗号分隔)</label>
            <input 
              type="text" 
              v-model="plazaForm.tags" 
              :placeholder="plazaForm.category === 'recruiting' ? '如：销售,有经验优先' : '如：电工,10年经验'" 
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label>联系电话</label>
            <input type="tel" v-model="plazaForm.phone" placeholder="请输入你的手机号" maxlength="11" class="form-input">
          </div>
          <button @click="submitPlazaPost" class="btn-submit">立即发布</button>
        </div>

        <!-- Talent profile form -->
        <div v-if="currentPostType === 'talent'" class="form-content">
          <h2 class="form-title">完善我的简历</h2>
          <div class="form-group">
            <label>姓名</label>
            <input type="text" v-model="talentForm.name" placeholder="你的姓名" class="form-input">
          </div>
          <div class="form-group">
            <label>联系电话</label>
            <input type="tel" v-model="talentForm.phone" placeholder="请输入你的手机号" maxlength="11" class="form-input">
          </div>
          <div class="form-group">
            <label>年龄</label>
            <input type="number" v-model="talentForm.age" placeholder="你的年龄" class="form-input">
          </div>
          <div class="form-group">
            <label>期望职位</label>
            <input type="text" v-model="talentForm.role" placeholder="如：全栈工程师" class="form-input">
          </div>
          <div class="form-group">
            <label>个人简介</label>
            <input type="text" v-model="talentForm.meta" placeholder="如：5年经验 · 本科" class="form-input">
          </div>
          <div class="form-group">
            <label>技能标签 (逗号分隔)</label>
            <input type="text" v-model="talentForm.skills" placeholder="如：Vue,Node.js,MySQL" class="form-input">
          </div>
          <div class="form-group">
            <label>工作经历</label>
            <textarea v-model="talentForm.experience" placeholder="介绍你的工作项目和职责..." class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>教育背景</label>
            <textarea v-model="talentForm.education" placeholder="你的学校和专业..." class="form-textarea"></textarea>
          </div>
          <button @click="submitTalentProfile" class="btn-submit">保存简历</button>
        </div>
      </div>
    </main>

    <!-- Floating back button -->
    <button class="floating-back-btn" @click="goBack">&lt;</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useLocalStorage } from '../composables/useLocalStorage';
import { Toast } from 'vant';
import { apiService } from '../services/index.js';

const router = useRouter();
const route = useRoute();
const { createPersistentForm } = useLocalStorage();

const showTypeModal = ref(false);
const currentPostType = ref('');

// 持久化表单数据 - 自动保存和恢复
const { formData: jobForm, clearForm: clearJobForm } = createPersistentForm('job_form', {
  title: '',
  company: '',
  salary: '',
  recruits: '',
  phone: '',
  tags: '',
  benefits: '',
  description: ''
});

const { formData: plazaForm, clearForm: clearPlazaForm } = createPersistentForm('plaza_form', {
  category: 'finding_job',
  text: '',
  tags: '',
  phone: ''
});

const { formData: talentForm, clearForm: clearTalentForm } = createPersistentForm('talent_form', {
  name: '',
  phone: '',
  age: '',
  role: '',
  meta: '',
  skills: '',
  experience: '',
  education: ''
});

const selectPostType = async (type) => {
  currentPostType.value = type;
  showTypeModal.value = false;
  
  // 如果选择的是简历类型，加载已有的简历数据
  if (type === 'talent') {
    await loadTalentData();
  }
};

const cancelPost = () => {
  showTypeModal.value = false;
  // 返回到来源Tab
  const fromTab = route.query.fromTab;
  if (fromTab !== undefined) {
    router.push({ path: '/', query: { tab: fromTab } });
  } else {
    router.push('/');
  }
};

const submitJobPost = async () => {
  // 基础验证
  if (!jobForm.value.title.trim()) {
    Toast.fail({ message: '⚠️ 请输入职位名称', duration: 2000 });
    return;
  }
  if (!jobForm.value.company.trim()) {
    Toast.fail({ message: '⚠️ 请输入公司名称', duration: 2000 });
    return;
  }
  if (!jobForm.value.salary.trim()) {
    Toast.fail({ message: '⚠️ 请输入薪资范围', duration: 2000 });
    return;
  }
  if (!jobForm.value.phone || jobForm.value.phone.length !== 11) {
    Toast.fail({ message: '⚠️ 请输入有效的11位手机号码', duration: 2000 });
    return;
  }
  if (!jobForm.value.description.trim()) {
    Toast.fail({ message: '⚠️ 请输入职位描述', duration: 2000 });
    return;
  }

  try {
    Toast.loading({ message: '发布中...', forbidClick: true });
    
    const response = await apiService.posts.createJob(jobForm.value);
    
    if (response.success) {
      Toast.success({ message: '🎉 招聘信息发布成功！', duration: 2000 });
      
      // 清除表单数据
      clearJobForm();
      
      // 返回到来源Tab
      setTimeout(() => {
        const fromTab = route.query.fromTab;
        if (fromTab !== undefined) {
          router.push({ path: '/', query: { tab: fromTab } });
        } else {
          router.push('/');
        }
      }, 1500);
    }
  } catch (error) {
    Toast.fail({ message: `❌ ${error.message || '发布失败'}`, duration: 3000 });
  }
};

const submitPlazaPost = async () => {
  // 基础验证
  if (!plazaForm.value.category) {
    Toast.fail({ message: '⚠️ 请选择发布类型', duration: 2000 });
    return;
  }
  if (!plazaForm.value.text.trim()) {
    Toast.fail({ message: '⚠️ 请输入详细说明', duration: 2000 });
    return;
  }
  if (!plazaForm.value.phone || plazaForm.value.phone.length !== 11) {
    Toast.fail({ message: '⚠️ 请输入有效的11位手机号码', duration: 2000 });
    return;
  }

  try {
    Toast.loading({ message: '发布中...', forbidClick: true });
    
    const response = await apiService.posts.createPlaza(plazaForm.value);
    
    if (response.success) {
      const categoryText = plazaForm.value.category === 'recruiting' ? '招聘' : '找活';
      Toast.success({ message: `🎉 ${categoryText}信息发布成功！`, duration: 2000 });
      
      // 清除表单数据
      clearPlazaForm();
      
      // 返回到来源Tab
      setTimeout(() => {
        const fromTab = route.query.fromTab;
        if (fromTab !== undefined) {
          router.push({ path: '/', query: { tab: fromTab } });
        } else {
          router.push('/');
        }
      }, 1500);
    }
  } catch (error) {
    Toast.fail({ message: `❌ ${error.message || '发布失败'}`, duration: 3000 });
  }
};

const submitTalentProfile = async () => {
  // 基础验证
  if (!talentForm.value.name.trim()) {
    Toast.fail({ message: '⚠️ 请输入姓名', duration: 2000 });
    return;
  }
  if (!talentForm.value.phone || talentForm.value.phone.length !== 11) {
    Toast.fail({ message: '⚠️ 请输入有效的11位手机号码', duration: 2000 });
    return;
  }
  if (!talentForm.value.role.trim()) {
    Toast.fail({ message: '⚠️ 请输入期望职位', duration: 2000 });
    return;
  }

  try {
    Toast.loading({ message: '保存中...', forbidClick: true });
    
    const response = await apiService.posts.createOrUpdateTalent(talentForm.value);
    
    if (response.success) {
      Toast.success({ message: '🎉 简历保存成功！', duration: 2000 });
      
      // 简历保存成功后不清除表单数据，保持当前编辑状态
      // clearTalentForm(); // 注释掉清除操作
      
      // 返回到来源Tab
      setTimeout(() => {
        const fromTab = route.query.fromTab;
        if (fromTab !== undefined) {
          router.push({ path: '/', query: { tab: fromTab } });
        } else {
          router.push('/');
        }
      }, 1500);
    }
  } catch (error) {
    Toast.fail({ message: `❌ ${error.message || '保存失败'}`, duration: 3000 });
  }
};

const goBack = () => {
  if (currentPostType.value) {
    currentPostType.value = '';
    showTypeModal.value = true;
  } else {
    // 返回到来源Tab
    const fromTab = route.query.fromTab;
    if (fromTab !== undefined) {
      router.push({ path: '/', query: { tab: fromTab } });
    } else {
      router.push('/');
    }
  }
};

// 加载简历数据
const loadTalentData = async () => {
  try {
    const response = await apiService.posts.getMyPosts();
    if (response.success && response.data.talents && response.data.talents.length > 0) {
      const talent = response.data.talents[0]; // 获取最新的简历
      
      // 回显简历数据到表单
      talentForm.value.name = talent.name || '';
      talentForm.value.phone = talent.contact_phone || '';
      talentForm.value.age = talent.age || '';
      talentForm.value.role = talent.desired_position || '';
      talentForm.value.meta = talent.self_introduction || '';
      talentForm.value.skills = Array.isArray(talent.skills) ? talent.skills.join(', ') : (talent.skills || '');
      talentForm.value.experience = talent.work_experience || '';
      talentForm.value.education = talent.education_background || '';
      
      console.log('简历数据回显成功');
    }
  } catch (error) {
    console.error('加载简历数据失败:', error);
    // 如果加载失败，不影响用户操作，继续使用本地存储的数据
  }
};

onMounted(async () => {
  // 路由守卫已经处理了认证，这里直接处理页面逻辑
  
  // Check if coming from FAB click or direct access
  const postType = route.params.type;
  if (postType) {
    currentPostType.value = postType;
    
    // 如果是简历页面，加载已有的简历数据
    if (postType === 'talent') {
      await loadTalentData();
    }
  } else {
    showTypeModal.value = true;
  }
});
</script>

<style scoped>
.post-page {
  background-color: var(--card-background);
  min-height: 100vh;
  position: relative;
}

.detail-content {
  padding: 20px 15px;
  background-color: var(--background-color);
  min-height: 100vh;
}

.post-form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.form-content {
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.form-title {
  font-size: 1.3em;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 15px;
  font-size: 1em;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.form-textarea {
  height: 120px;
  resize: vertical;
}

.category-selection {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.category-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--background-color);
}

.category-option:active {
  transform: scale(0.98);
}

.category-option.active {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
}

.category-icon {
  font-size: 1.8em;
  margin-bottom: 8px;
}

.category-text {
  font-size: 0.9em;
  font-weight: 500;
  color: var(--text-secondary);
}

.category-option.active .category-text {
  color: var(--primary-color);
  font-weight: 600;
}

.btn-submit {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  background-color: var(--primary-color);
  color: white;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn-submit:active {
  transform: scale(0.98);
  background-color: #2B6CB0;
}

/* Action Sheet Modal */
.action-sheet {
  width: 100%;
  background: var(--background-color);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 10px;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
}

.action-sheet button {
  display: block;
  width: 100%;
  padding: 16px;
  background: var(--card-background);
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
  margin-bottom: 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-weight: 500;
}

.action-sheet button.cancel {
  margin-top: 10px;
  margin-bottom: 0;
  color: var(--danger-color);
  font-weight: 600;
}

.action-sheet button:active {
  background-color: #EDF2F7;
}

/* Floating Back Button */
.floating-back-btn {
  position: fixed;
  bottom: 25px;
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
</style> 