<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(false)
onMounted(() => {
  visible.value = true
})

interface Spot {
  title: string
  subtitle: string
  desc: string
  image: string
  tags: string[]
}

const spots: Spot[] = [
  {
    title: '西湖',
    subtitle: 'West Lake · 世界文化遗产',
    desc: '西湖位于杭州市西部，三面环山，面积约 6.39 平方公里。以"一山、二塔、三岛、三堤、五湖"闻名于世，自古便有"上有天堂，下有苏杭"的美誉。断桥残雪、苏堤春晓、三潭印月等西湖十景更是名扬天下。',
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?w=800&q=80',
    tags: ['世界遗产', '十景', '湖光山色'],
  },
  {
    title: '灵隐寺',
    subtitle: 'Lingyin Temple · 千年古刹',
    desc: '灵隐寺始建于东晋咸和元年（326年），距今已有近 1700 年历史，是杭州最早的名刹。寺院深藏于西湖西北的飞来峰下，殿宇恢弘，古木参天，飞来峰上数百尊石窟造像更是国宝级文物。',
    image: 'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?w=800&q=80',
    tags: ['古寺', '飞来峰', '佛教文化'],
  },
  {
    title: '千岛湖',
    subtitle: 'Qiandao Lake · 天下第一秀水',
    desc: '千岛湖位于杭州淳安县，水域面积 573 平方公里，拥有 1078 个岛屿。湖水清澈见底，能见度可达 12 米，被誉为"天下第一秀水"。四周群山环绕，一年四季景色各异，是绝佳的生态旅游胜地。',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80',
    tags: ['千岛', '秀水', '生态旅游'],
  },
  {
    title: '西溪湿地',
    subtitle: 'Xixi Wetland · 城市湿地公园',
    desc: '西溪湿地是中国首个国家湿地公园，总面积约 11.5 平方公里。这里河渠纵横、芦花飞雪，集城市湿地、农耕湿地、文化湿地于一体，有"杭州之肾"的美誉。秋天的芦花与火柿映衬，美不胜收。',
    image: 'https://images.unsplash.com/photo-1580130379624-3a069adbffc5?w=800&q=80',
    tags: ['湿地', '芦花', '生态'],
  },
  {
    title: '钱塘江大潮',
    subtitle: 'Qiantang Tidal Bore · 天下奇观',
    desc: '钱塘江大潮被誉为"天下第一潮"，每年农历八月十八前后最为壮观。潮头可高达数米，声如雷鸣，气势磅礴。观潮地点以海宁盐官最为著名，千百年来吸引无数文人墨客前来观赏。',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    tags: ['大潮', '奇观', '钱塘江'],
  },
  {
    title: '龙井茶园',
    subtitle: 'Longjing Tea · 中国十大名茶',
    desc: '龙井茶产于杭州西湖龙井村一带，以色绿、香郁、味甘、形美四绝著称，位列中国十大名茶之首。春天的茶园层层叠叠、满目翠绿，采茶时节更能体验亲手炒茶的乐趣，品一杯正宗明前龙井。',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=800&q=80',
    tags: ['龙井', '名茶', '茶文化'],
  },
]

const activeSpot = ref<number | null>(null)
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
          <p>自南宋以来，西湖十景就是杭州最具代表性的文化名片</p>
        </div>
        <div class="xihu-grid">
          <div class="xihu-card" v-for="(scene, i) in [
            { name: '苏堤春晓', icon: '🌸', desc: '春日苏堤，桃红柳绿，晨光中漫步如画' },
            { name: '断桥残雪', icon: '❄️', desc: '冬日断桥，白雪覆盖，如同一幅水墨画卷' },
            { name: '曲院风荷', icon: '🪷', desc: '盛夏荷花满塘，清风徐来，荷香四溢' },
            { name: '平湖秋月', icon: '🌙', desc: '秋夜湖面如镜，月光洒落，宁静致远' },
            { name: '三潭印月', icon: '🏮', desc: '三座石塔矗立湖中，月夜映出无数光影' },
            { name: '花港观鱼', icon: '🐟', desc: '花木扶疏，锦鲤成群，一幅生机盎然的画面' },
            { name: '柳浪闻莺', icon: '🐦', desc: '杨柳依依，莺歌燕舞，春天最动人的声音' },
            { name: '雷峰夕照', icon: '🌅', desc: '夕阳映照雷峰塔，金光万道，壮丽无比' },
            { name: '双峰插云', icon: '⛰️', desc: '南北高峰遥相对峙，云雾缭绕如仙境' },
            { name: '南屏晚钟', icon: '🔔', desc: '暮色中净慈寺钟声回荡，余音绕湖不绝' },
          ]" :key="i">
            <span class="xihu-icon">{{ scene.icon }}</span>
            <h3>{{ scene.name }}</h3>
            <p>{{ scene.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Scenic Spots -->
    <section class="spots-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">精选景点</span>
          <h2>不可错过的杭州美景</h2>
          <p>从千年古刹到秀美湖光，每一处都值得细细品味</p>
        </div>
        <div class="spots-list">
          <div
            class="spot-card"
            v-for="(spot, i) in spots"
            :key="i"
            :class="{ expanded: activeSpot === i }"
            @click="activeSpot = activeSpot === i ? null : i"
          >
            <div class="spot-img-wrap">
              <img :src="spot.image" :alt="spot.title" loading="lazy" />
              <div class="spot-img-overlay" />
            </div>
            <div class="spot-info">
              <div class="spot-top">
                <span class="spot-number">{{ String(i + 1).padStart(2, '0') }}</span>
                <div>
                  <h3>{{ spot.title }}</h3>
                  <span class="spot-subtitle">{{ spot.subtitle }}</span>
                </div>
              </div>
              <p class="spot-desc">{{ spot.desc }}</p>
              <div class="spot-tags">
                <span v-for="tag in spot.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Culture -->
    <section class="culture-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">文化名片</span>
          <h2>杭州的味道</h2>
          <p>一座城市的灵魂，藏在它的饮食与文化之中</p>
        </div>
        <div class="culture-grid">
          <div class="culture-card" v-for="(item, i) in [
            { icon: '🍵', title: '龙井茶', desc: '色绿、香郁、味甘、形美，中国十大名茶之首' },
            { icon: '🥟', title: '小笼包', desc: '皮薄馅嫩、汤汁鲜美，杭州早点的经典代表' },
            { icon: '🐟', title: '西湖醋鱼', desc: '选用西湖草鱼，肉质鲜嫩，酸甜适口' },
            { icon: '🥩', title: '东坡肉', desc: '以苏东坡命名，肥而不腻、酥烂入味' },
            { icon: '🎭', title: '越剧', desc: '中国第二大剧种，唱腔柔美婉转、细腻动人' },
            { icon: '☂️', title: '油纸伞', desc: '千年传承的手工技艺，伞面绘有精美图案' },
          ]" :key="i">
            <span class="culture-icon">{{ item.icon }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
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
          <span>🌸 春赏桃花</span>
          <span>🪷 夏观荷花</span>
          <span>🍂 秋品桂香</span>
          <span>❄️ 冬看断桥</span>
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
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.xihu-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px 16px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
}

.xihu-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}

.xihu-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 12px;
}

.xihu-card h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.xihu-card p {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ===== Spots Section ===== */
.spots-section {
  padding: 100px 0;
  background: var(--bg-card);
}

.spots-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.spot-card {
  display: flex;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.35s ease;
}

.spot-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
}

.spot-img-wrap {
  position: relative;
  width: 320px;
  min-width: 320px;
  min-height: 220px;
  overflow: hidden;
}

.spot-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.spot-card:hover .spot-img-wrap img {
  transform: scale(1.06);
}

.spot-img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 60%, var(--bg-dark) 100%);
}

.spot-info {
  flex: 1;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.spot-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.spot-number {
  font-size: 2rem;
  font-weight: 900;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.spot-top h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}

.spot-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 4px;
  display: block;
}

.spot-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.8;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, opacity 0.3s ease;
  opacity: 0;
}

.spot-card.expanded .spot-desc {
  max-height: 200px;
  opacity: 1;
}

.spot-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background: var(--tag-bg);
  border: 1px solid var(--tag-border);
  border-radius: 50px;
  font-size: 0.75rem;
  color: var(--primary-light);
  font-weight: 500;
}

/* ===== Culture Section ===== */
.culture-section {
  padding: 100px 0;
}

.culture-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.culture-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.culture-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}

.culture-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 16px;
}

.culture-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.culture-card p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
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
}

.cta-seasons span {
  padding: 12px 28px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 50px;
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 600;
  transition: all 0.3s;
}

.cta-seasons span:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .xihu-grid {
    grid-template-columns: repeat(3, 1fr);
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

  .xihu-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .spot-card {
    flex-direction: column;
  }

  .spot-img-wrap {
    width: 100%;
    min-width: unset;
    min-height: 180px;
    max-height: 200px;
  }

  .spot-img-overlay {
    background: linear-gradient(180deg, transparent 40%, var(--bg-dark) 100%);
  }

  .culture-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-seasons {
    gap: 12px;
  }

  .cta-seasons span {
    padding: 10px 20px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .xihu-grid {
    grid-template-columns: 1fr;
  }

  .culture-grid {
    grid-template-columns: 1fr;
  }
}
</style>
