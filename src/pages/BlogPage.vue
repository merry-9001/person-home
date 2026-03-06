<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface PostMeta {
  slug: string
  title: string
  date: string
  summary: string
  tags: string[]
}

const router = useRouter()
const posts = ref<PostMeta[]>([])
const visible = ref(false)

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
  const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' })
  const list: PostMeta[] = []

  for (const path in modules) {
    const raw = (await modules[path]!()) as string
    const { meta } = parseFrontmatter(raw)
    const slug = path.split('/').pop()!.replace('.md', '')
    list.push({
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      summary: meta.summary || '',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
    })
  }

  list.sort((a, b) => (b.date > a.date ? 1 : -1))
  posts.value = list
  requestAnimationFrame(() => (visible.value = true))
})

function goPost(slug: string) {
  router.push({ name: 'blog-post', params: { slug } })
}
</script>

<template>
  <section class="blog-page" :class="{ visible }">
    <div class="container">
      <div class="page-header">
        <span class="tag">博客</span>
        <h1>我的文章</h1>
        <p class="subtitle">记录技术探索与思考</p>
      </div>
      <div class="posts-list">
        <article
          v-for="(post, i) in posts"
          :key="post.slug"
          class="post-card"
          :style="{ transitionDelay: `${i * 0.1 + 0.2}s` }"
          @click="goPost(post.slug)"
        >
          <div class="post-date">{{ post.date }}</div>
          <h2>{{ post.title }}</h2>
          <p>{{ post.summary }}</p>
          <div class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag-pill">{{ tag }}</span>
          </div>
          <span class="read-more">阅读全文 →</span>
        </article>
      </div>
      <div v-if="posts.length === 0 && visible" class="empty">
        <p>暂无文章，敬请期待...</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blog-page {
  padding: 120px 0 80px;
  min-height: 100vh;
}

.container {
  max-width: 820px;
  margin: 0 auto;
  padding: 0 32px;
}

.page-header {
  text-align: center;
  margin-bottom: 64px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.blog-page.visible .page-header {
  opacity: 1;
  transform: translateY(0);
}

.tag {
  display: inline-block;
  padding: 6px 16px;
  background: var(--tag-bg);
  color: var(--primary-light);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 16px;
  border: 1px solid var(--tag-border);
}

.page-header h1 {
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 700;
  margin-bottom: 12px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.05rem;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.post-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 36px;
  cursor: pointer;
  transition: all 0.35s ease;
  opacity: 0;
  transform: translateY(20px);
}

.blog-page.visible .post-card {
  opacity: 1;
  transform: translateY(0);
}

.post-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.post-date {
  font-size: 0.82rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
}

.post-card h2 {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
}

.post-card p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 16px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tag-pill {
  padding: 3px 12px;
  background: var(--pill-bg);
  color: var(--text-muted);
  border-radius: 50px;
  font-size: 0.78rem;
  font-weight: 500;
  border: 1px solid var(--pill-border);
}

.read-more {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary-light);
  transition: color 0.3s;
}

.post-card:hover .read-more {
  color: var(--accent);
}

.empty {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .blog-page {
    padding: 100px 0 60px;
  }

  .post-card {
    padding: 24px;
  }
}
</style>
