import createRequest from '../utils/request'

export function VPNloginRequest(data) {
  return createRequest({
    url: '/do-login', 
    method: 'POST', 
    data, 
    needLogin: false, 
  })
}

// encodeInp加密算法实现
export function encodeInp(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;
    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64
        } else if (isNaN(chr3)) {
            enc4 = 64
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = ""
    } while (i < input.length);
    return output
}

export function loginRequest() {
  return new Promise((resolve)=>{
    const token = wx.getStorageSync('vpn_token')
    if (!token){
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/vpn/index',
        })
      }, 500);
      return
    }
    const baseUrl = "https://webvpn.bupt.edu.cn"
    const url = baseUrl + "/https-443/77726476706e69737468656265737421fae0469069327d406a468ca88d1b203b/jsxsd/xk/LoginToXk"
    //处理token字段
    var TOKEN = "show_vpn=0; heartbeat=1; show_faq=0; " + token[1].trim().split(";")[0] + "; " + token[0].trim().split(";")[0]
    //请求头加入token
    const header = {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
      'Cookie': TOKEN
    }
    //设置Loading
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    wx.request({
      url,
      method: 'GET', 
      timeout: 20000, 
      header, 
      success(res){
        console.log(res.data)
        return resolve(res)
      }, 
      fail(res){
        wx.showToast({
          title: '服务器错误',
          icon: 'error'
        })
      }, 
      complete(res){
        wx.hideLoading()
      }
    })
  })
}
