<template>
  <button 
    class="publish-button" 
    :class="buttonClass"
    @click="handleClick" 
    :title="title"
    :aria-label="ariaLabel"
  >
    <Plus class="publish-icon" />
    <span v-if="showText" class="publish-text">{{ text }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'

const props = defineProps({
  // 按钮位置类型
  position: {
    type: String,
    default: 'fixed', // 'fixed' | 'relative' | 'absolute'
    validator: (value) => ['fixed', 'relative', 'absolute'].includes(value)
  },
  // 按钮大小
  size: {
    type: String,
    default: 'medium', // 'small' | 'medium' | 'large'
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  // 是否显示文字
  showText: {
    type: Boolean,
    default: true
  },
  // 按钮文字
  text: {
    type: String,
    default: '我要发布'
  },
  // 标题属性
  title: {
    type: String,
    default: '我要发布'
  },
  // 无障碍标签
  ariaLabel: {
    type: String,
    default: '发布新内容'
  },
  // 路由路径
  routePath: {
    type: String,
    default: '/publish'
  },
  // 路由查询参数
  routeQuery: {
    type: Object,
    default: () => ({})
  },
  // 自定义点击处理
  onClick: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['click'])

const router = useRouter()

// 计算按钮样式类
const buttonClass = computed(() => {
  return [
    `publish-button--${props.position}`,
    `publish-button--${props.size}`,
    {
      'publish-button--text-hidden': !props.showText
    }
  ]
})

// 处理点击事件
const handleClick = () => {
  emit('click')
  
  if (props.onClick) {
    props.onClick()
  } else {
    // 智能路由跳转：若仍为旧默认 '/publish'，根据当前页面选择目标发布页
    let toPath = props.routePath
    if (toPath === '/publish') {
      const currentPath = router.currentRoute.value.path || ''
      if (currentPath.startsWith('/news')) {
        toPath = '/publish/news'
      } else if (currentPath.startsWith('/circles') || currentPath.startsWith('/lifestyle')) {
        toPath = '/publish/circles'
      } else if (
        currentPath.startsWith('/services') ||
        currentPath.startsWith('/housing') ||
        currentPath.startsWith('/jobs') ||
        currentPath.startsWith('/rent') ||
        currentPath.startsWith('/cars')
      ) {
        toPath = '/publish/services'
      } else {
        // 回退到资讯发布
        toPath = '/publish/news'
      }
    }
    router.push({ path: toPath, query: props.routeQuery })
  }
}
</script>

<style scoped>
/* iOS 26 Liquid Glass 发布按钮 */
.publish-button {
  border: none;
  border-radius: 50%;
  /* 橙色染色玻璃背景 - Cosmic Orange */
  background: 
    linear-gradient(135deg, 
      rgba(255, 140, 0, 0.65) 0%, 
      rgba(255, 165, 0, 0.55) 50%,
      rgba(255, 180, 20, 0.6) 100%
    );
  /* Liquid Glass 核心效果 */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  cursor: pointer;
  /* 多层阴影 - 增强深度感 */
  box-shadow: 
    0 8px 32px rgba(255, 140, 0, 0.35),
    0 4px 16px rgba(255, 165, 0, 0.25),
    0 1px 4px rgba(255, 180, 20, 0.15),
    inset 0 1px 1px rgba(255, 255, 255, 0.4),
    inset 0 -1px 1px rgba(255, 100, 0, 0.2);
  /* 流动过渡效果 */
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  /* 3D变换优化 */
  transform: translateZ(0);
  transform-style: preserve-3d;
  will-change: transform, box-shadow;
  font-family: inherit;
  margin: 0;
  padding: 0;
  outline: none;
  /* 玻璃边框 */
  border: 1px solid rgba(255, 255, 255, 0.25);
  /* 微妙的内部发光 */
  position: relative;
}

/* 外层光晕 - 环境光效果 */
.publish-button::before {
  content: '';
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 50%;
  background: 
    radial-gradient(circle at 30% 30%, 
      rgba(255, 180, 50, 0.4) 0%,
      rgba(255, 140, 0, 0.3) 30%,
      transparent 70%
    );
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: -1;
  filter: blur(12px);
  animation: ambientGlow 3s ease-in-out infinite;
}

/* 内部液态光效 - 动态反射 */
.publish-button::after {
  content: '';
  position: absolute;
  top: 15%;
  left: 15%;
  width: 40%;
  height: 40%;
  background: 
    radial-gradient(circle at center, 
      rgba(255, 255, 255, 0.5) 0%, 
      rgba(255, 255, 255, 0.2) 40%,
      transparent 70%
    );
  border-radius: 50%;
  transform: translate(0, 0);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  filter: blur(8px);
  animation: liquidShine 2s ease-in-out infinite;
}

/* 悬停状态 - 液态玻璃交互效果 */
.publish-button:hover {
  transform: scale(1.12) translateZ(10px);
  /* 增强玻璃折射效果 */
  background: 
    linear-gradient(135deg, 
      rgba(255, 160, 20, 0.75) 0%, 
      rgba(255, 180, 30, 0.65) 50%,
      rgba(255, 200, 50, 0.7) 100%
    );
  backdrop-filter: blur(24px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter: blur(24px) saturate(200%) brightness(1.1);
  /* 强化光影深度 */
  box-shadow: 
    0 16px 48px rgba(255, 140, 0, 0.45),
    0 8px 24px rgba(255, 165, 0, 0.35),
    0 2px 8px rgba(255, 180, 20, 0.25),
    inset 0 2px 2px rgba(255, 255, 255, 0.5),
    inset 0 -2px 2px rgba(255, 120, 0, 0.25),
    0 0 40px rgba(255, 165, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.publish-button:hover::before {
  opacity: 0.8;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  filter: blur(16px);
}

.publish-button:hover::after {
  width: 60%;
  height: 60%;
  top: 10%;
  left: 10%;
  filter: blur(6px);
  background: 
    radial-gradient(circle at center, 
      rgba(255, 255, 255, 0.7) 0%, 
      rgba(255, 255, 255, 0.3) 40%,
      transparent 70%
    );
}

/* 按下状态 - 流体响应 */
.publish-button:active {
  transform: scale(1.08) translateZ(5px);
  transition-duration: 0.15s;
  box-shadow: 
    0 10px 32px rgba(255, 140, 0, 0.4),
    0 4px 16px rgba(255, 165, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.4),
    inset 0 -1px 2px rgba(255, 120, 0, 0.3);
}

/* 环境光动画 */
@keyframes ambientGlow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

/* 液态光泽动画 */
@keyframes liquidShine {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: translate(-5%, -5%) rotate(180deg);
    opacity: 1;
  }
}

/* 位置样式 */
.publish-button--fixed {
  position: fixed !important;
  bottom: 24px !important;
  left: 24px !important;
  z-index: 1200 !important;
  /* 确保按钮始终可见 */
  visibility: visible !important;
  opacity: 1 !important;
}

.publish-button--relative {
  position: relative;
}

.publish-button--absolute {
  position: absolute;
}

/* 尺寸样式 */
.publish-button--small {
  width: 48px;
  height: 48px;
}

.publish-button--medium {
  width: 56px;
  height: 56px;
}

.publish-button--large {
  width: 64px;
  height: 64px;
}

/* 加号图标 - 玻璃质感优化 */
.publish-button .publish-icon {
  width: 24px;
  height: 24px;
  color: white;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 1;
  /* 图标光晕效果 */
  filter: drop-shadow(0 2px 4px rgba(255, 140, 0, 0.4))
          drop-shadow(0 0 8px rgba(255, 255, 255, 0.3));
  stroke-width: 2.5;
}

.publish-button--small .publish-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2.2;
}

.publish-button--large .publish-icon {
  width: 28px;
  height: 28px;
  stroke-width: 2.8;
}

.publish-button:hover .publish-icon {
  transform: rotate(90deg) scale(1.15);
  filter: drop-shadow(0 3px 6px rgba(255, 140, 0, 0.6))
          drop-shadow(0 0 12px rgba(255, 255, 255, 0.5));
}

/* 按钮文字标签 - Liquid Glass 风格 */
.publish-button .publish-text {
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  /* 橙色染色玻璃背景 */
  background: 
    linear-gradient(135deg, 
      rgba(255, 140, 0, 0.55) 0%, 
      rgba(255, 165, 0, 0.45) 100%
    );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  color: white;
  padding: 10px 18px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* 玻璃边框和阴影 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 8px 24px rgba(255, 140, 0, 0.3),
    0 4px 12px rgba(255, 165, 0, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.4);
  /* 文字光晕 */
  text-shadow: 
    0 1px 2px rgba(255, 140, 0, 0.5),
    0 0 8px rgba(255, 255, 255, 0.3);
}

.publish-button:hover .publish-text {
  opacity: 1;
  transform: translateY(-50%) translateX(-12px) scale(1.02);
  background: 
    linear-gradient(135deg, 
      rgba(255, 160, 20, 0.65) 0%, 
      rgba(255, 180, 30, 0.55) 100%
    );
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  box-shadow: 
    0 12px 32px rgba(255, 140, 0, 0.4),
    0 6px 16px rgba(255, 165, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.5);
}

.publish-button--text-hidden .publish-text {
  display: none;
}

/* 液态玻璃脉冲动画 */
@keyframes pulse {
  0% {
    box-shadow: 
      0 8px 32px rgba(255, 140, 0, 0.35),
      0 4px 16px rgba(255, 165, 0, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 
      0 12px 40px rgba(255, 140, 0, 0.45),
      0 6px 20px rgba(255, 165, 0, 0.35),
      0 0 0 12px rgba(255, 165, 0, 0.15),
      inset 0 1px 1px rgba(255, 255, 255, 0.5);
  }
  100% {
    box-shadow: 
      0 8px 32px rgba(255, 140, 0, 0.35),
      0 4px 16px rgba(255, 165, 0, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.4);
  }
}

/* 可选的脉冲效果（通过类名启用） */
.publish-button--pulse {
  animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 液态波纹扩散动画（可选） */
@keyframes liquidRipple {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* 响应式设计 - 保持液态玻璃效果 */
@media (max-width: 768px) {
  .publish-button--fixed {
    bottom: 20px;
    left: 20px;
  }
  
  .publish-button--medium {
    width: 52px;
    height: 52px;
  }
  
  .publish-button--medium .publish-icon {
    width: 22px;
    height: 22px;
    stroke-width: 2.3;
  }
  
  .publish-button .publish-text {
    display: none; /* 移动端隐藏文字标签 */
  }
  
  /* 移动端优化玻璃效果 */
  .publish-button {
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
  }
  
  .publish-button:hover {
    backdrop-filter: blur(20px) saturate(200%);
    -webkit-backdrop-filter: blur(20px) saturate(200%);
  }
}

@media (max-width: 480px) {
  .publish-button--fixed {
    bottom: 16px;
    left: 16px;
  }
  
  .publish-button--medium {
    width: 48px;
    height: 48px;
  }
  
  .publish-button--medium .publish-icon {
    width: 20px;
    height: 20px;
    stroke-width: 2.2;
  }
  
  /* 小屏幕优化 - 减少模糊以提升性能 */
  .publish-button {
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
  }
  
  .publish-button:hover {
    transform: scale(1.1);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
  }
}

/* 高性能设备增强效果 */
@media (hover: hover) and (pointer: fine) {
  .publish-button {
    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  /* 鼠标移动追踪光效（可选高级效果） */
  .publish-button:hover::after {
    animation: liquidShine 2s ease-in-out infinite;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .publish-button {
    /* 深色模式下增强玻璃对比度 */
    background: 
      linear-gradient(135deg, 
        rgba(255, 140, 0, 0.75) 0%, 
        rgba(255, 165, 0, 0.65) 50%,
        rgba(255, 180, 20, 0.7) 100%
      );
    box-shadow: 
      0 8px 32px rgba(255, 140, 0, 0.45),
      0 4px 16px rgba(255, 165, 0, 0.35),
      0 1px 4px rgba(255, 180, 20, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.5),
      inset 0 -1px 1px rgba(255, 100, 0, 0.3);
  }
  
  .publish-button:hover {
    background: 
      linear-gradient(135deg, 
        rgba(255, 160, 20, 0.85) 0%, 
        rgba(255, 180, 30, 0.75) 50%,
        rgba(255, 200, 50, 0.8) 100%
      );
  }
}

/* 减弱动画效果（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .publish-button,
  .publish-button::before,
  .publish-button::after,
  .publish-button .publish-icon,
  .publish-button .publish-text {
    animation: none !important;
    transition-duration: 0.2s !important;
  }
  
  .publish-button:hover .publish-icon {
    transform: rotate(0deg) scale(1.05);
  }
}
</style>
