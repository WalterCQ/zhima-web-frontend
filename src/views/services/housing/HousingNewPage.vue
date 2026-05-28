<template>
  <div class="list-page">
    <div class="container">
      <div class="header">
        <h2 class="title">新房</h2>
        <div class="summary">示例占位页，后续接入在售/本月开盘/即将开盘等标签</div>
      </div>
      <div class="empty-state">
        <div class="empty-title">即将上线</div>
        <div class="empty-desc">敬请期待</div>
        <router-link class="btn" :to="{ name: 'HousingHome' }">返回房产首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.list-page { background: #fff; min-height: 60vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 16px; }
.header { padding: 8px 0 12px; border-bottom: 1px solid #f1f3f5; margin-bottom: 12px; }
.title { margin: 0; font-size: 20px; color: #333; }
.summary { color: #777; font-size: 13px; margin-top: 4px; }
.empty-state { border: 1px dashed #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; color: #667085; background: #fafafa; }
.empty-title { font-size: 16px; color: #333; font-weight: 600; }
.empty-desc { font-size: 13px; margin-top: 6px; }
.btn { display: inline-block; margin-top: 12px; padding: 8px 14px; background: #ff6b35; color: #fff; border-radius: 8px; text-decoration: none; }
</style>



