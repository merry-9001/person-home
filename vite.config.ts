import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: {
        name: process.env.SENTRY_RELEASE,
      },
      sourcemaps: {
        filesToDeleteAfterUpload: ['dist/**/*.map'],
      },
      disable: !process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  base: './',
  build: {
    sourcemap: true,
  },
})
