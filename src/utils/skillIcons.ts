import {
  siDocker,
  siElectron,
  siExpress,
  siGithubactions,
  siJavascript,
  siLinux,
  siModelcontextprotocol,
  siMysql,
  siNestjs,
  siNodedotjs,
  siNuxt,
  siReact,
  siRedis,
  siTypescript,
  siVite,
  siVuedotjs,
  siWebpack,
} from 'simple-icons'

import type { SimpleIcon } from 'simple-icons'

/** UniApp 不在 Simple Icons 中，使用本地 SVG 路径数据 */
const UNIAPP_ICON: SimpleIcon = {
  title: 'uni-app',
  slug: 'uniapp',
  hex: '2A9934',
  path: 'M20.8 24.4c-1.1 0-2 .9-2 2v75.2c0 1.1.9 2 2 2h12.5c1.1 0 2-.9 2-2V50.3l28.3 41.4c.8 1.2 2.6 1.2 3.4 0l28.3-41.4v51.3c0 1.1.9 2 2 2H107c1.1 0 2-.9 2-2V26.4c0-1.1-.9-2-2-2H94.5c-.8 0-1.5.4-1.9 1.1L64 65.8 35.4 25.5c-.4-.7-1.1-1.1-1.9-1.1H20.8z',
  svg: '',
  source: 'https://uniapp.dcloud.net.cn/',
}

const SKILL_ICON_MAP: Record<string, SimpleIcon> = {
  javascript: siJavascript,
  vue: siVuedotjs,
  react: siReact,
  webpack: siWebpack,
  vite: siVite,
  typescript: siTypescript,
  nodejs: siNodedotjs,
  express: siExpress,
  nestjs: siNestjs,
  nuxt: siNuxt,
  mysql: siMysql,
  redis: siRedis,
  linux: siLinux,
  docker: siDocker,
  'github-actions': siGithubactions,
  mcp: siModelcontextprotocol,
  uniapp: UNIAPP_ICON,
  electron: siElectron,
}

export function getSkillIcon(slug: string): SimpleIcon | undefined {
  return SKILL_ICON_MAP[slug]
}
