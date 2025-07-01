<template>
  <div class="home-container">
    <van-tabs v-model:active="activeTab" sticky color="#3182CE">
      <van-tab title="招聘信息">
        <JobList />
      </van-tab>
      <van-tab title="找活广场">
        <PlazaList />
      </van-tab>
      <van-tab title="求职人才">
        <TalentList />
      </van-tab>
    </van-tabs>

    <!-- FAB按钮 - 严格按照HTML文档样式 -->
    <button class="fab" @click="showPostOptions">+</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import JobList from '../components/JobList.vue';
import PlazaList from '../components/PlazaList.vue';
import TalentList from '../components/TalentList.vue';

const router = useRouter();
const route = useRoute();

const activeTab = ref(0);

// 监听URL参数，切换到指定Tab
onMounted(() => {
  const tabParam = route.query.tab;
  if (tabParam !== undefined) {
    const tabIndex = parseInt(tabParam);
    if (tabIndex >= 0 && tabIndex <= 2) {
      activeTab.value = tabIndex;
    }
  }
});

const showPostOptions = () => {
  // 跳转到发布页面，带上当前Tab信息
  router.push({
    path: '/post',
    query: { fromTab: activeTab.value }
  });
};
</script>

<style scoped>
.home-container {
  /* 确保使用HTML文档中定义的背景色 */
  background-color: var(--background-color);
  min-height: 100vh;
}

/* FAB样式严格按照HTML文档 */
.fab {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 55px;
  height: 55px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  border: none;
  font-size: 36px;
  line-height: 55px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  cursor: pointer;
  z-index: 1001;
  display: flex; /* 使用flex布局确保居中 */
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  /* 覆盖全局button样式 */
  padding: 0;
  font-family: inherit;
  font-weight: normal;
}

.fab:active {
  transform: scale(0.9);
}

.fab:focus,
.fab:focus-visible {
  outline: none; /* 移除焦点轮廓 */
}



</style> 