<template>
  <div id="app">
    <!-- 加载进度条 -->
    <LoadingBar />
    
    <!-- 全局导航栏 - 认证页面、首页和错误页面不显示（首页使用自身导航） -->
    <AppHeader v-if="!isAuthPage && route?.name !== 'Home' && !isErrorPage" />
    
    <!-- 主内容区域 -->
    <main class="main-content" :class="{ 
      'home-page': route?.name === 'Home',
      'auth-page-layout': isAuthPage,
      'error-page-layout': isErrorPage,
      'user-profile-layout': route?.name === 'UserProfile'
    }">
      <RouterView v-slot="{ Component, route }">
        <Suspense timeout="0">
          <template #default>
            <Transition name="fade" mode="out-in">
              <div class="route-transition-wrapper" :key="route.fullPath">
                <KeepAlive :include="keepAlivePages">
                  <component :is="Component" />
                </KeepAlive>
              </div>
            </Transition>
          </template>
          <template #fallback>
            <div class="route-skeleton">
              <div class="sk-title skeleton"></div>
              <div class="sk-line skeleton"></div>
              <div class="sk-line skeleton"></div>
              <div class="sk-grid">
                <div class="sk-card skeleton"></div>
                <div class="sk-card skeleton"></div>
                <div class="sk-card skeleton"></div>
              </div>
            </div>
          </template>
        </Suspense>
      </RouterView>

      <!-- 顶层模态命名视图：用于 Circles 详情悬浮在列表之上 -->
      <RouterView name="modal" v-slot="{ Component }">
        <Transition name="modal-fade">
          <div v-if="Component" class="modal-host">
            <component :is="Component" />
          </div>
        </Transition>
      </RouterView>
    </main>

    <!-- 页面加载模糊与旋转指示（导航栏保持清晰，因其更高 z-index） -->
    <div v-if="isPageLoading" class="page-loading-overlay">
      <div class="spinner" aria-label="页面加载中"></div>
    </div>
    
    <!-- 全局底部 - 认证、发布、个人、错误、资讯、知马圈页面不显示 -->
    <AppFooter v-if="!isAuthPage && !isCreatePostPage && !isErrorPage && !isNewsPage && !isCirclesPage && !isPageLoading && !route?.meta?.hideFooter" />
    
    <!-- 全局右侧浮动工具条 - 发布页面和错误页面不显示 -->
    <RightSideTools v-if="!isCreatePostPage && !isErrorPage" />
    
  </div>
</template>

<script setup>
import { onMounted, computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import RightSideTools from '@/components/layout/RightSideTools.vue'
import LoadingBar from '@/components/LoadingBar.vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

// 页面加载状态（用于显示模糊与旋转加载）
const isPageLoading = ref(false)
const routerInstance = useRouter()

routerInstance.beforeEach((to, from, next) => {
  isPageLoading.value = true
  next()
})
routerInstance.afterEach(() => {
  // 略微延迟，避免闪烁
  setTimeout(() => { isPageLoading.value = false }, 120)
})

// 需要缓存的页面组件名
const keepAlivePages = ref([
  'HomePage',
  'NewsPage', 
  'ServicesPage',
  'CirclesPage'
])

// 判断是否为认证页面
const isAuthPage = computed(() => {
  const currentName = route?.name
  return currentName ? ['Login', 'Register'].includes(currentName) : false
})

// 判断是否为发布页面
const isCreatePostPage = computed(() => {
  return route?.name === 'CreatePost'
})

// 判断是否为错误页面
const isErrorPage = computed(() => {
  const currentName = route?.name
  return currentName ? ['ErrorPage', 'NotFound'].includes(currentName) : false
})

// 判断是否为资讯页面
const isNewsPage = computed(() => {
  const currentName = route?.name
  return currentName ? ['News', 'NewsDetail'].includes(currentName) : false
})

// 判断是否为知马圈页面
const isCirclesPage = computed(() => {
  const currentName = route?.name
  return currentName ? ['Circles', 'CirclesDetail'].includes(currentName) : false
})

// 判断是否为详情页面
const isModalPage = computed(() => {
  return route?.name === 'CirclesDetail'
})

// 监听路由变化，控制body滚动
watch(isModalPage, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

// 应用初始化
onMounted(() => {
  // 检查用户登录状态
  userStore.checkAuth()
})

</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 60px; /* 新导航栏高度 */
  min-height: 60vh; /* 防止切换瞬间高度塌陷 */
}

/* 页面加载覆盖层（不遮挡导航栏，导航 z-index 更高） */
.page-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 950;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0,0,0,0.12);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 路由骨架屏 */
.route-skeleton {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.skeleton {
  background: linear-gradient(90deg, #f2f3f5 25%, #eceff3 37%, #f2f3f5 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.2s ease-in-out infinite;
  border-radius: 8px;
}

.sk-title { height: 28px; margin-bottom: 16px; }
.sk-line { height: 14px; margin-bottom: 12px; }
.sk-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 12px; }
.sk-card { height: 120px; }

@keyframes skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

/* 首页特殊处理，移除顶部边距 */
.main-content.home-page {
  margin-top: 0;
}

/* 认证页面特殊处理，移除顶部边距 */
.main-content.auth-page-layout {
  margin-top: 0;
}

/* 错误页面特殊处理，移除顶部边距 */
.main-content.error-page-layout {
  margin-top: 0;
}

/* 用户资料页面特殊处理，添加灰色背景 */
.main-content.user-profile-layout {
  background: #f6f6f6;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 覆盖层与背景模糊 */
.modal-host {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  backdrop-filter: blur(10px);
  background: rgba(0,0,0,0.3);
  z-index: 3000;
  overflow: hidden;
}

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity .25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

/* 让 Transition 始终有一个元素根可动画 */
.route-transition-wrapper { display: block; }
</style>

