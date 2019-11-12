// Load in dependencies
const path = require('path');
const fs = require('fs');
const Spritesmith = require('spritesmith');
const Absurd = require('absurd');
const createHTML = require('create-html');
let api = Absurd();

/**
 * 合成雪碧图
 * @param matched 图片名称 在img文件下的要合成的图片的文件夹名 动画图片大小 [动画时间(单位秒)]
 * Spritesmith 参数参考：https://github.com/Ensighten/spritesmith
 */
module.exports = function (matched) {
  let cssName = `p-${matched[0]}`;
  let imgPath = matched[1];

  let time = matched[2] || 1.5;

  let entryObj = [];
  const glob = require('glob');
  let files = glob.sync('**/*', {
    cwd: path.join(__dirname, 'img/' + imgPath)
  });

  let distPath = path.join(__dirname, `dist/${imgPath}`)

  if(!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
  }

  if(!fs.existsSync(distPath)) {
    fs.mkdirSync(path.join(distPath));
  }

  files = files.sort((a,b) => {
    return Number((/(\d+)/g.exec(a))[0]) - Number((/(\d+)/g.exec(b))[0])
  })
  files.forEach(function (file) {
    console.log(file)
    entryObj.push(path.join(__dirname, 'img/' + imgPath + '/') + file);
  });
// Generate our spritesheet
  Spritesmith.run({
    src: entryObj,
    padding: 10,
    algorithm: 'binary-tree',
    algorithmOpts: {sort: true}
  }, function handleResult(err, result) {
    // If there was an error, throw it
    if (err) {
      throw err;
    }
    fs.writeFileSync(`${distPath}/${cssName}.png`, result.image);
    console.log('--------生成图片成功')

    let cssBg = {};
    cssBg['.' + cssName] = {
      'background-image': `url("./${cssName}.png")`,
      'background-repeat': 'no-repeat',
      'display': 'inline-block',
      'animation':  `${cssName} steps(1,end) ${time}s infinite`
    };

    let keyframes = ``
    let coordinates = result.coordinates;
    let cooArr = []
    for (let coo in coordinates) {
      if (coordinates.hasOwnProperty(coo)) {
        let curItem = coordinates[coo];
        cooArr.push(curItem)
      }
    }
    let cooArrLen = cooArr.length

    cooArr.forEach((item,idx) => {
      keyframes += `${(idx/(cooArrLen-1))*100}% {background-position: ${-1*item.x}px ${-1*item.y}px;width:${item.width}px; height:${item.height}px;}`
    })

    api.add(cssBg);
    api.compile(function (err, css) {
      css += `@keyframes ${cssName} {${keyframes}}`
      // use the compiled css
      fs.writeFileSync(`${distPath}/${cssName}.css`, css);
      console.log('--------生成css成功')
      fs.writeFileSync(`${distPath}/${cssName}.less`, css);
      console.log('--------生成less成功')
      renderHtml(cssName,function () {
        console.log('--------生成html成功')
        console.log('-------done');
        console.log(`原图片的路径为：${imgPath}`)
        console.log(`生成css的名称为：${cssName}`)
        console.log(`生成img雪碧图的的名称为：${cssName}.png`)
      })
    });


    function renderHtml(cssName,cb) {
      let html = createHTML({
        title: cssName,
        script: '../../static/base.js',
        css: ['../../static/base.css',`${cssName}.css`],
        head: `<meta charset="utf-8">
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
        <meta name="renderer" content="webkit"/>
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover">
        <meta content="yes" name="apple-mobile-web-app-capable"/>`,
        body: `<div class="ui-container"><div class="icon-wrap">
            <div class="${cssName}"></div>
          </div></div>`
      })
      fs.writeFile(`${distPath}/index.html`, html, function (err) {
        if (err) {
          console.log(err)
          return
        }
        cb()
      })
    }



  });
};

