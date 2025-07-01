<template>
  <div class="talent-list-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div v-if="loading && !refreshing" class="loading-container">
        <div class="loading-text">加载中...</div>
      </div>
      <div v-else-if="talents.length === 0" class="empty-container">
        <div class="empty-text">暂无求职信息</div>
      </div>
      <div v-else>
        <div class="card" v-for="(talent, index) in talents" :key="index" @click="viewTalentDetail(index)">
      <div class="card-header">
        <div class="card-title">{{ talent.name }}</div>
        <div class="card-salary">{{ talent.role }}</div>
      </div>
      <div class="card-meta">{{ talent.meta }}</div>
      <div class="card-tags">
        <span v-for="skill in talent.skills" :key="skill" class="tag">{{ skill }}</span>
      </div>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiService } from '../services/index.js';

const router = useRouter();

const talents = ref([]);
const loading = ref(true);
const refreshing = ref(false);

// 加载求职简历数据
const loadTalents = async () => {
  try {
    loading.value = true;
    const response = await apiService.posts.getPublicTalents();
    if (response.success) {
      // 转换数据格式以匹配组件期望的格式
      talents.value = response.data.map((talent, index) => ({
        id: talent.id,
        name: talent.name,
        role: `求职：${talent.desired_position || '不限'}`,
        meta: `${talent.age ? talent.age + '岁' : ''} ${talent.age ? '·' : ''}`,
        age: talent.age,
        contactPhone: talent.contact_phone,
        skills: Array.isArray(talent.skills) ? talent.skills : 
                (talent.skills ? JSON.parse(talent.skills) : []),
        experience: talent.work_experience || '',
        education: talent.education_background || '',
        selfIntroduction: talent.self_introduction || '',
        createdAt: talent.created_at,
        // 为兼容详情页面，添加index
        index: index
      }));
    }
  } catch (error) {
    console.error('加载求职数据失败:', error);
    // 如果加载失败，保持空数组
  } finally {
    loading.value = false;
  }
};

const viewTalentDetail = (index) => {
  // 获取对应的人才信息
  const talent = talents.value[index];
  // 优先使用ID，如果没有则使用索引
  const identifier = talent.id || index;
  router.push(`/talent/${identifier}`);
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  await loadTalents();
  refreshing.value = false;
};

onMounted(() => {
  loadTalents();
});
</script>

<style scoped>
.talent-list-container {
  background-color: var(--background-color);
  padding: 20px 15px;
  min-height: calc(100vh - 44px);
}

/* Card Base Style - 严格按照HTML文档样式 */
.card {
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s, transform 0.2s;
  cursor: pointer;
}

.card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

/* Job/Talent Card Specifics - 严格按照HTML文档样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.1em;
  font-weight: 600;
  color: var(--text-primary);
}

.card-salary {
  font-size: 1.1em;
  font-weight: 600;
  color: var(--accent-color);
  flex-shrink: 0;
  margin-left: 10px;
}

.card-meta {
  font-size: 0.9em;
  color: var(--text-secondary);
  margin-bottom: 15px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.card-tags .tag {
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-weight: 500;
  font-size: 0.8em;
  padding: 4px 10px;
  border-radius: 20px;
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