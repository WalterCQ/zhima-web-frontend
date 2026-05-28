#!/usr/bin/env node

// 生成一张简洁的新闻占位图 JPG: 1200x675，深灰背景+“NEWS”大字+副标题
// 依赖: jimp

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Jimp from 'jimp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generate() {
  const width = 1200
  const height = 900 // 4:3 比例
  const outputDir = path.resolve(__dirname, '..', 'public')
  const outputPath = path.join(outputDir, 'placeholder-news.jpg')

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const bgColor = 0x0b1a33ff // 藏青色
  const textColor = 0xffffffff

  const image = new Jimp(width, height, bgColor)

  const fontTitle = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE)

  const title = 'NEWS'

  image.print(
    fontTitle,
    0,
    0,
    {
      text: title,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    },
    width,
    height
  )

  await image.quality(85).writeAsync(outputPath)
  console.log(`✅ 已生成: ${outputPath}`)
}

generate().catch((err) => {
  console.error('❌ 生成占位图失败:', err)
  process.exit(1)
})


