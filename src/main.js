import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { image } from '@/utils'

// 全局样式
import './styles/global.css'

// 开发环境下清理 Service Worker 缓存
if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  try {
    navigator.serviceWorker.getRegistrations?.().then((registrations) => {
      registrations.forEach((registration) => registration.unregister())
    })
    caches?.keys?.().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  } catch (e) {
    console.warn('SW cleanup failed:', e)
  }
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 注册全局方法：获取完整的图片 URL
app.config.globalProperties.$getImageUrl = image.getImageUrl

// 恢复登录状态到axios
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
if (userStore.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${userStore.token}`
  console.log('✅ 已恢复登录状态')
  
  // 如果有token但没有用户信息，自动获取用户信息
  if (!userStore.userInfo) {
    userStore.checkAuth().then(() => {
      console.log('✅ 已自动获取用户信息')
    }).catch(err => {
      console.warn('⚠️ 自动获取用户信息失败:', err)
    })
  }
}

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err)
  console.error('组件:', vm)
  console.error('错误信息:', info)
}

// 挂载应用
app.mount('#app')

