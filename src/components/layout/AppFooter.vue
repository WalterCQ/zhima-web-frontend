<template>
  <footer class="app-footer">
    <!-- 主要内容区域 -->
    <div class="footer-main">
      <div class="container">
        <div class="footer-content">
          <!-- 品牌介绍区域 -->
          <div class="footer-section brand-section">
            <div class="brand-info">
              <div class="brand-logo">
                <img src="/logo.png" alt="知马网" class="logo-img">
                <h3 class="brand-name">知马网</h3>
              </div>
              <p class="brand-desc">马来西亚华人信息与生活平台<br>找资讯，找工作，找房子，就上知马网！</p>
              <div class="qr-codes">
                <div class="qr-item">
                  <div class="qr-code">
                    <img src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%23FF6A00'/%3E%3Ctext x='90' y='110' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='72' font-weight='bold' fill='%23FFFFFF'%3EQR%3C/text%3E%3C/svg%3E" alt="WeChat 二维码">
                  </div>
                  <span>WeChat 社群</span>
                </div>
                <div class="qr-item">
                  <div class="qr-code">
                    <img src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%23FF6A00'/%3E%3Ctext x='90' y='110' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='72' font-weight='bold' fill='%23FFFFFF'%3EQR%3C/text%3E%3C/svg%3E" alt="手机APP">
                  </div>
                  <span>手机APP</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 服务导航 -->
          <div class="footer-section">
            <h3 class="section-title">平台服务</h3>
            <ul class="footer-links">
              <li><router-link to="/news">新闻资讯</router-link></li>
              <li><router-link to="/services">知马同城</router-link></li>
              <li><router-link to="/circles">知马圈</router-link></li>
              <li><router-link :to="{ path: '/circles', query: { group: 'study' } }">留学圈</router-link></li>
            </ul>
          </div>


          <!-- 联系我们 -->
          <div class="footer-section contact-section">
            <h3 class="section-title">联系我们</h3>
            <div class="contact-info">
              <div class="contact-item">
                <i class="icon-phone"></i>
                <span>电话：+60 12 345 6789</span>
              </div>
              <div class="contact-item">
                <i class="icon-email"></i>
                <span>邮箱：info@zhimawang.my</span>
              </div>
              <div class="contact-item">
                <i class="icon-time"></i>
                <span>时间：周一至周五 9:00-18:00</span>
              </div>
              <div class="contact-item">
                <i class="icon-location"></i>
                <span>地址：马来西亚吉隆坡市中心商务区</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部版权信息 -->
    <div class="footer-bottom">
      <div class="container">
        <div class="bottom-content">
          <div class="bottom-links">
            <span>© 2025 知马网 (zhimawang.my) - 马来西亚华人信息集散平台</span>
          </div>
          <div class="copyright-info">
            <div class="copyright-text">
              <span>免责声明：本平台仅为信息发布与交流平台，所涉服务由第三方提供，平台不直接提供第一方服务。</span>
            </div>
            <div class="tech-support">
              <span>技术支持：MagicByte</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  background: url('/bg.svg') no-repeat center top;
  background-size: 100%;
  background-position: center 55px;
  margin-top: var(--spacing-xxl);
  position: relative;
  overflow: hidden;
  min-height: 750px;
  /* 性能优化：添加 content-visibility 和 containment */
  content-visibility: auto;
  contain: layout style paint;
}

.app-footer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  pointer-events: none;
  z-index: 1;
}

/* 主要内容区域 */
.footer-main {
  background: transparent;
  padding: 180px 0 200px;
  position: relative;
  z-index: 2;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 60px;
  align-items: start;
  justify-items: center;
}

.footer-section {
  position: relative;
}

/* 品牌区域样式 - 性能优化版 */
.brand-section {
  padding: 0;
  text-align: center;
}


.brand-info {
  color: #000;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.logo-img {
  width: 45px;
  height: 45px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.brand-name {
  color: #FF6A00;
  font-size: 28px;
  font-weight: 400;
  margin: 0;
  font-family: 'YouSheBiaoTiHei', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  font-synthesis: none;
  letter-spacing: 0.5px;
}

.brand-desc {
  color: #000;
  font-size: 15px;
  line-height: 1.4;
  margin-bottom: 30px;
  font-weight: 500;
}

/* 二维码样式 */
.qr-codes {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.qr-item {
  text-align: center;
}

.qr-code {
  width: 90px;
  height: 90px;
  border: 2px solid rgba(255, 106, 0, 0.4);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.25), 
    0 4px 12px rgba(255, 106, 0, 0.15),
    0 0 0 1px rgba(255, 106, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  will-change: transform;
}

.qr-code::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(45deg, 
    rgba(255, 106, 0, 0.6), 
    rgba(255, 140, 51, 0.4), 
    rgba(255, 106, 0, 0.5));
  border-radius: 18px;
  z-index: -1;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  filter: blur(2px);
}

.qr-code:hover {
  transform: translate3d(0, -5px, 0) scale(1.08);
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.35), 
    0 8px 20px rgba(255, 106, 0, 0.25),
    0 0 24px rgba(255, 106, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 106, 0, 0.6);
}

.qr-code:hover::before {
  opacity: 1;
  filter: blur(1px);
}

.qr-code img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qr-item span {
  font-size: 12px;
  color: #000;
  font-weight: 400;
  display: block;
}

/* 其他区域样式 - 简化版 */
.footer-section:not(.brand-section) {
  padding: 0;
  text-align: center;
}


/* 标题样式 */
.section-title {
  color: #000;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 10px;
  white-space: nowrap;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: var(--primary-color);
  border-radius: 1px;
}

/* 链接列表 */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
  white-space: nowrap;
}

.footer-links a {
  color: #000;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.4;
  transition: color 0.2s ease;
  display: inline-block;
  font-weight: 500;
  padding: 4px 8px;
  white-space: nowrap;
}

.footer-links a:hover {
  color: var(--primary-color);
}

/* 联系信息 */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  align-items: center;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  color: #000;
  line-height: 1.4;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.2s ease;
  width: 100%;
  white-space: nowrap;
}

.contact-item:hover {
  color: var(--primary-color);
}

.contact-item span {
  background: none !important;
  border: none !important;
  box-shadow: none !important;
}

.contact-item i {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: var(--primary-color);
  border-radius: 4px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  position: relative;
}

.contact-item:hover i {
  transform: scale(1.1);
}

.contact-item i::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
}

.icon-phone::before { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.27 1.11l-2.2 2.2z'/%3E%3C/svg%3E") center/12px no-repeat; }
.icon-email::before { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm16 3.38V6H4v1.38l8 4 8-4z'/%3E%3C/svg%3E") center/12px no-repeat; }
.icon-time::before { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M12 2a10 10 0 1010 10A10 10 0 0012 2zm4.24 7.76L12 14l-4.24-4.24a1 1 0 011.41-1.41L12 11.17l2.83-2.82a1 1 0 011.41 1.41z'/%3E%3C/svg%3E") center/12px no-repeat; }
.icon-location::before { background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M12 2a8 8 0 00-8 8c0 5.25 7.09 11.65 7.39 11.93a1 1 0 001.22 0C12.91 21.65 20 15.25 20 10a8 8 0 00-8-8zm0 11a3 3 0 113-3 3 3 0 01-3 3z'/%3E%3C/svg%3E") center/12px no-repeat; }

/* 底部版权信息区域 - 2025年增强版 */
.footer-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.6) 0%, 
    rgba(255, 106, 0, 0.12) 25%, 
    rgba(0, 0, 0, 0.55) 50%, 
    rgba(255, 106, 0, 0.08) 75%, 
    rgba(0, 0, 0, 0.6) 100%);
  backdrop-filter: blur(18px) saturate(1.3);
  padding: 16px 0;
  z-index: 3;
  border-top: 1px solid rgba(255, 106, 0, 0.25);
  box-shadow: 
    0 -6px 24px rgba(0, 0, 0, 0.4), 
    0 -2px 8px rgba(255, 106, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.bottom-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bottom-links {
  text-align: center;
}

.bottom-links a,
.bottom-links span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}

.bottom-links a:hover {
  color: white;
  text-decoration: underline;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
  transform: translate3d(0, 0, 0) scale(1.05);
}

.bottom-links .divider {
  margin: 0 6px;
  color: rgba(255, 255, 255, 0.5);
}

.copyright-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copyright-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.tech-support {
  text-align: center;
}

.tech-support span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* 响应式设计 */

/* 超大屏幕优化 (1400px+) */
@media (min-width: 1400px) {
  .container {
    max-width: 1400px;
  }
  
  .footer-content {
    gap: 80px;
  }
  
  .brand-name {
    font-size: 32px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .qr-code {
    width: 100px;
    height: 100px;
  }
  
  .app-footer {
    background-position: center 55px;
  }
}

/* 大屏幕优化 (1200px-1399px) */
@media (min-width: 1200px) and (max-width: 1399px) {
  .footer-content {
    gap: 70px;
  }
  
  .brand-name {
    font-size: 30px;
  }
  
  .qr-code {
    width: 95px;
    height: 95px;
  }
  
  .app-footer {
    background-position: center 160px;
  }
}

/* 中等大屏幕 (1025px-1199px) */
@media (min-width: 1025px) and (max-width: 1199px) {
  .footer-content {
    gap: 50px;
  }
  
  .brand-name {
    font-size: 26px;
  }
  
  .qr-code {
    width: 85px;
    height: 85px;
  }
  
  .app-footer {
    background-position: center 235px;
  }
}

/* 平板横屏和小桌面 (769px-1024px) */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 45px;
    grid-template-areas: 
      "brand services"
      "contact contact";
  }
  
  .brand-section { 
    grid-area: brand; 
    padding: 28px 20px;
    text-align: center;
  }
  
  .brand-logo {
    justify-content: center;
  }
  
  .footer-section:nth-child(2) { 
    grid-area: services; 
    text-align: center;
  }
  
  .footer-section:nth-child(3) { 
    grid-area: contact; 
    text-align: center;
  }
  
  .footer-main {
    padding: 120px 0 160px;
  }
  
  .qr-code {
    width: 80px;
    height: 80px;
  }
  
  .brand-name {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 17px;
  }
  
  .brand-desc {
    font-size: 14px;
  }
  
  .app-footer {
    background-position: center 480px;
  }
}

/* 平板竖屏和大手机 (481px-768px) */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 38px;
    grid-template-areas: none;
  }
  
  .footer-main {
    padding: 90px 0 130px;
  }
  
  .container {
    padding: 0 24px;
  }
  
  .brand-section {
    text-align: center;
    padding: 24px 18px;
    padding-right: 0;
  }
  
  .brand-logo {
    justify-content: center;
  }
  
  .brand-name {
    font-size: 22px;
  }
  
  .brand-desc {
    font-size: 13px;
    margin-bottom: 25px;
  }
  
  .qr-codes {
    justify-content: center;
    gap: 24px;
  }
  
  .qr-code {
    width: 75px;
    height: 75px;
  }
  
  .qr-item span {
    font-size: 11px;
  }
  
  .section-title {
    font-size: 17px;
    text-align: center;
    margin-bottom: 22px;
  }
  
  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-links {
    text-align: center;
  }
  
  .footer-links a {
    font-size: 13px;
  }
  
  .contact-info {
    align-items: center;
  }
  
  .contact-item {
    font-size: 13px;
    justify-content: center;
  }
  
  .footer-section:not(.brand-section) {
    padding: 26px 20px;
    text-align: center;
  }
  
  .app-footer {
    background-position: center 360px;
  }
}

/* 小手机 (320px-480px) */
@media (max-width: 480px) {
  .footer-main {
    padding: 70px 0 110px;
  }
  
  .container {
    padding: 0 16px;
  }
  
  .footer-content {
    gap: 32px;
  }
  
  .brand-section {
    padding: 20px 16px;
    text-align: center;
  }
  
  .brand-logo {
    justify-content: center;
  }
  
  .brand-name {
    font-size: 20px;
  }
  
  .brand-desc {
    font-size: 12px;
    margin-bottom: 20px;
    line-height: 1.3;
  }
  
  .qr-codes {
    gap: 20px;
    justify-content: center;
  }
  
  .qr-code {
    width: 65px;
    height: 65px;
  }
  
  .qr-item span {
    font-size: 10px;
  }
  
  .section-title {
    font-size: 16px;
    margin-bottom: 18px;
    text-align: center;
  }
  
  .section-title::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-links {
    text-align: center;
  }
  
  .footer-links li {
    margin-bottom: 10px;
  }
  
  .footer-links a {
    font-size: 12px;
    padding: 3px 6px;
  }
  
  .contact-info {
    align-items: center;
  }
  
  .contact-item {
    font-size: 12px;
    justify-content: center;
    padding: 6px 0;
  }
  
  .contact-item i {
    width: 18px;
    height: 18px;
  }
  
  .footer-section:not(.brand-section) {
    padding: 22px 16px;
    text-align: center;
  }
  
  .footer-bottom {
    padding: 18px 0;
  }
  
  .bottom-links a,
  .bottom-links span {
    font-size: 11px;
    margin: 0 2px;
  }
  
  .copyright-text {
    font-size: 10px;
    line-height: 1.5;
  }
  
  .tech-support span {
    font-size: 10px;
  }
  
  .app-footer {
    background-position: center 100px;
  }
}

/* 超小屏幕 (280px-320px) */
@media (max-width: 320px) {
  .container {
    padding: 0 12px;
  }
  
  .footer-content {
    gap: 28px;
  }
  
  .brand-section {
    padding: 16px 12px;
  }
  
  .brand-name {
    font-size: 18px;
  }
  
  .brand-desc {
    font-size: 11px;
    margin-bottom: 18px;
  }
  
  .qr-code {
    width: 60px;
    height: 60px;
  }
  
  .qr-item span {
    font-size: 9px;
  }
  
  .section-title {
    font-size: 15px;
    margin-bottom: 16px;
  }
  
  .footer-links a {
    font-size: 11px;
  }
  
  .contact-item {
    font-size: 11px;
  }
  
  .contact-item i {
    width: 16px;
    height: 16px;
  }
  
  .footer-section:not(.brand-section) {
    padding: 18px 12px;
  }
  
  .footer-main {
    padding: 60px 0 100px;
  }
  
  .app-footer {
    background-position: center 120px;
  }
}

/* 横屏适配 */
@media (max-height: 600px) and (orientation: landscape) {
  .footer-main {
    padding: 60px 0 80px;
  }
  
  .footer-content {
    gap: 30px;
  }
  
  .brand-desc {
    margin-bottom: 20px;
  }
  
  .qr-code {
    width: 70px;
    height: 70px;
  }
  
  .app-footer {
    background-position: center 20px;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .logo-img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
  
  .qr-code img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* 打印样式 */
@media print {
  .app-footer {
    background: none !important;
    min-height: auto;
    margin-top: 0;
  }
  
  .footer-main {
    padding: 20px 0;
    background: white;
  }
  
  .footer-content {
    display: block;
  }
  
  .footer-section {
    margin-bottom: 20px;
    break-inside: avoid;
  }
  
  .qr-codes {
    display: none;
  }
  
  .footer-bottom {
    position: static;
    background: white;
    border-top: 1px solid #ccc;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .brand-info,
  .section-title,
  .footer-links a,
  .contact-item {
    color: #e0e0e0;
  }
  
  .brand-name {
    color: #ff8c42;
  }
  
  .footer-links a:hover,
  .contact-item:hover {
    color: #ff8c42;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .qr-code,
  .contact-item i,
  .footer-links a {
    transition: none;
  }
  
  .qr-code:hover {
    transform: none;
  }
}
</style>
