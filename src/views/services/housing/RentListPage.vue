<template>
  <div class="list-page">
    <div class="container">
      
      <div class="content-layout">
        <div class="main">
      <nav class="breadcrumbs jobs-style">
        <router-link to="/services">知马同城</router-link>
        <span class="sep">></span>
        <router-link to="/rent">租房</router-link>
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
          <span class="filter-label">区域：</span>
          <button class="filter-chip" :class="{active: area===a}" v-for="a in shownAreas" :key="a" @click="setArea(a)">{{ a }}</button>
          <button 
            v-if="areas.length>maxAreaShow" 
            :class="['filter-more','btn-ghost',{ expanded: !areaFolded }]" 
            @click="toggleArea"
            title="{{ areaFolded ? '展开更多地区' : '收起地区' }}"
          >
            <span class="label">{{ areaFolded ? '展开更多' : '收起' }}</span>
            <span class="chev" :class="{ up: !areaFolded }">⌄</span>
          </button>
        </div>
        <div class="filter-row">
          <span class="filter-label">租金：</span>
          <button class="filter-chip" :class="{active: rentRange===r}" v-for="r in shownRents" :key="r" @click="setRent(r)">{{ r }}</button>
          <button 
            v-if="rents.length>maxRentShow" 
            :class="['filter-more','btn-ghost',{ expanded: !rentFolded }]" 
            @click="toggleRent"
            :aria-expanded="String(!rentFolded)"
            :title="rentFolded ? '展开更多租金范围' : '收起租金范围'"
          >
            <span class="label">{{ rentFolded ? '展开更多' : '收起' }}</span>
            <span class="chev" :class="{ up: !rentFolded }">⌄</span>
          </button>
        </div>
        <div class="filter-row">
          <span class="filter-label">方式：</span>
          <button class="filter-chip" :class="{active: mode===m}" v-for="m in modes" :key="m" @click="setMode(m)">{{ m }}</button>
        </div>
        <div class="filter-row">
          <span class="filter-label">面积：</span>
          <button class="filter-chip" :class="{active: sizeRange===s}" v-for="s in sizes" :key="s" @click="setSize(s)">{{ s }}</button>
        </div>
      </div>

      

      <div v-if="displayed.length > 0" class="items">
        <div v-for="house in displayed" :key="house.id" class="item" @click="goDetail(house)">
          <img :src="house.cover" class="thumb" loading="lazy" @error="onListImgError" />
          <div class="content">
            <h3 class="title">{{ house.title }}</h3>
            <div class="meta">
              <span>{{ house.room }}</span>
              <span> | {{ house.size }}㎡</span>
              <span> | {{ house.subway }}</span>
            </div>
            <div class="tags">
              <span class="tag" v-for="t in house.tags" :key="t">{{ t }}</span>
            </div>
          </div>
          <div class="price">RM {{ house.price }}<small class="unit">/月</small></div>
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
        <div class="empty-desc">调整筛选或重置再试试</div>
        <div class="empty-actions">
          <button class="btn" @click="resetFilters">重置筛选</button>
        </div>
      </div>
        </div>
        <aside class="aside">
          <div class="aside-card">
            <div class="aside-title">猜你喜欢</div>
            <div class="aside-list">
              <div v-for="r in recommendations" :key="r.id" class="aside-item" @click="goDetail(r)">
                <img :src="r.cover" class="aside-thumb" loading="lazy" @error="onAsideImgError" />
                <div class="aside-info">
                  <div class="aside-name">{{ r.title }}</div>
                  <div class="aside-price">RM {{ r.price }}<small>/月</small></div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { placeholders } from '@/utils/placeholder'
import { housingAPI } from '@/api/housing'

const router = useRouter()
const route = useRoute()

const areas = ['不限','柔佛','吉打','吉兰丹','马六甲','森美兰','彭亨','槟城','霹雳','玻璃市','沙巴','砂拉越','雪兰莪','登嘉楼','吉隆坡','纳闽','布城']
const rents = ['不限','RM500-RM1000','RM1000-RM1500','RM1500-RM2000','RM2000-RM2500','RM2500-RM3000','RM3000以上']
const modes = ['不限','整租','合租']
const sizes = ['不限','20㎡以下','20-50㎡','50-100㎡','100-200㎡','200㎡以上']

// 子类大类与子项（照搬招聘filter思路）
const rentGroups = [
  { key: 'mode', label: '方式' },
  { key: 'huxing', label: '户型' },
  { key: 'feature', label: '特色' }
]
const groupSubcats = {
  mode: ['整租','合租','公寓'],
  huxing: ['一居','二居','三居','四居','主卧','次卧','单间'],
  feature: ['近地铁','朝南','押一付一','拎包入住','带电梯','长租公寓','个人房源']
}

const group = ref(String(route.query.group || 'mode'))
const area = ref(route.query.area || '不限')
const rentRange = ref(route.query.rent || '不限')
const mode = ref(route.query.mode || '不限')
const sizeRange = ref(route.query.size || '不限')
const cat = ref(String(route.query.cat || ''))
// 租房页：取消排序功能（兼容旧参数）
const sort = ref('new')

const list = ref([])
const loading = ref(false)
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 10)
const pageId = 10

const loadList = async () => {
  loading.value = true
  try {
    const { data } = await housingAPI.getRentalList({ pageId, limit: 20, offset: 0 })
    const items = Array.isArray(data?.list || data?.items) ? (data.list || data.items) : []
    const variants = ['整租','合租','公寓','近地铁','拎包入住','朝南']
    let lastImg = ''
    list.value = items.map((it, idx) => {
      const variant = variants[idx % variants.length]
      // 优先使用稳定真实照片库，若接口给了图且不重复则用接口图
      const src = String(it.home_page_image_url || '').trim()
      const looksPlaceholder = !src || /(placeholder|default|logo|svg)$/i.test(src) || /\.(svg)$/.test(src)
      const duplicated = src && src === lastImg
      const useMock = looksPlaceholder || duplicated
      const seed = `${it.property_id || idx}-${variant}`
      const coverUrl = useMock ? placeholders.housePhoto(300,200, seed) : src
      if (src) lastImg = src
      return {
        id: it.property_id ?? idx + 1,
        title: `${it.property_type || ''} ${it.room_count||0}室${it.living_room_count||0}厅${it.bathroom_count||0}卫 ${it.tags?.[0]||''}`.trim(),
        price: it.rent_price ?? '-',
        room: `${it.room_count||0}室`,
        size: it.area || it.size || 0,
        subway: it.location || '',
        cover: coverUrl,
        tags: ['近地铁','南北通透','拎包入住'].slice(0, 1 + (idx%2))
      }
    })
  } catch (e) {
    // 失败退回本地占位
    const variants = ['整租','合租','主卧','次卧','公寓','近地铁','朝南','带电梯']
    list.value = Array.from({length: 10}).map((_,i)=>{
      const variant = variants[i % variants.length]
      return {
        id: i+1,
        title: `${areas[(i%areas.length)||1]}地铁口 采光好 精装${i%2?'次卧':'主卧'}`,
        price: [1800,1900,2100,2300,2500][i%5],
        room: i%2?'次卧(3室)':'主卧(2室)',
        size: [10,12,16,20][i%4],
        subway: '距10号线-某站300m',
        cover: placeholders.house(300,200,variant, `mock-${i}-${variant}`),
        tags: ['近地铁','南北通透','拎包入住'].slice(0, 1 + (i%2))
      }
    })
  } finally {
    loading.value = false
  }
}

onMounted(loadList)

watch(() => route.query, (q) => {
  group.value = String(q.group || group.value || 'mode')
  cat.value = String(q.cat || cat.value || '')
  area.value = q.area || '不限'
  rentRange.value = q.rent || '不限'
  mode.value = q.mode || '不限'
  sizeRange.value = q.size || '不限'
  // 保留兼容：不再渲染排序控件
})

const setArea = (v)=>{ area.value=v; pushQuery() }
const setRent = (v)=>{ rentRange.value=v; pushQuery() }
const setMode = (v)=>{ mode.value=v; pushQuery() }

const isValidCat = computed(()=> (groupSubcats[group.value] || []).includes(cat.value))
const filtered = computed(()=> {
  return list.value.filter(v=>{
    // 面积范围过滤（本地 mock：size 字段为数字）
    if (sizeRange.value && sizeRange.value !== '不限') {
      const s = Number(v.size) || 0
      const key = sizeRange.value
      if (key === '20㎡以下' && !(s < 20)) return false
      if (key === '20-50㎡' && !(s >= 20 && s < 50)) return false
      if (key === '50-100㎡' && !(s >= 50 && s < 100)) return false
      if (key === '100-200㎡' && !(s >= 100 && s < 200)) return false
      if (key === '200㎡以上' && !(s >= 200)) return false
    }
    // 子类关键词过滤（仅当当前组包含该标签时才过滤）
    if (cat.value && isValidCat.value && !(`${v.title}`.includes(cat.value))) return false
    return true
  })
})
const displayed = computed(()=> filtered.value.slice((page.value-1)*pageSize.value, page.value*pageSize.value))
const hasMore = computed(()=> filtered.value.length >= page.value * pageSize.value)

const pushQuery = ()=>{
  router.replace({ name: 'RentList', query: { group: group.value || undefined, cat: cat.value || undefined, area: area.value, rent: rentRange.value, mode: mode.value, size: sizeRange.value, page: page.value, pageSize: pageSize.value } })
}

const goDetail = (house)=>{
  router.push({ name: 'ServiceDetail', params: { id: house.id }, query: { type: 'rent' } })
}

const resetFilters = ()=>{ area.value='不限'; rentRange.value='不限'; mode.value='不限'; sizeRange.value='不限'; cat.value=''; group.value='mode'; sort.value='new'; page.value=1; pushQuery() }
const setGroup = (g)=>{ group.value=g; cat.value=''; pushQuery() }
const setCat = (v)=>{ cat.value=v || ''; pushQuery() }
// 排序已移除
// 地区折叠与展开
const maxAreaShow = 10
const areaFolded = ref(true)
const shownAreas = computed(()=> areaFolded.value ? areas.slice(0, maxAreaShow) : areas)
const toggleArea = ()=>{ areaFolded.value = !areaFolded.value }
// 子类展开控制
const maxSubShow = 10
const subFolded = ref(true)
const commonFirst = (list)=>{
  const common = ['整租','合租','近地铁','主卧','次卧']
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
  const m = rentGroups.find(g=>g.key===group.value)
  return m ? m.label : '筛选'
})
// 右侧猜你喜欢
const recommendations = computed(()=> {
  const base = filtered.value.length ? filtered.value : list.value
  const arr = base.slice(0, 6).map((v,i)=> ({
    id: v.id || i+1,
    title: v.title || `优选房源 ${i+1}`,
    price: v.price || [1800,2000,2200,2600][i%4],
    cover: v.cover || placeholders.housePhoto(280,160, `rec-${i}-${area.value}-${rentRange.value}`)
  }))
  return arr
})
const setSize = (v)=>{ sizeRange.value=v; pushQuery() }
const prevPage = ()=>{ if (page.value>1) { page.value -= 1; pushQuery() } }
const nextPage = ()=>{ if (hasMore.value) { page.value += 1; pushQuery() } }

// 租金展开/收起（美化按钮交互）
const maxRentShow = 5
const rentFolded = ref(true)
const shownRents = computed(()=> rentFolded.value ? rents.slice(0, maxRentShow) : rents)
const toggleRent = ()=>{ rentFolded.value = !rentFolded.value }

// 图片失败兜底
const onListImgError = (e) => {
  try {
    const img = e?.target
    if (img && typeof img.dataset.seed === 'string') {
      img.src = placeholders.housePhoto(160,106, img.dataset.seed)
      return
    }
    if (img) img.src = placeholders.house(160,106,'房源')
  } catch(_) {}
}
const onAsideImgError = (e) => {
  try {
    const img = e?.target
    if (img) img.src = placeholders.housePhoto(72,54, 'aside-fallback')
  } catch(_) {}
}
</script>

<style scoped>
.list-page { background: #fff; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 16px; }
.channel-tabs { display: flex; gap: 12px; margin-bottom: 10px; }
.channel-tabs .ch { padding: 8px 12px; border: 1px solid #eee; background: #fff; border-radius: 8px; color: #333; text-decoration: none; }
.channel-tabs .ch.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }

.content-layout { display: grid; grid-template-columns: 1fr 240px; gap: 16px; align-items: start; }
.main { min-width: 0; }
.aside { position: sticky; top: 12px; height: fit-content; }
.aside-card { border: 1px solid #f1f3f5; border-radius: 8px; padding: 10px; background: #fff; }
.aside-title { font-size: 14px; color: #333; font-weight: 600; margin-bottom: 8px; }
.aside-list { display: flex; flex-direction: column; gap: 8px; }
.aside-item { display: grid; grid-template-columns: 72px 1fr; gap: 8px; cursor: pointer; }
.aside-thumb { width: 72px; height: 54px; border-radius: 6px; object-fit: cover; }
.aside-info { display: flex; flex-direction: column; justify-content: space-between; }
.aside-name { font-size: 13px; color: #333; line-height: 1.2; }
.aside-price { font-size: 12px; color: #e55a00; }
.filters { border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
.row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.label { color: #666; width: 56px; }
.chip { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 13px; }
.chip.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }
.filter-more.btn-ghost { padding: 0 8px; height: 28px; display: inline-flex; align-items: center; gap: 4px; border: 1px dashed #ffd5bf; color: #ff6a00; background: #fff7f1; border-radius: 16px; }
.filter-more.btn-ghost .chev { transition: transform .2s ease; }
.filter-more.btn-ghost .chev.up { transform: rotate(180deg); }
.sort-bar { display: flex; align-items: center; gap: 10px; margin: 6px 0 12px; }
.sort-label { color: #666; font-size: 13px; }
.sort-chip { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 12px; }
.sort-chip.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }

.items { display: grid; grid-template-columns: 1fr; gap: 12px; }
.item { display: grid; grid-template-columns: 160px 1fr auto; gap: 12px; align-items: center; border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; cursor: pointer; }
.item:hover { box-shadow: 0 4px 14px rgba(0,0,0,.06); }
.thumb { width: 160px; height: 106px; border-radius: 6px; object-fit: cover; }
.title { margin: 0 0 6px 0; font-size: 16px; color: #333; }
.meta { color: #9aa0a6; font-size: 12px; }
.price { color: #e55a00; font-weight: 700; font-size: 18px; }
.unit { font-size: 12px; color: #999; margin-left: 2px; }

.breadcrumbs.jobs-style { color: #777; font-size: 13px; padding: 8px 0 6px; }
.breadcrumbs.jobs-style a { color: #576b95; text-decoration: none; }
.breadcrumbs.jobs-style .sep { margin: 0 6px; color: #bbb; }
.breadcrumbs.jobs-style .current { color: #333; font-weight: 600; }

.empty-state { border: 1px dashed #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; color: #667085; background: #fafafa; }
.empty-title { font-size: 16px; color: #333; font-weight: 600; }
.empty-desc { font-size: 13px; margin-top: 6px; }
.empty-actions { margin-top: 12px; }
.btn { padding: 8px 14px; background: #ff6b35; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 12px 0; }
.page-btn { padding: 8px 12px; border: 1px solid #f1f3f5; background: #fff; border-radius: 8px; cursor: pointer; }
.page-btn:disabled { color: #999; cursor: not-allowed; }
.page-info { color: #777; font-size: 13px; }

@media (max-width: 1024px) {
  .content-layout { grid-template-columns: 1fr; }
  .aside { position: static; }
}
</style>


