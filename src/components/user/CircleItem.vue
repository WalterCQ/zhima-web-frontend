<template>
  <div class="circle-item">
    <div class="circle-header">
      <div class="author-info">
        <img :src="$getImageUrl(circle.author?.avatar)" :alt="`${circle.author?.name}的头像`" class="author-avatar" @click="$router.push(`/user/${circle.author?.id}`)" style="cursor:pointer;" />
        <div class="author-details">
          <div class="author-name" @click="$router.push(`/user/${circle.author?.id}`)" style="cursor:pointer;">{{ circle.author?.name }}</div>
          <div class="circle-meta">
            <span class="publish-time">{{ circle.publishTime }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="circle-content">
      <div class="circle-text">{{ circle.content }}</div>
      
      <div class="circle-images" v-if="circle.images && circle.images.length">
        <div class="image-grid" :class="`grid-${getGridClass(circle.images.length)}`">
          <img 
            v-for="(image, index) in circle.images" 
            :key="index"
            :src="image" 
            :alt="`圈子图片${index + 1}`" 
            class="circle-image"
            @click="previewImage(image)"
          />
        </div>
      </div>
      
      <div class="circle-tags" v-if="circle.tags && circle.tags.length">
        <span v-for="tag in circle.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
    
    <div class="circle-actions">
      <div class="action-item" @click="toggleLike">
        <Heart :class="{ filled: circle.isLiked }" :size="16" />
        <span>{{ circle.likes || '点赞' }}</span>
      </div>
      
      <div class="action-item" @click="showComments">
        <MessageCircle :size="16" />
        <span>{{ circle.comments || '评论' }}</span>
      </div>
      
      <div class="action-item" @click="shareCircle">
        <Share2 :size="16" />
        <span>分享</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Heart, MessageCircle, Share2 } from 'lucide-vue-next'

export default {
  name: 'CircleItem',
  components: {
    Heart, MessageCircle, Share2
  },
  props: {
    circle: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const toggleLike = () => {
      props.circle.isLiked = !props.circle.isLiked
      if (props.circle.isLiked) {
        props.circle.likes = (props.circle.likes || 0) + 1
      } else {
        props.circle.likes = Math.max((props.circle.likes || 0) - 1, 0)
      }
    }
    
    const showComments = () => {
      // 显示评论
    }
    
    const shareCircle = () => {
      // 分享圈子内容
      if (navigator.share) {
        navigator.share({
          title: '知马圈分享',
          text: props.circle.content,
          url: window.location.href
        })
      }
    }
    
    const previewImage = (image) => {
      // 预览图片
    }
    
    const getGridClass = (count) => {
      if (count === 1) return 'single'
      if (count === 2) return 'double'
      if (count === 4) return 'quad'
      return 'grid'
    }
    
    return {
      toggleLike,
      showComments,
      shareCircle,
      previewImage,
      getGridClass
    }
  }
}
</script>

<style scoped>
.circle-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.circle-header {
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
  border-radius: 8px;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.circle-meta {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.circle-text {
  color: #1f2937;
  line-height: 1.6;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.circle-images {
  margin-bottom: 12px;
}

.image-grid {
  display: grid;
  gap: 4px;
  border-radius: 8px;
  overflow: hidden;
}

.grid-single {
  grid-template-columns: 1fr;
  max-width: 300px;
}

.grid-double {
  grid-template-columns: 1fr 1fr;
  max-width: 300px;
}

.grid-quad {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  max-width: 300px;
}

.grid-grid {
  grid-template-columns: repeat(3, 1fr);
  max-width: 300px;
}

.circle-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s;
}

.grid-single .circle-image {
  height: 200px;
}

.circle-image:hover {
  transform: scale(1.02);
}

.circle-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.tag {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.circle-actions {
  display: flex;
  gap: 24px;
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
