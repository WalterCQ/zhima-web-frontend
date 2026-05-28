<template>
  <div class="list-page">
    <div class="container">
      <!-- 面包屑导航 -->
      <nav class="breadcrumbs">
        <router-link to="/services">知马同城</router-link>
        <span class="sep">></span>
        <span class="current">招聘</span>
      </nav>

      <!-- 头部/筛选 -->
      <div class="header">
        <h2 class="title">热门招聘</h2>
      </div>

      <!-- 58同城式职位类目导航 -->
      <div class="pos-cont" @mouseleave="clearHover">
        <div class="sidebar-left">
          <ul>
            <li v-for="grp in jobGroups" :key="grp.key" :class="{ active: displayGroup===grp.key }" @mouseenter="onHoverGroup(grp.key)" @click="setGroup(grp.key)">
              <a href="javascript:void(0)">{{ grp.label }}</a>
            </li>
          </ul>
        </div>
        <div class="sidebar-right">
          <div class="sub-row">
            <button class="sub-chip" :class="{active: jobCat==='不限'}" @click="setCat('不限')">全部</button>
            <button v-for="sub in groupSubcats[displayGroup] || []" :key="sub" class="sub-chip" :class="{active: jobCat===sub}" @click="setCat(sub)">{{ sub }}</button>
          </div>
        </div>
      </div>

      <!-- 本页仅作为入口导航，筛选与列表已迁移至 /jobs/filter -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { placeholders } from '@/utils/placeholder'

const router = useRouter()
const route = useRoute()

const cats = ['不限','服务员','育婴师','司机','销售','客服','普工/技工']
const areas = ['全马来西亚','柔佛','吉打','吉兰丹','马六甲','森美兰','彭亨','槟城','霹雳','玻璃市','沙巴','砂拉越','雪兰莪','登嘉楼','吉隆坡','纳闽','布城']
const welfares = ['不限','包吃','包住','五险一金','周末双休','加班补助']
const jobTypes = ['不限','全职','兼职']

const jobCat = ref(route.query.cat || '不限')
const area = ref(route.query.area || '全马来西亚')
const welfare = ref(route.query.welfare || '不限')
const jobType = ref(route.query.type || '不限')
const searchQuery = ref(String(route.query.q || ''))

// 左侧分组与右侧子类（精简版，参考58同城）
const jobGroups = [
  { key: 'pgjg', label: '普工/技工' },
  { key: 'sjiwl', label: '司机/物流' },
  { key: 'xiaoshou', label: '销售' },
  { key: 'canyin', label: '餐饮' },
  { key: 'mendian', label: '门店/零售' },
  { key: 'anbao', label: '安保消防' },
  { key: 'yunying', label: '运营/客服' },
  { key: 'renshi', label: '人事/行政/财务' },
  { key: 'fuwu', label: '服务业' },
  { key: 'shengchan', label: '生产制造' },
  { key: 'chuanmei', label: '传媒/影视/直播' },
  { key: 'meifa', label: '美发/美容/保健' },
  { key: 'yiliao', label: '医疗/健康' },
  { key: 'sheji', label: '设计' },
  { key: 'shichang', label: '市场' },
  { key: 'fangchan', label: '房地产建筑' },
  { key: 'jinrong', label: '金融/贸易' },
  { key: 'jiaoyu', label: '教育培训' },
  { key: 'hulianwang', label: '互联网/通信' },
  { key: 'qita', label: '其他职位' }
]

const groupSubcats = {
  pgjg: ['普工','操作工','装配工','包装工','学徒工','机修工','电工'],
  sjiwl: ['配送/理货','货运司机','客运司机','特种车司机','仓储','供应链','物流/运输'],
  xiaoshou: ['销售','电话销售','网络销售','渠道销售','销售经理'],
  canyin: ['服务员','收银','送餐员','厨师','后厨','西点烘焙','饮品调制','餐饮管理'],
  mendian: ['店员/营业员','收银员','理货员','陈列员','促销/导购'],
  anbao: ['安保','交通安全','安全消防'],
  yunying: ['客服','新媒体运营','电商运营','运营','运营管理'],
  renshi: ['人事','行政/文员','财务'],
  fuwu: ['家政服务','汽车服务','酒店服务'],
  shengchan: ['质检','生产跟单','设备管理'],
  chuanmei: ['视频剪辑','摄影/摄像','直播运营','主播'],
  meifa: ['美容师','美发师','美甲师','按摩师'],
  yiliao: ['护士','医生','药店营业员'],
  sheji: ['平面设计','UI设计','包装设计'],
  shichang: ['市场推广','渠道拓展','活动执行'],
  fangchan: ['房产经纪人','置业顾问','物业管理'],
  jinrong: ['理财顾问','保险顾问','信贷专员'],
  jiaoyu: ['教师','助教','职业培训'],
  hulianwang: ['前端开发','后端开发','测试','运维'],
  qita: ['其他职位']
}

const group = ref(route.query.group || 'pgjg')
const hoverGroup = ref('')
const displayGroup = computed(()=> hoverGroup.value || group.value)

const list = ref(Array.from({length: 12}).map((_,i)=>({
  id: i+1,
  title: `吉隆坡 | ${['高薪直招','名企直聘'][i%2]} ${cats[(i%cats.length)||1]}`,
  company: ['本地企业','优选企业'][i%2],
  city: areas[(i%areas.length)||1],
  exp: ['不限','1-3年'][i%2],
  salary: ['RM8000-RM16000','RM9000-RM13000','RM5000-RM8000'][i%3] + ' /月',
  tags: ['包吃','包住','年底双薪','高提成'].slice(0, 2 + (i%2)),
  cover: placeholders.job(300, 160, '招聘', `${i}`),
  logo: placeholders.logo(48, '企', `${i}`)
})))

const page = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.pageSize) || 10)

const setCat = (v)=>{ 
  jobCat.value=v; 
  page.value=1; 
  pushQuery();
  router.push({ name: 'JobsFilter', query: { group: displayGroup.value, cat: jobCat.value, area: area.value, welfare: welfare.value, type: jobType.value } })
}
const setArea = (v)=>{ area.value=v; page.value=1; pushQuery() }
const setWelfare = (v)=>{ welfare.value=v; page.value=1; pushQuery() }
const setJobType = (v)=>{ jobType.value=v; page.value=1; pushQuery() }
const setGroup = (g)=>{ 
  group.value=g; 
  jobCat.value='不限'; 
  page.value=1; 
  pushQuery();
  router.push({ name: 'JobsFilter', query: { group: group.value, area: area.value, welfare: welfare.value, type: jobType.value } })
}

const onHoverGroup = (g)=>{ hoverGroup.value = g }
const clearHover = ()=>{ hoverGroup.value = '' }

const hotChips = ['司机','服务员','销售','客服','普工/技工','育婴师']
const selectedExtras = ref({})
const filtered = computed(()=> list.value.filter(v => {
  if (searchQuery.value && !(`${v.title} ${v.company}`.includes(searchQuery.value))) return false
  if (jobCat.value && jobCat.value !== '不限') {
    return `${v.title}`.includes(jobCat.value)
  }
  const ex = selectedExtras.value[group.value] || {}
  for (const k in ex) {
    const val = ex[k]
    if (val && val !== '不限' && !(`${v.title}`.includes(val))) return false
  }
  return true
}))
const total = computed(()=> filtered.value.length)
const totalPages = computed(()=> Math.max(1, Math.ceil(total.value / pageSize.value)))
const hasMore = computed(()=> page.value < totalPages.value)
const displayed = computed(()=> filtered.value.slice((page.value-1)*pageSize.value, page.value*pageSize.value))

const pushQuery = ()=>{
  router.replace({ name: 'JobsList', query: { group: group.value, cat: jobCat.value, area: area.value, welfare: welfare.value, type: jobType.value, q: searchQuery.value || undefined, page: page.value, pageSize: pageSize.value } })
}

const goDetail = (job)=>{
  router.push({ name: 'ServiceDetail', params: { id: job.id }, query: { type: 'job' } })
}

// 监听外部跳转携参，确保筛选高亮
watch(() => route.query, (q) => {
  jobCat.value = q.cat || '不限'
  area.value = q.area || '全马来西亚'
  welfare.value = q.welfare || '不限'
  jobType.value = q.type || '不限'
  searchQuery.value = String(q.q || '')
  group.value = q.group || group.value
  page.value = Number(q.page) || 1
  pageSize.value = Number(q.pageSize) || 10
})

const resetFilters = () => {
  jobCat.value = '不限'
  area.value = '全马来西亚'
  welfare.value = '不限'
  jobType.value = '不限'
  page.value = 1
  pushQuery()
}

const prevPage = () => { if (page.value > 1) { page.value -= 1; pushQuery() } }
const nextPage = () => { if (hasMore.value) { page.value += 1; pushQuery() } }
</script>

<style scoped>
.list-page { background: #fff; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 16px; }
.breadcrumbs { color: #777; font-size: 13px; padding: 8px 0 6px; }
.breadcrumbs a { color: #576b95; text-decoration: none; }
.breadcrumbs .sep { margin: 0 6px; color: #bbb; }
.breadcrumbs .current { color: #333; font-weight: 600; }

/* 58 类目导航 */
.pos-cont { display: grid; grid-template-columns: 220px 1fr; gap: 12px; margin-bottom: 12px; }
.sidebar-left { border: 1px solid #f1f3f5; border-radius: 8px; background: #fff; }
.sidebar-left ul { list-style: none; padding: 8px; margin: 0; }
.sidebar-left li { padding: 8px 10px; border-radius: 6px; cursor: pointer; }
.sidebar-left li.active, .sidebar-left li:hover { background: #fff7f1; color: #e55a00; }
.sidebar-left a { color: inherit; text-decoration: none; font-size: 14px; }
.sidebar-right { border: 1px solid #f1f3f5; border-radius: 8px; background: #fff; padding: 10px; }
.sub-row { display: flex; flex-wrap: wrap; gap: 8px; }
.sub-chip { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 13px; }
.sub-chip.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }

.filters { border: 1px solid #f1f3f5; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
.filter-row { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.filter-label { color: #666; width: 56px; }
.chip { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 13px; }
.chip.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }
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


