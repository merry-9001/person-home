<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
const loading = ref(true)
const searchKeyword = ref('')

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
  visible.value = true

  const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' })
  const entries = Object.entries(modules).sort(([a], [b]) => (a > b ? -1 : 1))
  const INITIAL_BATCH_SIZE = 3
  const STREAM_BATCH_SIZE = 4

  const loadedPosts: PostMeta[] = []
  let index = 0

  for (const [path, loader] of entries) {
    try {
      const raw = (await loader()) as string
      const { meta } = parseFrontmatter(raw)
      const slug = path.split('/').pop()!.replace('.md', '')

      loadedPosts.push({
        slug,
        title: meta.title || slug,
        date: meta.date || '',
        summary: meta.summary || '',
        tags: Array.isArray(meta.tags) ? meta.tags : [],
      })

      index++

      // 首批加载完成后再展示，避免加载态和真实内容频繁切换
      if (loading.value && index >= INITIAL_BATCH_SIZE) {
        posts.value = [...loadedPosts]
        loading.value = false
        continue
      }

      // 后续改为分批刷新，减少频繁重排带来的视觉跳动
      if (!loading.value && index % STREAM_BATCH_SIZE === 0) {
        posts.value = [...loadedPosts]
      }
    } catch {
      // 单篇失败不影响其他文章
      // 可以根据需要在这里上报错误
    }
  }

  // 收尾同步，确保最后一批也渲染出来
  posts.value = [...loadedPosts]
  loading.value = false
})

function goPost(slug: string) {
  router.push({ name: 'blog-post', params: { slug } })
}

const BLOG_POST_TAG = '博客文章'

const normalizedKeyword = computed(() => searchKeyword.value.trim().toLowerCase())

const blogPostsOnly = computed(() =>
  posts.value.filter((post) => post.tags.includes(BLOG_POST_TAG)),
)

const filteredPosts = computed(() => {
  const keyword = normalizedKeyword.value
  const list = blogPostsOnly.value
  if (!keyword) return list

  return list.filter((post) => {
    const searchText = [post.title, post.summary, post.date, ...post.tags].join(' ').toLowerCase()
    return searchText.includes(keyword)
  })
})
</script>

<template>
  <section class="blog-page" :class="{ visible }">
    <div class="container">
      <div class="page-header">
        <span class="tag">博客</span>
        <h1>我的文章</h1>
        <p class="subtitle">记录技术探索与思考</p>
      </div>
      <div class="search-box">
        <input
          v-model="searchKeyword"
          type="text"
          class="search-input"
          placeholder="搜索标题、摘要、标签..."
          aria-label="搜索文章"
        />
      </div>

      <!-- 加载中骨架屏 -->
      <div v-if="loading" class="posts-list">
        <article v-for="n in 3" :key="n" class="post-card skeleton">
          <div class="skeleton-date" />
          <div class="skeleton-title" />
          <div class="skeleton-line" />
          <div class="skeleton-line short" />
          <div class="skeleton-tags">
            <span class="skeleton-tag" />
            <span class="skeleton-tag" />
          </div>
        </article>
        <div class="loading-text">文章加载中，请稍候...</div>
      </div>

      <!-- 加载完成后的正常列表与空状态 -->
      <template v-else>
        <div class="posts-list">
          <article
            v-for="(post, i) in filteredPosts"
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
        <div v-if="posts.length === 0" class="empty">
          <p>暂无文章，敬请期待...</p>
        </div>
        <div v-else-if="blogPostsOnly.length === 0" class="empty">
          <p>暂无带「博客文章」标签的文章</p>
        </div>
        <div v-else-if="filteredPosts.length === 0" class="empty">
          <p>没有找到匹配的文章</p>
        </div>
      </template>
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

.search-box {
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  color: var(--text-primary);
  padding: 12px 14px;
  font-size: 0.95rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent);
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
  min-height: 210px;
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

.skeleton {
  position: relative;
  overflow: hidden;
}

.skeleton::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent 0%,
    color-mix(in srgb, var(--border) 40%, transparent) 30%,
    transparent 60%
  );
  transform: translateX(-100%);
  animation: skeleton-shimmer 1.4s infinite;
}

.skeleton-date,
.skeleton-title,
.skeleton-line,
.skeleton-tag {
  background: color-mix(in srgb, var(--bg-card) 60%, var(--border) 40%);
  border-radius: 999px;
}

.skeleton-date {
  width: 120px;
  height: 10px;
  margin-bottom: 14px;
}

.skeleton-title {
  width: 70%;
  height: 18px;
  margin-bottom: 16px;
}

.skeleton-line {
  width: 100%;
  height: 10px;
  margin-bottom: 10px;
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-tags {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.skeleton-tag {
  width: 60px;
  height: 18px;
}

.loading-text {
  text-align: center;
  margin-top: 12px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.empty {
  text-align: center;
  padding: 80px 0;
  color: var(--text-muted);
}

@keyframes skeleton-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
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
