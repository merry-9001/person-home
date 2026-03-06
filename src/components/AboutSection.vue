<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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

const stats = [
  { value: '5+', label: '年经验' },
  { value: '30+', label: '完成项目' },
  { value: '10+', label: '技术栈' },
  { value: '∞', label: '学习热情' },
]
</script>

<template>
  <section id="about" ref="sectionRef" class="about" :class="{ visible }">
    <div class="container">
      <div class="section-header">
        <span class="tag">关于我</span>
        <h2>了解我的故事</h2>
      </div>
      <div class="about-grid">
        <div class="about-text">
          <p>
            我是一名充满热情的全栈开发者，拥有多年的软件开发经验。
            从前端到后端，从移动应用到云服务，我享受将创意转化为现实的每一个过程。
          </p>
          <p>
            我相信优秀的代码不仅仅是功能的实现，更是艺术的表达。
            我始终追求简洁、高效、优雅的解决方案，同时注重用户体验和代码质量。
          </p>
          <p>
            在工作之余，我喜欢探索新技术、参与开源项目、阅读技术博客，
            并热衷于与社区分享自己的心得和经验。
          </p>
        </div>
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-card">
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
