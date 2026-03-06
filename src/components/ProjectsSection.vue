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
}

const projects: Project[] = [
  {
    title: '智能任务管理平台',
    desc: '基于 AI 驱动的任务优先级排序与自动化工作流管理系统，支持团队协作与数据分析。',
    tags: ['Vue 3', 'Node.js', 'MongoDB', 'AI'],
    color: '#6366f1',
    icon: '📋',
  },
  {
    title: '实时数据可视化仪表盘',
    desc: '高性能的实时数据监控平台，支持自定义图表、告警规则与多数据源接入。',
    tags: ['React', 'D3.js', 'WebSocket', 'Go'],
    color: '#06b6d4',
    icon: '📊',
  },
  {
    title: '跨平台移动应用',
    desc: '一套代码多端运行的移动应用解决方案，涵盖社交、电商等多种业务场景。',
    tags: ['Flutter', 'Dart', 'Firebase', 'REST API'],
    color: '#8b5cf6',
    icon: '📱',
  },
  {
    title: '开源组件库',
    desc: '面向开发者的高质量 UI 组件库，支持主题定制、国际化与无障碍访问。',
    tags: ['TypeScript', 'Vue 3', 'Vite', 'Storybook'],
    color: '#10b981',
    icon: '🧩',
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
            <a href="#" class="card-link">查看详情 →</a>
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
