// 知马网 Service Worker
const CACHE_NAME = 'zhimawang-v1.0.0'
const STATIC_CACHE = 'zhimawang-static-v1'
const DYNAMIC_CACHE = 'zhimawang-dynamic-v1'
const API_CACHE = 'zhimawang-api-v1'

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/manifest.json',
  // 字体文件
  // CSS 和 JS 文件会通过构建时的预缓存列表添加
]

// API 缓存策略配置
const API_CACHE_CONFIG = {
  // 新闻列表缓存 1 小时
  '/api/v1/news': { maxAge: 60 * 60 * 1000, strategy: 'networkFirst' },
  // 热门新闻缓存 30 分钟
  '/api/v1/news/trending': { maxAge: 30 * 60 * 1000, strategy: 'networkFirst' },
  // 服务列表缓存 15 分钟
  '/api/v1/services': { maxAge: 15 * 60 * 1000, strategy: 'networkFirst' },
  // 圈子内容缓存 10 分钟
  '/api/v1/circles': { maxAge: 10 * 60 * 1000, strategy: 'networkFirst' },
  // 用户信息缓存 5 分钟
  '/api/v1/user': { maxAge: 5 * 60 * 1000, strategy: 'networkFirst' }
}

// 安装事件
self.addEventListener('install', event => {
  console.log('Service Worker: Install')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        // 立即激活新的 Service Worker
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Service Worker: Cache installation failed:', error)
      })
  )
})

// 激活事件
self.addEventListener('activate', event => {
  console.log('Service Worker: Activate')
  
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // 立即接管所有客户端
      self.clients.claim()
    ])
  )
})

// 获取事件
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return
  }
  
  // 跳过 Chrome 扩展请求
  if (url.protocol === 'chrome-extension:') {
    return
  }
  
  // API 请求处理
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }
  
  // 静态资源处理
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request))
    return
  }
  
  // 导航请求（页面）处理
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }
  
  // 其他动态资源处理
  event.respondWith(handleDynamicAsset(request))
})

// 处理 API 请求
async function handleApiRequest(request) {
  const url = new URL(request.url)
  const config = getApiCacheConfig(url.pathname)
  
  if (!config) {
    // 不缓存的 API，直接请求网络
    return fetch(request)
  }
  
  const cache = await caches.open(API_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (config.strategy === 'networkFirst') {
    try {
      // 网络优先策略
      const networkResponse = await fetch(request)
      
      if (networkResponse.ok) {
        // 添加缓存时间戳
        const responseClone = networkResponse.clone()
        const response = new Response(responseClone.body, {
          status: responseClone.status,
          statusText: responseClone.statusText,
          headers: {
            ...Object.fromEntries(responseClone.headers.entries()),
            'sw-cache-time': Date.now().toString()
          }
        })
        
        cache.put(request, response.clone())
        return response
      }
    } catch (error) {
      console.log('Network request failed, using cache:', error)
    }
    
    // 网络失败，使用缓存
    if (cachedResponse && !isCacheExpired(cachedResponse, config.maxAge)) {
      return cachedResponse
    }
  }
  
  // 缓存优先或网络失败时的降级处理
  return cachedResponse || fetch(request)
}

// 处理静态资源
async function handleStaticAsset(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.error('Failed to fetch static asset:', error)
    throw error
  }
}

// 处理导航请求
async function handleNavigationRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // 网络失败，返回缓存的首页或离线页面
    const cachedResponse = await cache.match(request) || 
                           await cache.match('/') ||
                           await cache.match('/index.html')
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // 返回简单的离线页面
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>网络连接失败 - 知马网</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline { max-width: 400px; margin: 0 auto; }
            .retry-btn { 
              background: #FF6A00; color: white; border: none; 
              padding: 10px 20px; border-radius: 5px; cursor: pointer; 
            }
          </style>
        </head>
        <body>
          <div class="offline">
            <h1>网络连接失败</h1>
            <p>请检查您的网络连接并重试</p>
            <button class="retry-btn" onclick="location.reload()">重新尝试</button>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
}

// 处理动态资源
async function handleDynamicAsset(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      // 限制动态缓存大小
      await limitCacheSize(DYNAMIC_CACHE, 100)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// 获取 API 缓存配置
function getApiCacheConfig(pathname) {
  for (const [pattern, config] of Object.entries(API_CACHE_CONFIG)) {
    if (pathname.startsWith(pattern)) {
      return config
    }
  }
  return null
}

// 检查缓存是否过期
function isCacheExpired(response, maxAge) {
  const cacheTime = response.headers.get('sw-cache-time')
  if (!cacheTime) return true
  
  const age = Date.now() - parseInt(cacheTime)
  return age > maxAge
}

// 判断是否为静态资源
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.woff', '.woff2', '.ttf']
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname.includes('/assets/') ||
         url.pathname === '/logo.png' ||
         url.pathname === '/manifest.json'
}

// 限制缓存大小
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  
  if (keys.length > maxItems) {
    // 删除最旧的条目
    const deleteCount = keys.length - maxItems
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i])
    }
  }
}

// 消息处理
self.addEventListener('message', event => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'CLEAR_CACHE':
      handleClearCache(payload)
      break
      
    case 'CACHE_STATS':
      handleCacheStats(event)
      break
  }
})

// 清理缓存
async function handleClearCache(cacheNames = []) {
  if (cacheNames.length === 0) {
    cacheNames = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE]
  }
  
  for (const cacheName of cacheNames) {
    await caches.delete(cacheName)
    console.log('Cleared cache:', cacheName)
  }
}

// 获取缓存统计
async function handleCacheStats(event) {
  const stats = {}
  const cacheNames = await caches.keys()
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    stats[cacheName] = keys.length
  }
  
  event.ports[0].postMessage({ type: 'CACHE_STATS', payload: stats })
}

console.log('Service Worker: Script loaded')
