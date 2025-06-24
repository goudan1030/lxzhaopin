<template>
  <div class="job-list-container">
    <JobCard v-for="(job, index) in jobs" :key="index" :job="job" :index="index" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import JobCard from './JobCard.vue';

const jobs = ref([
  {
      title: '高级前端开发工程师',
      company: '技术有限公司',
      location: '上海',
      salary: '25-45K·14薪',
      tags: ['React', 'TypeScript', 'Node.js', '5-10年'],
      recruits: '5人',
      benefits: ['五险一金', '周末双休', '年终分红', '带薪年假'],
      contactPhone: '13812345678',
      description: '负责核心产品的Web前端架构设计和开发，推动团队技术成长。参与产品需求分析，完成前端开发工作，确保用户体验的优化。',
      requirements: [
        '计算机相关专业本科及以上学历',
        '五年以上前端开发经验',
        '精通React、Vue等至少一种主流框架',
        '熟悉Node.js，有全栈开发经验者优先'
      ]
  },
  {
      title: '产品经理',
      company: '创意无限公司',
      location: '深圳',
      salary: '20-40K',
      tags: ['用户体验', '市场分析', '3-5年'],
      recruits: '若干',
      benefits: ['弹性工作', '定期体检', '零食下午茶'],
      contactPhone: '13987654321',
      description: '负责规划产品发展路线图，深度挖掘用户需求，完成产品设计。与技术团队密切合作，推动产品功能的实现和优化。',
      requirements: [
        '3年以上互联网产品经理经验',
        '熟悉移动端产品设计，有成功案例',
        '具备优秀的数据分析和逻辑思维能力'
      ]
  },
  {
      title: 'Java后端开发',
      company: '数据科技',
      location: '杭州',
      salary: '18-35K',
      tags: ['Java', 'Spring', 'MySQL', '3-5年'],
      recruits: '10人',
      benefits: ['股票期权', '岗位晋升', '免费班车'],
      contactPhone: '13766667777',
      description: '负责核心业务系统的后端开发，参与系统架构设计和技术选型。优化系统性能，确保高并发场景下的稳定性。',
      requirements: [
        'Java开发3年以上经验',
        '熟练掌握Spring、SpringBoot框架',
        '有大型分布式系统开发经验',
        '熟悉MySQL、Redis等数据存储技术'
      ]
  },
]);
</script>

<style scoped>
.job-list-container {
  background-color: var(--background-color);
  /* Match the padding from the original design's main content area */
  padding: 20px 15px;
  /* Ensure it fills the height below the tabs */
  min-height: calc(100vh - 44px); /* 44px is the default Vant tab height */
}
</style> 