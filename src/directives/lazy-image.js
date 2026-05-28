// 图片懒加载指令
export const lazyImage = {
  mounted(el, binding) {
    const imageUrl = binding.value
    const options = binding.arg || {}
    
    // 创建 Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          
          // 创建新的图片对象预加载
          const newImg = new Image()
          
          // 显示加载状态
          img.classList.add('lazy-loading')
          
          newImg.onload = () => {
            // 检查是否支持 WebP
            if (supportsWebP() && !imageUrl.includes('.webp')) {
              const webpUrl = convertToWebP(imageUrl)
              if (webpUrl !== imageUrl) {
                // 尝试加载 WebP 版本
                const webpImg = new Image()
                webpImg.onload = () => {
                  img.src = webpUrl
                  img.classList.remove('lazy-loading')
                  img.classList.add('lazy-loaded')
                }
                webpImg.onerror = () => {
                  // WebP 加载失败，使用原图
                  img.src = imageUrl
                  img.classList.remove('lazy-loading')
                  img.classList.add('lazy-loaded')
                }
                webpImg.src = webpUrl
                return
              }
            }
            
            img.src = imageUrl
            img.classList.remove('lazy-loading')
            img.classList.add('lazy-loaded')
          }
          
          newImg.onerror = () => {
            img.classList.remove('lazy-loading')
            img.classList.add('lazy-error')
            // 使用占位图
            img.src = 'data:image/svg+xml,' + encodeURIComponent(`
              <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">加载失败</text>
              </svg>
            `)
          }
          
          newImg.src = imageUrl
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px', // 提前 50px 开始加载
      threshold: 0.1,
      ...options
    })
    
    // 设置初始占位图
    el.src = el.src || 'data:image/svg+xml,' + encodeURIComponent(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6c757d">加载中...</text>
      </svg>
    `)
    
    observer.observe(el)
    
    // 存储 observer 以便清理
    el._lazy_observer = observer
  },
  
  unmounted(el) {
    if (el._lazy_observer) {
      el._lazy_observer.disconnect()
    }
  }
}

// 检查浏览器是否支持 WebP
function supportsWebP() {
  if (supportsWebP.result !== undefined) {
    return supportsWebP.result
  }
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const dataUrl = canvas.toDataURL('image/webp')
  supportsWebP.result = dataUrl.indexOf('data:image/webp') === 0
  return supportsWebP.result
}

// 将图片 URL 转换为 WebP 格式
function convertToWebP(url) {
  // 如果是相对路径或本地图片，尝试替换扩展名
  if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
    const lastDotIndex = url.lastIndexOf('.')
    if (lastDotIndex > -1) {
      const extension = url.substring(lastDotIndex + 1).toLowerCase()
      if (['jpg', 'jpeg', 'png'].includes(extension)) {
        return url.substring(0, lastDotIndex) + '.webp'
      }
    }
  }
  
  // 外部图片或不支持的格式，返回原 URL
  return url
}

// CSS 样式
export const lazyImageStyles = `
.lazy-loading {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.lazy-loaded {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.lazy-error {
  opacity: 0.5;
  filter: grayscale(100%);
}

img[v-lazy-image] {
  transition: opacity 0.3s ease;
}
`
