# 二维码功能

前端二维码组件用于把链接渲染为二维码，并支持扫码统计。

## 核心文件

- 组件: `src/components/QRCodeImage.vue`
- 组合式函数: `src/composables/useQRCode`
- 依赖: `qrcode`

## 基础使用

```vue
<template>
  <QRCodeImage url="https://www.zhimawang.com" />
</template>

<script setup>
import QRCodeImage from '@/components/QRCodeImage.vue'
</script>
```

## 常见场景

- 页脚二维码
- 微信/WhatsApp 联系入口
- 活动页面跳转
- 带 `qrcodeId` 的扫码统计

## 注意

二维码应只保存目标链接和展示配置。不要把敏感 token 放进二维码 URL。
