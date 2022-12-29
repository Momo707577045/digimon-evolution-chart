"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
}) : (function (o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This file is auto-generated, don't edit it
const ocr_api20210707_1 = __importStar(require("@alicloud/ocr-api20210707")), $ocr_api20210707 = ocr_api20210707_1;
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
const $OpenApi = __importStar(require("@alicloud/openapi-client"));
const tea_console_1 = __importDefault(require("@alicloud/tea-console"));
const tea_util_1 = __importStar(require("@alicloud/tea-util")), $Util = tea_util_1;
const fs_1 = __importDefault(require("fs"));
class Client {
    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(accessKeyId, accessKeySecret) {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
            readTimeout: 10000, // 没有效果
        });
        // 访问的域名
        config.endpoint = `ocr-api.cn-hangzhou.aliyuncs.com`;
        return new ocr_api20210707_1.default(config);
    }
    /**
     * 使用STS鉴权方式初始化账号Client，推荐此方式。本示例默认使用AK&SK方式。
     * @param accessKeyId
     * @param accessKeySecret
     * @param securityToken
     * @return Client
     * @throws Exception
     */
    static createClientWithSTS(accessKeyId, accessKeySecret, securityToken) {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
            // 必填，您的 Security Token
            securityToken: securityToken,
            // 必填，表明使用 STS 方式
            type: "sts",
        });
        // 访问的域名
        config.endpoint = `ocr-api.cn-hangzhou.aliyuncs.com`;
        return new ocr_api20210707_1.default(config);
    }
    static async main(body, outputPath) {
        // 初始化 Client，采用 AK&SK 鉴权访问的方式，此方式可能会存在泄漏风险，建议使用 STS 方式。更多鉴权访问方式请参考：https://help.aliyun.com/document_detail/378664.html
        let client = Client.createClient("accessKeyId", "accessKeySecret");
        let recognizeAdvancedRequest = new $ocr_api20210707.RecognizeGeneralRequest({ body });
        let runtime = new $Util.RuntimeOptions({});
        let resp = await client.recognizeAdvancedWithOptions(recognizeAdvancedRequest, runtime);
        fs_1.default.writeFileSync(outputPath, tea_util_1.default.toJSONString(resp))
    }
}

const fs = require('fs')
const gm = require('gm')
const sourceImgPath = `${__dirname}/../img/level_5`
// const sourceImgPath = `${__dirname}/../level_0`
const dividePath = `${__dirname}/../divide.jpg`
const tempImgPath = `${__dirname}/template.jpg`

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
            urls = [...traverseFile(fileAbsolutePath), ...urls]
        } else if (fileExtName === 'jpg') { // 过滤 map 文件
            urls.push(fileAbsolutePath.substring(1)) // 去除首字母 '/'，避免 '//' 路径
        }
    }
    return urls
}

async function ocr() {
    const filePaths = getFilePaths(sourceImgPath)
    const size = 8;
    let index = 0
    let gmInstance = null
    while (index < filePaths.length) {
        let singleFilePath = `${sourceImgPath}/icon-${index + 1}.jpg`
        if (index % size === 0) {
            gmInstance = gm(singleFilePath)
        } else if (index % size === size - 1 || index === filePaths.length - 1) {
            await new Promise((resolve) => {
                gmInstance.append(dividePath)
                    .append(singleFilePath)
                    .resize(1470)
                    .write(tempImgPath, err => {
                        if (err) console.log(err);
                        Client.main(fs_1.default.createReadStream(tempImgPath), `${sourceImgPath}/${index}.json`).then(() => {
                            console.log(`${sourceImgPath}/${index}.json done`)
                            resolve()
                        });
                    })
            })
        } else {
            gmInstance.append(dividePath).append(singleFilePath)
        }
        index++
    }
}

ocr()