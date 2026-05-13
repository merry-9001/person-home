'use strict'

const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const needle = require('needle')
const HexoAdapter = require('./nuxt')

const image_queue = []
let index = 0
let downloaded = 0

function download() {
  if (index >= image_queue.length) {
    return
  }
  const { img_src, down_url } = image_queue[index++]
  needle
    .get(img_src, { headers: { Connection: 'Keep-Alive' } })
    .pipe(fs.createWriteStream(down_url))
    .on('finish', (err) => {
      if (err) {
        process.stdout.write('\n')
        console.error('failed to download', img_src, err)
      } else {
        downloaded++
        process.stdout.write(
          `downloaded ${downloaded}, total ${image_queue.length}\r`
        )
      }
      download()
    })
}
setTimeout(() => {
  for (let i = 0; i < 10; i++) {
    download()
  }
}, 1000 * 5)

function formatImg(text, img_folder) {
  let img_src_reg = /(?<=\[.*\]\()http.+\.(jpg|gif|png|webp).*(?=\))/
  if (!img_src_reg.test(text)) return text

  let img_src = text.match(img_src_reg)[0]
  let img_url = new URL(img_src)
  let img_name = img_url.pathname.slice(img_url.pathname.lastIndexOf('/') + 1)

  let down_url = path.join(img_folder, img_name)
  image_queue.push({ img_src, down_url })
  if (img_url.hash.indexOf('width') > 0) {
    let width = img_url.hash.slice(img_url.hash.indexOf('width'))
    img_name += `#${width}`
  }
  text = text.replace(img_src, img_folder + '\\' + img_name).replaceAll('\\', '/').replaceAll('public/', '')
  return formatImg(text, img_folder)
}

function formatLink(text) {
  let link_reg = /(?<=\[.*\]\()https?:\/\/shanhaibi\.yuque.com[^\)]+/g
  if (!link_reg.test(text)) return text
  text = text.replace(link_reg, (link) => {
    return '/docs/v1' + link.slice(link.lastIndexOf('/'))
  })
  return text
}

module.exports = async function (post) {
  let text = await HexoAdapter(post)
  if (text == null) {
    return null
  }
  if (!/(?<=\[.*\]\()http.+\.(jpg|gif|png|webp).*(?=\))/.test(text)) {
    return text
  }

  let img_dir_name = text.match(/(?<=urlname:).*/)[0].trim()

  // 下载后存放图片的地址
  let img_folder = path.join(
    'public/articles',
    img_dir_name
  )
  mkdirp.sync(img_folder)

  // 图片处理
  text = formatImg(text, img_folder)


  return text
}
