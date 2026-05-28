#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 需要修复的文件
const filesToFix = [
  'src/views/HomePage.vue',
  'src/components/layout/AppFooter.vue'
];

// 占位符替换映射
const placeholderReplacements = {
  // 头像占位符 - 使用简单的彩色背景
  'https://via.placeholder.com/40x40/FF6A00/FFFFFF?text=J': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGRjZBMDAiLz4KPHRleHQgeD0iMjAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5KPC90ZXh0Pgo8L3N2Zz4K',
  'https://via.placeholder.com/40x40/0066CC/FFFFFF?text=梦': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiMwMDY2Q0MiLz4KPHRleHQgeD0iMjAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7moaY8L3RleHQ+Cjwvc3ZnPgo=',
  'https://via.placeholder.com/40x40/FF6600/FFFFFF?text=青': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGRjY2MDAiLz4KPHRleHQgeD0iMjAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7pnZI8L3RleHQ+Cjwvc3ZnPgo=',
  'https://via.placeholder.com/40x40/CC6600/FFFFFF?text=泰': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNDQzY2MDAiLz4KPHRleHQgeD0iMjAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7ms7A8L3RleHQ+Cjwvc3ZnPgo=',
  'https://via.placeholder.com/40x40/6600CC/FFFFFF?text=王': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiM2NjAwQ0MiLz4KPHRleHQgeD0iMjAiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7njovwn5GRIDwvdGV4dD4KPC9zdmc+Cg==',
  
  // 二维码占位符
  'https://via.placeholder.com/80x80/FF6A00/FFFFFF?text=微信': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iI0ZGNkEwMCIvPgo8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgcng9IjQiIGZpbGw9IiNGRkZGRkYiLz4KPHRleHQgeD0iNDAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkY2QTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lvq7kv6E8L3RleHQ+Cjwvc3ZnPgo=',
  'https://via.placeholder.com/80x80/FF6A00/FFFFFF?text=APP': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iOCIgZmlsbD0iI0ZGNkEwMCIvPgo8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgcng9IjQiIGZpbGw9IiNGRkZGRkYiLz4KPHRleHQgeD0iNDAiIHk9IjQ1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkY2QTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BUFA8L3RleHQ+Cjwvc3ZnPgo=',
  
  // 主要新闻轮播图片
  'https://via.placeholder.com/570x350/0066CC/FFFFFF?text=领导参加重要会议': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTcwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDU3MCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1NzAiIGhlaWdodD0iMzUwIiBmaWxsPSIjMDA2NkNDIi8+Cjx0ZXh0IHg9IjI4NSIgeT0iMTg1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7poIbosoHlj4LliqDph43opoHkvJrkuK48L3RleHQ+Cjwvc3ZnPgo=',
  
  // 广告横幅 - 简化版本
  'https://via.placeholder.com/1200x100/0066CC/FFFFFF?text=6G全球+创造无限可能+千万域名+重金打造': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMDAiIHZpZXdCb3g9IjAgMCAxMjAwIDEwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMDA2NkNDIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjZH5YWo55CDIOWIm+mAoOaXoOmZkOWPr+iDvSDljYPkuIflroflkI0g6YeN6YeR5omT6YCgPC90ZXh0Pgo8L3N2Zz4K',
  'https://via.placeholder.com/1200x80/FF6666/FFFFFF?text=马来西亚第一家华人领先的信托公司+信立加华，共创未来！': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDEyMDAgODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkY2NjY2Ii8+Cjx0ZXh0IHg9IjYwMCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPumprOadpeilvK5ouonnsKHkuIDlrrbljavkurroorbkuJrnmoTkv6Hmiajlhazlj7gg5L+h56uL5Yqg5Y2O77yM5YWx5Yib5pyq5p2lITwvdGV4dD4KPC9zdmc+Cg==',
  'https://via.placeholder.com/1200x120/CC0000/FFFFFF?text=SORYA+店面招租': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSIxMjAiIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjQ0MwMDAwIi8+Cjx0ZXh0IHg9IjYwMCIgeT0iNjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIzMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNPUllBIOW6l+mdouaLm+enuzwvdGV4dD4KPC9zdmc+Cg=='
};

// 批量替换函数
function replaceInFile(filePath) {
  try {
    console.log(`正在处理: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // 遍历所有替换规则
    Object.entries(placeholderReplacements).forEach(([oldUrl, newUrl]) => {
      if (content.includes(oldUrl)) {
        content = content.replace(new RegExp(escapeRegex(oldUrl), 'g'), newUrl);
        hasChanges = true;
        console.log(`  ✓ 替换了占位符: ${oldUrl.substring(0, 50)}...`);
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ 已保存: ${filePath}`);
    } else {
      console.log(`  - 无需替换: ${filePath}`);
    }
  } catch (error) {
    console.error(`  ✗ 处理失败 ${filePath}:`, error.message);
  }
}

// 转义正则表达式特殊字符
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 主执行逻辑
console.log('🔧 开始修复占位符图片...\n');

filesToFix.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    replaceInFile(filePath);
  } else {
    console.log(`⚠️  文件不存在: ${filePath}`);
  }
});

console.log('\n🎉 占位符图片修复完成！');
console.log('\n修复的内容:');
console.log('- 头像占位符 → SVG格式的彩色圆形头像');
console.log('- 二维码占位符 → SVG格式的二维码样式');  
console.log('- 新闻图片占位符 → SVG格式的新闻图片');
console.log('- 广告横幅占位符 → SVG格式的广告横幅');
console.log('\n这些本地生成的SVG图片不依赖外部服务，加载更快更稳定！');


