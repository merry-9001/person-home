---
title: Vue 3 组合式 API 实战指南
date: 2026-03-03
summary: 深入探索 Vue 3 Composition API 的核心概念与最佳实践，从 ref 到 composable 的完整指南。
tags:
  - Vue
  - 前端
  - TypeScript
---

# Vue 3 组合式 API 实战指南

Vue 3 引入了组合式 API（Composition API），这是对 Vue 开发方式的一次重大革新。本文将带你深入了解其核心概念。

## 为什么需要组合式 API？

在 Options API 中，随着组件复杂度增长，相关的逻辑被分散在不同的选项（data、methods、computed 等）中，这使得代码难以维护。

组合式 API 允许我们 **按逻辑关注点组织代码**，而非按选项类型。

## 核心响应式 API

### ref 与 reactive

```typescript
import { ref, reactive } from 'vue'

// ref 适用于基本类型
const count = ref(0)
count.value++ // 需要 .value 访问

// reactive 适用于对象
const state = reactive({
  name: '云边缘',
  skills: ['Vue', 'React', 'TypeScript']
})
state.name = '新名字' // 直接访问，无需 .value
```

### computed 计算属性

```typescript
import { ref, computed } from 'vue'

const firstName = ref('云')
const lastName = ref('边缘')

const fullName = computed(() => `${firstName.value}${lastName.value}`)
```

### watch 侦听器

```typescript
import { ref, watch } from 'vue'

const keyword = ref('')

watch(keyword, (newVal, oldVal) => {
  console.log(`搜索词从 "${oldVal}" 变为 "${newVal}"`)
}, { debounce: 300 })
```

## 自定义 Composable

Composable 是组合式 API 最强大的模式——将可复用的逻辑提取为函数：

```typescript
// useMousePosition.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMousePosition() {
  const x = ref(0)
  const y = ref(0)

  function update(e: MouseEvent) {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}
```

在组件中使用：

```vue
<script setup>
import { useMousePosition } from './composables/useMousePosition'

const { x, y } = useMousePosition()
</script>

<template>
  <p>鼠标位置: {{ x }}, {{ y }}</p>
</template>
```

## 最佳实践

1. **优先使用 `ref`**：统一的 `.value` 访问模式更易于追踪响应式状态
2. **提取 Composable**：当逻辑在多个组件间复用时
3. **使用 TypeScript**：获得完整的类型推导支持
4. **保持 Composable 纯净**：只做一件事，保持可组合性

## 总结

组合式 API 不仅仅是一种新的写法，更是一种全新的代码组织思维。它让我们的 Vue 代码更加灵活、可复用和可维护。

希望这篇文章对你有帮助，欢迎在评论区交流！
