<template>
  <div class="collection-item">
    <div class="collection-header">
      <div class="collection-info">
        <h3 class="collection-title">{{ collection.title }}</h3>
        <div class="collection-meta">
          <span class="item-count">{{ collection.itemCount }} 篇文章</span>
          <span class="dot">·</span>
          <span class="update-time">{{ collection.updateTime }}</span>
        </div>
      </div>
      <div class="collection-actions">
        <button class="action-btn" @click="toggleFollow">
          <Heart :class="{ filled: collection.isFollowing }" :size="16" />
          {{ collection.isFollowing ? '已关注' : '关注' }}
        </button>
      </div>
    </div>
    
    <div class="collection-description" v-if="collection.description">
      {{ collection.description }}
    </div>
    
    <div class="collection-preview" v-if="collection.previewItems && collection.previewItems.length">
      <div class="preview-title">最新文章：</div>
      <div class="preview-items">
        <router-link 
          v-for="item in collection.previewItems.slice(0, 3)" 
          :key="item.id"
          :to="`/news/${item.id}`"
          class="preview-item"
        >
          <span class="item-title">{{ item.title }}</span>
          <span class="item-author">{{ item.author }}</span>
        </router-link>
      </div>
    </div>
    
    <div class="collection-stats">
      <div class="stat-item">
        <Eye :size="16" />
        <span>{{ collection.views || 0 }} 阅读</span>
      </div>
      <div class="stat-item">
        <Users :size="16" />
        <span>{{ collection.followers || 0 }} 关注</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Heart, Eye, Users } from 'lucide-vue-next'

export default {
  name: 'CollectionItem',
  components: {
    Heart, Eye, Users
  },
  props: {
    collection: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const toggleFollow = () => {
      props.collection.isFollowing = !props.collection.isFollowing
      if (props.collection.isFollowing) {
        props.collection.followers = (props.collection.followers || 0) + 1
      } else {
        props.collection.followers = Math.max((props.collection.followers || 0) - 1, 0)
      }
    }
    
    return {
      toggleFollow
    }
  }
}
</script>

<style scoped>
.collection-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.collection-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.collection-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.dot {
  color: #d1d5db;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.action-btn .filled {
  color: #ef4444;
  fill: #ef4444;
}

.collection-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 14px;
}

.collection-preview {
  margin-bottom: 16px;
}

.preview-title {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
}

.preview-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s;
}

.preview-item:hover {
  background: #f3f4f6;
}

.item-title {
  font-size: 13px;
  color: #1f2937;
  flex: 1;
  margin-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-author {
  font-size: 12px;
  color: #6b7280;
}

.collection-stats {
  display: flex;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 12px;
}
</style>
