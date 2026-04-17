<script setup lang="ts">
import { ref, onMounted } from 'vue'
import homeData from '../../data/home.json'

const show = ref(false)
onMounted(() => {
  requestAnimationFrame(() => (show.value = true))
}) 
</script>

<template>
  <section class="hero" :class="{ visible: show }">
    <div class="hero-bg">
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="grid-overlay" />
    </div>
    <div class="hero-content">
      <p class="greeting">{{ homeData.hero.greeting }}</p>
      <h1 class="name">{{ homeData.hero.name }}<span class="dot">.</span></h1>
      <h2 class="title">{{ homeData.hero.title }}</h2>
      <p class="desc">
        {{ homeData.hero.description }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.18;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: var(--primary);
  top: -100px;
  right: -50px;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 350px;
  height: 350px;
  background: var(--accent);
  bottom: 10%;
  left: -30px;
  animation: float 10s ease-in-out infinite reverse;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: linear-gradient(to bottom, transparent, black 20%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 70%, transparent);
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, -20px) scale(1.03); }
}

.hero-content {
  position: relative;
  text-align: center;
  max-width: 720px;
  padding: 0 32px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero.visible .hero-content {
  opacity: 1;
  transform: translateY(0);
}

.greeting {
  font-size: 1.1rem;
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.name {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 16px;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dot {
  -webkit-text-fill-color: var(--accent);
}

.title {
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 400;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.desc {
  font-size: 1.05rem;
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 auto 40px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 14px 32px;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: var(--gradient-1);
  color: white;
  border: none;
  box-shadow: 0 4px 24px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.45);
  color: white;
}

.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border);
}

.btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary-light);
  transform: translateY(-2px);
}

.scroll-hint {
  position: absolute;
  bottom: -120px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.mouse {
  width: 24px;
  height: 38px;
  border: 2px solid var(--text-muted);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.wheel {
  width: 3px;
  height: 8px;
  background: var(--text-muted);
  border-radius: 2px;
  animation: scroll-anim 1.5s ease-in-out infinite;
}

@keyframes scroll-anim {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(8px); }
}

@media (max-width: 768px) {
  .hero-content {
    padding: 0 24px;
  }
}
</style>
