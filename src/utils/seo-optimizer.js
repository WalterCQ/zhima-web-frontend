/**
 * SEO优化工具集合
 * 基于2025年AI搜索优化的最佳实践
 */

// 结构化数据生成器
export class StructuredDataGenerator {
  constructor() {
    this.baseUrl = window.location.origin
  }

  // 生成网站结构化数据
  generateWebsiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "知马网",
      "alternateName": "zhimawang.com",
      "url": this.baseUrl,
      "description": "马来西亚华人信息集散平台，提供资讯、服务、圈子等综合服务",
      "inLanguage": "zh-CN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${this.baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  }

  // 生成文章结构化数据
  generateArticleSchema(article) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.description || article.content,
      "image": article.image || article.cover_image,
      "author": {
        "@type": "Person",
        "name": article.author?.nickname || "匿名用户"
      },
      "publisher": {
        "@type": "Organization",
        "name": "知马网",
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/logo.png`
        }
      },
      "datePublished": article.created_at,
      "dateModified": article.updated_at || article.created_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${this.baseUrl}/news/${article.id}`
      }
    }
  }

  // 生成服务结构化数据
  generateServiceSchema(service) {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": service.title,
      "description": service.description,
      "provider": {
        "@type": "Person",
        "name": service.provider?.name || "服务提供者"
      },
      "areaServed": {
        "@type": "Place",
        "name": service.location || "马来西亚"
      },
      "serviceType": service.category,
      "offers": {
        "@type": "Offer",
        "price": service.price || "面议",
        "priceCurrency": "MYR"
      }
    }
  }

  // 生成面包屑导航
  generateBreadcrumbSchema(breadcrumbs) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
      }))
    }
  }

  // 生成FAQ结构化数据
  generateFAQSchema(faqs) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  }
}

// 元标签管理器
export class MetaTagManager {
  constructor() {
    this.baseTitle = "知马网 - 马来西亚华人信息集散平台"
    this.baseDescription = "知马网是马来西亚华人社区的信息集散平台，提供最新资讯、生活服务、社交圈子等综合服务，让大马华人生活更便利。"
    this.baseKeywords = "马来西亚,华人,资讯,服务,圈子,生活,社交,大马"
  }

  // 设置页面标题
  setTitle(title, includeBase = true) {
    const fullTitle = includeBase ? `${title} - ${this.baseTitle}` : title
    document.title = fullTitle
    
    // 设置Open Graph标题
    this.setMetaTag('og:title', fullTitle)
    this.setMetaTag('twitter:title', fullTitle)
  }

  // 设置页面描述
  setDescription(description) {
    this.setMetaTag('description', description)
    this.setMetaTag('og:description', description)
    this.setMetaTag('twitter:description', description)
  }

  // 设置关键词
  setKeywords(keywords) {
    this.setMetaTag('keywords', keywords)
  }

  // 设置图片
  setImage(imageUrl) {
    this.setMetaTag('og:image', imageUrl)
    this.setMetaTag('twitter:image', imageUrl)
  }

  // 设置URL
  setUrl(url) {
    this.setMetaTag('og:url', url)
    this.setMetaTag('canonical', url)
  }

  // 设置作者
  setAuthor(author) {
    this.setMetaTag('author', author)
  }

  // 设置发布时间
  setPublishedTime(date) {
    this.setMetaTag('article:published_time', date)
  }

  // 设置修改时间
  setModifiedTime(date) {
    this.setMetaTag('article:modified_time', date)
  }

  // 设置标签
  setTags(tags) {
    if (Array.isArray(tags)) {
      tags.forEach(tag => {
        this.addMetaTag('article:tag', tag)
      })
    }
  }

  // 设置语言
  setLanguage(lang = 'zh-CN') {
    this.setMetaTag('language', lang)
    document.documentElement.lang = lang
  }

  // 设置robots
  setRobots(content) {
    this.setMetaTag('robots', content)
  }

  // 内部方法：设置meta标签
  setMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`) || 
               document.querySelector(`meta[property="${name}"]`)
    
    if (!meta) {
      meta = document.createElement('meta')
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        meta.setAttribute('property', name)
      } else {
        meta.setAttribute('name', name)
      }
      document.head.appendChild(meta)
    }
    
    meta.setAttribute('content', content)
  }

  // 内部方法：添加meta标签（不覆盖现有）
  addMetaTag(name, content) {
    const meta = document.createElement('meta')
    if (name.startsWith('og:') || name.startsWith('twitter:')) {
      meta.setAttribute('property', name)
    } else {
      meta.setAttribute('name', name)
    }
    meta.setAttribute('content', content)
    document.head.appendChild(meta)
  }

  // 清理特定类型的meta标签
  clearMetaTags(type) {
    const selectors = [
      `meta[name="${type}"]`,
      `meta[property="${type}"]`,
      `meta[name="article:${type}"]`,
      `meta[property="article:${type}"]`
    ]
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(el => el.remove())
    })
  }
}

// 关键词优化器
export class KeywordOptimizer {
  constructor() {
    this.stopWords = ['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']
  }

  // 提取关键词
  extractKeywords(text, maxCount = 10) {
    if (!text) return []
    
    // 移除HTML标签
    const cleanText = text.replace(/<[^>]*>/g, '')
    
    // 分词（简单的中文分词）
    const words = cleanText
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1 && !this.stopWords.includes(word))
    
    // 统计词频
    const wordCount = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    // 按频率排序并返回前N个
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, maxCount)
      .map(([word]) => word)
  }

  // 生成关键词密度分析
  analyzeKeywordDensity(text, keywords) {
    const cleanText = text.replace(/<[^>]*>/g, '').toLowerCase()
    const totalWords = cleanText.split(/\s+/).length
    
    return keywords.map(keyword => {
      const regex = new RegExp(keyword.toLowerCase(), 'g')
      const matches = cleanText.match(regex) || []
      const density = (matches.length / totalWords) * 100
      
      return {
        keyword,
        count: matches.length,
        density: Math.round(density * 100) / 100
      }
    })
  }

  // 优化关键词密度
  optimizeKeywordDensity(text, targetKeyword, targetDensity = 2) {
    const analysis = this.analyzeKeywordDensity(text, [targetKeyword])
    const currentDensity = analysis[0]?.density || 0
    
    if (currentDensity < targetDensity) {
      // 关键词密度不足，建议增加
      const neededCount = Math.ceil((targetDensity * text.length) / 100) - analysis[0].count
      return {
        suggestion: `建议在内容中增加"${targetKeyword}"关键词约${neededCount}次`,
        currentDensity,
        targetDensity
      }
    } else if (currentDensity > targetDensity * 2) {
      // 关键词密度过高，建议减少
      return {
        suggestion: `关键词"${targetKeyword}"密度过高，建议适当减少使用`,
        currentDensity,
        targetDensity
      }
    }
    
    return {
      suggestion: '关键词密度适中',
      currentDensity,
      targetDensity
    }
  }
}

// 内容质量评估器
export class ContentQualityAssessor {
  constructor() {
    this.minWordCount = 300 // 最小字数
    this.idealWordCount = 800 // 理想字数
  }

  // 评估内容质量
  assessContent(content) {
    const wordCount = this.getWordCount(content)
    const readabilityScore = this.calculateReadability(content)
    const keywordScore = this.assessKeywordUsage(content)
    const structureScore = this.assessStructure(content)
    
    const overallScore = (
      this.getWordCountScore(wordCount) * 0.3 +
      readabilityScore * 0.3 +
      keywordScore * 0.2 +
      structureScore * 0.2
    )
    
    return {
      overallScore: Math.round(overallScore),
      wordCount,
      readabilityScore,
      keywordScore,
      structureScore,
      suggestions: this.generateSuggestions(wordCount, readabilityScore, keywordScore, structureScore)
    }
  }

  // 获取字数
  getWordCount(content) {
    return content.replace(/<[^>]*>/g, '').length
  }

  // 计算可读性分数
  calculateReadability(content) {
    const cleanContent = content.replace(/<[^>]*>/g, '')
    const sentences = cleanContent.split(/[。！？.!?]/).filter(s => s.trim().length > 0)
    const words = cleanContent.split(/\s+/).filter(w => w.length > 0)
    
    if (sentences.length === 0) return 0
    
    const avgWordsPerSentence = words.length / sentences.length
    const avgCharsPerWord = cleanContent.length / words.length
    
    // 简单的可读性评分
    let score = 100
    if (avgWordsPerSentence > 20) score -= 20
    if (avgWordsPerSentence > 30) score -= 20
    if (avgCharsPerWord > 2.5) score -= 10
    
    return Math.max(0, Math.min(100, score))
  }

  // 评估关键词使用
  assessKeywordUsage(content) {
    // 简化版本，实际应该结合关键词分析
    const hasHeadings = /<h[1-6]>/i.test(content)
    const hasLists = /<[uo]l>/i.test(content)
    const hasImages = /<img/i.test(content)
    
    let score = 50
    if (hasHeadings) score += 20
    if (hasLists) score += 15
    if (hasImages) score += 15
    
    return Math.min(100, score)
  }

  // 评估结构
  assessStructure(content) {
    const hasTitle = /<h1>/i.test(content)
    const hasSubheadings = /<h[2-6]>/i.test(content)
    const hasParagraphs = /<p>/i.test(content)
    const hasLists = /<[uo]l>/i.test(content)
    
    let score = 0
    if (hasTitle) score += 30
    if (hasSubheadings) score += 25
    if (hasParagraphs) score += 25
    if (hasLists) score += 20
    
    return Math.min(100, score)
  }

  // 获取字数分数
  getWordCountScore(wordCount) {
    if (wordCount < this.minWordCount) {
      return Math.max(0, (wordCount / this.minWordCount) * 50)
    } else if (wordCount <= this.idealWordCount) {
      return 50 + ((wordCount - this.minWordCount) / (this.idealWordCount - this.minWordCount)) * 50
    } else {
      return Math.max(50, 100 - ((wordCount - this.idealWordCount) / this.idealWordCount) * 20)
    }
  }

  // 生成建议
  generateSuggestions(wordCount, readability, keyword, structure) {
    const suggestions = []
    
    if (wordCount < this.minWordCount) {
      suggestions.push(`内容字数不足，建议增加到至少${this.minWordCount}字`)
    }
    
    if (readability < 60) {
      suggestions.push('内容可读性较低，建议使用更简洁的句子')
    }
    
    if (keyword < 60) {
      suggestions.push('建议添加更多结构化元素，如标题、列表等')
    }
    
    if (structure < 60) {
      suggestions.push('内容结构需要优化，建议添加标题和段落')
    }
    
    return suggestions
  }
}

// 导出默认实例
export const structuredDataGenerator = new StructuredDataGenerator()
export const metaTagManager = new MetaTagManager()
export const keywordOptimizer = new KeywordOptimizer()
export const contentQualityAssessor = new ContentQualityAssessor()
