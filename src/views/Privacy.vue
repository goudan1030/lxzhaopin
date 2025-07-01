<template>
  <div class="privacy-page text-content-page">
    <main>
      <h2>隐私政策</h2>
      <p>我们非常重视您的隐私。本政策旨在说明我们如何收集、使用、存储和保护您的个人信息。</p>

      <h3>1. 信息收集</h3>
      <p>当您注册和使用我们的服务时，我们会收集您的手机号码、简历信息（如姓名、教育背景、工作经历）等必要的个人信息。</p>

      <h3>2. 信息使用</h3>
      <p>我们收集的信息将用于为您提供招聘服务、优化产品体验、进行客户服务等。我们承诺不会将您的个人信息用于本协议未载明的其他用途，或分享给任何第三方，除非获得您的明确同意或法律法规另有规定。</p>

      <h3>3. 信息存储</h3>
      <p>我们采用行业标准的安全措施来保护您的个人信息，包括数据加密、访问控制等技术手段。您的个人信息将存储在安全的服务器中，只有授权人员才能访问。</p>

      <h3>4. 信息共享</h3>
      <p>除以下情况外，我们不会与第三方共享您的个人信息：</p>
      <p>• 获得您的明确同意</p>
      <p>• 法律法规要求或政府部门要求</p>
      <p>• 为保护我们的合法权益</p>
      <p>• 经过匿名化处理的统计信息</p>

      <h3>5. Cookie 使用</h3>
      <p>我们使用Cookie和类似技术来改善用户体验，包括记住您的登录状态、个性化内容推荐等。您可以通过浏览器设置管理Cookie，但这可能影响某些功能的正常使用。</p>

      <h3>6. 第三方服务</h3>
      <p>我们的服务可能包含第三方链接或集成第三方服务。这些第三方有自己的隐私政策，我们建议您仔细阅读他们的隐私条款。</p>

      <h3>7. 未成年人保护</h3>
      <p>我们不会故意收集18岁以下未成年人的个人信息。如果您是未成年人的监护人，发现我们收集了您孩子的信息，请及时联系我们。</p>

      <h3>8. 您的权利</h3>
      <p>您有权访问、更正、删除您的个人信息，也可以撤回您之前给予的同意。如需行使这些权利，请联系我们的客服。</p>

      <h3>9. 政策更新</h3>
      <p>我们可能会不时更新本隐私政策。重要变更会通过应用内通知、邮件等方式通知您。继续使用我们的服务表示您同意更新后的政策。</p>

      <h3>10. 联系我们</h3>
      <p>如您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：</p>
      <p>邮箱：privacy@lanxizhaopin.com</p>
      <p>电话：400-123-4567</p>
      <p>地址：浙江省金华市兰溪市XX路XX号</p>
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