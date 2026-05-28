<template>
  <!-- 固定导航栏 - 完全复制原始导航栏 -->
  <section 
    class="app-header nav-section"
  >
    <div class="container">
      <div class="nav-content">
        <!-- Logo和网站名 -->
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <img src="/logo.png" alt="知马网" class="logo-img">
            <span class="site-name">知马网</span>
          </router-link>
        </div>
        
        <!-- 主导航 -->
        <div class="main-nav">
          <template v-for="navItem in mainNavItems" :key="navItem.name">
            <!-- 普通导航链接 -->
            <router-link 
              v-if="!navItem.hasQR"
              :to="navItem.path" 
              class="nav-item"
              :class="{ active: $route.name === navItem.name }"
            >
              {{ navItem.label }}
            </router-link>
            
            <!-- 带二维码的导航项 -->
            <div 
              v-else
              class="nav-item nav-item-qr nav-hover-card"
              @mouseenter="showQR(navItem.name)"
              @mouseleave="hideQR(navItem.name)"
            >
              {{ navItem.label }}
              <!-- 二维码弹窗（与首页一致：玻璃态 + 黑色四角） -->
              <div 
                class="top-qr-popover"
                :class="{ 'show': qrVisible[navItem.name], 'type-app': navItem.name === 'App' }"
              >
                <template v-if="navItem.name === 'App'">
                  <div class="qr-card">
                    <div class="qr-box">
                      <img class="qr-image" :src="navAppCurrentQr" alt="APP 下载二维码" />
                      <span class="corner tl"></span>
                      <span class="corner tr"></span>
                      <span class="corner bl"></span>
                      <span class="corner br"></span>
                    </div>
                    <p class="qr-title">手机扫码下载</p>
                    <div class="download-actions">
                      <button type="button" class="btn-download" :class="{ active: navAppActivePlatform === 'ios' }" @click.stop="navAppActivePlatform = 'ios'">iPhone版</button>
                      <button type="button" class="btn-download" :class="{ active: navAppActivePlatform === 'android' }" @click.stop="navAppActivePlatform = 'android'">安卓版</button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="qr-card">
                    <div class="qr-box">
                      <img :src="navItem.qrImage" :alt="navItem.label + '二维码'" class="qr-image">
                      <span class="corner tl"></span>
                      <span class="corner tr"></span>
                      <span class="corner bl"></span>
                      <span class="corner br"></span>
                    </div>
                    <p class="qr-title">{{ navItem.qrText }}</p>
                    <p class="popover-text">工作日 9:00-17:00</p>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
        
        <!-- 用户操作区 -->
        <div class="user-actions">
          <template v-if="userStore.isLoggedIn">
            <!-- 企业认证按钮（仅在个人中心页面显示） -->
            <router-link v-if="isProfilePage" to="/auth/company" class="company-auth-btn">
              <el-icon><OfficeBuilding /></el-icon>
              企业认证
            </router-link>
            <router-link to="/profile" class="user-info-link">
              <div class="user-info">
                <img :src="userStore.userAvatar" alt="头像" class="user-avatar">
                <span class="username">{{ userStore.userNickname }}</span>
              </div>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/auth/login" class="auth-login">登录</router-link>
            <router-link to="/auth/register" class="auth-register">注册</router-link>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OfficeBuilding } from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()

// 判断是否在个人中心页面
const isProfilePage = computed(() => {
  return route.path === '/profile' || route.path.startsWith('/user/')
})

// 导航菜单
const mainNavItems = ref([
  { name: 'Home', path: '/', label: '首页', hasQR: false, hasNewsPreview: false },
  { name: 'News', path: '/news', label: '资讯', hasQR: false, hasNewsPreview: true },
  { name: 'Services', path: '/services', label: '知马同城', hasQR: false, hasNewsPreview: false },
  { name: 'Circles', path: '/circles', label: '知马圈', hasQR: false, hasNewsPreview: false },
  { 
    name: 'Ads', 
    path: '#', 
    label: '广告咨询', 
    hasQR: true,
    hasNewsPreview: false,
    qrImage: '/placeholder-qr.svg',
    qrText: '扫码添加WhatsApp咨询'
  },
  { 
    name: 'App', 
    path: '#', 
    label: 'APP下载', 
    hasQR: true,
    hasNewsPreview: false,
    qrImage: '/placeholder-qr.svg',
    qrText: '手机扫码下载',
    iosLink: '#',
    androidLink: '#'
  }
])

// 二维码显示状态
const qrVisible = ref({
  Ads: false,
  App: false
})

// 二维码显示控制函数
const showQR = (itemName) => {
  qrVisible.value[itemName] = true
}

const hideQR = (itemName) => {
  qrVisible.value[itemName] = false
}

// APP下载二维码数据
const navQrSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="#FF6A00"/><text x="90" y="110" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="#FFFFFF">QR</text></svg>'
const navQrPlaceholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(navQrSvg)
const navIosQr = ref(navQrPlaceholder)
const navAndroidQr = ref(navQrPlaceholder)
const navAppActivePlatform = ref('ios')
const navAppCurrentQr = computed(() => navAppActivePlatform.value === 'ios' ? navIosQr.value : navAndroidQr.value)
</script>

<style scoped>
/* 固定导航栏样式 - 完全复制原始导航栏样式 */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: none;
  transform: translateY(0);
}

/* 以下样式完全复制原始导航栏 */
.nav-section {
  background: white;
  border-bottom: 1px solid var(--border-primary);
  padding: 12px 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo区域 */
.logo-section {
  margin-right: 32px;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.logo-link:hover {
  background: rgba(255, 106, 0, 0.1);
}

.logo-img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.site-name {
  font-size: 22px;
  font-weight: 400;
  color: #FF6A00;
  text-shadow: 0 1px 2px rgba(255, 106, 0, 0.2);
  font-family: 'YouSheBiaoTiHei', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  font-synthesis: none;
  letter-spacing: 0.5px;
}

.main-nav {
  display: flex;
  gap: 30px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  padding: 8px 16px;
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  border-radius: var(--radius-medium);
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.nav-item:hover {
  background: transparent;
  color: var(--primary-color);
}

.nav-item.active {
  background: transparent;
  color: var(--primary-color);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -2px;
  transform: translateX(-50%);
  width: 28px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
  pointer-events: none;
}

/* 带二维码的导航项样式 */
.nav-item-qr {
  position: relative;
  cursor: pointer;
}

.nav-item-qr:hover {
  background: transparent;
  color: var(--primary-color);
}

/* 顶部导航 hover 二维码弹层（与首页统一） */
.nav-hover-card {
  position: relative;
  cursor: default;
}

.top-qr-popover {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(255,255,255,0.65);
  border-radius: 12px;
  box-shadow: 0 14px 32px rgba(0,0,0,0.16), 0 6px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.45);
  backdrop-filter: saturate(160%) blur(18px);
  -webkit-backdrop-filter: saturate(160%) blur(18px);
  padding: 14px 16px;
  opacity: 0;
  visibility: hidden;
  transition: all .15s ease;
  z-index: 1001;
  min-width: 200px;
}

.top-qr-popover.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(6px);
}

.qr-card { text-align: center; padding: 8px 8px 12px; }
.qr-card .qr-image { width: 156px; height: 156px; display: block; margin: 0; border-radius: 10px; box-shadow: 0 6px 18px rgba(0,0,0,.08); position: relative; z-index: 1; }
.qr-card .qr-text { font-size: 12px; color: #6b7280; }
.qr-title { margin-top: 10px; margin-bottom: 6px; font-size: 14px; font-weight: 700; color: #1f2937; text-align: center; letter-spacing: .2px; }
.download-actions { display: flex; flex-direction: row; gap: 8px; margin-top: 10px; justify-content: center; align-items: center; flex-wrap: nowrap; }
.btn-download { display: inline-block; padding: 6px 10px; border: 1px solid var(--primary-color, #FF6A00); color: var(--primary-color, #FF6A00); border-radius: 6px; font-size: 12px; text-decoration: none; min-width: 88px; background: transparent; cursor: pointer; white-space: nowrap; }
.btn-download:hover { background: var(--primary-color, #FF6A00); color: #fff; }
.btn-download.active { background: var(--primary-color, #FF6A00); color: #fff; }
.popover-text { font-size: 12px; color: #6b7280; margin-top: 2px; }
.qr-box { position: relative; display: flex; align-items: center; justify-content: center; width: 180px; height: 180px; margin: 0 auto 8px; }
.corner { position: absolute; width: 22px; height: 22px; border-color: #000; z-index: 2; pointer-events: none; }
.corner.tl { left: 0; top: 0; transform: translate(6px, 6px); border-left: 2px solid; border-top: 2px solid; }
.corner.tr { right: 0; top: 0; transform: translate(-6px, 6px); border-right: 2px solid; border-top: 2px solid; }
.corner.bl { left: 0; bottom: 0; transform: translate(6px, -6px); border-left: 2px solid; border-bottom: 2px solid; }
.corner.br { right: 0; bottom: 0; transform: translate(-6px, -6px); border-right: 2px solid; border-bottom: 2px solid; }

/* APP下载弹窗样式 */
.app-download-card { text-align: center; padding: 8px 6px 10px; }
.app-download-card .qr-box { position: relative; width: 200px; height: 200px; margin: 0 auto 10px; background: #FF6A00; display: flex; align-items: center; justify-content: center; }
.app-download-card .qr-image-large { width: 180px; height: 180px; object-fit: cover; background: #fff; }
.app-download-card .corner { position: absolute; width: 22px; height: 22px; border: 3px solid #333; }
.app-download-card .corner.tl { top: 6px; left: 6px; border-right: none; border-bottom: none; }
.app-download-card .corner.tr { top: 6px; right: 6px; border-left: none; border-bottom: none; }
.app-download-card .corner.bl { bottom: 6px; left: 6px; border-right: none; border-top: none; }
.app-download-card .corner.br { bottom: 6px; right: 6px; border-left: none; border-top: none; }
.app-download-card .download-title { color: #808080; font-size: 14px; margin: 4px 0 8px; }
.app-download-card .download-buttons { display: flex; flex-direction: column; gap: 10px; align-items: center; }
.app-download-card .download-btn { display: inline-block; min-width: 140px; padding: 10px 16px; border-radius: 8px; border: 2px solid var(--primary-color); color: var(--primary-color); background: #fff; text-decoration: none; font-weight: 600; }
.app-download-card .download-btn:hover { background: var(--primary-color); color: #fff; }

/* 新闻预览导航项样式 */
.nav-item-news {
  position: relative;
  cursor: pointer;
}

.nav-item-news:hover {
  background: transparent;
  color: var(--primary-color);
}

/* 新闻预览弹窗 */
.news-preview-popup {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-top: 10px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1001;
  width: 360px;
  border: 1px solid #e0e0e0;
}

.news-preview-popup.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.news-preview-popup::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid white;
  z-index: 1002;
}

.news-preview-popup::after {
  content: '';
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 7px solid #e0e0e0;
  z-index: 1001;
}

.news-preview-container {
  display: flex;
  padding: 15px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.news-preview-container:hover {
  background: #f8f9fa;
}

.news-preview-image {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f5f5f5;
}

.news-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-preview-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-preview-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-preview-summary {
  font-size: 12px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.news-preview-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 11px;
  color: #999;
  margin-top: auto;
}

.news-time {
  color: #888;
}

.news-views,
.news-comments {
  color: #666;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info-link {
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.user-info-link:hover {
  opacity: 0.8;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-round);
  object-fit: cover;
}

.username {
  font-weight: 500;
  color: var(--text-primary);
}

.auth-login {
  color: #333333;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  font-size: 16px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: #f8f9fa;
  transition: all 0.2s ease;
}

.auth-login:hover {
  background: linear-gradient(135deg, var(--primary-color) 0%, #e55a2b 100%);
  color: #ffffff;
  border-color: var(--primary-color);
}

.auth-register {
  color: var(--text-primary);
  background: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  box-shadow: none;
  font-size: 16px;
  border: 2px solid var(--primary-color);
}

.auth-register:hover {
  background: var(--primary-hover);
  color: #fff;
}

.separator {
  color: var(--text-light);
}

.company-auth-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  background: rgba(255, 106, 0, 0.05);
  transition: all 0.2s ease;
  font-size: 14px;
  white-space: nowrap;
}

.company-auth-btn:hover {
  background: var(--primary-color);
  color: white;
}

.company-auth-btn .el-icon {
  font-size: 16px;
}
</style>