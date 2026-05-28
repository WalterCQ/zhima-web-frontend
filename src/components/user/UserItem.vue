<template>
  <div class="user-item">
    <div class="user-info">
      <router-link :to="`/user/${user.id}`" class="user-link">
        <img :src="$getImageUrl(user.avatar)" :alt="`${user.username}的头像`" class="user-avatar" />
      </router-link>
      
      <div class="user-details">
        <router-link :to="`/user/${user.id}`" class="user-link">
          <div class="username">{{ user.username }}</div>
        </router-link>
        <div class="user-bio" v-if="user.bio">{{ user.bio }}</div>
        <div class="user-stats">
          <span class="stat-item">{{ user.followersCount || 0 }} 关注者</span>
          <span class="dot">·</span>
          <span class="stat-item">{{ user.postsCount || 0 }} 文章</span>
        </div>
      </div>
    </div>
    
    <div class="user-actions">
      <button 
        class="follow-btn" 
        :class="{ active: user.isFollowing }" 
        @click="toggleFollow"
      >
        <template v-if="user.isFollowing">
          <Check :size="14" />
          已关注
        </template>
        <template v-else>
          关注
        </template>
      </button>
    </div>
  </div>
</template>

<script>
import { Check } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import { userProfileAPI } from '@/api/user-profile'

export default {
  name: 'UserItem',
  components: {
    Check
  },
  emits: ['follow-change'],
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const userStore = useUserStore()

    const toggleFollow = async () => {
      if (!userStore.isLoggedIn) {
        return
      }
      const prevFollowing = !!props.user.isFollowing
      const prevFollowers = props.user.followersCount || 0

      // 乐观更新
      props.user.isFollowing = !prevFollowing
      props.user.followersCount = Math.max(prevFollowers + (props.user.isFollowing ? 1 : -1), 0)

      try {
        if (!prevFollowing) {
          const res = await userProfileAPI.followUser(props.user.id)
          if (res.code !== 200) throw new Error(res.message || '关注失败')
          emit('follow-change', { userId: props.user.id, isFollowing: true, delta: 1 })
        } else {
          const res = await userProfileAPI.unfollowUser(props.user.id)
          if (res.code !== 200) throw new Error(res.message || '取消关注失败')
          emit('follow-change', { userId: props.user.id, isFollowing: false, delta: -1 })
        }
      } catch (e) {
        // 回滚
        props.user.isFollowing = prevFollowing
        props.user.followersCount = prevFollowers
        console.error('关注操作失败:', e)
      }
    }
    
    return {
      toggleFollow
    }
  }
}
</script>

<style scoped>
.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.user-link {
  text-decoration: none;
  color: inherit;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.username {
  font-weight: 600;
  color: #1f2937;
  font-size: 16px;
  margin-bottom: 4px;
}

.username:hover {
  color: var(--primary-color);
}

.user-bio {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 6px;
  line-height: 1.4;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #9ca3af;
}

.dot {
  color: #d1d5db;
}

.follow-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.follow-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.follow-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
</style>
