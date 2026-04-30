# person-home

个人主页项目，基于 Vue 3、TypeScript 和 Vite。

## 开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## Sentry

项目已经预留了 Sentry 前端监控和 sourcemap 上传配置。

开关位于 `.github/ci-config.env`：

```env
SENTRY_ENABLED=true
```

设置为 `true` 时，CI 会注入 `VITE_SENTRY_DSN` 并上传 sourcemap。设置为 `false` 时，CI 会传入空的 Sentry 配置，前端不会初始化 Sentry，构建阶段也不会上传 sourcemap。

当前依赖版本：

- `@sentry/vue`: `10.50.0`
- `@sentry/vite-plugin`: `5.2.0`

本地或 CI 需要的变量如下：

```env
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
VITE_SENTRY_ENVIRONMENT=production
VITE_SENTRY_RELEASE=your-release-id

SENTRY_AUTH_TOKEN=sntrys_xxx
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_RELEASE=your-release-id
```

说明：

- `VITE_SENTRY_DSN` 会打进前端产物，用于浏览器上报错误。
- `SENTRY_AUTH_TOKEN`、`SENTRY_ORG`、`SENTRY_PROJECT` 只用于构建阶段上传 sourcemap，不应写入仓库。
- `VITE_SENTRY_RELEASE` 和 `SENTRY_RELEASE` 建议统一使用同一个发布标识，当前 workflow 默认使用 commit SHA。

如果你只想先启用前端报错采集，没有配置上传 token，也可以正常构建；Vite 插件会在缺少 `SENTRY_AUTH_TOKEN` 时自动跳过 sourcemap 上传。
