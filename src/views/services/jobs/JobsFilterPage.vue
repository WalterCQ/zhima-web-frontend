<template>
  <div class="list-page">
    <div class="container">
      <nav class="breadcrumbs">
        <router-link to="/services">知马同城</router-link>
        <span class="sep">></span>
        <router-link to="/jobs">招聘</router-link>
        <span class="sep">></span>
        <span class="current">{{ currentGroupLabel }}</span>
        <span v-if="cat" class="sep">></span>
        <span v-if="cat" class="current">{{ cat }}</span>
      </nav>

      <div class="filters">
        <!-- 将当前大类与子类加入筛选大框的第一行 -->
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
          <span class="filter-label">福利：</span>
          <button class="filter-chip" :class="{active: welfare===w}" v-for="w in welfares" :key="w" @click="setWelfare(w)">{{ w }}</button>
        </div>
        <div class="filter-row">
          <span class="filter-label">类型：</span>
          <button class="filter-chip" :class="{active: jobType===t}" v-for="t in jobTypes" :key="t" @click="setJobType(t)">{{ t }}</button>
        </div>
      </div>

      <!-- 职位列表 -->
      <div v-if="displayed.length>0" class="items">
        <div v-for="job in displayed" :key="job.id" class="item" @click="goDetail(job)">
          <img :src="job.logo" class="logo" />
          <div class="content">
            <h3 class="title">{{ job.title }}</h3>
            <div class="meta">
              <span>{{ job.company }}</span>
              <span v-if="job.city"> | {{ job.city }}</span>
              <span v-if="job.exp"> | {{ job.exp }}</span>
            </div>
            <div class="tags" v-if="job.tags?.length">
              <span v-for="t in job.tags.slice(0,4)" :key="t" class="tag">{{ t }}</span>
            </div>
          </div>
          <div class="price">{{ job.salary }}</div>
          <button class="apply-btn" @click.stop>申请</button>
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
        <div class="empty-title">暂无职位</div>
        <div class="empty-desc">调整筛选条件试试</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const areas = ['全马来西亚','柔佛','吉打','吉兰丹','马六甲','森美兰','彭亨','槟城','霹雳','玻璃市','沙巴','砂拉越','雪兰莪','登嘉楼','吉隆坡','纳闽','布城']
const welfares = ['不限','五险一金','包住','包吃','年底双薪','周末双休','交通补助','加班补助','饭补','话补','房补']
const jobTypes = ['不限','全职','兼职']

// 职位大类与对应子类（与列表页一致）
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

const group = ref(String(route.query.group || 'pgjg'))
const cat = ref(String(route.query.cat || ''))
const area = ref(String(route.query.area || '全马来西亚'))
const welfare = ref(String(route.query.welfare || '不限'))
const jobType = ref(String(route.query.type || '不限'))

const setArea = (v)=>{ area.value=v; pushQuery() }
const setWelfare = (v)=>{ welfare.value=v; pushQuery() }
const setJobType = (v)=>{ jobType.value=v; pushQuery() }
const setGroup = (g)=>{ group.value=g; cat.value=''; pushQuery() }
const setCat = (v)=>{ cat.value=v || ''; pushQuery() }

const pushQuery = ()=>{
  router.replace({ name: 'JobsFilter', query: { group: group.value || undefined, cat: cat.value || undefined, area: area.value, welfare: welfare.value, type: jobType.value } })
}

watch(() => route.query, (q)=>{
  group.value = String(q.group || group.value || 'pgjg')
  cat.value = String(q.cat || cat.value || '')
  area.value = String(q.area || '全马来西亚')
  welfare.value = String(q.welfare || '不限')
  jobType.value = String(q.type || '不限')
})

// 子类“常用优先 + 更多/收起”
const maxSubShow = 10
const subFolded = ref(true)
const commonFirst = (list)=>{
  const common = ['普工','司机','销售','服务员','客服']
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
  const m = jobGroups.find(g=>g.key===group.value)
  return m ? m.label : '职位'
})

// Mock 列表 + 过滤 + 分页
const mockList = computed(()=> {
  // 生成 60 条本地数据以支持分页
  const arr = []
  for (let i=0;i<60;i++) {
    const titleCat = cat.value || (groupSubcats[group.value] || ['职位'])[i % (groupSubcats[group.value]?.length || 1)]
    arr.push({
      id: i+1,
      title: `${titleCat} | 本地优选岗位 ${i+1}`,
      company: ['优选企业','认证企业','本地商家'][i%3],
      city: areas[(i%areas.length)],
      exp: ['不限','1-3年'][i%2],
      salary: ['4000-6000','7000-8500','9000-13000'][i%3] + ' 元/月',
      tags: ['包吃','包住','五险一金','周末双休','加班补助'].slice(0, 1 + (i%3)),
      logo: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='48' height='48' rx='10' fill='%23ff6a00'/><text x='50%' y='54%' fill='white' font-size='18' text-anchor='middle'>企</text></svg>`
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
    if (welfare.value !== '不限' && !(v.tags || []).includes(welfare.value)) return false
    if (jobType.value !== '不限') return true // mock 无类型字段，放过
    return true
  })
})
const displayed = computed(()=> filtered.value.slice((page.value-1)*pageSize.value, page.value*pageSize.value))
const hasMore = computed(()=> page.value * pageSize.value < filtered.value.length)
const prevPage = ()=>{ if (page.value>1) page.value-- }
const nextPage = ()=>{ if (hasMore.value) page.value++ }

const goDetail = (job)=>{
  router.push({ name: 'ServiceDetail', params: { id: job.id }, query: { type: 'job' } })
}

// 地区折叠 UI
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
.cat-bar { display: flex; gap: 8px; flex-wrap: wrap; padding: 6px 0 10px; }
.cat-chip { padding: 6px 10px; border: 1px solid #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 13px; }
.cat-chip.active { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }
 .sub-label { color: #666; font-size: 13px; margin-right: 2px; }
 .sub-more { padding: 6px 10px; border: 1px dashed #e9ecef; background: #fff; border-radius: 16px; cursor: pointer; font-size: 13px; color: #666; }
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


