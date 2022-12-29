const fs = require('fs')
const sourcePath = `${__dirname}/../json`
const resultPath = `${__dirname}/../result.js`

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
            urls.push(fileAbsolutePath.substring(1)) // 去除首字母 '/'，避免 
        }
    }
    return urls
}


function resetLevel() {
    const filePaths = getFilePaths(sourcePath, ['json'])
    const resultJson = []
    for (let index = 0; index < filePaths.length; index++) {
        let data = JSON.parse(fs.readFileSync(filePaths[index]))
        data.level = {
            index: {
                '幼年期1': 1,
                '幼年期2': 2,
                '成长期': 3,
                '装甲体': 3,
                '成熟期': 4,
                '完全体': 5,
                '究极体': 6,
                '超究极体': 7,
            }[data.level],
            name: data.level,
        }
        fs.writeFileSync(filePaths[index], JSON.stringify(data, null, 2))
    }
}
// resetLevel()

function getError() {
    const filePaths = getFilePaths(sourcePath, ['json'])
    const resultJson = []
    const errorMsg = []
    for (let index = 0; index < filePaths.length; index++) {
        let data = JSON.parse(fs.readFileSync(filePaths[index]))
        if(!data.level.index){
            errorMsg.push(filePaths[index])
        }
    }
    console.log(errorMsg);
    // fs.writeFileSync(resultPath, `const digimonRelations = ${JSON.stringify(resultJson, null, 2)}`)
}
// getError()



function setResult() {
    const filePaths = getFilePaths(sourcePath, ['json'])
    const resultJson = []
    for (let index = 0; index < filePaths.length; index++) {
        let data = JSON.parse(fs.readFileSync(filePaths[index]))
        resultJson.push(data)
    }
    fs.writeFileSync(resultPath, `const digimonRelations = ${JSON.stringify(resultJson, null, 2)}`)
}
setResult()