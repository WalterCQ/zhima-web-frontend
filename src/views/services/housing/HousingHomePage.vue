<template>
  <div class="housing-home">
    <!-- 顶部大图与城市名 -->
    <div class="hero">
      <div class="hero-bg"></div>
      <div class="hero-inner">
        <div class="city-text">{{ cityName }}</div>
      </div>
    </div>

    <div class="container">
      <!-- 四大入口 -->
      <div class="entry-grid">
        <div class="entry-card">
          <div class="entry-head">
            <img class="entry-img" :src="placeholders.housePhoto(300,160,'租房-home')" alt="租房" loading="lazy" @error="onImgError($event, '租房')">
            <div class="entry-title">租房</div>
            <router-link class="entry-more" :to="{ name: 'RentList' }">查看全部</router-link>
          </div>
          <div class="entry-tags">
            <button v-for="t in rentTags1" :key="t" class="tag" @click="goRent(t)">{{ t }}</button>
          </div>
          <div class="entry-tags">
            <button v-for="t in rentTags2" :key="t" class="tag" @click="goRent(t)">{{ t }}</button>
          </div>
          <div class="entry-tags">
            <button v-for="t in rentTags3" :key="t" class="tag" @click="goRent(t)">{{ t }}</button>
          </div>
          <router-link class="entry-bottom" :to="{ name: 'RentList' }">全部租房源 ▶</router-link>
        </div>

        <div class="entry-card">
          <div class="entry-head">
            <img class="entry-img" :src="placeholders.housePhoto(300,160,'二手房-home')" alt="二手房" loading="lazy" @error="onImgError($event, '二手房')">
            <div class="entry-title">二手房</div>
            <router-link class="entry-more" :to="{ name: 'HousingSecondhand' }">查看全部</router-link>
          </div>
          <div class="entry-tags">
            <button v-for="t in secondTags1" :key="t" class="tag" @click="goSecond(t)">{{ t }}</button>
          </div>
          <div class="entry-tags">
            <button v-for="t in secondTags2" :key="t" class="tag" @click="goSecond(t)">{{ t }}</button>
          </div>
          <div class="entry-tags">
            <button v-for="t in secondTags3" :key="t" class="tag" @click="goSecond(t)">{{ t }}</button>
          </div>
          <router-link class="entry-bottom" :to="{ name: 'HousingSecondhand' }">全部二手房源 ▶</router-link>
        </div>

        <div class="entry-card">
          <div class="entry-head">
            <img class="entry-img" :src="placeholders.housePhoto(300,160,'商业地产-home')" alt="商业地产" loading="lazy" @error="onImgError($event, '商业地产')">
            <div class="entry-title">商业地产</div>
            <router-link class="entry-more" :to="{ name: 'HousingShops' }">查看全部</router-link>
          </div>
          <div class="entry-tags">
            <button v-for="t in bizTags1" :key="t" class="tag" @click="goShops(t)">{{ t }}</button>
          </div>
          <div class="entry-tags">
            <button v-for="t in bizTags2" :key="t" class="tag" @click="goShops(t)">{{ t }}</button>
          </div>
          <div class="entry-tags">
            <button v-for="t in bizTags3" :key="t" class="tag" @click="goShops(t)">{{ t }}</button>
          </div>
          <router-link class="entry-bottom" :to="{ name: 'HousingShops' }">全部商业地产 ▶</router-link>
        </div>

        <div class="entry-card">
          <div class="entry-head">
            <img class="entry-img" :src="placeholders.housePhoto(300,160,'新房-home')" alt="新房" loading="lazy" @error="onImgError($event, '新房')">
            <div class="entry-title">新房</div>
            <router-link class="entry-more" :to="{ name: 'HousingNew' }">查看全部</router-link>
          </div>
          <div class="entry-tags">
            <button v-for="t in newTags1" :key="t" class="tag" @click="goNew(t)">{{ t }}</button>
          </div>
          <div class="entry-tags">
            <button v-for="t in newTags2" :key="t" class="tag" @click="goNew(t)">{{ t }}</button>
          </div>
          <div class="entry-tags">
            <button v-for="t in newTags3" :key="t" class="tag" @click="goNew(t)">{{ t }}</button>
          </div>
          <router-link class="entry-bottom" :to="{ name: 'HousingNew' }">全部新房房源 ▶</router-link>
        </div>
      </div>

      
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { placeholders } from '@/utils/placeholder'

const route = useRoute()
const router = useRouter()

const cityName = computed(() => String(route.query.city || '本地'))

const rentTags1 = ['公寓','临近地铁','整租']
const rentTags2 = ['合租','个人房源','押一付一']
const rentTags3 = ['朝南']

const secondTags1 = ['小户型','精装两居','小三居']
const secondTags2 = ['准新房','精装修','南北通透']
const secondTags3 = ['低总价','带电梯','别墅']

const bizTags1 = ['商铺出租','商铺出售','生意转让']
const bizTags2 = ['写字楼出租','联合办公','写字楼出售']
const bizTags3 = ['商业街','厂房仓库','数据服务']

const newTags1 = ['在售楼盘','本月开盘','即将开盘']
const newTags2 = ['全部楼盘','特惠好房','近期已开']
const newTags3 = ['精装修','优选户型']

// 已移除底部宣传卡片

const goRent = () => router.push({ name: 'RentList' })
const goSecond = () => router.push({ name: 'HousingSecondhand' })
const goShops = () => router.push({ name: 'HousingShops' })
const goNew = () => router.push({ name: 'HousingNew' })

// 图片兜底：若远端加载失败，退回到纯色占位
const onImgError = (e, text) => {
  try {
    const img = e?.target
    if (img) img.src = placeholders.house(300,160, String(text||'房源'))
  } catch(_) {}
}
</script>

<style scoped>
.housing-home { background: #fff; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 16px; }

.hero { position: relative; height: 200px; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; background: url('/bg.svg') center/cover no-repeat, linear-gradient(180deg,#111 0%,#444 100%); opacity: .35; }
.hero-inner { position: relative; height: 100%; display: flex; align-items: center; justify-content: center; }
.city-text { font-size: 72px; font-weight: 800; color: #fff; text-shadow: 0 6px 22px rgba(0,0,0,.35); letter-spacing: 8px; }

.entry-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: -40px; }
.entry-card { background: #fff; border: 1px solid #f1f3f5; border-radius: 12px; padding: 12px; padding-bottom: 44px; box-shadow: 0 8px 26px rgba(0,0,0,.06); position: relative; }
.entry-head { position: relative; }
.entry-img { width: 100%; height: 140px; object-fit: cover; border-radius: 8px; background: #f6f7f9; }
.entry-title { position: absolute; left: 12px; top: 10px; background: rgba(255,255,255,.9); color: #333; font-weight: 700; padding: 4px 10px; border-radius: 999px; font-size: 16px; backdrop-filter: blur(2px); }
.entry-more { position: absolute; right: 12px; top: 10px; background: rgba(0,0,0,.55); color: #fff; padding: 4px 8px; border-radius: 999px; font-size: 12px; text-decoration: none; }
.entry-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.tag { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 13px; color: #333; }
.tag:hover { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }
.entry-bottom { position: absolute; left: 12px; bottom: 12px; display: inline-block; color: #999; font-size: 12px; text-decoration: none; }
.entry-bottom:hover { color: #ff6a00; }

/* 已移除 promo 样式 */

@media (max-width: 1024px) {
  .entry-grid, .promo-grid { grid-template-columns: repeat(2, 1fr); }
  .city-text { font-size: 48px; }
}
@media (max-width: 640px) {
  .entry-grid, .promo-grid { grid-template-columns: 1fr; }
}
</style>



