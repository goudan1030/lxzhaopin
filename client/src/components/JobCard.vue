<template>
  <div class="card" @click="goToDetail">
    <div class="card-header">
      <div class="card-title">{{ job.title }}</div>
      <div class="card-salary">{{ job.salary }}</div>
    </div>
    <div class="card-company">{{ job.company }} · {{ job.location }}</div>
    <div class="card-tags">
      <span v-for="tag in job.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>
    <div v-if="job.benefits && job.benefits.length > 0" class="card-benefits">
      <span v-for="benefit in job.benefits" :key="benefit" class="tag">{{ benefit }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  job: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
});

const goToDetail = () => {
  // 优先使用job的ID，如果没有则使用索引
  const identifier = props.job.id || props.index;
  router.push(`/job/${identifier}`);
};
</script>

<style scoped>
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
.card-company {
    font-size: 0.9em;
    color: var(--text-secondary);
    margin-bottom: 15px;
}
.card-tags, .card-benefits {
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
.card-benefits {
    margin-top: 10px;
}
.card-benefits .tag {
    background-color: #E6FFFA; /* A light teal */
    color: #2C7A7B; /* A dark teal */
    font-weight: 500;
    font-size: 0.8em;
    padding: 4px 10px;
    border-radius: 20px;
}
</style> 