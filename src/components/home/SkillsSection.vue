<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import homeData from '../../data/home.json'
import SkillIcon from './SkillIcon.vue'

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

const skills = homeData.skills
</script>

<template>
  <section id="skills" ref="sectionRef" class="skills" :class="{ visible }">
    <div class="container">
      <div class="section-header">
        <span class="tag">{{ skills.tag }}</span>
        <h2>{{ skills.title }}</h2>
      </div>
      <div class="skills-grid">
        <div
          v-for="(skill, index) in skills.items"
          :key="skill.name"
          class="skill-item"
          :style="{ transitionDelay: `${index * 0.06 + 0.2}s` }"
          :title="skill.name"
          :aria-label="skill.name"
        >
          <SkillIcon class="skill-icon" :slug="skill.icon" :label="skill.name" />
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
  grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
  gap: 16px;
  max-width: 780px;
  margin: 0 auto;
}

.skill-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.skill-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(16px) scale(0.96);
  transition: all 0.6s ease;
}

.skills.visible .skill-item {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.skill-item:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px) scale(1.03);
}

@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(auto-fit, minmax(78px, 1fr));
    gap: 14px;
    max-width: 620px;
  }

  .skill-item {
    height: 80px;
  }

}

@media (max-width: 768px) {
  .skills {
    padding: 80px 0;
  }

  .container {
    padding: 0 20px;
  }

  .section-header {
    margin-bottom: 40px;
  }

  .skills-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }

  .skill-item {
    height: 72px;
  }

}
</style>
