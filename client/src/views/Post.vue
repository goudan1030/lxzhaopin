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
            <label>详细说明</label>
            <textarea v-model="plazaForm.text" placeholder="介绍下你的技能、经验和想找什么样的活..." class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>标签 (逗号分隔)</label>
            <input type="text" v-model="plazaForm.tags" placeholder="如：电工,10年经验" class="form-input">
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

const router = useRouter();
const route = useRoute();
const { requireAuth } = useAuth();

const showTypeModal = ref(false);
const currentPostType = ref('');

// Form data
const jobForm = ref({
  title: '',
  company: '',
  salary: '',
  recruits: '',
  phone: '',
  tags: '',
  benefits: '',
  description: ''
});

const plazaForm = ref({
  text: '',
  tags: '',
  phone: ''
});

const talentForm = ref({
  name: '我',
  phone: '',
  age: '',
  role: '',
  meta: '',
  skills: '',
  experience: '',
  education: ''
});

const selectPostType = (type) => {
  currentPostType.value = type;
  showTypeModal.value = false;
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

const submitJobPost = () => {
  if (!jobForm.value.phone || jobForm.value.phone.length !== 11) {
    alert('请输入有效的11位手机号码。');
    return;
  }
  
  // 模拟提交成功
  alert('招聘信息发布成功！');
  // 返回到来源Tab
  const fromTab = route.query.fromTab;
  if (fromTab !== undefined) {
    router.push({ path: '/', query: { tab: fromTab } });
  } else {
    router.push('/');
  }
};

const submitPlazaPost = () => {
  if (!plazaForm.value.phone || plazaForm.value.phone.length !== 11) {
    alert('请输入有效的11位手机号码。');
    return;
  }
  
  // 模拟提交成功
  alert('找活信息发布成功！');
  // 返回到来源Tab
  const fromTab = route.query.fromTab;
  if (fromTab !== undefined) {
    router.push({ path: '/', query: { tab: fromTab } });
  } else {
    router.push('/');
  }
};

const submitTalentProfile = () => {
  if (!talentForm.value.phone || talentForm.value.phone.length !== 11) {
    alert('请输入有效的11位手机号码。');
    return;
  }
  
  // 模拟提交成功
  alert('简历保存成功！');
  // 返回到来源Tab
  const fromTab = route.query.fromTab;
  if (fromTab !== undefined) {
    router.push({ path: '/', query: { tab: fromTab } });
  } else {
    router.push('/');
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

onMounted(() => {
  // 检查登录状态
  if (!requireAuth()) return;
  
  // Check if coming from FAB click or direct access
  const postType = route.params.type;
  if (postType) {
    currentPostType.value = postType;
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