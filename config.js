let env = "develop"

// 防止上传代码时，未将env设置为production
const envVersion = wx.getAccountInfoSync().miniProgram.envVersion
if (envVersion === "release" && env !== "production") {
  env = "production"
}

export default {
  // 当前环境
  env, 
  // 请求接口域名
  baseUrl: {
    
  }
}
