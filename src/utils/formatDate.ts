/** 将 frontmatter 中的日期（如 2026-05-18 10:45:02 +0800）格式化为可读文本 */
export function formatBlogDate(raw: string): string {
  if (!raw) return ''

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return raw

  const [, year, month, day] = match
  return `${year}年${Number(month)}月${Number(day)}日`
}
