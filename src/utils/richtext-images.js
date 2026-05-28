// 富文本图片相关工具（无外部依赖）

/**
 * 从富文本 HTML 中提取图片的 objectKey 列表
 * 规则：img[data-object-key]
 */
export function extractImageKeysFromHtml(html) {
  if (!html) return []
  const doc = new DOMParser().parseFromString(String(html), 'text/html')
  return Array.from(doc.querySelectorAll('img[data-object-key]'))
    .map(img => img.getAttribute('data-object-key'))
    .filter(Boolean)
}

/**
 * 将文章详情中的 images 数组映射为初始图片清单
 * 期望 detail.images: [{ pictureId, pictureUrl }]
 */
export function collectInitialImagesFromDetail(detail) {
  const images = (detail && Array.isArray(detail.images)) ? detail.images : []
  return images.map(img => ({ pictureId: img.pictureId, pictureUrl: img.pictureUrl }))
}

/**
 * 计算 PUT /api/articles/{id} 的图片差异
 * - 删除：初始存在但当前 HTML 中已不存在的旧图（data-picture-id 不在文中了）
 * - 替换：replacementMap 中的项（imageId -> newCdnUrl）
 * - 新增：当前 HTML 中无 data-picture-id 的 img，且在 uploadCache 中登记有 cdnUrl
 *
 * @param {Object} params
 * @param {{pictureId:number,pictureUrl:string}[]} params.initialImages
 * @param {string} params.currentHtml
 * @param {Map<string|number,string>} params.replacementMap - imageId -> newCdnUrl
 * @param {Map<string,string>} params.uploadCache - img.src -> cdnUrl
 */
export function computePutDiff({ initialImages, currentHtml, replacementMap, uploadCache }) {
  const doc = new DOMParser().parseFromString(String(currentHtml || ''), 'text/html')
  const currentOldIds = new Set(
    Array.from(doc.querySelectorAll('img[data-picture-id]'))
      .map(img => Number(img.getAttribute('data-picture-id')))
      .filter(id => !Number.isNaN(id))
  )

  const imageReplacements = []

  // 删除：初始有但现已不在文中
  for (const img of (initialImages || [])) {
    if (!currentOldIds.has(img.pictureId)) {
      imageReplacements.push({ imageId: img.pictureId, newImageUrl: '' })
    }
  }

  // 替换：用户在同节点替换
  if (replacementMap && typeof replacementMap.forEach === 'function') {
    replacementMap.forEach((newCdnUrl, imageId) => {
      imageReplacements.push({ imageId: Number(imageId), newImageUrl: newCdnUrl })
    })
  }

  // 新增：无 picture-id 的 img，取其在 uploadCache 中登记的 cdnUrl
  const imageUrlsToAdd = Array.from(doc.querySelectorAll('img:not([data-picture-id])'))
    .map(img => uploadCache && uploadCache.get(img.getAttribute('src')))
    .filter(Boolean)

  return { imageUrlsToAdd, imageReplacements }
}

/**
 * 轻量图片压缩：按最大宽高与质量压缩，返回 Blob
 */
export function compressImage(file, { maxW = 1920, maxH = 1920, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * ratio)
        canvas.height = Math.round(img.height * ratio)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url)
          resolve(blob || file)
        }, 'image/jpeg', quality)
      }
      img.onerror = (e) => {
        URL.revokeObjectURL(url)
        resolve(file)
      }
      img.src = url
    } catch (e) {
      resolve(file)
    }
  })
}


