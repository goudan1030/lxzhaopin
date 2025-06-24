<template>
  <div class="talent-list-container">
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
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const talents = ref([
  {
    name: '张三',
    role: '求职：全栈工程师',
    meta: '5年经验 · 本科',
    age: 28,
    contactPhone: '18611112222',
    skills: ['Vue.js', 'Django', 'MySQL', 'AWS'],
    experience: '<h4>项目A (2020-至今)</h4><p>担任后端开发，使用Django和MySQL构建了一个电商后台管理系统，负责用户模块、订单模块的设计与开发。在项目中，我主导了数据库架构设计，优化了查询性能，使系统响应时间提升了40%。</p><h4>项目B (2018-2020)</h4><p>作为前端开发，参与了公司内部CRM系统的开发，使用Vue.js构建了用户界面，实现了复杂的数据可视化功能。</p>',
    education: '毕业于XX大学计算机科学与技术专业，学士学位。在校期间多次获得奖学金，参与了多个实习项目。'
  },
  {
    name: '李四',
    role: '求职：项目经理',
    meta: '8年经验 · 硕士',
    age: 32,
    contactPhone: '18533334444',
    skills: ['敏捷开发', 'PMP', '团队管理', 'JIRA'],
    experience: '<h4>项目B (2018-2020)</h4><p>作为项目经理，带领20人团队，负责某金融App的全周期管理。在项目中成功协调各部门合作，按时交付了项目，获得了客户的高度认可。</p><h4>项目C (2020-至今)</h4><p>目前负责公司新产品的项目管理工作，制定了详细的项目计划和风险控制措施。</p>',
    education: '毕业于YY大学软件工程专业，硕士学位。研究方向为软件项目管理。'
  },
  {
    name: '王小美',
    role: '求职：UI设计师',
    meta: '3年经验 · 本科',
    age: 26,
    contactPhone: '18877778888',
    skills: ['Figma', 'Sketch', 'Photoshop', '用户体验'],
    experience: '<h4>设计项目C (2021-至今)</h4><p>负责移动端产品UI设计，完成了多个互联网产品的视觉设计。设计的产品界面用户体验良好，获得了用户的积极反馈。</p><h4>设计项目D (2020-2021)</h4><p>参与了电商平台的重新设计，通过用户调研和数据分析，优化了用户购买流程。</p>',
    education: '毕业于ZZ美术学院设计专业，学士学位。在校期间多次获得设计比赛奖项。'
  }
]);

const viewTalentDetail = (index) => {
  router.push(`/talent/${index}`);
};
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
</style> 