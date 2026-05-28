<template>
  <div class="error-page">
    <!-- 动态背景元素 -->
    <div class="background-elements" ref="backgroundContainer">
      <div class="floating-shape shape-1" ref="shape1" @click="goToHome">
        <span class="shape-text">首页</span>
      </div>
      <div class="floating-shape shape-2" ref="shape2" @click="goToNews">
        <span class="shape-text">资讯</span>
      </div>
      <div class="floating-shape shape-3" ref="shape3" @click="goToServices">
        <span class="shape-text">知马同城</span>
      </div>
      <div class="floating-shape shape-4" ref="shape4" @click="goToCircles">
        <span class="shape-text">知马圈</span>
      </div>
      <div class="floating-shape shape-5" ref="shape5" @click="goToSearch">
        <span class="shape-text">搜索</span>
      </div>
      <div class="floating-shape shape-6" ref="shape6" @click="goToProfile">
        <span class="shape-text">个人中心</span>
      </div>
    </div>
    
    <div class="error-container">
      <!-- 错误图标和代码 -->
      <div class="error-icon-section">
        <div class="error-icon" :class="errorType">
          <component :is="getErrorIcon()" class="icon" />
        </div>
        <h1 class="error-code">{{ errorCode }}</h1>
      </div>

      <!-- 错误信息 -->
      <div class="error-content">
        <h2 class="error-title">{{ errorTitle }}</h2>
        <p class="error-description">{{ errorDescription }}</p>
      </div>

      <!-- 操作按钮 -->
      <div class="error-actions">
        <button class="btn btn-primary" @click="goHome">
          <Home class="inline-icon" />
          返回首页
        </button>
        
        <button class="btn btn-secondary" @click="goBack">
          <ArrowLeft class="inline-icon" />
          返回上页
        </button>
        
        <button class="btn btn-ghost" @click="showHelpDialog = true">
          <HelpCircle class="inline-icon" />
          获取帮助
        </button>
      </div>

    </div>

    <!-- 帮助对话框 -->
    <el-dialog 
      v-model="showHelpDialog" 
      title="获取帮助" 
      width="500px"
      class="help-dialog"
    >
      <div class="help-content">
        <div class="help-section">
          <h4>常见问题</h4>
          <ul class="help-list">
            <li v-for="faq in faqList" :key="faq.id" @click="faq.expanded = !faq.expanded">
              <div class="faq-question">
                {{ faq.question }}
                <ChevronDown class="chevron" :class="{ expanded: faq.expanded }" />
              </div>
              <div class="faq-answer" v-show="faq.expanded">
                {{ faq.answer }}
              </div>
            </li>
          </ul>
        </div>
        
        <div class="help-section">
          <h4>联系方式</h4>
          <div class="contact-info">
            <div class="contact-item">
              <Mail class="contact-icon" />
              <span>support@zhimawang.com</span>
            </div>
            <div class="contact-item">
              <Phone class="contact-icon" />
              <span>+60 123-456-7890</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Home, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown,
  Mail,
  Phone,
  AlertTriangle,
  FileX,
  Shield,
  Server,
  Globe,
  WifiOff,
  Clock,
  Zap
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// 响应式数据
const showHelpDialog = ref(false)

// 碰撞检测相关
const backgroundContainer = ref(null)
const shape1 = ref(null)
const shape2 = ref(null)
const shape3 = ref(null)
const shape4 = ref(null)
const shape5 = ref(null)
const shape6 = ref(null)

const shapes = ref([])
const animationId = ref(null)
const shapesData = ref([
  { id: 1, x: 0, y: 0, vx: 3, vy: 2.5, radius: 100, mass: 100, restitution: 0.9, element: null },
  { id: 2, x: 0, y: 0, vx: -2.8, vy: 3.2, radius: 75, mass: 75, restitution: 0.9, element: null },
  { id: 3, x: 0, y: 0, vx: 2.5, vy: -2.8, radius: 50, mass: 50, restitution: 0.9, element: null },
  { id: 4, x: 0, y: 0, vx: -3.2, vy: -2.5, radius: 90, mass: 90, restitution: 0.9, element: null },
  { id: 5, x: 0, y: 0, vx: 2.8, vy: 3.5, radius: 60, mass: 60, restitution: 0.9, element: null },
  { id: 6, x: 0, y: 0, vx: -2.5, vy: 2.8, radius: 80, mass: 80, restitution: 0.9, element: null }
])

// 错误配置映射
const errorConfigs = {
  400: {
    type: 'client',
    title: '请求错误',
    description: '您的请求格式不正确，请检查后重试。',
    icon: AlertTriangle,
    recommendations: [
      { id: 1, title: '检查网络连接', description: '确保网络连接正常', icon: 'WifiOff', path: '/help/network' },
      { id: 2, title: '清除缓存', description: '清除浏览器缓存数据', icon: 'Shield', path: '/help/cache' }
    ]
  },
  401: {
    type: 'auth',
    title: '未授权访问',
    description: '您需要登录才能访问此页面。',
    icon: Shield,
    recommendations: [
      { id: 1, title: '登录账户', description: '使用您的账户登录', icon: 'Zap', path: '/auth/login' },
      { id: 2, title: '注册账户', description: '创建新的账户', icon: 'Zap', path: '/auth/register' }
    ]
  },
  403: {
    type: 'forbidden',
    title: '访问被拒绝',
    description: '您没有权限访问此页面。',
    icon: Shield,
    recommendations: [
      { id: 1, title: '联系管理员', description: '申请访问权限', icon: 'Mail', path: '/contact' },
      { id: 2, title: '返回首页', description: '浏览其他内容', icon: 'Home', path: '/' }
    ]
  },
  404: {
    type: 'not-found',
    title: '页面未找到',
    description: '抱歉，您访问的页面不存在或已被移动。',
    icon: FileX,
    recommendations: [
      { id: 1, title: '资讯新闻', description: '了解马来西亚最新动态', icon: 'Globe', path: '/news' },
      { id: 2, title: '便民服务', description: '二手交易、租房买房', icon: 'Zap', path: '/services' },
      { id: 3, title: '知马圈', description: '分享生活，结交朋友', icon: 'Globe', path: '/circles' },
      { id: 4, title: '生活分享', description: '记录美好生活瞬间', icon: 'Zap', path: '/circles/lifestyle' }
    ]
  },
  408: {
    type: 'timeout',
    title: '请求超时',
    description: '服务器响应时间过长，请稍后重试。',
    icon: Clock,
    recommendations: [
      { id: 1, title: '检查网络', description: '确保网络连接稳定', icon: 'WifiOff', path: '/help/network' },
      { id: 2, title: '稍后重试', description: '等待片刻后重新访问', icon: 'Clock', path: route.path }
    ]
  },
  429: {
    type: 'rate-limit',
    title: '请求过于频繁',
    description: '您的请求过于频繁，请稍后再试。',
    icon: Clock,
    recommendations: [
      { id: 1, title: '等待片刻', description: '稍后重新尝试', icon: 'Clock', path: route.path },
      { id: 2, title: '联系客服', description: '获取更多帮助', icon: 'Mail', path: '/contact' }
    ]
  },
  500: {
    type: 'server',
    title: '服务器错误',
    description: '服务器遇到了问题，我们正在努力修复。',
    icon: Server,
    recommendations: [
      { id: 1, title: '稍后重试', description: '等待服务器恢复', icon: 'Clock', path: route.path },
      { id: 2, title: '联系客服', description: '报告问题', icon: 'Mail', path: '/contact' }
    ]
  },
  502: {
    type: 'bad-gateway',
    title: '网关错误',
    description: '服务器网关出现问题，请稍后重试。',
    icon: Server,
    recommendations: [
      { id: 1, title: '刷新页面', description: '重新加载页面', icon: 'Zap', path: route.path },
      { id: 2, title: '返回首页', description: '浏览其他内容', icon: 'Home', path: '/' }
    ]
  },
  503: {
    type: 'unavailable',
    title: '服务不可用',
    description: '服务暂时不可用，我们正在维护中。',
    icon: Server,
    recommendations: [
      { id: 1, title: '稍后访问', description: '等待服务恢复', icon: 'Clock', path: route.path },
      { id: 2, title: '查看公告', description: '了解维护信息', icon: 'Globe', path: '/news' }
    ]
  },
  504: {
    type: 'timeout',
    title: '网关超时',
    description: '服务器响应超时，请稍后重试。',
    icon: Clock,
    recommendations: [
      { id: 1, title: '检查网络', description: '确保网络连接正常', icon: 'WifiOff', path: '/help/network' },
      { id: 2, title: '重新尝试', description: '刷新页面重试', icon: 'Zap', path: route.path }
    ]
  }
}

// 计算属性
const errorCode = computed(() => {
  return route.params.code || route.query.code || '404'
})

const errorConfig = computed(() => {
  return errorConfigs[errorCode.value] || errorConfigs[404]
})

const errorType = computed(() => errorConfig.value.type)
const errorTitle = computed(() => errorConfig.value.title)
const errorDescription = computed(() => errorConfig.value.description)
const recommendations = computed(() => errorConfig.value.recommendations || [])

// FAQ 数据
const faqList = ref([
  {
    id: 1,
    question: '为什么会出现这个错误？',
    answer: '这可能是由于网络问题、服务器维护或页面不存在等原因造成的。',
    expanded: false
  },
  {
    id: 2,
    question: '如何解决网络连接问题？',
    answer: '请检查您的网络连接，尝试刷新页面或重新连接网络。',
    expanded: false
  },
  {
    id: 3,
    question: '页面加载很慢怎么办？',
    answer: '可以尝试清除浏览器缓存，或者稍后重新访问页面。',
    expanded: false
  },
  {
    id: 4,
    question: '如何联系技术支持？',
    answer: '您可以通过邮件 support@zhimawang.com 或电话联系我们。',
    expanded: false
  }
])

// 图标组件映射
const iconComponents = {
  Home,
  Globe,
  Zap,
  Mail,
  WifiOff,
  Clock,
  Shield
}

// 方法
const getErrorIcon = () => {
  return errorConfig.value.icon || FileX
}

const getIconComponent = (iconName) => {
  return iconComponents[iconName] || Zap
}

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

const goToRecommendation = (item) => {
  router.push(item.path)
}

// 导航跳转方法
const goToHome = () => {
  router.push('/')
}

const goToNews = () => {
  router.push('/news')
}

const goToServices = () => {
  router.push('/services')
}

const goToCircles = () => {
  router.push('/circles')
}

const goToSearch = () => {
  router.push('/search')
}

const goToProfile = () => {
  router.push('/profile')
}

// 碰撞检测和物理引擎
const initCollisionSystem = () => {
  shapes.value = [shape1.value, shape2.value, shape3.value, shape4.value, shape5.value, shape6.value]
  
  const rect = backgroundContainer.value.getBoundingClientRect()
  const placedShapes = []
  
  // 初始化形状位置和元素引用，确保不重叠
  shapesData.value.forEach((shape, index) => {
    if (shapes.value[index]) {
      shape.element = shapes.value[index]
      
      let attempts = 0
      let validPosition = false
      
      // 尝试找到不重叠的位置
      while (!validPosition && attempts < 100) {
        shape.x = Math.random() * (rect.width - shape.radius * 2) + shape.radius
        shape.y = Math.random() * (rect.height - shape.radius * 2) + shape.radius
        
        // 检查与已放置的形状是否重叠
        validPosition = true
        for (const placedShape of placedShapes) {
          const dx = shape.x - placedShape.x
          const dy = shape.y - placedShape.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const minDistance = shape.radius + placedShape.radius + 10 // 额外10px安全距离
          
          if (distance < minDistance) {
            validPosition = false
            break
          }
        }
        
        attempts++
      }
      
      // 如果找不到合适位置，使用网格布局
      if (!validPosition) {
        const cols = 3
        const col = index % cols
        const row = Math.floor(index / cols)
        shape.x = (col + 0.5) * (rect.width / cols)
        shape.y = (row + 0.5) * (rect.height / 2)
      }
      
      placedShapes.push(shape)
      updateShapePosition(shape)
      
      // 启用点击事件
      shape.element.style.pointerEvents = 'auto'
    }
  })
}

const updateShapePosition = (shape) => {
  if (shape.element) {
    shape.element.style.left = `${shape.x - shape.radius}px`
    shape.element.style.top = `${shape.y - shape.radius}px`
  }
}

const checkCollision = (shape1, shape2) => {
  const dx = shape1.x - shape2.x
  const dy = shape1.y - shape2.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < (shape1.radius + shape2.radius)
}

const resolveCollision = (shape1, shape2) => {
  const dx = shape2.x - shape1.x
  const dy = shape2.y - shape1.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  // 处理完全重叠的情况
  if (distance < 0.1) {
    // 随机方向推开
    const angle = Math.random() * Math.PI * 2
    const separation = (shape1.radius + shape2.radius) * 1.05
    shape1.x -= Math.cos(angle) * separation * 0.5
    shape1.y -= Math.sin(angle) * separation * 0.5
    shape2.x += Math.cos(angle) * separation * 0.5
    shape2.y += Math.sin(angle) * separation * 0.5
    
    // 给予合理的随机速度
    shape1.vx = (Math.random() - 0.5) * 5
    shape1.vy = (Math.random() - 0.5) * 5
    shape2.vx = (Math.random() - 0.5) * 5
    shape2.vy = (Math.random() - 0.5) * 5
    return
  }
  
  // 如果没有碰撞，不处理
  if (distance >= shape1.radius + shape2.radius) return
  
  // 标准化碰撞向量
  const nx = dx / distance
  const ny = dy / distance
  
  // 先分离重叠的圆形（基于质量比例分配）
  const overlap = (shape1.radius + shape2.radius) - distance
  const totalMass = shape1.mass + shape2.mass
  const shape1Ratio = shape2.mass / totalMass
  const shape2Ratio = shape1.mass / totalMass
  
  // 温和分离，避免视觉上的跳跃
  const separationMultiplier = 1.02
  shape1.x -= nx * overlap * shape1Ratio * separationMultiplier
  shape1.y -= ny * overlap * shape1Ratio * separationMultiplier
  shape2.x += nx * overlap * shape2Ratio * separationMultiplier
  shape2.y += ny * overlap * shape2Ratio * separationMultiplier
  
  // 计算相对速度
  const dvx = shape1.vx - shape2.vx
  const dvy = shape1.vy - shape2.vy
  
  // 相对速度在碰撞法线上的投影
  const dvn = dvx * nx + dvy * ny
  
  // 如果物体正在分离，不改变速度
  if (dvn <= 0) return
  
  // 计算恢复系数
  const restitution = (shape1.restitution + shape2.restitution) / 2
  
  // 计算碰撞冲量（考虑质量和恢复系数）
  const impulse = -(1 + restitution) * dvn / (1 / shape1.mass + 1 / shape2.mass)
  
  // 更新速度（基于质量的动量守恒）
  const impulseX = impulse * nx
  const impulseY = impulse * ny
  
  shape1.vx -= impulseX / shape1.mass
  shape1.vy -= impulseY / shape1.mass
  shape2.vx += impulseX / shape2.mass
  shape2.vy += impulseY / shape2.mass
  
  // 确保碰撞后有最小速度，防止完全静止
  const minSpeed = 0.5
  const speed1 = Math.sqrt(shape1.vx * shape1.vx + shape1.vy * shape1.vy)
  const speed2 = Math.sqrt(shape2.vx * shape2.vx + shape2.vy * shape2.vy)
  
  if (speed1 < minSpeed) {
    const angle = Math.atan2(shape1.vy, shape1.vx)
    shape1.vx = Math.cos(angle) * minSpeed
    shape1.vy = Math.sin(angle) * minSpeed
  }
  
  if (speed2 < minSpeed) {
    const angle = Math.atan2(shape2.vy, shape2.vx)
    shape2.vx = Math.cos(angle) * minSpeed
    shape2.vy = Math.sin(angle) * minSpeed
  }
}

const animate = () => {
  if (!backgroundContainer.value) return
  
  const rect = backgroundContainer.value.getBoundingClientRect()
  
  shapesData.value.forEach(shape => {
    // 限制最大速度，防止穿透
    const maxSpeed = 8
    const speed = Math.sqrt(shape.vx * shape.vx + shape.vy * shape.vy)
    if (speed > maxSpeed) {
      shape.vx = (shape.vx / speed) * maxSpeed
      shape.vy = (shape.vy / speed) * maxSpeed
    }
    
    // 更新位置
    shape.x += shape.vx
    shape.y += shape.vy
    
    // 边界碰撞检测（考虑恢复系数）
    if (shape.x - shape.radius <= 0) {
      shape.x = shape.radius + 1
      shape.vx = Math.abs(shape.vx) * shape.restitution
      if (shape.vx < 1) shape.vx = 1 // 确保最小速度
    } else if (shape.x + shape.radius >= rect.width) {
      shape.x = rect.width - shape.radius - 1
      shape.vx = -Math.abs(shape.vx) * shape.restitution
      if (shape.vx > -1) shape.vx = -1
    }
    
    if (shape.y - shape.radius <= 0) {
      shape.y = shape.radius + 1
      shape.vy = Math.abs(shape.vy) * shape.restitution
      if (shape.vy < 1) shape.vy = 1
    } else if (shape.y + shape.radius >= rect.height) {
      shape.y = rect.height - shape.radius - 1
      shape.vy = -Math.abs(shape.vy) * shape.restitution
      if (shape.vy > -1) shape.vy = -1
    }
    
    // 更新DOM位置
    updateShapePosition(shape)
  })
  
  // 圆形间碰撞检测
  for (let i = 0; i < shapesData.value.length; i++) {
    for (let j = i + 1; j < shapesData.value.length; j++) {
      if (checkCollision(shapesData.value[i], shapesData.value[j])) {
        resolveCollision(shapesData.value[i], shapesData.value[j])
        updateShapePosition(shapesData.value[i])
        updateShapePosition(shapesData.value[j])
      }
    }
  }
  
  animationId.value = requestAnimationFrame(animate)
}

// 页面标题
onMounted(async () => {
  document.title = `${errorTitle.value} - 知马网`
  
  await nextTick()
  initCollisionSystem()
  animate()
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    #ff7e5f 0%, 
    #feb47b 25%,
    #ff6b35 50%,
    #f7931e 75%,
    #ff8c00 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  position: relative;
  overflow: hidden;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 100% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 动态背景元素 */
.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.floating-shape:hover {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  filter: brightness(1.15);
}

.floating-shape:active {
  filter: brightness(0.95);
}

.shape-text {
  color: white;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  text-align: center;
  line-height: 1.2;
}

.shape-1 .shape-text {
  font-size: 18px;
}

.shape-2 .shape-text {
  font-size: 16px;
}

.shape-3 .shape-text {
  font-size: 12px;
}

.shape-4 .shape-text {
  font-size: 16px;
}

.shape-5 .shape-text {
  font-size: 14px;
}

.shape-6 .shape-text {
  font-size: 15px;
}

.shape-1 {
  width: 200px;
  height: 200px;
  background: rgba(255, 126, 95, 0.4);
  box-shadow: 
    0 0 30px rgba(255, 126, 95, 0.5),
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: glow 3s infinite ease-in-out;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: rgba(254, 180, 123, 0.4);
  box-shadow: 
    0 0 25px rgba(254, 180, 123, 0.5),
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: glow 3s infinite ease-in-out;
}

.shape-3 {
  width: 100px;
  height: 100px;
  background: rgba(255, 107, 53, 0.4);
  box-shadow: 
    0 0 20px rgba(255, 107, 53, 0.5),
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: glow 3s infinite ease-in-out;
}

.shape-4 {
  width: 180px;
  height: 180px;
  background: rgba(247, 147, 30, 0.4);
  box-shadow: 
    0 0 28px rgba(247, 147, 30, 0.5),
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: glow 3s infinite ease-in-out;
}

.shape-5 {
  width: 120px;
  height: 120px;
  background: rgba(255, 140, 0, 0.4);
  box-shadow: 
    0 0 22px rgba(255, 140, 0, 0.5),
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: glow 3s infinite ease-in-out;
}

.shape-6 {
  width: 160px;
  height: 160px;
  background: rgba(255, 165, 0, 0.4);
  box-shadow: 
    0 0 26px rgba(255, 165, 0, 0.5),
    0 4px 20px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: glow 3s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
  }
  75% {
    transform: translateY(-20px) rotate(270deg);
  }
}

@keyframes bounce {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(80px, -60px);
  }
  50% {
    transform: translate(160px, 0px);
  }
  75% {
    transform: translate(80px, 60px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes bounceReverse {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(-70px, 70px);
  }
  50% {
    transform: translate(-140px, 0px);
  }
  75% {
    transform: translate(-70px, -70px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes bounceDiagonal {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(100px, 60px);
  }
  50% {
    transform: translate(200px, 0px);
  }
  75% {
    transform: translate(100px, -60px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes bounceVertical {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(0px, -80px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  75% {
    transform: translate(0px, 80px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes bounceHorizontal {
  0% {
    transform: translate(0px, 0px);
  }
  25% {
    transform: translate(120px, 0px);
  }
  50% {
    transform: translate(0px, 0px);
  }
  75% {
    transform: translate(-120px, 0px);
  }
  100% {
    transform: translate(0px, 0px);
  }
}

@keyframes glow {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
}

.error-container {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-large);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  padding: var(--spacing-xxl);
  max-width: 600px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 错误图标区域 */
.error-icon-section {
  margin-bottom: var(--spacing-xl);
}

.error-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-lg);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: pulse 2s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
}

.error-icon .icon {
  width: 60px;
  height: 60px;
  color: var(--bg-primary);
}

/* 不同错误类型的图标样式 - 橙色系渐变 */
.error-icon.client {
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  box-shadow: 0 0 20px rgba(255, 126, 95, 0.5);
}

.error-icon.auth {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
}

.error-icon.forbidden {
  background: linear-gradient(135deg, #ff8c00, #ffa500);
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.5);
}

.error-icon.not-found {
  background: linear-gradient(135deg, #ff7e5f, #ff6b35);
  box-shadow: 0 0 20px rgba(255, 126, 95, 0.5);
}

.error-icon.timeout {
  background: linear-gradient(135deg, #f7931e, #ff8c00);
  box-shadow: 0 0 20px rgba(247, 147, 30, 0.5);
}

.error-icon.server {
  background: linear-gradient(135deg, #ff6b35, #ff7e5f);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
}

.error-icon.bad-gateway {
  background: linear-gradient(135deg, #feb47b, #ffa500);
  box-shadow: 0 0 20px rgba(254, 180, 123, 0.5);
}

.error-icon.unavailable {
  background: linear-gradient(135deg, #ff8c00, #ff7e5f);
  box-shadow: 0 0 20px rgba(255, 140, 0, 0.5);
}

.error-icon.rate-limit {
  background: linear-gradient(135deg, #f7931e, #ff6b35);
  box-shadow: 0 0 20px rgba(247, 147, 30, 0.5);
}

.error-code {
  font-size: 72px;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: typewriter 1.5s steps(4) 0.5s both;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid white;
  animation: typewriter 1.5s steps(4) 0.5s both, blink 1s infinite 2s;
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  0%, 50% {
    border-color: white;
  }
  51%, 100% {
    border-color: transparent;
  }
}

/* 错误内容 */
.error-content {
  margin-bottom: var(--spacing-xl);
}

.error-title {
  font-size: var(--font-size-title);
  font-weight: 600;
  color: white;
  margin: 0 0 var(--spacing-md) 0;
  line-height: var(--line-height-tight);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out 1s both;
}

.error-description {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  line-height: var(--line-height-relaxed);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease-out 1.2s both;
}

/* 操作按钮 */
.error-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  justify-content: center;
  flex-wrap: wrap;
}

.error-actions .btn {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.error-actions .btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.error-actions .btn-primary {
  background: rgba(255, 107, 53, 0.3);
  color: white;
  border-color: rgba(255, 107, 53, 0.5);
}

.error-actions .btn-primary:hover {
  background: rgba(255, 107, 53, 0.5);
  border-color: rgba(255, 107, 53, 0.7);
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.3);
}

.error-actions .btn-secondary {
  background: rgba(254, 180, 123, 0.3);
  color: white;
  border-color: rgba(254, 180, 123, 0.5);
}

.error-actions .btn-secondary:hover {
  background: rgba(254, 180, 123, 0.5);
  border-color: rgba(254, 180, 123, 0.7);
  box-shadow: 0 0 20px rgba(254, 180, 123, 0.3);
}

.error-actions .btn-ghost {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.error-actions .btn-ghost:hover {
  background: rgba(255, 255, 255, 0.2);
}


/* 帮助对话框样式 */
.help-dialog :deep(.el-dialog) {
  border-radius: var(--radius-large);
}

.help-content {
  padding: var(--spacing-md) 0;
}

.help-section {
  margin-bottom: var(--spacing-lg);
}

.help-section h4 {
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.help-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-list li {
  border: 1px solid var(--border-light);
  border-radius: var(--radius-medium);
  margin-bottom: var(--spacing-sm);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.help-list li:hover {
  border-color: var(--primary-color);
  background: var(--bg-light);
}

.faq-question {
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: var(--text-primary);
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.chevron.expanded {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 var(--spacing-md) var(--spacing-md);
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
  border-top: 1px solid var(--border-light);
  background: var(--bg-secondary);
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--bg-secondary);
  border-radius: var(--radius-medium);
  color: var(--text-secondary);
}

.contact-icon {
  width: 16px;
  height: 16px;
  color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-container {
    padding: var(--spacing-lg);
    margin: var(--spacing-md);
  }
  
  .error-code {
    font-size: 56px;
  }
  
  .error-title {
    font-size: var(--font-size-xl);
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .btn {
    width: 100%;
    max-width: 200px;
  }
  
  .recommendation-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }
  
  .error-icon {
    width: 100px;
    height: 100px;
  }
  
  .error-icon .icon {
    width: 50px;
    height: 50px;
  }
  
  /* 移动端背景元素调整 */
  .floating-shape {
    animation-duration: 30s;
  }
  
  .shape-1, .shape-2, .shape-4, .shape-6 {
    width: 120px;
    height: 120px;
  }
  
  .shape-3, .shape-5 {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .recommendation-grid {
    grid-template-columns: 1fr;
  }
  
  .error-description {
    font-size: var(--font-size-md);
  }
  
  .help-dialog :deep(.el-dialog) {
    margin: 5vh auto;
    width: 95%;
  }
  
  /* 小屏幕背景元素进一步调整 */
  .floating-shape {
    animation-duration: 40s;
  }
  
  .shape-1, .shape-2, .shape-4, .shape-6 {
    width: 80px;
    height: 80px;
  }
  
  .shape-3, .shape-5 {
    width: 60px;
    height: 60px;
  }
}

/* 浏览器兼容性回退 */
@supports not (backdrop-filter: blur(20px)) {
  .error-container {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .floating-shape {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .recommendation-card {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .error-actions .btn {
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.2);
  }
}

/* 减少动画以提高性能 */
@media (prefers-reduced-motion: reduce) {
  .error-container,
  .error-title,
  .error-description,
  .recommendations h3 {
    animation: none;
  }
  
  .error-code {
    animation: none;
    border-right: none;
  }
  
  .error-icon {
    animation: none;
  }
  
  .floating-shape {
    animation: none;
  }
  
  .recommendation-card:hover,
  .error-actions .btn:hover {
    transform: none;
  }
}
</style>
