<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import hangzhouData from '../data/hangzhou.json'
import heroImage from '../assets/hangzhou/hero.jpg'
import fallbackImage from '../assets/hangzhou/fallback.jpg'
import sceneWestLakeImage from '../assets/hangzhou/scene-west-lake.jpg'
import sceneLiangzhuImage from '../assets/hangzhou/scene-liangzhu.jpg'
import sceneXixiImage from '../assets/hangzhou/scene-xixi.jpg'
import sceneCanalImage from '../assets/hangzhou/scene-canal.jpg'
import sceneLingyinImage from '../assets/hangzhou/scene-lingyin.jpg'
import sceneQiantangImage from '../assets/hangzhou/scene-qiantang.jpg'
import seasonSpringImage from '../assets/hangzhou/season-spring.jpg'
import seasonSummerImage from '../assets/hangzhou/season-summer.jpg'
import seasonAutumnImage from '../assets/hangzhou/season-autumn.jpg'
import seasonWinterImage from '../assets/hangzhou/season-winter.jpg'

const visible = ref(false)
onMounted(() => {
  visible.value = true
})

const hangzhouImages = {
  hero: heroImage,
  fallback: fallbackImage,
  sceneWestLake: sceneWestLakeImage,
  sceneLiangzhu: sceneLiangzhuImage,
  sceneXixi: sceneXixiImage,
  sceneCanal: sceneCanalImage,
  sceneLingyin: sceneLingyinImage,
  sceneQiantang: sceneQiantangImage,
  seasonSpring: seasonSpringImage,
  seasonSummer: seasonSummerImage,
  seasonAutumn: seasonAutumnImage,
  seasonWinter: seasonWinterImage,
}

type HangzhouImageKey = keyof typeof hangzhouImages

function getHangzhouImage(key?: string) {
  if (key && key in hangzhouImages) return hangzhouImages[key as HangzhouImageKey]
  return fallbackImage
}

const hero = hangzhouData.hero
const landmarks = hangzhouData.landmarks
const cta = hangzhouData.cta
const scenes = hangzhouData.scenes.map((scene) => ({
  ...scene,
  image: getHangzhouImage(scene.image),
}))
const seasonCards = cta.seasons.map((season) => ({
  ...season,
  image: getHangzhouImage(season.image),
}))
const fallbackSeasonCard = {
  ...cta.fallbackSeason,
  image: getHangzhouImage(cta.fallbackSeason.image),
}
const heroImageSrc = getHangzhouImage(hero.image)
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
          :src="heroImageSrc"
          :alt="hero.imageAlt"
          class="hero-img"
        />
      </div>
      <div class="hero-content">
        <span class="hero-badge">{{ hero.badge }}</span>
        <h1 class="hero-title">
          <span class="line">{{ hero.title }}</span>
          <span class="line-en">{{ hero.titleEn }}</span>
        </h1>
        <p class="hero-desc">
          <template v-for="(line, index) in hero.descriptionLines" :key="line">
            {{ line }}<br v-if="index < hero.descriptionLines.length - 1" />
          </template>
        </p>
        <div class="hero-stats">
          <div v-for="stat in hero.stats" :key="stat.label" class="stat">
            <span class="stat-num">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
      <div class="scroll-hint">
        <span>{{ hero.scrollHint }}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>

    <!-- West Lake Feature -->
    <section class="xihu-section">
      <div class="section-inner">
        <div class="section-header">
          <span class="section-tag">{{ landmarks.tag }}</span>
          <h2>{{ landmarks.title }}</h2>
          <p>{{ landmarks.description }}</p>
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
                  :src="scene.image || fallbackImage"
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
        <h2>{{ cta.title }}</h2>
        <p>{{ cta.description }}</p>
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
