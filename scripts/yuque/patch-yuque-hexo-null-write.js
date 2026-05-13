'use strict'

/**
 * yuque-hexo 在 adapter 返回 null 时仍会 writeFileSync，导致 TypeError。
 * 在 generatePost 里插入空值判断；可重复执行（已打补丁则跳过）。
 */
const fs = require('fs')
const path = require('path')

const PATCH_MARKER = 'person-home-yuque-null-guard'
const downloaderPath = path.join(
  __dirname,
  '../../node_modules/yuque-hexo/lib/Downloader.js'
)

function main() {
  if (!fs.existsSync(downloaderPath)) {
    console.warn('[patch-yuque-hexo] skip: yuque-hexo not installed yet')
    return
  }
  let s = fs.readFileSync(downloaderPath, 'utf8')
  if (s.includes(PATCH_MARKER)) {
    return
  }

  const oldLf = `    const text = await transform(post);
    fs.writeFileSync(postPath, text, {
      encoding: 'UTF8',
    });`

  const ins = `    const text = await transform(post);
    // ${PATCH_MARKER}
    if (text == null || text === '') {
      out.info(\`skip md (adapter returned empty): \${post.title}\`);
      return;
    }
    fs.writeFileSync(postPath, text, {
      encoding: 'UTF8',
    });`

  if (s.includes(oldLf)) {
    s = s.replace(oldLf, ins)
    fs.writeFileSync(downloaderPath, s, 'utf8')
    console.log('[patch-yuque-hexo] applied null-write guard (LF)')
    return
  }

  const oldCrlf = oldLf.replace(/\n/g, '\r\n')
  if (s.includes(oldCrlf)) {
    s = s.replace(oldCrlf, ins.replace(/\n/g, '\r\n'))
    fs.writeFileSync(downloaderPath, s, 'utf8')
    console.log('[patch-yuque-hexo] applied null-write guard (CRLF)')
    return
  }

  console.warn(
    '[patch-yuque-hexo] Downloader.js pattern not matched; yuque-hexo 升级后需人工检查'
  )
}

main()
