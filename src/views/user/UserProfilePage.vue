
<template>
  <div class="user-profile-page">
    <!-- 主要区域 -->
    <div class="major-area">
      <!-- 个人资料头部（类知乎风格） -->
      <div class="profile-header block">
        <div class="cover-banner">
          <img :src="$getImageUrl(userInfo.cover || coverFallback)" alt="封面" @error="handleImageError" />
        </div>
        <div class="profile-main">
          <div class="avatar-wrap">
            <img :src="$getImageUrl(userInfo.avatar)" :alt="`${userInfo.username}的头像`" class="avatar-circle" />
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ userInfo.username }}</h1>
            <div class="profile-meta">
              <span v-if="userInfo.ipAddress">来自：{{ userInfo.ipAddress }}</span>
            </div>
          </div>
          <div class="profile-actions">
            <button v-if="isOwnProfile" class="zh-msg-btn" @click="editProfile">编辑资料</button>
            <template v-else>
              <button class="zh-follow-btn" :class="{ active: userInfo.isFollowing }" @click="toggleFollow">
                <template v-if="userInfo.isFollowing">
                  <Check :size="16" style="margin-right: 6px;" />
                  {{ userInfo.isMutualFollow ? '已互关' : '已关注' }}
                </template>
                <template v-else>关注</template>
              </button>
              <button class="zh-msg-btn" @click="sendMessage">发私信</button>
            </template>
            <button class="more-btn" @click="showMoreOptions"><MoreHorizontal :size="16" /></button>
          </div>
        </div>
      </div>
      
      <!-- 徽章墙已移除 -->
      
      <!-- 内容列表 -->
      <div class="list-block">
        <div class="detail-list">
          <div class="list-header">
            <div class="header-content">
              <router-link 
                :to="`/user/${userId}`" 
                :class="['nav-item', { active: activeTab === 'activities' }]"
                @click="setActiveTab('activities')"
              >
                <div class="item-title">动态</div>
                <div class="item-count">{{ activities.length }}</div>
              </router-link>
              
              <router-link 
                :to="`/user/${userId}/posts`" 
                :class="['nav-item', { active: activeTab === 'posts' }]"
                @click="setActiveTab('posts')"
              >
                <div class="item-title">文章</div>
                <div class="item-count">{{ posts.length }}</div>
              </router-link>
              
              <router-link 
                :to="`/user/${userId}/services`" 
                :class="['nav-item', { active: activeTab === 'services' }]"
                @click="setActiveTab('services')"
              >
                <div class="item-title">服务</div>
                <div class="item-count">{{ services.length }}</div>
              </router-link>
              
              <router-link 
                :to="`/user/${userId}/circles`" 
                :class="['nav-item', { active: activeTab === 'circles' }]"
                @click="setActiveTab('circles')"
              >
                <div class="item-title">知马圈</div>
                <div class="item-count">{{ circles.length }}</div>
              </router-link>
              
              <router-link 
                :to="`/user/${userId}/collections`" 
                :class="['nav-item', { active: activeTab === 'collections' }]"
                @click="setActiveTab('collections')"
              >
                <div class="item-title">收藏集</div>
                <div class="item-count">{{ collections.length }}</div>
              </router-link>
              
              <router-link 
                :to="`/user/${userId}/favorites`" 
                :class="['nav-item', { active: activeTab === 'favorites' }]"
                @click="setActiveTab('favorites')"
              >
                <div class="item-title">我的收藏</div>
                <div class="item-count">{{ favorites.length || userInfo.favoritesCount }}</div>
              </router-link>
              
              <router-link 
                :to="`/user/${userId}/following`" 
                :class="['nav-item', { active: activeTab === 'following' }]"
                @click="setActiveTab('following')"
              >
                <div class="item-title">关注</div>
                <div class="item-count">{{ userInfo.followingCount }}</div>
              </router-link>
              
              <div class="nav-item" :class="{ active: activeTab === 'likes' }">
                <div class="item-title">赞</div>
                <div class="item-count">{{ userInfo.likeCount }}</div>
              </div>
              
              <div class="search-icon-container">
                <Search :size="20" class="search-icon" @click="showSearch" />
              </div>
            </div>
          </div>
          
          <!-- 内容区域 -->
          <div class="list-body">
            <!-- 动态列表 -->
            <div v-if="activeTab === 'activities'" class="activity-list-box">
              <div v-for="activity in activities" :key="activity.id" class="activity-item">
                <component :is="getActivityComponent(activity.type)" :activity="activity" />
              </div>
              
              <!-- 加载更多 -->
              <div v-if="hasMore" class="load-more" @click="loadMore">
                <span v-if="loading">加载中...</span>
                <span v-else>加载更多</span>
              </div>
            </div>
            
            <!-- 文章列表 -->
            <div v-else-if="activeTab === 'posts'" class="posts-list">
              <div v-for="post in posts" :key="post.id" class="post-item">
                <PostItem :post="post" />
              </div>
            </div>
            
            <!-- 服务列表 -->
            <div v-else-if="activeTab === 'services'" class="services-list">
              <div v-for="service in services" :key="service.id" class="service-item">
                <ServiceItem :service="service" />
              </div>
            </div>
            
            <!-- 知马圈列表 -->
            <div v-else-if="activeTab === 'circles'" class="circles-list">
              <div v-for="circle in circles" :key="circle.id" class="circle-item">
                <CircleItem :circle="circle" />
              </div>
            </div>
            
            <!-- 收藏集 -->
            <div v-else-if="activeTab === 'collections'" class="collections-list">
              <div v-for="collection in collections" :key="collection.id" class="collection-item">
                <CollectionItem :collection="collection" />
              </div>
            </div>
            
            <!-- 我的收藏 -->
            <div v-else-if="activeTab === 'favorites'" class="favorites-list">
              <!-- 收藏类型过滤 -->
              <div class="favorites-filter">
                <button 
                  v-for="type in favoriteTypes" 
                  :key="type.value"
                  :class="['filter-btn', { active: activeFavoriteType === type.value }]"
                  @click="changeFavoriteType(type.value)"
                >
                  {{ type.label }}
                </button>
              </div>
              
              <!-- 收藏内容列表 -->
              <div class="favorites-content">
                <!-- 空状态 -->
                <div v-if="favorites.length === 0" class="empty-state">
                  <Bookmark :size="48" class="empty-icon" />
                  <p class="empty-text">暂无收藏内容</p>
                  <p class="empty-tip">收藏的内容会显示在这里</p>
                </div>
                
                <!-- 收藏的帖子 -->
                <div v-else-if="activeFavoriteType === 'posts'" class="favorite-posts">
                  <div v-for="post in favorites" :key="post.id" class="favorite-item">
                    <router-link :to="`/news/${post.id}`" class="favorite-link">
                      <div class="favorite-content">
                        <h3 class="favorite-title">{{ post.title }}</h3>
                        <p class="favorite-excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
                        <div class="favorite-meta">
                          <span class="meta-item">
                            <Eye :size="14" />
                            {{ post.views || 0 }}
                          </span>
                          <span class="meta-item">
                            <ThumbsUp :size="14" />
                            {{ post.likes || 0 }}
                          </span>
                          <span class="meta-item">
                            <Clock :size="14" />
                            {{ post.favoriteTime || '最近' }}
                          </span>
                        </div>
                      </div>
                      <div class="favorite-image" v-if="post.image">
                        <img :src="$getImageUrl(post.image)" :alt="post.title" />
                      </div>
                    </router-link>
                    <button class="unfavorite-btn" @click="unfavoriteItem('post', post.id)" title="取消收藏">
                      <BookmarkCheck :size="16" />
                    </button>
                  </div>
                </div>
                
                <!-- 收藏的服务 -->
                <div v-else-if="activeFavoriteType === 'services'" class="favorite-services">
                  <div v-for="service in favorites" :key="service.id" class="favorite-item">
                    <router-link :to="`/services/${service.id}`" class="favorite-link">
                      <div class="favorite-content">
                        <h3 class="favorite-title">{{ service.title }}</h3>
                        <p class="favorite-excerpt" v-if="service.description">{{ service.description }}</p>
                        <div class="favorite-meta">
                          <span class="meta-item price">{{ service.price }}</span>
                          <span class="meta-item">
                            <MapPin :size="14" />
                            {{ service.location }}
                          </span>
                          <span class="meta-item">
                            <Clock :size="14" />
                            {{ service.favoriteTime || '最近' }}
                          </span>
                        </div>
                      </div>
                    </router-link>
                    <button class="unfavorite-btn" @click="unfavoriteItem('service', service.id)" title="取消收藏">
                      <BookmarkCheck :size="16" />
                    </button>
                  </div>
                </div>
                
                <!-- 收藏的房产 -->
                <div v-else-if="activeFavoriteType === 'housing'" class="favorite-housing">
                  <div v-for="house in favorites" :key="house.id" class="favorite-item">
                    <router-link :to="`/services/housing/${house.id}`" class="favorite-link">
                      <div class="favorite-content">
                        <h3 class="favorite-title">{{ house.title }}</h3>
                        <p class="favorite-excerpt" v-if="house.description">{{ house.description }}</p>
                        <div class="favorite-meta">
                          <span class="meta-item price">{{ house.price }}</span>
                          <span class="meta-item">
                            <MapPin :size="14" />
                            {{ house.location }}
                          </span>
                          <span class="meta-item">
                            <Home :size="14" />
                            {{ house.type }}
                          </span>
                        </div>
                      </div>
                      <div class="favorite-image" v-if="house.image">
                        <img :src="$getImageUrl(house.image)" :alt="house.title" />
                      </div>
                    </router-link>
                    <button class="unfavorite-btn" @click="unfavoriteItem('housing', house.id)" title="取消收藏">
                      <BookmarkCheck :size="16" />
                    </button>
                  </div>
                </div>
                
                <!-- 收藏的二手车 -->
                <div v-else-if="activeFavoriteType === 'cars'" class="favorite-cars">
                  <div v-for="car in favorites" :key="car.id" class="favorite-item">
                    <router-link :to="`/services/cars/${car.id}`" class="favorite-link">
                      <div class="favorite-content">
                        <h3 class="favorite-title">{{ car.title }}</h3>
                        <p class="favorite-excerpt" v-if="car.description">{{ car.description }}</p>
                        <div class="favorite-meta">
                          <span class="meta-item price">{{ car.price }}</span>
                          <span class="meta-item">
                            <MapPin :size="14" />
                            {{ car.location }}
                          </span>
                          <span class="meta-item">
                            <Car :size="14" />
                            {{ car.year }}年
                          </span>
                        </div>
                      </div>
                      <div class="favorite-image" v-if="car.image">
                        <img :src="$getImageUrl(car.image)" :alt="car.title" />
                      </div>
                    </router-link>
                    <button class="unfavorite-btn" @click="unfavoriteItem('car', car.id)" title="取消收藏">
                      <BookmarkCheck :size="16" />
                    </button>
                  </div>
                </div>
                
                <!-- 收藏的招聘 -->
                <div v-else-if="activeFavoriteType === 'jobs'" class="favorite-jobs">
                  <div v-for="job in favorites" :key="job.id" class="favorite-item">
                    <router-link :to="`/services/jobs/${job.id}`" class="favorite-link">
                      <div class="favorite-content">
                        <h3 class="favorite-title">{{ job.title }}</h3>
                        <p class="favorite-excerpt" v-if="job.description">{{ job.description }}</p>
                        <div class="favorite-meta">
                          <span class="meta-item price">{{ job.salary }}</span>
                          <span class="meta-item">
                            <MapPin :size="14" />
                            {{ job.location }}
                          </span>
                          <span class="meta-item">
                            <Briefcase :size="14" />
                            {{ job.type }}
                          </span>
                        </div>
                      </div>
                    </router-link>
                    <button class="unfavorite-btn" @click="unfavoriteItem('job', job.id)" title="取消收藏">
                      <BookmarkCheck :size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 关注列表（主内容区域） -->
            <div v-else-if="activeTab === 'following'" class="following-list">
              <div v-for="user in followingUsers" :key="user.id" class="user-item">
                <UserItem :user="user" @follow-change="onListFollowChange" />
              </div>
            </div>

            <!-- 粉丝列表（主内容区域） -->
            <div v-else-if="activeTab === 'followers'" class="following-list">
              <div v-for="user in followersUsers" :key="user.id" class="user-item">
                <UserItem :user="user" @follow-change="onListFollowChange" />
              </div>
            </div>

            <!-- 赞过的内容 -->
            <div v-else-if="activeTab === 'likes'" class="likes-list">
              <div v-for="item in likedPosts" :key="item.id" class="post-item">
                <router-link :to="`/news/${item.id}`" class="post-link">
                  <h3 class="post-title">{{ item.title }}</h3>
                  <p class="post-excerpt" v-if="item.excerpt">{{ item.excerpt }}</p>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 侧边栏 -->
    <div class="minor-area">
      <div class="sticky-wrap">
        <!-- 个人成就 -->
        <div class="achievement-block block">
          <div class="block-title">个人成就</div>
          <div class="block-body">
            <div class="achievement-item">
              <div class="achievement-icon like-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </div>
              <div class="achievement-text">
                获得 <strong>{{ formatNumber(userInfo.articleLikes || 0) }}</strong> 次赞同
              </div>
            </div>
            
            <div class="achievement-item">
              <div class="achievement-icon view-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div class="achievement-text">
                获得 <strong>{{ formatNumber(userInfo.articleViews || 0) }}</strong> 次浏览
              </div>
            </div>
          </div>
        </div>
        
        <!-- 关注信息（与上方卡片风格一致） -->
        <div class="follow-block block">
          <button class="follow-item" @click="openFollowModal('following')">
            <div class="item-title">关注了</div>
            <div class="item-count">{{ userInfo.followingCount }}</div>
          </button>
          
          <button class="follow-item" @click="openFollowModal('followers')">
            <div class="item-title">关注者</div>
            <div class="item-count">{{ userInfo.followersCount }}</div>
          </button>
        </div>
        
        <!-- 更多信息 -->
        <div class="more-block block">
          <button class="more-item info-item stat-item btn-stat" @click="setActiveTab('collections')">
            <div class="item-icon">
              <Bookmark :size="16" />
            </div>
            <div class="item-content">
              <div class="item-title">收藏集</div>
              <div class="item-count">{{ userInfo.collectionsCount }}</div>
            </div>
          </button>
          
          <button class="more-item info-item stat-item btn-stat" @click="setActiveTab('favorites')">
            <div class="item-icon">
              <BookmarkCheck :size="16" />
            </div>
            <div class="item-content">
              <div class="item-title">我的收藏</div>
              <div class="item-count">{{ userInfo.favoritesCount || 0 }}</div>
            </div>
          </button>
          
          <button class="more-item info-item stat-item btn-stat" @click="openTagsModal">
            <div class="item-icon">
              <Tag :size="16" />
            </div>
            <div class="item-content">
              <div class="item-title">关注标签</div>
              <div class="item-count">{{ userInfo.followingTagsCount }}</div>
            </div>
          </button>
          
          <div class="more-item info-item last-item">
            <div class="item-icon">
              <Calendar :size="16" />
            </div>
            <div class="item-content">
              <div class="item-title">加入于</div>
              <div class="item-count">
                <time :datetime="userInfo.joinDate" :title="formatFullDate(userInfo.joinDate)">
                  {{ formatDate(userInfo.joinDate) }}
                </time>
              </div>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
    
    <!-- 登录模态框 -->
    <div v-if="showLoginModal" class="login-modal-overlay" @click="showLoginModal = false">
      <div class="login-modal" @click.stop>
        <div class="modal-header">
          <h3>请先登录才能进行此操作</h3>
          <button class="close-btn" @click="showLoginModal = false">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <p>登录后可以关注用户、发送私信等更多功能</p>
          <button class="login-btn" @click="goToLogin">
            <User :size="16" />
            立即登录
          </button>
        </div>
      </div>
    </div>

    <!-- APP 下载二维码弹窗（侧边工具栏风格） -->
    <div v-if="showAppDownloadModal" class="login-modal-overlay" @click="showAppDownloadModal = false">
      <div class="app-qr-modal" @click.stop>
        <div class="modal-header">
          <h3>请前往手机端使用私信功能</h3>
          <button class="close-btn" @click="showAppDownloadModal = false">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="qr-card">
            <div class="qr-box">
              <img class="qr-image" :src="appPlatform === 'ios' ? appQrIos : appQrAndroid" alt="APP 下载二维码" />
              <span class="corner tl"></span>
              <span class="corner tr"></span>
              <span class="corner bl"></span>
              <span class="corner br"></span>
            </div>
            <p class="qr-title">手机扫码下载</p>
            <div class="download-actions">
              <button type="button" class="btn-download" :class="{ active: appPlatform === 'ios' }" @click="appPlatform = 'ios'">iPhone版</button>
              <button type="button" class="btn-download" :class="{ active: appPlatform === 'android' }" @click="appPlatform = 'android'">安卓版</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 关注/粉丝 弹窗 -->
    <div v-if="showFollowModal" class="login-modal-overlay" @click="closeFollowModal">
      <div class="follow-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ followModalType === 'following' ? '关注列表' : '关注者' }}</h3>
          <button class="close-btn" @click="closeFollowModal">
            <X :size="20" />
          </button>
        </div>
        <div class="follow-modal-body">
          <div v-if="followModalUsers.length === 0" class="empty-tip">暂无数据</div>
          <div v-else class="follow-users">
            <div v-for="user in followModalUsers" :key="user.id" class="user-item">
              <UserItem :user="user" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { 
  Briefcase, Check, MessageCircle, MoreHorizontal, Search, ThumbsUp, 
  Eye, TrendingUp, User, X, Bookmark, BookmarkCheck, Clock, 
  MapPin, Home, Car, ChevronRight, Tag, Calendar
} from 'lucide-vue-next'
import { userProfileAPI } from '@/api/user-profile'
import { postsAPI } from '@/api/posts'
import { servicesAPI } from '@/api/services'
import { circlesAPI } from '@/api/circles'
import duducarAPI from '@/api/duducar-integration'

// 导入组件（这些组件需要单独创建）
import PostItem from '@/components/user/PostItem.vue'
import ServiceItem from '@/components/user/ServiceItem.vue'
import CircleItem from '@/components/user/CircleItem.vue'
import CollectionItem from '@/components/user/CollectionItem.vue'
import UserItem from '@/components/user/UserItem.vue'
import ActivityItem from '@/components/user/ActivityItem.vue'

export default {
  name: 'UserProfilePage',
  components: {
    Briefcase, 
    Check, 
    MessageCircle, 
    MoreHorizontal, 
    Search, 
    ThumbsUp, 
    Eye, 
    TrendingUp, 
    User, 
    X, 
    Bookmark, 
    BookmarkCheck, 
    Clock, 
    MapPin, 
    Home, 
    Car, 
    ChevronRight, 
    Tag, 
    Calendar,
    PostItem, 
    ServiceItem, 
    CircleItem, 
    CollectionItem, 
    UserItem, 
    ActivityItem
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    
    // 规范化ID: 过滤 'undefined'/'null'/空串，转换为数字
    const normalizeId = (val) => {
      if (val === undefined || val === null) return null
      const s = String(val).trim()
      if (!s || s === 'undefined' || s === 'null') return null
      const n = Number(s)
      return Number.isFinite(n) ? n : null
    }
    // 优先用路由ID（有效时），否则回退到当前登录用户ID
    const userId = computed(() => {
      const routeId = normalizeId(route.params.id)
      const currentUserId = normalizeId(userStore.userInfo?.id)
      return routeId ?? currentUserId ?? null
    })
    const isOwnProfile = computed(() => String(userId.value) === String(userStore.userInfo?.id))
    // 封面占位：使用 Lorem Picsum 随机图片
    const coverFallback = computed(() => {
      const seed = userId.value || 'default'
      return `https://picsum.photos/1200/300?random=${seed}`
    })
    const activeTab = ref('activities')
    const loading = ref(false)
    const hasMore = ref(true)
    const showLoginModal = ref(false)
    const showAppDownloadModal = ref(false)
    const appPlatform = ref('ios')
    const qrSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><rect width="180" height="180" fill="#FF6A00"/><text x="90" y="110" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="#FFFFFF">QR</text></svg>'
    const qrPlaceholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(qrSvg)
    const appQrIos = ref(qrPlaceholder)
    const appQrAndroid = ref(qrPlaceholder)
    const showTagsModal = ref(false)
    
    // 用户信息
    const userInfo = reactive({
      id: '',
      username: '',
      avatar: '',
      cover: '',
      bio: '',
      // removed: level, badges
      isFollowing: false,
      isFollowedBy: false,
      isMutualFollow: false,
      articleLikes: 0,
      articleViews: 0,
      // removed: powerValue
      followingCount: 0,
      followersCount: 0,
      collectionsCount: 0,
      favoritesCount: 0,
      followingTagsCount: 0,
      likeCount: 0,
      joinDate: '',
      ipAddress: ''
    })
    
    // 各类型内容
    const activities = ref([])
    const posts = ref([])
    const services = ref([])
    const circles = ref([])
    const collections = ref([])
    const followingUsers = ref([])
    const followersUsers = ref([])
    const likedPosts = ref([])
    
    // 收藏相关
    const favorites = ref([])
    const activeFavoriteType = ref('all')
    const favoriteTypes = ref([
      { label: '全部', value: 'all' },
      { label: '帖子', value: 'posts' },
      { label: '服务', value: 'services' },
      { label: '房产', value: 'housing' },
      { label: '二手车', value: 'cars' },
      { label: '招聘', value: 'jobs' }
    ])
    
    // 模拟数据
    const mockUserInfo = {
      id: '123456',
      username: '知马用户',
      avatar: 'https://picsum.photos/40/40?random=87',
      
      isFollowing: false,
      articleLikes: 289,
      articleViews: 58535,
      
      followingCount: 3,
      followersCount: 80,
      collectionsCount: 0,
      favoritesCount: 8,
      followingTagsCount: 0,
      likeCount: 5,
      joinDate: '2021-01-23T04:12:27.000Z'
    }
    
    const mockActivities = [
      {
        id: 1,
        type: 'post',
        user: { id: '123456', name: '知马用户', avatar: '/avatar-placeholder.svg' },
        time: '1月前',
        post: {
          id: 9001,
          title: '如何在马来西亚找到心仪的工作',
          excerpt: '分享一些在马来西亚求职的经验和技巧...',
          image: 'https://picsum.photos/300/200?random=88',
          likes: 85,
          comments: 57
        }
      },
      {
        id: 2,
        type: 'service',
        user: { id: '123456', name: '知马用户', avatar: '/avatar-placeholder.svg' },
        time: '2天前',
        service: {
          title: '吉隆坡搬家服务',
          price: 'RM 150-300',
          location: '吉隆坡'
        }
      },
      {
        id: 3,
        type: 'circle',
        user: { id: '123456', name: '知马用户', avatar: '/avatar-placeholder.svg' },
        time: '5天前',
        circle: {
          content: '今天在茨厂街吃了很棒的云吞面，推荐给大家！',
          images: ['https://picsum.photos/300/200?random=89'],
          likes: 23,
          comments: 8
        }
      },
      {
        id: 4,
        type: 'follow',
        user: { id: '123456', name: '知马用户', avatar: '/avatar-placeholder.svg' },
        time: '10天前',
        target: { id: '8888', name: '马来生活指南' }
      },
      {
        id: 5,
        type: 'like',
        user: { id: '123456', name: '知马用户' },
        time: '12天前',
        target: { id: 9002, title: '在吉隆坡租房的 8 个小技巧', excerpt: '地段、预算、安全性与合租建议...' }
      }
    ]
    
    // 加载用户数据
    const loadUserData = async () => {
      if (!userId.value) {
        console.error('用户ID为空')
        router.push('/auth/login')
        return
      }
      
      try {
        // 并行获取用户信息和统计数据
        const [statsRes] = await Promise.all([
          userProfileAPI.getUserStats(userId.value)
        ])
        
        // 如果是查看自己的资料，使用store中的信息
        if (isOwnProfile.value && userStore.userInfo) {
          Object.assign(userInfo, {
            id: userStore.userInfo.id,
            username: userStore.userInfo.username || userStore.userInfo.nickname,
            avatar: userStore.userInfo.avatar || '/avatar-placeholder.svg',
            cover: userStore.userInfo.cover || '/banner-placeholder.jpg',
            followersCount: statsRes.data?.followers_count || 0,
            followingCount: statsRes.data?.following_count || 0,
            joinDate: userStore.userInfo.created_at || new Date().toISOString(),
            isFollowing: false,
            isFollowedBy: false,
            isMutualFollow: false
          })
        } else {
          // 查看他人资料时，需要从API获取完整信息
          // 目前API没有提供获取其他用户详细信息的接口，使用模拟数据
          Object.assign(userInfo, {
            ...mockUserInfo,
            id: userId.value,
            cover: '/banner-placeholder.jpg',
            followersCount: (typeof statsRes.data?.followers_count === 'number') ? statsRes.data.followers_count : 0,
            followingCount: (typeof statsRes.data?.following_count === 'number') ? statsRes.data.following_count : 0,
          })

          // 加载互相关注状态（优先）
          try {
            const mutualRes = await userProfileAPI.getMutualFollowStatus(userId.value)
            if (mutualRes.code === 200 && mutualRes.data) {
              userInfo.isFollowing = Boolean(mutualRes.data.isFollowing)
              userInfo.isFollowedBy = Boolean(mutualRes.data.isFollowedBy)
              userInfo.isMutualFollow = Boolean(mutualRes.data.isMutualFollow)
            } else {
              // 回退：仅检查是否关注
              const checkRes = await userProfileAPI.checkFollowStatus(userId.value)
              if (checkRes.code === 200) {
                const d = checkRes.data
                let following = false
                if (typeof d === 'boolean') following = d
                else if (typeof d?.isFollowing === 'boolean') following = d.isFollowing
                else if (typeof d?.following === 'boolean') following = d.following
                userInfo.isFollowing = Boolean(following)
              }
            }
          } catch (e) {
            // 忽略错误，保持默认状态
          }
        }
        
        // 加载活动数据（使用模拟数据，因为API暂未提供）
        activities.value = mockActivities
        
      } catch (error) {
        console.error('加载用户数据失败:', error)
        // 如果API失败，使用模拟数据作为后备，但关注统计置为0，避免显示固定的3/80
        Object.assign(userInfo, { ...mockUserInfo, followersCount: 0, followingCount: 0 })
        activities.value = mockActivities
      }
    }
    
    // 加载不同类型的内容数据
    const loadContentData = async (type) => {
      if (!userId.value) return
      try {
        let response
        const normalizeUserItem = (u) => ({
          id: u.userId || u.user_id || u.targetUserId || u.followedUserId || u.id,
          username: u.username || u.nickname || u.name || u.targetUsername || u.followedUsername,
          avatar: u.userAvatar || u.user_avatar || u.avatar || u.targetUserAvatar || u.followedUserAvatar || '/avatar-placeholder.svg',
          isFollowing: typeof u.isFollowing === 'boolean' ? u.isFollowing : undefined,
          followersCount: u.followersCount || u.followers_count || u.fansCount || 0
        })
        switch (type) {
          case 'posts':
            // 使用文章API获取用户发布的文章
            // 由于API没有直接提供按用户筛选，暂时使用模拟数据
            // TODO: 等待后端提供用户文章列表API
            try {
              const duducarAPI = (await import('@/api/duducar-integration')).default
              const articlesRes = await duducarAPI.article.getArticles({ 
                limit: 20, 
                offset: 0 
              })
              if (articlesRes.success && articlesRes.data?.list) {
                // 过滤出当前用户的文章（临时方案）
                posts.value = articlesRes.data.list
                  .filter(article => article.userId === parseInt(userId.value))
                  .map(article => ({
                    id: article.articleId,
                    title: article.articleName,
                    excerpt: article.articleContent?.substring(0, 100) + '...',
                    publishTime: article.createdAt,
                    views: article.viewCount || 0,
                    likes: article.likeCount || 0
                  }))
              }
            } catch (err) {
              console.log('文章API调用失败，使用模拟数据')
            }
            break
          case 'services':
            // API endpoint /users/{id}/services doesn't exist yet, using mock data
            console.log('services API不可用，使用模拟数据')
            services.value = [
              {
                id: 1,
                title: '房产咨询服务',
                description: '提供专业的房产投资建议',
                price: 'RM 500/次',
                image: 'https://picsum.photos/200/150?random=501',
                status: 'active'
              },
              {
                id: 2,
                title: '移民咨询',
                description: '一对一移民规划指导',
                price: 'RM 800/次',
                image: 'https://picsum.photos/200/150?random=502',
                status: 'active'
              }
            ]
            break
          case 'circles':
            // API endpoint /users/{id}/circles doesn't exist yet, using mock data
            console.log('circles API不可用，使用模拟数据')
            circles.value = [
              {
                id: 1,
                name: '马来西亚生活圈',
                description: '分享在马来西亚的生活点滴',
                memberCount: 1234,
                postCount: 5678,
                cover: 'https://picsum.photos/300/200?random=601'
              },
              {
                id: 2,
                name: '投资理财圈',
                description: '探讨投资理财心得',
                memberCount: 2345,
                postCount: 6789,
                cover: 'https://picsum.photos/300/200?random=602'
              }
            ]
            break
          case 'collections':
            // API endpoint /users/{id}/collections doesn't exist yet, using mock data
            console.log('collections API不可用，使用模拟数据')
            collections.value = [
              {
                id: 1,
                name: '精选文章集',
                description: '我收藏的优质文章',
                itemCount: 42,
                cover: 'https://picsum.photos/300/200?random=701',
                isPublic: true
              },
              {
                id: 2,
                name: '实用服务合集',
                description: '马来西亚生活必备服务',
                itemCount: 15,
                cover: 'https://picsum.photos/300/200?random=702',
                isPublic: false
              }
            ]
            break
          case 'following':
            response = await userProfileAPI.getUserFollowing(userId.value, { limit: 20 })
            if (response.code === 200 && Array.isArray(response.data?.list)) {
              followingUsers.value = response.data.list.map(user => {
                const item = normalizeUserItem(user)
                return { ...item, isFollowing: true }
              })
            } else {
              followingUsers.value = []
            }
            break
          case 'followers':
            response = await userProfileAPI.getUserFollowers(userId.value, { limit: 20 })
            if (response.code === 200 && Array.isArray(response.data?.list)) {
              followersUsers.value = response.data.list.map(user => {
                const item = normalizeUserItem(user)
                return { ...item, isFollowing: Boolean(item.isFollowing) }
              })
            } else {
              followersUsers.value = []
            }
            break
          case 'favorites':
            await loadFavorites(activeFavoriteType.value)
            break
        }
      } catch (error) {
        console.error(`加载${type}数据失败:`, error)
      }
    }
    
    // 加载收藏数据
    const loadFavorites = async (type = 'all') => {
      try {
        let response
        switch (type) {
          case 'posts':
            // 尝试从API获取，如果失败则使用模拟数据
            try {
              response = await userProfileAPI.getUserFavoritePosts(userId.value)
              if (response.data && response.data.length > 0) {
                favorites.value = response.data
                break
              }
            } catch (error) {
              console.log('使用模拟数据')
            }
            // 模拟数据
            favorites.value = [
              {
                id: 1,
                title: '马来西亚生活指南：新移民必知的10件事',
                excerpt: '从签证申请到日常生活，全面介绍马来西亚生活的方方面面...',
                image: 'https://picsum.photos/120/80?random=201',
                views: 1520,
                likes: 45,
                favoriteTime: '2天前'
              },
              {
                id: 2,
                title: '吉隆坡最值得去的10家咖啡馆',
                excerpt: '精选吉隆坡最具特色的咖啡馆，每一家都有独特的氛围...',
                image: 'https://picsum.photos/120/80?random=202',
                views: 2340,
                likes: 89,
                favoriteTime: '5天前'
              }
            ]
            break
          case 'services':
            try {
              response = await userProfileAPI.getUserFavoriteServices(userId.value)
              if (response.data && response.data.length > 0) {
                favorites.value = response.data
                break
              }
            } catch (error) {
              console.log('使用模拟数据')
            }
            favorites.value = [
              {
                id: 1,
                title: '专业翻译服务',
                description: '提供中英马来文翻译，政府文件、学历认证等',
                price: 'RM 50-200',
                location: '雪兰莪',
                favoriteTime: '3天前'
              }
            ]
            break
          case 'housing':
            try {
              response = await userProfileAPI.getUserFavoriteHousing(userId.value)
              if (response.data && response.data.length > 0) {
                favorites.value = response.data
                break
              }
            } catch (error) {
              console.log('使用模拟数据')
            }
            favorites.value = [
              {
                id: 1,
                title: 'KLCC附近精装公寓出租',
                description: '2室1厅，家具齐全，交通便利',
                price: 'RM 2500/月',
                location: '吉隆坡',
                type: '公寓',
                image: 'https://picsum.photos/120/80?random=203'
              }
            ]
            break
          case 'cars':
            try {
              response = await userProfileAPI.getUserFavoriteCars(userId.value)
              if (response.data && response.data.length > 0) {
                favorites.value = response.data
                break
              }
            } catch (error) {
              console.log('使用模拟数据')
            }
            favorites.value = [
              {
                id: 1,
                title: '本田雅阁 2018款',
                description: '车况良好，无事故，定期保养',
                price: 'RM 65,000',
                location: '吉隆坡',
                year: 2018,
                image: 'https://picsum.photos/120/80?random=204'
              }
            ]
            break
          case 'jobs':
            try {
              response = await userProfileAPI.getUserFavoriteJobs(userId.value)
              if (response.data && response.data.length > 0) {
                favorites.value = response.data
                break
              }
            } catch (error) {
              console.log('使用模拟数据')
            }
            favorites.value = [
              {
                id: 1,
                title: '前端开发工程师',
                description: '负责公司网站和移动应用的前端开发',
                salary: 'RM 5000-8000',
                location: '吉隆坡',
                type: '全职'
              }
            ]
            break
          case 'all':
          default:
            // 加载所有类型的收藏
            try {
              response = await userProfileAPI.getUserFavorites(userId.value)
              if (response.data && response.data.length > 0) {
                favorites.value = response.data
                break
              }
            } catch (error) {
              console.log('使用模拟数据')
            }
            favorites.value = [
              {
                id: 'p1',
                type: 'post',
                title: '马来西亚生活指南：新移民必知的10件事',
                excerpt: '从签证申请到日常生活，全面介绍马来西亚生活的方方面面...',
                image: 'https://picsum.photos/120/80?random=201',
                views: 1520,
                likes: 45,
                favoriteTime: '2天前'
              },
              {
                id: 's1',
                type: 'service',
                title: '专业翻译服务',
                description: '提供中英马来文翻译，政府文件、学历认证等',
                price: 'RM 50-200',
                location: '雪兰莪',
                favoriteTime: '3天前'
              },
              {
                id: 'h1',
                type: 'housing',
                title: 'KLCC附近精装公寓出租',
                description: '2室1厅，家具齐全，交通便利',
                price: 'RM 2500/月',
                location: '吉隆坡',
                image: 'https://picsum.photos/120/80?random=203',
                favoriteTime: '1周前'
              }
            ]
            break
        }
        
        // 更新收藏数量
        if (type === 'all' || activeFavoriteType.value === 'all') {
          userInfo.favoritesCount = favorites.value.length
        }
      } catch (error) {
        console.error('加载收藏数据失败:', error)
        favorites.value = []
      }
    }
    
    // 切换收藏类型
    const changeFavoriteType = async (type) => {
      activeFavoriteType.value = type
      await loadFavorites(type)
    }
    
    // 取消收藏
    const unfavoriteItem = async (type, id) => {
      // 未登录时跳转到登录页面
      if (!userStore.isLoggedIn) {
        router.push({
          path: '/auth/login',
          query: { redirect: route.fullPath }
        })
        return
      }
      
      try {
        // 根据类型调用不同的取消收藏API
        const { postsAPI } = await import('@/api/posts')
        const { servicesAPI } = await import('@/api/services')
        const { housingAPI } = await import('@/api/housing-extended')
        const { carsAPI } = await import('@/api/cars')
        const { jobsAPI } = await import('@/api/jobs')
        
        switch (type) {
          case 'post':
            // await postsAPI.unfavoritePost(id)
            break
          case 'service':
            await servicesAPI.unfavoriteService(id)
            break
          case 'housing':
            // await housingAPI.unfavoriteHousing(id)
            break
          case 'car':
            // await carsAPI.unfavoriteCar(id)
            break
          case 'job':
            // await jobsAPI.unfavoriteJob(id)
            break
        }
        
        // 从列表中移除
        favorites.value = favorites.value.filter(item => item.id !== id)
        
        // 提示用户
        console.log('取消收藏成功')
      } catch (error) {
        console.error('取消收藏失败:', error)
      }
    }
    
    // 获取IP地址并转换为地理位置
    const loadIpAddress = async () => {
      try {
        const response = await duducarAPI.user.getUserInfo()
        
        if (response.success && response.data) {
          let ipAddressData = response.data.ipAddress
          
          if (!ipAddressData || ipAddressData === 'unknown' || ipAddressData === '未知') {
            userInfo.ipAddress = '未知'
            return
          }
          
          // 检查是否是JSON字符串格式（后端返回的格式）
          if (typeof ipAddressData === 'string' && ipAddressData.startsWith('{')) {
            try {
              const ipData = JSON.parse(ipAddressData)
              
              // 提取地理位置信息（data数组：[国家, 省/州, 城市, ...]）
              if (ipData.data && Array.isArray(ipData.data)) {
                const locationParts = ipData.data
                  .slice(0, 3)
                  .filter(part => part && typeof part === 'string' && part.trim() !== '' && part !== 'Time')
                
                if (locationParts.length > 0) {
                  userInfo.ipAddress = locationParts.join(' ')
                  return
                }
              }
              
              // 如果JSON中没有地理位置，但有IP，使用IP查询
              if (ipData.ip) {
                ipAddressData = ipData.ip
              } else {
                userInfo.ipAddress = '未知'
                return
              }
            } catch (parseError) {
              userInfo.ipAddress = '未知'
              return
            }
          }
          
          // 如果是纯IP地址，使用免费API查询地理位置
          if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ipAddressData)) {
            try {
              // 使用 ip-api.com（免费，支持中文，每分钟45次请求）
              const geoResponse = await fetch(`http://ip-api.com/json/${ipAddressData}?lang=zh-CN`)
              const geoData = await geoResponse.json()
              
              if (geoData.status === 'success') {
                const locationParts = []
                if (geoData.country) locationParts.push(geoData.country)
                if (geoData.regionName) locationParts.push(geoData.regionName)
                if (geoData.city) locationParts.push(geoData.city)
                
                userInfo.ipAddress = locationParts.length > 0 ? locationParts.join(' ') : '未知'
              } else {
                userInfo.ipAddress = '未知'
              }
            } catch (geoError) {
              userInfo.ipAddress = '未知'
            }
          } else {
            userInfo.ipAddress = '未知'
          }
        } else {
          userInfo.ipAddress = '未知'
        }
      } catch (error) {
        console.error('获取IP地址失败:', error)
        userInfo.ipAddress = '未知'
      }
    }
    
    // 初始化数据
    const initData = async () => {
      await loadUserData()
      await loadIpAddress()
      await loadContentData(activeTab.value)
      
      // 如果API没有返回数据，使用模拟数据作为后备（关注/粉丝不使用模拟）
      if (posts.value.length === 0) {
        posts.value = [
          {
            id: 1,
            title: '马来西亚生活指南：新移民必知的10件事',
            excerpt: '从签证申请到日常生活，全面介绍马来西亚生活的方方面面...',
            publishTime: '2024-01-15',
            views: 1520,
            likes: 45
          },
          {
            id: 2,
            title: '吉隆坡哪家咖啡馆最适合远程办公？',
            excerpt: 'Wi-Fi、插座、安静程度与咖啡口味的综合评测...',
            publishTime: '2024-02-10',
            views: 3498,
            likes: 123
          }
        ]
      }
      
      services.value = [
        {
          id: 1,
          title: '专业翻译服务',
          description: '提供中英马来文翻译，政府文件、学历认证等',
          price: 'RM 50-200',
          location: '雪兰莪',
          publishTime: '1周前'
        },
        {
          id: 2,
          title: '钢琴私教入门到高级',
          description: '一对一课程，支持上门/线上，考级冲刺',
          price: 'RM 200/课时',
          location: '吉隆坡',
          publishTime: '2周前'
        }
      ]
      
      circles.value = [
        {
          id: 1,
          content: '分享一下马来西亚的美食文化',
          images: ['https://picsum.photos/300/200?random=89'],
          likes: 67,
          comments: 23,
          publishTime: '3天前'
        },
        {
          id: 2,
          content: '周末爬黑风洞，风景很赞，就是台阶太考验腿力了😂',
          images: ['https://picsum.photos/300/200?random=90','https://picsum.photos/300/200?random=91'],
          likes: 12,
          comments: 5,
          publishTime: '1天前'
        }
      ]

      // 关注 / 粉丝：不再使用模拟数据，保持为空待真实API加载
      followingUsers.value = []
      followersUsers.value = []
      likedPosts.value = [
        { id: 9002, title: '在吉隆坡租房的 8 个小技巧', excerpt: '地段、预算、安全性与合租建议...' },
        { id: 9003, title: '签证续签避坑：材料准备清单', excerpt: '常见问题与审核时间节点' }
      ]
      userInfo.likeCount = likedPosts.value.length
    }
    
    // 设置活跃标签
    const setActiveTab = async (tab) => {
      activeTab.value = tab
      await loadContentData(tab)
    }
    // 关注弹窗
    const showFollowModal = ref(false)
    const followModalType = ref('following')
    const openFollowModal = async (type) => {
      followModalType.value = type
      // 确保打开弹窗前加载对应列表
      await loadContentData(type)
      showFollowModal.value = true
    }
    const closeFollowModal = () => { showFollowModal.value = false }
    const followModalUsers = computed(() => followModalType.value === 'following' ? followingUsers.value : followersUsers.value)
    const onListFollowChange = (payload) => {
      // 仅当查看自己的主页时联动“关注了”数量
      if (isOwnProfile.value && payload?.delta) {
        userInfo.followingCount = Math.max((userInfo.followingCount || 0) + payload.delta, 0)
      }
    }
    
    // 切换关注状态
    const toggleFollow = async () => {
      // 未登录时跳转到登录页面
      if (!userStore.isLoggedIn) {
        router.push({
          path: '/auth/login',
          query: { redirect: route.fullPath }
        })
        return
      }
      
      try {
        if (userInfo.isFollowing) {
          // 取消关注
          const result = await userProfileAPI.unfollowUser(userId.value)
          if (result.code === 200) {
            userInfo.isFollowing = false
            userInfo.followersCount--
            userInfo.isMutualFollow = false
            console.log('已取消关注')
          }
        } else {
          // 关注
          const result = await userProfileAPI.followUser(userId.value)
          if (result.code === 200) {
            userInfo.isFollowing = true
            userInfo.followersCount++
            // 如果对方已关注我，则达到互相关注
            if (userInfo.isFollowedBy) {
              userInfo.isMutualFollow = true
            }
            console.log('关注成功')
          }
        }
      } catch (error) {
        console.error('关注操作失败:', error)
      }
    }
    
    
    // 显示更多选项
    const showMoreOptions = () => {
      // 未登录时跳转到登录页面
      if (!userStore.isLoggedIn) {
        router.push({
          path: '/auth/login',
          query: { redirect: route.fullPath }
        })
        return
      }
      // 显示举报、屏蔽等选项
      // TODO: 实现更多选项功能
    }
    
    // 显示搜索
    const showSearch = () => {
      // 在当前用户主页范围内检索 activities 文本
      const q = prompt('搜索此用户的动态内容（标题/摘要/描述/圈子文本）:')
      if (!q || !q.trim()) return
      const keyword = q.trim().toLowerCase()
      const match = (text) => String(text || '').toLowerCase().includes(keyword)
      const filtered = activities.value.filter(a => {
        if (a.type === 'post') return match(a.post?.title) || match(a.post?.excerpt)
        if (a.type === 'service') return match(a.service?.title) || match(a.service?.price) || match(a.service?.location)
        if (a.type === 'circle') return match(a.circle?.content)
        if (a.type === 'follow') return match(a.target?.name)
        if (a.type === 'like') return match(a.target?.title) || match(a.target?.excerpt)
        return false
      })
      if (filtered.length) {
        activities.value = filtered
      } else {
        alert('未找到相关动态')
      }
    }
    
    // 加载更多
    const loadMore = () => {
      if (loading.value) return
      loading.value = true
      
      // 模拟加载
      setTimeout(() => {
        loading.value = false
      }, 1000)
    }
    
    // 跳转到登录页面
    const goToLogin = () => {
      showLoginModal.value = false
      router.push('/auth/login')
    }

    const sendMessage = () => {
      if (!userStore.isLoggedIn) { showLoginModal.value = true; return }
      showAppDownloadModal.value = true
    }

    const editProfile = () => {
      router.push('/user/profile/edit')
    }
    
    // 获取活动组件
    const getActivityComponent = (type) => {
      return 'ActivityItem' // 简化处理，实际应该根据类型返回不同组件
    }
    
    // 格式化数字
    const formatNumber = (num) => {
      if (num >= 10000) {
        return Math.floor(num / 1000) + 'k+'
      }
      return num.toString()
    }
    
    // 格式化日期
    const formatDate = (dateStr) => {
      const date = new Date(dateStr)
      return date.getFullYear() + '-' + 
             String(date.getMonth() + 1).padStart(2, '0') + '-' + 
             String(date.getDate()).padStart(2, '0')
    }
    
    // 格式化完整日期
    const formatFullDate = (dateStr) => {
      return new Date(dateStr).toLocaleString('zh-CN')
    }
    
    // 路由变化时重新加载数据
    watch(() => route.params.id, (newId) => {
      if (newId) {
        initData()
      }
    })
    
    // 根据路由设置活跃标签，并加载对应数据（支持直接进入 /following 或 /followers）
    watch(() => route.path, async (newPath) => {
      let tab = 'activities'
      if (newPath.includes('/posts')) {
        tab = 'posts'
      } else if (newPath.includes('/services')) {
        tab = 'services'
      } else if (newPath.includes('/circles')) {
        tab = 'circles'
      } else if (newPath.includes('/collections')) {
        tab = 'collections'
      } else if (newPath.includes('/favorites')) {
        tab = 'favorites'
      } else if (newPath.includes('/following')) {
        tab = 'following'
      } else if (newPath.includes('/followers')) {
        tab = 'followers'
      } else {
        tab = 'activities'
      }
      activeTab.value = tab
      await loadContentData(tab)
    }, { immediate: true })
    
    onMounted(() => {
      initData()
    })
    
    return {
      userId,
      isOwnProfile,
      coverFallback,
      activeTab,
      loading,
      hasMore,
      showLoginModal,
      showTagsModal,
      userInfo,
      activities,
      posts,
      services,
      circles,
      collections,
      followingUsers,
      favorites,
      activeFavoriteType,
      favoriteTypes,
      setActiveTab,
      toggleFollow,
      showMoreOptions,
      showSearch,
      loadMore,
      goToLogin,
      sendMessage,
      editProfile,
      showAppDownloadModal,
      appPlatform,
      appQrIos,
      appQrAndroid,
      openTagsModal: () => { showTagsModal.value = true },
      handleImageError: (event) => {
        console.error('Image load error:', event.target.src)
        event.target.src = coverFallback.value
      },
      getActivityComponent,
      formatNumber,
      formatDate,
      formatFullDate,
      changeFavoriteType,
      unfavoriteItem,
      likedPosts,
      // modal
      showFollowModal,
      followModalType,
      followModalUsers,
      openFollowModal,
      closeFollowModal
    }
  }
}
</script>

<style scoped>
/* 知乎风格 - 个人主页样式 */

/* 顶部封面和个人信息区 */
.profile-header { 
  padding: 0; 
  overflow: visible; 
  border: 1px solid #f0f0f0; 
  border-radius: 8px; 
  background: #fff;
}

.cover-banner { 
  width: 100%; 
  height: 200px; 
  background: #ffffff; 
  overflow: hidden; 
  position: relative;
}

.cover-banner img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  display: block; 
}

.profile-main { 
  display: grid; 
  grid-template-columns: auto 1fr auto; 
  gap: 16px; 
  align-items: flex-start; 
  padding: 0 24px 20px 24px; 
  position: relative; 
}

.avatar-wrap { 
  width: 96px; 
  height: 96px; 
  margin-top: -48px; 
  border-radius: 50%; 
  border: 3px solid #fff; 
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); 
  overflow: hidden; 
  background: #fff;
}

.avatar-circle { 
  width: 100%; 
  height: 100%; 
  border-radius: 50%; 
  object-fit: cover; 
  display: block; 
}

.profile-info { 
  min-width: 0; 
  padding-top: 12px;
}

.profile-name { 
  margin: 0 0 8px 0; 
  font-size: 22px; 
  font-weight: 700; 
  color: #1a1a1a; 
  line-height: 1.2;
}

.profile-meta { 
  margin-top: 8px; 
  font-size: 13px; 
  color: #b2bac2; 
}

.profile-actions { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  padding-top: 12px;
}

/* 知乎风格按钮 - 关注按钮（橙色） */
.zh-follow-btn { 
  border: none; 
  background: #FF6A00; 
  color: #fff; 
  padding: 8px 16px; 
  border-radius: 6px; 
  cursor: pointer; 
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.zh-follow-btn:hover { 
  background: #ff8533; 
}

.zh-follow-btn.active { 
  background: #fff; 
  color: #8590a6; 
  border: 1px solid #d9d9d9;
}

.zh-follow-btn.active:hover {
  background: #fafbfc;
  color: #1a1a1a;
}

/* 发私信按钮 */
.zh-msg-btn { 
  border: 1px solid #d9d9d9; 
  background: #fff; 
  color: #1a1a1a; 
  padding: 8px 16px; 
  border-radius: 6px; 
  cursor: pointer; 
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.zh-msg-btn:hover {
  background: #fafbfc;
  border-color: #b2bac2;
}

/* 更多按钮 */
.profile-actions .more-btn { 
  border: 1px solid #d9d9d9; 
  background: #fff; 
  color: #8590a6; 
  padding: 8px; 
  border-radius: 6px; 
  cursor: pointer; 
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.profile-actions .more-btn:hover {
  background: #fafbfc;
  border-color: #b2bac2;
}

@media (max-width: 768px) {
  .cover-banner { height: 120px; }
  .avatar-wrap { width: 80px; height: 80px; margin-top: -48px; }
  .profile-main { grid-template-columns: 1fr; gap: 8px; }
  .profile-actions { justify-content: flex-start; }
}
/* 知乎风格 - 整体页面布局 */
.user-profile-page {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
  min-height: 100vh;
}

.major-area {
  flex: 1;
  max-width: 800px;
  min-width: 0;
}

.minor-area {
  width: 300px;
  flex-shrink: 0;
}

.block {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(26,26,26,0.05);
}

.shadow { box-shadow: none; }

.list-block {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(26,26,26,0.05);
}

/* 用户信息块 */
.user-info-block {
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 88px 1fr auto;
  align-items: start;
  gap: 20px;
  background: #fff;
  border: none;
}

.user-avatar {
  flex-shrink: 0;
  align-self: start;
}

.avatar-img {
  width: 88px;
  height: 88px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: none;
  border: 1px solid #eee;
}

.info-box {
  flex: 1;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.username {
  margin: 0 0 6px 0;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.user-info-icon {
  margin: 8px 0;
}

.rank-icon {
  width: 24px;
  height: 24px;
}

.introduction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.position {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.operate-btn {
  display: inline-flex;
  gap: 12px;
  align-items: center;
}

.follow-btn, .more-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  box-shadow: 0 2px 6px rgba(0,0,0,.04);
}

.follow-btn:hover, .more-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.follow-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 徽章墙 */
/* 徽章墙移除后，用分割线优化层次 */
.badge-wall { display: none; }

.badge-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.badge-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-icon {
  width: 20px;
  height: 20px;
}

.badge-count {
  font-size: 14px;
  color: #6b7280;
}

.badge-list {
  display: flex;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.badge-icon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

/* 知乎风格 - 标签导航栏 */
.list-header { 
  border-bottom: 1px solid #f0f0f0; 
  position: sticky; 
  top: 0; 
  background: #fff; 
  z-index: 100;
  box-shadow: 0 1px 3px rgba(26,26,26,0.05);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 24px;
  overflow-x: auto;
  scrollbar-width: none;
}

.header-content::-webkit-scrollbar {
  display: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 16px;
  color: #8590a6;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  position: relative;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
}

.nav-item:hover {
  color: #FF6A00;
}

.nav-item.active {
  color: #FF6A00;
  border-bottom-color: #FF6A00;
  font-weight: 600;
}

.item-title {
  font-size: 14px;
  font-weight: inherit;
}

.item-count {
  font-size: 13px;
  color: #b2bac2;
  font-weight: 400;
}

.nav-item.active .item-count {
  color: #FF6A00;
}

.search-icon-container {
  margin-left: auto;
  padding: 16px 12px;
  flex-shrink: 0;
}

.search-icon { 
  color: #8590a6; 
  cursor: pointer; 
  transition: color 0.2s ease; 
}

.search-icon:hover {
  color: #FF6A00;
}

/* 知乎风格 - 内容列表 */
.list-body {
  padding: 0;
  background: #fff;
}

/* 统一的卡片样式 - 知乎风格无边框设计 */
.activity-item, 
.post-item, 
.service-item, 
.circle-item, 
.collection-item, 
.user-item { 
  margin-bottom: 0; 
  padding: 20px 24px; 
  border-radius: 0; 
  background: #fff; 
  border: none; 
  border-bottom: 1px solid #f6f6f6; 
  min-height: auto; 
  box-shadow: none; 
  transition: all 0.2s ease;
  position: relative;
}

.activity-item:last-child, 
.post-item:last-child, 
.service-item:last-child, 
.circle-item:last-child, 
.collection-item:last-child, 
.user-item:last-child {
  border-bottom: none;
}

.activity-item:hover, 
.post-item:hover, 
.service-item:hover, 
.circle-item:hover, 
.collection-item:hover, 
.user-item:hover {
  background: #fafbfc;
  border-bottom-color: #e8e8e8;
}

.load-more {
  text-align: center;
  padding: 20px 24px;
  cursor: pointer;
  color: #FF6A00;
  font-size: 14px;
  transition: all 0.2s ease;
  border-radius: 0;
  border-top: 1px solid #f6f6f6;
  background: #fff;
}

.load-more:hover {
  background: #fafbfc;
  color: #ff8533;
}

/* 知乎风格 - 侧边栏 */
.sticky-wrap {
  position: sticky;
  top: 80px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 移除个人成就模块 */
.stat-block { 
  display: none !important;
}

/* 个人成就模块 - 知乎风格 */
.achievement-block {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(26,26,26,0.05);
}

.achievement-block .block-title {
  padding: 14px 16px 10px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  border-bottom: 1px solid #f0f0f0;
}

.achievement-block .block-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.achievement-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0;
  transition: all 0.2s ease;
}

.achievement-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.achievement-icon svg {
  display: block;
}

.achievement-icon.like-icon {
  color: #0084ff;
}

.achievement-icon.view-icon {
  color: #00a876;
}

.achievement-text {
  flex: 1;
  color: #515767;
  font-size: 14px;
  line-height: 1.5;
}

.achievement-text strong {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 15px;
  margin: 0 2px;
}

/* 关注统计模块 - 知乎大数字风格 */
.follow-block { 
  display: flex; 
  border: 1px solid #f0f0f0; 
  border-radius: 8px; 
  background: #fff; 
  padding: 16px;
  box-shadow: 0 1px 3px rgba(26,26,26,0.05);
}

.follow-item { 
  flex: 1 1 0; 
  text-align: center; 
  text-decoration: none; 
  color: inherit; 
  transition: all 0.2s ease; 
  padding: 8px 4px; 
  background: transparent; 
  border: none; 
  cursor: pointer; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  gap: 8px;
}

.follow-item + .follow-item { 
  border-left: 1px solid #f0f0f0; 
}

.follow-item:hover { 
  color: #FF6A00;
}

.follow-item .item-title { 
  font-size: 14px; 
  color: #8590a6; 
  margin-bottom: 0;
  font-weight: 400;
}

/* 知乎风格超大数字 */
.follow-item .item-count { 
  font-size: 28px; 
  font-weight: 700; 
  color: #1a1a1a; 
  line-height: 1;
}

.follow-item:hover .item-count {
  color: #FF6A00;
}

/* 知乎风格 - 更多信息模块 */
.more-block {
  border: 1px solid #f0f0f0; 
  border-radius: 8px; 
  background: #fff;
  padding: 0;
  box-shadow: 0 1px 3px rgba(26,26,26,0.05);
  overflow: hidden;
}

.more-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 0;
  font-size: 14px;
  border: none;
  background: transparent;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.more-item:not(:last-child) {
  border-bottom: 1px solid #f6f6f6;
}

.more-item.stat-item {
  border-bottom: none !important;
  padding: 12px 30px;
}

.more-item.stat-item:last-of-type {
  border-bottom: 1px solid #f6f6f6 !important;
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #8590a6;
  margin-right: 12px;
  flex-shrink: 0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-item .item-icon {
  width: 14px;
  height: 14px;
  margin-right: 10px;
}

.more-item.info-item {
  cursor: default;
}

.more-item.btn-stat {
  cursor: pointer;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
}

.more-item.btn-stat:hover {
  background: linear-gradient(90deg, rgba(255, 106, 0, 0.03) 0%, rgba(255, 106, 0, 0.01) 100%);
}

.more-item.btn-stat:hover .item-title {
  color: #FF6A00;
}

.more-item.btn-stat:hover .item-count {
  color: #FF6A00;
}

.more-item.btn-stat:hover .item-icon {
  color: #FF6A00;
}

.info-item .item-icon {
  color: #8590a6;
}

.more-item.last-item .item-icon {
  color: #ff9800;
}

.item-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.more-block .item-title { 
  color: #515767; 
  font-weight: 500;
  font-size: 14px;
  transition: color 0.25s ease;
}

.more-block .item-count { 
  color: #8590a6; 
  font-weight: 600;
  font-size: 14px;
  transition: all 0.25s ease;
}

.stat-item .item-title {
  font-size: 14px;
  color: #8590a6;
  font-weight: 400;
}

.stat-item .item-count {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.item-arrow {
  color: #d1d5db;
  margin-left: 4px;
  display: flex;
  align-items: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-plain { 
  background: transparent; 
  border: none; 
  width: 100%; 
  text-align: left; 
  padding: 0; 
  cursor: pointer;
  display: flex;
  align-items: center;
}

/* 企业认证块（已移除，仅保留空占位以避免冲突） */

/* 知乎风格 - 登录模态框 */
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.login-modal {
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 420px;
  width: 90%;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

/* APP 下载二维码弹窗（玻璃态卡片 + 侧边工具栏风格） */
.app-qr-modal {
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 16px;
  padding: 20px 22px 18px;
  max-width: 460px;
  width: 92vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.12);
  backdrop-filter: saturate(160%) blur(14px);
  -webkit-backdrop-filter: saturate(160%) blur(14px);
}

.app-qr-modal .modal-header h3 {
  font-size: 18px;
}

.app-qr-modal .modal-body { text-align: center; }

.app-qr-modal .qr-card { padding: 6px 8px 12px; }

.app-qr-modal .qr-box { position: relative; display: inline-block; }

.app-qr-modal .qr-image {
  width: 180px;
  height: 180px;
  display: block;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0,0,0,.08);
}

.app-qr-modal .corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--primary-color, #FF6A00);
}
.app-qr-modal .corner.tl { left: -8px; top: -8px; border-left: 2px solid; border-top: 2px solid; border-left-color: var(--primary-color, #FF6A00); border-top-color: var(--primary-color, #FF6A00); }
.app-qr-modal .corner.tr { right: -8px; top: -8px; border-right: 2px solid; border-top: 2px solid; border-right-color: var(--primary-color, #FF6A00); border-top-color: var(--primary-color, #FF6A00); }
.app-qr-modal .corner.bl { left: -8px; bottom: -8px; border-left: 2px solid; border-bottom: 2px solid; border-left-color: var(--primary-color, #FF6A00); border-bottom-color: var(--primary-color, #FF6A00); }
.app-qr-modal .corner.br { right: -8px; bottom: -8px; border-right: 2px solid; border-bottom: 2px solid; border-right-color: var(--primary-color, #FF6A00); border-bottom-color: var(--primary-color, #FF6A00); }

.app-qr-modal .qr-title {
  margin-top: 12px;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 700;
  color: #1f2937;
}

.app-qr-modal .download-actions {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
}

.app-qr-modal .btn-download {
  display: inline-block;
  padding: 8px 14px;
  border: 1px solid var(--primary-color, #FF6A00);
  color: var(--primary-color, #FF6A00);
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  min-width: 110px;
  cursor: pointer;
}

.app-qr-modal .btn-download:hover { background: var(--primary-color, #FF6A00); color: #fff; }
.app-qr-modal .btn-download.active { background: var(--primary-color, #FF6A00); color: #fff; }

/* 知乎风格 - 关注弹窗 */
.follow-modal { 
  background: #fff; 
  border-radius: 8px; 
  padding: 20px; 
  width: 600px; 
  max-width: 96vw; 
  border: none;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.follow-modal-body { 
  max-height: 65vh; 
  overflow: auto; 
  padding: 12px 0; 
}

.follow-users .user-item { 
  margin-bottom: 12px; 
  padding: 12px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.follow-users .user-item:hover {
  background: #fafbfc;
}

.empty-tip { 
  color: #8590a6; 
  text-align: center; 
  padding: 40px 0; 
  font-size: 14px;
}

/* 知乎风格 - 模态框通用样式 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #8590a6;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #1a1a1a;
  background: #f0f0f0;
}

.modal-body p {
  color: #8590a6;
  margin-bottom: 20px;
  line-height: 1.6;
  font-size: 14px;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  width: 100%;
  padding: 12px 24px;
  background: #FF6A00;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.login-btn:hover {
  background: #ff8533;
}

/* 知乎风格 - 收藏列表样式 */
.favorites-list {
  padding: 0;
  background: #fff;
}

.favorites-filter {
  display: flex;
  gap: 10px;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  overflow-x: auto;
  scrollbar-width: none;
}

.favorites-filter::-webkit-scrollbar {
  display: none;
}

/* 知乎风格胶囊按钮 */
.filter-btn {
  padding: 6px 16px;
  border-radius: 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #8590a6;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-btn:hover { 
  border-color: #b2bac2; 
  color: #1a1a1a; 
  background: #fafbfc;
}

/* 知乎橙色选中态 */
.filter-btn.active { 
  background: #FF6A00; 
  color: #fff; 
  border-color: #FF6A00; 
}

.filter-btn.active:hover {
  background: #ff8533;
  border-color: #ff8533;
}

.favorites-content {
  padding: 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-icon {
  margin: 0 auto 16px;
  color: #d1d5db;
}

.empty-text {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.empty-tip {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* 知乎风格 - 收藏卡片 */
.favorite-item {
  position: relative;
  margin-bottom: 0;
  padding: 20px 24px;
  border-radius: 0;
  background: #fff;
  border: none;
  border-bottom: 1px solid #f6f6f6;
  transition: all 0.2s ease;
}

.favorite-item:last-child {
  border-bottom: none;
}

.favorite-item:hover { 
  background: #fafbfc;
  border-bottom-color: #e8e8e8;
}

.favorite-link {
  display: flex;
  gap: 16px;
  text-decoration: none;
  color: inherit;
}

.favorite-content {
  flex: 1;
  min-width: 0;
}

.favorite-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.2s ease;
}

.favorite-link:hover .favorite-title {
  color: #FF6A00;
}

.favorite-excerpt {
  font-size: 14px;
  color: #8590a6;
  line-height: 1.6;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.favorite-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #b2bac2;
}

.meta-item.price {
  color: #FF6A00;
  font-weight: 600;
  font-size: 15px;
}

.favorite-image {
  flex-shrink: 0;
  width: 120px;
  height: 80px;
  border-radius: 2px;
  overflow: hidden;
  background: #f6f6f6;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.favorite-item:hover .favorite-image img {
  transform: scale(1.05);
}

.unfavorite-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #8590a6;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
}

.favorite-item:hover .unfavorite-btn {
  opacity: 1;
}

.unfavorite-btn:hover { 
  background: #fff1f0; 
  border-color: #ff4d4f; 
  color: #ff4d4f; 
}

/* 知乎风格 - 响应式设计 */
@media (max-width: 768px) {
  .user-profile-page {
    flex-direction: column;
    padding: 12px;
    gap: 16px;
    background: #fff;
  }
  
  .major-area {
    max-width: 100%;
  }
  
  .minor-area {
    width: 100%;
  }
  
  /* 移动端封面和头像 */
  .cover-banner {
    height: 140px;
  }
  
  .avatar-wrap {
    width: 80px;
    height: 80px;
    margin-top: -40px;
  }
  
  .profile-main {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 16px 16px;
  }
  
  .profile-info {
    text-align: center;
    padding-top: 8px;
  }
  
  .profile-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  /* 移动端标签导航 */
  .header-content {
    overflow-x: auto;
    padding: 0 16px;
    scrollbar-width: none;
  }
  
  .nav-item {
    white-space: nowrap;
    padding: 14px 12px;
    font-size: 14px;
  }
  
  .list-body {
    padding: 0;
  }
  
  .activity-item, 
  .post-item, 
  .service-item, 
  .circle-item, 
  .collection-item, 
  .user-item {
    padding: 16px;
  }
  
  .load-more {
    padding: 16px;
  }
  
  /* 移动端收藏筛选 */
  .favorites-filter {
    padding: 12px 16px;
    gap: 8px;
  }
  
  .favorites-content {
    padding: 0;
  }
  
  .favorite-item {
    padding: 16px;
  }
  
  .favorite-link {
    flex-direction: column;
    gap: 12px;
  }
  
  .favorite-image {
    width: 100%;
    height: 180px;
  }
  
  .unfavorite-btn {
    opacity: 1;
  }
  
  /* 移动端侧边栏 */
  .sticky-wrap {
    position: static;
  }
  
  .follow-block {
    padding: 16px 12px;
  }
  
  .follow-item .item-count {
    font-size: 24px;
  }
  
  /* 移动端模态框 */
  .follow-modal {
    width: 95vw;
    padding: 16px;
  }
  
  .login-modal {
    width: 95vw;
    padding: 20px;
  }
}
</style>
