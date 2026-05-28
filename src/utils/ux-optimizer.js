/**
 * 用户体验优化工具集合
 * 基于2025年UX最佳实践的用户体验优化方案
 */

// 无障碍访问优化器
export class AccessibilityOptimizer {
  constructor() {
    this.focusVisibleClass = 'focus-visible'
    this.init()
  }

  init() {
    this.addFocusVisibleStyles()
    this.setupKeyboardNavigation()
    this.setupScreenReaderSupport()
  }

  // 添加焦点可见样式
  addFocusVisibleStyles() {
    const style = document.createElement('style')
    style.textContent = `
      .focus-visible {
        outline: 2px solid #ff6a00 !important;
        outline-offset: 2px !important;
      }
      
      .focus-visible:focus {
        outline: 2px solid #ff6a00 !important;
        outline-offset: 2px !important;
      }
      
      /* 移除默认焦点样式 */
      *:focus:not(.focus-visible) {
        outline: none !important;
      }
    `
    document.head.appendChild(style)
  }

  // 设置键盘导航
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Tab键导航
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation')
      }
    })

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation')
    })

    // 跳过链接
    this.createSkipLinks()
  }

  // 创建跳过链接
  createSkipLinks() {
    const skipLinks = [
      { href: '#main-content', text: '跳转到主要内容' },
      { href: '#navigation', text: '跳转到导航' },
      { href: '#search', text: '跳转到搜索' }
    ]

    const skipContainer = document.createElement('div')
    skipContainer.className = 'skip-links'
    skipContainer.innerHTML = skipLinks.map(link => 
      `<a href="${link.href}" class="skip-link">${link.text}</a>`
    ).join('')

    // 添加样式
    const style = document.createElement('style')
    style.textContent = `
      .skip-links {
        position: absolute;
        top: -40px;
        left: 0;
        z-index: 1000;
      }
      
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #ff6a00;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        font-weight: bold;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 6px;
      }
    `
    document.head.appendChild(style)
    document.body.insertBefore(skipContainer, document.body.firstChild)
  }

  // 设置屏幕阅读器支持
  setupScreenReaderSupport() {
    // 添加屏幕阅读器专用文本
    this.addScreenReaderText()
    
    // 设置ARIA标签
    this.setupAriaLabels()
  }

  // 添加屏幕阅读器专用文本
  addScreenReaderText() {
    const srOnlyStyle = document.createElement('style')
    srOnlyStyle.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `
    document.head.appendChild(srOnlyStyle)
  }

  // 设置ARIA标签
  setupAriaLabels() {
    // 为按钮添加aria-label
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
      if (!button.textContent.trim() && !button.querySelector('img, svg')) {
        button.setAttribute('aria-label', '按钮')
      }
    })

    // 为图片添加alt属性
    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.setAttribute('alt', '图片')
    })
  }

  // 检查颜色对比度
  checkColorContrast(foreground, background) {
    // 简化的对比度检查
    const getLuminance = (color) => {
      const rgb = color.match(/\d+/g)
      if (!rgb) return 0
      
      const [r, g, b] = rgb.map(c => {
        c = parseInt(c) / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const contrast = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    
    return {
      ratio: contrast,
      level: contrast >= 7 ? 'AAA' : contrast >= 4.5 ? 'AA' : 'Fail'
    }
  }
}

// 加载状态管理器
export class LoadingStateManager {
  constructor() {
    this.loadingStates = new Map()
    this.skeletonTemplates = new Map()
  }

  // 显示加载状态
  showLoading(element, type = 'default') {
    const id = this.generateId()
    this.loadingStates.set(id, { element, type, startTime: Date.now() })
    
    this.addLoadingOverlay(element, type)
    return id
  }

  // 隐藏加载状态
  hideLoading(id) {
    const state = this.loadingStates.get(id)
    if (state) {
      this.removeLoadingOverlay(state.element)
      this.loadingStates.delete(id)
    }
  }

  // 添加加载遮罩
  addLoadingOverlay(element, type) {
    const overlay = document.createElement('div')
    overlay.className = `loading-overlay loading-${type}`
    overlay.innerHTML = this.getLoadingTemplate(type)
    
    element.style.position = 'relative'
    element.appendChild(overlay)
  }

  // 移除加载遮罩
  removeLoadingOverlay(element) {
    const overlay = element.querySelector('.loading-overlay')
    if (overlay) {
      overlay.remove()
    }
  }

  // 获取加载模板
  getLoadingTemplate(type) {
    const templates = {
      default: '<div class="spinner"></div>',
      skeleton: '<div class="skeleton"></div>',
      pulse: '<div class="pulse"></div>',
      dots: '<div class="dots"><span></span><span></span><span></span></div>'
    }
    
    return templates[type] || templates.default
  }

  // 生成唯一ID
  generateId() {
    return 'loading_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // 添加加载样式
  addLoadingStyles() {
    const style = document.createElement('style')
    style.textContent = `
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #ff6a00;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .skeleton {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
      }
      
      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      .dots {
        display: flex;
        gap: 4px;
      }
      
      .dots span {
        width: 8px;
        height: 8px;
        background: #ff6a00;
        border-radius: 50%;
        animation: dots-bounce 1.4s infinite ease-in-out both;
      }
      
      .dots span:nth-child(1) { animation-delay: -0.32s; }
      .dots span:nth-child(2) { animation-delay: -0.16s; }
      
      @keyframes dots-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `
    document.head.appendChild(style)
  }
}

// 错误处理优化器
export class ErrorHandler {
  constructor() {
    this.errorBoundary = null
    this.setupGlobalErrorHandling()
  }

  // 设置全局错误处理
  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'JavaScript Error')
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection')
    })
  }

  // 处理错误
  handleError(error, type) {
    console.error(`[${type}]`, error)
    
    // 发送错误报告（可选）
    this.reportError(error, type)
    
    // 显示用户友好的错误信息
    this.showUserFriendlyError(error)
  }

  // 显示用户友好的错误信息
  showUserFriendlyError(error) {
    const errorMessage = this.getErrorMessage(error)
    this.showNotification(errorMessage, 'error')
  }

  // 获取错误信息
  getErrorMessage(error) {
    if (typeof error === 'string') {
      return error
    }
    
    if (error.message) {
      return error.message
    }
    
    return '发生了未知错误，请稍后重试'
  }

  // 显示通知
  showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    
    // 添加样式
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style')
      style.id = 'notification-styles'
      style.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          z-index: 10000;
          animation: slideIn 0.3s ease-out;
        }
        
        .notification-error { background: #e74c3c; }
        .notification-warning { background: #f39c12; }
        .notification-success { background: #27ae60; }
        .notification-info { background: #3498db; }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `
      document.head.appendChild(style)
    }
    
    document.body.appendChild(notification)
    
    // 自动移除
    setTimeout(() => {
      notification.remove()
    }, 5000)
  }

  // 报告错误（可选）
  reportError(error, type) {
    // 这里可以发送错误到服务器
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ error: error.message, type, stack: error.stack })
    // })
  }
}

// 交互反馈优化器
export class InteractionFeedback {
  constructor() {
    this.setupHoverEffects()
    this.setupClickEffects()
    this.setupFormValidation()
  }

  // 设置悬停效果
  setupHoverEffects() {
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches('button, a, [role="button"]')) {
        e.target.classList.add('hover-effect')
      }
    })

    document.addEventListener('mouseout', (e) => {
      if (e.target.matches('button, a, [role="button"]')) {
        e.target.classList.remove('hover-effect')
      }
    })
  }

  // 设置点击效果
  setupClickEffects() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, a, [role="button"]')) {
        this.addClickEffect(e.target)
      }
    })
  }

  // 添加点击效果
  addClickEffect(element) {
    element.classList.add('click-effect')
    setTimeout(() => {
      element.classList.remove('click-effect')
    }, 200)
  }

  // 设置表单验证
  setupFormValidation() {
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.validateField(e.target)
      }
    })

    document.addEventListener('blur', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.validateField(e.target)
      }
    })
  }

  // 验证字段
  validateField(field) {
    const value = field.value.trim()
    const type = field.type
    const required = field.hasAttribute('required')
    
    let isValid = true
    let message = ''

    if (required && !value) {
      isValid = false
      message = '此字段为必填项'
    } else if (type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false
      message = '请输入有效的邮箱地址'
    } else if (type === 'tel' && value && !this.isValidPhone(value)) {
      isValid = false
      message = '请输入有效的电话号码'
    }

    this.showFieldValidation(field, isValid, message)
  }

  // 显示字段验证结果
  showFieldValidation(field, isValid, message) {
    const existingFeedback = field.parentNode.querySelector('.field-feedback')
    if (existingFeedback) {
      existingFeedback.remove()
    }

    if (!isValid) {
      const feedback = document.createElement('div')
      feedback.className = 'field-feedback field-error'
      feedback.textContent = message
      field.parentNode.appendChild(feedback)
    }

    field.classList.toggle('field-invalid', !isValid)
    field.classList.toggle('field-valid', isValid && field.value.trim())
  }

  // 验证邮箱
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // 验证电话
  isValidPhone(phone) {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10
  }

  // 添加交互样式
  addInteractionStyles() {
    const style = document.createElement('style')
    style.textContent = `
      .hover-effect {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
      }
      
      .click-effect {
        transform: scale(0.95);
        transition: transform 0.1s ease;
      }
      
      .field-invalid {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
      }
      
      .field-valid {
        border-color: #27ae60 !important;
        box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2) !important;
      }
      
      .field-feedback {
        font-size: 12px;
        margin-top: 4px;
        padding: 4px 8px;
        border-radius: 4px;
      }
      
      .field-error {
        color: #e74c3c;
        background: rgba(231, 76, 60, 0.1);
      }
    `
    document.head.appendChild(style)
  }
}

// 导出默认实例
export const accessibilityOptimizer = new AccessibilityOptimizer()
export const loadingStateManager = new LoadingStateManager()
export const errorHandler = new ErrorHandler()
export const interactionFeedback = new InteractionFeedback()
