# .github 目录说明

这个目录保存 GitHub 仓库相关的自动化配置。当前项目主要用它完成三件事：

1. 代码推送后运行 SonarCloud 质量检查。
2. 构建前端静态文件，并推送到 `merry-9001/merry-9001.github.io` 仓库。
3. 构建 Docker 镜像，推送到 Docker Hub，并通知服务器部署。

## 目录结构

```text
.github
├── ci-config.env
└── workflows
    ├── sonarcloud-analysis.yml
    ├── build-to-io.yml
    └── deploy-to-server.yml
```

## 总体流程

整个 CI/CD 流程由 `.github/ci-config.env` 控制。

当前配置：

```env
SONARCLOUD_ENABLED=true
SENTRY_ENABLED=true
```

当 `SONARCLOUD_ENABLED=true` 时，主流程是：

```text
push main
  ↓
SonarCloud Analysis
  ↓ Quality Gate 通过
Build and Push to Another Repo
Deploy To Server
```

也就是说，先跑 SonarCloud。只有 SonarCloud workflow 成功完成，后面的构建、发布和部署才会继续。

当 `SONARCLOUD_ENABLED=false` 时，主流程是：

```text
push main
  ↓
Build and Push to Another Repo
Deploy To Server
```

也就是说，跳过 SonarCloud，直接构建、发布和部署。

`SENTRY_ENABLED` 不控制 workflow 是否运行，只控制构建时是否启用 Sentry：

```text
SENTRY_ENABLED=true
  注入 Sentry DSN
  上传 sourcemap

SENTRY_ENABLED=false
  不注入 Sentry DSN
  不上传 sourcemap
```

## ci-config.env

文件路径：

```text
.github/ci-config.env
```

当前内容：

```env
SONARCLOUD_ENABLED=true
SENTRY_ENABLED=true
```

`SONARCLOUD_ENABLED` 用来控制是否启用 SonarCloud 质量门。

值为 `true` 时，`main` 分支的发布流程会等待 SonarCloud 运行成功。值为 `false` 时，发布流程直接由 `push main` 触发。

`SENTRY_ENABLED` 用来控制是否启用 Sentry。

值为 `true` 时，workflow 会把 `VITE_SENTRY_DSN`、`SENTRY_AUTH_TOKEN`、`SENTRY_ORG`、`SENTRY_PROJECT` 等变量注入构建流程。值为 `false` 时，这些变量会被传为空字符串，前端不会初始化 Sentry，构建阶段也不会上传 sourcemap。

建议这两个值只写小写的 `true` 或 `false`。

## SonarCloud Analysis

文件路径：

```text
.github/workflows/sonarcloud-analysis.yml
```

这个 workflow 负责代码质量分析。它会在两种情况下触发：

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
    types:
      - opened
      - synchronize
      - reopened
```

含义：

- 推送到 `main` 时触发。
- 创建、更新、重新打开目标分支为 `main` 的 PR 时触发。

权限配置：

```yaml
permissions:
  contents: read
  pull-requests: read
```

这个 workflow 只需要读取代码和 PR 信息，不需要写仓库，所以权限保持最小。

### config 任务

```yaml
jobs:
  config:
    name: Read CI config
    runs-on: ubuntu-latest
    outputs:
      sonarcloud_enabled: ${{ steps.config.outputs.sonarcloud_enabled }}
```

`config` 任务只做一件事：读取 `.github/ci-config.env`，然后把配置输出给后续任务。

```yaml
- name: Checkout code
  uses: actions/checkout@v4
```

先拉取代码。因为 `.github/ci-config.env` 在仓库里，必须 checkout 后才能读取。

```yaml
- name: Read SonarCloud switch
  id: config
  shell: bash
  run: |
    set -euo pipefail
    source .github/ci-config.env
    echo "sonarcloud_enabled=${SONARCLOUD_ENABLED:-true}" >> "$GITHUB_OUTPUT"
```

逐行含义：

- `set -euo pipefail`：让脚本在出错、使用未定义变量、管道失败时立即失败。
- `source .github/ci-config.env`：读取配置文件里的变量。
- `echo ... >> "$GITHUB_OUTPUT"`：把 `SONARCLOUD_ENABLED` 写成 GitHub Actions 的 step output。
- `${SONARCLOUD_ENABLED:-true}`：如果没有配置这个变量，默认按 `true` 处理。

### sonarcloud-analysis 任务

```yaml
sonarcloud-analysis:
  name: SonarCloud Analysis
  runs-on: ubuntu-latest
  needs: config
  if: >
    needs.config.outputs.sonarcloud_enabled == 'true' &&
    (github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository)
```

这个任务依赖 `config`，并且只有满足条件才执行。

条件分两部分：

```text
needs.config.outputs.sonarcloud_enabled == 'true'
```

只有 `.github/ci-config.env` 里开启 SonarCloud 时才扫描。

```text
github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository
```

如果不是 PR，正常执行。如果是 PR，要求 PR 来源仓库必须是当前仓库。

这样做是为了避免 fork PR 获取不到 `SONAR_TOKEN`，也避免不可信 fork 代码接触仓库 secrets。

```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

拉取完整 Git 历史。SonarCloud 需要完整历史来判断新代码、提交归属和差异。

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm
```

安装 Node.js 22，并开启 npm 缓存。

```yaml
- name: Install dependencies
  run: npm install
```

安装依赖。这里当前仍使用 npm，因为 SonarCloud workflow 还没切到 pnpm。

```yaml
- name: Cache SonarCloud packages
  uses: actions/cache@v4
  with:
    path: ~/.sonar/cache
    key: ${{ runner.os }}-sonar
    restore-keys: ${{ runner.os }}-sonar
```

缓存 SonarCloud 扫描器下载的文件，减少后续运行时间。

```yaml
- name: Run SonarCloud analysis
  uses: SonarSource/sonarqube-scan-action@v7
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
  with:
    args: >
      -Dsonar.qualitygate.wait=true
      -Dsonar.qualitygate.timeout=300
```

执行 SonarCloud 扫描。

关键参数：

- `SONAR_TOKEN`：从 GitHub Secrets 读取，用于上传扫描结果。
- `sonar.qualitygate.wait=true`：扫描后等待 Quality Gate 结果。
- `sonar.qualitygate.timeout=300`：最多等待 300 秒。

如果 Quality Gate 失败，这个 workflow 会失败。开启 SonarCloud 时，后面的构建和部署也就不会继续。

## Build And Push To Another Repo

文件路径：

```text
.github/workflows/build-to-io.yml
```

这个 workflow 负责把当前项目构建成静态文件，然后推送到 `merry-9001/merry-9001.github.io` 仓库。

它有两个触发入口：

```yaml
on:
  push:
    branches:
      - main
  workflow_run:
    workflows:
      - SonarCloud Analysis
    types:
      - completed
    branches:
      - main
```

为什么有两个入口：

- `push main`：用于 `SONARCLOUD_ENABLED=false`，跳过 SonarCloud 时直接构建。
- `workflow_run`：用于 `SONARCLOUD_ENABLED=true`，等待 SonarCloud 成功后再构建。

### config 任务

```yaml
outputs:
  sonarcloud_enabled: ${{ steps.config.outputs.sonarcloud_enabled }}
  sentry_enabled: ${{ steps.config.outputs.sentry_enabled }}
```

这里会输出两个开关，后续任务会根据它们决定是否执行、是否启用 Sentry。

```yaml
with:
  ref: ${{ github.event.workflow_run.head_sha || github.sha }}
```

checkout 指定 commit。

如果当前 workflow 是由 `workflow_run` 触发，就使用通过 SonarCloud 的 commit：`github.event.workflow_run.head_sha`。

如果当前 workflow 是由 `push` 触发，就使用当前 push 的 commit：`github.sha`。

```bash
source .github/ci-config.env
echo "sonarcloud_enabled=${SONARCLOUD_ENABLED:-true}" >> "$GITHUB_OUTPUT"
echo "sentry_enabled=${SENTRY_ENABLED:-true}" >> "$GITHUB_OUTPUT"
```

读取两个开关，并把它们写入 outputs。默认都按 `true` 处理。

### build-and-push 任务

```yaml
if: >
  (
    needs.config.outputs.sonarcloud_enabled == 'false' &&
    github.event_name == 'push'
  ) ||
  (
    needs.config.outputs.sonarcloud_enabled == 'true' &&
    github.event_name == 'workflow_run' &&
    github.event.workflow_run.conclusion == 'success' &&
    github.event.workflow_run.head_repository.full_name == github.repository &&
    github.event.workflow_run.head_branch == 'main'
  )
```

这是防止重复构建的核心逻辑。

当 `SONARCLOUD_ENABLED=false` 时：

```text
只允许 push 触发的任务执行
```

当 `SONARCLOUD_ENABLED=true` 时：

```text
只允许 workflow_run 触发的任务执行
并且要求 SonarCloud 成功
并且要求来源仓库是当前仓库
并且要求来源分支是 main
```

这样可以避免同一次 `push main` 同时触发两次构建。

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: pnpm
```

安装 Node.js 22，并开启 pnpm 缓存。

```yaml
- name: Install dependencies
  run: |
    corepack enable
    pnpm install --frozen-lockfile
```

启用 Corepack，然后用 pnpm 安装依赖。

`--frozen-lockfile` 表示必须严格按照 `pnpm-lock.yaml` 安装。如果 `package.json` 和 lockfile 不一致，安装会失败。这能保证 CI 和本地依赖一致。

```yaml
- name: Build project
  env:
    VITE_ROUTER_MODE: hash
    VITE_AMAP_KEY: ${{ secrets.VITE_AMAP_KEY }}
    VITE_AMAP_SECURITY_CODE: ${{ secrets.VITE_AMAP_SECURITY_CODE }}
    VITE_SENTRY_DSN: ${{ needs.config.outputs.sentry_enabled == 'true' && secrets.VITE_SENTRY_DSN || '' }}
    VITE_SENTRY_ENVIRONMENT: production
    VITE_SENTRY_RELEASE: ${{ github.event.workflow_run.head_sha || github.sha }}
    SENTRY_AUTH_TOKEN: ${{ needs.config.outputs.sentry_enabled == 'true' && secrets.SENTRY_AUTH_TOKEN || '' }}
    SENTRY_ORG: ${{ needs.config.outputs.sentry_enabled == 'true' && secrets.SENTRY_ORG || '' }}
    SENTRY_PROJECT: ${{ needs.config.outputs.sentry_enabled == 'true' && secrets.SENTRY_PROJECT || '' }}
    SENTRY_RELEASE: ${{ github.event.workflow_run.head_sha || github.sha }}
  run: |
    corepack enable
    pnpm build
```

这一段负责构建静态文件。

变量含义：

- `VITE_ROUTER_MODE=hash`：GitHub Pages 仓库使用 hash 路由，避免刷新页面后 404。
- `VITE_AMAP_KEY`：高德地图 key。
- `VITE_AMAP_SECURITY_CODE`：高德地图安全密钥。
- `VITE_SENTRY_DSN`：前端 Sentry 上报地址。
- `VITE_SENTRY_ENVIRONMENT=production`：标记 Sentry 环境为生产环境。
- `VITE_SENTRY_RELEASE`：前端事件所属 release，当前使用 commit SHA。
- `SENTRY_AUTH_TOKEN`：构建阶段上传 sourcemap 的 token。
- `SENTRY_ORG`：Sentry 组织 slug。
- `SENTRY_PROJECT`：Sentry 项目 slug。
- `SENTRY_RELEASE`：sourcemap 所属 release，和 `VITE_SENTRY_RELEASE` 保持一致。

`needs.config.outputs.sentry_enabled == 'true' && secrets.xxx || ''` 的作用是：

```text
SENTRY_ENABLED=true
  使用 GitHub Secrets 中的值

SENTRY_ENABLED=false
  传空字符串
```

前端代码里只有 `VITE_SENTRY_DSN` 存在时才会初始化 Sentry。Vite 插件里没有 `SENTRY_AUTH_TOKEN` 时也会跳过 sourcemap 上传。

```yaml
- name: Clone target repo
  run: |
    git clone https://x-access-token:${{ secrets.test }}@github.com/merry-9001/merry-9001.github.io.git target-repo
```

克隆目标 GitHub Pages 仓库到 `target-repo` 目录。

这里的 `secrets.test` 是访问目标仓库的 GitHub token。

```yaml
- name: Replace target repo contents
  run: |
    find target-repo -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
    cp -r dist/. target-repo/
```

先删除目标仓库里除 `.git` 外的顶层文件，再把当前项目的 `dist` 内容复制进去。

```yaml
- name: Commit and push
  run: |
    cd target-repo
    git config user.name "github-actions[bot]"
    git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
    git add .

    if git diff --cached --quiet; then
      echo "No changes to commit"
      exit 0
    fi

    git commit -m "Build from source-repo @ ${{ github.event.workflow_run.head_sha || github.sha }}"
    git push origin main
```

进入目标仓库，配置提交人，提交构建结果并推送。

如果构建结果没有变化，`git diff --cached --quiet` 会判断为空，然后直接退出，避免创建空提交。

## Deploy To Server

文件路径：

```text
.github/workflows/deploy-to-server.yml
```

这个 workflow 负责服务器部署。它会构建 Docker 镜像，推送到 Docker Hub，然后通过 SSH 登录服务器执行部署脚本。

它有三个触发入口：

```yaml
on:
  push:
    branches:
      - main
  workflow_run:
    workflows:
      - SonarCloud Analysis
    types:
      - completed
    branches:
      - main
  workflow_dispatch:
```

含义：

- `push main`：用于 `SONARCLOUD_ENABLED=false` 时直接部署。
- `workflow_run`：用于 `SONARCLOUD_ENABLED=true` 时等待 SonarCloud 成功后部署。
- `workflow_dispatch`：允许在 GitHub Actions 页面手动触发部署。

### config 任务

这个任务和 `build-to-io.yml` 里的 `config` 基本相同，也是读取：

```text
SONARCLOUD_ENABLED
SENTRY_ENABLED
```

然后输出：

```text
sonarcloud_enabled
sentry_enabled
```

### deploy 任务

```yaml
if: >
  github.event_name == 'workflow_dispatch' ||
  (
    needs.config.outputs.sonarcloud_enabled == 'false' &&
    github.event_name == 'push'
  ) ||
  (
    needs.config.outputs.sonarcloud_enabled == 'true' &&
    github.event_name == 'workflow_run' &&
    github.event.workflow_run.conclusion == 'success' &&
    github.event.workflow_run.head_repository.full_name == github.repository &&
    github.event.workflow_run.head_branch == 'main'
  )
```

执行条件分三种情况：

- 手动触发时直接部署。
- `SONARCLOUD_ENABLED=false` 时，允许 `push main` 触发部署。
- `SONARCLOUD_ENABLED=true` 时，只允许成功的 SonarCloud `workflow_run` 触发部署。

```yaml
env:
  IMAGE_NAME: ${{ secrets.DOCKERHUB_USERNAME }}/person-home
```

设置 Docker 镜像名。镜像名由 Docker Hub 用户名和项目名组成。

```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    ref: ${{ github.event.workflow_run.head_sha || github.ref }}
```

拉取要部署的代码。

如果是 SonarCloud 触发，就使用通过质量检查的 commit。如果是手动触发，就使用当前选择的 ref。

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
```

初始化 Docker Buildx。Buildx 是 Docker 的高级构建工具，后续 `docker/build-push-action` 会使用它构建镜像。

```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}
```

登录 Docker Hub。用户名和 token 都来自 GitHub Secrets。

```yaml
- name: Extract Docker metadata
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ${{ env.IMAGE_NAME }}
    tags: |
      type=raw,value=latest
      type=sha,prefix=
```

生成 Docker 镜像标签。

当前会生成两类 tag：

- `latest`：表示最新版本。
- commit SHA：表示具体版本，方便回滚和追踪。

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
    build-args: |
      VITE_ROUTER_MODE=history
      VITE_AMAP_KEY=${{ secrets.VITE_AMAP_KEY }}
      VITE_AMAP_SECURITY_CODE=${{ secrets.VITE_AMAP_SECURITY_CODE }}
      VITE_SENTRY_DSN=${{ needs.config.outputs.sentry_enabled == 'true' && secrets.VITE_SENTRY_DSN || '' }}
      VITE_SENTRY_ENVIRONMENT=production
      VITE_SENTRY_RELEASE=${{ github.event.workflow_run.head_sha || github.sha }}
      SENTRY_AUTH_TOKEN=${{ needs.config.outputs.sentry_enabled == 'true' && secrets.SENTRY_AUTH_TOKEN || '' }}
      SENTRY_ORG=${{ needs.config.outputs.sentry_enabled == 'true' && secrets.SENTRY_ORG || '' }}
      SENTRY_PROJECT=${{ needs.config.outputs.sentry_enabled == 'true' && secrets.SENTRY_PROJECT || '' }}
      SENTRY_RELEASE=${{ github.event.workflow_run.head_sha || github.sha }}
```

构建并推送 Docker 镜像。

关键字段：

- `context: .`：Docker 构建上下文是仓库根目录。
- `push: true`：构建完成后推送到 Docker Hub。
- `tags`：使用上一步生成的镜像标签。
- `labels`：使用上一步生成的镜像元数据。
- `build-args`：传给 Dockerfile 的构建参数。

服务器部署使用 `history` 路由模式：

```text
VITE_ROUTER_MODE=history
```

GitHub Pages 发布使用 `hash` 路由模式，服务器部署使用 `history` 路由模式，这是两条构建链路最重要的区别之一。

Sentry 的开关逻辑和 `build-to-io.yml` 一样：`SENTRY_ENABLED=true` 时注入 secrets，`SENTRY_ENABLED=false` 时传空字符串。

```yaml
- name: Trigger remote deployment
  uses: appleboy/ssh-action@v1.2.0
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USERNAME }}
    key: ${{ secrets.SERVER_SSH_KEY }}
    port: ${{ secrets.SERVER_PORT }}
    script_stop: true
    script: |
      cd /opt/person-home
      chmod +x deploy.sh
      export APP_IMAGE="${{ env.IMAGE_NAME }}:latest"
      ./deploy.sh main
```

通过 SSH 登录服务器并执行部署脚本。

逐行含义：

- `host`：服务器地址。
- `username`：SSH 用户名。
- `key`：SSH 私钥。
- `port`：SSH 端口。
- `script_stop: true`：远程脚本任意命令失败时立即停止。
- `cd /opt/person-home`：进入服务器上的部署目录。
- `chmod +x deploy.sh`：确保部署脚本可执行。
- `export APP_IMAGE=...`：告诉部署脚本要使用哪个 Docker 镜像。
- `./deploy.sh main`：执行服务器上的部署脚本，并传入 `main` 参数。

## Dockerfile 中的构建参数

部署服务器时，Docker 镜像由 `Dockerfile` 构建。

相关片段：

```dockerfile
ARG VITE_ROUTER_MODE=history
ARG VITE_AMAP_KEY
ARG VITE_AMAP_SECURITY_CODE
ARG VITE_SENTRY_DSN
ARG VITE_SENTRY_ENVIRONMENT=production
ARG VITE_SENTRY_RELEASE
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_RELEASE
```

这些 `ARG` 对应 `deploy-to-server.yml` 中传入的 `build-args`。

```dockerfile
RUN VITE_ROUTER_MODE="${VITE_ROUTER_MODE}" \
  VITE_AMAP_KEY="${VITE_AMAP_KEY}" \
  VITE_AMAP_SECURITY_CODE="${VITE_AMAP_SECURITY_CODE}" \
  VITE_SENTRY_DSN="${VITE_SENTRY_DSN}" \
  VITE_SENTRY_ENVIRONMENT="${VITE_SENTRY_ENVIRONMENT}" \
  VITE_SENTRY_RELEASE="${VITE_SENTRY_RELEASE}" \
  SENTRY_AUTH_TOKEN="${SENTRY_AUTH_TOKEN}" \
  SENTRY_ORG="${SENTRY_ORG}" \
  SENTRY_PROJECT="${SENTRY_PROJECT}" \
  SENTRY_RELEASE="${SENTRY_RELEASE}" \
  pnpm build
```

这一步把 Docker build 参数转成当前命令的环境变量，然后执行 `pnpm build`。

因为 Vite 只会把 `VITE_` 前缀的变量注入前端，所以：

- `VITE_SENTRY_DSN` 会进入浏览器产物。
- `VITE_SENTRY_ENVIRONMENT` 会进入浏览器产物。
- `VITE_SENTRY_RELEASE` 会进入浏览器产物。
- `SENTRY_AUTH_TOKEN` 不会进入浏览器产物，只给 Vite 插件上传 sourcemap 使用。
- `SENTRY_ORG` 和 `SENTRY_PROJECT` 不会进入浏览器产物，只给 Vite 插件使用。

最终镜像使用 nginx 提供静态文件：

```dockerfile
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
```

## Sentry 在项目中的位置

Sentry 的前端初始化在：

```text
src/main.ts
```

关键逻辑是：

```ts
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
```

含义：

- 没有 `VITE_SENTRY_DSN` 时不初始化 Sentry。
- 有 `VITE_SENTRY_DSN` 时开始采集浏览器错误。
- `environment` 用于区分环境，比如 `production`。
- `release` 用于把错误和对应版本关联起来。
- `browserTracingIntegration({ router })` 会把 Vue Router 路由变化纳入性能追踪。
- 生产环境采样率是 `0.1`，开发环境是 `1`。

Sentry 的 sourcemap 上传配置在：

```text
vite.config.ts
```

关键逻辑是：

```ts
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
})
```

含义：

- `org`：Sentry 组织。
- `project`：Sentry 项目。
- `authToken`：上传 sourcemap 的认证 token。
- `release.name`：sourcemap 所属版本。
- `filesToDeleteAfterUpload`：上传后删除 `dist/**/*.map`，避免 sourcemap 被公开访问。
- `disable: !process.env.SENTRY_AUTH_TOKEN`：没有 token 时禁用上传。

同时 Vite 开启了：

```ts
build: {
  sourcemap: true,
}
```

这会生成 sourcemap。只有生成 sourcemap，Sentry 才能把线上压缩后的错误堆栈还原成源码位置。

## 需要配置的 GitHub Secrets

当前 workflows 用到这些 GitHub Secrets：

```text
SONAR_TOKEN
VITE_AMAP_KEY
VITE_AMAP_SECURITY_CODE
test
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
SERVER_HOST
SERVER_USERNAME
SERVER_SSH_KEY
SERVER_PORT
VITE_SENTRY_DSN
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
```

用途说明：

- `SONAR_TOKEN`：SonarCloud 扫描使用。
- `VITE_AMAP_KEY`：高德地图 key。
- `VITE_AMAP_SECURITY_CODE`：高德地图安全密钥。
- `test`：推送 `merry-9001/merry-9001.github.io` 仓库使用的 GitHub token。
- `DOCKERHUB_USERNAME`：Docker Hub 用户名。
- `DOCKERHUB_TOKEN`：Docker Hub token。
- `SERVER_HOST`：服务器地址。
- `SERVER_USERNAME`：服务器 SSH 用户名。
- `SERVER_SSH_KEY`：服务器 SSH 私钥。
- `SERVER_PORT`：服务器 SSH 端口。
- `VITE_SENTRY_DSN`：前端上报错误使用。
- `SENTRY_AUTH_TOKEN`：上传 sourcemap 使用。
- `SENTRY_ORG`：Sentry 组织 slug。
- `SENTRY_PROJECT`：Sentry 项目 slug。

## 常见场景

### 正常发布

配置：

```env
SONARCLOUD_ENABLED=true
SENTRY_ENABLED=true
```

执行流程：

```text
push main
  ↓
SonarCloud Analysis
  ↓ 成功
Build and Push to Another Repo
Deploy To Server
```

结果：

- GitHub Pages 仓库更新。
- Docker 镜像更新。
- 服务器执行部署脚本。
- Sentry 采集前端错误。
- Sentry 上传 sourcemap。

### 临时跳过 SonarCloud

配置：

```env
SONARCLOUD_ENABLED=false
SENTRY_ENABLED=true
```

执行流程：

```text
push main
  ↓
Build and Push to Another Repo
Deploy To Server
```

结果：

- 不跑 SonarCloud。
- 仍然构建和部署。
- Sentry 仍然启用。

### 临时关闭 Sentry

配置：

```env
SONARCLOUD_ENABLED=true
SENTRY_ENABLED=false
```

执行流程：

```text
push main
  ↓
SonarCloud Analysis
  ↓ 成功
Build and Push to Another Repo
Deploy To Server
```

结果：

- SonarCloud 仍然运行。
- 构建和部署仍然运行。
- 前端不会初始化 Sentry。
- 不会上传 sourcemap。

### 手动部署服务器

在 GitHub Actions 页面手动触发 `Deploy To Server`。

执行流程：

```text
workflow_dispatch
  ↓
Deploy To Server
```

结果：

- 不依赖当前是否由 `push main` 触发。
- 不等待 SonarCloud。
- 仍然会读取 `.github/ci-config.env`，根据 `SENTRY_ENABLED` 决定是否启用 Sentry。

## 注意事项

`build-to-io.yml` 已经使用 pnpm 安装和构建：

```bash
pnpm install --frozen-lockfile
pnpm build
```

如果修改了 `package.json`，需要本地执行：

```bash
pnpm install
```

然后提交更新后的 `pnpm-lock.yaml`，否则 CI 里的 `--frozen-lockfile` 会失败。

`sonarcloud-analysis.yml` 当前仍使用 npm：

```bash
npm install
```

如果希望所有 workflow 完全统一包管理器，可以后续把 SonarCloud workflow 也切到 pnpm。

Sentry sourcemap 上传依赖 `SENTRY_AUTH_TOKEN`。如果没有配置这个 secret，项目仍然能构建，只是不会上传 sourcemap。

如果启用 GitHub Actions 的 SonarCloud 分析，建议在 SonarCloud 后台关闭 Automatic Analysis，避免出现：

```text
You are running CI analysis while Automatic Analysis is enabled.
```

这个错误表示同一个 SonarCloud 项目同时启用了自动分析和 CI 分析，需要关闭其中一个。
