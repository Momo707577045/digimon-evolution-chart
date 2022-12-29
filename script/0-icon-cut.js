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
    const level = 5 ;
    const img = '005.jpg';// 315
    let index = 301 
    let baseX = 96
    let baseY = 169
    let width = 220
    let height = 220
    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 7; x++) {
            index++
            if (y === 1) {
                await new Promise((resolve) => {
                    gm(__dirname + `/../img/level_${level}_icon/${img}`)
                        .crop(width, height, baseX + x * (width + 34), baseY + y * (height + 61))
                        .write(__dirname + `/../img/level_${level}_icon/icon-${index.toString().padStart(3, 0)}.jpg`, err => {
                            console.log(err);
                            resolve()
                        })
                })
            } else {
                await new Promise((resolve) => {
                    gm(__dirname + `/../img/level_${level}_icon/${img}`)
                        .crop(width, height, baseX + x * (width + 34), baseY + y * (height + 63))
                        .write(__dirname + `/../img/level_${level}_icon/icon-${index.toString().padStart(3, 0)}.jpg`, err => {
                            console.log(err);
                            resolve()
                        })
                })
            }
        }
    }
}

compress()
