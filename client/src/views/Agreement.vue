<template>
  <div class="agreement-page text-content-page">
    <main>
      <h2>用户协议</h2>
      <p>更新日期：2023年10月27日</p>
      
      <h3>1. 总则</h3>
      <p>欢迎使用兰溪招聘！为了保障您的权益，请在使用本平台服务前，详细阅读并理解本协议的所有内容。一旦您开始使用本平台，即表示您已同意并接受本协议的所有条款。</p>

      <h3>2. 服务内容</h3>
      <p>本平台为招聘方和求职者提供信息发布与交流服务。招聘方可以发布职位信息，求职者可以创建简历并申请职位。</p>

      <h3>3. 用户行为规范</h3>
      <p>用户不得发布任何虚假、违法、歧视性或侵犯第三方权益的信息。所有用户均需对其发布内容的真实性、合法性负责。</p>

      <h3>4. 隐私保护</h3>
      <p>我们承诺保护用户隐私，严格按照《隐私政策》中的条款处理用户个人信息。未经用户同意，不会向第三方泄露用户个人信息。</p>

      <h3>5. 知识产权</h3>
      <p>本平台的所有内容，包括但不限于文字、图片、音频、视频、软件等，均受知识产权法保护。用户在使用过程中应尊重他人的知识产权。</p>

      <h3>6. 免责声明</h3>
      <p>本平台仅提供信息发布和交流的服务，对于用户发布的信息真实性、准确性不承担责任。用户在平台上的所有交易和交流行为，风险由用户自行承担。</p>

      <h3>7. 协议变更</h3>
      <p>我们保留随时修改本协议的权利。协议变更后，将在平台显著位置公布。继续使用本平台服务视为同意变更后的协议。</p>

      <h3>8. 争议解决</h3>
      <p>因使用本平台服务产生的争议，应首先通过友好协商解决。协商不成的，可提交至平台所在地人民法院诉讼解决。</p>

      <h3>9. 联系我们</h3>
      <p>如您对本协议有任何疑问，请通过以下方式联系我们：</p>
      <p>邮箱：service@lanxizhaopin.com</p>
      <p>电话：400-123-4567</p>
    </main>
    
    <!-- Floating back button -->
    <button class="floating-back-btn" @click="goBack">&lt;</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* 严格按照HTML文档样式 */
.text-content-page {
  background-color: var(--background-color);
  min-height: 100vh;
  position: relative;
}

.text-content-page main {
  background-color: var(--card-background);
  padding: 20px;
  min-height: 100vh;
}

.text-content-page h2 {
  font-size: 1.3em;
  margin-bottom: 20px;
  color: var(--text-primary);
  font-weight: 600;
}

.text-content-page h3 {
  font-size: 1.1em;
  margin-top: 25px;
  margin-bottom: 10px;
  color: var(--text-primary);
  font-weight: 600;
}

.text-content-page p {
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 15px;
  font-size: 1em;
}

/* Floating Back Button */
.floating-back-btn {
  position: fixed;
  bottom: 25px;
  left: 20px;
  width: 45px;
  height: 45px;
  background-color: #3182CE;
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
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 