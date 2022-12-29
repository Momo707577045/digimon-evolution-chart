const fs = require('fs')
// const sourcePath = `${__dirname}/../json/source/level_1`
const sourcePath = `${__dirname}/../json/source`
const resultPath = `${__dirname}/../json/result`

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




function jsonParse() {
    let errorMessage = []
    const jsonPaths = getFilePaths(sourcePath, ['json'])
   
    for (let index = 0; index < jsonPaths.length; index++) {
        // for (let index = 0; index < 1; index++) {
        const jsonPath = jsonPaths[index];
        // const jsonData = JSON.parse(JSON.parse(fs.readFileSync(jsonPath)).body.data).content.split('分隔符')
        const jsonData = JSON.parse(fs.readFileSync(jsonPath))
        // console.log(jsonData);
        for (let index = 0; index < 2; index++) {
            const jsonStr = [
                jsonData[0 + index * 4],
                jsonData[1 + index * 4],
                jsonData[2 + index * 4],
                jsonData[3 + index * 4]
            ].join(' ')
            let json = {
                number: '', // 编号
                name: '', // 名
                cost: '', // 花费
                level: '',  // 等级
                race: '', // 种族
                skill: [], // 技能
                preItemName: "", // 退化
                nextItemName: "", // 进化
                intro: '', // 简介
            }

            let hasError = false
            try {
                json.number = jsonStr.match(/N[oO]?.? ?([\d]+)/)[1]
                json.name = jsonStr.match(/ ([^ ]+獸[^ ]?) /)[1]
                json.cost = jsonStr.match(/ 消耗容量 ([\d]+) /)[1]
                json.race = jsonStr.match(/種族 ([^ ]+) /)[1]
                json.skill = []
                let levelReg = new RegExp(`${json.number} ?([^ ]+) 狀態 `)
                let preReg = new RegExp(`退化後的數碼寶貝 (.+?) ${json.name}`)
                let nextReg = new RegExp(`進化後的數碼寶貝 (.+?) ${json.name}`)
                let introReg = new RegExp(`基本資料 (.+?) ${json.name}`)
                try {
                    json.level = jsonStr.match(levelReg)[1]
                } catch (error) {
                    hasError = true
                }
                try {
                    json.preItemName = jsonStr.match(preReg)[1]
                } catch (error) {
                    hasError = true
                }
                try {
                    json.nextItemName = jsonStr.match(nextReg)[1]
                } catch (error) {
                    hasError = true
                }
                try {
                    json.intro = jsonData[3 + index * 4].match(introReg)[1]
                } catch (error) {
                    hasError = true
                }
                if (hasError) {
                    fs.writeFileSync(resultPath + `/${json.number}.json`, JSON.stringify(json))
                }
            } catch (error) {

            }
        }
    }
    fs.writeFileSync(__dirname + `/errorMessage.json`, JSON.stringify(errorMessage))
}
jsonParse()