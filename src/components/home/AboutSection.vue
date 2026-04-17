<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import homeData from '../../data/home.json'

const sectionRef = ref<HTMLElement | null>(null)
const visible = ref(false)

function check() {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  if (rect.top < window.innerHeight * 0.8) visible.value = true
}

onMounted(() => {
  check()
  window.addEventListener('scroll', check, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', check))

const about = homeData.about
</script>

<template>
  <section id="about" ref="sectionRef" class="about" :class="{ visible }">
    <div class="container">
      <div class="section-header">
        <span class="tag">{{ about.tag }}</span>
        <h2>{{ about.title }}</h2>
      </div>
      <div class="about-grid">
        <div class="about-text">
          <p v-for="paragraph in about.paragraphs" :key="paragraph">
            {{ paragraph }}
          </p>
        </div>
        <div class="stats-grid">
          <div v-for="stat in about.stats" :key="stat.label" class="stat-card">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  padding: 120px 0;
  position: relative;
}

.about::before {
  content: '';
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bg-dark));
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.about.visible .section-header {
  opacity: 1;
  transform: translateY(0);
}

.tag {
  display: inline-block;
  padding: 6px 16px;
  background: var(--tag-bg);
  color: var(--primary-light);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 16px;
  border: 1px solid var(--tag-border);
}

.section-header h2 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.2s;
}

.about.visible .about-grid {
  opacity: 1;
  transform: translateY(0);
}

.about-text p {
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 20px;
  font-size: 1rem;
}

.about-text p:last-child {
  margin-bottom: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-value {
  display: block;
  font-size: 2.2rem;
  font-weight: 800;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .about {
    padding: 80px 0;
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
</style>
