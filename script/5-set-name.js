const fs = require('fs')
// const sourcePath = `${__dirname}/../json/source/level_1`
const sourcePath = `${__dirname}/../icon`

// 遍历 dist 文件夹中的文件，获取文件相对路径
function getFilePaths(dirPath, fileExts) {
    let urls = []
    let files = fs.readdirSync(dirPath)
    for (let i = 0, length = files.length; i < length; i++) {
        let fileName = files[i]
        let fileExtName = fileName.split('.')[fileName.split('.').length - 1]
        let fileAbsolutePath = `/${dirPath}/${fileName}` // 文件绝对路径
        let stats = fs.statSync(fileAbsolutePath)
        if (stats.isDirectory()) { // 如果是文件夹，递归
            urls = [...getFilePaths(fileAbsolutePath, fileExts), ...urls]
        } else if (fileExts.includes(fileExtName)) { // 过滤 map 文件
            urls.push(fileAbsolutePath.substring(1)) // 去除首字母 '/'，避免 '//' 路径
        }
    }
    return urls
}


function rename() {
    const filePaths = getFilePaths(sourcePath, ['jpg', 'json'])
    for (let index = 0; index < filePaths.length; index++) {
        const pathParams = filePaths[index].split('/')
        const [fileName, extName] = pathParams.pop().split('.')
        const newName = pathParams.join('/') + '/' + fileName.replace('icon-', '').padStart(3, 0) + '.' + extName
        console.log(filePaths[index], newName)
        fs.renameSync(filePaths[index], newName)
    }

}
rename()


