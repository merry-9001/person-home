import { siGithub, siWechat } from 'simple-icons'

import type { SimpleIcon } from 'simple-icons'

/** 通用邮箱图标（Simple Icons 无通用信封） */
const EMAIL_ICON: SimpleIcon = {
  title: 'Email',
  slug: 'email',
  hex: '6366F1',
  path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  svg: '',
  source: '',
}

const CONTACT_ICON_MAP: Record<string, SimpleIcon> = {
  email: EMAIL_ICON,
  github: siGithub,
  wechat: siWechat,
}

export function getContactIcon(slug: string): SimpleIcon | undefined {
  return CONTACT_ICON_MAP[slug]
}
