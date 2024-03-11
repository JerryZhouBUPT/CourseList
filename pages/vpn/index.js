// pages/vpn/index.js
import{
  VPNloginRequest
} from '../../api/main'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '', 
    password: '', 
    saveCount: true, /*默认选中*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }, 

  /*登陆方法*/
  vpn_login() {
    const postData = {
      auth_type: 'local', 
      username: this.data.username, 
      password: this.data.password, 
      remember_cookie: 'on', 
    }
    VPNloginRequest(postData).then(res => {
      if(res.data.success){
        this.setData({
          ['msg']: '', 
        })
        wx.hideLoading()
        //处理token字段
        var TOKEN = "show_vpn=0; heartbeat=1; show_faq=0; " + res.cookies[0].trim().split(";")[0] + "; refresh=1; " + res.cookies[1].trim().split(";")[0]
        wx.setStorageSync('vpn_token', TOKEN)
        if(this.data.saveCount){
          wx.setStorageSync('vpn_account', postData)
        }
        else{
          wx.removeStorageSync('vpn_account')
        }
        wx.showToast({
          title: '连接成功',
          icon: 'success'
        })
        const app = getApp();
        app.globalData.LOGIN_STATUS = true;
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/login/index',
          })
        }, 700)
      }
      else{
        wx.hideLoading()
        this.setData({
          ['msg']: res.data.message, 
        })
      }
    });
  },
  switchStatus(){
    this.setData({
      saveCount: !this.data.saveCount
    })
  }, 
  textCallback: function(){}, 
})