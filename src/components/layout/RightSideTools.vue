<template>
  <div class="right-side-tools" :class="{ collapsed: isCollapsed }" v-if="!isAuthPage">
    <ul class="tool-list">
      <li class="tool-item kefu" :class="{ active: hoverItem === 'kefu' }" @mouseenter="onHover('kefu')" @mouseleave="onLeave">
        <button class="tool-button" type="button" aria-label="联系客服">
          <Headphones class="tool-icon" />
          <span class="tool-label">客服</span>
        </button>
        <transition name="rst-popover">
          <div class="tool-popover qr" v-if="hoverItem === 'kefu'">
            <div class="qr-card">
              <div class="qr-box">
                <img class="qr-image" :src="whatsappQrImage" alt="WhatsApp 二维码" />
                <span class="corner tl"></span>
                <span class="corner tr"></span>
                <span class="corner bl"></span>
                <span class="corner br"></span>
              </div>
              <p class="qr-title">扫码联系 WhatsApp 客服</p>
              <p class="popover-text">在线时间：9:00~17:00</p>
            </div>
          </div>
        </transition>
      </li>
      <li class="tool-item wechat" :class="{ active: hoverItem === 'wechat' }" @mouseenter="onHover('wechat')" @mouseleave="onLeave">
        <button class="tool-button" type="button" aria-label="WeChat">
          <QrCode class="tool-icon" />
          <span class="tool-label">公众号</span>
        </button>
        <transition name="rst-popover">
          <div class="tool-popover qr" v-if="hoverItem === 'wechat'">
            <div class="qr-card">
              <div class="qr-box">
                <img class="qr-image" :src="wechatQrImage" alt="WeChat 二维码" />
                <span class="corner tl"></span>
                <span class="corner tr"></span>
                <span class="corner bl"></span>
                <span class="corner br"></span>
              </div>
              <p class="qr-title">扫码关注 公众号</p>
              <p class="popover-text">获取最新资讯与服务</p>
            </div>
          </div>
        </transition>
      </li>
      <li class="tool-item app" :class="{ active: hoverItem === 'app' }" @mouseenter="onHover('app')" @mouseleave="onLeave">
        <button class="tool-button" type="button" aria-label="APP 下载">
          <Smartphone class="tool-icon" />
          <span class="tool-label">APP</span>
        </button>
        <transition name="rst-popover">
          <div class="tool-popover qr" v-if="hoverItem === 'app'">
            <div class="qr-card">
              <div class="qr-box">
                <img class="qr-image" :src="appPlatform==='ios' ? appQrIos : appQrAndroid" alt="APP 下载二维码" />
                <span class="corner tl"></span>
                <span class="corner tr"></span>
                <span class="corner bl"></span>
                <span class="corner br"></span>
              </div>
              <p class="qr-title">APP 下载二维码</p>
              <p class="popover-text">手机扫码下载</p>
              <div class="download-actions">
                <a class="btn-download" :class="{ active: appPlatform==='ios' }" href="javascript:void(0)" @click.prevent="appPlatform='ios'">iPhone 版</a>
                <a class="btn-download" :class="{ active: appPlatform==='android' }" href="javascript:void(0)" @click.prevent="appPlatform='android'">Android 版</a>
              </div>
            </div>
          </div>
        </transition>
      </li>
      <li class="tool-item backtop" v-show="!isAtTop">
        <button class="tool-button" type="button" @click="scrollToTop" aria-label="返回顶部">
          <ArrowUp class="tool-icon" />
          <span class="tool-label">返回顶部</span>
        </button>
      </li>
    </ul>
    <!-- 折叠/展开开关按钮 -->
    <button 
      class="collapse-toggle" 
      type="button" 
      :aria-label="isCollapsed ? '展开工具栏' : '收起工具栏'"
      @click="isCollapsed = !isCollapsed"
    >
      <component :is="isCollapsed ? ChevronLeft : ChevronRight" class="collapse-icon" />
    </button>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Headphones, Smartphone, QrCode, ArrowUp, ChevronRight, ChevronLeft } from 'lucide-vue-next'

const route = useRoute()

const isAuthPage = computed(() => ['Login', 'Register'].includes(route.name))

const isCollapsed = ref(false)
const hoverItem = ref('')
let hideTimer = null

const activeAppPlatform = ref('ios')

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const isAtTop = ref(true)
const handleScroll = () => {
  isAtTop.value = (window.scrollY || window.pageYOffset) < 80
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 统一橙色方块“QR”占位二维码
const qrSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="#FF6A00"/><text x="90" y="110" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="#FFFFFF">QR</text></svg>'
const qrPlaceholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(qrSvg)
const whatsappQrImage = qrPlaceholder
const wechatQrImage = qrPlaceholder
const appQrIos = qrPlaceholder
const appQrAndroid = qrPlaceholder
const appPlatform = ref('ios')

const onHover = (key) => {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  hoverItem.value = key
}

const onLeave = () => {
  if (hideTimer) { clearTimeout(hideTimer) }
  hideTimer = setTimeout(() => { hoverItem.value = '' }, 300)
}
</script>

<style scoped>
.right-side-tools {
  position: fixed;
  right: 0;
  bottom: 25vh; /* 距底部25% */
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.right-side-tools.collapsed { opacity: 1; }

.tool-list { 
  list-style: none; 
  display: inline-flex; 
  flex-direction: column; 
  border: 1.5px solid rgba(255,255,255,0.55);
  border-radius: 14px;
  background: rgba(255,255,255,0.24);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  transition: transform .42s cubic-bezier(.2,.8,.2,1);
}

.right-side-tools.collapsed .tool-list { transform: translateX(60px); }

.tool-item {
  position: relative;
}

.tool-item + .tool-item .tool-button {
  border-top: 1px solid rgba(255,255,255,0.45);
}

.tool-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 80px;
  height: 80px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--text-primary, #333);
  cursor: pointer;
  box-shadow: none;
  transition: all 0.2s ease;
  outline: none;
}

.tool-item:hover .tool-button,
.tool-item.active .tool-button {
  background: rgba(255,106,0,0.12);
  color: var(--text-primary, #333);
  box-shadow: 0 6px 18px rgba(255,106,0,.18);
}

.tool-item:hover .tool-icon,
.tool-item.active .tool-icon,
.tool-item:hover .tool-label,
.tool-item.active .tool-label {
  color: var(--primary-color, #FF6A00);
}

.tool-icon {
  width: 24px;
  height: 24px;
  color: var(--primary-color, #FF6A00);
}

.tool-label {
  font-size: 13px;
  font-weight: 600;
}

.tool-popover {
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 10px;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.45);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  white-space: nowrap;
  text-align: center;
  overflow: hidden; /* 让渐变边框遮罩贴合圆角 */
  background-clip: padding-box; /* 渐变边框使用 */
  will-change: auto;
}

/* 提升“雾感”的轻薄叠加层（不影响点击） */
.tool-popover::before { content: none !important; display: none !important; }


.tool-popover.qr {
  padding: 12px;
}

.qr-card { padding: 8px 8px 12px; }

.qr-image {
  width: 180px;
  height: 180px;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
}

.qr-box {
  position: relative;
  display: inline-block;
}

.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--primary-color, #FF6A00);
}

.corner.tl { left: -8px; top: -8px; border-left: 2px solid; border-top: 2px solid; border-left-color: var(--primary-color, #FF6A00); border-top-color: var(--primary-color, #FF6A00); }
.corner.tr { right: -8px; top: -8px; border-right: 2px solid; border-top: 2px solid; border-right-color: var(--primary-color, #FF6A00); border-top-color: var(--primary-color, #FF6A00); }
.corner.bl { left: -8px; bottom: -8px; border-left: 2px solid; border-bottom: 2px solid; border-left-color: var(--primary-color, #FF6A00); border-bottom-color: var(--primary-color, #FF6A00); }
.corner.br { right: -8px; bottom: -8px; border-right: 2px solid; border-bottom: 2px solid; border-right-color: var(--primary-color, #FF6A00); border-bottom-color: var(--primary-color, #FF6A00); }

.qr-title { margin-top: 10px; margin-bottom: 6px; font-size: 14px; font-weight: 700; color: #1f2937; text-align: center; letter-spacing: .2px; }

.tool-popover::after { content: ''; position: absolute; right: -7px; top: 50%; width: 12px; height: 12px; transform: translateY(-50%) rotate(45deg); background: rgba(255,255,255,0.72); border-right: 1px solid rgba(255,255,255,0.65); border-bottom: 1px solid rgba(255,255,255,0.65); backdrop-filter: saturate(160%) blur(18px); -webkit-backdrop-filter: saturate(160%) blur(18px); box-shadow: 0 6px 16px rgba(0,0,0,.08); }
/* 移除侧边工具栏弹窗箭头 */
.tool-popover::after { display: none !important; content: none !important; }

.download-actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
}

.btn-download {
  display: inline-block;
  padding: 7px 12px;
  border: 1px solid var(--primary-color, #FF6A00);
  color: var(--primary-color, #FF6A00);
  border-radius: 6px;
  font-size: 13px;
  text-decoration: none;
  min-width: 96px;
}

.btn-download:hover {
  background: var(--primary-color, #FF6A00);
  color: #fff;
}

.btn-download.active {
  background: var(--primary-color, #FF6A00);
  color: #fff;
}

.popover-link {
  display: block;
  color: var(--primary-color, #FF6A00);
  text-decoration: none;
  margin: 4px 0;
}

.popover-text { font-size: 12px; color: #6b7280; }

@media (max-width: 1024px) {
  .right-side-tools {
    right: 8px;
  }
}

/* 弹层过渡动画 */
.rst-popover-enter-from,
.rst-popover-leave-to {
  opacity: 0;
  transform: translate(-8px, -50%) scale(0.96);
}

.rst-popover-enter-active { transition: all .15s ease; }
.rst-popover-leave-active { transition: none !important; }

@media (max-width: 768px) {
  .right-side-tools {
    display: none; /* 移动端隐藏 */
  }
}

/* 折叠开关按钮 */
.collapse-toggle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.55);
  background: rgba(255,255,255,0.28);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform .42s cubic-bezier(.16,.84,.24,1), background .2s ease, box-shadow .2s ease;
}

.collapse-toggle:hover { 
  transform: translateY(-1px);
  background: rgba(255,255,255,0.36);
  box-shadow: 0 10px 26px rgba(0,0,0,0.16);
}

.collapse-icon { width: 20px; height: 20px; color: #333; }
</style>


