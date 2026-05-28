<template>
  <div class="left-sidebar">
    <div class="sidebar-content">
      <!-- Logo区域 -->
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <img src="/logo.png" alt="知马网" class="logo-img">
        </router-link>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="main-navigation">
        <div 
          v-for="item in navigationItems" 
          :key="item.key"
          class="nav-item" 
          :class="{ active: activeItem === item.key }"
          @click="handleNavClick(item)"
        >
          <component :is="item.icon" class="nav-icon" />
          <span class="nav-label">{{ item.label }}</span>
        </div>
      </nav>
      
      <!-- 登录按钮 -->
      <div class="login-section">
        <button class="login-btn" @click="handleLogin">
          {{ loginButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Compass, PenTool, Bell } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

// Props
const props = defineProps({
  activeItem: {
    type: String,
    default: ''
  },
  // 自定义导航项
  customNavItems: {
    type: Array,
    default: () => []
  },
  // 是否显示发布功能
  showPublish: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['nav-click', 'publish-click'])

const router = useRouter()
const userStore = useUserStore()

// 默认导航项
const defaultNavItems = [
  {
    key: 'discover',
    label: '发现',
    icon: Compass,
    action: () => router.push('/circles')
  },
  {
    key: 'publish',
    label: '发布',
    icon: PenTool,
    action: () => emit('publish-click'),
    show: props.showPublish
  },
  {
    key: 'notifications',
    label: '通知',
    icon: Bell,
    action: () => emit('nav-click', 'notifications')
  }
]

// 计算导航项
const navigationItems = computed(() => {
  const items = props.customNavItems.length > 0 ? props.customNavItems : defaultNavItems
  return items.filter(item => item.show !== false)
})

// 登录按钮文本
const loginButtonText = computed(() => {
  return userStore.isLoggedIn ? '个人中心' : '登录'
})

// 方法
const handleNavClick = (item) => {
  if (item.action) {
    item.action()
  } else {
    emit('nav-click', item.key)
  }
}

const handleLogin = () => {
  if (userStore.isLoggedIn) {
    router.push('/profile')
  } else {
    router.push('/auth/login')
  }
}
</script>

<style scoped>
/* 左侧导航栏 */
.left-sidebar {
  width: 240px;
  background: var(--bg-primary, #fff);
  border-right: 1px solid var(--border-primary, #e5e5e5);
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  overflow-y: auto;
}

.sidebar-content {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Logo区域 */
.logo-section {
  margin-bottom: 32px;
  text-align: center;
}

.logo-link {
  display: inline-block;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.logo-link:hover {
  background: var(--bg-light, #f8f9fa);
  transform: scale(1.05);
}

.logo-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(255, 106, 0, 0.2);
}

/* 导航菜单 */
.main-navigation {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary, #333);
  font-size: 16px;
  font-weight: 500;
}

.nav-item:hover {
  background: var(--bg-light, #f8f9fa);
  color: var(--primary-color, #FF6A00);
}

.nav-item.active {
  background: linear-gradient(135deg, var(--primary-color, #FF6A00) 0%, var(--primary-hover, #FF8533) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.3);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-label {
  font-weight: 600;
}

/* 登录区域 */
.login-section {
  margin-top: auto;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-color, #FF6A00) 0%, var(--primary-hover, #FF8533) 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 106, 0, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 106, 0, 0.4);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .left-sidebar {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .left-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .left-sidebar.mobile-open {
    transform: translateX(0);
  }
}
</style>
