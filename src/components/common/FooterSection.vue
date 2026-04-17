<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-top">
        <RouterLink to="/" class="logo">YBY<span>.</span></RouterLink>
        <nav class="footer-links">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/blog">博客</RouterLink>
        </nav>
      </div>
      <div class="divider" />
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} 云边缘. All rights reserved.</p>
        <p class="tech">Built with Vue 3 + Vite ⚡</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 48px 0 32px;
  border-top: 1px solid var(--border);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.logo {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-primary) !important;
}

.logo span {
  color: var(--primary);
}

.footer-links {
  display: flex;
  gap: 28px;
}

.footer-links a {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: var(--text-primary);
}

.divider {
  height: 1px;
  background: var(--border);
  margin-bottom: 24px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.tech {
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    gap: 20px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
