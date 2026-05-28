<template>
  <div class="tc58-page">
    <div class="container">
      <!-- 顶部：标题与搜索入口 -->
      <div class="tc58-header">
        <h2 class="tc58-title">知马同城</h2>
        <div class="tc58-search-header search-widget-framed">
          <div class="search-container">
            <div class="search-input-wrapper">
              <Search class="search-icon" />
              <input 
                type="text" 
                placeholder="搜索知马同城..." 
                class="search-input"
                v-model="searchQuery"
                @keyup.enter="performSearch"
                @input="onSearchInput"
              >
              <button 
                v-if="searchQuery" 
                class="clear-search-btn"
                @click="clearSearch"
              >
                <X :size="14" />
              </button>
            </div>
            <button class="search-btn" @click="performSearch" :disabled="!searchQuery.trim()">
              搜索
            </button>
            <!-- 我要发布按钮 -->
            <button class="publish-btn" @click="goToPublish">
              <Plus class="publish-icon" />
              我要发布
            </button>
          </div>
        </div>
      </div>

      <!-- 顶部快捷模块 -->
      <div class="tc58-quick">
        <div
          v-for="m in quickModules"
          :key="m.title"
          class="quick-item"
          @click="quickNavigate(m.title)"
        >
          <component :is="m.icon" class="qi-icon" />
          <div class="qi-text">
            <div class="qi-title">{{ m.title }}</div>
          </div>
        </div>
      </div>

      <!-- 主体三栏布局：三列目录 + 右侧热门服务 -->
      <div class="tc58-layout">
        <!-- 第一列：车 + 房 -->
        <section class="tc58-column">
          <!-- 车板块 -->
          <div class="tc58-block">
            <div class="block-header" @click="goSearch('二手车')">
              <component :is="carSection.icon" class="block-icon" />
              <h3>{{ carSection.title }}</h3>
            </div>
            <div class="link-rows">
              <!-- 主类别 -->
              <div class="link-row"><a v-for="item in carSection.mainCategories" :key="item.name" @click.prevent="goSearch(item.name)">{{ item.name }}</a></div>
              <!-- 细分：价格 -->
              <div class="link-row small"><a v-for="p in carSection.details.prices" :key="p" @click.prevent="goSearch(p)">{{ p }}</a></div>
              <!-- 细分：车型 -->
              <div class="link-row small"><a v-for="t in carSection.details.bodyTypes" :key="t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <!-- 细分：品牌 -->
              <div class="link-row small mt8"><a class="row-label">热门品牌</a><a v-for="b in carSection.details.brands.slice(0, 5)" :key="'b1-'+b" @click.prevent="goSearch(b)">{{ b }}</a></div>
              <div class="link-row small"><a v-for="b in carSection.details.brands.slice(5, 10)" :key="'b2-'+b" @click.prevent="goSearch(b)">{{ b }}</a></div>
              <div class="link-row small"><a v-for="b in carSection.details.brands.slice(10)" :key="'b3-'+b" @click.prevent="goSearch(b)">{{ b }}</a></div>
              <!-- 细分：货车 -->
              <div class="link-row small mt8"><a class="row-label">货车/商用车</a><a v-for="t in carSection.details.trucks" :key="'trk-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <!-- 细分：工程车 -->
              <div class="link-row small"><a v-for="e in carSection.details.engineering" :key="'eng-'+e" @click.prevent="goSearch(e)">{{ e }}</a></div>
            </div>
          </div>

          <!-- 房板块 -->
          <div class="tc58-block">
            <div class="block-header" @click="routeToHousing()">
              <component :is="housingSection.icon" class="block-icon" />
              <h3>{{ housingSection.title }}</h3>
            </div>
            <div class="link-rows">
              <!-- 主类别 -->
              <div class="link-row"><a v-for="item in housingSection.mainCategories" :key="item.name" @click.prevent="goSearch(item.name)">{{ item.name }}</a></div>
              <!-- 细分 -->
              <div class="link-row small"><a v-for="s in housingSection.details.sell" :key="'sell-'+s" @click.prevent="goSearch(s)">{{ s }}</a></div>
              <div class="link-row small"><a v-for="r in housingSection.details.rent" :key="'rent-'+r" @click.prevent="goSearch(r)">{{ r }}</a></div>
              <div class="link-row small"><a v-for="sh in housingSection.details.shops" :key="'shop-'+sh" @click.prevent="goSearch(sh)">{{ sh }}</a></div>
              <div class="link-row small"><a v-for="o in housingSection.details.others" :key="'other-'+o" @click.prevent="goSearch(o)">{{ o }}</a></div>
            </div>
          </div>

          <!-- 装修建材（移动到房板块下） -->
          <div class="tc58-block">
            <div class="block-header" @click="goSearch('装修建材')">
              <Hammer class="block-icon" />
              <h3>装修建材</h3>
            </div>
            <div class="link-row small">
              <a v-for="t in decorate" :key="'dec-left-'+t" @click.prevent="goSearch(t)">{{ t }}</a>
            </div>
          </div>

        </section>

        <!-- 第二列：工作 -->
        <section class="tc58-column">
          <!-- 工作板块 -->
          <div class="tc58-block">
            <div class="block-header" @click="goSearch('招聘')">
              <component :is="jobSection.icon" class="block-icon" />
              <h3>{{ jobSection.title }}</h3>
            </div>
            <div class="link-rows">
              <!-- 主类别 -->
              <div class="link-row"><a v-for="item in jobSection.mainCategories" :key="item.name" @click.prevent="goSearch(item.name)">{{ item.name }}</a></div>
              <!-- 福利筛选 -->
              <div class="link-row small"><a class="row-label">福利待遇</a><a v-for="w in jobSection.details.welfare" :key="'wf-'+w" @click.prevent="goSearch(w)">{{ w }}</a></div>
              <!-- 热门职位 -->
              <div class="link-row small"><a class="row-label">司机/物流</a><a v-for="d in jobSection.details.driver" :key="'dr-'+d" @click.prevent="routeToJobsFilter(d)">{{ d }}</a></div>
              <div class="link-row small"><a class="row-label">销售</a><a v-for="s in jobSection.details.sales" :key="'sal-'+s" @click.prevent="routeToJobsFilter(s)">{{ s }}</a></div>
              <div class="link-row small"><a class="row-label">普工/技工</a><a v-for="wk in jobSection.details.worker" :key="'wk-'+wk" @click.prevent="routeToJobsFilter(wk)">{{ wk }}</a></div>
              <div class="link-row small"><a class="row-label">人事/行政</a><a v-for="ad in jobSection.details.admin" :key="'ad-'+ad" @click.prevent="routeToJobsFilter(ad)">{{ ad }}</a></div>
              <div class="link-row small"><a class="row-label">餐饮</a><a v-for="f in jobSection.details.food" :key="'fd-'+f" @click.prevent="routeToJobsFilter(f)">{{ f }}</a></div>
              <div class="link-row small"><a class="row-label">服务业</a><a v-for="sv in jobSection.details.service" :key="'sv-'+sv" @click.prevent="routeToJobsFilter(sv)">{{ sv }}</a></div>
              <div class="link-row small"><a class="row-label">美容/美发</a><a v-for="bt in jobSection.details.beauty" :key="'bt-'+bt" @click.prevent="routeToJobsFilter(bt)">{{ bt }}</a></div>
              <div class="link-row small"><a class="row-label">门店/零售</a><a v-for="rt in jobSection.details.retail" :key="'rt-'+rt" @click.prevent="routeToJobsFilter(rt)">{{ rt }}</a></div>
              <div class="link-row small"><a class="row-label">运营/客服</a><a v-for="cs in jobSection.details.cs" :key="'cs-'+cs" @click.prevent="routeToJobsFilter(cs)">{{ cs }}</a></div>
              <!-- 兼职 -->
              <div class="link-row small mt8"><a class="row-label">热门兼职</a><a v-for="pt in jobSection.details.parttime.slice(0, 5)" :key="'pt-'+pt" @click.prevent="goSearch(pt)">{{ pt }}</a></div>
              <div class="link-row small"><a v-for="pt in jobSection.details.parttime.slice(5)" :key="'pt2-'+pt" @click.prevent="goSearch(pt)">{{ pt }}</a></div>
            </div>
          </div>

        </section>

        <!-- 第三列：服务 + 生活 -->
        <section class="tc58-column">
          <!-- 服务板块 -->
          <div class="tc58-block">
            <div class="block-header" @click="goToServices">
              <component :is="serviceSection.icon" class="block-icon" />
              <h3>{{ serviceSection.title }}</h3>
            </div>
            <div class="link-rows">
              <div class="link-row"><a v-for="item in serviceSection.mainCategories" :key="item.name" @click.prevent="goSearch(item.name)">{{ item.name }}</a></div>
              <div class="link-row small"><a class="row-label">培训</a><a v-for="tr in serviceSection.details.training" :key="'tr-'+tr" @click.prevent="goSearch(tr)">{{ tr }}</a></div>
              <div class="link-row small"><a v-for="as in serviceSection.details.artSport" :key="'as-'+as" @click.prevent="goSearch(as)">{{ as }}</a></div>
              <div class="link-row small"><a v-for="vc in serviceSection.details.vocational" :key="'vc-'+vc" @click.prevent="goSearch(vc)">{{ vc }}</a></div>
              <div class="link-row small"><a class="row-label">学历</a><a v-for="dg in serviceSection.details.degree" :key="'dg-'+dg" @click.prevent="goSearch(dg)">{{ dg }}</a></div>
              <div class="link-row small"><a class="row-label">留学</a><a v-for="st in serviceSection.details.study" :key="'st-'+st" @click.prevent="goSearch(st)">{{ st }}</a></div>
              <div class="link-row small"><a class="row-label">移民</a><a v-for="im in serviceSection.details.immigration" :key="'im-'+im" @click.prevent="goSearch(im)">{{ im }}</a></div>
            </div>
          </div>

          <!-- 生活板块 -->
          <div class="tc58-block">
            <div class="block-header" @click="goToLife">
              <component :is="lifeSection.icon" class="block-icon" />
              <h3>{{ lifeSection.title }}</h3>
            </div>
            <div class="link-rows">
              <!-- 主类别 -->
              <div class="link-row"><a v-for="item in lifeSection.mainCategories.slice(0, 8)" :key="'lf1-'+item.name" @click.prevent="goSearch(item.name)">{{ item.name }}</a></div>
              <div class="link-row"><a v-for="item in lifeSection.mainCategories.slice(8)" :key="'lf2-'+item.name" @click.prevent="goSearch(item.name)">{{ item.name }}</a></div>
              <!-- 细分：二手回收 -->
              <div class="link-row small mt8"><a class="row-label">二手回收</a><a v-for="rh in lifeSection.details.recycleHome" :key="'rh-'+rh" @click.prevent="goSearch(rh)">{{ rh }}</a></div>
              <div class="link-row small"><a v-for="rd in lifeSection.details.recycleDigital" :key="'rd-'+rd" @click.prevent="goSearch(rd)">{{ rd }}</a></div>
              <div class="link-row small"><a v-for="rm in lifeSection.details.recycleMaterial" :key="'rm-'+rm" @click.prevent="goSearch(rm)">{{ rm }}</a></div>
              <!-- 细分：二手市场 -->
              <div class="link-row small mt8"><a class="row-label">二手市场</a><a v-for="sm in lifeSection.details.secondMarketCat" :key="'sm-'+sm" @click.prevent="goSearch(sm)">{{ sm }}</a></div>
              <div class="link-row small"><a v-for="ft in lifeSection.details.featured" :key="'ft-'+ft" @click.prevent="goSearch(ft)">{{ ft }}</a></div>
              
            </div>
          </div>

          <!-- 票务/卡券板块（独立板块） -->
          <div class="tc58-block">
            <div class="block-header" @click="goSearch('票务/卡券')">
              <Ticket class="block-icon" />
              <h3>票务/卡券</h3>
            </div>
            <div class="link-rows">
              <div class="link-row small"><a v-for="t in tickets.line1" :key="'tk1-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <div class="link-row small"><a v-for="t in tickets.line2" :key="'tk2-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <div class="link-row small"><a v-for="t in tickets.line3" :key="'tk3-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
            </div>
          </div>
        </section>

        <!-- 右侧功能区 -->
        <aside class="tc58-aside">
          <div class="hot-services">
            <div class="aside-title">
              <Flame class="title-icon" />
              <span>热门服务</span>
            </div>
            <div class="icon-grid">
              <div 
                v-for="s in hotServiceIcons" 
                :key="s.text" 
                class="icon-item" 
                @click="goSearch(s.text)"
              >
                <component :is="s.icon" class="ic" />
                <span>{{ s.text }}</span>
              </div>
            </div>
          </div>

          <div class="tc58-card">
            <div class="aside-title">
              <MapPin class="title-icon" />
              <span>本地服务大全</span>
            </div>
            <div class="link-row local-links">
              <a v-for="t in localServices" :key="'loc-'+t" @click.prevent="goSearch(t)">{{ t }}</a>
            </div>
          </div>

          <!-- 社交 -->
          <div class="tc58-card">
            <div class="aside-title">
              <MapPin class="title-icon" />
              <span>社交</span>
            </div>
            <div class="link-rows">
              <div class="link-row small"><a v-for="item in socialSection.mainCategories" :key="item.name" @click.prevent="goSearch(item.name)">{{ item.name }}</a></div>
              <div class="link-row small"><a v-for="act in socialSection.details.activities" :key="'act-'+act" @click.prevent="goSearch(act)">{{ act }}</a></div>
            </div>
          </div>

          <!-- 数码·通讯 -->
          <div class="tc58-card">
            <div class="aside-title">
              <Smartphone class="title-icon" />
              <span>数码·通讯</span>
            </div>
            <div class="link-rows">
              <div class="link-row small"><a v-for="t in digitalComm.phones" :key="'dg-p-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <div class="link-row small"><a v-for="t in digitalComm.desktops" :key="'dg-d-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <div class="link-row small"><a v-for="t in digitalComm.laptops" :key="'dg-l-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <div class="link-row small"><a v-for="t in digitalComm.tablets" :key="'dg-t-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <div class="link-row small"><a v-for="t in digitalComm.cameras" :key="'dg-c-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <div class="link-row small"><a v-for="t in digitalComm.equip" :key="'dg-e-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
            </div>
          </div>

          <!-- 宠物 -->
          <div class="tc58-card">
            <div class="aside-title">
              <Scissors class="title-icon" />
              <span>宠物/宠物用品寄养</span>
            </div>
            <div class="link-rows">
              <div class="link-row small"><a class="row-label">狗狗</a><a v-for="t in pets.dogs" :key="'pd-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <div class="link-row small"><a class="row-label">猫猫</a><a v-for="t in pets.cats" :key="'pc-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
              <div class="link-row small"><a v-for="t in pets.more" :key="'pm-'+t" @click.prevent="goSearch(t)">{{ t }}</a></div>
            </div>
          </div>

        </aside>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  Search, Home, CarFront, Package, Store, Briefcase, Clock, Flame, MapPin, Hammer,
  Wrench, Scale, Truck, Phone, Globe, Utensils, Car, Bike, Smartphone, Monitor, Shirt,
  GraduationCap, Building2, BedDouble, Scissors, Ticket, X, Plus
} from 'lucide-vue-next'

const router = useRouter()

// 搜索状态（复用资讯页交互）
import { ref, computed, onMounted } from 'vue'
import { ipAPI } from '@/api/common'
const searchQuery = ref('')
const performSearch = () => {
  const q = searchQuery.value.trim()
  if (!q) return
  // 跳转统一搜索页，默认 type 为 services
  router.push({ name: 'Search', query: { q, type: 'services' } })
}
const clearSearch = () => { searchQuery.value = '' }
const onSearchInput = () => {}

// 跳转到知马同城专属发布页
const goToPublish = () => {
  router.push({ name: 'ServicesPublish' })
}

// 板块标题点击导航
const goToCircles = () => {
  router.push({ name: 'Circles' })
}

const goToServices = () => {
  router.push({ name: 'ServicesList', query: { group: 'local', category: '申请公司' } })
}

const goToLife = () => {
  router.push({ name: 'ServicesList', query: { group: 'local', category: '钟点保洁' } })
}

// 城市名：默认“本地”，可从 localStorage 读取
const cityName = ref('本地')
onMounted(() => {
  const saved = localStorage.getItem('cityName')
  if (saved) cityName.value = saved
  // 拉取客户端IP并存到localStorage，未来可据此推荐城市
  try {
    ipAPI.getClientIp().then((res)=>{
      // 新接口期望 data 中包含 IP 和地理信息
      const data = res?.data || {}
      const ip = data?.ip || data?.clientIp || data
      if (ip) localStorage.setItem('client_ip', String(ip))

      // 解析归属地，尝试提取城市名（支持如 北京市/北京市朝阳区/北京/上海 等）
      const locationText = data?.location || data?.geo || data?.region || data?.address
      if (typeof locationText === 'string' && locationText) {
        const city = extractCityFromLocation(locationText)
        if (city) {
          cityName.value = city
          localStorage.setItem('cityName', city)
        }
      } else if (typeof data?.city === 'string' && data.city) {
        const city = normalizeCityName(data.city)
        cityName.value = city
        localStorage.setItem('cityName', city)
      }
    }).catch(()=>{})
  } catch(e) {}
})

// 提取中文城市名（去掉“省/市/区/县”等后缀，优先直辖市/省会常见写法）
const normalizeCityName = (raw) => {
  const text = String(raw).trim()
  if (!text) return ''
  // 直辖市特判
  const directCities = ['北京','上海','天津','重庆']
  const dc = directCities.find(c => text.startsWith(c))
  if (dc) return dc
  // 去掉省市区县等后缀
  return text.replace(/(省|市|自治区|特别行政区|地区|盟|州|县|区)$/g, '')
}

const extractCityFromLocation = (loc) => {
  const text = String(loc).trim()
  if (!text) return ''
  // 常见分隔符
  const parts = text.split(/[\s,，|｜/\\>-]+/).filter(Boolean)
  // 优先匹配含“市”或直辖市关键词的片段
  const cityLike = parts.find(p => /(北京|上海|天津|重庆).*/.test(p) || /.+市$/.test(p))
  if (cityLike) return normalizeCityName(cityLike)
  // 次选：包含常见城市名关键词（不带市）
  const fallback = parts.find(p => /(北京|上海|天津|重庆|广州|深圳|杭州|苏州|南京|武汉|成都|西安|长沙|郑州|佛山|合肥|青岛|宁波|无锡|厦门|大连|沈阳|济南|东莞|福州)/.test(p))
  if (fallback) return normalizeCityName(fallback)
  // 未命中，返回空
  return ''
}

const recruitCityTop = computed(() => [
  `${cityName.value}招聘`,
  `${cityName.value}求职简历`,
  '包吃',
  '包住',
  '周末双休',
  '学习培训',
  '快速求职'
])

// 过滤：删除“求职神器/央企国企热招/求职金卡/简历置顶/超燃招聘季/我要招人/招聘会员/校园招聘/城市求职简历”
const recruitCityTopFiltered = computed(() => {
  const remove = new Set(['求职神器','央企国企热招','求职金卡','简历置顶','超燃招聘季','我要招人','招聘会员','校园招聘'])
  return recruitCityTop.value.filter(t => !remove.has(t) && !/求职简历/.test(t))
})

// 顶部快捷模块 - 对应六大板块
const quickModules = [
  { icon: CarFront, title: '车' },
  { icon: Home, title: '房' },
  { icon: Briefcase, title: '工作' },
  { icon: MapPin, title: '社交' },
  { icon: Wrench, title: '服务' },
  { icon: Store, title: '生活' },
  { icon: Package, title: '二手回收' }
]

// ========== 新的六大板块数据结构（马来西亚本地化 + 细分内容）==========

// 车板块 - 约60个链接
const carSection = {
  title: '车',
  icon: CarFront,
  // 主类别
  mainCategories: [
    { name: '二手车', starred: false },
    { name: '租车', starred: true },
    { name: '驾校', starred: true },
    { name: '代驾', starred: true },
    { name: '美容装饰', starred: true },
    { name: '维修保养', starred: true },
    { name: 'JPJ过户', starred: true },
    { name: '新车', starred: false }
  ],
  // 细分链接（分组展示）
  details: {
    prices: ['RM 10k以下', 'RM 10k-20k', 'RM 20k-30k', 'RM 30k-50k', 'RM 50k-80k', 'RM 80k-150k', 'RM 150k以上'],
    bodyTypes: ['轿车', '跑车', 'SUV/MPV', '面包车'],
    brands: ['Perodua', 'Proton', 'Toyota', 'Honda', 'Nissan', 'Mazda', 'Mitsubishi', 'Volkswagen', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Hyundai', 'Kia'],
    trucks: ['Isuzu', 'Hino', 'Mitsubishi Fuso', 'UD Trucks', '载货车', '罗里(Lorry)', '客货车(Van)', '小货车(Pickup)'],
    engineering: ['工程车', '搅拌车', '洒水车', '挖掘机'],
    rentTypes: ['轿车', 'SUV', 'MPV', 'Van', '罗里'],
    buyServices: ['Showroom', 'JPJ过户', '车险(Insurance)', '以租代购'],
    useServices: ['改装', '配件', '维修保养'],
    newCarTypes: ['SUV', '轿车(Sedan)', 'MPV', '紧凑型(Compact)'],
    newCarPrices: ['RM 30k以下', 'RM 30k-50k', 'RM 50k-80k', 'RM 80k-120k', 'RM 120k-200k', 'RM 200k以上']
  }
}

// 房板块 - 约25个链接
const housingSection = {
  title: '房',
  icon: Home,
  mainCategories: [
    { name: '二手房', starred: false },
    { name: '新房', starred: false },
    { name: '找室友', starred: false },
    { name: '租房', starred: false },
    { name: '转租', starred: false },
    { name: '房东直租', starred: false },
    { name: '生意转让', starred: false },
    { name: '租商铺', starred: false }
  ],
  details: {
    sell: ['我要卖房', '优质房源'],
    rent: ['整租', '合租', '长租公寓', '个人房源'],
    shops: ['商铺出租', '商铺出售', '实勘铺源'],
    others: ['厂房', '仓库', '土地', '车位']
  }
}

// 工作板块 - 约80个链接
const jobSection = {
  title: '工作',
  icon: Briefcase,
  mainCategories: [
    { name: '全职工作', starred: false },
    { name: '兼职工作', starred: false },
    { name: '快速招人', starred: false },
    { name: '附近工作', starred: false }
  ],
  details: {
    welfare: ['包吃', '包住', '双休', 'EPF/SOCSO', '培训机会'],
    driver: ['送餐员', 'Grab骑手', '货运司机', '商务司机'],
    sales: ['销售专员', '电话销售', '网络销售', '汽车销售'],
    worker: ['普工', '操作工', '装卸/搬运工', '焊工', '车床工'],
    admin: ['文员', '前台/接待', '人事专员/助理', '会计'],
    food: ['服务员', '后厨', '厨师', '配菜', '厨师长'],
    service: ['保洁', '健身教练', '汽车维修', '保姆'],
    beauty: ['美容师', '按摩师', '美甲师', 'SPA技师'],
    retail: ['店员/营业员', '收银员', '促销/导购员'],
    cs: ['客服专员/助理', '电话客服', '售后客服'],
    media: ['模特/演员', '带货主播', '娱乐主播'],
    production: ['质量管理/测试', '缝纫工', '电气工程师'],
    construction: ['工程资料员', '项目管理', '木工'],
    security: ['保安', '安检员', '消防员', '门卫'],
    industries: ['客服', '保安', '服务员', '外贸', '送餐员', 'Shopee美工', 'Lazada客服', '网络销售', '程序员', '商务司机', '汽车销售', '叉车司机', '会计', '外汇', '金融', '出纳', '投资', '设计师', '前台', '销售代表', '卖场经理'],
    parttime: ['配送', '传单派发', '钟点工', '促销导购', '家教', '会计', '翻译', '美工', '法务', '化妆师', '健身教练', '护工', '汽车陪练', '礼仪模特', '司仪', '驻唱']
  }
}

// 社交板块 - 约8个链接
const socialSection = {
  title: '社交',
  icon: MapPin,
  mainCategories: [
    { name: '找搭子', starred: false },
    { name: '组局', starred: false },
    { name: '活动', starred: false }
  ],
  details: {
    activities: ['狼人杀', '运动', '娱乐', '聚会', '户外']
  }
}

// 服务板块 - 约30个链接
const serviceSection = {
  title: '服务',
  icon: Wrench,
  mainCategories: [
    { name: '申请公司', starred: true },
    { name: '代办执照', starred: true },
    { name: '供应商', starred: true },
    { name: '跨境物流', starred: true },
    { name: '合法外劳', starred: true },
    { name: '网站建设', starred: true },
    { name: '软件开发', starred: true },
    { name: '餐饮加盟', starred: true },
    { name: '喷绘招牌', starred: true },
    { name: '开锁换锁', starred: true },
    { name: '家政工作', starred: true },
    { name: '租赁', starred: true },
    { name: '教育培训', starred: false }
  ],
  details: {
    training: ['职业', '管理', '设计', 'IT'],
    artSport: ['艺术', '体育', '语言'],
    vocational: ['美容', '餐饮', '技工', '会计'],
    degree: ['私立大学', '技术文凭', '专业证书', 'MBA'],
    study: ['新加坡', '英国', '澳洲'],
    immigration: ['新加坡', '澳洲', '加拿大']
  }
}

// 生活板块 - 约120个链接
const lifeSection = {
  title: '生活',
  icon: Store,
  mainCategories: [
    { name: '钟点保洁', starred: true },
    { name: '搬家搬运', starred: true },
    { name: '保姆', starred: true },
    { name: '房屋维修', starred: true },
    { name: '家电维修', starred: true },
    { name: '管道疏通', starred: true },
    { name: '建材', starred: true },
    { name: '家装', starred: true },
    { name: '房屋装修', starred: true },
    { name: '生活配送', starred: true },
    { name: '二手回收', starred: true },
    { name: '二手家具', starred: false },
    { name: '二手家电', starred: true },
    { name: '二手电脑', starred: true },
    { name: '宠物', starred: true },
    { name: '二手市场', starred: false },
    { name: '数码·通讯', starred: false },
    { name: '票务/卡券', starred: false }
  ],
  details: {
    renovation: ['全屋定制', '瓷砖地板', '防水补漏', '水电改造', '软装搭配', '家具家私'],
    recycleHome: ['家具', '家电', '数码', '服装', '日用品'],
    recycleDigital: ['手机', '平板', '笔记本', '相机', '配件'],
    recycleMaterial: ['废纸', '金属', '建筑废料', '塑料', '电线电缆'],
    appliances: ['空调', '冰箱', '洗衣机', '电视', '音响', '热水器'],
    furniture: ['衣柜', '沙发', '桌子', '床', '椅子凳子', '茶几'],
    computer: ['笔记本', '平板', '显示器'],
    machinery: ['工厂', '机械', '发电机'],
    industrial: ['废纸', '金属', '建筑废料', '塑料', '库存积压', '玻璃', '电池', '纺织皮革', '电子'],
    luxury: ['金银', '礼品', '艺术品'],
    officeHotel: ['打印机', '复印机', '墨盒', '厨房设备', '酒店设备', '钢琴', '图书', '桌球'],
    officeFurniture: ['老板台', '文件柜', '桌椅'],
    secondMarketCat: ['摩托车', '自行车', '乐器', '运动户外', '图书', '家居家装', '母婴用品', '美妆护肤', '礼品文玩', '办公设备'],
    featured: ['特惠九成新家具', '摩托卖场', '高性价比家电', '家具送货上门'],
    secondAppliances: ['二手家电', '空调', '电视', '冰箱', '二手家具', '沙发', '床', '桌椅'],
    officeEquip: ['办公设备', '办公家具', '桌', '椅'],
    transport: ['电动车', '自行车', '三轮车', '百货设备'],
    misc: ['家居日用', '厨具', '灯具', '床品', '母婴用品', '婴幼服', '玩具', '服装箱包', '手表', '服饰', '木工', '电力', '仪器', '健身', '麻将', '古玩', '把件', '字画', '美容保健', '图书音像', '通讯业务', '礼品转让', '交换', '二手求购', '其他二手'],
    petDog: ['泰迪', '柯基', '拉布拉多', '哈士奇', '金毛', '阿拉斯加', '斗牛犬', '博美', '萨摩耶'],
    petCat: ['短毛猫', '加菲猫', '蓝猫'],
    petMore: ['鱼', '花', '用品服务', '鱼缸', '宠物寄养'],
    phones: ['二手手机', 'iPhone', 'Samsung', 'Xiaomi'],
    desktop: ['台式电脑', '台式机', '硬件'],
    laptop: ['笔记本', 'MacBook', 'Lenovo'],
    tablet: ['平板电脑', 'Samsung', 'iPad'],
    camera: ['数码产品', '相机', '游戏机'],
    equipment: ['二手设备', '机床', '化工', '箱房'],
    tickets: ['网购卡', '电影票卡', '手机充值卡', '游乐园景点', '购物卡', '健身卡', '游泳卡', '其他票务', '特价机票']
  }
}

// 旧数据保留用于兼容现有跳转逻辑
const cars = {
  price: ['0-3万', '3-5万', '5-8万', '8-10万', '10-15万', '15-20万', '>20万'],
  body: ['轿车', '跑车', 'SUV/MPV', '面包车']
}
cars.brands1 = ['大众', '别克', '福特', '标致', '雪佛兰']
cars.brands2 = ['丰田', '本田', '现代', '日产', '马自达']
cars.brands3 = ['五菱', '吉利', '奇瑞', '长安', '比亚迪', '奥迪', '宝马', '奔驰', '雷克萨斯']
cars.truckBrands = ['东风', '解放', '福田', '挂车']
cars.truckTypes = ['载货车', '自卸车', '牵引车', '客车']
cars.engineering = ['工程车', '搅拌车', '洒水车', '挖掘机']

// 数据 - 二手/回收
const recycle = {
  home: ['家具', '家电', '数码', '服装', '日用品'],
  digital: ['手机', '平板', '笔记本', '相机', '配件'],
  material: ['废纸', '金属', '建筑废料', '塑料', '电线电缆']
}

const recycleDetail = {
  appliances: ['空调', '冰箱', '洗衣机', '电视', '音响', '热水器'],
  furniture: ['衣柜', '沙发', '桌子', '床', '椅子凳子', '茶几'],
  computers: ['笔记本', '平板', '显示器'],
  machines: ['工厂', '机械', '发电机'],
  industry: ['废纸', '金属', '建筑废料', '塑料', '库存积压', '玻璃', '电池', '纺织皮革', '电子'],
  luxury: ['金银', '礼品', '艺术品'],
  officeHotel: ['打印机', '复印机', '墨盒', '厨房设备', '酒店设备', '钢琴', '图书', '桌球'],
  officeFurniture: ['老板台', '文件柜', '桌椅']
}

// 数据 - 二手市场
const secondMarket = {
  categories: ['摩托车', '自行车', '乐器', '运动户外', '图书', '宠物'],
  more: ['家居家装', '母婴用品', '美妆护肤', '礼品文玩', '办公设备']
}

const secondMarketDetail = {
  line1: ['特惠九成新家具', '摩托卖场', '高性价比家电', '家具送货上门'],
  line2: ['二手家电', '空调', '电视', '冰箱', '二手家具', '沙发', '床', '桌椅'],
  line3: ['办公设备', '办公家具', '桌', '椅', '电动车', '自行车', '三轮车', '百货设备'],
  line4: ['家居日用', '厨具', '灯具', '床品', '母婴用品', '婴幼服', '玩具', '服装箱包', '手表', '服饰', '设备买卖', '木工', '电力', '仪器', '文体户外', '健身', '麻将', '艺术收藏', '古玩', '把件', '字画', '成人用品', '美容保健', '图书音像', '通讯业务', '礼品转让', '交换', '二手求购', '其他二手']
}

// 数据 - 招聘
const jobs = {
  hot: ['包吃', '包住', '周末双休', '五险一金', '短期工', '临时工'],
  dept: ['销售', '客服', '文员', '人事/行政', '财务/会计', '司机/后勤'],
  trade: ['餐饮', '酒店', '美容/美发', '汽车服务', '物流/仓储', '教育/培训']
}

const parttime = ['促销', '配送', '钟点工', '快递', '地推', '家教', '线上兼职']

// 兼容旧变量（不再使用）
const recruitBeijing = { top: [] }

const hotJobs = [
  '司机/物流', '送餐员', '外卖骑手', '货运司机', '商务司机',
  '销售', '销售专员', '电话销售', '网络销售', '汽车销售',
  '普工/技工', '普工', '操作工', '装卸/搬运工', '焊工', '车床工',
  '人事/行政', '文员', '前台/接待', '人事专员/助理', '会计',
  '餐饮', '服务员', '后厨', '厨师', '配菜/打荷', '厨师长',
  '服务业', '保洁', '健身教练', '汽车维修', '月嫂',
  '美容/美发', '美容师', '足疗师', '按摩师', '美甲师',
  '门店/零售', '店员/营业员', '收银员', '促销/导购员',
  '运营/客服', '客服专员/助理', '电话客服', '售后客服',
  '传媒/影视', '模特/演员', '带货主播', '娱乐主播',
  '生产制造', '质量管理/测试', '缝纫工', '电气工程师',
  '房地产建筑', '工程资料员', '项目管理', '木工',
  '安保消防', '保安', '安检员', '安全消防', '门卫'
]

const beijingParttime = ['配送', '传单派发', '钟点工', '促销导购', '家教', '会计', '翻译', '美工', '法务', '化妆师', '健身教练', '护工', '汽车陪练', '礼仪模特', '司仪', '驻唱']

const hotIndustry = [
  '服务业', '客服', '保安', '服务员', '外贸', '送餐员',
  'IT/互联网', '淘宝美工', '淘宝客服', '网络销售', '程序员',
  '汽车/制造', '商务司机', '汽车销售', '叉车司机', '货运司机',
  '金融/会计', '会计', '外汇', '金融', '出纳', '投资',
  '写字楼', '文员', '设计师', '前台', '销售代表', '电话销售',
  '商场超市', '收银员', '促销导购', '卖场经理'
]

// 新车/汽车服务
const newCars = ['SUV', '小型车', '紧凑型车', '中型车']
const newCarPrices = ['0-5万', '5-10万', '10-15万', '15-20万', '国产车', '更多新车']
const autoService = {
  rent: ['货车', '大巴', '中巴', '面包'],
  buy: ['4S店', '保险', '过户验车', '以租代购'],
  use: ['代办上牌', '改装', '配件'],
  maintain: ['维修保养', '美容装饰'],
  learn: ['驾校', '代驾·司机外派', '陪练']
}

// 教培/便民
const eduTraining = {
  train: ['职业', '管理', '设计', 'IT'],
  artSportLang: ['艺术', '体育', '语言'],
  vocational: ['美容', '餐饮', '技工', '会计'],
  degree: ['成考', '自考', '考研', '考博'],
  studyAbroad: ['美国', '日本', '英国'],
  immigration: ['美国', '加拿大', '澳洲']
}

// 已删除便民服务模块

// 数码/宠物/票务
// 右侧边栏数据（马来西亚本地化）
const digitalComm = {
  phones: ['二手手机', 'iPhone', 'Samsung', 'Xiaomi'],
  desktops: ['台式电脑', '台式机', '硬件'],
  laptops: ['笔记本', 'MacBook', 'Lenovo'],
  tablets: ['平板电脑', 'Samsung', 'iPad'],
  cameras: ['数码产品', '相机', '游戏机'],
  equip: ['二手设备', '机床', '化工', '箱房']
}

const pets = {
  dogs: ['泰迪', '柯基', '拉布拉多', '哈士奇', '金毛', '阿拉斯加', '斗牛犬', '博美', '萨摩耶'],
  cats: ['短毛猫', '加菲猫', '蓝猫'],
  more: ['鱼', '花', '用品服务', '鱼缸', '宠物寄养']
}

const tickets = {
  line1: ['网购卡', '电影票卡', '手机充值卡', '游乐园景点'],
  line2: ['购物卡', '健身卡', '游泳卡', '其他票务'],
  line3: ['特价机票']
}

// 右侧 - 热门服务图标
const hotServiceIcons = [
  { icon: Wrench, text: '家电维修' },
  { icon: Scale, text: '法律咨询' },
  { icon: Truck, text: '货运物流' },
  { icon: Phone, text: '数码维修' },
  { icon: Globe, text: '网络服务' },
  { icon: Utensils, text: '到家美食' },
  { icon: Car, text: '汽车保养' },
  { icon: Bike, text: '搬家拉货' },
  { icon: Smartphone, text: '手机回收' },
  { icon: Monitor, text: '电脑维修' },
  { icon: Shirt, text: '洗衣到家' },
  { icon: GraduationCap, text: '学习培训' }
]

const localServices = ['灵活用工', '保洁保姆', '开锁换锁', '疏通维修', '空调清洗', '家电安装', '摄影摄像', '宠物服务']
const decorate = ['全屋定制', '瓷砖地板', '防水补漏', '水电改造', '软装搭配', '家具家私']

// 统一识别为“服务类”的关键词集合，用于避免兜底跳资讯
const serviceKeywordSet = new Set([
  ...localServices,
  ...decorate,
  // 二手回收全量关键词
  ...recycle.home,
  ...recycle.digital,
  ...recycle.material,
  ...recycleDetail.appliances,
  ...recycleDetail.furniture,
  ...recycleDetail.computers,
  ...recycleDetail.machines,
  ...recycleDetail.industry,
  ...recycleDetail.luxury,
  ...recycleDetail.officeHotel,
  ...recycleDetail.officeFurniture,
  '二手回收',
  ...digitalComm.phones,
  ...digitalComm.desktops,
  ...digitalComm.laptops,
  ...digitalComm.tablets,
  ...digitalComm.cameras,
  ...digitalComm.equip,
  ...pets.dogs,
  ...pets.cats,
  ...pets.more,
  ...tickets.line1,
  ...tickets.line2,
  ...tickets.line3,
  ...autoService.rent,
  ...autoService.buy,
  ...autoService.use,
  ...autoService.maintain,
  ...autoService.learn,
  '知马陪练',
  ...hotServiceIcons.map(i=>i.text),
  '数码·通讯','宠物/宠物用品寄养','票务/卡券','便民服务','汽车服务'
])

// === 智能跳转：将服务页关键词映射为列表页对应的“筛选标签”高亮 ===
const allCarBrands = [
  ...cars.brands1,
  ...cars.brands2,
  ...cars.brands3,
  ...cars.truckBrands,
  // 扩展常见品牌，保障来自图块/热门词也能识别
  '凯迪拉克','沃尔沃','路虎','保时捷','斯柯达','雷诺','铃木','起亚','长城','哈弗','比亚迪','吉利','奇瑞','长安','马自达','福特'
]

const carBodies = ['轿车','SUV/MPV','跑车','面包车','货车','工程车']
const carBodySynonyms = {
  'SUV': 'SUV/MPV',
  'MPV': 'SUV/MPV',
}

const carPrices = [...cars.price]

const jobCats = ['服务员','育婴师','司机','销售','客服','普工/技工']
// 与 JobsFilter 的 group 对应关系
const jobGroupMap = {
  '普工/技工': 'pgjg',
  '司机/物流': 'sjiwl',
  '销售': 'xiaoshou',
  '餐饮': 'canyin',
  '门店/零售': 'mendian',
  '安保消防': 'anbao',
  '运营/客服': 'yunying',
  '人事/行政': 'renshi',
  '人事/行政/财务': 'renshi',
  '服务业': 'fuwu',
  '生产制造': 'shengchan',
  '传媒/影视': 'chuanmei',
  '传媒/影视/直播': 'chuanmei',
  '美容/美发': 'meifa',
  '美发/美容/保健': 'meifa',
  '医疗/健康': 'yiliao',
  '设计': 'sheji',
  '市场': 'shichang',
  '房地产建筑': 'fangchan',
  '金融/贸易': 'jinrong',
  '教育培训': 'jiaoyu',
  '互联网/通信': 'hulianwang',
}

// 细类到 group 的近似映射（用于热门职位/行业超链接）
const subcatToGroup = {
  // 司机物流
  '司机/物流': 'sjiwl', '送餐员': 'sjiwl', '外卖骑手': 'sjiwl', '货运司机': 'sjiwl', '商务司机': 'sjiwl', '叉车司机':'sjiwl',
  // 销售
  '销售': 'xiaoshou', '销售专员': 'xiaoshou', '电话销售': 'xiaoshou', '网络销售': 'xiaoshou', '汽车销售': 'xiaoshou', '销售代表': 'xiaoshou',
  // 普工技工
  '普工/技工': 'pgjg', '普工': 'pgjg', '操作工': 'pgjg', '装卸/搬运工': 'pgjg', '焊工': 'pgjg', '车床工': 'pgjg', '电气工程师': 'pgjg', '质量管理/测试': 'pgjg', '缝纫工': 'pgjg', '木工': 'pgjg',
  // 人事行政财务
  '人事/行政': 'renshi', '文员': 'renshi', '前台/接待': 'renshi', '人事专员/助理': 'renshi', '会计': 'renshi', '出纳': 'renshi',
  // 餐饮
  '餐饮': 'canyin', '服务员': 'canyin', '后厨': 'canyin', '厨师': 'canyin', '配菜/打荷': 'canyin', '厨师长': 'canyin',
  // 服务业
  '服务业': 'fuwu', '保洁': 'fuwu', '健身教练': 'fuwu', '汽车维修': 'fuwu', '月嫂': 'fuwu',
  // 美容
  '美容/美发': 'meifa', '美容师': 'meifa', '足疗师': 'meifa', '按摩师': 'meifa', '美甲师': 'meifa',
  // 门店零售
  '门店/零售': 'mendian', '店员/营业员': 'mendian', '收银员': 'mendian', '促销/导购员': 'mendian', '促销导购': 'mendian',
  // 运营客服
  '运营/客服': 'yunying', '客服': 'yunying', '客服专员/助理': 'yunying', '电话客服': 'yunying', '售后客服': 'yunying',
  // 传媒
  '传媒/影视': 'chuanmei', '模特/演员': 'chuanmei', '带货主播': 'chuanmei', '娱乐主播': 'chuanmei', '主播': 'chuanmei',
  // 生产制造
  '生产制造': 'shengchan', '项目管理': 'shengchan',
  // 房地产建筑
  '房地产建筑': 'fangchan', '工程资料员': 'fangchan',
  // 安保
  '安保消防': 'anbao', '保安': 'anbao', '安检员': 'anbao', '安全消防': 'anbao', '门卫': 'anbao',
  // IT/互联网
  'IT/互联网': 'hulianwang', '程序员': 'hulianwang', '淘宝美工': 'hulianwang', '淘宝客服': 'hulianwang', '网络销售': 'xiaoshou',
  // 金融
  '金融/会计': 'jinrong', '金融': 'jinrong', '外汇': 'jinrong', '投资': 'jinrong',
  // 写字楼/商场
  '写字楼': 'renshi', '文员': 'renshi', '设计师': 'sheji', '前台': 'renshi',
  '商场超市': 'mendian', '收银员': 'mendian', '卖场经理': 'mendian'
}

const routeToJobsFilter = (text) => {
  const q = {}
  // 如果命中大类
  if (jobGroupMap[text]) {
    q.group = jobGroupMap[text]
  }
  // 细类 → 猜测 group + 设置 cat
  if (!q.group && subcatToGroup[text]) {
    q.group = subcatToGroup[text]
  }
  // 设置 cat：若是明确的职位细类或大类本身
  if (text && text.length <= 6 && !/招聘|求职简历/.test(text)) {
    // 大类中文本身不作为 cat（除“普工/技工”可直接用于筛选）
    if (text === '普工/技工') q.cat = '普工/技工'
    else if (!jobGroupMap[text]) q.cat = text
  }
  // 福利词
  if (/(周末双休|五险一金|包吃|包住|包吃包住|包吃住)/.test(text)) {
    // 兼容“包吃包住/包吃住”，拆分优先为“包吃”
    const w = (text.includes('包吃包住') || text.includes('包吃住')) ? '包吃' : text
    q.welfare = w
  }
  // 默认 group 兜底：若只有福利词，则指向常见大类“运营/客服”以展示更多岗位
  if (!q.group && q.welfare) q.group = 'yunying'
  router.push({ name: 'JobsFilter', query: q })
}
const jobAreaList = ['全北京','朝阳','海淀','丰台','昌平','通州']
const jobWelfares = ['包吃','包住','五险一金','周末双休','加班补助']

const routeToCars = (text) => {
  const q = {}
  // 价格
  if (carPrices.includes(text)) q.price = text
  // 车身类型
  const bodyKey = carBodySynonyms[text] || text
  if (carBodies.includes(bodyKey)) q.body = bodyKey
  // 品牌（含卡车品牌）
  if (allCarBrands.includes(text)) q.brand = text
  // 货车细分
  if (['载货车','自卸车','牵引车','客车'].includes(text)) q.body = '货车'
  // 工程车细分
  if (['工程车','搅拌车','洒水车','挖掘机'].includes(text)) q.body = '工程车'
  router.push({ name: 'CarsList', query: q })
}

const routeToRent = (text) => {
  const q = {}
  if (['整租','合租'].includes(text)) q.mode = text
  if (/^\d{2,4}-\d{2,4}元$/.test(text) || text.endsWith('元以上')) q.rent = text
  if (['朝阳','海淀','丰台','通州','昌平'].includes(text)) q.area = text
  router.push({ name: 'RentList', query: q })
}

const routeToJobs = (text) => {
  const q = {}
  // 职位大类映射（包含若干同义词）
  if (jobCats.includes(text)) q.cat = text
  else if (/(司机|驾驶)/.test(text)) q.cat = '司机'
  else if (/(服务员|餐饮|后厨|厨师)/.test(text)) q.cat = '服务员'
  else if (/(客服)/.test(text)) q.cat = '客服'
  else if (/(销售)/.test(text)) q.cat = '销售'
  else if (/(普工|技工|焊工|操作工|装卸)/.test(text)) q.cat = '普工/技工'

  // 地区
  if (jobAreaList.includes(text)) q.area = text

  // 福利
  if (jobWelfares.includes(text)) q.welfare = text
  if (/(包吃包住|包吃住)/.test(text)) q.welfare = '包吃'

  router.push({ name: 'JobsList', query: q })
}

// 顶部快捷按钮直达
const quickNavigate = (title) => {
  switch (title) {
    case '车':
      router.push({ name: 'CarsList' })
      return
    case '房':
      router.push({ name: 'HousingHome', query: { city: cityName.value } })
      return
    case '工作':
      router.push({ name: 'JobsList' })
      return
    case '社交':
      router.push({ name: 'Circles' })
      return
    case '服务':
      router.push({ name: 'ServicesList', query: { group: 'local', category: '申请公司' } })
      return
    case '生活':
      router.push({ name: 'ServicesList', query: { group: 'local', category: '钟点保洁' } })
      return
    case '二手回收':
      router.push({ name: 'ServicesList', query: { group: 'recycle', category: '二手回收' } })
      return
    default:
      goSearch(title)
  }
}

// 新板块路由映射 - 带*项目跳转到服务列表页（包含马来西亚本地化）
const starredServices = new Set([
  // 车板块
  '驾校', '代驾', '美容装饰', '维修保养', '过户验车', 'JPJ过户', '租车',
  // 服务板块
  '申请公司', '代办执照', '供应商', '跨境物流', '合法外劳', '网站建设', '软件开发', '餐饮加盟', '喷绘招牌', '开锁换锁', '家政工作', '租赁',
  // 生活板块
  '钟点保洁', '搬家搬运', '保姆月嫂', '保姆', '房屋维修', '家电维修', '管道疏通', '建材', '家装', '房屋装修', '生活配送', '二手回收', '二手家电', '二手电脑', '宠物'
])

// 路由跳转（智能识别 - 马来西亚本地化）
const goSearch = (keyword) => {
  const text = String(keyword || '').trim()
  if (!text) return
  
  // 优先检查是否为带*的服务项
  if (starredServices.has(text)) {
    router.push({ name: 'ServicesList', query: { category: text } })
    return
  }
  
  // 社交板块路由
  if (['找搭子', '组局', '活动', '狼人杀', '运动', '娱乐', '聚会', '户外'].includes(text)) {
    router.push({ name: 'Circles', query: { category: text } })
    return
  }
  
  // 工作板块路由
  if (['全职工作', '快速招人', '附近工作'].includes(text)) {
    router.push({ name: 'JobsList' })
    return
  }
  if (text === '兼职工作') {
    router.push({ name: 'JobsList', query: { type: '兼职' } })
    return
  }
  // 福利关键词
  if (['包吃', '包住', '双休', 'EPF/SOCSO', '培训机会'].includes(text)) {
    router.push({ name: 'JobsList', query: { welfare: text } })
    return
  }
  // 马来西亚特定职位关键词
  if (['Grab骑手', 'Shopee美工', 'Lazada客服', 'SPA技师'].includes(text)) {
    routeToJobsFilter(text)
    return
  }
  
  // 房板块路由
  if (['找室友', '转租', '房东直租', '租商铺'].includes(text)) {
    router.push({ name: 'HousingHome', query: { city: cityName.value, filter: text } })
    return
  }
  if (text === '二手房') {
    router.push({ name: 'HousingSecondhand' })
    return
  }
  if (text === '新房') {
    router.push({ name: 'HousingNew' })
    return
  }
  if (text === '租房') {
    router.push({ name: 'RentList' })
    return
  }
  if (text === '生意转让') {
    router.push({ name: 'HousingShops', query: { group: 'biz', cat: '生意转让' } })
    return
  }
  
  // 车板块路由 - 马来西亚本地化
  if (text === '二手车') {
    router.push({ name: 'CarsList' })
    return
  }
  if (text === '新车') {
    router.push({ name: 'CarsList', query: { type: '新车' } })
    return
  }
  // 马币价格区间
  if (/^RM\s*\d+k/.test(text)) {
    router.push({ name: 'CarsList', query: { price: text } })
    return
  }
  // 马来西亚特有品牌
  if (['Perodua', 'Proton', 'Isuzu', 'Hino', 'Mitsubishi Fuso', 'UD Trucks'].includes(text)) {
    router.push({ name: 'CarsList', query: { brand: text } })
    return
  }
  // 车辆类型（含马来西亚特色）
  if (['罗里(Lorry)', '客货车(Van)', '小货车(Pickup)', '罗里', 'Van', 'Showroom', '车险(Insurance)'].includes(text)) {
    router.push({ name: 'ServicesList', query: { category: text } })
    return
  }
  
  // 生活板块 - 二手家具
  if (text === '二手家具') {
    router.push({ name: 'ServicesList', query: { group: 'secondhand', category: '二手家具' } })
    return
  }
  // 生活板块 - 数码品牌
  if (['iPhone', 'Samsung', 'Xiaomi', 'MacBook', 'Lenovo', 'iPad'].includes(text)) {
    router.push({ name: 'ServicesList', query: { group: 'secondhand', category: text } })
    return
  }
  
  // 教育培训 - 马来西亚本地化
  if (['私立大学', '技术文凭', '专业证书', 'MBA', '新加坡', '澳洲', '加拿大'].includes(text)) {
    router.push({ name: 'ServicesList', query: { category: '教育培训', subcategory: text } })
    return
  }
  
  // 服务类关键词 → 服务列表页（58同城式）
  if (serviceKeywordSet.has(text) || /(家电维修|空调拆装|空调清洗|搬家|搬家拉货|货运物流|手机回收|电脑维修|开锁|换锁|疏通|保洁|保姆|洗衣|学习培训|网络服务|汽车保养)/.test(text)) {
    router.push({ name: 'ServicesList', query: { category: text } })
    return
  }
  if (/(二手车|轿车|SUV|MPV|跑车|面包车|货车|工程车|新车|汽车|凯迪拉克|沃尔沃|路虎|保时捷|奥迪|宝马|奔驰|大众|丰田|本田|日产|别克|福特|标致|雪佛兰|马自达|比亚迪|吉利|奇瑞|长安|雷克萨斯|东风|解放|福田)/.test(text) || carPrices.includes(text)) {
    routeToCars(text)
    return
  }
  // 房产相关：从同城页先进入房产首页，再选择分类进入筛选
  if (/(整租|合租|租|出租|房|公寓|写字楼|商铺|个人房源|长租公寓|本地房产|我要卖房|二手房|安选房源|新房|生意转让|实勘铺源|办公楼盘|联合办公|厂房|仓库|土地|车位)/.test(text)) {
    routeToHousing()
    return
  }
  if (/(招聘|兼职|求职|职位|岗位|简历|服务员|育婴|司机|销售|客服|普工|技工|五险一金|周末双休|包吃|包住)/.test(text)) {
    routeToJobs(text)
    return
  }
  // 兜底：若非服务/车/房/招聘已覆盖的关键词，最后再到资讯
  router.push({ name: 'News', query: { q: text || '本地服务' } })
}

// 路由：进入房产首页（携带城市名，供房产页展示）
const routeToHousing = () => {
  router.push({ name: 'HousingHome', query: { city: cityName.value } })
}

// 直接进入房产筛选页并高亮对应标签
const routeToHousingFilter = (text) => {
  const t = String(text || '').trim()
  // 租房：整租/合租/长租公寓/个人房源 → RentList
  if (['整租','合租','长租公寓','个人房源'].includes(t)) {
    const q = { group: 'feature', cat: t }
    if (t === '整租' || t === '合租') { q.group = 'mode'; q.cat = t }
    router.push({ name: 'RentList', query: q })
    return
  }
  // 销售：二手房/安选房源 → 二手房页；新房 → 新房页
  if (t === '二手房' || t === '安选房源') {
    router.push({ name: 'HousingSecondhand', query: { group: 'tese', cat: t } })
    return
  }
  if (t === '新房') {
    router.push({ name: 'HousingNew', query: { group: 'tese', cat: '精装修' } })
    return
  }
  // 商业地产相关 → 商业地产页（使用 group & cat 作为高亮）
  if (['商铺出租','商铺出售','生意转让','实勘铺源','写字楼出租','写字楼出售','办公楼盘','联合办公','厂房','仓库','土地','车位'].includes(t)) {
    router.push({ name: 'HousingShops', query: { group: 'biz', cat: t } })
    return
  }
  // 其他默认回到房产首页
  routeToHousing()
}
</script>

<style scoped>
.tc58-page {
  background: #fff;
  min-height: 100vh;
}

.tc58-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.tc58-title {
  margin: 0;
  font-size: 28px;
  color: #FF6A00;
  font-weight: 400;
  font-family: 'YouSheBiaoTiHei', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  font-style: normal;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(255, 106, 0, 0.2);
}

/* 资讯页搜索框风格（复用 NewsPage 样式变量名） */
.tc58-search-header { max-width: 620px; width: 100%; }
.search-widget-framed { background: transparent; border: none; border-radius: 0; box-shadow: none; }
.search-container { display: flex; gap: 8px; padding: 10px; }
.publish-btn { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  padding: 14px 24px; 
  background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%); 
  color: #fff; 
  border: none; 
  border-radius: 12px; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all .3s ease; 
  white-space: nowrap; 
  font-size: 16px;
  box-shadow: 0 3px 12px rgba(255, 107, 53, 0.25);
  min-width: 140px;
}
.publish-btn:hover { 
  background: linear-gradient(135deg, #e55a2b 0%, #d44a1a 100%); 
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.35);
}
.publish-icon { width: 20px; height: 20px; }
.search-input-wrapper { flex: 1; position: relative; display: flex; align-items: center; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 12px; transition: all .3s ease; }
.search-input-wrapper:focus-within { border-color: #ff6b35; box-shadow: 0 0 0 3px rgba(255,107,53,.1); }
.search-icon { position: absolute; left: 12px; color: #6c757d; pointer-events: none; }
.search-input { width: 100%; padding: 10px 12px 10px 40px; border: none; background: transparent; outline: none; font-size: 14px; color: #333; }
.clear-search-btn { position: absolute; right: 8px; background: transparent; border: none; color: #6c757d; cursor: pointer; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all .2s ease; }
.clear-search-btn:hover { background: #e9ecef; color: #333; }
.search-btn { padding: 10px 16px; background: #ff6b35; color: #fff; border: none; border-radius: 12px; font-weight: 500; cursor: pointer; transition: all .3s ease; white-space: nowrap; }
.search-btn:hover:not(:disabled) { background: #e55a2b; }
.search-btn:disabled { background: #dee2e6; color: #6c757d; cursor: not-allowed; transform: none; }

/* 顶部快捷模块样式 */
.tc58-quick { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; padding: 12px 0 4px 0; }
.quick-item { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid #eee; border-radius: 10px; padding: 10px 12px; cursor: pointer; transition: box-shadow .2s, transform .2s; }
.quick-item:hover { box-shadow: 0 6px 16px rgba(0,0,0,.06); }
.qi-icon { width: 22px; height: 22px; color: #ff6a00; }
.qi-text { display: flex; flex-direction: column; line-height: 1.1; }
.qi-title { font-size: 14px; color: #333; font-weight: 600; }

.tc58-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 300px;
  gap: 14px;
  padding: 16px 0 32px 0;
}

.tc58-column {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tc58-block {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 14px;
}

.block-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}
.block-header h3 { margin: 0; font-size: 16px; color: #333; }
.block-header .block-icon { width: 18px; height: 18px; color: #ff6a00; }

.link-rows { display: flex; flex-direction: column; gap: 8px; }
.link-row { display: flex; flex-wrap: wrap; gap: 10px 12px; }
.link-row.small a { font-size: 14px; }
.link-row a {
  color: #0b76e0;
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
}
.link-row a:hover { text-decoration: underline; }

.tag-list { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-list span {
  font-size: 12px;
  color: #555;
  background: #f6f7f9;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 2px 8px;
  cursor: pointer;
}
.tag-list span:hover { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }

.mt8 { margin-top: 8px; }

/* 右侧 */
.tc58-aside { display: flex; flex-direction: column; gap: 14px; }
.tc58-card, .hot-services {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 14px;
}
.aside-title { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; color: #333; font-weight: 600; }
.aside-title .title-icon { width: 18px; height: 18px; color: #ff6a00; }

.icon-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.icon-item { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 6px; border-radius: 8px; cursor: pointer; transition: background .2s; }
.icon-item:hover { background: rgba(255,106,0,.08); }
.icon-item .ic { width: 22px; height: 22px; color: #ff6a00; }
.icon-item span { font-size: 12px; color: #666; text-align: center; }

.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-cloud span { font-size: 12px; color: #555; background: #f6f7f9; border: 1px solid #eee; border-radius: 12px; padding: 2px 8px; cursor: pointer; }
.tag-cloud span:hover { color: #ff6a00; border-color: #ffd5bf; background: #fff7f1; }
/* 本地服务大全改为统一链接样式，16px */
.local-links a { font-size: 14px; }

/* 响应式 */
@media (max-width: 1200px) {
  .tc58-layout { grid-template-columns: 1fr 1fr 1fr; }
  .tc58-aside { grid-column: 1 / -1; }
}

@media (max-width: 768px) {
  .tc58-layout { grid-template-columns: 1fr; }
  .icon-grid { grid-template-columns: repeat(3, 1fr); }
  .tc58-header { flex-direction: column; align-items: flex-start; gap: 10px; }
  .tc58-quick { grid-template-columns: repeat(3, 1fr); }
  .search-container { flex-direction: column; gap: 8px; }
  .publish-btn { justify-content: center; min-width: 100%; }
  .tc58-search-header { max-width: 100%; }
}
</style>
