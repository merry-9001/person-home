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

const contacts = [
  { icon: '📧', label: '邮箱', value: 'hello@example.com', href: 'mailto:hello@example.com' },
  { icon: '🐙', label: 'GitHub', value: 'github.com/yourname', href: 'https://github.com' },
  { icon: '💬', label: '微信', value: 'your_wechat_id', href: '#' },
]
</script>

<template>
  <section id="contact" ref="sectionRef" class="contact" :class="{ visible }">
    <div class="container">
      <div class="section-header">
        <span class="tag">联系</span>
        <h2>与我取得联系</h2>
        <p class="subtitle">无论是项目合作、技术交流还是随便聊聊，都欢迎联系我</p>
      </div>
      <div class="contact-grid">
        <a
          v-for="(c, i) in contacts"
          :key="c.label"
          :href="c.href"
          class="contact-card"
          :style="{ transitionDelay: `${i * 0.12 + 0.2}s` }"
          target="_blank"
          rel="noopener"
        >
          <span class="contact-icon">{{ c.icon }}</span>
          <h3>{{ c.label }}</h3>
          <p>{{ c.value }}</p>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  padding: 120px 0;
  background: linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.02), transparent);
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

.contact.visible .section-header {
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
  margin-bottom: 12px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 64px;
}

.contact-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px 28px;
  text-align: center;
  transition: all 0.3s ease;
  display: block;
  opacity: 0;
  transform: translateY(20px);
}

.contact.visible .contact-card {
  opacity: 1;
  transform: translateY(0);
}

.contact-card:hover {
  border-color: var(--primary);
  transform: translateY(-6px);
  box-shadow: var(--shadow-md);
}

.contact-icon {
  font-size: 2.4rem;
  display: block;
  margin-bottom: 16px;
}

.contact-card h3 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-primary);
}

.contact-card p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.cta-box {
  text-align: center;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 56px 32px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.5s;
}

.contact.visible .cta-box {
  opacity: 1;
  transform: translateY(0);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 36px;
  background: var(--gradient-1);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.45);
  color: white;
}

@media (max-width: 768px) {
  .contact {
    padding: 80px 0;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto 64px;
  }
}
</style>
