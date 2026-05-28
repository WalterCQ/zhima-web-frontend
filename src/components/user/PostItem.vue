<template>
  <div class="post-item">
    <div class="post-header">
      <div class="author-info">
        <img :src="$getImageUrl(post.author?.avatar)" :alt="`${post.author?.name}的头像`" class="author-avatar" @click="$router.push(`/user/${post.author?.id}`)" style="cursor:pointer;" />
        <div class="author-details">
          <div class="author-name" @click="$router.push(`/user/${post.author?.id}`)" style="cursor:pointer;">{{ post.author?.name }}</div>
          <div class="post-meta">
            <span class="position">{{ post.author?.bio }}</span>
            <span class="dot">·</span>
            <span class="publish-time">{{ post.publishTime }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="post-content">
      <router-link :to="`/news/${post.id}`" class="post-link">
        <h3 class="post-title">{{ post.title }}</h3>
        <div class="post-excerpt" v-if="post.excerpt">{{ post.excerpt }}</div>
        <img v-if="post.coverImage" :src="post.coverImage" :alt="post.title" class="post-image" />
      </router-link>
    </div>
    
    <div class="post-actions">
      <div class="action-item" @click="toggleLike">
        <Heart :class="{ filled: post.isLiked }" :size="16" />
        <span>{{ post.likes || '点赞' }}</span>
      </div>
      
      <div class="action-item">
        <MessageCircle :size="16" />
        <span>{{ post.comments || '评论' }}</span>
      </div>
      
      <div class="action-item" @click="sharePost">
        <Share2 :size="16" />
        <span>分享</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Heart, MessageCircle, Share2 } from 'lucide-vue-next'

export default {
  name: 'PostItem',
  components: {
    Heart, MessageCircle, Share2
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const toggleLike = () => {
      // 切换点赞状态
      props.post.isLiked = !props.post.isLiked
      if (props.post.isLiked) {
        props.post.likes = (props.post.likes || 0) + 1
      } else {
        props.post.likes = Math.max((props.post.likes || 0) - 1, 0)
      }
    }
    
    const sharePost = () => {
      // 分享文章
      if (navigator.share) {
        navigator.share({
          title: props.post.title,
          url: window.location.origin + `/news/${props.post.id}`
        })
      }
    }
    
    return {
      toggleLike,
      sharePost
    }
  }
}
</script>

<style scoped>
.post-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.post-header {
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.dot {
  color: #d1d5db;
}

.post-link {
  text-decoration: none;
  color: inherit;
}

.post-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.post-title:hover {
  color: var(--primary-color);
}

.post-excerpt {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-image {
  width: 100%;
  max-width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.post-actions {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.action-item:hover {
  color: var(--primary-color);
}

.action-item .filled {
  color: #ef4444;
  fill: #ef4444;
}
</style>
