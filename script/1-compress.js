const fs = require('fs')
const gm = require('gm')
const inputPath = __dirname + '/../img'

// 遍历 dist 文件夹中的文件，获取文件相对路径
function getFilePaths(dirPath) {
    let urls = []
    let files = fs.readdirSync(dirPath)
    for (let i = 0, length = files.length; i < length; i++) {
        let fileName = files[i]
        let fileExtName = fileName.split('.')[fileName.split('.').length - 1]
        let fileAbsolutePath = `/${dirPath}/${fileName}` // 文件绝对路径
        let stats = fs.statSync(fileAbsolutePath)
        if (stats.isDirectory()) { // 如果是文件夹，递归
            urls = [...getFilePaths(fileAbsolutePath), ...urls]
        } else if (fileExtName.includes('jpg')) {
            urls.push(fileAbsolutePath.substring(1)) // 去除首字母 '/'，避免 '//' 路径
        }
    }
    return urls
}

async function compress() {
    filePaths = getFilePaths(inputPath)
    console.log(filePaths.length)
    for (let index = 0; index < filePaths.length; index++) {
        console.log('compress: ', index)
        await new Promise((resolve) => {
            gm(filePaths[index])
                .resize(1960)
                .write(filePaths[index], err => {
                    console.log(err);
                    resolve()
                })
        })

    }
}

compress()
