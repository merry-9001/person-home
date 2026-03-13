<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import FooterSection from './components/FooterSection.vue'
</script>

<template>
  <NavBar />
  <main>
    <RouterView />
  </main>
  <FooterSection />
</template>

<style scoped>
main {
  position: relative;
  min-height: 70vh;
}
</style>
