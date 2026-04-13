import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'

const createHistory =
  import.meta.env.VITE_ROUTER_MODE === 'hash'
    ? createWebHashHistory
    : createWebHistory

const router = createRouter({
  history: createHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../pages/BlogPage.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../pages/BlogPost.vue'),
    },
    {
      path: '/demos',
      name: 'demos',
      component: () => import('../pages/DemoPage.vue'),
    },
    {
      path: '/hangzhou',
      name: 'hangzhou',
      component: () => import('../pages/HangzhouPage.vue'),
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

export default router
