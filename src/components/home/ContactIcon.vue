<script setup lang="ts">
import { computed } from 'vue'
import { getContactIcon } from '../../utils/contactIcons'

const props = defineProps<{
  slug: string
  label: string
}>()

const icon = computed(() => getContactIcon(props.slug))
</script>

<template>
  <svg
    v-if="icon"
    class="contact-brand-icon"
    :class="`contact-brand-icon--${slug}`"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    :aria-label="label"
  >
    <title>{{ label }}</title>
    <path :d="icon.path" fill="currentColor" />
  </svg>
</template>

<style scoped>
.contact-brand-icon {
  width: 2.4rem;
  height: 2.4rem;
  display: block;
  margin: 0 auto 16px;
}

.contact-brand-icon--email {
  color: var(--primary-light);
}

.contact-brand-icon--github {
  color: var(--text-primary);
}

.contact-brand-icon--wechat {
  color: #07c160;
}
</style>
