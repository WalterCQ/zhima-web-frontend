// 生成1:1占位图片的工具函数
export function generateSquarePlaceholder(text, bgColor = '#FF6B35', textColor = '#FFFFFF', size = 200) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = size
  canvas.height = size
  
  // 背景色
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)
  
  // 文字
  ctx.fillStyle = textColor
  ctx.font = `bold ${size * 0.2}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  // 绘制文字
  ctx.fillText(text, size / 2, size / 2)
  
  return canvas.toDataURL('image/png')
}

// 预定义的占位图片
export const placeholderImages = {
  // 生活圈
  life: generateSquarePlaceholder('圈子', '#FF6B35', '#FFFFFF'),
  culture: generateSquarePlaceholder('圈子', '#FF6B35', '#FFFFFF'),
  fashion: generateSquarePlaceholder('圈子', '#FF6B35', '#FFFFFF'),
  daily: generateSquarePlaceholder('圈子', '#FF6B35', '#FFFFFF'),
  food: generateSquarePlaceholder('圈子', '#FF6B35', '#FFFFFF'),
  fitness: generateSquarePlaceholder('圈子', '#FF6B35', '#FFFFFF'),
  emotion: generateSquarePlaceholder('圈子', '#FF6B35', '#FFFFFF'),
  travel: generateSquarePlaceholder('圈子', '#FF6B35', '#FFFFFF'),
  tech: generateSquarePlaceholder('圈子', '#FF6B35', '#FFFFFF'),
  
  // 留学圈 - 马来西亚大学简称
  um: generateSquarePlaceholder('UM', '#FF6B35', '#FFFFFF'),
  xmum: generateSquarePlaceholder('XMUM', '#FF6B35', '#FFFFFF'),
  usm: generateSquarePlaceholder('USM', '#FF6B35', '#FFFFFF'),
  ukm: generateSquarePlaceholder('UKM', '#FF6B35', '#FFFFFF'),
  upm: generateSquarePlaceholder('UPM', '#FF6B35', '#FFFFFF'),
  utm: generateSquarePlaceholder('UTM', '#FF6B35', '#FFFFFF'),
  utp: generateSquarePlaceholder('UTP', '#FF6B35', '#FFFFFF'),
  mmu: generateSquarePlaceholder('MMU', '#FF6B35', '#FFFFFF'),
  taylor: generateSquarePlaceholder('TAYLOR', '#FF6B35', '#FFFFFF'),
  sunway: generateSquarePlaceholder('SUNWAY', '#FF6B35', '#FFFFFF'),
  utar: generateSquarePlaceholder('UTAR', '#FF6B35', '#FFFFFF'),
  inti: generateSquarePlaceholder('INTI', '#FF6B35', '#FFFFFF'),
  help: generateSquarePlaceholder('HELP', '#FF6B35', '#FFFFFF'),
  apu: generateSquarePlaceholder('APU', '#FF6B35', '#FFFFFF'),
  limkokwing: generateSquarePlaceholder('LKW', '#FF6B35', '#FFFFFF'),
  curtin: generateSquarePlaceholder('CURTIN', '#FF6B35', '#FFFFFF'),
  monash: generateSquarePlaceholder('MONASH', '#FF6B35', '#FFFFFF'),
  nottingham: generateSquarePlaceholder('UNM', '#FF6B35', '#FFFFFF'),
  heriot: generateSquarePlaceholder('HWU', '#FF6B35', '#FFFFFF'),
  segi: generateSquarePlaceholder('SEGI', '#FF6B35', '#FFFFFF'),
  kdu: generateSquarePlaceholder('KDU', '#FF6B35', '#FFFFFF'),
  
  // 投资圈
  stocks: generateSquarePlaceholder('股票', '#FF6B35', '#FFFFFF'),
  crypto: generateSquarePlaceholder('加密币', '#FF6B35', '#FFFFFF'),
  property: generateSquarePlaceholder('房产', '#FF6B35', '#FFFFFF'),
  forex: generateSquarePlaceholder('外汇', '#FF6B35', '#FFFFFF'),
  fund: generateSquarePlaceholder('基金', '#FF6B35', '#FFFFFF'),
  gold: generateSquarePlaceholder('黄金', '#FF6B35', '#FFFFFF'),
  bond: generateSquarePlaceholder('债券', '#FF6B35', '#FFFFFF'),
  startup: generateSquarePlaceholder('创业', '#FF6B35', '#FFFFFF'),
  etf: generateSquarePlaceholder('ETF', '#FF6B35', '#FFFFFF')
}
