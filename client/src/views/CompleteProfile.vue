<template>
  <div class="complete-profile-page">
    <div class="profile-form-container">
      <div class="avatar-uploader">
        <div class="avatar-placeholder" @click="uploadAvatar">头像</div>
        <p>点击设置头像</p>
      </div>
      
      <div class="form-group">
        <label for="profile-name">昵称</label>
        <input 
          type="text" 
          id="profile-name" 
          v-model="profileName" 
          placeholder="请输入你的昵称"
          class="form-input"
        >
      </div>
      
      <button @click="saveProfile" class="btn-submit">完成，进入应用</button>
    </div>
    
    <!-- Floating back button -->
    <button class="floating-back-btn" @click="goBack">&lt;</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const profileName = ref('');

const uploadAvatar = () => {
  // 模拟头像上传功能
  alert('头像上传功能暂未开放');
};

const saveProfile = () => {
  if (!profileName.value.trim()) {
    alert('请填写昵称');
    return;
  }
  
  // 模拟保存个人信息
  console.log('Profile Saved:', { name: profileName.value });
  alert('信息完善成功！');
  
  // 跳转到主页
  router.push('/');
};

const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* 严格按照HTML文档样式 */
.complete-profile-page {
  background-color: var(--card-background);
  min-height: 100vh;
  position: relative;
}

.profile-form-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
}

.avatar-uploader {
  margin-bottom: 30px;
  text-align: center;
}

.avatar-placeholder {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  margin: 0 auto 10px;
  cursor: pointer;
  border: 2px dashed var(--primary-color);
}

.avatar-uploader p {
  font-size: 0.9em;
  color: var(--text-secondary);
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  font-size: 1em;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
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
  background-color: #2B6CB0; /* Darker blue */
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
}
</style> 