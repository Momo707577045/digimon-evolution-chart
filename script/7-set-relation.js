const fs = require('fs')
const sourcePath = `${__dirname}/../json`

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


function translate() {
    const nameToNumber = {}
    const filePaths = getFilePaths(sourcePath, ['json'])
    for (let index = 0; index < filePaths.length; index++) {
        try {
            let data = JSON.parse(fs.readFileSync(filePaths[index]).toString())
            nameToNumber[data.name] = data.number
        } catch (error) {
            console.log('error', filePaths[index])
        }
    }
    const errorItem = []
    for (let index = 0; index < filePaths.length; index++) {
        try {
            let data = JSON.parse(fs.readFileSync(filePaths[index]).toString())
            data.preItem = []
            data.nextItem = []
            data.preItemName.forEach(name => {
                if (!name.includes('无法继续') && !nameToNumber[name]) {
                    errorItem.push(`${filePaths[index]}: ${name}`)
                }
                data.preItem.push({
                    name,
                    number: name.includes('无法继续') ? -1 : nameToNumber[name]
                })
            });
            data.nextItemName.forEach(name => {
                if (!name.includes('无法继续') && !nameToNumber[name]) {
                    errorItem.push(`${filePaths[index]}: ${name}`)
                }
                data.nextItem.push({
                    name,
                    number: name.includes('无法继续') ? -1 : nameToNumber[name]
                })
            });
            const intro = data.intro
            delete data.intro
            delete data.preItemName
            delete data.nextItemName
            data.intro = intro
            fs.writeFileSync(filePaths[index], JSON.stringify(data, null, 2))
        } catch (error) {
            console.log('error', filePaths[index])
        }
    }
    console.log(errorItem)
}
translate()