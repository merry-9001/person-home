<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../../composables/useTheme'

const { theme, toggleTheme } = useTheme()

const scrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

function toggle() {
  mobileOpen.value = !mobileOpen.value
}

function closeMenu() {
  mobileOpen.value = false
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="navbar" :class="{ scrolled }">
    <div class="nav-inner">
      <RouterLink to="/" class="logo">MERRY<span>.</span></RouterLink>
      <div class="nav-right">
        <nav class="nav-links" :class="{ open: mobileOpen }">
          <RouterLink to="/" @click="closeMenu">首页</RouterLink>
          <RouterLink to="/blog" @click="closeMenu">博客</RouterLink>
          <RouterLink to="/demos" @click="closeMenu">Demo</RouterLink>
          <RouterLink to="/hangzhou" @click="closeMenu">杭州</RouterLink>
        </nav>
        <button class="theme-toggle" @click="toggleTheme" :aria-label="theme === 'dark' ? '切换到白天模式' : '切换到黑夜模式'">
          <Transition name="icon-fade" mode="out-in">
            <svg v-if="theme === 'dark'" key="sun" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else key="moon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </Transition>
        </button>
        <button class="menu-btn" @click="toggle" :class="{ active: mobileOpen }">
          <span /><span /><span />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 20px 0;
  transition: all 0.35s ease;
}

.navbar.scrolled {
  padding: 12px 0;
  background: var(--nav-bg);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary) !important;
  letter-spacing: -0.5px;
}

.logo span {
  color: var(--primary);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  border-color: var(--primary);
  color: var(--primary-light);
  transform: rotate(15deg);
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.25s ease;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}

.nav-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  transition: color 0.3s;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gradient-1);
  transition: width 0.3s;
  border-radius: 1px;
}

.nav-links a:hover {
  color: var(--text-primary);
}

.nav-links a:hover::after {
  width: 100%;
}

.menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.menu-btn span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s;
}

.menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .menu-btn {
    display: flex;
  }

  .theme-toggle {
    width: 36px;
    height: 36px;
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: 0;
    width: 260px;
    height: 100vh;
    background: var(--bg-card);
    flex-direction: column;
    padding: 80px 32px;
    gap: 24px;
    transform: translateX(100%);
    transition: transform 0.35s ease;
    border-left: 1px solid var(--border);
  }

  .nav-links.open {
    transform: translateX(0);
  }

  .nav-links a {
    font-size: 1.05rem;
  }
}
</style>
