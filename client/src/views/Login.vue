<template>
  <div class="login-page">
    <div class="login-container">
      <div class="logo-section">
        <img src="/64.jpeg" alt="兰溪招聘" class="logo-image">
      </div>
      <div class="form-group">
        <input 
          type="tel" 
          v-model="formData.phone"
          placeholder="请输入手机号" 
          maxlength="11"
        >
      </div>
      <div class="form-group">
        <input 
          type="password" 
          v-model="formData.password"
          placeholder="请输入密码"
        >
      </div>
      <div class="form-group" v-if="isRegisterMode">
        <input 
          type="password" 
          v-model="formData.confirmPassword"
          placeholder="请再次输入密码"
        >
      </div>
      <button class="btn-login" @click="handleSubmit" :disabled="loading">
        {{ isRegisterMode ? '注册' : '登录' }}
      </button>
      <p class="terms">
        {{ isRegisterMode ? '注册' : '登录/注册' }}即代表您同意<a @click.prevent="$router.push('/agreement')">《用户协议》</a>和<a @click.prevent="$router.push('/privacy')">《隐私政策》</a>
      </p>
      <div class="form-toggle-link" @click="toggleMode">
        {{ isRegisterMode ? '已有账户？立即登录' : '没有账户？立即注册' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { Toast } from 'vant';

const router = useRouter();
const route = useRoute();
const { login, register, loading } = useAuth();

// 表单数据
const formData = ref({
  phone: '',
  password: '',
  confirmPassword: ''
});

// 界面状态
const isRegisterMode = ref(false);

// 切换登录/注册模式
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  formData.value = {
    phone: '',
    password: '',
    confirmPassword: ''
  };
};

// 处理提交
const handleSubmit = async () => {
  const { phone, password, confirmPassword } = formData.value;
  
  if (!phone || phone.length !== 11) {
    Toast.fail({
      message: '⚠️ 请输入有效的11位手机号',
      duration: 2000
    });
    return;
  }
  
  if (!password || password.length < 6) {
    Toast.fail({
      message: '⚠️ 密码至少6位',
      duration: 2000
    });
    return;
  }
  
  if (isRegisterMode.value && password !== confirmPassword) {
    Toast.fail({
      message: '⚠️ 两次密码不一致',
      duration: 2000
    });
    return;
  }
  
  try {
    let result;
    if (isRegisterMode.value) {
      result = await register(phone, password);
      if (result.success) {
        Toast.success({
          message: '🎉 注册成功！',
          duration: 2000
        });
      } else {
        Toast.fail({
          message: `❌ ${result.error || '注册失败'}`,
          duration: 3000
        });
      }
    } else {
      result = await login(phone, password);
      if (result.success) {
        Toast.success({
          message: '🎉 登录成功！',
          duration: 2000
        });
      } else {
        Toast.fail({
          message: `❌ ${result.error || '登录失败'}`,
          duration: 3000
        });
      }
    }
    
    if (result.success) {
      console.log('操作成功，返回数据:', result);
      
      if (isRegisterMode.value) {
        // 注册成功后跳转到完善资料页面
        console.log('注册成功，跳转到完善资料页面');
        setTimeout(() => {
          router.push('/complete-profile');
        }, 1500);
      } else {
        // 登录成功后，检查用户资料完善状态
        console.log('登录成功，检查用户资料状态...');
        const userData = result.data;
        console.log('用户数据:', userData);
        
        let redirectPath = route.query.redirect || '/';
        
        // 检查用户是否完善了资料
        if (userData && userData.profile_completed === false) {
          console.log('用户未完善资料，跳转到完善资料页面');
          redirectPath = '/complete-profile';
        } else {
          console.log('用户已完善资料，跳转到:', redirectPath);
        }
        
        setTimeout(() => {
          console.log('执行跳转到:', redirectPath);
          console.log('当前token:', localStorage.getItem('auth_token'));
          router.push(redirectPath);
        }, 1500);
      }
    }
  } catch (error) {
    Toast.fail({
      message: `❌ ${error.message || '操作失败'}`,
      duration: 3000
    });
  }
};
</script>

<style scoped>
/* 按照index.html设计稿的简洁样式 */
.login-page {
  background-color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 40px 20px;
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f8f9fa;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4A90E2;
}

.btn-login {
  width: 100%;
  padding: 15px;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 10px;
}

.btn-login:active {
  background-color: #357ABD;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.terms {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin: 20px 0;
  line-height: 1.4;
}

.terms a {
  color: #4A90E2;
  text-decoration: none;
}

.form-toggle-link {
  text-align: center;
  color: #4A90E2;
  cursor: pointer;
  font-size: 14px;
}
</style> 