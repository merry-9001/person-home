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

interface Skill {
  name: string
  icon: string
  level: number
}

interface SkillCategory {
  title: string
  icon: string
  skills: Skill[]
}

const categories: SkillCategory[] = [
  {
    title: '前端开发',
    icon: '🎨',
    skills: [
      { name: 'Vue.js', icon: '💚', level: 95 },
      { name: 'React', icon: '⚛️', level: 85 },
      { name: 'TypeScript', icon: '🔷', level: 90 },
      { name: 'CSS / Tailwind', icon: '🎭', level: 90 },
    ],
  },
  {
    title: '后端开发',
    icon: '⚙️',
    skills: [
      { name: 'Node.js', icon: '🟢', level: 88 },
      { name: 'Python', icon: '🐍', level: 82 },
      { name: 'Go', icon: '🔵', level: 75 },
      { name: 'PostgreSQL', icon: '🐘', level: 80 },
    ],
  },
  {
    title: '工具 & DevOps',
    icon: '🛠️',
    skills: [
      { name: 'Docker', icon: '🐳', level: 85 },
      { name: 'Git', icon: '📦', level: 92 },
      { name: 'Linux', icon: '🐧', level: 80 },
      { name: 'CI/CD', icon: '🔄', level: 78 },
    ],
  },
]
</script>

<template>
  <section id="skills" ref="sectionRef" class="skills" :class="{ visible }">
    <div class="container">
      <div class="section-header">
        <span class="tag">技能</span>
        <h2>技术栈一览</h2>
      </div>
      <div class="skills-grid">
        <div
          v-for="(cat, ci) in categories"
          :key="cat.title"
          class="skill-category"
          :style="{ transitionDelay: `${ci * 0.15 + 0.2}s` }"
        >
          <div class="cat-header">
            <span class="cat-icon">{{ cat.icon }}</span>
            <h3>{{ cat.title }}</h3>
          </div>
          <div class="skill-list">
            <div v-for="skill in cat.skills" :key="skill.name" class="skill-item">
              <div class="skill-info">
                <span class="skill-icon">{{ skill.icon }}</span>
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-pct">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div
                  class="skill-fill"
                  :style="{ width: visible ? `${skill.level}%` : '0%' }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  padding: 120px 0;
  background: linear-gradient(180deg, transparent, rgba(99, 102, 241, 0.02), transparent);
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

.skills.visible .section-header {
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.skill-category {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.skills.visible .skill-category {
  opacity: 1;
  transform: translateY(0);
}

.skill-category:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}

.cat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.cat-icon {
  font-size: 1.6rem;
}

.cat-header h3 {
  font-size: 1.15rem;
  font-weight: 600;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.skill-icon {
  font-size: 1rem;
}

.skill-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  flex: 1;
}

.skill-pct {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

.skill-bar {
  height: 6px;
  background: var(--bar-bg);
  border-radius: 3px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: var(--gradient-1);
  border-radius: 3px;
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .skills {
    padding: 80px 0;
  }
}
</style>
