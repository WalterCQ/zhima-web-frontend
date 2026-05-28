/**
 * 本地占位符图片生成工具
 * 避免外部服务依赖，使用Canvas生成占位符图片
 */

// 缓存生成的占位符，避免重复计算
const placeholderCache = new Map()

/**
 * 生成占位符图片的Data URL
 * @param {number} width - 图片宽度
 * @param {number} height - 图片高度 
 * @param {string} bgColor - 背景颜色 (hex格式，不含#)
 * @param {string} textColor - 文字颜色 (hex格式，不含#)
 * @param {string} text - 显示的文字
 * @returns {string} Data URL格式的图片
 */
export function generatePlaceholder(width, height, bgColor = 'CCCCCC', textColor = '000000', text = `${width}x${height}`) {
  // 创建缓存键
  const cacheKey = `${width}x${height}_${bgColor}_${textColor}_${text}`
  
  // 检查缓存
  if (placeholderCache.has(cacheKey)) {
    return placeholderCache.get(cacheKey)
  }
  
  // 创建canvas元素
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  // 设置背景颜色
  ctx.fillStyle = `#${bgColor}`
  ctx.fillRect(0, 0, width, height)

  // 设置文字样式
  ctx.fillStyle = `#${textColor}`
  
  // 根据图片大小调整字体大小
  const fontSize = Math.max(12, Math.min(width, height) / 8)
  ctx.font = `${fontSize}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // 在画布中心绘制文字
  ctx.fillText(text, width / 2, height / 2)

  // 返回Data URL并缓存
  const dataUrl = canvas.toDataURL('image/png')
  
  // 限制缓存大小，避免内存泄漏
  if (placeholderCache.size > 100) {
    const firstKey = placeholderCache.keys().next().value
    placeholderCache.delete(firstKey)
  }
  
  placeholderCache.set(cacheKey, dataUrl)
  return dataUrl
}

// 依据键值从调色板中选择颜色（稳定但分散）
function selectColorFromPalette(key = '', palette = []) {
  if (!palette.length) return 'CCCCCC'
  const text = String(key)
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return palette[hash % palette.length]
}

const palettes = {
  car: ['3B82F6','10B981','F59E0B','EF4444','8B5CF6','0EA5E9','22C55E'],
  job: ['0EA5E9','6366F1','14B8A6','FB923C','F43F5E','A78BFA'],
  house: ['22C55E','F97316','0EA5E9','A3E635','06B6D4','84CC16']
}

// 一组精挑细选的真实房产/室内照片（Unsplash稳定ID）
const REAL_HOUSING_URLS = [
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511', // living room bright
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb', // modern interior
  'https://images.unsplash.com/photo-1501183638710-841dd1904471', // kitchen
  'https://images.unsplash.com/photo-1505691723518-36a5ac3b2c5d', // bedroom
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267', // sofa
  'https://images.unsplash.com/photo-1521783988139-893ce27b15f2', // apartment
  'https://images.unsplash.com/photo-1493666438817-866a91353ca9', // desk
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511', // repeat id ok for seed shuffle
  'https://images.unsplash.com/photo-1505691723518-36a5ac3b2c5d',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb', // bed plant
  'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f', // plant shelf
  'https://images.unsplash.com/photo-1519710164239-da123dc03ef4'  // living cozy
]

function selectFromListBySeed(list, seed) {
  if (!list.length) return ''
  const text = String(seed || '')
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33 + text.charCodeAt(i)) >>> 0
  }
  return list[hash % list.length]
}

/**
 * 常用占位符生成器 - 使用 Picsum 图片
 */
export const placeholders = {
  // 头像占位符
  avatar: (size = 40, name = '头') => `https://picsum.photos/${size}/${size}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 新闻图片占位符
  news: (width = 300, height = 200) => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 广告横幅占位符
  banner: (width = 1200, height = 100, text = '广告横幅') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 二维码占位符
  qrcode: (size = 80, text = 'QR') => `https://picsum.photos/${size}/${size}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 橙色主题占位符
  orange: (width, height, text = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 蓝色主题占位符
  blue: (width, height, text = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 湖蓝色服务占位符 (4:3比例)
  service: (width = 300, height = 225, text = 'Service') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 车辆占位符
  car: (width = 300, height = 200, text = '二手车', key = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 招聘占位符（公司卡/横图）
  job: (width = 300, height = 160, text = '招聘', key = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 招聘-封面横图（更大横幅）
  jobCover: (width = 680, height = 360, text = '职位海报', key = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 招聘-工作环境
  jobEnv: (width = 320, height = 200, text = '工作环境', key = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 招聘-团队合影
  jobTeam: (width = 320, height = 200, text = '团队合影', key = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 招聘-工作现场
  jobSite: (width = 320, height = 200, text = '工作现场', key = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 房源占位符
  house: (width = 300, height = 200, text = '房源', key = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 房源真实图片
  housePhoto: (width = 300, height = 200, seed = '') => `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
  
  // 公司Logo占位符
  logo: (size = 48, text = 'Logo', key = '') => `https://picsum.photos/${size}/${size}?random=${Math.floor(Math.random() * 1000)}`
}

/**
 * 批量替换页面中的占位符图片
 * 自动检测并替换失效的via.placeholder.com图片
 */
export function replacePlaceholderImages() {
  // 使用 requestIdleCallback 在浏览器空闲时执行，避免阻塞主线程
  const processImages = () => {
    const images = document.querySelectorAll('img[src*="via.placeholder.com"]')
    
    images.forEach(img => {
      // 避免重复添加监听器
      if (img.dataset.placeholderHandled) return
      img.dataset.placeholderHandled = 'true'
      
      img.addEventListener('error', () => {
        try {
          // 解析原始URL获取参数
          const url = new URL(img.src)
          const pathParts = url.pathname.split('/')
          const sizePart = pathParts[1] // 例如 "80x80"
          const colorPart = pathParts[2] // 例如 "FF6A00"
          const textColorPart = pathParts[3] // 例如 "FFFFFF"
          const textPart = url.searchParams.get('text') || ''
          
          if (sizePart && sizePart.includes('x')) {
            const [width, height] = sizePart.split('x').map(Number)
            const bgColor = colorPart || 'CCCCCC'
            const textColor = textColorPart || '000000'
            
            // 生成本地占位符
            img.src = generatePlaceholder(width, height, bgColor, textColor, textPart)
          }
        } catch (error) {
          console.warn('Failed to replace placeholder image:', error)
        }
      }, { once: true }) // 只执行一次
    })
  }
  
  if ('requestIdleCallback' in window) {
    requestIdleCallback(processImages, { timeout: 1000 })
  } else {
    setTimeout(processImages, 100)
  }
}

/**
 * 清理占位符缓存
 */
export function clearPlaceholderCache() {
  placeholderCache.clear()
}


