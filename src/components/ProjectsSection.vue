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

interface Project {
  title: string
  desc: string
  tags: string[]
  color: string
  icon: string
  link: string
}

const projects: Project[] = [
  {
    title: '低代码可视化平台',
    desc: '基于拖拽搭建页面的低代码演示项目，支持组件拼装、属性配置和实时预览，适合快速验证产品想法。',
    tags: ['Vue 3', '低代码', '可视化搭建'],
    color: '#6366f1',
    icon: '🧩',
    link: 'https://person-low-code.vercel.app/#/',
  },
  {
    title: 'BPMN 工作流引擎',
    desc: '基于 BPMN 的可视化流程设计与运行演示，支持在浏览器中拖拽绘制流程并进行流程配置。',
    tags: ['Vue 3', 'BPMN', '工作流'],
    color: '#06b6d4',
    icon: '🔄',
    link: 'https://person-bpmn.vercel.app/',
  },
]
</script>

<template>
  <section id="projects" ref="sectionRef" class="projects" :class="{ visible }">
    <div class="container">
      <div class="section-header">
        <span class="tag">项目</span>
        <h2>精选作品</h2>
      </div>
      <div class="projects-grid">
        <article
          v-for="(p, i) in projects"
          :key="p.title"
          class="project-card"
          :style="{ transitionDelay: `${i * 0.12 + 0.2}s` }"
        >
          <div class="card-accent" :style="{ background: p.color }" />
          <div class="card-body">
            <span class="project-icon">{{ p.icon }}</span>
            <h3>{{ p.title }}</h3>
            <p>{{ p.desc }}</p>
            <div class="tags">
              <span v-for="tag in p.tags" :key="tag" class="tag-pill">{{ tag }}</span>
            </div>
          </div>
          <div class="card-footer">
            <a
              :href="p.link"
              class="card-link"
              target="_blank"
              rel="noopener"
            >
              访问项目 →
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects {
  padding: 120px 0;
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

.projects.visible .section-header {
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.project-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
  cursor: pointer;
}

.projects.visible .project-card {
  opacity: 1;
  transform: translateY(0);
}

.project-card:hover {
  border-color: var(--primary);
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

.card-accent {
  height: 4px;
  width: 100%;
}

.card-body {
  padding: 32px;
  flex: 1;
}

.project-icon {
  font-size: 2.2rem;
  display: block;
  margin-bottom: 16px;
}

.card-body h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.card-body p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 20px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  padding: 4px 12px;
  background: var(--pill-bg);
  color: var(--text-muted);
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 500;
  border: 1px solid var(--pill-border);
}

.card-footer {
  padding: 0 32px 28px;
}

.card-link {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-light);
  transition: all 0.3s;
}

.card-link:hover {
  color: var(--accent);
}

@media (max-width: 768px) {
  .projects {
    padding: 80px 0;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
