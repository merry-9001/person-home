<script setup lang="ts">
import { onMounted, ref } from "vue";
import hangzhouData from "../data/hangzhou.json";
import ScenicMap from "../components/hangzhou/ScenicMap.vue";
import heroImage from "../assets/hangzhou/hero.jpg";

const visible = ref(false);

onMounted(() => {
  visible.value = true;
});

const hero = hangzhouData.hero;
const map = hangzhouData.map;
</script>

<template>
  <div class="hangzhou-page" :class="{ visible }">
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-overlay" />
        <img :src="heroImage" :alt="hero.imageAlt" class="hero-img" />
      </div>
      <div class="hero-content">
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
    </section>

    <ScenicMap :map="map" />
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
}
</style>
