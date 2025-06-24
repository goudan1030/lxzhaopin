<template>
  <div class="complete-profile-page">
    <van-nav-bar 
      title="完善资料" 
      left-arrow 
      @click-left="goBack"
      fixed
      placeholder
    />
    
    <div class="profile-form-container">
      <!-- 头像上传区域 -->
      <div class="avatar-section">
        <div class="avatar-uploader" @click="handleAvatarUpload">
          <div v-if="avatarUrl" class="avatar-preview">
            <img :src="avatarUrl" alt="头像" />
          </div>
          <div v-else class="avatar-placeholder">
            <van-icon name="photo" size="30" />
            <p>设置头像</p>
          </div>
        </div>
        <p class="avatar-tip">点击设置个人头像</p>
      </div>
      
      <!-- 昵称输入 -->
      <div class="form-section">
        <van-field
          v-model="nickname"
          label="昵称"
          placeholder="请输入你的昵称"
          required
          :error-message="nicknameError"
          @input="validateNickname"
        />
      </div>
      
      <!-- 提交按钮 -->
      <div class="submit-section">
        <van-button 
          type="primary" 
          size="large" 
          :loading="loading"
          @click="handleSubmit"
          class="submit-btn"
        >
          完成，进入应用
        </van-button>
      </div>
    </div>
    
    <!-- 头像上传弹窗 -->
    <van-action-sheet 
      v-model:show="showAvatarSheet" 
      :actions="avatarActions" 
      cancel-text="取消"
      @select="onAvatarAction"
    />
    
    <!-- 文件上传 -->
    <input 
      ref="fileInput" 
      type="file" 
      accept="image/*" 
      style="display: none" 
      @change="handleFileSelect" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { user, completeProfile, loading } = useAuth()

// 表单数据
const nickname = ref('')
const avatarUrl = ref('')
const nicknameError = ref('')

// 头像上传相关
const showAvatarSheet = ref(false)
const fileInput = ref(null)

const avatarActions = [
  { name: '拍照', value: 'camera' },
  { name: '从相册选择', value: 'album' },
  { name: '使用默认头像', value: 'default' }
]

// 验证昵称
const validateNickname = () => {
  nicknameError.value = ''
  if (!nickname.value.trim()) {
    nicknameError.value = '昵称不能为空'
    return false
  }
  if (nickname.value.length > 50) {
    nicknameError.value = '昵称不能超过50个字符'
    return false
  }
  return true
}

// 头像上传
const handleAvatarUpload = () => {
  showAvatarSheet.value = true
}

const onAvatarAction = (action) => {
  showAvatarSheet.value = false
  
  switch (action.value) {
    case 'camera':
    case 'album':
      fileInput.value?.click()
      break
    case 'default':
      avatarUrl.value = '/64.jpeg' // 使用项目中的默认头像
      Toast.success('已设置默认头像')
      break
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    Toast.fail('请选择图片文件')
    return
  }
  
  // 验证文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    Toast.fail('图片大小不能超过5MB')
    return
  }
  
  // 创建预览
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarUrl.value = e.target.result
    Toast.success('头像已选择')
  }
  reader.readAsDataURL(file)
}

// 提交表单
const handleSubmit = async () => {
  if (!validateNickname()) {
    return
  }
  
  try {
    const profileData = {
      nickname: nickname.value.trim()
    }
    
    if (avatarUrl.value) {
      profileData.avatar_url = avatarUrl.value
    }
    
    const result = await completeProfile(profileData)
    
    if (result.success) {
      Toast.success({
        message: '🎉 资料完善成功！',
        duration: 2000
      })
      
      console.log('资料完善成功，用户数据:', result.data)
      
      // 延迟跳转到主页
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } else {
      Toast.fail({
        message: `❌ ${result.error}`,
        duration: 3000
      })
    }
  } catch (error) {
    Toast.fail({
      message: `❌ ${error.message || '完善资料失败'}`,
      duration: 3000
    })
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  // 检查用户是否已登录
  if (!user.value) {
    Toast.fail('请先登录')
    router.push('/login')
    return
  }
  
  // 如果已经完善过资料，可以选择跳转，但允许修改
  if (user.value.profile_completed) {
    Toast('您已完善过资料，可以修改')
    // 预填充现有数据
    if (user.value.nickname) {
      nickname.value = user.value.nickname
    }
    if (user.value.avatar_url) {
      avatarUrl.value = user.value.avatar_url
    }
  }
})
</script>

<style scoped>
.complete-profile-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.profile-form-container {
  padding: 20px;
  padding-top: 20px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
}

.avatar-uploader {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
  cursor: pointer;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f0f0f0;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #f7f8fa;
  border: 2px dashed #dcdee0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #969799;
  transition: all 0.3s;
}

.avatar-placeholder:hover {
  border-color: #1989fa;
  color: #1989fa;
  background-color: #f2f3ff;
}

.avatar-placeholder p {
  margin-top: 5px;
  font-size: 12px;
}

.avatar-tip {
  color: #969799;
  font-size: 14px;
  margin: 0;
}

.form-section {
  margin-bottom: 30px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.submit-section {
  margin-top: 40px;
}

.submit-btn {
  width: 100%;
  height: 50px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
}

/* Vant组件样式覆盖 */
:deep(.van-field__label) {
  font-weight: 500;
  color: #323233;
}

:deep(.van-field__control) {
  font-size: 16px;
}

:deep(.van-nav-bar) {
  background-color: white;
  border-bottom: 1px solid #ebedf0;
}

:deep(.van-nav-bar__title) {
  font-weight: 600;
  color: #323233;
}
</style> 