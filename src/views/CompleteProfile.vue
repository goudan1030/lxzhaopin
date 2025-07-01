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
          maxlength="20"
          show-word-limit
          @input="onNicknameInput"
          @blur="validateNickname"
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
const { user, completeProfile, loading, initAuth } = useAuth()

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
]

// 输入防抖定时器
let validateTimer = null

// 实时验证昵称（防抖）
const onNicknameInput = () => {
  // 清除之前的定时器
  if (validateTimer) {
    clearTimeout(validateTimer)
  }
  
  // 设置新的定时器，500ms后执行验证
  validateTimer = setTimeout(() => {
    validateNickname()
  }, 500)
}

// 验证昵称
const validateNickname = () => {
  nicknameError.value = ''
  
  const trimmedNickname = nickname.value.trim()
  
  console.log('验证昵称:', trimmedNickname, '长度:', trimmedNickname.length)
  
  // 检查是否为空
  if (!trimmedNickname) {
    nicknameError.value = '昵称不能为空'
    return false
  }
  
  // 检查长度
  if (trimmedNickname.length < 2) {
    nicknameError.value = '昵称至少需要2个字符'
    return false
  }
  
  if (trimmedNickname.length > 20) {
    nicknameError.value = '昵称不能超过20个字符'
    return false
  }
  
  // 检查特殊字符（只允许中文、英文、数字、下划线、连字符）
  const allowedPattern = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/
  if (!allowedPattern.test(trimmedNickname)) {
    nicknameError.value = '昵称只能包含中文、英文、数字、下划线和连字符'
    return false
  }
  
  // 检查违禁词
  const lowerNickname = trimmedNickname.toLowerCase()
  for (const word of forbiddenWords) {
    if (lowerNickname.includes(word.toLowerCase())) {
      nicknameError.value = `昵称不能包含敏感词汇: ${word}`
      return false
    }
  }
  
  // 检查是否全是数字
  if (/^\d+$/.test(trimmedNickname)) {
    nicknameError.value = '昵称不能全是数字'
    return false
  }
  
  console.log('昵称验证通过')
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
  
  // 验证文件大小 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    Toast.fail('图片大小不能超过10MB')
    return
  }
  
  // 压缩图片并转换为base64
  compressAndConvertImage(file)
}

// 压缩图片并转换为base64格式
const compressAndConvertImage = (file) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  img.onload = () => {
    // 设置压缩后的尺寸（最大300x300）
    const maxSize = 300
    let { width, height } = img
    
    if (width > height) {
      if (width > maxSize) {
        height = (height * maxSize) / width
        width = maxSize
      }
    } else {
      if (height > maxSize) {
        width = (width * maxSize) / height
        height = maxSize
      }
    }
    
    canvas.width = width
    canvas.height = height
    
    // 绘制压缩后的图片
    ctx.drawImage(img, 0, 0, width, height)
    
    // 转换为base64格式（JPEG格式，质量0.8）
    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
    
    console.log('原图大小:', (file.size / 1024).toFixed(2) + 'KB')
    console.log('压缩后大小:', (compressedBase64.length * 0.75 / 1024).toFixed(2) + 'KB')
    
    avatarUrl.value = compressedBase64
    Toast.success('头像已选择并压缩')
  }
  
  img.onerror = () => {
    Toast.fail('图片加载失败')
  }
  
  // 读取文件
  const reader = new FileReader()
  reader.onload = (e) => {
    img.src = e.target.result
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

onMounted(async () => {
  console.log('CompleteProfile页面mounted，当前用户状态:', user.value)
  console.log('当前token:', localStorage.getItem('auth_token'))
  
  // 如果没有token，跳转到登录页
  const token = localStorage.getItem('auth_token')
  if (!token) {
    console.log('没有token，跳转到登录页')
    Toast.fail('请先登录')
    router.push('/login')
    return
  }
  
  // 如果用户状态为空，先初始化
  if (!user.value) {
    console.log('用户状态为空，尝试初始化认证状态')
    try {
      await initAuth()
      console.log('认证状态初始化后，用户状态:', user.value)
    } catch (error) {
      console.error('初始化认证状态失败:', error)
      Toast.fail('获取用户信息失败')
      router.push('/login')
      return
    }
  }
  
  // 再次检查用户是否已登录
  if (!user.value) {
    console.log('初始化后用户状态仍为空，跳转到登录页')
    Toast.fail('请先登录')
    router.push('/login')
    return
  }
  
  console.log('用户状态正常，profile_completed:', user.value.profile_completed)
  
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