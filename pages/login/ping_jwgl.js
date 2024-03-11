export function ping_jwgl() {
  const app = getApp()
  return new Promise((resolve) => {
    wx.request({
      url: 'https://jwgl.bupt.edu.cn',
      method: 'GET', 
      success(res) {
        const token = res.cookies[0].split(";")[0] + "; " + res.cookies[1].split(";")[0]
        wx.setStorageSync('jwgl_cookie', token)
        app.globalData.Login_Code = 1
        return resolve(res)
      }, 
      fail() {
        app.globalData.Login_Code = 0
        wx.setStorageSync('jwgl_cookie', '')
        return resolve({'statusCode': 404})
      }
    })
  })
}