<template>
  <div class="list-page">
    <div class="container">
      <div class="header">
        <h2 class="title">{{ pageTitle }}</h2>
        <div class="summary">为您找到优质同城服务商，价格透明，支持电话/WhatsApp联系</div>
        <div class="summary" style="color:#9aa0a6;margin-top:6px;">平台声明：本平台仅为信息发布平台，服务由第三方提供，请自行核实商家资质与价格。</div>
      </div>

    <div class="group-tabs">
      <button
        v-for="g in GROUPS"
        :key="g.value"
        class="group-tab"
        :class="{ active: group===g.value }"
        @click="setGroup(g.value)"
      >
        <component :is="g.icon" class="gt-icon" />
        <span>{{ g.label }}</span>
      </button>
    </div>

    <div class="hero">
      <div class="hero-content">
        <component :is="activeGroup.icon" class="hero-icon" />
        <div class="hero-text">
          <div class="hero-title">{{ activeGroup.label }}</div>
          <div class="hero-sub">精选热门分类，快速直达</div>
          <div class="hero-chips">
              <template v-if="group==='housekeeping'">
                <a 
                  v-for="chip in groupChips" 
                  :key="chip" 
                  class="link-chip" 
                  :class="{ active: category===chip }"
                  @click.prevent="setCategory(chip)"
                >{{ chip }}</a>
              </template>
              <template v-else>
                <button 
                  v-for="chip in groupChips" 
                  :key="chip" 
                  class="chip"
                  :class="{ active: category===chip }"
                  @click="setCategory(chip)"
                >{{ chip }}</button>
              </template>
          </div>
        </div>
      </div>
    </div>

      <!-- 顶部：搜索与视图切换 -->
      <div class="topbar">
        <div class="search-wrap">
          <input v-model="searchQuery" class="form-input" type="text" placeholder="搜索服务/关键词..." @keyup.enter="pushQuery" />
        </div>
      </div>

      <!-- 筛选栏（58同城风格） -->
      <div class="filters">
        <div class="filter-row">
          <span class="filter-label">类别：</span>
          <button class="filter-chip" :class="{active: category===c}" v-for="c in categories" :key="c" @click="setCategory(c)">{{ c }}</button>
        </div>
        <div class="filter-row">
          <span class="filter-label">排序：</span>
          <button class="filter-chip" :class="{active: sort===s.value}" v-for="s in sorts" :key="s.value" @click="setSort(s.value)">{{ s.label }}</button>
        </div>
        <div class="filter-row">
          <span class="filter-label">筛选：</span>
          <button class="filter-chip" :class="{active: onlyImage}" @click="toggleOnlyImage">只看有图</button>
          <button class="filter-chip" :class="{active: guarantee}" @click="toggleGuarantee">高评分</button>
        </div>
      </div>

      <!-- 列表 -->
      <div>
        <div v-if="loading" class="skeleton-list">
          <div class="skeleton-item" v-for="i in 6" :key="i">
            <div class="sk-thumb"></div>
            <div class="sk-lines">
              <div class="sk-line w60"></div>
              <div class="sk-line w40"></div>
              <div class="sk-line w80"></div>
            </div>
          </div>
        </div>

        <div v-else>
          <div v-if="filtered.length === 0" class="empty-state">
            <div class="empty-title">暂无结果</div>
            <div class="empty-desc">换个关键词、切换类别或重置筛选再试试</div>
            <div class="empty-actions">
              <button class="btn" @click="resetFilters">重置筛选</button>
            </div>
          </div>

          <div v-else class="items">
            <div v-for="svc in filtered" :key="svc.id" class="item" @click="goDetail(svc)">
              <img :src="svc.cover" class="thumb" />
              <div class="content">
                <h3 class="title">{{ svc.title }}</h3>
                <div class="meta">
                  <span>{{ svc.provider }}</span>
                  <span v-if="svc.city"> | {{ svc.city }}</span>
                  <span v-if="svc.tags?.length"> | {{ svc.tags.slice(0,2).join(' / ') }}</span>
                </div>
                <div class="tags" v-if="svc.tags?.length">
                  <span class="tag" v-for="t in svc.tags.slice(0,5)" :key="t">{{ t }}</span>
                </div>
              </div>
              <div class="price" v-if="svc.price">{{ svc.price }}<small class="unit">/{{ svc.unit || '次' }}</small></div>
            </div>

            <div class="pagination">
              <button class="page-btn" :disabled="page<=1" @click="prevPage">上一页</button>
              <div class="page-info">
                <span>第 {{ page }} 页</span>
                <span v-if="total>0"> / 共 {{ totalPages }} 页</span>
              </div>
              <button class="page-btn" :disabled="!hasMore" @click="nextPage">下一页</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import servicesAPI from '@/api/services'
import { placeholders } from '@/utils/placeholder'
import { Store, Package, Wrench, MapPin } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

// 分组与分类映射（合并“二手市场/二手回收”为统一“二手”组）
const categoriesByGroup = {
  // 二手（包含原二手市场与二手回收）
  secondhand: [
    // 一级类目
    '摩托车','自行车','乐器','运动户外','图书','宠物',
    '家居家装','母婴用品','美妆护肤','礼品文玩','办公设备',
    // 重点货盘/会场
    '特惠九成新家具','摩托卖场','高性价比家电','家具送货上门',
    // 家电/家具细分
    '二手家电','空调','电视','冰箱','二手家具','沙发','床','桌椅',
    // 出行/设备
    '电动车','三轮车','百货设备',
    // 长尾集合（精选入口）
    '家居日用','厨具','灯具','床品','婴幼服','玩具','服装箱包','手表','服饰',
    '设备买卖','木工','电力','仪器','文体户外','健身','麻将','艺术收藏','古玩','把件','字画',
    '成人用品','美容保健','图书音像','通讯业务','礼品转让','交换','二手求购','其他二手'
  ],
  // 兼容保留：原“二手回收”分类合并入二手
  recycle: [
    // 家居/数码/材料
    '家具','家电','数码','服装','日用品','手机','平板','笔记本','相机','配件',
    '废纸','金属','建筑废料','塑料','电线电缆',
    // 细分类
    '空调','冰箱','洗衣机','电视','音响','热水器',
    '衣柜','沙发','桌子','床','椅子凳子','茶几',
    '电脑/配件','显示器','机械/设备','工厂','机械','发电机',
    '工业物资','库存积压','玻璃','电池','纺织皮革','电子',
    '奢侈品','金银','礼品','艺术品',
    '办公/酒店/文体','打印机','复印机','墨盒','厨房设备','酒店设备','钢琴','图书','桌球',
    '办公家具','老板台','文件柜','桌椅'
  ],
  // 家政服务
  housekeeping: [
    '保洁','保姆','钟点工','月嫂育儿嫂','上门家政','深度保洁',
    '家电维修','空调拆装','空调清洗','疏通维修','水电维修','开锁换锁','洗衣到家',
    '搬家拉货','到家美食','消杀除螨','家电安装'
  ],
  // 本地服务
  local: [
    '搬家拉货','货运物流','摄影摄像','宠物服务','网络服务',
    '学习培训','教育培训','法律咨询','到家美食','汽车保养',
    '电脑维修','手机回收','灵活用工','家电安装','空调清洗',
    // 装修建材
    '全屋定制','瓷砖地板','防水补漏','水电改造','软装搭配','家具家私',
    // 汽车相关扩展
    '租车','驾校','代驾·司机外派','代驾','保险','过户验车','以租代购','代办上牌','改装','配件','维修保养','美容装饰',
    // 服务板块新增
    '申请公司','代办执照','供应商','跨境物流','合法外劳','网站建设','软件开发','餐饮加盟','喷绘招牌','开锁换锁','家政工作','租赁',
    // 生活板块新增
    '钟点保洁','搬家搬运','保姆月嫂','房屋维修','家电维修','管道疏通','建材','家装','房屋装修','生活配送','二手回收','二手家具','二手家电','二手电脑','宠物'
  ]
}

const secondhandSet = new Set([
  ...categoriesByGroup.secondhand,
  ...categoriesByGroup.recycle
])
const recycleSet = new Set(categoriesByGroup.recycle)
const housekeepingSet = new Set(categoriesByGroup.housekeeping)

const detectGroupByCategory = (c) => {
  if (secondhandSet.has(c)) return 'secondhand'
  if (housekeepingSet.has(c)) return 'housekeeping'
  return 'local'
}

// 顶部分组标签（将“二手市场/二手回收”合并为“二手”）
const GROUPS = [
  { value: 'secondhand', label: '二手', icon: Store },
  { value: 'housekeeping', label: '家政服务', icon: Wrench },
  { value: 'local', label: '本地服务', icon: MapPin }
]

const initialCat = String(route.query.category || route.query.cat || '')
// 兼容历史链接中的 group=recycle，将其映射为 secondhand
const initialGroup = (() => {
  const g = String(route.query.group || '').trim()
  if (g === 'recycle') return 'secondhand'
  if (g === 'secondhand') return 'secondhand'
  return ''
})()
const group = ref(initialGroup || detectGroupByCategory(initialCat) || 'local')
const categories = computed(() => categoriesByGroup[group.value] || categoriesByGroup.local)
const sorts = [
  { label: '默认', value: 'default' },
  { label: '好评优先', value: 'rating' },
  { label: '价格低优先', value: 'priceAsc' },
  { label: '价格高优先', value: 'priceDesc' }
]

const category = ref(initialCat || categories.value[0])
const sort = ref(route.query.sort || 'default')
const onlyImage = ref(false)
const guarantee = ref(false)
const searchQuery = ref(String(route.query.q || ''))
// 仅保留列表视图（移除地图模式）

const pageTitle = computed(()=> `${category.value} - 同城服务`)
const activeGroup = computed(()=> GROUPS.find(g => g.value === group.value) || GROUPS[2])
const groupChips = computed(()=> (categories.value || []).slice(0, 6))

const list = ref([])
const loading = ref(false)
const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 20)
const total = ref(0)
const totalPages = computed(()=> total.value>0 ? Math.max(1, Math.ceil(total.value / pageSize.value)) : page.value)
const hasMore = computed(()=> {
  if (total.value > 0) return page.value * pageSize.value < total.value
  return list.value.length >= pageSize.value
})

const fetchList = async () => {
  loading.value = true
  try {
    const { data } = await servicesAPI.getServices({ group: group.value, category: category.value, sort: sort.value, page: page.value, pageSize: pageSize.value })
    const items = Array.isArray(data?.list || data?.items) ? (data.list || data.items) : []
    list.value = items.map((it, i) => ({
      id: it.id ?? i + 1,
      title: it.title || `${category.value}·专业上门服务` ,
      price: it.price,
      unit: it.unit,
      provider: it.provider?.name || it.contact?.name || '本地商家',
      city: it.location || it.city,
      tags: it.tags || ['快速上门','诚信服务'],
      cover: (it.images && it.images[0]) || placeholders.service(260,160, category.value)
    }))
    const totalCount = (typeof data?.total === 'number' && data.total) || (typeof data?.totalCount === 'number' && data.totalCount) || (typeof data?.pagination?.total === 'number' && data.pagination.total) || 0
    total.value = totalCount
  } catch (e) {
    // 占位模拟
    list.value = Array.from({ length: 10 }).map((_,i)=>({
      id: i+1,
      title: `${category.value} 上门服务 ${i+1}`,
      price: [59,79,99,129,159][i%5],
      unit: '次',
      provider: ['本地商家','认证技师','优选商家'][i%3],
      city: '本地',
      tags: ['快速上门','当日可约','品质保障'].slice(0, 1 + (i%3)),
      cover: placeholders.service(260,160, category.value)
    }))
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)

watch(() => route.query, (q)=>{
  if (q.group) group.value = (q.group === 'recycle' ? 'secondhand' : q.group)
  if (q.category || q.cat) {
    category.value = q.category || q.cat
    const g = detectGroupByCategory(category.value)
    if (g !== group.value) group.value = g
  }
  if (q.sort) sort.value = q.sort
  searchQuery.value = String(q.q || '')
  page.value = Number(q.page) || 1
  pageSize.value = Number(q.pageSize) || 20
  fetchList()
})

const setCategory = (c)=>{
  category.value = c
  page.value = 1
  pushQuery()
}
const setSort = (s)=>{ sort.value = s; page.value = 1; pushQuery() }
const toggleOnlyImage = ()=>{ onlyImage.value = !onlyImage.value; page.value = 1 }
const toggleGuarantee = ()=>{ guarantee.value = !guarantee.value; page.value = 1 }

const filtered = computed(()=> list.value.filter(v=>{
  if (onlyImage.value && !v.cover) return false
  return true
}))

const pushQuery = ()=>{
  router.replace({ name: 'ServicesList', query: { group: group.value, category: category.value, sort: sort.value, q: searchQuery.value || undefined, page: page.value, pageSize: pageSize.value } })
}

const setGroup = (g)=>{
  if (g === group.value) return
  group.value = g
  category.value = (categoriesByGroup[g] && categoriesByGroup[g][0]) || categoriesByGroup.local[0]
  page.value = 1
  pushQuery()
}

const goDetail = (svc)=>{
  router.push({ name: 'ServiceDetail', params: { id: svc.id }, query: { type: 'service' } })
}

const resetFilters = () => {
  onlyImage.value = false
  guarantee.value = false
  searchQuery.value = ''
  sort.value = 'default'
  category.value = categories.value[0]
  page.value = 1
  pushQuery()
}

const prevPage = () => { if (page.value > 1) { page.value -= 1; pushQuery() } }
const nextPage = () => { if (hasMore.value) { page.value += 1; pushQuery() } }
</script>

<style scoped>
.list-page { background: #fff; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 16px; }
.header { padding: 8px 0 12px; border-bottom: 1px solid #f1f3f5; margin-bottom: 12px; }
.title { margin: 0; font-size: 20px; color: #333; }
.summary { color: #777; font-size: 13px; margin-top: 4px; }
.group-tabs { display: flex; gap: 8px; padding: 12px 0; }
.group-tab { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border: 1px solid #f1f3f5; background: #fff; border-radius: 999px; cursor: pointer; color: #555; }
.group-tab.active { border-color: #ffd5bf; background: #fff7f1; color: #e55a00; }
.gt-icon { width: 16px; height: 16px; color: #ff6a00; }
.hero { border: 1px solid #f1f3f5; background: linear-gradient(180deg,#fff7f1, #fff); border-radius: 12px; padding: 14px; margin: 8px 0 12px; }
.hero-content { display: flex; align-items: center; gap: 12px; }
.hero-icon { width: 28px; height: 28px; color: #ff6a00; }
.hero-text { display: flex; flex-direction: column; gap: 6px; }
.hero-title { font-size: 18px; color: #e55a00; font-weight: 700; }
.hero-sub { color: #9aa0a6; font-size: 12px; }
.hero-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.chip { padding: 6px 10px; border: 1px solid #ffd5bf; background: #fff; color: #e55a00; border-radius: 999px; cursor: pointer; font-size: 12px; }
.filters { border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
.items { display: grid; grid-template-columns: 1fr; gap: 12px; }
.item { display: grid; grid-template-columns: 160px 1fr auto; gap: 12px; align-items: center; border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; cursor: pointer; }
.item:hover { box-shadow: 0 4px 14px rgba(0,0,0,.06); }
.thumb { width: 160px; height: 100px; border-radius: 6px; object-fit: cover; }
.title { margin: 0 0 6px 0; font-size: 16px; color: #333; }
.meta { color: #9aa0a6; font-size: 12px; }
.price { color: #e55a00; font-weight: 700; font-size: 18px; }
.unit { font-size: 12px; color: #999; margin-left: 2px; }
.tags { display: flex; gap: 6px; margin-top: 6px; }
.tag { background: #f6f7f9; color: #666; border: 1px solid #eee; border-radius: 10px; padding: 2px 8px; font-size: 12px; }
.hero-chips .link-chip { display: inline-block; color: #0b76e0; cursor: pointer; font-size: 14px; background: transparent; border: none; padding: 0; margin-right: 12px; }
.hero-chips .link-chip:hover { text-decoration: underline; }
.hero-chips .link-chip.active { color: #e55a00; font-weight: 600; text-decoration: none; }
.hero-chips .link-chip.active:hover { text-decoration: none; }
.skeleton-list { display: grid; grid-template-columns: 1fr; gap: 12px; }
.skeleton-item { display: grid; grid-template-columns: 160px 1fr; gap: 12px; align-items: center; border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; }
.sk-thumb { width: 160px; height: 100px; border-radius: 6px; background: linear-gradient(90deg, #f4f6f8, #eef1f4, #f4f6f8); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
.sk-lines { display: flex; flex-direction: column; gap: 8px; }
.sk-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #f4f6f8, #eef1f4, #f4f6f8); background-size: 200% 100%; animation: shimmer 1.2s infinite; }
.w60 { width: 60%; }
.w40 { width: 40%; }
.w80 { width: 80%; }
@keyframes shimmer { 0%{ background-position: 200% 0 } 100%{ background-position: -200% 0 } }

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
</style>



