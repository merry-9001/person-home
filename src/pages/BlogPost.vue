<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { formatBlogDate } from '../utils/formatDate'

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
const tocItems = ref<Array<{ id: string; text: string; level: number }>>([])

const slug = computed(() => route.params.slug as string)

function stripHtml(raw: string) {
  return raw
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim()
}

function plainTextFromInline(inlineToken: { type: string; content: string } | undefined) {
  if (!inlineToken || inlineToken.type !== 'inline') return ''
  return stripHtml(inlineToken.content.trim())
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function renderMarkdownWithToc(content: string) {
  const tokens = md.parse(content, {})
  const nextToc: Array<{ id: string; text: string; level: number }> = []
  const slugCount = new Map<string, number>()

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (!token) continue
    if (token.type !== 'heading_open') continue

    const level = Number(token.tag.replace('h', ''))
    const inlineToken = tokens[i + 1]
    const text = plainTextFromInline(inlineToken)
    if (!text) continue

    const base = slugifyHeading(text) || `section-${nextToc.length + 1}`
    const current = slugCount.get(base) ?? 0
    slugCount.set(base, current + 1)
    const id = current === 0 ? base : `${base}-${current + 1}`

    token.attrSet('id', id)

    if (level >= 1 && level <= 3) {
      nextToc.push({ id, text, level })
    }
  }

  tocItems.value = nextToc
  return md.renderer.render(tokens, md.options, {})
}

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

function scrollToHeadingByHash(hash: string, behavior: ScrollBehavior = 'smooth') {
  const rawId = hash.replace(/^#/, '')
  if (!rawId) return
  const id = decodeURIComponent(rawId)
  const target = document.getElementById(id)
  if (!target) return
  target.scrollIntoView({ behavior, block: 'start' })
}

async function jumpToHeading(id: string) {
  const hash = `#${encodeURIComponent(id)}`
  if (route.hash !== hash) {
    await router.replace({ hash })
  }
  scrollToHeadingByHash(hash)
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
    htmlContent.value = renderMarkdownWithToc(content)
    await nextTick()

    if (route.hash) {
      scrollToHeadingByHash(route.hash, 'auto')
    }

    requestAnimationFrame(() => (visible.value = true))
  } catch {
    notFound.value = true
    visible.value = true
  }
})

watch(
  () => route.hash,
  (hash) => {
    if (!hash) return
    requestAnimationFrame(() => {
      scrollToHeadingByHash(hash)
    })
  }
)

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
          <div class="post-date">{{ formatBlogDate(date) }}</div>
          <h1>{{ title }}</h1>
          <div class="post-tags">
            <span v-for="tag in tags" :key="tag" class="tag-pill">{{ tag }}</span>
          </div>
        </header>
        <div class="post-layout">
          <div class="post-main">
            <div class="post-content" v-html="htmlContent" />
          </div>
          <aside v-if="tocItems.length" class="toc">
            <div class="toc-title">目录</div>
            <button
              v-for="item in tocItems"
              :key="item.id"
              type="button"
              class="toc-link"
              :class="`level-${item.level}`"
              @click="jumpToHeading(item.id)"
            >
              {{ item.text }}
            </button>
          </aside>
        </div>
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
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 32px;
}

.post-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 240px;
  gap: 36px;
  align-items: start;
}

.post-main {
  min-width: 0;
}

.toc {
  position: sticky;
  top: 100px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  padding: 14px 12px;
  max-height: calc(100vh - 130px);
  overflow-y: auto;
}

.toc-title {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.toc-link {
  display: block;
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  line-height: 1.5;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.toc-link:hover {
  color: var(--primary-light);
  background: var(--tag-bg);
}

.toc-link.level-2 {
  padding-left: 18px;
}

.toc-link.level-3 {
  padding-left: 28px;
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
  scroll-margin-top: 90px;
}

.post-content :deep(h3) {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 32px 0 12px;
  scroll-margin-top: 90px;
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

.post-content :deep(img) {
  display: block;
  max-width: 100%;
  width: auto;
  height: auto;
  margin: 24px auto;
  border-radius: 10px;
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

  .container {
    padding: 0 20px;
  }

  .post-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .toc {
    position: static;
    max-height: none;
    order: -1;
  }
}
</style>
