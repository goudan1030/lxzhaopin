<template>
  <div class="job-list-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="loading && !refreshing" class="loading-container">
        <div class="loading-text">加载中...</div>
      </div>
      <div v-else-if="jobs.length === 0" class="empty-container">
        <div class="empty-text">暂无招聘信息</div>
      </div>
      <div v-else>
        <JobCard v-for="(job, index) in jobs" :key="index" :job="job" :index="index" />
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import JobCard from './JobCard.vue';
import apiService from '../services/apiService';

const jobs = ref([]);
const loading = ref(true);
const refreshing = ref(false);

// 加载招聘数据
const loadJobs = async () => {
  try {
    loading.value = true;
    const response = await apiService.posts.getPublicJobs();
    if (response.success) {
      // 转换数据格式以匹配JobCard组件期望的格式
      jobs.value = response.data.map(job => ({
        id: job.id, // 添加ID字段
        title: job.title,
        company: job.publisher_name || '未知公司', // 使用发布者昵称作为公司名
        location: job.location || '兰溪',
        salary: '面议', // 数据库中暂无薪资字段，显示面议
        tags: Array.isArray(job.skills_required) ? job.skills_required : 
              (job.skills_required ? JSON.parse(job.skills_required) : []),
        recruits: job.recruits_count || '若干',
        benefits: Array.isArray(job.benefits) ? job.benefits : 
                 (job.benefits ? JSON.parse(job.benefits) : []),
        contactPhone: job.contact_phone,
        description: job.description || '',
        requirements: job.requirements ? job.requirements.split('\n').filter(Boolean) : [],
        createdAt: job.created_at
      }));
    }
  } catch (error) {
    console.error('加载招聘数据失败:', error);
    // 如果加载失败，保持空数组，让用户看到空状态
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  await loadJobs();
  refreshing.value = false;
};

onMounted(() => {
  loadJobs();
});
</script>

<style scoped>
.job-list-container {
  background-color: var(--background-color);
  /* Match the padding from the original design's main content area */
  padding: 20px 15px;
  /* Ensure it fills the height below the tabs */
  min-height: calc(100vh - 44px); /* 44px is the default Vant tab height */
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loading-text,
.empty-text {
  color: var(--text-secondary);
  font-size: 1em;
}
</style> 