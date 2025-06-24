<template>
  <div class="plaza-list-container">
    <div class="plaza-card" v-for="(post, index) in plazaPosts" :key="index">
      <div class="name">{{ post.name }}</div>
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
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const { requireAuth } = useAuth();

// 联系方式弹窗控制
const showContactModal = ref(false);
const currentContactPhone = ref('');

const plazaPosts = ref([
  {
    name: '王师傅',
    text: '本人是持证电工，有10年经验，家装、工厂用电都精通，想找个稳定或临时的电工活。',
    tags: ['电工', '10年经验'],
    likes: 12,
    comments: 4,
    contactPhone: '13811112222',
    isLiked: false,
    showComments: false,
    showAllComments: false,
    newComment: '',
    comments_list: [
      { id: 1, user: '我', text: '太棒了！' },
      { id: 2, user: '王师傅', text: '楼上的，已经私信你了' },
      { id: 3, user: '包工头老刘', text: '留个联系方式' },
      { id: 4, user: '热心市民张', text: '师傅手艺怎么样？' },
    ]
  },
  {
    name: '李阿姨',
    text: '想找一份在县城东区的保姆或钟点工工作，会做饭，爱干净，有耐心。',
    tags: ['保姆', '钟点工'],
    likes: 25,
    comments: 1,
    contactPhone: '13933334444',
    isLiked: false,
    showComments: false,
    showAllComments: false,
    newComment: '',
    comments_list: [
      { id: 1, user: '宝妈小丽', text: '阿姨你好，怎么联系你？' }
    ]
  },
  {
    name: '小张',
    text: '刚毕业的大学生，会用Office、PS，想找个文员、助理类的工作，学习能力强，能吃苦。',
    tags: ['文员', '应届生'],
    likes: 8,
    comments: 0,
    contactPhone: '13655556666',
    isLiked: false,
    showComments: false,
    showAllComments: false,
    newComment: '',
    comments_list: []
  }
]);

const toggleLike = (index) => {
  if (!requireAuth()) return;
  const post = plazaPosts.value[index];
  if (post.isLiked) {
    post.likes--;
    post.isLiked = false;
  } else {
    post.likes++;
    post.isLiked = true;
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

const addComment = (index) => {
  if (!requireAuth()) return;
  const post = plazaPosts.value[index];
  if (post.newComment.trim() === '') return;
  
  const newComment = {
    id: Date.now(),
    user: '我',
    text: post.newComment.trim()
  };
  
  post.comments_list.unshift(newComment);
  post.comments = post.comments_list.length;
  post.newComment = '';
  post.showAllComments = true;
};
</script>

<style scoped>
.plaza-list-container {
  background-color: var(--background-color);
  padding: 20px 15px;
  min-height: calc(100vh - 44px);
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

.plaza-card .name {
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 8px;
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
</style> 