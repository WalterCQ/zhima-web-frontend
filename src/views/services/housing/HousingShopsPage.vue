<template>
  <div class="list-page">
    <div class="container">
      <nav class="breadcrumbs">
        <router-link to="/services">知马同城</router-link>
        <span class="sep">></span>
        <span class="current">商业地产</span>
        <span v-if="$route.query.cat" class="sep">></span>
        <span v-if="$route.query.cat" class="current">{{ String($route.query.cat) }}</span>
      </nav>

      <div class="filters">
        <!-- 位置：按区域/按地铁 -->
        <div class="filter-row">
          <span class="filter-label">位置：</span>
          <div class="seg">
            <button class="seg-btn" :class="{active: regionMode==='district'}" @click="setRegionMode('district')">按区域找</button>
            <button class="seg-btn" :class="{active: regionMode==='subway'}" @click="setRegionMode('subway')">按地铁找</button>
          </div>
          <template v-if="regionMode==='district'">
            <button class="filter-chip" :class="{active: !district}" @click="setDistrict('')">全部</button>
            <button class="filter-chip" v-for="d in districts" :key="d" :class="{active: district===d}" @click="setDistrict(d)">{{ d }}</button>
          </template>
          <template v-else>
            <span class="subtle">地铁筛选暂未接入</span>
          </template>
        </div>

        <!-- 类型：标准写字楼/产业园/整栋/联合办公 -->
        <div class="filter-row">
          <span class="filter-label">类型：</span>
          <button class="filter-chip" :class="{active: !bizType}" @click="setBizType('')">全部</button>
          <button class="filter-chip" v-for="t in bizTypes" :key="t" :class="{active: bizType===t}" @click="setBizType(t)">{{ t }}</button>
        </div>

        <!-- 价格模式切换 -->
        <div class="filter-row">
          <span class="filter-label">价格：</span>
          <div class="seg">
            <button class="seg-btn" :class="{active: priceMode==='unit'}" @click="setPriceMode('unit')">按单价(元/m²/天)</button>
            <button class="seg-btn" :class="{active: priceMode==='total'}" @click="setPriceMode('total')">按总价(万元/月)</button>
          </div>
        </div>
        <div class="filter-row">
          <span class="filter-label"></span>
          <button class="filter-chip" :class="{active: !price}" @click="setPrice('')">全部</button>
          <button class="filter-chip" v-for="p in shownPrices" :key="p" :class="{active: price===p}" @click="setPrice(p)">{{ p }}</button>
        </div>

        <!-- 面积 -->
        <div class="filter-row">
          <span class="filter-label">面积：</span>
          <button class="filter-chip" :class="{active: !size}" @click="setSize('')">全部</button>
          <button class="filter-chip" v-for="s in sizes" :key="s" :class="{active: size===s}" @click="setSize(s)">{{ s }}</button>
        </div>

        <!-- 装修 -->
        <div class="filter-row">
          <span class="filter-label">装修：</span>
          <button class="filter-chip" :class="{active: !decorate}" @click="setDecor('')">全部</button>
          <button class="filter-chip" v-for="d in decorates" :key="d" :class="{active: decorate===d}" @click="setDecor(d)">{{ d }}</button>
        </div>

        <!-- 类别（沿用原有大类） -->
        <div class="filter-row">
          <span class="filter-label">类别：</span>
          <button class="filter-chip" :class="{active: cat==='商铺出租'}" @click="setCat('商铺出租')">商铺出租</button>
          <button class="filter-chip" :class="{active: cat==='商铺出售'}" @click="setCat('商铺出售')">商铺出售</button>
          <button class="filter-chip" :class="{active: cat==='生意转让'}" @click="setCat('生意转让')">生意转让</button>
          <button class="filter-chip" :class="{active: cat==='实勘铺源'}" @click="setCat('实勘铺源')">实勘铺源</button>
          <button class="filter-chip" :class="{active: cat==='写字楼出租'}" @click="setCat('写字楼出租')">写字楼出租</button>
          <button class="filter-chip" :class="{active: cat==='写字楼出售'}" @click="setCat('写字楼出售')">写字楼出售</button>
          <button class="filter-chip" :class="{active: cat==='办公楼盘'}" @click="setCat('办公楼盘')">办公楼盘</button>
          <button class="filter-chip" :class="{active: cat==='联合办公'}" @click="setCat('联合办公')">联合办公</button>
          <button class="filter-chip" :class="{active: cat==='厂房'}" @click="setCat('厂房')">厂房</button>
          <button class="filter-chip" :class="{active: cat==='仓库'}" @click="setCat('仓库')">仓库</button>
          <button class="filter-chip" :class="{active: cat==='土地'}" @click="setCat('土地')">土地</button>
          <button class="filter-chip" :class="{active: cat==='车位'}" @click="setCat('车位')">车位</button>
        </div>
      </div>

      <div class="items">
        <div v-for="it in displayed" :key="it.id" class="biz-item" @click="goDetail(it.id)">
          <div class="thumb-wrap">
            <img :src="it.cover" class="thumb" loading="lazy" />
            <span class="badge" v-if="it.brand">品牌直驻</span>
          </div>
          <div class="main">
            <h3 class="title">{{ it.title }}</h3>
            <div class="subline">{{ it.district }} · {{ it.block }} | {{ it.address }} | 距离地铁{{ it.subway }}</div>
            <div class="meta-line">{{ it.areaMin }} - {{ it.areaMax }}㎡ | {{ it.rooms }}套可租房源</div>
            <div class="sizes">
              <span class="size-chip" v-for="s in it.sizeChips" :key="s">{{ s }}㎡</span>
              <span class="size-more">更多</span>
            </div>
          </div>
          <div class="aside">
            <div class="price-main"><span class="num">{{ it.unitPrice }}</span><span class="unit">元/㎡/天</span></div>
            <div class="sale" v-if="it.salePrice">售价: {{ it.salePrice }}元/㎡</div>
            <div class="r-tags">
              <span class="rtag" v-for="t in it.tags" :key="t">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const cat = ref(String(route.query.cat || ''))
const areas = ['市中心','商圈','地铁口','社区底商']
const districts = ['朝阳','海淀','昌平','丰台','通州','西城','东城','石景山','房山','顺义']
const regionMode = ref('district')
const district = ref('')
const bizTypes = ['标准写字楼','产业园','整栋','联合办公']
const bizType = ref('')
const priceMode = ref('unit')
const price = ref('')
const pricesUnit = ['小于3元','3-4元','4-5元','5-7元','7-9元','9-12元','大于12元']
const pricesTotal = ['小于3万','3-4万','4-5万','5-7万','7-9万','9-12万','大于12万']
const shownPrices = computed(()=> priceMode.value==='unit' ? pricesUnit : pricesTotal)
const sizes = ['0-100㎡','100-300㎡','300-500㎡','500-1000㎡','1000㎡以上']
const size = ref('')
const decorates = ['豪华装修','精装修','简单位装','毛坯']
const decorate = ref('')

watch(() => route.query, (q) => { cat.value = String(q.cat || '') })
const setCat = (v) => { cat.value = v; router.replace({ query: { ...route.query, cat: v } }) }
const setRegionMode = (m)=>{ regionMode.value = m }
const setDistrict = (d)=>{ district.value = d }
const setBizType = (t)=>{ bizType.value = t }
const setPriceMode = (m)=>{ priceMode.value = m; price.value='' }
const setPrice = (p)=>{ price.value = p }
const setSize = (s)=>{ size.value = s }
const setDecor = (d)=>{ decorate.value = d }

const goDetail = (i) => {
  // 使用服务详情页，类型标记为 biz（商业地产）
  router.push({ name: 'ServiceDetail', params: { id: i }, query: { type: 'biz' } })
}

// Mock 列表结合筛选
const list = computed(()=>{
  return Array.from({ length: 12 }).map((_, i)=>{
    const d = districts[i % districts.length]
    return {
      id: i+1,
      title: ['富力运河十号','世界侨商中心','保利大都汇','环球金融港','中关村e谷'][i%5],
      cover: `https://picsum.photos/seed/biz-${i}/260/180`,
      district: d,
      block: ['新华大街','运河商务区','高教园','望京街区'][i%4],
      address: `${d}某路${100+i}号`,
      subway: `${[3,5,6,10][i%4]}号线·${['北运河西','北运河东','望京','国贸'][i%4]}`,
      area: areas[i%areas.length],
      bizType: bizTypes[i%bizTypes.length],
      decorate: decorates[i%decorates.length],
      price: [3600,4200,5600,6800][i%4],
      unitPrice: [1.5,2,1.8,2.2][i%4],
      salePrice: [4500,null,5200,null][i%4],
      areaMin: [54,89,113,150][i%4],
      areaMax: [2000,10000,10000,1500][i%4],
      rooms: [100,120,80,60][i%4],
      sizeChips: [[54,55,60,70],[89,100,133,134],[113,144.9,145,150],[120,160,200,260]][i%4],
      tags: ['标准写字楼','近地铁','5A写字楼'].slice(0, 1 + (i%3)),
      brand: i%3===0
    }
  })
})

const filtered = computed(()=> list.value.filter(it=>{
  if (district.value && !/./.test(it.area)) {}
  if (bizType.value && it.bizType !== bizType.value) return false
  if (size.value && size.value.includes('1000') && !(iSize(it) >= 1000)) {}
  if (decorate.value && it.decorate !== decorate.value) return false
  // 价格筛选为UI展示，mock不做严格数值过滤
  return true
}))
const displayed = computed(()=> filtered.value)

const iSize = (it)=>{
  // 仅示例：无真实字段，返回分组基准
  const idx = Number(String(it.id)) % 5
  return [60, 180, 360, 680, 1200][idx]
}
</script>

<style scoped>
.list-page { background: #fff; min-height: 60vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 16px; }
.breadcrumbs { color: #777; font-size: 13px; padding: 8px 0 6px; }
.breadcrumbs a { color: #576b95; text-decoration: none; }
.breadcrumbs .sep { margin: 0 6px; color: #bbb; }
.breadcrumbs .current { color: #333; font-weight: 600; }
.filters { border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
.filter-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.filter-label { color: #666; }
.filter-chip { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 13px; }
.filter-chip.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }
.seg { display: inline-flex; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
.seg-btn { padding: 6px 10px; border: none; background: #fff; cursor: pointer; font-size: 13px; }
.seg-btn.active { background: #fff7f1; color: #ff6a00; }
.subtle { color: #999; font-size: 12px; }
.items { display: grid; grid-template-columns: 1fr; gap: 12px; }
.biz-item { display: grid; grid-template-columns: 260px 1fr 160px; gap: 14px; align-items: center; border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; cursor: pointer; }
.biz-item:hover { box-shadow: 0 4px 14px rgba(0,0,0,.06); }
.thumb-wrap { position: relative; }
.thumb { width: 260px; height: 180px; object-fit: cover; border-radius: 6px; }
.badge { position: absolute; left: 8px; top: 8px; background: #0aa1ff; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
.main { min-width: 0; }
.title { margin: 0 0 6px 0; font-size: 20px; color: #333; }
.subline { color: #666; font-size: 13px; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.meta-line { color: #999; font-size: 13px; margin-bottom: 8px; }
.sizes { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.size-chip { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; font-size: 13px; color: #333; }
.size-more { padding: 6px 10px; border: 1px dashed #ffd5bf; color: #ff6a00; background: #fff7f1; border-radius: 16px; font-size: 13px; }
.aside { text-align: right; }
.price-main { color: #e55a00; font-weight: 700; font-size: 24px; }
.price-main .num { margin-right: 4px; }
.price-main .unit { font-size: 12px; color: #999; }
.sale { color: #999; font-size: 12px; margin-top: 4px; }
.r-tags { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; margin-top: 8px; }
.rtag { display: inline-block; padding: 2px 8px; background: #fff; color: #666; border: 1px solid #eee; border-radius: 10px; font-size: 12px; }
.price { color: #e55a00; font-weight: 700; font-size: 18px; }
</style>

