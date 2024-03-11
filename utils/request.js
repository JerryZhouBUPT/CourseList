export default function createRequest(options) {
  return new Promise((resolve)=>{
    const token = wx.getStorageSync('vpn_token')
    if (options.needLogin && !token){
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '/pages/vpn/index'
        })
      }, 500);
      return
    }
    const baseUrl = "https://webvpn.bupt.edu.cn"
    const url = `${baseUrl}${options.url}`
    //请求头加入token
    const header = {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
      token, 
    }
    //设置Loading
    let showLoading = false
    if (options.loading !== false){
      showLoading = true
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
    }
    wx.request({
      url,
      method: options.method || 'GET', 
      timeout: options.timeout || 20000, 
      header, 
      data: options.data || {}, 
      success(res){
        return resolve(res)
      }, 
      fail(res){
        wx.showToast({
          title: '服务器错误',
          icon: 'error'
        })
      }, 
      complete(res){
        //若有Loading，则隐藏
        if (showLoading){
          wx.hideLoading()
        }
      }
    })
  })
}