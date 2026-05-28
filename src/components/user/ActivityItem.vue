<template>
  <div class="activity-item">
    <!-- 关注动态 -->
    <div v-if="activity.type === 'follow'" class="follow-activity">
      <div class="activity-header">
        <img :src="$getImageUrl(activity.user.avatar)" :alt="activity.user.name" class="user-avatar" />
        <div class="activity-content">
          <div class="activity-text">
            <router-link :to="`/user/${activity.user.id}`" class="user-link">
              {{ activity.user.name }}
            </router-link>
            关注了
            <router-link :to="`/user/${activity.target.id}`" class="user-link">
              {{ activity.target.name }}
            </router-link>
          </div>
          <div class="activity-time">{{ activity.time }}</div>
        </div>
      </div>
    </div>
    
    <!-- 文章动态 -->
    <div v-else-if="activity.type === 'post'" class="post-activity">
      <div class="activity-header">
        <img :src="$getImageUrl(activity.user.avatar)" :alt="activity.user.name" class="user-avatar" />
        <div class="activity-content">
          <div class="activity-text">
            <router-link :to="`/user/${activity.user.id}`" class="user-link">
              {{ activity.user.name }}
            </router-link>
            发布了文章
          </div>
          <div class="activity-time">{{ activity.time }}</div>
        </div>
      </div>
      
      <div class="post-content">
        <router-link :to="`/news/${activity.post.id}`" class="post-link">
          <h3 class="post-title">{{ activity.post.title }}</h3>
          <div class="post-excerpt" v-if="activity.post.excerpt">{{ activity.post.excerpt }}</div>
          <img v-if="activity.post.image" :src="$getImageUrl(activity.post.image)" :alt="activity.post.title" class="post-image" />
        </router-link>
        
        <div class="post-stats">
          <span class="stat-item">
            <Heart :size="14" />
            {{ activity.post.likes }}
          </span>
          <span class="stat-item">
            <MessageCircle :size="14" />
            {{ activity.post.comments }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 服务动态 -->
    <div v-else-if="activity.type === 'service'" class="service-activity">
      <div class="activity-header">
        <img :src="$getImageUrl(activity.user.avatar)" :alt="activity.user.name" class="user-avatar" />
        <div class="activity-content">
          <div class="activity-text">
            <router-link :to="`/user/${activity.user.id}`" class="user-link">
              {{ activity.user.name }}
            </router-link>
            发布了服务
          </div>
          <div class="activity-time">{{ activity.time }}</div>
        </div>
      </div>
      
      <div class="service-content">
        <h3 class="service-title">{{ activity.service.title }}</h3>
        <div class="service-meta">
          <span class="price" v-if="activity.service.price">{{ activity.service.price }}</span>
          <span class="location" v-if="activity.service.location">
            <MapPin :size="12" />
            {{ activity.service.location }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 知马圈动态 -->
    <div v-else-if="activity.type === 'circle'" class="circle-activity">
      <div class="activity-header">
        <img :src="$getImageUrl(activity.user.avatar)" :alt="activity.user.name" class="user-avatar" />
        <div class="activity-content">
          <div class="activity-text">
            <router-link :to="`/user/${activity.user.id}`" class="user-link">
              {{ activity.user.name }}
            </router-link>
            发布了动态
          </div>
          <div class="activity-time">{{ activity.time }}</div>
        </div>
      </div>
      
      <div class="circle-content">
        <div class="circle-text">{{ activity.circle.content }}</div>
        <div class="circle-images" v-if="activity.circle.images && activity.circle.images.length">
          <img 
            v-for="(image, index) in activity.circle.images.slice(0, 3)" 
            :key="index"
            :src="image" 
            class="circle-image"
          />
        </div>
        
        <div class="circle-stats">
          <span class="stat-item">
            <Heart :size="14" />
            {{ activity.circle.likes }}
          </span>
          <span class="stat-item">
            <MessageCircle :size="14" />
            {{ activity.circle.comments }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 点赞动态 -->
    <div v-else-if="activity.type === 'like'" class="like-activity">
      <div class="activity-header">
        <div class="like-indicator">
          <router-link :to="`/user/${activity.user.id}`" class="user-link">
            {{ activity.user.name }}
          </router-link>
          赞了这篇文章
        </div>
      </div>
      
      <div class="liked-content">
        <router-link :to="`/news/${activity.target.id}`" class="content-link">
          <h3 class="content-title">{{ activity.target.title }}</h3>
          <div class="content-excerpt" v-if="activity.target.excerpt">{{ activity.target.excerpt }}</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { Heart, MessageCircle, MapPin } from 'lucide-vue-next'

export default {
  name: 'ActivityItem',
  components: {
    Heart, MessageCircle, MapPin
  },
  props: {
    activity: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.activity-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.activity-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: #1f2937;
  line-height: 1.5;
}

.user-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.user-link:hover {
  text-decoration: underline;
}

.activity-time {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

/* 文章动态样式 */
.post-content {
  margin-left: 52px;
}

.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.post-title:hover {
  color: var(--primary-color);
}

.post-excerpt {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-image {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.post-stats, .circle-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #9ca3af;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 服务动态样式 */
.service-content {
  margin-left: 52px;
}

.service-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.service-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.price {
  color: var(--primary-color);
  font-weight: 600;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6b7280;
}

/* 知马圈动态样式 */
.circle-content {
  margin-left: 52px;
}

.circle-text {
  color: #1f2937;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.circle-images {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.circle-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

/* 点赞动态样式 */
.like-indicator {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}

.liked-content {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 3px solid var(--primary-color);
}

.content-link {
  text-decoration: none;
  color: inherit;
}

.content-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.content-title:hover {
  color: var(--primary-color);
}

.content-excerpt {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
