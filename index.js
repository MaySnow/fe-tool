/**
 * Created by may on 16/04/2018.
 */
const config = require('./config')
let _argv

try {
  _argv = JSON.parse(process.env.npm_config_argv).original
} catch (ex) {
  _argv = process.argv
}

let matched = _argv.join(' ').split('run build ')
if (!matched || !matched[1]) {
  console.log(`请输入图片名称和在img文件下的要合成的图片的文件夹名`)
  return
}
matched = matched[1].split(' ')


config(matched)
