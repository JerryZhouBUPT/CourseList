function get_redirect_location_from_jwgl(url, postData){
  return new Promise((resolve) => {
    const Header = {
      'content-type': 'application/x-www-form-urlencoded', 
      'cookie': wx.getStorageSync('jwgl_cookie')
    }
    wx.request({
      url,
      method: 'POST', 
      data: postData, 
      timeout: 20000, 
      header: Header, 
      redirect: 'manual'
    }).onHeadersReceived((backmsg) => {
      return resolve(backmsg.header.Location)
    })
  })
}
async function Get_Redirect_Location(url, postData) {
  const redirect_location = await get_redirect_location_from_jwgl(url, postData)
  return redirect_location
}
function get_new_jsessionid(ticket){
  return new Promise((resolve) => {
    const url = "https://fastapi.jerrychat.cn/jsessionid?ticket=" + ticket
    const Header = {
      'cookie': wx.getStorageSync('jwgl_cookie')
    }
    wx.request({
      url, 
      method: 'GET', 
      timeout: 20000, 
      header: Header, 
      success: (res) => {
        return resolve(res.data)
      }
    })
  })
}
async function Get_New_JSESSIONID(ticket){
  const new_jsessionid = await get_new_jsessionid(ticket)
  return new_jsessionid
}
export function submit_form(url, postData, that) {
  // 提交表单，获取最新JSESSIONID
  Get_Redirect_Location(url, postData).then((Redirection) => {
    if (Redirection){
      var ticket = Redirection.replace(/\//g,'')
      ticket = ticket.match(/ticqzket=(\S*)/)[1]
      Get_New_JSESSIONID(ticket).then((new_jsessionid) => {
        if (new_jsessionid.code == 200) {
          // 重新布置cookie字段
          wx.setStorageSync('jwgl_cookie', new_jsessionid.cookie + "; " + wx.getStorageSync('jwgl_cookie'))
          if(that.data.saveCount){
            wx.setStorageSync('jwgl_account', {
              username: that.data.username, 
              password: that.data.password, 
            })
          }
          else{
            wx.removeStorageSync('jwgl_account')
          }
          const app = getApp()
          app.globalData.Login_Code = 1
          wx.hideLoading()
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            })
          }, 700)
        }
      })
    }
    else{
      that.setData({
        ['msg']: "用户名或密码错误"
      })
      wx.hideLoading()
    }
  })
}