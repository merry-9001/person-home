<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const visible = ref(false)
onMounted(() => {
  visible.value = true
})

const scenes = [
  {
    name: '苏堤春晓', icon: '🌸', season: '春', best: '3-4月清晨',
    location: '西湖西侧，南山路至北山路',
    desc: '苏堤全长 2.8 公里，由北宋大文豪苏轼任杭州知州时疏浚西湖、以湖泥堆筑而成。堤上遍植桃柳，春日清晨晨雾未散时漫步其间，桃红柳绿交相辉映，六桥烟柳笼纱，湖光山色如诗如画。苏堤春晓自南宋起便位列西湖十景之首，千百年来无数文人墨客为之倾倒。',
    poem: '苏堤景致六条桥，一株杨柳一株桃。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,west-lake,sudi',
  },
  {
    name: '断桥残雪', icon: '❄️', season: '冬', best: '12-2月雪后初晴',
    location: '白堤东端，北山路口',
    desc: '断桥是西湖上最负盛名的一座桥，因《白蛇传》中许仙与白娘子在此相遇的爱情传说而家喻户晓。每当冬日大雪初霁，桥的阳面冰雪消融、阴面残雪如霜，远望去桥面似断非断，\u201c断桥残雪\u201d的意境便由此而来。伫立桥上极目远眺，银装素裹的湖山一览无余。',
    poem: '断桥荒藓涩，空院落花深。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,broken-bridge,snow',
  },
  {
    name: '曲院风荷', icon: '🪷', season: '夏', best: '6-8月盛夏',
    location: '西湖西北角，岳庙前',
    desc: '曲院原为南宋朝廷酿造官酒的作坊，因靠近荷花池而得名。如今这里是西湖最大的赏荷胜地，占地约 430 亩。盛夏时节，满塘荷花竞相绽放，红莲、白莲、重台莲、洒金莲等数十个品种争奇斗艳，微风拂过清香四溢，漫步曲桥之上仿佛置身画中。',
    poem: '接天莲叶无穷碧，映日荷花别样红。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,lotus,west-lake',
  },
  {
    name: '平湖秋月', icon: '🌙', season: '秋', best: '中秋月夜',
    location: '白堤西端，孤山南麓',
    desc: '平湖秋月三面临水，背倚孤山，是西湖赏月的绝佳之地。每逢仲秋之夜，皓月当空、清风徐来，湖面波光粼粼宛如铺洒了一层碎银。此处视野开阔，远山近水尽收眼底，天上一轮明月与湖中倒影遥相呼应，天水一色、万籁俱寂，令人心旷神怡。',
    poem: '万顷湖平长似镜，四时月好最宜秋。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,moon,west-lake',
  },
  {
    name: '三潭印月', icon: '🏮', season: '秋', best: '中秋月夜',
    location: '西湖中央小瀛洲岛',
    desc: '三潭印月是西湖中最大的岛屿，岛内湖中有岛、岛中有湖，布局精巧如同中国园林的缩影。湖面上三座瓶形石塔始建于北宋，高 2 米，中空有五个圆孔。中秋之夜塔内点烛、口蒙薄纱，烛光与月光交映在湖面上，形成\u201c天上月一轮，湖中影成三\u201d的奇景，也是一元纸币背面的经典图案。',
    poem: '月光映潭潭映月，下天上天天与水。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,three-pools-mirroring-the-moon',
  },
  {
    name: '花港观鱼', icon: '🐟', season: '四季', best: '春秋两季',
    location: '苏堤南段西侧',
    desc: '花港观鱼因有一条花溪从花家山流入西湖而得名。园内亭台楼阁掩映于古木花丛之间，牡丹园里种植了数百株名品牡丹。最引人注目的是红鱼池——数千尾锦鲤在池中游弋，红、金、白各色交织，游客投食时鱼群翻涌聚拢，一片生机盎然的景象。',
    poem: '花家山下流花港，花著鱼身鱼嘬花。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,fish,pond,garden',
  },
  {
    name: '柳浪闻莺', icon: '🐦', season: '春', best: '3-5月',
    location: '西湖东南岸，南山路',
    desc: '柳浪闻莺在南宋时曾是皇家御花园\u201c聚景园\u201d的所在地。如今这里是杭州最大的沿湖公园，千余株垂柳沿湖岸依次排列。春天柳枝吐翠时，微风拂过杨柳随风飘舞如绿浪翻涌；林间黄莺穿梭啼啭、清脆悦耳，鸟鸣与远处湖波和鸣，是西湖边最富诗情画意的角落。',
    poem: '柳荫深霭玉壶清，碧浪摇空舞袖轻。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,willow,west-lake',
  },
  {
    name: '雷峰夕照', icon: '🌅', season: '四季', best: '傍晚日落时分',
    location: '西湖南岸夕照山上',
    desc: '雷峰塔始建于公元 977 年（北宋太平兴国二年），因《白蛇传》中法海将白娘子镇于塔下的故事而名满天下。旧塔于 1924 年倒塌，2002 年在原址重建。每当夕阳西下，漫天晚霞映照金色塔身，宝塔的剪影倒映在粼粼波光之中，与远处保俶塔遥相对望，构成\u201c一湖映双塔、南北相对峙\u201d的绝美画面。',
    poem: '雷峰如老衲，保俶如美人。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,leifeng-pagoda,sunset',
  },
  {
    name: '双峰插云', icon: '⛰️', season: '四季', best: '雨后云雾天',
    location: '南高峰与北高峰',
    desc: '南高峰海拔 257 米，北高峰海拔 355 米，两峰南北对峙、遥相呼应，是西湖群山中最具代表性的山峰。每逢春秋之际或雨后初晴，云雾从山谷间升腾缭绕，两座山峰时隐时现于飘渺云海之中，峰尖若隐若现犹如插入云霄，恍若仙境。登上峰顶则可俯瞰整个西湖全景。',
    poem: '南北高峰高插天，两峰相对不相连。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,peak,cloud,mountain',
  },
  {
    name: '南屏晚钟', icon: '🔔', season: '四季', best: '傍晚时分',
    location: '西湖南岸南屏山下净慈寺',
    desc: '净慈寺始建于五代后周显德元年（954 年），与灵隐寺并称为杭州两大古刹。寺内铜钟重达一万余斤，钟声浑厚悠扬。每当暮色四合、夕阳衔山之际，悠长的钟声从南屏山间传出，在群山与湖面之间回荡不绝。济公和尚的传说也为这座古寺增添了几分传奇色彩。',
    poem: '夜气滃南屏，轻岚薄如纸。钟声出上方，夜渡空江水。',
    image: 'https://source.unsplash.com/1200x800/?hangzhou,temple,bell,evening',
  },
]

const seasonCards = [
  {
    key: 'spring',
    label: '🌸 春赏桃花',
    image: 'https://source.unsplash.com/1400x900/?hangzhou,peach-blossom,spring',
  },
  {
    key: 'summer',
    label: '🪷 夏观荷花',
    image: 'https://source.unsplash.com/1400x900/?hangzhou,lotus,summer',
  },
  {
    key: 'autumn',
    label: '🍂 秋品桂香',
    image: 'https://source.unsplash.com/1400x900/?hangzhou,osmanthus,autumn',
  },
  {
    key: 'winter',
    label: '❄️ 冬看断桥',
    image: 'https://source.unsplash.com/1400x900/?hangzhou,broken-bridge,winter',
  },
]

const fallbackSeasonCard = {
  key: 'spring',
  label: '🌸 春赏桃花',
  image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1400&q=80',
}

const activeSeason = ref(seasonCards[0]?.key ?? fallbackSeasonCard.key)
const activeSeasonCard = computed(
  () => seasonCards.find((item) => item.key === activeSeason.value) ?? seasonCards[0] ?? fallbackSeasonCard,
)
</script>

<template>
  <div class="hangzhou-page" :class="{ visible }">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-overlay" />
        <img
          src="https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1600&q=80"
          alt="杭州西湖"
          class="hero-img"
        />
      </div>
      <div class="hero-content">
        <span class="hero-badge">🏯 人间天堂</span>
        <h1 class="hero-title">
          <span class="line">杭 州</span>
          <span class="line-en">HANGZHOU</span>
        </h1>
        <p class="hero-desc">
          上有天堂，下有苏杭。杭州自古以来就以秀丽的山水和深厚的文化底蕴闻名于世，<br />
          是一座融合了古典韵味与现代活力的魅力之城。
        </p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">2200+</span>
            <span class="stat-label">年建城史</span>
          </div>
          <div class="stat">
            <span class="stat-num">1243</span>
            <span class="stat-label">万常住人口</span>
          </div>
          <div class="stat">
            <span class="stat-num">3</span>
            <span class="stat-label">项世界遗产</span>
          </div>
        </div>
      </div>
      <div class="scroll-hint">
        <span>向下探索</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>

    <!-- West Lake Feature -->
    <section class="xihu-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">核心景区</span>
          <h2>西湖十景</h2>
          <p>自南宋以来，西湖十景就是杭州最具代表性的文化名片，每一景都承载着千年的诗意与传说</p>
        </div>
        <div class="xihu-grid">
          <div class="xihu-card" v-for="(scene, i) in scenes" :key="i">
            <div class="xihu-left">
              <span class="xihu-season">{{ scene.season }}</span>
              <span class="xihu-best-short">{{ scene.best }}</span>
            </div>
            <div class="xihu-right">
              <div class="xihu-top">
                <h3>{{ scene.name }}</h3>
                <div class="xihu-meta">
                  <span class="xihu-best">{{ scene.best }}</span>
                  <span class="xihu-location">{{ scene.location }}</span>
                </div>
              </div>
              <div class="xihu-image-wrap">
                <img
                  class="xihu-image"
                  :src="scene.image || 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=1200&q=80'"
                  :alt="`${scene.name}相关图片`"
                />
              </div>
              <p class="xihu-poem">{{ scene.poem }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="section-inner cta-inner">
        <h2>来杭州，遇见最美的风景</h2>
        <p>无论春夏秋冬，杭州都有不同的美等你来发现</p>
        <div class="cta-seasons">
          <button
            v-for="item in seasonCards"
            :key="item.key"
            class="cta-season-btn"
            :class="{ active: item.key === activeSeason }"
            type="button"
            @click="activeSeason = item.key"
          >
            {{ item.label }}
          </button>
        </div>
        <div class="cta-image-wrap">
          <img
            class="cta-image"
            :src="activeSeasonCard.image"
            :alt="`${activeSeasonCard.label}相关图片`"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hangzhou-page {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.hangzhou-page.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Hero ===== */
.hero {
  position: relative;
  height: 100vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5) saturate(1.2);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(15, 23, 42, 0.3) 0%,
    rgba(15, 23, 42, 0.7) 60%,
    rgba(15, 23, 42, 0.95) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 700px;
  padding: 0 24px;
}

.hero-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 50px;
  font-size: 0.9rem;
  color: var(--primary-light);
  margin-bottom: 24px;
  backdrop-filter: blur(8px);
}

.hero-title {
  margin-bottom: 20px;
}

.hero-title .line {
  display: block;
  font-size: 4rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 16px;
  line-height: 1.2;
}

.hero-title .line-en {
  display: block;
  font-size: 1.2rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 12px;
  margin-top: 8px;
}

.hero-desc {
  font-size: 1.05rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 40px;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 48px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-num {
  font-size: 2rem;
  font-weight: 800;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(8px); }
}

/* ===== Sections Common ===== */
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-tag {
  display: inline-block;
  padding: 6px 16px;
  background: var(--tag-bg);
  border: 1px solid var(--tag-border);
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary-light);
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.section-header p {
  font-size: 1rem;
  color: var(--text-secondary);
}

/* ===== Xi Hu Section ===== */
.xihu-section {
  padding: 100px 0;
}

.xihu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.xihu-card {
  display: flex;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  transition: all 0.35s ease;
  cursor: default;
}

.xihu-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary);
  box-shadow: var(--shadow-lg, 0 8px 30px rgba(0,0,0,0.12));
}

.xihu-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 24px;
  min-width: 100px;
  background: linear-gradient(160deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.12) 100%);
  border-right: 1px solid var(--border);
  position: relative;
}

.xihu-season {
  font-size: 2.2rem;
  font-weight: 900;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  letter-spacing: 2px;
}

.xihu-best-short {
  font-size: 0.7rem;
  color: var(--text-muted, #999);
  text-align: center;
  line-height: 1.3;
  white-space: nowrap;
}

.xihu-right {
  flex: 1;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.xihu-top h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.xihu-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.xihu-best,
.xihu-location {
  font-size: 0.75rem;
  color: var(--text-muted, #999);
  display: flex;
  align-items: center;
  gap: 4px;
}

.xihu-best::before {
  content: '\1F551';
  font-size: 0.7rem;
}

.xihu-location::before {
  content: '\1F4CD';
  font-size: 0.7rem;
}

.xihu-image-wrap {
  width: 100%;
  height: 190px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.xihu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.xihu-poem {
  font-size: 0.8rem;
  color: var(--primary-light);
  font-style: italic;
  padding-top: 8px;
  border-top: 1px dashed var(--border);
  line-height: 1.6;
  opacity: 0.85;
}

/* ===== CTA Section ===== */
.cta-section {
  padding: 100px 0 120px;
}

.cta-inner {
  text-align: center;
}

.cta-inner h2 {
  font-size: 2rem;
  font-weight: 800;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.cta-inner p {
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.cta-seasons {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.cta-season-btn {
  padding: 12px 28px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 50px;
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 600;
  transition: all 0.3s;
  cursor: pointer;
}

.cta-season-btn:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.cta-season-btn.active {
  color: #fff;
  border-color: transparent;
  background: var(--gradient-1);
}

.cta-image-wrap {
  margin: 0 auto;
  max-width: 920px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-lg, 0 8px 30px rgba(0, 0, 0, 0.12));
}

.cta-image {
  width: 100%;
  height: 420px;
  object-fit: cover;
  display: block;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .xihu-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .hero-title .line {
    font-size: 2.8rem;
    letter-spacing: 10px;
  }

  .hero-title .line-en {
    font-size: 1rem;
    letter-spacing: 8px;
  }

  .hero-desc br {
    display: none;
  }

  .hero-stats {
    gap: 28px;
  }

  .stat-num {
    font-size: 1.5rem;
  }

  .xihu-card {
    flex-direction: column;
  }

  .xihu-left {
    flex-direction: row;
    gap: 12px;
    padding: 14px 20px;
    min-width: unset;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .xihu-season {
    font-size: 1.6rem;
  }

  .xihu-right {
    padding: 20px;
  }

  .cta-seasons {
    gap: 12px;
  }

  .cta-season-btn {
    padding: 10px 20px;
    font-size: 0.85rem;
  }

  .cta-image {
    height: 320px;
  }
}

@media (max-width: 480px) {
  .cta-image {
    height: 240px;
  }
}
</style>
