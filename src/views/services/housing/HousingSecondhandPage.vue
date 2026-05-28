<template>
  <div class="list-page">
    <div class="container">
      <nav class="breadcrumbs">
        <router-link to="/services">知马同城</router-link>
        <span class="sep">></span>
        <router-link to="/housing">房产</router-link>
        <span class="sep">></span>
        <span class="current">二手房</span>
        <span v-if="cat" class="sep">></span>
        <span v-if="cat" class="current">{{ cat }}</span>
      </nav>

      <div class="filters">
        <div class="filter-row subcat-row" :class="{ expanded: !subFolded }">
          <span class="filter-label">{{ currentGroupLabel }}：</span>
          <div class="chips">
            <button class="filter-chip" :class="{active: !cat}" @click="setCat('')">全部</button>
            <button 
              v-for="sub in shownSubcats" 
              :key="sub" 
              class="filter-chip" 
              :class="{active: cat===sub}"
              @click="setCat(sub)"
            >{{ sub }}</button>
          </div>
          <button 
            v-if="(sortedSubcats.length>maxSubShow)" 
            :class="['filter-more','strong',{ expanded: !subFolded }]" 
            @click="toggleSubcats"
          >
            <span class="label">{{ subFolded ? '展开更多' : '收起' }}</span>
            <span class="chev" :class="{ up: !subFolded }">⌄</span>
          </button>
        </div>
        <div class="filter-row">
          <span class="filter-label">地区：</span>
          <button class="filter-chip" :class="{active: area===a}" v-for="a in shownAreas" :key="a" @click="setArea(a)">{{ a }}</button>
          <button 
            v-if="areas.length>maxAreaShow" 
            :class="['filter-more',{ expanded: !areaFolded }]" 
            @click="toggleArea"
          >
            <span class="label">{{ areaFolded ? '展开' : '收起' }}</span>
            <span class="chev" :class="{ up: !areaFolded }">⌄</span>
          </button>
        </div>
        <div class="filter-row">
          <span class="filter-label">价格：</span>
          <button class="filter-chip" :class="{active: price===p}" v-for="p in prices" :key="p" @click="setPrice(p)">{{ p }}</button>
        </div>
        <div class="filter-row">
          <span class="filter-label">来源：</span>
          <button class="filter-chip" :class="{active: sourceType===t}" v-for="t in sourceTypes" :key="t" @click="setSource(t)">{{ t }}</button>
        </div>
      </div>

      <div v-if="displayed.length>0" class="items">
        <div v-for="house in displayed" :key="house.id" class="item" @click="goDetail(house)">
          <img :src="house.logo" class="logo" />
          <div class="content">
            <h3 class="title">{{ house.title }}</h3>
            <div class="meta">
              <span>{{ house.city }}</span>
              <span v-if="house.size"> | {{ house.size }}㎡</span>
              <span v-if="house.room"> | {{ house.room }}</span>
            </div>
            <div class="tags" v-if="house.tags?.length">
              <span v-for="t in house.tags.slice(0,4)" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>
          <div class="price">{{ house.price }}</div>
          <button class="apply-btn" @click.stop>查看</button>
        </div>

        <div class="pagination">
          <button class="page-btn" :disabled="page<=1" @click="prevPage">上一页</button>
          <div class="page-info">
            <span>第 {{ page }} 页</span>
          </div>
          <button class="page-btn" :disabled="!hasMore" @click="nextPage">下一页</button>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-title">暂无房源</div>
        <div class="empty-desc">调整筛选条件试试</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { placeholders } from '@/utils/placeholder'

const router = useRouter()
const route = useRoute()

const areas = ['全马来西亚','柔佛','吉打','吉兰丹','马六甲','森美兰','彭亨','槟城','霹雳','玻璃市','沙巴','砂拉越','雪兰莪','登嘉楼','吉隆坡','纳闽','布城']
const prices = ['不限','<RM200k','RM200k-RM300k','RM300k-RM500k','RM500k-RM800k','RM800k-RM1M','>RM1M']
const sourceTypes = ['不限','个人','经纪人']

const houseGroups = [
  { key: 'huxing', label: '户型' },
  { key: 'tese', label: '特色' },
  { key: 'zhuangxiu', label: '装修' },
  { key: 'chaoxiang', label: '朝向' },
  { key: 'leixing', label: '类型' }
]

const groupSubcats = {
  huxing: ['一居','二居','三居','四居','五居','Loft','别墅'],
  tese: ['近地铁','学区房','满五唯一','低总价','带电梯','随时看房'],
  zhuangxiu: ['毛坯','简装','精装'],
  chaoxiang: ['南北','朝南','朝北','东西'],
  leixing: ['普通住宅','公寓','别墅','商住两用']
}

const group = ref(String(route.query.group || 'huxing'))
const cat = ref(String(route.query.cat || ''))
const area = ref(String(route.query.area || '全马来西亚'))
const price = ref(String(route.query.price || '不限'))
const sourceType = ref(String(route.query.source || '不限'))

const setArea = (v)=>{ area.value=v; pushQuery() }
const setPrice = (v)=>{ price.value=v; pushQuery() }
const setSource = (v)=>{ sourceType.value=v; pushQuery() }
const setGroup = (g)=>{ group.value=g; cat.value=''; pushQuery() }
const setCat = (v)=>{ cat.value=v || ''; pushQuery() }

const pushQuery = ()=>{
  router.replace({ name: 'HousingSecondhand', query: { group: group.value || undefined, cat: cat.value || undefined, area: area.value, price: price.value, source: sourceType.value } })
}

watch(() => route.query, (q)=>{
  group.value = String(q.group || group.value || 'huxing')
  cat.value = String(q.cat || cat.value || '')
  area.value = String(q.area || '全马来西亚')
  price.value = String(q.price || '不限')
  sourceType.value = String(q.source || '不限')
})

const maxSubShow = 10
const subFolded = ref(true)
const commonFirst = (list)=>{
  const common = ['二居','三居','近地铁','精装']
  const set = new Set(common)
  const a = list.filter(i=>set.has(i))
  const b = list.filter(i=>!set.has(i))
  return [...a, ...b]
}
const sortedSubcats = computed(()=> commonFirst(groupSubcats[group.value] || []))
const shownSubcats = computed(()=>{
  const arr = sortedSubcats.value
  if (!arr.length) return []
  return subFolded.value ? arr.slice(0, maxSubShow) : arr
})
const toggleSubcats = ()=>{ subFolded.value = !subFolded.value }

const currentGroupLabel = computed(()=> {
  const m = houseGroups.find(g=>g.key===group.value)
  return m ? m.label : '筛选'
})

// Mock 列表 + 过滤 + 分页
const mockList = computed(()=> {
  const arr = []
  const variants = ['近地铁','学区房','精装','满五唯一','低总价','带电梯','随时看房','Loft','别墅']
  for (let i=0;i<60;i++) {
    const titleCat = cat.value || (groupSubcats[group.value] || ['房源'])[i % (groupSubcats[group.value]?.length || 1)]
    const variant = variants[i % variants.length]
    arr.push({
      id: i+1,
      title: `${titleCat} | 本地优选房源 ${i+1}`,
      city: areas[(i%areas.length)],
      size: [60,78,89,96,110,128][i%6],
      room: ['一居','二居','三居','四居'][i%4],
      price: prices[(i%prices.length) || 1],
      tags: ['近地铁','满五唯一','精装','随时看房'].slice(0, 1 + (i%3)),
      logo: placeholders.housePhoto(140,94, `ershou-${i}-${variant}`)
    })
  }
  return arr
})

const page = ref(1)
const pageSize = ref(10)
const filtered = computed(()=>{
  return mockList.value.filter(v=>{
    if (cat.value && !(`${v.title}`.includes(cat.value))) return false
    if (area.value && area.value !== '全马来西亚' && v.city !== area.value) return false
    if (price.value !== '不限' && v.price !== price.value) return false
    if (sourceType.value !== '不限') return true
    return true
  })
})
const displayed = computed(()=> filtered.value.slice((page.value-1)*pageSize.value, page.value*pageSize.value))
const hasMore = computed(()=> page.value * pageSize.value < filtered.value.length)
const prevPage = ()=>{ if (page.value>1) page.value-- }
const nextPage = ()=>{ if (hasMore.value) page.value++ }

const goDetail = (house)=>{
  router.push({ name: 'ServiceDetail', params: { id: house.id }, query: { type: 'house-secondhand' } })
}

const maxAreaShow = 10
const areaFolded = ref(true)
const shownAreas = computed(()=> areaFolded.value ? areas.slice(0, maxAreaShow) : areas)
const toggleArea = ()=>{ areaFolded.value = !areaFolded.value }
</script>

<style scoped>
.list-page { background: #fff; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 16px; }
.breadcrumbs { color: #777; font-size: 13px; padding: 8px 0 6px; }
.breadcrumbs a { color: #576b95; text-decoration: none; }
.breadcrumbs .sep { margin: 0 6px; color: #bbb; }
.breadcrumbs .current { color: #333; font-weight: 600; }
.filters { border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
.filter-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.subcat-row { align-items: flex-start; flex-wrap: nowrap; }
.subcat-row .chips { display: inline-flex; flex-wrap: nowrap; gap: 8px; overflow: hidden; max-height: 36px; white-space: nowrap; }
.subcat-row.expanded .chips { flex-wrap: wrap; max-height: none; }
.filter-label { color: #666; width: auto; flex: 0 0 auto; white-space: nowrap; margin-right: 6px; }
.filter-chip { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 13px; }
.filter-chip.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }
.filter-more { display: inline-flex; align-items: center; gap: 4px; padding: 0; border: none; background: transparent; cursor: pointer; font-size: 13px; color: #ff6a00; }
.filter-more .chev { display: inline-block; transform: rotate(0deg); transition: transform .2s ease; font-size: 12px; color: #ff6a00; }
.filter-more .chev.up { transform: rotate(180deg); }
.filter-more.strong { border: none; background: transparent; color: #ff6a00; }
.filter-more.expanded { border: none; background: transparent; color: #ff6a00; }
.items { display: grid; grid-template-columns: 1fr; gap: 12px; }
.item { display: grid; grid-template-columns: 48px 1fr auto auto; gap: 12px; align-items: center; border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; cursor: pointer; }
.item:hover { box-shadow: 0 4px 14px rgba(0,0,0,.06); }
.logo { width: 48px; height: 48px; border-radius: 10px; object-fit: cover; }
.title { margin: 0 0 6px 0; font-size: 16px; color: #333; }
.meta { color: #9aa0a6; font-size: 12px; }
.tags { display: flex; gap: 8px; margin-top: 6px; }
.tag { background: #f6f7f9; color: #666; border: 1px solid #eee; border-radius: 10px; padding: 2px 8px; font-size: 12px; }
.price { color: #e55a00; font-weight: 700; font-size: 18px; }
.apply-btn { background: #ff6a00; color: #fff; border: none; border-radius: 6px; padding: 8px 12px; cursor: pointer; }
.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px 0; }
.page-btn { padding: 8px 12px; border: 1px solid #f1f3f5; background: #fff; border-radius: 8px; cursor: pointer; }
.page-btn:disabled { color: #999; cursor: not-allowed; }
.page-info { color: #777; font-size: 13px; }
.empty-state { border: 1px dashed #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; color: #667085; background: #fafafa; }
.empty-title { font-size: 16px; color: #333; font-weight: 600; }
.empty-desc { font-size: 13px; margin-top: 6px; }
</style>


