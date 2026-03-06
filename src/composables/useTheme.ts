import { ref, computed, watch } from 'vue'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme-preference'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

const theme = ref<Theme>(getInitialTheme())
const isDark = computed(() => theme.value === 'dark')

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem(STORAGE_KEY, t)
}

applyTheme(theme.value)

watch(theme, applyTheme)

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return {
    theme,
    isDark,
    toggleTheme,
  }
}
