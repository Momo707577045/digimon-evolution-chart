const fs = require('fs')
const sourcePath = `${__dirname}/../level_1`

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
            urls = [...traverseFile(fileAbsolutePath), ...urls]
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
// rename()

function jsonParse() {
    let imgIndex = 0
    const imgPaths = getFilePaths(sourcePath, 'jpg')
    const jsonPaths = getFilePaths(sourcePath, 'json')
    for (let index = 0; index < jsonPaths.length; index++) {
    // for (let index = 0; index < 1; index++) {
        const jsonPath = jsonPaths[index];
        const jsonData = JSON.parse(JSON.parse(fs.readFileSync(jsonPath)).body.data).content.split('分隔符')
        const imgPathParams = imgPaths[imgIndex].split('/')
        imgPathParams.pop()
        let type = 0
        for (let jsonIndex = 0; jsonIndex < jsonData.length; jsonIndex++) {
            let numberStr = jsonData[jsonIndex > 3 ? 4 : 0].match(/N[oO]?.? ?([\d]+)/)[1]
            const newName = imgPathParams.join('/') + '/' + numberStr + '_' + (type + 1) + '.jpg'
            // console.log(imgPaths[imgIndex], newName)
            fs.renameSync(imgPaths[imgIndex], newName)
            imgIndex++
            type++
            type = type % 4
        }
    }
}
jsonParse()