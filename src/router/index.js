import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/HomePage.vue'),
    meta: {
      title: '首页 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/news/NewsPage.vue'),
    meta: {
      title: '资讯新闻 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/views/news/NewsDetail.vue'),
    meta: {
      title: '新闻详情 - 知马网'
    }
  },
  {
    path: '/news/:articleId/edit',
    name: 'NewsEditPage',
    component: () => import('@/views/news/NewsEditPage.vue'),
    meta: {
      title: '编辑资讯 - 知马网',
      requiresAuth: true,
      hideFooter: true
    }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('@/views/services/ServicesPage.vue'),
    meta: {
      title: '知马同城 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/services/list',
    name: 'ServicesList',
    component: () => import('@/views/services/ServicesListPage.vue'),
    meta: {
      title: '本地服务 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/cars',
    name: 'CarsList',
    component: () => import('@/views/services/cars/CarsListPage.vue'),
    meta: {
      title: '二手车 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/housing',
    name: 'HousingHome',
    component: () => import('@/views/services/housing/HousingHomePage.vue'),
    meta: {
      title: '房产 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/housing/shops',
    name: 'HousingShops',
    component: () => import('@/views/services/housing/HousingShopsPage.vue'),
    meta: {
      title: '商铺出售 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/housing/secondhand',
    name: 'HousingSecondhand',
    component: () => import('@/views/services/housing/HousingSecondhandPage.vue'),
    meta: { title: '二手房 - 知马网', keepAlive: true }
  },
  {
    path: '/housing/new',
    name: 'HousingNew',
    component: () => import('@/views/services/housing/HousingNewPage.vue'),
    meta: { title: '新房 - 知马网', keepAlive: true }
  },
  {
    path: '/rent',
    name: 'RentList',
    component: () => import('@/views/services/housing/RentListPage.vue'),
    meta: {
      title: '租房 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/jobs',
    name: 'JobsList',
    component: () => import('@/views/services/jobs/JobsListPage.vue'),
    meta: {
      title: '招聘 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/jobs/filter',
    name: 'JobsFilter',
    component: () => import('@/views/services/jobs/JobsFilterPage.vue'),
    meta: {
      title: '招聘筛选 - 知马网'
    }
  },
  {
    path: '/services/:id',
    name: 'ServiceDetail',
    component: () => import('@/views/services/ServiceDetail.vue'),
    meta: {
      title: '服务详情 - 知马网'
    }
  },
  {
    path: '/circles',
    name: 'Circles',
    component: () => import('@/views/circles/CirclesPage.vue'),
    meta: {
      title: '知马圈 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/circles/:id',
    name: 'CirclesDetail',
    components: {
      default: () => import('@/views/circles/CirclesPage.vue'),
      modal: () => import('@/views/circles/CirclesDetail.vue')
    },
    meta: {
      title: '知马圈详情 - 知马网'
    }
  },
  {
    path: '/lifestyle',
    name: 'Lifestyle',
    component: () => import('@/views/circles/lifestyle/LifestylePage.vue'),
    meta: {
      title: '生活分享 - 知马网',
      keepAlive: true
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/home/search/SearchPage.vue'),
    meta: {
      title: '搜索 - 知马网',
      keepAlive: true
    }
  },
  // 已不再使用统一搜索页，改为各频道内信息流
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: {
      title: '个人中心 - 知马网',
      requiresAuth: true,
      hideFooter: true
    }
  },
  {
    path: '/user/:id',
    name: 'UserProfile',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: {
      title: '用户主页 - 知马网',
      hideFooter: true
    }
  },
  {
    path: '/user/:id/posts',
    name: 'UserPosts',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: {
      title: '用户文章 - 知马网',
      hideFooter: true
    }
  },
  {
    path: '/user/:id/services',
    name: 'UserServices',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: {
      title: '用户服务 - 知马网',
      hideFooter: true
    }
  },
  {
    path: '/user/:id/circles',
    name: 'UserCircles',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: {
      title: '用户知马圈 - 知马网',
      hideFooter: true
    }
  },
  {
    path: '/user/:id/collections',
    name: 'UserCollections',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: {
      title: '用户收藏集 - 知马网',
      hideFooter: true
    }
  },
  {
    path: '/user/:id/favorites',
    name: 'UserFavorites',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: {
      title: '我的收藏 - 知马网',
      hideFooter: true
    }
  },
  {
    path: '/user/:id/following',
    name: 'UserFollowing',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: {
      title: '用户关注 - 知马网',
      hideFooter: true
    }
  },
  {
    path: '/user/:id/followers',
    name: 'UserFollowers',
    component: () => import('@/views/user/UserProfilePage.vue'),
    meta: {
      title: '用户关注者 - 知马网',
      hideFooter: true
    }
  },
  {
    path: '/user/profile/edit',
    name: 'UserProfileEdit',
    component: () => import('@/views/user/UserProfileEditPage.vue'),
    meta: {
      title: '编辑资料 - 知马网',
      requiresAuth: true,
      hideFooter: true
    }
  },
  // legacy unified publish route removed; use dedicated routes below
  {
    path: '/publish/news',
    name: 'NewsPublish',
    component: () => import('@/views/publish/NewsPublishPage.vue'),
    meta: {
      title: '发布资讯 - 知马网',
      requiresAuth: true,
      hideFooter: true
    }
  },
  {
    path: '/publish/services',
    name: 'ServicesPublish',
    component: () => import('@/views/publish/CityPublishPage.vue'),
    meta: {
      title: '发布服务 - 知马网',
      requiresAuth: true,
      hideFooter: true
    }
  },
  {
    path: '/publish/circles',
    name: 'CirclesPublish',
    component: () => import('@/views/publish/CirclesPublishPage.vue'),
    meta: {
      title: '发布动态 - 知马网',
      requiresAuth: true,
      hideFooter: true
    }
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: {
      title: '登录 - 知马网'
    }
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterPage.vue'),
    meta: {
      title: '注册 - 知马网'
    }
  },
  {
    path: '/auth/company',
    name: 'CompanyAuth',
    component: () => import('@/views/auth/CompanyAuthPage.vue'),
    meta: {
      title: '企业认证 - 知马网',
      requiresAuth: true,
      hideFooter: true
    }
  },
  {
    path: '/error/:code',
    name: 'ErrorPage',
    component: () => import('@/views/error/ErrorPage.vue'),
    meta: {
      title: '错误页面 - 知马网'
    }
  },
  {
    path: '/test/api',
    name: 'ApiTest',
    component: () => import('@/views/test/ApiTestPage.vue'),
    meta: {
      title: 'API 测试页面 - 知马网'
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/ErrorPage.vue'),
    meta: {
      title: '页面未找到 - 知马网'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  next()
})

export default router

