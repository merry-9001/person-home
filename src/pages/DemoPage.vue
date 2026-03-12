<script setup lang="ts">
import { ref, shallowRef, markRaw, type Component } from 'vue'
import LotteryGame from '../demos/LotteryGame.vue'

interface DemoItem {
  id: string
  title: string
  icon: string
  component: Component
}

const demos: DemoItem[] = [
  { id: 'lottery', title: '幸运大转盘', icon: '🎰', component: markRaw(LotteryGame) },
]

const activeId = ref(demos[0]!.id)
const activeComponent = shallowRef<Component>(demos[0]!.component)
const sidebarOpen = ref(false)

function selectDemo(demo: DemoItem) {
  activeId.value = demo.id
  activeComponent.value = demo.component
  sidebarOpen.value = false
}
</script>

<template>
  <div class="demo-page">
    <button class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen">
      <span :class="{ active: sidebarOpen }"><i /><i /><i /></span>
      菜单
    </button>

    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <h2>Demo 列表</h2>
        <span class="badge">{{ demos.length }}</span>
      </div>
      <nav class="sidebar-nav">
        <button
          v-for="demo in demos"
          :key="demo.id"
          class="nav-item"
          :class="{ active: activeId === demo.id }"
          @click="selectDemo(demo)"
        >
          <span class="nav-icon">{{ demo.icon }}</span>
          <span class="nav-label">{{ demo.title }}</span>
        </button>
      </nav>
      <div class="sidebar-footer">
        <p>更多 Demo 开发中…</p>
      </div>
    </aside>

    <div class="backdrop" :class="{ visible: sidebarOpen }" @click="sidebarOpen = false" />

    <main class="demo-content">
      <Transition name="fade-slide" mode="out-in">
        <component :is="activeComponent" :key="activeId" />
      </Transition>
    </main>
  </div>
</template>

<style scoped>
.demo-page {
  display: flex;
  min-height: 100vh;
  padding-top: 80px;
}

.sidebar-toggle {
  display: none;
  position: fixed;
  top: 80px;
  left: 16px;
  z-index: 200;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.sidebar-toggle span {
  display: inline-flex;
  flex-direction: column;
  gap: 3px;
}

.sidebar-toggle span i {
  display: block;
  width: 16px;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 1px;
  transition: all 0.3s;
}

.sidebar-toggle span.active i:nth-child(1) {
  transform: rotate(45deg) translate(3px, 3px);
}

.sidebar-toggle span.active i:nth-child(2) {
  opacity: 0;
}

.sidebar-toggle span.active i:nth-child(3) {
  transform: rotate(-45deg) translate(3px, -3px);
}

.sidebar {
  position: sticky;
  top: 80px;
  width: 260px;
  min-width: 260px;
  height: calc(100vh - 80px);
  background: var(--bg-card);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  transition: transform 0.35s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 24px 20px 16px;
  border-bottom: 1px solid var(--border);
}

.sidebar-header h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  background: var(--primary);
  border-radius: 11px;
}

.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: none;
  border-radius: var(--radius);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: var(--bg-card-hover);
}

.nav-item.active {
  background: var(--tag-bg);
  border: 1px solid var(--tag-border);
}

.nav-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.nav-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.nav-item.active .nav-label {
  color: var(--primary-light);
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--border);
}

.sidebar-footer p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.backdrop {
  display: none;
}

.demo-content {
  flex: 1;
  padding: 40px;
  overflow-x: hidden;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 768px) {
  .sidebar-toggle {
    display: flex;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 150;
    height: 100vh;
    padding-top: 70px;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 140;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s;
  }

  .backdrop.visible {
    opacity: 1;
    pointer-events: auto;
  }

  .demo-content {
    padding: 80px 20px 40px;
  }
}
</style>
