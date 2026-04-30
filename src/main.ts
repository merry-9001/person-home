import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    integrations: [Sentry.browserTracingIntegration({ router })],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1,
  })
}

app.mount('#app')
