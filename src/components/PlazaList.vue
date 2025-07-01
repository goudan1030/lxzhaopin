<template>
  <div class="plaza-list-container">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 分类过滤器 -->
      <div class="category-filter">
        <div 
          class="filter-option" 
          :class="{ active: currentCategory === null }"
          @click="filterByCategory(null)"
        >
          全部
        </div>
        <div 
          class="filter-option" 
          :class="{ active: currentCategory === 'finding_job' }"
          @click="filterByCategory('finding_job')"
        >
          🔍 找活
        </div>
        <div 
          class="filter-option" 
          :class="{ active: currentCategory === 'recruiting' }"
          @click="filterByCategory('recruiting')"
        >
          💼 招人
        </div>
      </div>

      <div v-if="loading && !refreshing" class="loading-container">
        <div class="loading-text">加载中...</div>
      </div>
      <div v-else-if="plazaPosts.length === 0" class="empty-container">
        <div class="empty-text">暂无{{ currentCategory ? (currentCategory === 'recruiting' ? '招人' : '找活') : '' }}信息</div>
      </div>
      <div v-else>
        <div class="plaza-card" v-for="(post, index) in plazaPosts" :key="index">
          <div class="card-header">
            <div class="name">{{ post.name }}</div>
            <div class="category-badge" :class="post.category">
              {{ post.categoryText }}
            </div>
          </div>
          <div class="text">{{ post.text }}</div>
          <div class="tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <div class="actions">
            <button class="action-btn" :class="{ liked: post.isLiked }" @click="toggleLike(index)">
              <span class="icon">👍</span>
              <span>{{ post.likes }}</span>
            </button>
            <button class="action-btn" @click="toggleComments(index)">
              <span class="icon">💬</span>
              <span>{{ post.comments }}</span>
            </button>
            <button class="action-btn" @click="showContact(post)">
              <span class="icon">📞</span>
              <span>联系</span>
            </button>
          </div>
          <div v-if="post.showComments" class="comment-container">
            <div class="comment-list-inline">
              <div v-for="comment in getCommentsToShow(post)" :key="comment.id" class="comment-item-inline">
                <span class="comment-user-inline">{{ comment.user }}:</span>
                <span class="comment-text-inline">{{ comment.text }}</span>
              </div>
            </div>
            <button v-if="!post.showAllComments && post.comments_list.length > 3" 
                    @click="post.showAllComments = true" 
                    class="view-more-comments">
              查看全部 {{ post.comments_list.length }} 条评论
            </button>
            <div class="comment-form-inline">
              <input v-model="post.newComment" type="text" class="comment-inline-input" placeholder="添加评论...">
              <button @click="addComment(index)" class="btn-post-inline-comment">发布</button>
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>

    <!-- 联系方式弹窗 -->
    <div v-if="showContactModal" class="modal-overlay" @click="closeContactModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">联系方式</h3>
        <div class="modal-body">
          <p class="contact-info">联系电话：{{ currentContactPhone }}</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-primary" @click="closeContactModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { apiService } from '../services/index.js';

const { requireAuth } = useAuth();

// 联系方式弹窗控制
const showContactModal = ref(false);
const currentContactPhone = ref('');

const plazaPosts = ref([]);
const loading = ref(true);
const refreshing = ref(false);
const currentCategory = ref(null); // null表示全部，'finding_job'表示找活，'recruiting'表示招人

// 加载找活数据
const loadPlazaPosts = async (category = null) => {
  try {
    loading.value = true;
    const response = await apiService.posts.getPublicPlaza(1, 20, category);
    if (response.success) {
      // 转换数据格式以匹配组件期望的格式
      plazaPosts.value = await Promise.all(response.data.map(async (post) => {
        // 检查用户是否点赞过这条信息
        let isLiked = false;
        try {
          const token = localStorage.getItem('auth_token');
          if (token) {
            const likeResponse = await apiService.posts.getPlazaLikeStatus(post.id);
            isLiked = likeResponse.success ? likeResponse.data.isLiked : false;
          }
        } catch (error) {
          console.error('获取点赞状态失败:', error);
        }

        // 获取评论列表
        let comments_list = [];
        try {
          const commentsResponse = await apiService.posts.getPlazaComments(post.id);
          if (commentsResponse.success) {
            comments_list = commentsResponse.data.map(comment => ({
              id: comment.id,
              user: comment.user_name || '匿名用户',
              text: comment.content,
              created_at: comment.created_at
            }));
          }
        } catch (error) {
          console.error('获取评论失败:', error);
        }

        return {
          id: post.id, // 保存数据库ID
          name: post.user_name || '匿名用户',
          text: post.content,
          tags: Array.isArray(post.tags) ? post.tags : 
                (post.tags ? JSON.parse(post.tags) : []),
          category: post.category || 'finding_job',
          categoryText: post.category === 'recruiting' ? '招人' : '找活',
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          contactPhone: post.contact_phone,
          isLiked: isLiked,
          showComments: false,
          showAllComments: false,
          newComment: '',
          comments_list: comments_list,
          createdAt: post.created_at
        };
      }));
    }
  } catch (error) {
    console.error('加载找活数据失败:', error);
    // 如果加载失败，保持空数组
  } finally {
    loading.value = false;
  }
};

const toggleLike = async (index) => {
  if (!requireAuth()) return;
  const post = plazaPosts.value[index];
  
  try {
    const response = await apiService.posts.togglePlazaLike(post.id);
    if (response.success) {
      // 更新本地状态
      post.isLiked = response.data.isLiked;
      if (response.data.isLiked) {
        post.likes++;
      } else {
        post.likes = Math.max(0, post.likes - 1);
      }
    }
  } catch (error) {
    console.error('点赞操作失败:', error);
    // 可以显示错误提示
  }
};

const toggleComments = (index) => {
  if (!requireAuth()) return;
  const post = plazaPosts.value[index];
  post.showComments = !post.showComments;
};

const showContact = (post) => {
  if (!requireAuth()) return;
  if (post.contactPhone) {
    currentContactPhone.value = post.contactPhone;
    showContactModal.value = true;
  } else {
    alert('对方暂未提供联系方式。');
  }
};

const closeContactModal = () => {
  showContactModal.value = false;
  currentContactPhone.value = '';
};

const getCommentsToShow = (post) => {
  return post.showAllComments ? post.comments_list : post.comments_list.slice(0, 3);
};

const addComment = async (index) => {
  if (!requireAuth()) return;
  const post = plazaPosts.value[index];
  if (post.newComment.trim() === '') return;
  
  try {
    const response = await apiService.posts.addPlazaComment(post.id, post.newComment.trim());
    if (response.success) {
      // 添加新评论到列表
      const newComment = {
        id: response.data.id,
        user: response.data.user_name || '我',
        text: response.data.content,
        created_at: response.data.created_at
      };
      
      post.comments_list.unshift(newComment);
      post.comments = post.comments_list.length;
      post.newComment = '';
      post.showAllComments = true;
    }
  } catch (error) {
    console.error('添加评论失败:', error);
    // 可以显示错误提示
  }
};

// 分类过滤
const filterByCategory = async (category) => {
  currentCategory.value = category;
  await loadPlazaPosts(category);
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  await loadPlazaPosts(currentCategory.value);
  refreshing.value = false;
};

onMounted(() => {
  loadPlazaPosts();
});
</script>

<style scoped>
.plaza-list-container {
  background-color: var(--background-color);
  padding: 20px 15px;
  min-height: calc(100vh - 44px);
}

.category-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  padding: 0 4px;
}

.filter-option {
  flex: 1;
  padding: 10px 16px;
  text-align: center;
  border-radius: 20px;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-option:active {
  transform: scale(0.98);
}

.filter-option.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* Plaza Card Specifics - 严格按照HTML文档样式 */
.plaza-card {
  background-color: var(--card-background);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s, transform 0.2s;
}

.plaza-card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plaza-card .name {
  font-weight: 600;
  font-size: 1.1em;
  flex: 1;
}

.category-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  margin-left: 12px;
}

.category-badge.finding_job {
  background-color: #10B981; /* 绿色 - 找活 */
}

.category-badge.recruiting {
  background-color: #3B82F6; /* 蓝色 - 招人 */
}

.plaza-card .text {
  line-height: 1.6;
  margin-bottom: 15px;
  color: var(--text-primary);
}

.plaza-card .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.plaza-card .tags .tag {
  background-color: var(--primary-light);
  color: var(--primary-color);
  font-weight: 500;
  font-size: 0.8em;
  padding: 4px 10px;
  border-radius: 20px;
}

.plaza-card .actions {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 25px;
}

.plaza-card .actions .action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9em;
}

.plaza-card .actions .action-btn .icon {
  font-size: 1.2em;
}

.plaza-card .actions .action-btn.liked .icon {
  color: var(--danger-color);
}

/* Comment styles - 严格按照HTML文档样式 */
.comment-container {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.comment-list-inline .comment-item-inline {
  font-size: 0.9em;
  margin-bottom: 8px;
}

.comment-item-inline .comment-user-inline {
  font-weight: bold;
  color: #007aff;
  margin-right: 5px;
}

.comment-item-inline .comment-text-inline {
  color: #555;
}

.view-more-comments {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.9em;
  padding: 5px 0;
  margin-bottom: 10px;
}

.comment-form-inline {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.comment-form-inline .comment-inline-input {
  flex-grow: 1;
  border: 1px solid #ddd;
  background-color: #f7f7f7;
  border-radius: 15px;
  padding: 8px 12px;
  font-size: 0.9em;
}

.comment-form-inline .btn-post-inline-comment {
  flex-shrink: 0;
  border: none;
  background-color: #007aff;
  color: white;
  border-radius: 15px;
  padding: 8px 15px;
  font-size: 0.9em;
  cursor: pointer;
}

/* 联系方式弹窗样式 - 严格按照设计稿 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(45, 55, 72, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 0px;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  width: calc(100% - 40px);
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-title {
  font-size: 1.125em;
  font-weight: 600;
  color: #1a1a1a;
  text-align: center;
  padding: 28px 24px 4px 24px;
  margin: 0;
}

.modal-body {
  padding: 16px 24px 24px 24px;
  text-align: center;
}

.contact-info {
  font-size: 1em;
  color: #718096;
  margin: 0;
  line-height: 1.6;
}

.modal-footer {
  padding: 0 24px 28px 24px;
  text-align: center;
}

.modal-btn {
  padding: 14px 0;
  font-size: 1em;
  font-weight: 500;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  width: 100%;
}

.modal-btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.modal-btn:active {
  transform: scale(0.97);
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