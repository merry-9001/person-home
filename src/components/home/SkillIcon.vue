<script setup lang="ts">
import { computed } from 'vue'
import { getSkillIcon } from '../../utils/skillIcons'

const props = defineProps<{
  slug: string
  label: string
}>()

const icon = computed(() => getSkillIcon(props.slug))
const viewBox = computed(() => (props.slug === 'uniapp' ? '0 0 128 128' : '0 0 24 24'))
</script>

<template>
  <svg
    v-if="icon"
    class="skill-brand-icon"
    role="img"
    :viewBox="viewBox"
    xmlns="http://www.w3.org/2000/svg"
    :aria-label="label"
  >
    <title>{{ label }}</title>
    <path :d="icon.path" :fill="`#${icon.hex}`" />
  </svg>
</template>

<style scoped>
.skill-brand-icon {
  width: 2rem;
  height: 2rem;
  display: block;
}

@media (max-width: 1024px) {
  .skill-brand-icon {
    width: 1.8rem;
    height: 1.8rem;
  }
}

@media (max-width: 768px) {
  .skill-brand-icon {
    width: 1.6rem;
    height: 1.6rem;
  }
}
</style>
