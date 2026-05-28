<template>
  <div v-show="loading" class="loading-bar" :class="{ complete }">
    <div class="loading-progress" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const progress = ref(0)
const complete = ref(false)

let progressTimer = null
let completeTimer = null

// 开始加载
const start = () => {
  loading.value = true
  progress.value = 0
  complete.value = false
  
  // 清除之前的定时器
  if (progressTimer) {
    clearInterval(progressTimer)
  }
  if (completeTimer) {
    clearTimeout(completeTimer)
  }
  
  // 模拟加载进度
  progressTimer = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 30
    }
  }, 100)
}

// 完成加载
const finish = () => {
  progress.value = 100
  complete.value = true
  
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
  
  // 延迟隐藏，显示完成动画
  completeTimer = setTimeout(() => {
    loading.value = false
    complete.value = false
    progress.value = 0
  }, 300)
}

// 监听路由变化
router.beforeEach((to, from, next) => {
  // 只有在真正切换页面时才显示加载条
  if (to.name !== from.name) {
    start()
  }
  next()
})

router.afterEach(() => {
  finish()
})

// 导出方法供外部调用
defineExpose({
  start,
  finish
})
</script>

<style scoped>
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 9999;
  background: rgba(255, 106, 0, 0.1);
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), #ffa726);
  transition: width 0.2s ease;
  transform-origin: left;
}

.loading-bar.complete .loading-progress {
  transition: width 0.1s ease;
}

/* 脉动效果 */
.loading-progress::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 1s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-bar {
    height: 3px;
  }
}
</style>
