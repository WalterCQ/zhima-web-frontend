<template>
  <div class="search-page">
    <!-- 顶部搜索栏 -->
      <div class="search-header">
      <div class="search-header-content">
        <div class="search-main">
        <div class="search-input-wrapper">
            <Search class="search-icon" />
            <input 
              type="text" 
                  :placeholder="getPlaceholderText()"
              class="search-input"
            v-model="searchQuery"
              @keyup.enter="performSearch"
              @input="onSearchInput"
            >
            <button 
              v-if="searchQuery" 
              class="clear-search-btn"
              @click="clearSearch"
            >
              <X :size="16" />
            </button>
          </div>
          <button class="search-btn" @click="performSearch" :disabled="!searchQuery.trim()">
            搜索
          </button>
        </div>
      </div>
        </div>

    <!-- 搜索内容区域 -->
    <div class="search-content">
      <!-- 分类筛选 - 居中置顶 -->
      <div v-if="hasSearched" class="search-filters centered-filters">
        <div class="filter-tabs">
          <button 
            v-for="category in searchCategories"
            :key="category.key"
            class="filter-tab"
            :class="{ active: activeCategory === category.key }"
            @click="setActiveCategory(category.key)"
          >
            <component :is="category.icon" :size="16" />
            <span>{{ category.label }}</span>
            <span v-if="results[category.key]?.length" class="count-badge">
              {{ results[category.key].length }}
            </span>
          </button>
        </div>
        </div>

      <!-- 搜索统计 -->
      <div v-if="hasSearched" class="search-stats">
        <span class="search-keyword">"{{ currentSearchQuery }}"</span>
          <span class="search-count">共找到 {{ totalResults }} 个结果</span>
        </div>

      <!-- 搜索结果 -->
      <div class="search-results">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <span>搜索中...</span>
      </div>

        <!-- 无结果状态 -->
        <div v-else-if="hasSearched && totalResults === 0" class="empty-state">
          <SearchX class="empty-icon" />
          <h3>没有找到相关内容</h3>
          <p>试试其他关键词或者调整搜索条件</p>
        </div>

        <!-- 搜索建议（未搜索时） -->
        <div v-else-if="!hasSearched" class="search-suggestions">
          <div class="suggestion-section">
            <h3>热门搜索</h3>
            <div class="suggestion-tags">
              <button 
                v-for="tag in hotSearchTags"
                :key="tag"
                class="suggestion-tag"
                @click="searchTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <div class="suggestion-section">
            <h3>搜索建议</h3>
            <div class="suggestion-items">
              <div 
                v-for="suggestion in searchSuggestions"
                :key="suggestion.id"
                class="suggestion-item"
                @click="searchTag(suggestion.keyword)"
              >
                <component :is="suggestion.icon" class="suggestion-icon" />
                <div class="suggestion-content">
                  <div class="suggestion-title">{{ suggestion.title }}</div>
                  <div class="suggestion-desc">{{ suggestion.description }}</div>
              </div>
            </div>
          </div>
        </div>
          </div>

        <!-- 结果列表 -->
        <div v-else class="results-container">
          <!-- 资讯结果 -->
          <div v-if="activeCategory === 'all' || activeCategory === 'news'" class="result-section">
            <h3 v-if="activeCategory === 'all' && results.news?.length" class="section-title">
              <Newspaper :size="18" />
              资讯 ({{ results.news.length }})
            </h3>
            <div class="news-results">
              <div 
                v-for="item in getDisplayResults('news')"
                :key="'news-' + item.id"
                class="news-item"
                @click="goToNewsDetail(item.id)"
              >
                <img :src="$getImageUrl(item.cover)" :alt="item.title" class="news-thumbnail" />
                <div class="news-content">
                  <h4 class="news-title" v-html="highlightKeyword(item.title)"></h4>
                  <p class="news-summary" v-html="highlightKeyword(item.summary)"></p>
                  <div class="news-meta">
                    <span class="news-source">{{ item.source }}</span>
                    <span class="news-time">{{ formatTime.fromNow(item.publishTime) }}</span>
                    <span class="news-views">{{ item.views }} 浏览</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 服务结果 -->
          <div v-if="activeCategory === 'all' || activeCategory === 'services'" class="result-section">
            <h3 v-if="activeCategory === 'all' && results.services?.length" class="section-title">
              <Briefcase :size="18" />
              知马同城 ({{ results.services.length }})
            </h3>
            <div class="services-results">
              <div 
                v-for="item in getDisplayResults('services')"
                :key="'service-' + item.id"
                class="service-item"
                @click="goToServiceDetail(item)"
              >
                <img :src="item.images[0]" :alt="item.title" class="service-thumbnail" />
                <div class="service-content">
                  <h4 class="service-title" v-html="highlightKeyword(item.title)"></h4>
                  <p class="service-description" v-html="highlightKeyword(item.description)"></p>
                  <div class="service-meta">
                    <span class="service-price">RM{{ formatNumber.thousands(item.price) }}</span>
                    <span class="service-provider">{{ item.provider.name }}</span>
                    <span class="service-location">{{ item.location }}</span>
                  </div>
                </div>
              </div>
            </div>
              </div>

          <!-- 圈子结果 -->
          <div v-if="activeCategory === 'all' || activeCategory === 'circles'" class="result-section">
            <h3 v-if="activeCategory === 'all' && results.circles?.length" class="section-title">
              <Users :size="18" />
              知马圈 ({{ results.circles.length }})
            </h3>
            <div class="circles-results">
              <div 
                v-for="item in getDisplayResults('circles')"
                :key="'circle-' + item.id"
                class="circle-item"
                @click="goToCircleDetail(item.id)"
              >
                <img :src="item.images[0]" :alt="item.title" class="circle-thumbnail" />
                <div class="circle-content">
                  <h4 class="circle-title" v-html="highlightKeyword(item.title)"></h4>
                  <p class="circle-content-text" v-html="highlightKeyword(item.content)"></p>
                  <div class="circle-meta">
                    <div class="circle-author">
                      <img :src="$getImageUrl(item.author.avatar)" :alt="item.author.name" class="author-avatar" @click.stop="goToUserProfile(item.author.id)" style="cursor:pointer;" />
                      <span class="author-name" @click.stop="goToUserProfile(item.author.id)" style="cursor:pointer;">{{ item.author.name }}</span>
                    </div>
                    <div class="circle-stats">
                      <span class="circle-likes">{{ item.likes_count }} 点赞</span>
                      <span class="circle-time">{{ formatTime.fromNow(item.createTime) }}</span>
                    </div>
                  </div>
                </div>
              </div>
                </div>
              </div>

          <!-- 用户结果 -->
          <div v-if="activeCategory === 'all' || activeCategory === 'users'" class="result-section">
            <h3 v-if="activeCategory === 'all' && results.users?.length" class="section-title">
              <UserCheck :size="18" />
              用户 ({{ results.users.length }})
            </h3>
            <div class="users-results">
              <div 
                v-for="item in getDisplayResults('users')"
                :key="'user-' + item.id"
                class="user-item"
                @click="goToUserProfile(item.id)"
              >
                <img :src="$getImageUrl(item.avatar)" :alt="item.name" class="user-avatar" />
                <div class="user-content">
                  <h4 class="user-name" v-html="highlightKeyword(item.name)"></h4>
                  <p class="user-bio" v-html="highlightKeyword(item.bio || '这个人很懒，什么都没写')"></p>
                  <div class="user-meta">
                    <span class="user-posts">{{ item.postsCount }} 发布</span>
                    <span class="user-followers">{{ item.followersCount }} 粉丝</span>
                    <span class="user-location">{{ item.location }}</span>
                  </div>
                </div>
                <button class="follow-btn" :class="{ following: item.isFollowing }" @click.stop="toggleFollow(item)">
                  {{ item.isFollowing ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
          </div>

          <!-- 加载更多 -->
          <div v-if="canLoadMore" class="load-more">
            <button class="load-more-btn" @click="loadMore" :disabled="loadingMore">
              <Loader2 v-if="loadingMore" class="loading-icon" />
              {{ loadingMore ? '加载中...' : '加载更多' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  Search, X, SearchX, Newspaper, Briefcase, Users, UserCheck, 
  Loader2, TrendingUp, Star, MapPin, Clock
} from 'lucide-vue-next'
import { formatTime, formatNumber } from '@/utils'
import { placeholders } from '@/utils/placeholder'
import { searchAPI } from '@/api/search'
import { newsAPI } from '@/api/news'
import { servicesAPI } from '@/api/services'
import { circlesAPI } from '@/api/circles'
import { userProfileAPI } from '@/api/user-profile'

export default {
  name: 'SearchPage',
  components: {
    Search, X, SearchX, Newspaper, Briefcase, Users, UserCheck, 
    Loader2, TrendingUp, Star, MapPin, Clock
  },
  setup() {
const router = useRouter()
const route = useRoute()

// 响应式数据
const searchQuery = ref('')
    const currentSearchQuery = ref('')
const hasSearched = ref(false)
    const loading = ref(false)
    const loadingMore = ref(false)
    const activeCategory = ref('all')
    
    // 搜索结果
    const results = reactive({
      news: [],
      services: [],
      circles: [],
      users: []
    })
    
    // 搜索分类
    const searchCategories = [
      { key: 'all', label: '全部', icon: 'Search' },
      { key: 'news', label: '资讯', icon: 'Newspaper' },
      { key: 'services', label: '服务', icon: 'Briefcase' },
      { key: 'circles', label: '圈子', icon: 'Users' },
      { key: 'users', label: '用户', icon: 'UserCheck' }
    ]
    
    // 热门搜索标签
    const hotSearchTags = ref([
      '钢琴培训', '家政服务', '搬家', '美食', '修理', 
      '招聘', '租房', '二手', '旅游', '健身'
    ])
    
    // 搜索建议
    const searchSuggestions = ref([
    {
      id: 1,
        title: '寻找专业服务',
        description: '搜索各类知马同城，如家政、维修、培训等',
        keyword: '家政',
        icon: 'Briefcase'
    },
    {
      id: 2,
        title: '浏览本地资讯',
        description: '获取最新的本地新闻和生活资讯',
        keyword: '新闻',
        icon: 'Newspaper'
    },
    {
      id: 3,
        title: '发现圈子动态',
        description: '查看知马圈的精彩内容和讨论',
        keyword: '生活',
        icon: 'Users'
      },
      {
        id: 4,
        title: '查找用户',
        description: '搜索感兴趣的用户并关注他们',
        keyword: '用户',
        icon: 'UserCheck'
      }
    ])
    
    // 计算属性
    const totalResults = computed(() => {
      return Object.values(results).reduce((total, arr) => total + arr.length, 0)
    })
    
    const canLoadMore = computed(() => {
      return false
    })
    
    // 生成模拟数据
    const generateMockNews = (keyword) => {
      const newsItems = []
      for (let i = 1; i <= 8; i++) {
        newsItems.push({
          id: i,
          title: `${keyword}相关资讯标题 ${i} - 马来西亚本地新闻`,
          summary: `这是一篇关于${keyword}的新闻摘要内容，包含了详细的信息和分析...`,
          cover: placeholders.news(300, 200, `新闻${i}`),
          source: ['新海峡时报', '星洲日报', '南洋商报', '东方日报'][Math.floor(Math.random() * 4)],
          publishTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          views: Math.floor(Math.random() * 5000) + 100,
          category: ['local', 'business', 'tech', 'lifestyle'][Math.floor(Math.random() * 4)]
        })
      }
      return newsItems
    }
    
    const generateMockServices = (keyword) => {
      const cities = ['吉隆坡', '槟城', '新山', '马六甲', '怡保', '古晋']
      const serviceItems = []
      for (let i = 1; i <= 6; i++) {
        serviceItems.push({
          id: i,
          title: `${keyword}专业服务 ${i}`,
          description: `提供优质的${keyword}相关服务，经验丰富，价格合理，服务周到...`,
          price: Math.floor(Math.random() * 500) + 50,
          images: [placeholders.service(300, 225, `服务${i}`)],
          provider: {
            id: i,
            name: `${keyword}服务商${i}`,
            avatar: 'https://picsum.photos/40/40?random=21',
            rating: (4 + Math.random()).toFixed(1)
          },
          location: cities[Math.floor(Math.random() * cities.length)],
          tags: [`${keyword}`, '专业', '可靠'],
          createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        })
      }
      return serviceItems
    }
    
    const generateMockCircles = (keyword) => {
      const users = [
        { name: '小明', avatar: 'https://picsum.photos/40/40?random=22' },
        { name: '小红', avatar: 'https://picsum.photos/40/40?random=23' },
        { name: '小刚', avatar: 'https://picsum.photos/40/40?random=24' },
        { name: '小美', avatar: 'https://picsum.photos/40/40?random=25' }
      ]
      const circleItems = []
      for (let i = 1; i <= 5; i++) {
        const author = users[Math.floor(Math.random() * users.length)]
        circleItems.push({
          id: i,
          title: `分享${keyword}相关的生活体验 ${i}`,
          content: `今天想和大家分享一下关于${keyword}的经历和感受，希望对大家有帮助...`,
          images: [placeholders.lifestyle(300, 300, `生活${i}`)],
          author: { ...author, id: i },
          likes_count: Math.floor(Math.random() * 100),
          comments_count: Math.floor(Math.random() * 20),
          createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        })
      }
      return circleItems
    }
    
    const generateMockUsers = (keyword) => {
      const cities = ['吉隆坡', '槟城', '新山', '马六甲', '怡保']
      const users = []
      for (let i = 1; i <= 4; i++) {
        users.push({
          id: i,
          name: `${keyword}爱好者${i}`,
          bio: `热爱${keyword}，乐于分享生活中的美好时刻`,
          avatar: '/avatar-placeholder.svg',
          postsCount: Math.floor(Math.random() * 50) + 5,
          followersCount: Math.floor(Math.random() * 1000) + 10,
          location: cities[Math.floor(Math.random() * cities.length)],
          isFollowing: Math.random() > 0.5
        })
      }
      return users
    }
    
    // 方法
    const performSearch = async () => {
      if (!searchQuery.value.trim()) return
      
      loading.value = true
      hasSearched.value = true
      currentSearchQuery.value = searchQuery.value.trim()
      
      try {
        const keyword = currentSearchQuery.value
        
        // 并行搜索所有类型
        const searchPromises = []
        
        if (activeCategory.value === 'all' || activeCategory.value === 'news') {
          searchPromises.push(
            searchAPI.searchNews({ keyword }).catch(() => ({ data: [] }))
          )
        }
        
        if (activeCategory.value === 'all' || activeCategory.value === 'services') {
          searchPromises.push(
            searchAPI.searchServices({ keyword }).catch(() => ({ data: [] }))
          )
        }
        
        if (activeCategory.value === 'all' || activeCategory.value === 'circles') {
          searchPromises.push(
            searchAPI.searchCircles({ keyword }).catch(() => ({ data: [] }))
          )
        }
        
        if (activeCategory.value === 'all' || activeCategory.value === 'users') {
          searchPromises.push(
            searchAPI.searchUsers({ keyword }).catch(() => ({ data: [] }))
          )
        }
        
        const searchResults = await Promise.all(searchPromises)
        
        // 更新搜索结果
        let index = 0
        if (activeCategory.value === 'all' || activeCategory.value === 'news') {
          results.news = searchResults[index++]?.data || []
        }
        if (activeCategory.value === 'all' || activeCategory.value === 'services') {
          results.services = searchResults[index++]?.data || []
        }
        if (activeCategory.value === 'all' || activeCategory.value === 'circles') {
          results.circles = searchResults[index++]?.data || []
        }
        if (activeCategory.value === 'all' || activeCategory.value === 'users') {
          results.users = searchResults[index++]?.data || []
        }
        
        // 保存搜索记录
        await searchAPI.saveSearchRecord(keyword)
        
        // 更新URL
        router.replace({
          path: '/search',
          query: { q: currentSearchQuery.value }
        })
        
      } catch (error) {
        console.error('搜索失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    const clearSearch = () => {
      searchQuery.value = ''
    }
    
    const onSearchInput = () => {
      // 实时搜索建议功能可以在这里实现
    }
    
    const searchTag = (tag) => {
      searchQuery.value = tag
      performSearch()
    }
    
    const setActiveCategory = (category) => {
      activeCategory.value = category
    }
    
    const getPlaceholderText = () => {
      const placeholders = {
        all: '搜索服务、资讯、圈子、用户...',
        news: '搜索资讯、热点新闻...',
        services: '搜索知马同城...',
        circles: '搜索知马圈内容...',
        users: '搜索用户...'
      }
      return placeholders[activeCategory.value] || placeholders.all
    }
    
    const getDisplayResults = (category) => {
      if (activeCategory.value === 'all') {
        return results[category].slice(0, 3) // 综合模式下每类显示3个
      }
      return results[category] // 单类模式下显示全部
    }
    
    const highlightKeyword = (text) => {
      if (!currentSearchQuery.value || !text) return text
      const regex = new RegExp(`(${currentSearchQuery.value})`, 'gi')
      return text.replace(regex, '<mark>$1</mark>')
    }
    
    const goToNewsDetail = (id) => {
      router.push(`/news/${id}`)
    }
    
    const detectServiceType = (title, description = '') => {
      const text = `${title || ''} ${description || ''}`
      const carReg = /(二手车|汽车|轿车|SUV|MPV|上牌|过户|验车|买车|卖车)/i
      const rentReg = /(租房|合租|整租|公寓|出租|小区|次卧|主卧|写字楼|商铺)/i
      const jobReg = /(招聘|求职|岗位|月薪|薪资|包吃|包住|五险|急招|面试|兼职)/i
      if (carReg.test(text)) return 'car'
      if (rentReg.test(text)) return 'rent'
      if (jobReg.test(text)) return 'job'
      // 兜底：根据关键词粗略归类
      return /房|租/i.test(text) ? 'rent' : (/车|汽/i.test(text) ? 'car' : 'job')
    }

    const goToServiceDetail = (item) => {
      const type = detectServiceType(item.title, item.description)
      router.push({ name: 'ServiceDetail', params: { id: item.id }, query: { type } })
    }
    
    const goToCircleDetail = (id) => {
      router.push(`/circles/${id}`)
    }
    
    const goToUserProfile = (id) => {
      router.push({ name: 'UserProfile', params: { id } })
    }
    
    const toggleFollow = async (user) => {
      try {
        const { userProfileAPI } = await import('@/api/user-profile')
        const prevFollowing = !!user.isFollowing
        const prevFollowers = user.followersCount || 0
        // 乐观更新
        user.isFollowing = !prevFollowing
        user.followersCount = Math.max(prevFollowers + (user.isFollowing ? 1 : -1), 0)
        if (!prevFollowing) {
          const res = await userProfileAPI.followUser(user.id)
          if (res.code !== 200) throw new Error(res.message || '关注失败')
        } else {
          const res = await userProfileAPI.unfollowUser(user.id)
          if (res.code !== 200) throw new Error(res.message || '取消关注失败')
        }
      } catch (e) {
        // 回滚
        user.isFollowing = !user.isFollowing
        user.followersCount = Math.max((user.followersCount || 0) + (user.isFollowing ? 1 : -1), 0)
        console.error('关注操作失败:', e)
      }
    }
    
    const loadMore = () => {
      loadingMore.value = true
      // 模拟加载更多
      setTimeout(() => {
        loadingMore.value = false
      }, 1000)
    }
    
    // 监听路由变化，从URL获取搜索参数
    watch(() => route.query, (newQuery) => {
      if (newQuery.q && newQuery.q !== searchQuery.value) {
        searchQuery.value = newQuery.q
        // 根据type参数设置默认搜索类型
        if (newQuery.type && newQuery.type !== 'all') {
          activeCategory.value = newQuery.type
        }
        performSearch()
      }
    }, { immediate: true })
    
    // 生命周期
onMounted(() => {
      // 如果URL中有搜索参数，自动执行搜索
  if (route.query.q) {
    searchQuery.value = route.query.q
        performSearch()
      }
    })
    
    return {
      // 数据
      searchQuery,
      currentSearchQuery,
      hasSearched,
      loading,
      loadingMore,
      activeCategory,
      results,
      searchCategories,
      hotSearchTags,
      searchSuggestions,
      
      // 计算属性
      totalResults,
      canLoadMore,
      
      // 方法
      performSearch,
      clearSearch,
      onSearchInput,
      searchTag,
      setActiveCategory,
      getPlaceholderText,
      getDisplayResults,
      highlightKeyword,
      goToNewsDetail,
      goToServiceDetail,
      goToCircleDetail,
      goToUserProfile,
      toggleFollow,
      loadMore,
      
      // 工具函数
      formatTime,
      formatNumber
    }
  }
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* 搜索头部 */
.search-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 20px 0;
}

.search-header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.search-main {
  display: flex;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: #ff6b35;
  box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #6c757d;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #333;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-search-btn {
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
}

.clear-search-btn:hover {
  background: #e9ecef;
  color: #333;
}

.search-btn {
  padding: 14px 24px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 16px;
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

/* 搜索内容 */
.search-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 搜索统计 */
.search-stats {
  margin-bottom: 24px;
  color: #6c757d;
  font-size: 14px;
}

.search-keyword {
  color: #ff6b35;
  font-weight: 600;
}

.search-count {
  margin-left: 12px;
}

/* 分类筛选 */
.search-filters {
  margin-bottom: 32px;
}

/* 居中置顶的分类筛选 */
.search-filters.centered-filters {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  padding: 0 0 20px 0;
  border-bottom: 1px solid #f1f3f4;
}

.centered-filters .filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #6c757d;
}

.filter-tab:hover {
  border-color: #ff6b35;
  color: #ff6b35;
}

.filter-tab.active {
  background: #ff6b35;
  border-color: #ff6b35;
  color: white;
}

.count-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 12px;
  min-width: 16px;
  text-align: center;
}

.filter-tab:not(.active) .count-badge {
  background: #f8f9fa;
  color: #6c757d;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6c757d;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #ff6b35;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #dee2e6;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.empty-state p {
  margin: 0;
}

/* 搜索建议 */
.search-suggestions {
  max-width: 800px;
  margin: 0 auto;
}

.suggestion-section {
  margin-bottom: 40px;
}

.suggestion-section h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 18px;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-tag {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6c757d;
  font-size: 14px;
}

.suggestion-tag:hover {
  border-color: #ff6b35;
  color: #ff6b35;
  background: #fff5f0;
}

.suggestion-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.suggestion-icon {
  color: #ff6b35;
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.suggestion-desc {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
}

/* 结果容器 */
.results-container {
  max-width: 900px;
  margin: 0 auto;
}

.result-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

/* 资讯结果 */
.news-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-item {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.news-thumbnail {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.news-content {
  flex: 1;
  min-width: 0;
}

.news-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-summary {
  margin: 0 0 12px 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

/* 服务结果 */
.services-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.service-item {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.service-thumbnail {
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.service-content {
  flex: 1;
  min-width: 0;
}

.service-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.service-description {
  margin: 0 0 12px 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.service-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  align-items: center;
}

.service-price {
  color: #ff6b35;
  font-weight: 600;
  font-size: 14px;
}

.service-provider {
  color: #333;
}

.service-location {
  color: #9ca3af;
}

/* 圈子结果 */
.circles-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.circle-item {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.circle-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.circle-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.circle-content {
  flex: 1;
  min-width: 0;
}

.circle-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.circle-content-text {
  margin: 0 0 12px 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.circle-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.circle-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.author-name {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.circle-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

/* 用户结果 */
.users-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-item {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  align-items: center;
}

.user-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.user-content {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 6px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.user-bio {
  margin: 0 0 8px 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
}

.user-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.follow-btn {
  padding: 8px 16px;
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.follow-btn:hover {
  background: #e55a2b;
}

.follow-btn.following {
  background: #28a745;
}

.follow-btn.following:hover {
  background: #218838;
}

/* 加载更多 */
.load-more {
  text-align: center;
  margin-top: 40px;
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6c757d;
}

.load-more-btn:hover:not(:disabled) {
  border-color: #ff6b35;
  color: #ff6b35;
}

.load-more-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

/* 高亮样式 */
mark {
  background: #fff3cd;
  color: #856404;
  padding: 0 2px;
  border-radius: 2px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-header-content {
    padding: 0 16px;
  }
  
  .search-content {
    padding: 16px;
  }
  
  .news-item, .service-item, .circle-item {
    flex-direction: column;
  }
  
  .news-thumbnail, .service-thumbnail {
    width: 100%;
    height: 150px;
  }
  
  .circle-thumbnail {
    width: 100%;
    height: 120px;
  }
  
  .suggestion-items {
    grid-template-columns: 1fr;
  }
  
  .filter-tabs {
    justify-content: center;
  }
  
  .user-item {
    flex-direction: column;
    text-align: center;
  }
  
  .circle-meta {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>