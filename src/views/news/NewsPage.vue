<template>
  <div class="news-page">
    <!-- 主体内容 -->
    <div class="juejin-main-content">
      <div class="container">
        <div class="juejin-content-layout news-three-column-layout">
          <!-- 左侧导航栏 -->
          <aside class="juejin-left-sidebar">
            <!-- 分类导航 -->
            <div class="juejin-sidebar-widget">
              <div class="juejin-widget-header">
                <h3 class="juejin-widget-title">
                  <Folder class="juejin-widget-icon" />
                  分类导航
                </h3>
              </div>
              <div class="juejin-widget-content">
                <nav class="juejin-left-category-nav">
                  <div 
                    v-for="category in categories" 
                    :key="category.slug"
                    :class="['juejin-left-nav-item', { active: activeCategory === category.slug }]"
                    @click="activeCategory = category.slug"
                  >
                    <component :is="getIconComponent(category.icon)" class="juejin-left-nav-icon" />
                    <span class="juejin-left-nav-text">{{ category.name }}</span>
                  </div>
                </nav>
              </div>
            </div>

            <!-- 排序筛选 -->
            <div class="juejin-sidebar-widget">
              <div class="juejin-widget-header">
                <h3 class="juejin-widget-title">
                  <TrendingUp class="juejin-widget-icon" />
                  排序方式
                </h3>
              </div>
              <div class="juejin-widget-content">
                <div class="juejin-left-sort-nav">
                  <div 
                    v-for="type in sortTypes" 
                    :key="type.value"
                    :class="['juejin-left-sort-item', { active: sortType === type.value }]"
                    @click="sortType = type.value; loadNews()"
                  >
                    <component :is="getIconComponent(type.icon)" class="juejin-left-sort-icon" />
                    <span class="juejin-left-sort-text">{{ type.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 热门标签（左侧多选筛选） -->
            <div class="juejin-sidebar-widget">
              <div class="juejin-widget-header">
                <h3 class="juejin-widget-title">
                  <Tag class="juejin-widget-icon" />
                  热门标签
                </h3>
              </div>
              <div class="juejin-widget-content">
                <div class="juejin-tag-cloud left-tags">
                  <span 
                    v-for="tag in displayTags" 
                    :key="tag.name"
                    :class="['juejin-tag-cloud-item', { active: selectedTags.includes(tag.name) }]"
                    @click="toggleTag(tag.name)"
                  >
                    <span>{{ tag.name }}</span>
                    <X v-if="selectedTags.includes(tag.name)" class="tag-suffix" />
                    <Plus v-else class="tag-suffix" />
                  </span>
                </div>
              </div>
            </div>

            <!-- 我要发布 -->
            <div class="juejin-sidebar-widget">
              <div class="juejin-widget-content" style="padding: 16px;">
                <button 
                  class="publish-btn-primary"
                  @click="goToPublish"
                >
                  <span>我要发布</span>
                  <Plus class="publish-btn-icon" />
                </button>
              </div>
            </div>
          </aside>
          <!-- 文章列表 -->
          <main class="juejin-articles-section" role="main" aria-label="新闻文章列表">
            <div class="juejin-article-list">
              <article 
                v-for="article in newsList" 
                :key="article.id"
                class="juejin-article-card"
                @click="goToDetail(article.id)"
                itemscope
                itemtype="https://schema.org/NewsArticle"
              >
                <!-- 文章内容：标题一行 + 摘要一行，右侧可选图片 -->
                <div :class="['news-item-row', { 'has-thumb': !!article.cover_image }]">
                  <div class="news-item-main">
                    <h2 class="news-item-title" itemprop="headline">{{ article.title }}</h2>
                    <p class="news-item-excerpt" itemprop="description">{{ article.summary }}</p>
                    <div class="news-item-meta">
                      <div class="meta-left">
                        <span 
                          class="meta-author"
                          v-if="article.author?.id"
                          @click.stop="$router.push(`/user/${article.author.id}`)"
                          style="cursor:pointer;"
                          itemprop="author"
                          itemscope
                          itemtype="https://schema.org/Person"
                        ><span itemprop="name">{{ article.author?.nickname || '匿名' }}</span></span>
                        <span class="meta-author" v-else itemprop="author" itemscope itemtype="https://schema.org/Person"><span itemprop="name">{{ article.author?.nickname || '匿名' }}</span></span>
                        <span class="meta-sep">·</span>
                        <span class="meta-views"><Eye class="meta-icon" />{{ formatNumber.compact(article.views) }}</span>
                        <span class="meta-sep">·</span>
                        <span class="meta-likes"><Heart class="meta-icon" />{{ article.likes || 0 }}</span>
                      </div>
                      <div class="meta-right" v-if="article.tags && article.tags.length">
                        <span 
                          v-for="tag in article.tags.slice(0, 3)"
                          :key="tag"
                          class="news-tag"
                        >{{ tag }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="article.cover_image" class="news-item-thumb">
                    <img 
                      :src="article.cover_image" 
                      :alt="article.title"
                      loading="lazy"
                      decoding="async"
                      @error="handleImageError"
                      itemprop="image"
                    >
                  </div>
                </div>
              </article>
            </div>

            <!-- 无限滚动加载 -->
            <div class="juejin-load-more-section">
              <div v-if="loading" class="juejin-loading-indicator">
                <div class="juejin-loading-spinner"></div>
                <span>加载中...</span>
              </div>
              <div v-else-if="!hasMore && newsList.length > 0" class="no-more-data">
                <span>已加载全部内容</span>
              </div>
            </div>
          </main>

          <!-- 侧边栏 -->
          <aside class="juejin-sidebar">
            <!-- 智能搜索框 -->
            <div class="sidebar-widget search-widget search-widget-framed" style="margin-bottom: 0;">
              <div class="search-container">
                <div class="search-input-wrapper">
                  <Search class="search-icon" />
                  <input 
                    type="text" 
                    placeholder="搜索资讯、热点新闻..." 
                    class="search-input"
                    v-model="searchQuery"
                    @keyup.enter="performSearch"
                    @input="debouncedSearch"
                    autocomplete="off"
                    spellcheck="false"
                  >
                  <button 
                    v-if="searchQuery" 
                    class="clear-search-btn"
                    @click="clearSearch"
                  >
                    <X :size="14" />
                  </button>
                </div>
                <button class="search-btn" @click="performSearch" :disabled="!searchQuery.trim()">
                  搜索
                </button>
              </div>
              
              <!-- 搜索建议下拉框 -->
              <div v-if="searchSuggestions.length > 0" class="search-suggestions">
                <div 
                  v-for="suggestion in searchSuggestions" 
                  :key="suggestion"
                  class="suggestion-item"
                  @click="selectSuggestion(suggestion)"
                >
                  <Search class="suggestion-icon" />
                  <span>{{ suggestion }}</span>
                </div>
              </div>
              
              <!-- 热门搜索标签 -->
              <div class="hot-search-tags" v-if="!searchQuery">
                <span class="hot-search-label">热门搜索：</span>
                <span 
                  v-for="tag in hotSearchTags" 
                  :key="tag"
                  class="hot-search-tag"
                  @click="searchByTag(tag)"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- 热门文章 -->
            <div class="juejin-sidebar-widget">
              <div class="juejin-widget-header" style="display:flex;align-items:center;justify-content:space-between;">
                <h3 class="juejin-widget-title" style="margin:0;display:flex;align-items:center;gap:8px;">
                  <TrendingUp class="juejin-widget-icon" />
                  热门资讯
                </h3>
                <div style="display:flex;gap:12px;">
                  <button class="btn btn-text" @click="nextHotPage">
                    <RefreshCcw class="inline-icon" />
                    换一换
                  </button>
                </div>
              </div>
              <div class="juejin-widget-content">
                <div class="juejin-hot-list juejin-hot-list-single">
                  <div 
                    v-for="(item, index) in hotNews.slice(hotStart, hotStart + hotPageSize)" 
                    :key="item.id"
                    class="juejin-hot-item single-row"
                    @click="goToDetail(item.id)"
                  >
                    <div class="juejin-hot-rank" :class="{ top: hotStart + index < 3 }">{{ hotStart + index + 1 }}</div>
                    <div class="juejin-hot-content">
                      <h4 class="juejin-hot-title single-line">{{ item.title }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            

            <!-- 智能推荐 -->
            <div class="juejin-sidebar-widget">
              <div class="juejin-widget-header">
                <h3 class="juejin-widget-title">
                  <Star class="juejin-widget-icon" />
                  为你推荐
                </h3>
              </div>
              <div class="juejin-widget-content">
                <div class="recommended-articles">
                  <div 
                    v-for="item in recommendedArticles" 
                    :key="item.id"
                    class="recommended-item"
                    @click="goToDetail(item.id)"
                  >
                    <img :src="item.cover_image || 'https://picsum.photos/80/60?random=' + item.id" class="recommended-image" loading="lazy">
                    <div class="recommended-content">
                      <h5 class="recommended-title">{{ item.title }}</h5>
                      <div class="recommended-meta">
                        <span class="recommended-views"><Eye class="inline-icon" />{{ formatNumber.compact(item.views) }}</span>
                        <span class="recommended-time">{{ formatTime.friendly(item.created_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 推荐作者 -->
            <div class="juejin-sidebar-widget">
              <div class="juejin-widget-header">
                <h3 class="juejin-widget-title">
                  <Users class="juejin-widget-icon" />
                  推荐作者
                </h3>
              </div>
              <div class="juejin-widget-content">
                <div class="juejin-author-list">
                  <div 
                    v-for="author in recommendedAuthors" 
                    :key="author.id"
                    class="juejin-author-item"
                  >
                    <img :src="$getImageUrl(author.avatar)" :alt="author.name" class="juejin-author-thumb" loading="lazy">
                    <div class="juejin-author-details">
                      <h4 class="juejin-author-title">{{ author.name }}</h4>
                      <p class="juejin-author-desc">{{ author.description }}</p>
                      <div class="juejin-author-stats">
                        <span>{{ author.followers }} 关注者</span>
                        <span>{{ author.articles }} 文章</span>
                      </div>
                    </div>
                    <button class="juejin-follow-btn" @click="toggleFollow(author)">关注</button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>

  <!-- 登录提示弹窗 -->
  <div v-if="showLoginModal" class="modal-overlay login-modal-overlay" @click="showLoginModal = false">
    <div class="login-modal" @click.stop>
      <button class="login-modal-close" @click="showLoginModal = false">
        <Plus style="transform: rotate(45deg); width: 16px; height: 16px;" />
      </button>
      <div class="login-modal-content">
        <div class="login-modal-icon">🔐</div>
        <h3 class="login-modal-title">请先登录才能进行此操作</h3>
        <p class="login-modal-desc">登录后即可使用点赞、收藏、评论等功能</p>
        <div class="login-modal-actions">
          <button class="login-btn" @click="goToLogin">
            <User :size="16" />
            立即登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 定义组件名称以支持 keep-alive
import { defineOptions } from 'vue'
defineOptions({
  name: 'NewsPage'
})

import { 
  Newspaper, MessageCircle, Eye, Home, DollarSign, Scale, Building2, 
  Plane, GraduationCap, Star, Folder, Heart, Clock, TrendingUp, 
  Flame, Share2, Tag, Users, RefreshCcw, X, Plus, Globe, User, Search 
} from 'lucide-vue-next';

import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { newsAPI } from '@/api/news'
import { formatTime, formatNumber } from '@/utils'

// SEO结构化数据
const addStructuredData = () => {
  // 移除已存在的结构化数据
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
  existingScripts.forEach(script => {
    if (script.textContent.includes('马来西亚华人资讯')) {
      script.remove()
    }
  })

  // 添加WebPage结构化数据
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "马来西亚华人资讯 - 知马网",
    "description": "提供马来西亚华人社区最新资讯、政策解读、经济发展、文化交流等全方位信息",
    "url": "https://zhimawang.com/news",
    "mainEntity": {
      "@type": "ItemList",
      "name": "马来西亚华人资讯列表",
      "description": "最新的马来西亚华人社区资讯和新闻"
    }
  }

  // 添加FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "马来西亚华人社区有哪些最新政策？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "我们提供马来西亚最新的华人社区政策解读，包括移民政策、投资政策、教育政策等各方面的详细信息。"
        }
      },
      {
        "@type": "Question", 
        "name": "如何在马来西亚进行投资？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "马来西亚为外国投资者提供了多种投资机会，包括制造业、服务业、房地产等领域。我们提供详细的投资指南和政策解读。"
        }
      }
    ]
  }

  // 动态添加结构化数据
  const addScript = (schema) => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
  }

  addScript(webPageSchema)
  addScript(faqSchema)
}

const router = useRouter()
const route = useRoute()

// 登录状态管理
const isLoggedIn = ref(false) // 模拟登录状态
const showLoginModal = ref(false)

// 搜索相关
const searchQuery = ref('')
const searchSuggestions = ref([])
const hotSearchTags = ref(['马来西亚政策', '华人社区', '投资指南', '教育资讯', '生活服务'])

// 图标组件映射
const iconComponents = {
  Newspaper,
  Building2,
  Home,
  Scale,
  DollarSign,
  Plane,
  GraduationCap,
  Clock,
  Eye,
  TrendingUp,
  Globe,
  Flame,
  Share2,
  Tag,
  Users,
  Folder,
  Star,
  RefreshCcw,
  X,
  Plus
}

// 获取图标组件
const getIconComponent = (iconName) => {
  return iconComponents[iconName] || Newspaper
}

// 响应式数据
const activeCategory = ref('local')
const sortType = ref('recommended')
const newsList = ref([])
const hotNews = ref([])
const hotStart = ref(0)
const hotPageSize = 5
const recommendedArticles = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const loading = ref(false)
const popularTags = ref([])
const recommendedAuthors = ref([])
const selectedTags = ref([])
const displayTags = computed(() => {
  if (!selectedTags.value.length) return popularTags.value
  const set = new Set(selectedTags.value)
  const selected = popularTags.value.filter(t => set.has(t.name))
  const rest = popularTags.value.filter(t => !set.has(t.name))
  return [...selected, ...rest]
})

// 无限滚动相关
const hasMore = ref(true)
const isLoadingMore = ref(false)
const scrollThreshold = 200 // 距离底部200px时触发加载

// 分类数据
const categories = [
  { name: '本地新闻', slug: 'local', icon: 'Building2' },
  { name: '中国热点', slug: 'china', icon: 'Globe' },
  { name: '官方消息', slug: 'official', icon: 'Newspaper' }
]

// 排序类型
const sortTypes = [
  { value: 'recommended', label: '推荐', icon: 'Star' },
  { value: 'latest', label: '最新', icon: 'Clock' },
  { value: 'hot', label: '热门', icon: 'Flame' },
  { value: 'views', label: '最多浏览', icon: 'Eye' }
]

// 方法
const loadNews = async () => {
  try {
    loading.value = true
    const params = {
      pageId: 1,
      channelId: -1,
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      contentType: 1
    }
    const response = await newsAPI.getArticles(params)
    const list = Array.isArray(response.data?.list) ? response.data.list : []
    const enhanced = list.map((item) => {
      const allowed = ['马来西亚','华人社区','政策解读','经济发展','文化交流','教育资讯','投资理财','生活服务','旅游观光','科技创新']
      const filtered = (item.tags || []).filter(t => allowed.includes(t))
      const fallback = selectedTags.value.length ? selectedTags.value.slice(0, 2) : ['马来西亚','华人社区']
      return { ...item, tags: filtered.length ? filtered : fallback }
    })
    newsList.value = enhanced
    total.value = response.data?.total || enhanced.length
    hasMore.value = response.data?.hasMore ?? (enhanced.length === pageSize.value)
  } catch (error) {
    console.error('加载新闻失败:', error)
    // 回退到模拟数据
    loadMockNews()
  } finally {
    loading.value = false
  }
}

const loadHotNews = async () => {
  try {
    // 随机种子接口异常时，回退为不带 randomSeed 的时间倒序
    let randomSeed
    try {
      const seedResp = await newsAPI.generateRandomSeed()
      randomSeed = seedResp?.data?.randomSeed
    } catch {}
    const params = { pageId: 1, limit: 5, offset: 0, contentType: 1 }
    if (randomSeed != null) params.randomSeed = randomSeed
    const resp = await newsAPI.getArticles(params)
    hotNews.value = resp?.data?.list || []
    hotStart.value = 0
  } catch (error) {
    // 使用模拟数据（回退）
    hotNews.value = Array.from({ length: 5 }, (_, i) => ({
      id: 100 + i,
      title: `热门新闻标题 ${i + 1} - 吸引读者眼球的标题内容`,
      views: 5000 + i * 500,
      created_at: `2025-03-${15 - i}T10:00:00Z`
    }))
    hotStart.value = 0
  }
}
// 换一换：分页滚动显示（每次显示5条）
const nextHotPage = async () => {
  await loadHotNews() // 换一换：重新获取新随机种子与 5 条数据
}

const loadPopularTags = () => {
  const names = ['马来西亚','华人社区','政策解读','经济发展','文化交流','教育资讯','投资理财','生活服务','旅游观光','科技创新']
  popularTags.value = names.map((name, i) => ({ name, size: 12 + (i % 4) }))
}

const loadRecommendedAuthors = () => {
  recommendedAuthors.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `资深作者${i + 1}`,
    description: '专注马来西亚华人社区资讯，提供深度分析和独到见解',
    avatar: 'https://picsum.photos/40/40?random=18',
    followers: 1200 + i * 300,
    articles: 45 + i * 10
  }))
}

const loadRecommendedArticles = () => {
  // 基于用户行为的智能推荐算法
  const userPreferences = getUserPreferences()
  const trendingArticles = getTrendingArticles()
  const personalizedArticles = getPersonalizedArticles(userPreferences)
  
  // 混合推荐：个性化 + 热门 + 最新
  recommendedArticles.value = [
    ...personalizedArticles.slice(0, 2),
    ...trendingArticles.slice(0, 2),
    ...getLatestArticles().slice(0, 1)
  ].map((article, i) => ({
    id: 200 + i,
    title: article.title,
    cover_image: article.cover_image || 'https://picsum.photos/80/60?random=' + (200 + i),
    views: article.views || 2000 + i * 500,
    created_at: article.created_at || `2025-03-${10 + i}T10:00:00Z`,
    category: article.category,
    tags: article.tags
  }))
}

// 获取用户偏好
const getUserPreferences = () => {
  // 模拟用户偏好数据
  return {
    categories: ['local', 'china'],
    tags: ['马来西亚', '华人社区', '政策解读'],
    readingHistory: [1, 3, 5, 7],
    likedArticles: [2, 4, 6]
  }
}

// 获取热门文章
const getTrendingArticles = () => {
  return [
    {
      title: '马来西亚2025年经济政策解读 - 华人投资新机遇',
      views: 5000,
      category: 'local',
      tags: ['马来西亚', '投资理财', '政策解读']
    },
    {
      title: '华人社区文化活动精彩回顾 - 传统文化传承',
      views: 3200,
      category: 'local',
      tags: ['华人社区', '文化交流']
    }
  ]
}

// 获取个性化推荐文章
const getPersonalizedArticles = (preferences) => {
  // 基于用户偏好推荐相似内容
  return [
    {
      title: '马来西亚教育政策最新变化 - 华人子女教育指南',
      views: 2800,
      category: 'local',
      tags: ['教育资讯', '政策解读']
    },
    {
      title: '华人企业家在马来西亚的成功案例分享',
      views: 2100,
      category: 'local',
      tags: ['经济发展', '华人社区']
    }
  ]
}

// 获取最新文章
const getLatestArticles = () => {
  return [
    {
      title: '马来西亚华人社区最新动态 - 社区建设成果',
      views: 1500,
      category: 'local',
      tags: ['华人社区', '生活服务']
    }
  ]
}

const filterByTag = (tagName) => {
  toggleTag(tagName)
}

const toggleTag = (tagName) => {
  const exists = selectedTags.value.includes(tagName)
  selectedTags.value = exists
    ? selectedTags.value.filter(t => t !== tagName)
    : [...selectedTags.value, tagName]
  currentPage.value = 1
  const query = { ...route.query, category: activeCategory.value }
  if (selectedTags.value.length) query.tag = selectedTags.value.join(',')
  else delete query.tag
  router.replace({ path: '/news', query })
  loadNews()
}

const loadMockNews = () => {
  const mockData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `马来西亚新闻标题 ${i + 1} - 这是一个比较长的新闻标题用于展示效果`,
    summary: '这是新闻摘要，描述了马来西亚当地发生的重要事件和政策变化，为在马来西亚的华人提供重要信息。这里包含了详细的新闻内容和背景介绍...',
    cover_image: i % 3 === 0 ? 'https://picsum.photos/300/200?random=19' : null,
    author: { 
      nickname: `作者${i + 1}`,
      avatar: 'https://picsum.photos/40/40?random=20'
    },
    views: 1000 + i * 100,
    comments: 10 + i * 2,
    likes: 5 + i * 3,
    tags: ['马来西亚','华人社区','政策解读','经济发展','文化交流','教育资讯','投资理财','生活服务','旅游观光','科技创新'].slice(0, Math.floor(Math.random() * 3) + 1),
    category: ['本地新闻', '中国热点', '官方消息'][i % 3],
    created_at: `2025-03-${15 - (i % 15)}T10:00:00Z`
  }))
  
  newsList.value = mockData
  total.value = 200
}

const goToDetail = (id) => {
  router.push(`/news/${id}`)
}

const goToPublish = () => {
  router.push('/publish/news')
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadNews()
  window.scrollTo(0, 0)
}

// 无限滚动加载更多功能
const loadMore = async () => {
  if (isLoadingMore.value || !hasMore.value) return
  try {
    isLoadingMore.value = true
    currentPage.value += 1
    const params = {
      pageId: 1,
      channelId: -1,
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      contentType: 1
    }
    const response = await newsAPI.getArticles(params)
    const list = Array.isArray(response.data?.list) ? response.data.list : []
    const allowed = ['马来西亚','华人社区','政策解读','经济发展','文化交流','教育资讯','投资理财','生活服务','旅游观光','科技创新']
    const enhanced = list.map((item) => {
      const filtered = (item.tags || []).filter(t => allowed.includes(t))
      const fallback = selectedTags.value.length ? selectedTags.value.slice(0, 2) : ['马来西亚','华人社区']
      return { ...item, tags: filtered.length ? filtered : fallback }
    })
    newsList.value = [...newsList.value, ...enhanced]
    hasMore.value = response.data?.hasMore ?? (enhanced.length === pageSize.value)
  } catch (error) {
    console.error('加载更多失败:', error)
    currentPage.value -= 1
  } finally {
    isLoadingMore.value = false
  }
}

// 滚动事件处理
const handleScroll = () => {
  if (isLoadingMore.value || !hasMore.value) return
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // 当滚动到距离底部200px时触发加载
  if (scrollTop + windowHeight >= documentHeight - scrollThreshold) {
    loadMore()
  }
}

// 节流函数，避免频繁触发
let scrollTimer = null
const throttledScroll = () => {
  if (scrollTimer) return
  scrollTimer = setTimeout(() => {
    handleScroll()
    scrollTimer = null
  }, 100)
}

// 监听分类变化
watch(activeCategory, () => {
  currentPage.value = 1
  loadNews()
})

// 交互功能
const toggleFollow = (author) => {
  // 检查登录状态
  if (!isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  
}

const goToLogin = () => {
  showLoginModal.value = false
  router.push('/auth/login')
}

// 搜索相关函数
const performSearch = () => {
  const kw = searchQuery.value.trim()
  if (!kw) return
  router.push({ name: 'Search', query: { q: kw, type: 'news' } })
}

const clearSearch = () => {
  searchQuery.value = ''
}

const onSearchInput = () => {
  // 智能搜索建议
  const query = searchQuery.value.toLowerCase()
  if (query.length > 1) {
    const suggestions = [
      '马来西亚华人社区政策',
      '马来西亚投资移民',
      '马来西亚教育制度',
      '马来西亚生活指南',
      '马来西亚商业机会',
      '马来西亚文化交流',
      '马来西亚房产投资',
      '马来西亚税务政策'
    ].filter(item => item.toLowerCase().includes(query))
    searchSuggestions.value = suggestions.slice(0, 5)
  } else {
    searchSuggestions.value = []
  }
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion
  searchSuggestions.value = []
  performSearch()
}

const searchByTag = (tag) => {
  searchQuery.value = tag
  performSearch()
}

// 图片错误处理
const handleImageError = (event) => {
  event.target.src = 'https://picsum.photos/300/200?random=999'
}

// 性能优化：防抖搜索
let searchTimeout = null
const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    onSearchInput()
  }, 300)
}

// 初始化
onMounted(() => {
  // 添加SEO结构化数据
  addStructuredData()
  
  // 从URL获取分类参数
  if (route.query.category) {
    activeCategory.value = route.query.category
  }
  if (route.query.tag && typeof route.query.tag === 'string') {
    selectedTags.value = route.query.tag.split(',').filter(Boolean)
  }
  
  loadNews()
  loadHotNews()
  loadPopularTags()
  loadRecommendedAuthors()
  loadRecommendedArticles()
  
  // 添加滚动事件监听
  window.addEventListener('scroll', throttledScroll, { passive: true })
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', throttledScroll)
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
})
</script>

<style scoped>
/* 搜索框样式 */
.search-widget {
  padding: 0 !important;
}

/* 资讯页搜索框外框样式 */
.search-widget-framed {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-container {
  display: flex;
  gap: 8px;
  padding: 16px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6c757d;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: #333;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-search-btn {
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
}

.clear-search-btn:hover {
  background: #e9ecef;
  color: #333;
}

.search-btn {
  padding: 10px 16px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  background: #e55a2b;
  transform: translateY(-1px);
}

.search-btn:disabled {
  background: #dee2e6;
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* 搜索建议样式 */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-icon {
  width: 16px;
  height: 16px;
  color: #6c757d;
  margin-right: 8px;
}

/* 热门搜索标签样式 */
.hot-search-tags {
  padding: 12px 16px;
  border-top: 1px solid #f3f4f6;
  background: #f8f9fa;
}

.hot-search-label {
  font-size: 12px;
  color: #6c757d;
  margin-right: 8px;
}

.hot-search-tag {
  display: inline-block;
  padding: 4px 8px;
  margin: 2px 4px 2px 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hot-search-tag:hover {
  background: #ff6b35;
  color: white;
  border-color: #ff6b35;
}

/* 推荐文章样式 */
.recommended-articles {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommended-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.recommended-item:hover {
  background: #f8f9fa;
  border-color: #e5e7eb;
}

.recommended-image {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.recommended-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recommended-title {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  line-height: 1.4;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommended-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #6c757d;
}

.recommended-views,
.recommended-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.inline-icon {
  width: 12px;
  height: 12px;
}

/* 加载更多按钮样式 */
.load-more-btn {
  text-align: center;
  padding: 20px 0;
}

.load-more-btn .btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.load-more-btn .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 无限滚动样式 */
.no-more-data {
  text-align: center;
  padding: 20px 0;
  color: #6c757d;
  font-size: 14px;
}

.juejin-loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 0;
  color: #6c757d;
  font-size: 14px;
}

.juejin-loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #ff6b35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 登录提示模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-modal-overlay {
  z-index: 2200;
  background: rgba(0, 0, 0, 0.5);
}

.login-modal {
  width: 420px;
  max-width: 90vw;
  background: #fff;
  border-radius: 16px;
  padding: 0;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.login-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
  z-index: 1;
}

.login-modal-close:hover {
  background: rgba(0, 0, 0, 0.15);
  color: #333;
}

.login-modal-content {
  padding: 48px 32px 32px;
  text-align: center;
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
}

.login-modal-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.8;
}

.login-modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.login-modal-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 32px 0;
  line-height: 1.4;
}

.login-modal-actions {
  display: flex;
  justify-content: center;
}

.login-btn {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.2);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.3);
}

.login-btn:active {
  transform: translateY(0);
}

/* 移动端响应式优化 */
@media (max-width: 768px) {
  .news-three-column-layout {
    display: block;
  }
  
  .juejin-left-sidebar {
    display: none;
  }
  
  .juejin-sidebar {
    display: none;
  }
  
  .juejin-articles-section {
    width: 100%;
    padding: 0 16px;
  }
  
  .juejin-article-card {
    padding: 16px;
    margin-bottom: 12px;
  }
  
  .news-item-title {
    font-size: 16px;
    line-height: 1.4;
  }
  
  .news-item-excerpt {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .news-item-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .meta-left {
    flex-wrap: wrap;
  }
  
  .news-item-thumb {
    width: 80px;
    height: 60px;
  }
  
  .news-item-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  /* 移动端搜索优化 */
  .search-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-input-wrapper {
    width: 100%;
  }
  
  .search-btn {
    width: 100%;
    padding: 12px;
  }
  
  /* 移动端分页优化 */
  .pagination {
    justify-content: center;
  }
  
  .pagination .el-pagination__total,
  .pagination .el-pagination__jump {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-modal {
    width: 90vw;
    margin: 20px;
  }
  
  .login-modal-content {
    padding: 32px 24px 24px;
  }
  
  .login-modal-title {
    font-size: 18px;
    margin-bottom: 6px;
  }
  
  .login-modal-desc {
    font-size: 13px;
    margin-bottom: 24px;
  }
  
  .login-btn {
    padding: 12px 24px;
    font-size: 15px;
  }
  
  /* 超小屏幕优化 */
  .news-item-row {
    flex-direction: column;
  }
  
  .news-item-thumb {
    width: 100%;
    height: 120px;
    margin-top: 12px;
  }
  
  .news-item-thumb img {
    border-radius: 8px;
  }
  
  .hot-search-tags {
    padding: 8px 12px;
  }
  
  .hot-search-tag {
    font-size: 11px;
    padding: 3px 6px;
  }
}
</style>

<!-- 稀土掘金风格样式已移至global.css文件 -->
