'use strict'

const ejs = require('ejs')
const Entities = require('html-entities').AllHtmlEntities
const FrontMatter = require('hexo-front-matter')
const moment = require('moment')

const entities = new Entities()
// 背景色区块支持
const colorBlocks = {
  ':::tips\n': '<div style="background: #FFFBE6padding:10pxborder: 1px solid #C3C3C3border-radius:5pxmargin-bottom:5px">',
  ':::danger\n': '<div style="background: #FFF3F3padding:10pxborder: 1px solid #DEB8BEborder-radius:5pxmargin-bottom:5px">',
  ':::info\n': '<div style="background: #E8F7FFpadding:10pxborder: 1px solid #ABD2DAborder-radius:5pxmargin-bottom:5px">',
  '\\s+:::': '</div>',
}

// 文章模板
const template = `---
<%- matter -%>

<%- raw -%>`

/**
 * front matter 反序列化
 * @description
 * docs: https://www.npmjs.com/package/hexo-front-matter
 *
 * @param {String} body md 文档
 * @return {String} result
 */
function parseMatter(body) {
  body = entities.decode(body)
  try {
    // front matter信息的<br/>换成 \n
    const regex = /(title:|layout:|tags:|date:|categories:){1}(\S|\s)+?---/gi
    body = body.replace(regex, a =>
      a.replace(/(<br \/>|<br>|<br\/>)/gi, '\n')
    )
    // 支持提示区块语法
    for (const key in colorBlocks) {
      body = body.replace(new RegExp(key, 'igm'), colorBlocks[key])
    }
    const result = FrontMatter.parse(body)
    result.body = result._content
    if (result.date) {
      result.date = formatDate(result.date)
    }
    delete result._content
    return result
  } catch (error) {
    return {
      body,
    }
  }
}

function formatDate(date) {
  return moment(new Date(date).toISOString()).format('YYYY-MM-DD HH:mm:ss ZZ')
}

/**
 * 格式化 markdown 内容
 *
 * @param {String} body md 文档
 * @return {String} body
 */
function formatRaw(body) {
  const multiBr = /(<br>[\s\n]){2}/gi
  const multiBrEnd = /(<br \/>[\n]?){2}/gi
  const brBug = /<br \/>/g
  const hiddenContent = /<div style="display:none">[\s\S]*?<\/div>/gi
  // 删除语雀特有的锚点
  const emptyAnchor = /<a name=".*?"><\/a>/g
  body = body
    .replace(hiddenContent, '')
    .replace(multiBr, '<br>')
    .replace(multiBrEnd, '<br />\n')
    .replace(brBug, '\n')
    .replace(emptyAnchor, '')
  return formatMarkdown(body)
}

const formatMarkdown = (() => {
  let prettier
  try {
    prettier = require('prettier')
    return body => prettier.format(body, { parser: 'markdown' })
  } catch (error) {
    out.warn('Node 8 doesn\'t support prettier@latest (see: https://github.com/prettier/eslint-config-prettier/issues/140), the markdown will not be formated.')
    return body => body
  }
})()

/**
 * hexo 文章生产适配器
 *
 * @param {Object} post 文章
 * @return {String} text
 */
module.exports = async function (post) {
  // matter 解析
  const parseRet = parseMatter(post.body)
  const { body, ...data } = parseRet
  const { title, slug: urlname, created_at, description, cover } = post
  const raw = formatRaw(body)
  const date = data.date || formatDate(created_at)
  const tags = post.tags?.map(item => item.title) || []
  const categories = data.categories || []
  const props = {
    title: title.replace(/"/g, ''), // 临时去掉标题中的引号，至少保证文章页面是正常可访问的
    urlname,
    date,
    ...data,
    tags,
    description,
    image: cover,
    categories,
  }
  const text = ejs.render(template, {
    raw,
    matter: FrontMatter.stringify(props),
  })
  return text
}
