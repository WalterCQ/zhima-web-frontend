#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🐎 知马网项目快速设置脚本');
console.log('================================');

// 检查Node.js版本
const nodeVersion = process.version;
console.log(`📦 Node.js版本: ${nodeVersion}`);

if (parseInt(nodeVersion.slice(1)) < 16) {
  console.error('❌ 需要Node.js 16或更高版本');
  process.exit(1);
}

// 创建环境变量文件
if (!fs.existsSync('.env')) {
  console.log('📝 创建环境变量文件...');
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ .env文件已创建');
}

// 检查依赖安装
console.log('📦 检查依赖包...');
try {
  if (!fs.existsSync('node_modules')) {
    console.log('🔄 安装项目依赖...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ 依赖安装完成');
  } else {
    console.log('✅ 依赖已安装');
  }
} catch (error) {
  console.error('❌ 依赖安装失败:', error.message);
  process.exit(1);
}

// 创建必要的目录
const dirs = [
  'src/assets/images',
  'src/assets/icons',
  'public/uploads',
  'logs'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 创建目录: ${dir}`);
  }
});

// 显示启动信息
console.log('\n🚀 设置完成！');
console.log('================================');
console.log('📋 可用命令:');
console.log('  npm run dev     - 启动开发服务器');
console.log('  npm run build   - 构建生产版本');
console.log('  npm run preview - 预览生产版本');
console.log('  npm run lint    - 代码检查');
console.log('\n🌐 开发服务器: http://localhost:3000');
console.log('📚 项目文档: README.md');
console.log('🔗 API文档: docs/API-Requirements.md');
console.log('\n💡 提示: 确保后端服务运行在 http://localhost:8080');
console.log('🐎 知马网 - 马来西亚华人信息集散平台');

