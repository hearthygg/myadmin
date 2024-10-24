var fs = require('fs');
const path = require('path')
const file = path.join(__dirname, './src/utils/version.js');
fs.readFile(file,'utf8',function(err,data) {
  if (err) throw err;
  let currentVersion = data.split(' ')
  let version = currentVersion[currentVersion.length - 1].split('.')
  let changeVersion = `${version[0]}.${version[1]}.${parseInt(version[2])+1}`
  fs.writeFile(file,`export const version = ${changeVersion}'`,'utf8',(err) => {
    if (err) throw err;
  })
})
// 使用npm命令修改版本号
// var shell = require("shelljs")
// 获取package.json
// function getPackageJson() {
//   var _packageJson = fs.readFileSync('./package.json')
//   return JSON.parse(_packageJson)
// }
// var pag = getPackageJson()
// var versionArr = pag.version.split('.')
// // 目前只修改三位版本号最后一位版本号
// var changeVersion = `${versionArr[0]}.${versionArr[1]}.${parseInt(versionArr[2])+1}`
// pag.version = changeVersion
// // shell.exec("npm version " + changeVersion)
// fs.writeFile('./package.json', JSON.stringify(pag), function (err) {
//   if (err) console.error(err);
//   console.log('----------------------修改package.json文件完毕，version修改为：', pag.version)
// });
