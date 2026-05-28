<template>
  <div class="homepage-redesign" role="main" aria-label="知马网首页">
     <!-- 最顶部四个广告横幅 -->
    <section class="top-ads" role="region" aria-label="顶部推广区域">
      <div class="promo-top-item promo-slot">
        <img src="https://picsum.photos/1250/416?random=1" alt="推广内容1" class="ad-image" loading="lazy" decoding="async" />
      </div>
      <div class="promo-top-item promo-slot">
        <img src="https://picsum.photos/1250/416?random=2" alt="推广内容2" class="ad-image" loading="lazy" decoding="async" />
      </div>
      <div class="promo-top-item promo-slot">
        <img src="https://picsum.photos/1250/416?random=3" alt="推广内容3" class="ad-image" loading="lazy" decoding="async" />
      </div>
      <div class="promo-top-item promo-slot">
        <img src="https://picsum.photos/1250/416?random=4" alt="推广内容4" class="ad-image" loading="lazy" decoding="async" />
      </div>
     </section>

    <!-- Logo + Slogan + 搜索栏区域 -->
    <section class="header-section" role="banner">
      <div class="container">
        <div class="header-content">
          <!-- Logo 和 Slogan -->
          <div class="logo-area">
            <img src="/logo.png" alt="知马网" class="site-logo" loading="eager" decoding="async" />
            <div class="logo">
              <h1 class="logo-text">知马网</h1>
              <span class="domain">zhimawang.com</span>
            </div>
            <div class="slogan">
              <span class="slogan-main">知马网APP</span>
              <span class="slogan-sub">大马华人都在用</span>
            </div>
          </div>
          
          <!-- 搜索栏（含类型选择） -->
          <div class="search-area" role="search" aria-label="网站搜索">
            <div class="search-container-beautiful">
            <div class="search-type-selector">
              <div class="custom-select-wrapper">
                <button 
                  class="search-select-dropdown" 
                  @click="toggleDropdown"
                  :class="{ 'is-open': dropdownOpen }"
                  :aria-expanded="dropdownOpen"
                  :aria-haspopup="true"
                  aria-label="选择搜索类型"
                >
                  <span class="selected-text">{{ getSelectedLabel() }}</span>
                  <svg class="dropdown-arrow" :class="{ 'rotated': dropdownOpen }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>
                <div class="dropdown-menu" v-show="dropdownOpen" role="menu" aria-label="搜索类型选项">
                  <button 
                    v-for="opt in searchOptions" 
                    :key="opt.value"
                    class="dropdown-option"
                    :class="{ 'selected': searchType === opt.value }"
                    @click="selectOption(opt.value)"
                    role="menuitem"
                    :aria-current="searchType === opt.value ? 'true' : 'false'"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>
            </div>
              
              <div class="search-input-container">
                <Search class="search-icon-new" :size="20" aria-hidden="true" />
                <input 
                  v-model="searchKeyword" 
                  type="text" 
                  :placeholder="getSearchPlaceholder()" 
                  class="search-input-new"
                  @keyup.enter="handleSearch"
                  @focus="onSearchFocus"
                  @blur="onSearchBlur"
                  aria-label="搜索输入框"
                  autocomplete="off"
                >
                <button 
                  v-if="searchKeyword" 
                  class="clear-btn-new"
                  @click="clearSearch"
                  title="清除搜索"
                  aria-label="清除搜索内容"
                >
                  <X :size="16" aria-hidden="true" />
                </button>
              </div>
              
              <button 
                class="search-btn-new" 
                @click="handleSearch" 
                :disabled="!searchKeyword.trim()"
                title="搜索"
                aria-label="执行搜索"
              >
                <span class="btn-text">搜索</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 导航栏 -->
    <section class="nav-section" ref="originalNavRef">
      <div class="container">
        <div class="nav-content">
          <!-- 主导航 -->
          <div class="main-nav">
            <template v-for="navItem in mainNavItems" :key="navItem.name">
              <span 
                v-if="navItem.name === 'Ads' || navItem.name === 'App'"
                class="nav-item nav-hover-card disabled"
                aria-disabled="true"
                @mouseenter="showTopNavCard(navItem.name)"
                @mouseleave="hideTopNavCard(navItem.name)"
              >
                {{ navItem.label }}
                <div class="top-qr-popover" :class="{ show: topNavCardVisible[navItem.name], 'type-app': navItem.name === 'App' }">
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
                        <img :src="navItem.qrImage" alt="二维码" class="qr-image" />
                        <span class="corner tl"></span>
                        <span class="corner tr"></span>
                        <span class="corner bl"></span>
                        <span class="corner br"></span>
                      </div>
                      <p class="qr-title">{{ navItem.qrText }}</p>
                      <p class="popover-text">平台咨询通道，工作日 9:00-17:00</p>
                    </div>
                  </template>
                </div>
              </span>
              <router-link 
                v-else
                :to="navItem.path" 
                class="nav-item"
                :class="{ active: $route.name === navItem.name }"
              >
                {{ navItem.label }}
              </router-link>
            </template>
          </div>
          
          <!-- 用户操作区 -->
          <div class="user-actions">
            <template v-if="userStore.isLoggedIn">
              <div class="user-info" @click="$router.push(`/user/${userStore.userInfo?.id}`)" style="cursor:pointer;">
                <img :src="userStore.userAvatar" alt="头像" class="user-avatar">
                <span class="username">{{ userStore.userNickname }}</span>
              </div>
            </template>
            <template v-else>
              <router-link to="/auth/login" class="auth-login">登录</router-link>
              <router-link to="/auth/register" class="auth-register">注册</router-link>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- 板块快捷入口 -->
    <section class="quick-access">
      <div class="container">
        <div class="hy-fenlei">
          <span class="hy-corner hy-tl"></span>
          <span class="hy-corner hy-tr"></span>
          <span class="hy-corner hy-bl"></span>
          <span class="hy-corner hy-br"></span>
          <ul class="hy-list">
            <li class="s1">
              <div class="hy-suvicon">
                <MapPin class="icon" />
                <p>同城</p>
              </div>
              <div class="hy-suvlist">
                <router-link v-for="item in cityConvenienceSubcategories" :key="item.label" :to="item.to">{{ item.label }}</router-link>
              </div>
            </li>
            <li class="s2">
              <div class="hy-suvicon">
                <Newspaper class="icon" />
                <p>资讯</p>
              </div>
              <div class="hy-suvlist">
                <router-link v-for="item in newsQuickLinks" :key="item.label" :to="item.to">{{ item.label }}</router-link>
              </div>
            </li>
            <li class="s3">
              <div class="hy-suvicon">
                <MessageCircle class="icon" />
                <p>知马圈</p>
              </div>
              <div class="hy-suvlist">
                <router-link v-for="item in circlesQuickLinks" :key="item.label" :to="item.to">{{ item.label }}</router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 四行广告横幅 -->
    <section class="promo-strip">
      <div class="container">
        <div class="promo-item promo-slot large">
          <img src="https://picsum.photos/2360/200?random=5" alt="广告图片" class="ad-image" />
        </div>
        <div class="promo-item promo-slot medium">
          <img src="https://picsum.photos/2360/200?random=6" alt="广告图片" class="ad-image" />
        </div>
        <div class="promo-item promo-slot medium">
          <img src="https://picsum.photos/2360/200?random=7" alt="广告图片" class="ad-image" />
        </div>
        <div class="promo-item promo-slot medium">
          <img src="https://picsum.photos/2360/200?random=8" alt="广告图片" class="ad-image" />
        </div>
      </div>
    </section>

    <!-- 主要内容区域 - 两行布局 -->
    <section class="main-content">
      <div class="container">
        <!-- 两行布局：第一行Hero+热搜+竖向广告，第二行本地新闻+创业投资+竖向广告 -->
        <div class="content-grid">
          <!-- 第一行第一列：Hero 轮播 -->
          <div 
            class="hero-carousel" 
            tabindex="0"
            @keydown="handleKeydown"
            @mouseenter="stopAutoplay"
            @mouseleave="startAutoplay"
          >
            <div class="carousel-image">
              <transition name="fade">
                <img :src="currentHeroImage.src" :alt="currentHeroImage.title" :key="currentIndex" />
              </transition>
            </div>
            <button class="carousel-arrow prev" @click="prevHero" aria-label="上一张">‹</button>
            <button class="carousel-arrow next" @click="nextHero" aria-label="下一张">›</button>
            <div class="carousel-controls">
              <span 
                v-for="(img, idx) in heroImages" 
                :key="idx" 
                class="control-dot" 
                :class="{ active: idx === currentIndex }"
                @click="goTo(idx)"
              >
                {{ idx + 1 }}
              </span>
            </div>
            <div class="carousel-caption">
              {{ currentHeroImage.title }}
            </div>
          </div>
          
          <!-- 第一行第二列：热搜区域 -->
          <div class="hot-news">
            <div class="section-tabs">
              <span 
                v-for="tab in newsTabs" 
                :key="tab" 
                class="tab-item" 
                :class="{ active: activeNewsTab === tab }"
                @click="activeNewsTab = tab"
                @mouseenter="activeNewsTab = tab"
              >
                {{ tab }}
              </span>
            </div>
            <div class="news-list">
              <div 
                v-for="(item, index) in displayedHotNewsTop5" 
                :key="item.id"
                class="news-item"
                :class="{ 
                  highlighted: index < 3,
                  'hy_hover': activeHotNewsId === item.id 
                }"
              >
                <span class="news-rank">{{ index + 1 }}</span>
                <span class="news-title" @click="goToNews(item.id)">{{ item.title }}</span>
                <span class="news-date">{{ item.date }}</span>
                <div style="clear: both;"></div>
                
                <!-- 详细信息展开区域 -->
                <div class="hy_sdli_hide cl">
                  <div class="hy_sdli_hidepic">
                    <img :src="item.image || placeholders.news(140, 68)" :alt="item.title" width="140" height="68" />
                  </div>
                  <div class="hy_sdli_hidetxt">
                    <p>{{ item.description || '暂无详细描述...' }}</p>
                    <div class="hy_sdli_hideinfo">阅读：{{ item.views }} 评论：{{ item.comments }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 第二行第一列：本地新闻 -->
          <div class="local-news">
            <div class="section-header">
              <h3>本地新闻</h3>
              <a href="#" class="more-link">更多 ></a>
            </div>
            <div class="news-items" @mouseleave="activeLocalNewsId = defaultLocalNewsId">
              <div 
                v-for="news in localNewsList" 
                :key="news.id" 
                class="local-news-item"
                :class="{ 'hy_hover': activeLocalNewsId === news.id }"
                @mouseenter="activeLocalNewsId = news.id"
              >
                <span class="news-title">{{ news.title }}</span>
                <span class="news-date">{{ news.date }}</span>
                <div style="clear: both;"></div>
                
                <!-- 详细信息展开区域 -->
                <div class="hy_sdli_hide cl">
                  <div class="hy_sdli_hidepic">
                    <img :src="news.image || placeholders.news(140, 68)" :alt="news.title" width="140" height="68" />
                  </div>
                  <div class="hy_sdli_hidetxt">
                    <p>{{ news.description || '暂无详细描述...' }}</p>
                    <div class="hy_sdli_hideinfo">阅读：{{ news.views }} 评论：{{ news.comments }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 第二行第二列：创业投资 -->
          <div class="business-investment">
            <div class="section-header">
              <h3>创业投资</h3>
              <a href="#" class="more-link">更多 ></a>
            </div>
            <div class="investment-items" @mouseleave="activeInvestmentId = defaultInvestmentId">
              <div 
                v-for="item in investmentList" 
                :key="item.id" 
                class="investment-item"
                :class="{ 'hy_hover': activeInvestmentId === item.id }"
                @mouseenter="activeInvestmentId = item.id"
              >
                <span class="investment-title">{{ item.title }}</span>
                <span class="investment-date">{{ item.date }}</span>
                <div style="clear: both;"></div>
                
                <!-- 详细信息展开区域 -->
                <div class="hy_sdli_hide cl">
                  <div class="hy_sdli_hidepic">
                    <img :src="item.image || placeholders.news(140, 68)" :alt="item.title" width="140" height="68" />
                  </div>
                  <div class="hy_sdli_hidetxt">
                    <p>{{ item.description || '暂无详细描述...' }}</p>
                    <div class="hy_sdli_hideinfo">阅读：{{ item.views }} 评论：{{ item.comments }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 竖向五格广告 - 跨两行 -->
          <div class="vertical-ads">
            <div v-for="n in 5" :key="n" class="promo-vertical-item promo-slot small">
              <img :src="`https://picsum.photos/1250/416?random=${8+n}`" alt="广告图片" class="ad-image" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最后一行：复杂布局 -->
    <section class="bottom-content">
      <div class="container">
        <div class="bottom-grid">
          <!-- 左侧 2fr 区域 -->
          <div class="bottom-left">
             <!-- 上 1/3：广告横幅 -->
             <div class="promo-bottom promo-slot wide">
               <img src="https://picsum.photos/1720/200?random=14" alt="广告图片" class="ad-image" />
             </div>
            
            <!-- 下 2/3：互助爆料 + 律师咨询 -->
            <div class="bottom-sections">
              <div class="help-section">
                <div class="section-header">
                  <h3>互助爆料</h3>
                  <a href="#" class="more-link">更多 ></a>
                </div>
                <div class="help-items">
                  <div 
                    v-for="item in helpList" 
                    :key="item.id" 
                    class="help-item"
                  >
                    <span class="help-title">{{ item.title }}</span>
                    <span class="help-date">{{ item.date }}</span>
                    
                  </div>
                </div>
              </div>
              
              <div class="lawyer-section">
                <div class="section-header">
                  <h3>律师咨询</h3>
                  <a href="#" class="more-link">更多 ></a>
                </div>
                <div class="lawyer-items">
                  <div 
                    v-for="item in lawyerList" 
                    :key="item.id" 
                    class="lawyer-item"
                  >
                    <span class="lawyer-title">{{ item.title }}</span>
                    <span class="lawyer-date">{{ item.date }}</span>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 右侧 1fr：功能按钮区域 -->
          <div class="bottom-right">
            <div class="function-buttons">
              <div class="button-grid">
                <div v-for="func in functionButtons" :key="func.id" class="function-button" @click="navigateTo(func.path)">
                  <div class="function-icon-wrap" :style="{ background: func.color }">
                    <component :is="func.icon" class="function-icon" />
                  </div>
                  <span class="function-label">{{ func.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
  </div>
</template>

<script setup>
import { defineOptions } from 'vue'
defineOptions({
  name: 'HomePage'
})
import { ref, onMounted, onUnmounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { placeholders } from '@/utils/placeholder'
import { homeAPI } from '@/api/home'
import { searchAPI } from '@/api/search'
import { 
  Newspaper, MessageCircle, MapPin,
  Building2, ArrowUp, BarChart3, Camera,
  DollarSign, Phone, Home, Handshake, ShoppingCart, Car, HomeIcon, Store, BriefcaseBusiness, Megaphone,
  Search, X
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()

// 搜索相关
const searchKeyword = ref('')
const searchType = ref('all')
const dropdownOpen = ref(false)
const searchOptions = [
  { label: '全部', value: 'all' },
  { label: '资讯', value: 'news' },
  { label: '服务', value: 'services' },
  { label: '圈子', value: 'circles' },
  { label: '用户', value: 'users' }
]

// 自定义下拉菜单方法
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectOption = (value) => {
  searchType.value = value
  dropdownOpen.value = false
  onTypeChange()
}

const getSelectedLabel = () => {
  const selected = searchOptions.find(opt => opt.value === searchType.value)
  return selected ? selected.label : '全部'
}

const onTypeChange = () => {}

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (!event.target.closest('.custom-select-wrapper')) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 导航菜单 - 6个板块
const mainNavItems = ref([
  { name: 'Home', path: '/', label: '首页' },
  { name: 'News', path: '/news', label: '资讯' },
  { name: 'Services', path: '/services', label: '知马同城' },
  { name: 'Circles', path: '/circles', label: '知马圈' },
  { name: 'Ads', path: '#', label: '广告咨询', qrImage: '/placeholder-qr.svg', qrText: '扫码添加WhatsApp咨询' },
  { name: 'App', path: '#', label: 'APP下载', qrImage: '/placeholder-qr.svg', qrText: '手机扫码下载' }
])

const topNavCardVisible = ref({ Ads: false, App: false })
const showTopNavCard = (name) => { topNavCardVisible.value[name] = true }
const hideTopNavCard = (name) => { topNavCardVisible.value[name] = false }

// 顶部导航 APP 下载弹窗所需数据（复用右侧工具栏风格）
const navQrSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="#FF6A00"/><text x="90" y="110" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="#FFFFFF">QR</text></svg>'
const navQrPlaceholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(navQrSvg)
const navIosQr = ref(navQrPlaceholder)
const navAndroidQr = ref(navQrPlaceholder)
const navAppActivePlatform = ref('ios')
const navAppCurrentQr = computed(() => navAppActivePlatform.value === 'ios' ? navIosQr.value : navAndroidQr.value)

// 原始导航栏引用
const originalNavRef = ref(null)

// 快捷入口新数据
const cityConvenienceSubcategories = ref([
  { label: '找合作', to: '/services?category=business' },
  { label: '求职', to: '/services?category=jobs' },
  { label: '二手物品', to: '/services?category=secondhand' },
  { label: '二手车', to: '/services?category=cars' },
  { label: '房产租售', to: '/services?category=housing' },
  { label: '店铺转让', to: '/services?category=business' },
  { label: '生活服务', to: '/services?category=life' },
  { label: '商务服务', to: '/services?category=business-service' },
  { label: '我要求助', to: '/services?category=help' },
  { label: '教育培训', to: '/services?category=education' }
])

const newsQuickLinks = ref([
  { label: '本地新闻', to: '/news?category=local' },
  { label: '中国热点', to: '/news?category=china' },
  { label: '官方消息', to: '/news?category=official' },
  { label: '专题精选', to: '/news?category=topic' }
])

const circlesQuickLinks = ref([
  { label: '推荐动态', to: '/circles?tab=recommend' },
  { label: '最新发布', to: '/circles?tab=latest' }
])

// Hero 轮播相关
const heroImages = ref([
  {
    src: 'https://picsum.photos/800/600?random=15',
    title: '马来西亚华人文化节将在吉隆坡盛大举行'
  },
  {
    src: 'https://picsum.photos/800/600?random=16',
    title: '中马经贸合作迈向新阶段'
  },
  {
    src: 'https://picsum.photos/800/600?random=17',
    title: '旅游与文化融合发展'
  }
])

const currentIndex = ref(0)
const currentHeroImage = computed(() => heroImages.value[currentIndex.value])
let autoplayTimer = null

const nextHero = () => {
  currentIndex.value = (currentIndex.value + 1) % heroImages.value.length
}
const prevHero = () => {
  currentIndex.value = (currentIndex.value - 1 + heroImages.value.length) % heroImages.value.length
}
const goTo = (idx) => { currentIndex.value = idx }

const startAutoplay = () => {
  clearInterval(autoplayTimer)
  autoplayTimer = setInterval(nextHero, 5000)
}
const stopAutoplay = () => { clearInterval(autoplayTimer) }
const handleKeydown = (e) => {
  if (e.key === 'ArrowRight') nextHero()
  if (e.key === 'ArrowLeft') prevHero()
}

// 新闻标签和列表
const activeNewsTab = ref('新闻热点')
const newsTabs = ref(['新闻热点', '论坛热点', '中国热点', '官方消息'])

// 不同类别的热榜数据（示例：可与后端联动）
const forumHotNewsList = ref([
  { id: 101, title: '论坛热帖：大马移居经验分享', date: '09-11', views: 1290, comments: 22 },
  { id: 102, title: '求助：在马来办理驾照流程', date: '09-11', views: 980, comments: 18 },
  { id: 103, title: '讨论：KL 哪个区域性价比最高', date: '09-10', views: 865, comments: 9 },
  { id: 104, title: '晒图：槟城周末美食地图', date: '09-10', views: 732, comments: 11 },
  { id: 105, title: '招聘：中文客服，工资待遇优', date: '09-09', views: 650, comments: 6 },
  { id: 106, title: '问答：孩子入学如何选校', date: '09-08', views: 540, comments: 7 }
])

const chinaHotNewsList = ref([
  { id: 201, title: '中国热点：A股三大指数集体上涨', date: '09-11', views: 2100, comments: 30 },
  { id: 202, title: '中国热点：文旅市场持续火热', date: '09-11', views: 1900, comments: 21 },
  { id: 203, title: '中国热点：科技企业发布新品', date: '09-10', views: 1503, comments: 14 },
  { id: 204, title: '中国热点：消费券推动夜经济', date: '09-10', views: 1208, comments: 12 },
  { id: 205, title: '中国热点：新能源车销量创新高', date: '09-09', views: 1100, comments: 10 }
])

const officialHotNewsList = ref([
  { id: 301, title: '官方消息：移民政策指引更新', date: '09-11', views: 789, comments: 5 },
  { id: 302, title: '官方消息：签证办理时间调整', date: '09-10', views: 688, comments: 4 },
  { id: 303, title: '官方消息：公共假期安排公布', date: '09-10', views: 650, comments: 6 },
  { id: 304, title: '官方消息：税务申报提醒', date: '09-09', views: 520, comments: 3 },
  { id: 305, title: '官方消息：教育入学报名通知', date: '09-08', views: 480, comments: 2 }
])

const displayedHotNews = computed(() => {
  if (activeNewsTab.value === '论坛热点') return forumHotNewsList.value
  if (activeNewsTab.value === '中国热点') return chinaHotNewsList.value
  if (activeNewsTab.value === '官方消息') return officialHotNewsList.value
  return hotNewsList.value
})

const displayedHotNewsTop5 = computed(() => displayedHotNews.value.slice(0, 5))

// 活跃的新闻项ID (用于控制hover展开效果)
const activeHotNewsId = ref(null)
const activeLocalNewsId = ref(null)
const activeInvestmentId = ref(null)

// 默认高亮项（第一条）
const defaultLocalNewsId = computed(() => localNewsList.value?.[0]?.id ?? null)
const defaultInvestmentId = computed(() => investmentList.value?.[0]?.id ?? null)

// 新闻hover控制方法
const setActiveNews = (type, id) => {
  // 清除其他区域的活跃状态
  activeHotNewsId.value = null
  activeLocalNewsId.value = null
  activeInvestmentId.value = null
  
  // 设置当前区域的活跃状态
  if (type === 'hot') {
    activeHotNewsId.value = id
  } else if (type === 'local') {
    activeLocalNewsId.value = id
  } else if (type === 'investment') {
    activeInvestmentId.value = id
  }
}

const clearActiveNews = (type) => {
  // 添加延迟，防止快速移动时闪烁
  setTimeout(() => {
    if (type === 'hot') {
      activeHotNewsId.value = null
    } else if (type === 'local') {
      activeLocalNewsId.value = null
    } else if (type === 'investment') {
      activeInvestmentId.value = null
    }
  }, 100)
}

// 返回顶部功能已移至全局 RightSideTools 组件

const hotNewsList = ref([
  { 
    id: 1, 
    title: '马来西亚新政策：华人餐饮业迎来发展机遇', 
    date: '09-11',
    views: 2546,
    comments: 7,
    description: '【视频】消失十余年！稀有海洋物种"重现"马来西亚海域，近两年来，被誉为"海洋精灵"的稀有海洋哺乳动物——儒艮，在马来西亚...',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkY2QTAwIi8+Cjx0ZXh0IHg9IjQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7nrKwxOOasoeadpeaztOi+ueS4remAl+S8muS8miDlsIblnKjlm73lhaznlKflvIA8L3RleHQ+Cjwvc3ZnPgo='
  },
  { 
    id: 2, 
    title: '专家：马来西亚房地产投资前景看好', 
    date: '09-11',
    views: 1823,
    comments: 12,
    description: '专家分析马来西亚房地产市场趋势，认为郊区土地投资具有巨大潜力，随着基础设施建设的完善，预计未来几年将迎来快速发展...',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMDA2NkNDIi8+Cjx0ZXh0IHg9IjQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5Yqf6KGjPC90ZXh0Pgo8L3N2Zz4K'
  },
  { 
    id: 3, 
    title: '居暖为嘉，古刚为证！欧美情侣是哥磺浔漫求', 
    date: '09-11',
    views: 945,
    comments: 3,
    description: '吉隆坡一对欧美情侣在当地餐厅用餐时发生的温馨故事，展现了马来西亚人民的热情好客和多元文化包容性...',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkY2QTAwIi8+Cjx0ZXh0IHg9IjQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5aSa5YWDPC90ZXh0Pgo8L3N2Zz4K'
  },
  { 
    id: 4, 
    title: '吉隆坡新机场扩建项目启动', 
    date: '09-11',
    views: 1456,
    comments: 8,
    description: '吉隆坡新机场建设进展顺利，计划建设连接市区的轨道交通系统，将大大缩短往返机场的时间，促进马来西亚旅游业发展...',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNDQzODVEIi8+Cjx0ZXh0IHg9IjQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5py65Zy6PC90ZXh0Pgo8L3N2Zz4K'
  },
  { 
    id: 5, 
    title: '情人鉴约呈迄愁客栈！奔驰男担补房费，狂侄', 
    date: '09-11',
    views: 734,
    comments: 5,
    description: '近日发生的一起情人酒店纠纷事件，涉及房费争议和财务纠纷，事件过程曲折，最终在当地警方的协调下得到解决...',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNkEzOEE3Ii8+Cjx0ZXh0IHg9IjQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5oCn56eRPC90ZXh0Pgo8L3N2Zz4K'
  },
  { 
    id: 6, 
    title: '中国企业拟在马来西亚投资旅游项目', 
    date: '09-11',
    views: 2189,
    comments: 15,
    description: '中国多家知名企业考察马来西亚旅游资源，计划投资建设大型旅游度假区，项目总投资超过10亿美元，将大大推动当地旅游产业发展...',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMDBCRTQyIi8+Cjx0ZXh0IHg9IjQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+5peF6YWyPC90ZXh0Pgo8L3N2Zz4K'
  }
])

const hotNewsTop5 = computed(() => hotNewsList.value.slice(0, 5))

// 本地新闻
const localNewsList = ref([
  {
    id: 1,
    title: '马来西亚：感谢中企培养专业人才，希望拓展',
    date: '2025-09-07',
    views: 8453,
    comments: 25,
    description: '【知马网综合报道】中国南方电网澜湄国际公司职工董事周剑斌近日在云南昆明会见到访的马来西亚代表团，双方就人才培养和技术合作深入交流...',
    image: 'https://picsum.photos/140/105?random=20'
  },
  {
    id: 2,
    title: '马来西亚与中国经贸合作会议在吉隆坡举行',
    date: '2025-09-07',
    views: 677,
    comments: 6,
    description: '【知马网综合报道】9月7日下午，马泰边界总委员会秘书处会议在马来西亚国公省召开，旨在处理双方边界问题和促进双边合作...',
    image: 'https://picsum.photos/140/105?random=21'
  },
  {
    id: 3,
    title: '中国餐饮老板在马来西亚创业成功经验分享',
    date: '2025-09-07',
    views: 453,
    comments: 12,
    description: '巩红朋日复一日站在烤架前烧烤，对食材品质严格把关，但最近生意遇到困难，营收大幅下降，面临严峻挑战...',
    image: 'https://picsum.photos/140/105?random=22'
  },
  {
    id: 4,
    title: '马中关系持续加强，经贸合作前景广阔',
    date: '2025-09-06',
    views: 2134,
    comments: 18,
    description: '马中两国在基础设施建设、贸易投资等多个领域的合作不断深化，双边贸易额持续增长，为两国人民带来实实在在的福利...',
    image: 'https://picsum.photos/140/105?random=23'
  },
  {
    id: 5,
    title: '吉隆坡市长考察基础设施建设项目',
    date: '2025-09-05',
    views: 1567,
    comments: 9,
    description: '吉隆坡市长对市内多个重点基础设施建设项目进行实地考察，着重检查工程进度和质量，确保项目按时高质量完成...',
    image: 'https://picsum.photos/140/105?random=24'
  },
  {
    id: 6,
    title: '马来西亚农业部门推出新政策支持农民',
    date: '2025-09-04',
    views: 892,
    comments: 7,
    description: '马来西亚农业部门宣布一系列惠农政策，包括种子补贴、技术培训和市场支持，旨在提高农民收入和农业现代化水平...',
    image: 'https://picsum.photos/140/105?random=25'
  }
])

// 创业投资列表
const investmentList = ref([
  { 
    id: 1, 
    title: '本人需要接手一个门店', 
    date: '2025-09-08',
    views: 356,
    comments: 8,
    description: '比如衣服店，奶茶店，小吃店等，在新山，诚心找一个经营状况良好的门店接手，价格合理，有意者请联系讨论...',
    image: 'https://picsum.photos/140/105?random=19'
  },
  { 
    id: 2, 
    title: '07164642860，微信17779803788', 
    date: '2025-09-06',
    views: 234,
    comments: 3,
    description: '本人想在马来西亚找工作，跟服装有关的，车间或者其他相关工作都可以，有多年经验，欢迎联系...',
    image: 'https://picsum.photos/140/105?random=26'
  },
  { 
    id: 3, 
    title: '找工作', 
    date: '2025-09-06',
    views: 567,
    comments: 12,
    description: '本人在马多年，独立负责过多个工程项目管理，有丰富的工作经验，现在寻找新的工作机会，欢迎企业联系...',
    image: 'https://picsum.photos/140/105?random=27'
  },
  { 
    id: 4, 
    title: '找工作', 
    date: '2025-09-05',
    views: 445,
    comments: 7,
    description: '中国人，男性，想找一份工作，有相关工作经验，希望能找到合适的工作机会，欢迎联系讨论...',
    image: 'https://picsum.photos/140/105?random=28'
  },
  { 
    id: 5, 
    title: '我一份奶茶店工作', 
    date: '2025-09-03',
    views: 289,
    comments: 5,
    description: '希望能在奶茶店找到一份工作，有相关经验，熊力强，对奶茶制作有热情，欢迎店主联系...',
    image: 'https://picsum.photos/140/105?random=29'
  },
  { 
    id: 6, 
    title: '寻找投资合伙人，共同发展', 
    date: '2025-09-02',
    views: 678,
    comments: 15,
    description: '本人有一个很好的创业项目，现在寻找有经验的投资合伙人，共同发展事业，欢迎有兴趣的朋友联系详谈...',
    image: 'https://picsum.photos/140/105?random=30'
  }
])

// 互助爆料和律师咨询
const helpList = ref([
  { id: 1, title: '我刚被骗一个项目，心里很犹豫怎么办？', date: '2025-09-11' },
  { id: 2, title: '虽然客户联系我', date: '2025-09-11' },
  { id: 3, title: '想在新山找工作，', date: '2025-09-11' },
  { id: 4, title: '想去马来西亚吉隆坡做美发打工，不想在国内', date: '2025-09-10' },
  { id: 5, title: '求助：找个可靠的翻译服务', date: '2025-09-09' },
  { id: 6, title: '互助：经历相似的朋友给点建议', date: '2025-09-08' }
])

const lawyerList = ref([
  { id: 1, title: '马埔泰最顶级的艺术殿堂即将诞生！', date: '2025-04-04' },
  { id: 2, title: '陈景润母校XMUM吉隆坡国际学校奖学金', date: '2025-03-05' },
  { id: 3, title: 'XMUM吉隆坡国际学校2025/25学年第...', date: '2025-10-18' },
  { id: 4, title: '蒙潮来袭，马来西亚冬天来了——东南亚最大...', date: '2025-04-12' },
  { id: 5, title: '马来西亚法律咨询服务平台全新上线', date: '2025-03-15' },
  { id: 6, title: '关于法律维权的几点建议', date: '2025-02-28' }
])

const activeHelpId = ref(null)
const activeLawyerId = ref(null)

 // 功能按钮
 const functionButtons = ref([
   { id: 1, icon: Handshake, label: '找合作', path: '/services?category=cooperation', color: '#E3F2FD' },
   { id: 2, icon: BriefcaseBusiness, label: '求职', path: '/services?category=jobs', color: '#FFF3E0' },
   { id: 3, icon: ShoppingCart, label: '二手物品', path: '/services?category=secondhand', color: '#F3E5F5' },
   { id: 4, icon: Car, label: '二手车', path: '/services?category=cars', color: '#E8F5E8' },
   { id: 5, icon: HomeIcon, label: '房产租售', path: '/services?category=housing', color: '#FFF8E1' },
   { id: 6, icon: Store, label: '店铺转让', path: '/services?category=business', color: '#E0F2F1' },
   { id: 7, icon: MapPin, label: '生活服务', path: '/services?category=life', color: '#FCE4EC' },
   { id: 8, icon: BarChart3, label: '商务服务', path: '/services?category=business-service', color: '#F1F8E9' },
   { id: 9, icon: Megaphone, label: '我要求助', path: '/services?category=help', color: '#FFECB3' }
 ])


// 方法
const handleSearch = async () => {
  const kw = searchKeyword.value.trim()
  if (!kw) return
  
  try {
    // 保存搜索记录
    await searchAPI.saveSearchRecord(kw)
    
    const type = ['all','news','services','circles','users'].includes(searchType.value) ? searchType.value : 'all'
    router.push({ name: 'Search', query: { q: kw, ...(type !== 'all' ? { type } : {}) } })
  } catch (error) {
    console.error('搜索失败:', error)
    // 即使保存搜索记录失败，也继续跳转
    const type = ['all','news','services','circles','users'].includes(searchType.value) ? searchType.value : 'all'
    router.push({ name: 'Search', query: { q: kw, ...(type !== 'all' ? { type } : {}) } })
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
}

// 获取搜索占位符文本
const getSearchPlaceholder = () => {
  const placeholders = {
    'all': '搜索资讯、服务、圈子、用户...',
    'news': '搜索马来西亚最新资讯...',
    'services': '搜索知马同城（如搬家、维修、教学）...',
    'circles': '搜索知马圈动态...',
    'users': '搜索用户...'
  }
  return placeholders[searchType.value] || '请输入搜索内容'
}

const onSearchFocus = () => {}

const onSearchBlur = () => {}

const switchHeroImage = (index) => {}

const goToNews = (newsId) => {
  router.push(`/news/${newsId}`)
}

const navigateTo = (path) => {
  router.push(path)
}

// API数据
const banners = ref([])
const recommendedContent = ref([])
const hotContent = ref([])
const latestContent = ref([])
const homepageStats = ref({})
const categoryNavigation = ref([])
const quickLinks = ref([])
const homepageAnnouncements = ref([])
const homepageActivities = ref([])

// 加载首页数据
const loadHomepageData = async () => {
  try {
    const [
      bannersRes,
      recommendedRes,
      hotRes,
      latestRes,
      statsRes,
      categoriesRes,
      linksRes,
      announcementsRes,
      activitiesRes
    ] = await Promise.all([
      homeAPI.getBanners(),
      homeAPI.getRecommendedContent(),
      homeAPI.getHotContent(),
      homeAPI.getLatestContent(),
      homeAPI.getHomepageStats(),
      homeAPI.getCategoryNavigation(),
      homeAPI.getQuickLinks(),
      homeAPI.getHomepageAnnouncements(),
      homeAPI.getHomepageActivities()
    ])
    
    banners.value = bannersRes.data || []
    recommendedContent.value = recommendedRes.data || []
    hotContent.value = hotRes.data || []
    latestContent.value = latestRes.data || []
    homepageStats.value = statsRes.data || {}
    categoryNavigation.value = categoriesRes.data || []
    quickLinks.value = linksRes.data || []
    homepageAnnouncements.value = announcementsRes.data || []
    homepageActivities.value = activitiesRes.data || []
  } catch (error) {
    console.error('加载首页数据失败:', error)
  }
}

onMounted(() => {
  document.title = '知马网 - 马来西亚华人信息集散平台'
  startAutoplay()
  loadHomepageData()
  // 默认激活第一条，避免布局抖动
  if (defaultLocalNewsId.value) activeLocalNewsId.value = defaultLocalNewsId.value
  if (defaultInvestmentId.value) activeInvestmentId.value = defaultInvestmentId.value
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<style scoped>
/* 整体页面容器 */
.homepage-redesign {
  background: #ffffff; /* 顶部两侧改为白色背景 */
  min-height: 100vh;
}

/* ==================== 顶部四个位展示 ==================== */
.top-ads {
  background: #ffffff;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 4px 12px;
}

 /* 通用展示占位样式（避免广告关键词） */
 .promo-slot {
   background: #CCCCCC;
   border: 1px solid #BBBBBB;
   border-radius: 0 !important; /* 直角边，覆盖其他圆角样式 */
   display: flex !important;
   align-items: center !important;
   justify-content: center !important;
   cursor: default !important;
   position: relative;
   transition: none !important;
 }
 
 .promo-slot:hover {
   transform: none !important;
   box-shadow: none !important;
 }
 
 .promo-slot-text {
   color: #666666;
   font-size: 14px;
   font-weight: 500;
   text-align: center;
 }

 .ad-image {
   width: 100%;
   height: 100%;
   object-fit: cover;
   border-radius: 0;
   position: absolute;
   top: 0;
   left: 0;
 }
 
 .promo-top-item {
  height: 100px;
   border-radius: var(--radius-medium);
   padding: 12px;
   color: white;
   cursor: pointer;
   transition: transform 0.3s ease, box-shadow 0.3s ease;
   position: relative;
   overflow: hidden;
   display: flex;
   justify-content: space-between;
   align-items: center;
 }

 .promo-top-item:has(.ad-image) {
   padding: 0;
   border-radius: 0;
 }

 .promo-item:has(.ad-image) {
   padding: 0;
   border-radius: 0;
 }

 .promo-vertical-item:has(.ad-image) {
   padding: 0;
   border-radius: 0;
 }

 .promo-bottom:has(.ad-image) {
   padding: 0;
   border-radius: 0;
 }
 
 .promo-top-item.promo-slot .promo-slot-text {
   font-size: 14px;
 }
 
.promo-top-item:hover {
  color: var(--primary-hover);
}

.promo-orange {
  background: linear-gradient(135deg, var(--primary-color) 0%, #FF8533 100%);
}

.promo-blue {
  background: linear-gradient(135deg, #0066CC 0%, #4A90E2 100%);
}

.promo-orange-alt {
  background: linear-gradient(135deg, #FF8533 0%, var(--primary-color) 100%);
}

.promo-blue-alt {
  background: linear-gradient(135deg, #4A90E2 0%, #0066CC 100%);
}

.promo-content h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.promo-content p {
  font-size: 12px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.3;
}

.promo-icon {
  opacity: 0.4;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.promo-qr {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-placeholder {
  width: 45px;
  height: 45px;
  background: rgba(255,255,255,0.3);
  border: 2px solid rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  border-radius: var(--radius-small);
  text-align: center;
  line-height: 1.1;
}

/* ==================== Logo + Slogan + 搜索栏区域 ==================== */
.header-section {
  background: white;
  border-bottom: 1px solid var(--border-primary);
  border-top: 1px solid var(--border-primary);
  padding: 15px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.site-logo {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-text {
  font-size: 34px;
  font-weight: 400;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 2px;
  font-family: 'YouSheBiaoTiHei', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  font-synthesis: none;
  letter-spacing: 0.5px;
}

.domain {
  font-size: 14px;
  color: var(--text-secondary);
}

.slogan {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.slogan-main {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 2px;
}

.slogan-sub {
  font-size: 16px;
  color: var(--text-secondary);
}

.search-area {
  flex: 1;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-container {
  display: flex;
  height: 40px;
}

.select-el :deep(.el-input__wrapper) {
  border-radius: var(--radius-medium) 0 0 var(--radius-medium) !important;
  border-right: none;
  box-shadow: none !important;
  border: 2px solid var(--border-primary) !important;
}
.select-el :deep(.is-focus .el-input__wrapper),
.select-el :deep(.el-input__wrapper.is-focus),
.select-el :deep(.el-input__wrapper:hover) {
  box-shadow: none !important;
  border-color: var(--border-primary) !important;
}

.search-select .chevron {
  color: #999;
}


.search-input {
  flex: 1;
  border: 2px solid var(--border-primary);
  border-right: none;
  border-left: none; /* 与 el-select 相连 */
  border-radius: 0;
  padding: 0 15px;
  font-size: var(--font-size-md);
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: var(--border-primary);
  box-shadow: none;
}

.search-btn {
  width: 100px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: white;
  border: none;
  border-radius: 0 var(--radius-medium) var(--radius-medium) 0;
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 500;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.search-btn:hover {
  box-shadow: 0 6px 16px rgba(255,106,0,0.3);
}

/* 搜索类型选择 */
.search-select {
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}
.search-select.open {
  box-shadow: 0 0 0 3px rgba(255,106,0,0.12);
}

/* 搜索框样式 */
.search-container-new {
  display: flex;
  gap: 8px;
  align-items: center;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 0;
  width: 100%;
  max-width: 600px;
}

/* 首页搜索容器 */
.search-container-beautiful {
  display: flex;
  align-items: center;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  width: 100%;
  max-width: 1500px;
  gap: 0;
}

.search-container-beautiful:hover {
  box-shadow: none;
  border-color: transparent;
}

.search-container-beautiful:focus-within {
  box-shadow: none;
  border-color: transparent;
  transform: none;
}

/* 搜索类型选择器 - 连接样式 */
.search-type-selector {
  flex-shrink: 0;
  margin-right: 0;
}

/* 自定义下拉选择器容器 */
.custom-select-wrapper {
  position: relative;
  width: 75px;
}

/* 自定义select样式 */
.search-select-dropdown {
  width: 100%;
  height: 44px;
  background: white;
  border: 2px solid #e9ecef;
  border-right: none;
  border-radius: 12px 0 0 12px;
  padding: 8px 6px;
  font-size: 13px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  user-select: none;
}

.selected-text {
  flex: 1;
  text-align: center;
  pointer-events: none;
}

.dropdown-arrow {
  color: var(--primary-color);
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: 4px;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.search-select-dropdown:hover {
  border-color: #d1d5db;
}

.search-select-dropdown.is-open {
  border-color: var(--primary-color);
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.dropdown-option {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.15s ease;
  border-bottom: 1px solid #f1f3f4;
  position: relative;
  text-align: center;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option:hover {
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(229, 90, 43, 0.08) 100%);
  color: var(--primary-color);
  font-weight: 600;
  transform: translateX(2px);
}

.dropdown-option.selected {
  background: linear-gradient(135deg, var(--primary-color) 0%, #e55a2b 100%);
  color: white;
  font-weight: 600;
}


/* 搜索输入容器 - 中间直角矩形 */
.search-input-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: white !important;
  border: 2px solid #e9ecef !important;
  border-left: none !important;
  border-right: none !important;
  border-radius: 0 !important;
  transition: all 0.3s ease;
  height: 44px !important;
  min-height: 44px !important;
  margin: 0;
}

.search-input-container:hover {
  border-color: #d1d5db !important;
}

.search-input-container:focus-within {
  border-color: var(--primary-color) !important;
}

.search-icon-new {
  position: absolute;
  left: 15px;
  color: #6c757d;
  pointer-events: none;
  z-index: 1;
  transition: color 0.3s ease;
}

.search-input-container:focus-within .search-icon-new {
  color: var(--primary-color);
}

.search-input-new {
  width: 100%;
  padding: 10px 45px 10px 50px;
  border: none !important;
  background: transparent !important;
  outline: none;
  font-size: 15px;
  color: #333;
  border-radius: 0 !important;
  transition: all 0.3s ease;
}

.search-input-new::placeholder {
  color: #9ca3af;
  font-style: italic;
}

.clear-btn-new {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1;
}

.clear-btn-new:hover {
  background: #f1f3f4;
  color: #495057;
  transform: scale(1.1);
}

/* 搜索按钮 - 左直角右圆角，默认灰色 */
.search-btn-new {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background: #f8f9fa;
  color: #333333;
  border: 2px solid #e9ecef;
  border-left: none;
  border-radius: 0 12px 12px 0;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  height: 44px;
  box-shadow: none;
  min-width: 60px;
}

.search-btn-new:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-color) 0%, #e55a2b 100%);
  color: #ffffff;
  border-color: var(--primary-color);
}

.search-btn-new:active:not(:disabled) {
  background: linear-gradient(135deg, #d44a1a 0%, #c13e16 100%);
  color: #ffffff;
  border-color: #d44a1a;
}

.search-btn-new:disabled {
  background: #e9ecef;
  color: #6c757d;
  border-color: #dee2e6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  height: 44px;
}

.search-btn-new .btn-text {
  font-size: 15px;
  font-weight: 600;
}

/* 下拉菜单美化 */
:deep(.search-dropdown-popper) {
  border-radius: 12px !important;
  border: 1px solid #e9ecef !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
  padding: 8px 0 !important;
  margin-top: 8px !important;
}


/* 搜索栏聚焦时的协调效果 */
.search-container-beautiful:focus-within .search-select-dropdown {
  border-color: var(--primary-color);
}

.search-container-beautiful:focus-within .search-input-container {
  border-color: var(--primary-color);
}

.search-container-beautiful:focus-within .search-btn-new {
  background: linear-gradient(135deg, var(--primary-color) 0%, #e55a2b 100%) !important;
  color: #ffffff !important;
  border-color: var(--primary-color) !important;
  border-left: none !important;
}

.search-container-beautiful:focus-within .search-btn-new .btn-text {
  color: #ffffff !important;
}

/* 额外的优先级保证 */
.search-container-beautiful:focus-within .search-btn-new span {
  color: #ffffff !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-container-beautiful {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    max-width: 100%;
  }
  
  .search-type-selector {
    width: 100%;
    margin-right: 0;
  }
  
  .search-select-dropdown {
    width: 100%;
  }
  
  .search-input-container {
    margin: 0;
    width: 100%;
  }
  
  .search-btn-new {
    width: 100%;
    justify-content: center;
  }
  
  .search-btn-new .btn-text {
    display: block;
  }
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.search-container-new .search-icon {
  position: absolute;
  left: 12px;
  color: #6c757d;
  pointer-events: none;
  z-index: 1;
}

.search-container-new .search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
}

.search-container-new .search-input::placeholder {
  color: #9ca3af;
}

.search-container-new .clear-search-btn {
  position: absolute;
  right: 8px;
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1;
}

.search-container-new .clear-search-btn:hover {
  background: #e9ecef;
  color: #333;
}

.search-container-new .search-btn {
  padding: 10px 16px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin-right: 4px;
}

.search-container-new .search-btn:hover:not(:disabled) {
  background: #e55a2b;
}

.search-container-new .search-btn:disabled {
  background: #dee2e6;
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
}
.select-dropdown {
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
.select-dropdown li {
  cursor: pointer;
}
.select-dropdown li + li {
  border-top: 1px solid #f2f2f2;
}


/* ==================== 导航栏 ==================== */
.nav-section {
  position: sticky;
  top: 0;
  z-index: 900;
  background: white;
  border-bottom: 1px solid var(--border-primary);
  padding: 12px 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-nav {
  display: flex;
  gap: 30px;
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

.nav-item.disabled {
  color: --text-primary;
  cursor: not-allowed;
  pointer-events: none; /* 屏蔽点击 */
}

.nav-hover-card.disabled {
  pointer-events: auto; /* 恢复 hover 以显示二维码弹层 */
}

.nav-item:hover { background: transparent; color: var(--primary-color); }
.nav-item.disabled:hover { background: transparent; color: var(--primary-color); }

.nav-item.active {
  background: transparent;
  color: var(--primary-color);
}

/* 资讯（News）导航项：默认与其他项一致，hover 变橙 */

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

/* 顶部导航 hover 二维码弹层 */
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
  z-index: 1200;
  min-width: 200px;
}

.top-qr-popover.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(6px);
}

.qr-card { text-align: center; padding: 8px 8px 12px; }
.qr-card .qr-image { width: 180px; height: 180px; display: block; margin: 0 auto; border-radius: 10px; box-shadow: 0 6px 18px rgba(0,0,0,.08); }
.qr-card .qr-text { font-size: 12px; color: #6b7280; }

/* 侧边工具栏风格的四角修饰与下载按钮，仅用于 App 弹窗 */
.top-qr-popover .qr-box { position: relative; display: inline-block; }
.top-qr-popover .corner { position: absolute; width: 20px; height: 20px; border-color: var(--primary-color, #FF6A00); }
.top-qr-popover .corner.tl { left: -8px; top: -8px; border-left: 2px solid; border-top: 2px solid; border-left-color: var(--primary-color, #FF6A00); border-top-color: var(--primary-color, #FF6A00); }
.top-qr-popover .corner.tr { right: -8px; top: -8px; border-right: 2px solid; border-top: 2px solid; border-right-color: var(--primary-color, #FF6A00); border-top-color: var(--primary-color, #FF6A00); }
.top-qr-popover .corner.bl { left: -8px; bottom: -8px; border-left: 2px solid; border-bottom: 2px solid; border-left-color: var(--primary-color, #FF6A00); border-bottom-color: var(--primary-color, #FF6A00); }
.top-qr-popover .corner.br { right: -8px; bottom: -8px; border-right: 2px solid; border-bottom: 2px solid; border-right-color: var(--primary-color, #FF6A00); border-bottom-color: var(--primary-color, #FF6A00); }
.top-qr-popover .qr-title { margin-top: 10px; margin-bottom: 6px; font-size: 14px; font-weight: 700; color: #1f2937; text-align: center; letter-spacing: .2px; }
.top-qr-popover .download-actions { display: flex; flex-direction: row; gap: 10px; margin-top: 10px; justify-content: center; align-items: center; flex-wrap: nowrap; }
.top-qr-popover .btn-download { display: inline-block; padding: 7px 12px; border: 1px solid var(--primary-color, #FF6A00); color: var(--primary-color, #FF6A00); border-radius: 6px; font-size: 13px; text-decoration: none; min-width: 96px; background: transparent; cursor: pointer; white-space: nowrap; }
.top-qr-popover .btn-download:hover { background: var(--primary-color, #FF6A00); color: #fff; }
.top-qr-popover .btn-download.active { background: var(--primary-color, #FF6A00); color: #fff; }
.top-qr-popover .popover-text { font-size: 12px; color: #6b7280; margin-top: 2px; }

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-actions a {
  color: var(--text-primary);
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

/* ==================== 板块快捷入口 ==================== */

.quick-access {
  background: #fff;
  border-bottom: none;
  padding: 12px 0 2px 0;
}

/* hy_fenlei rebuilt container */
.hy-fenlei { position: relative; background: #fff; border: 1px solid var(--border-primary); padding: 16px 22px 12px; min-height: 100px; }
.hy-fenlei .hy-list, .hy-fenlei .hy-suvlist { width: 100%; }
.hy-fenlei .hy-corner { position: absolute; width: 24px; height: 24px; }
.hy-fenlei .hy-tl { top: 0; left: 0; border-top: 4px solid #ff6700; border-left: 4px solid #ff6700; border-radius: 0; }
.hy-fenlei .hy-tr { top: 0; right: 0; border-top: 4px solid #ff6700; border-right: 4px solid #ff6700; border-radius: 0; }
.hy-fenlei .hy-bl { bottom: 0; left: 0; border-bottom: 4px solid #ff6700; border-left: 4px solid #ff6700; border-radius: 0; }
.hy-fenlei .hy-br { bottom: 0; right: 0; border-bottom: 4px solid #ff6700; border-right: 4px solid #ff6700; border-radius: 0; }
.hy-fenlei .hy-list { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 12px 24px; align-items: start; justify-content: space-between; justify-items: stretch; }
.hy-fenlei .hy-list > li { display: grid; grid-template-columns: 96px 1fr; align-items: center; justify-items: start; }
.hy-fenlei .hy-suvicon { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: #ff6700; min-width: 96px; margin: 0 auto; text-align: center; }
.hy-fenlei .hy-suvicon .icon { width: 26px; height: 26px; }
.hy-fenlei .hy-suvicon p { color: #ff6700; font-weight: 600; line-height: 1; font-size: 18px; letter-spacing: 0.6px; }
.hy-fenlei .hy-suvlist {
  display: grid;
  grid-auto-flow: column; /* 先填满一列，再换到下一列 */
  grid-template-rows: repeat(2, 20px); /* 更大的行高 */
  grid-auto-columns: max-content;
  column-gap: 20px; /* 更松的横向间距 */
  row-gap: 8px;   /* 更松的竖向间距 */
  align-content: start;
  justify-content: space-between; /* 大屏下让内容横向均匀分布 */
  justify-items: start;
}
.hy-fenlei .hy-suvlist a { line-height: 20px; font-size: 16px; letter-spacing: 0.3px; font-weight: 500; }
.hy-fenlei .hy-suvlist a { padding-right: 6px; }
.hy-fenlei .hy-suvlist a { color: #666; text-decoration: none; font-size: 14px; }
.hy-fenlei .hy-suvlist a:hover { color: #ff6700; }
.access-card.minimal {
  position: relative;
  background: #fff;
  border: none;
  border-radius: 0;
  min-width: 0;
  max-width: none;
  flex: 1 1 0;
  padding: 0 18px;
  display: flex;
  align-items: center;
  border-right: none;
  height: 72px;
  box-shadow: none;
}
.access-card.minimal:last-child {
  border-right: none;
}
.access-cards.minimal > .l-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 5;
}
.access-cards.minimal > .l-corner-tl {
  top: 8px; left: 8px;
  border-top: 4px solid #ff6700;
  border-left: 4px solid #ff6700;
  border-radius: 4px 0 0 0;
}
.access-cards.minimal > .l-corner-tr {
  top: 8px; right: 8px;
  border-top: 4px solid #ff6700;
  border-right: 4px solid #ff6700;
  border-radius: 0 4px 0 0;
}
.access-cards.minimal > .l-corner-br {
  bottom: 8px; right: 8px;
  border-bottom: 4px solid #ff6700;
  border-right: 4px solid #ff6700;
  border-radius: 0 0 4px 0;
}
.access-cards.minimal > .l-corner-bl {
  bottom: 8px; left: 8px;
  border-bottom: 4px solid #ff6700;
  border-left: 4px solid #ff6700;
  border-radius: 0 0 0 4px;
}
.card-left {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 150px;
}
.card-left.vertical {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 84px;
}
.card-left.vertical .card-icon.main {
  display: block;
}
.card-left.vertical .main-label .main-text { color: #ff6700; }
.card-left.vertical .main-label { text-align: center; }
.card-right {
  flex: 1 1 auto;
  display: flex;
  align-items: center; /* 垂直居中 */
}
.access-cards.minimal > .access-card:nth-child(1) { flex: 5 0 0; }
.access-cards.minimal > .access-card:nth-child(2) { flex: 2.5 0 0; }
.access-cards.minimal > .access-card:nth-child(3) { flex: 2 0 0; }
.card-main {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.card-icon-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}
.card-icon.main {
  width: 28px;
  height: 28px;
  color: #ff6700;
}
.main-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.main-text {
  font-size: 14px;
  color: #ff6700;
  font-weight: 500;
  line-height: 1.1;
}
.main-sub {
  font-size: 11px;
  color: #ff6700;
  line-height: 1.1;
  margin-top: 2px;
}
.card-subcategories.minimal {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 22px;
  margin-top: 4px;
  /* 展示全部子项，不裁剪 */
  max-height: none;
  overflow: visible;
}
.card-subcategories.minimal a {
  color: #666;
  background: none;
  text-decoration: none;
  font-size: 14px;
  padding: 0;
  border-radius: 0;
  border: none;
  transition: color 0.15s;
  line-height: 1.6;
  display: inline-block; /* 确保按项换行 */
}
.card-subcategories.minimal a:hover {
  color: #ff6700;
  text-decoration: none;
}
/* 微调：在大屏上把子链接排成两行，紧凑对齐 */
@media (min-width: 1200px) {
  .card-subcategories.minimal {
    gap: 0 14px;
  }
  .card-left { width: 140px; }
}
@media (min-width: 1200px) {
  /* 大屏：提升快链区域的列间距与均分度 */
  .hy-fenlei .hy-list { grid-template-columns: 1fr 1fr 1fr; gap: 12px 36px; }
  .hy-fenlei .hy-suvlist { column-gap: 28px; }
}
@media (max-width: 900px) {
  .access-card.minimal {
    padding: 0 12px;
    height: 56px;
  }
  .card-icon.main {
    width: 20px;
    height: 20px;
  }
  .main-text {
    font-size: 13px;
  }
  .main-sub {
    font-size: 10px;
  }
  .card-subcategories.minimal a {
    font-size: 12px;
  }
  /* 快捷入口：中屏以下改为单列排布 */
  .hy-fenlei .hy-list { grid-template-columns: 1fr; }
  .hy-fenlei .hy-list > li { grid-template-columns: 80px 1fr; }
  .hy-fenlei .hy-suvlist { grid-template-rows: repeat(3, 20px); row-gap: 6px; }
}
@media (max-width: 700px) {
  .access-cards.minimal > .access-card:nth-child(1) { flex: 3 0 0; }
  .access-cards.minimal > .access-card:nth-child(2) { flex: 2 0 0; }
  .access-cards.minimal > .access-card:nth-child(3) { flex: 1 0 0; }
  .card-subcategories.minimal { max-height: 40px; }
}
@media (max-width: 600px) {
  .access-card.minimal {
    padding: 0 4px;
    height: 44px;
  }
  .card-icon.main {
    width: 16px;
    height: 16px;
  }
  .main-text {
    font-size: 11px;
  }
  .main-sub {
    font-size: 9px;
  }
  .card-subcategories.minimal a {
    font-size: 10px;
  }
  /* 小屏：每个板块子项裁剪为两行（不提供展开） */
  .hy-fenlei .hy-suvlist { grid-template-rows: repeat(2, 20px); max-height: 44px; overflow: hidden; }
}
@media (max-width: 900px) {
  .access-cards {
    gap: 16px;
  }
  .access-card {
    min-width: 180px;
    max-width: 220px;
    padding: 14px 8px 12px 10px;
  }
  .card-title {
    font-size: 15px;
  }
  .card-icon {
    width: 22px;
    height: 22px;
  }
}
@media (max-width: 600px) {
  .access-cards {
    gap: 10px;
    padding: 0 4px;
  }
  .access-card {
    min-width: 140px;
    max-width: 180px;
    padding: 10px 4px 8px 6px;
  }
  .card-title {
    font-size: 13px;
  }
  .card-icon {
    width: 18px;
    height: 18px;
  }
}

/* ==================== 四行展示横幅 ==================== */
.promo-strip {
  background: white;
  padding: 6px 0;
  margin-bottom: 6px; /* 与下方 main-content 的间距 */
}

 .promo-strip .container {
   display: flex;
   flex-direction: column;
   gap: 15px;
 }

 .promo-item.promo-slot.large {
   height: 100px;
 }

 .promo-item.promo-slot.large .promo-slot-text {
   font-size: 18px;
 }

 .promo-item.promo-slot.medium {
   height: 100px;
 }

 .promo-item.promo-slot.medium .promo-slot-text {
   font-size: 18px;
 }
 
 .main-banner {
   background: linear-gradient(135deg, var(--primary-color) 0%, #FF8533 100%);
   color: white;
   border-radius: var(--radius-medium);
   padding: 20px;
   margin-bottom: 0;
 }

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-left h3 {
  font-size: 24px;
  margin: 0 0 8px 0;
  font-weight: bold;
}

.banner-left p {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.qr-codes {
  display: flex;
  gap: 20px;
}

.qr-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.qr-item .qr-placeholder {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border-radius: var(--radius-medium);
}

.qr-item span {
  font-size: 12px;
  opacity: 0.9;
}

.banner-img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-medium);
  cursor: pointer;
  transition: transform 0.3s;
}

.banner-img:hover {
  filter: brightness(1.1);
}

/* ==================== 主要内容区域 ==================== */
.main-content {
  background: white;
  padding: 6px 0; /* 内边距缩小 */
  margin-bottom: 6px; /* 与下方 bottom-content 的间距 */
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
  margin-bottom: 0; /* 避免额外下间距，交由 section 控制 */
  align-items: start;
}

/* Hero轮播 - 第一行第一列 */
.hero-carousel {
  grid-column: 1;
  grid-row: 1;
}

/* 热搜区域 - 第一行第二列 */ 
.hot-news {
  grid-column: 2;
  grid-row: 1;
}

/* 本地新闻 - 第二行第一列 */
.local-news {
  grid-column: 1; 
  grid-row: 2;
}

/* 创业投资 - 第二行第二列 */
.business-investment {
  grid-column: 2;
  grid-row: 2;
}

/* 竖向广告 - 跨两行，第三列 */
.vertical-ads {
  grid-column: 3;
  grid-row: 1 / 3;
}

/* Hero 轮播 */
.hero-carousel {
  position: relative;
  border-radius: var(--radius-medium);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  outline: none;
}

.carousel-image {
  width: 100%;
  aspect-ratio: 4 / 3; /* 固定 4:3 比例 */
  position: relative;
  background: #f5f5f5;
}

.carousel-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  left: 0; top: 0;
  backface-visibility: hidden;
  will-change: opacity;
}

/* 渐隐切换动画 */
.fade-enter-active, .fade-leave-active { transition: opacity .5s ease; will-change: opacity; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { position: absolute; inset: 0; }

/* 左右箭头 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.35);
  color: #fff;
  font-size: 20px;
  line-height: 36px;
  text-align: center;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s ease;
}
.carousel-arrow.prev { left: 10px; }
.carousel-arrow.next { right: 10px; }
.carousel-arrow:hover { background: rgba(0,0,0,0.5); }

/* Hover 或聚焦时显示箭头 */
.hero-carousel:hover .carousel-arrow,
.hero-carousel:focus-within .carousel-arrow { opacity: 1; pointer-events: auto; }

.carousel-controls {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
}

.control-dot {
  width: 30px;
  height: 24px;
  background: rgba(0,0,0,0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  border-radius: var(--radius-small);
  transition: background 0.3s;
}

.control-dot.active {
  background: var(--primary-color);
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 30px 15px 10px;
  font-size: 16px;
  font-weight: 500;
}

/* 热搜区域 */
.hot-news {
  background: white;
  border-radius: var(--radius-medium);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.section-tabs {
  display: flex;
  background: #f8f8f8;
  border-bottom: 1px solid var(--border-primary);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 8px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tab-item.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  background: white;
  font-weight: 500;
}

.news-list {
  padding: 15px 15px 0;
}

.news-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  transition: background 0.3s;
  border-radius: var(--radius-small);
  position: relative;
}

/* 移除最后一条的分割线与底部间距 */
.news-list .news-item:last-child {
  border-bottom: none;
}

/* 还原 hover 展开交互：当前项高度自适应并显示详情区 */
.news-item .hy_sdli_hide { display: none; }
.news-item.hy_hover .hy_sdli_hide { display: none; }
.local-news-item .hy_sdli_hide { display: none; }
.local-news-item.hy_hover .hy_sdli_hide { display: flex; }

.news-item.highlighted .news-rank {
  background: var(--primary-color);
  color: white;
}

/* 新闻详细信息展开样式 */
.hy_sdli_hide {
  display: none;
  padding: 15px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.hy_hover .hy_sdli_hide {
  display: flex;
  gap: 15px;
}

.hy_sdli_hidepic {
  flex-shrink: 0;
  width: 140px;
  height: 68px;
  border-radius: var(--radius-small);
  overflow: hidden;
}

.hy_sdli_hidepic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hy_sdli_hidetxt {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hy_sdli_hidetxt p {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hy_sdli_hideinfo {
  font-size: 12px;
  color: var(--text-light);
}

.news-rank {
  width: 20px;
  height: 20px;
  background: #f5f5f5;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.news-item .news-title {
  flex: 1;
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 热榜条目字体加大 */
.hot-news .news-item .news-title {
  font-size: 14px;
}

.news-item .news-title {
  flex: 1;
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-item .news-date {
  color: var(--text-light);
  font-size: 11px;
  margin-left: 8px;
}

/* 本地新闻和创业投资 */
.local-news,
.business-investment {
  background: white;
  border-radius: var(--radius-medium);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f8f8;
  border-bottom: 1px solid var(--border-primary);
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
}

.more-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 13px;
}

.more-link:hover {
  color: var(--primary-hover);
}

.news-items,
.investment-items {
  padding: 6px 15px 15px; /* 顶部间距降到 6px，统一间隙 */
}

.local-news-item,
.investment-item {
  border-bottom: 1px solid #f5f5f5;
  position: relative;
}

/* 本地新闻：头部(标题+日期)固定一行，详情在下方出现 */
.local-news-item {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  row-gap: 6px;
  align-items: center;
  padding: 8px 0;
}
.local-news-item .news-title { grid-column: 1; margin-right: 10px; }
.local-news-item .news-date { grid-column: 2; }
.local-news-item .hy_sdli_hide { grid-column: 1 / -1; padding-top: 6px; }
.investment-item .hy_sdli_hide { grid-column: 1 / -1; padding-top: 6px; }
.help-item .hy_sdli_hide { grid-column: 1 / -1; padding-top: 6px; }
.lawyer-item .hy_sdli_hide { grid-column: 1 / -1; padding-top: 6px; }

/* 创业投资：头部(标题+日期)固定一行，详情在下方出现 */
.investment-item {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  row-gap: 6px;
  align-items: center;
  padding: 8px 0;
}
.investment-title { grid-column: 1; }
.investment-date { grid-column: 2; }

.local-news-item:last-child,
.investment-item:last-child {
  border-bottom: none;
}

.local-news-item .news-title,
.investment-title {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.4;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 0.3s ease;
}

.investment-title:hover {
  color: var(--primary-hover);
}

/* 热榜/本地新闻：hover 标题变橙色 */
.news-item:hover .news-title,
.local-news-item:hover .news-title {
  color: var(--primary-color);
}

.local-news-item .news-date,
.investment-date {
  color: var(--text-light);
  font-size: 12px;
  white-space: nowrap;
}

/* 竖向五格展示 */
.vertical-ads {
   display: flex;
   flex-direction: column;
   gap: 8px;
   height: 100%;
   min-height: 700px; /* 固定最小高度，稍微加高，避免hover影响 */
   max-height: 700px; /* 固定最大高度，稍微加高，避免hover影响 */
 }
 
 .promo-vertical-item {
   display: flex;
   flex-direction: column;
   align-items: center;
   flex: 1;
 }
 
 .promo-vertical-item.promo-slot.small {
   min-height: 80px;
   width: 100%;
 }

 .promo-vertical-item.promo-slot.small:has(.ad-image) {
   min-height: unset;
   height: 100%;
 }
 
 .promo-vertical-item.promo-slot.small .promo-slot-text {
   font-size: 12px;
 }
 
 .promo-vertical-item:not(.promo-slot) {
   background: white;
   border-radius: var(--radius-small);
   padding: 8px;
   cursor: pointer;
   transition: transform 0.3s, box-shadow 0.3s;
   box-shadow: var(--shadow-light);
 }
 
.promo-vertical-item:not(.promo-slot):hover {
  color: var(--primary-hover);
}
 
 .promo-vertical-item img {
   width: 100%;
   height: 80px;
   object-fit: cover;
   border-radius: var(--radius-small);
   margin-bottom: 5px;
 }

 .promo-vertical-item .ad-image {
   height: 100%;
   margin-bottom: 0;
   border-radius: 0;
 }
 
 .promo-title {
   font-size: 11px;
   color: var(--text-primary);
   text-align: center;
   font-weight: 500;
 }

/* ==================== 底部复杂布局 ==================== */
.bottom-content {
  background: white;
  padding: 6px 0;
}

.bottom-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}



.bottom-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bottom-ad {
  padding: 0;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

 .promo-bottom.promo-slot.wide {
   height: 100px;
 }

 .promo-bottom.promo-slot.wide .promo-slot-text {
   font-size: 16px;
 }
 
 .bottom-ad-img {
   width: 100%;
   height: 100px;
   object-fit: cover;
   border-radius: var(--radius-medium);
   cursor: pointer;
   transition: transform 0.3s;
 }
 
.bottom-ad-img:hover {
  filter: brightness(1.1);
}

.bottom-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  flex: 1;
}

.help-section,
.lawyer-section {
  background: white;
  border-radius: var(--radius-medium);
  overflow: hidden;
  box-shadow: var(--shadow-light);
}

.help-items,
.lawyer-items {
  padding: 6px 15px 15px; /* 顶部间距降到 6px */
}

.help-item,
.lawyer-item {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  row-gap: 6px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}
.help-item .help-title { grid-column: 1; }
.help-item .help-date { grid-column: 2; }
.lawyer-item .lawyer-title { grid-column: 1; }
.lawyer-item .lawyer-date { grid-column: 2; }

.help-item:last-child,
.lawyer-item:last-child {
  border-bottom: none;
}

.help-title,
.lawyer-title {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.4;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: color 0.3s ease;
}

.help-title:hover,
.lawyer-title:hover {
  color: var(--primary-hover);
}

.help-date,
.lawyer-date {
  color: var(--text-light);
  font-size: 12px;
  white-space: nowrap;
}

/* 右侧功能按钮区域 */
.bottom-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: -30px; /* 进一步上移整个右侧区域 */
}

.function-buttons {
  background: white;
  border-radius: 0;
  padding: 12px 20px 18px;
  box-shadow: none;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.function-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 12px;
  cursor: pointer;
  border-radius: 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  aspect-ratio: 1 / 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.function-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--primary-color), #ff8c42);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.function-button:hover::before {
  opacity: 1;
}

.function-button:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 25px rgba(255, 107, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

.function-icon {
  width: 24px;
  height: 24px;
  color: #555;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.function-label {
  font-size: 12px;
  color: #333;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

/* icon 圆底色块（直角卡片里再加圆底） */
.function-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
}

.function-button:hover .function-icon-wrap {
  background: rgba(255, 255, 255, 0.95);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.function-button:hover .function-icon {
  color: var(--primary-color);
  transform: scale(1.1);
}

.function-button:hover .function-label {
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 橙色强调的 hover 背景与浮起效果 */
.function-button:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 0 4px 14px rgba(255, 106, 0, 0.22);
  transform: scale(1.01);
}
.function-button:active { transform: scale(1.0); }

/* ==================== 侧边栏工具 ==================== */
.sidetools {
  position: fixed;
  top: 30%;
  right: 10px;
  transform: translateY(-30%);
  z-index: 999;
}

.sidetools ul {
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #eee;
  border-right: none;
  background: #fff;
  border-radius: 6px 0 0 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.sidetools li {
  position: relative;
  width: 78px; /* 略宽以容纳图标+文字 */
  height: 64px;
  border-bottom: 1px solid #f0f0f0;
}

.sidetools li:last-child { border-bottom: none; }

.sidetools li a {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: #666;
  transition: color .2s ease, background .2s ease;
  text-decoration: none;
}

.tool-icon {
  width: 22px;
  height: 22px;
  padding: 3px;
  border: 1px solid #ddd;
  border-radius: 50%;
  color: #bbb;
}

.sidetools li:hover a { color: #f15a2b; }
.sidetools li:hover .tool-icon {
  color: #f15a2b;
  border-color: #f15a2b;
}

/* 展开卡片 */
.kefu_part_open,
.weixin_part_open,
.app_part_open {
  position: absolute;
  right: 78px; /* 与标签宽度保持一致 */
  top: 0;
  width: 240px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  display: none;
  padding: 16px;
}

.kefu_part_box:hover .kefu_part_open,
.weixin_part_box:hover .weixin_part_open,
.app_part_box:hover .app_part_open { display: block; }

/* 微信二维码 */
.weixin-qr img {
  width: 170px;
  height: 170px;
  border: 1px solid #eee;
  border-radius: 4px;
}
.weixin-qr p { margin-top: 8px; color: #999; font-size: 12px; }

/* 按钮化处理 */
.kefu_part_open .deanonline {
  display: inline-block;
  background: #f15a2b;
  color: #fff;
  padding: 8px 14px;
  border-radius: 3px;
  text-decoration: none;
}
.app_part_open a { display:inline-block; margin-right:8px; margin-top:8px; padding:6px 10px; background:#f7f7f7; border:1px solid #eee; border-radius:3px; color:#666; text-decoration:none; }
.app_part_open a:hover { color:#f15a2b; border-color:#f15a2b; }
</style>

/* Layout tweaks: force first panel subcategories to 2x2, second panel to 1x2 */
<style scoped>
/* 第1个面板 2x2布局，最多4项，紧凑换行 */
.access-card.minimal:nth-child(1) .card-subcategories.minimal {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px 10px;
  max-height: 48px;
  overflow: hidden;
}

/* 第2个面板 1x2布局，最多2项，单行 */
.access-card.minimal:nth-child(2) .card-subcategories.minimal {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  gap: 0 10px;
  max-height: 24px;
  overflow: hidden;
}

.card-subcategories.minimal a {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  line-height: 24px;
}
</style>
