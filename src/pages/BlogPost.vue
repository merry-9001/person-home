<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'

const route = useRoute()
const router = useRouter()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

const title = ref('')
const date = ref('')
const tags = ref<string[]>([])
const htmlContent = ref('')
const visible = ref(false)
const notFound = ref(false)

const slug = computed(() => route.params.slug as string)

function parseFrontmatter(raw: string): { meta: Record<string, any>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return { meta: {}, content: raw }

  const metaStr = match[1]
  const content = raw.slice(match[0].length)
  const meta: Record<string, any> = {}
  let currentKey = ''
  let inArray = false

  for (const line of metaStr!.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (inArray && trimmed.startsWith('- ')) {
      if (!Array.isArray(meta[currentKey])) meta[currentKey] = []
      meta[currentKey].push(trimmed.slice(2).trim())
      continue
    }

    inArray = false
    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    currentKey = trimmed.slice(0, colonIdx).trim()
    const val = trimmed.slice(colonIdx + 1).trim()

    if (val === '') {
      inArray = true
      meta[currentKey] = []
    } else {
      meta[currentKey] = val
    }
  }

  return { meta, content }
}

onMounted(async () => {
  try {
    const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' })
    const targetPath = `../posts/${slug.value}.md`
    const loader = modules[targetPath]

    if (!loader) {
      notFound.value = true
      visible.value = true
      return
    }

    const raw = (await loader()) as string
    const { meta, content } = parseFrontmatter(raw)

    title.value = meta.title || slug.value
    date.value = meta.date || ''
    tags.value = Array.isArray(meta.tags) ? meta.tags : []
    htmlContent.value = md.render(content)

    requestAnimationFrame(() => (visible.value = true))
  } catch {
    notFound.value = true
    visible.value = true
  }
})

function goBack() {
  router.push({ name: 'blog' })
}
</script>

<template>
  <article class="blog-post" :class="{ visible }">
    <div class="container">
      <button class="back-btn" @click="goBack">← 返回文章列表</button>

      <template v-if="!notFound">
        <header class="post-header">
          <div class="post-date">{{ date }}</div>
          <h1>{{ title }}</h1>
          <div class="post-tags">
            <span v-for="tag in tags" :key="tag" class="tag-pill">{{ tag }}</span>
          </div>
        </header>
        <div class="post-content" v-html="htmlContent" />
      </template>

      <div v-else class="not-found">
        <h2>404</h2>
        <p>文章未找到</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.blog-post {
  padding: 120px 0 80px;
  min-height: 100vh;
}

.container {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 32px;
}

.back-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 40px;
  font-weight: 500;
}

.back-btn:hover {
  border-color: var(--primary);
  color: var(--primary-light);
}

.post-header {
  margin-bottom: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.blog-post.visible .post-header {
  opacity: 1;
  transform: translateY(0);
}

.post-date {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.post-header h1 {
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 16px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  padding: 4px 14px;
  background: var(--tag-bg);
  color: var(--primary-light);
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid var(--tag-border);
}

.post-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.15s;
}

.blog-post.visible .post-content {
  opacity: 1;
  transform: translateY(0);
}

.post-content :deep(h1) {
  display: none;
}

.post-content :deep(h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 48px 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.post-content :deep(h3) {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 32px 0 12px;
}

.post-content :deep(p) {
  color: var(--text-secondary);
  line-height: 1.9;
  margin-bottom: 18px;
  font-size: 1rem;
}

.post-content :deep(ul),
.post-content :deep(ol) {
  padding-left: 24px;
  margin-bottom: 18px;
}

.post-content :deep(li) {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 6px;
}

.post-content :deep(strong) {
  color: var(--text-primary);
  font-weight: 600;
}

.post-content :deep(code) {
  background: var(--code-bg);
  color: var(--primary-light);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.88em;
  font-family: 'Fira Code', 'Cascadia Code', monospace;
}

.post-content :deep(pre) {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  overflow-x: auto;
  margin-bottom: 24px;
}

.post-content :deep(pre code) {
  background: none;
  padding: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

.post-content :deep(blockquote) {
  border-left: 3px solid var(--primary);
  padding: 12px 20px;
  margin: 24px 0;
  background: var(--blockquote-bg);
  border-radius: 0 var(--radius) var(--radius) 0;
}

.post-content :deep(blockquote p) {
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 0;
}

.post-content :deep(a) {
  color: var(--primary-light);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.post-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

.post-content :deep(th),
.post-content :deep(td) {
  padding: 12px 16px;
  border: 1px solid var(--border);
  text-align: left;
}

.post-content :deep(th) {
  background: var(--bg-card);
  font-weight: 600;
  color: var(--text-primary);
}

.post-content :deep(td) {
  color: var(--text-secondary);
}

.post-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 32px 0;
}

.not-found {
  text-align: center;
  padding: 120px 0;
}

.not-found h2 {
  font-size: 4rem;
  font-weight: 800;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.not-found p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .blog-post {
    padding: 100px 0 60px;
  }
}
</style>
