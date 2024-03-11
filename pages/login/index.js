// pages/login/index.js
import{
  VPNloginRequest, encodeInp
} from '../../api/main'
import{
  getshowMsg
} from './getshowMsg.js'
import {
  ping_jwgl
} from './ping_jwgl.js'
import {
  encoding
} from './encoding.js'
import {
  submit_form
} from './submit_form.js'
 Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '', 
    password: '', 
    saveCount: false, /*默认不选中*/
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //初始化login_status
    const app = getApp();
    if (!app.globalData.LOGIN_STATUS){
      this.initVPNAccount()
    }
    else{
      this.initAccount()
    }
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
  // 调用ping_jwgl
  async connection_status() {
    const Connection = await ping_jwgl()
    return Connection
  }, 
  // 初始化VPN登录
  initVPNAccount(){
    // 初始化ping
    const app = getApp()
    this.connection_status().then((result) => {
      if (result.statusCode === 404) {
        const accountCache = wx.getStorageSync('vpn_account')
        if (accountCache) {
          const VPNData = {
            auth_type: 'local',  
            username: accountCache.username, 
            password: accountCache.password, 
            remember_cookie: 'on'
          }
          VPNloginRequest(VPNData).then(res => {
            if(res.data.success){
              wx.hideLoading()
              //处理token字段
              var TOKEN = "show_vpn=0; heartbeat=1; show_faq=0; " + res.cookies[0].trim().split(";")[0] + "; refresh=1; " + res.cookies[1].trim().split(";")[0]
              wx.setStorageSync('vpn_token', TOKEN)
              app.globalData.LOGIN_STATUS = true
              this.initAccount()
            }
            else{
              wx.hideLoading()
              wx.redirectTo({
                url: '/pages/vpn/index',
              })
            }
          })
        }
        else{
          wx.redirectTo({
            url: '/pages/vpn/index',
          })
        }
      }
      else {
        this.initAccount_without_vpn()
      }
    })
  },
  // 初始化账号密码，并自动登录(非VPN版)
  initAccount_without_vpn(){
    const accountCache = wx.getStorageSync('jwgl_account')
    if (accountCache){
      this.setData({
        username: accountCache.username, 
        password: accountCache.password, 
        saveCount: true
      })
      this.login_without_vpn()
    }
  }, 
  /*登录综合方法*/
  login() {
    const app = getApp()
    if (app.globalData.Login_Code === 0) {
      this.login_vpn()
    }
    else {
      this.login_without_vpn()
    }
  }, 
   /*在非VPN方式下的登录方法*/
  login_without_vpn() {
    // encoding策略实现
    var code = this.data.username + "%%%" + this.data.password
    encoding(code).then(result => {
      // 登录前的信息准备
      const url = 'https://jwgl.bupt.edu.cn/Logon.do?method=logon'
      const postData = {
        userAccount: '', 
        userPassword: '', 
        encoded: result
      }
      // 让用户可感受到前后两次的登录问题
      this.setData({
        ['msg']: ''
      })
      //设置Loading
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
      const that = this
      submit_form(url, postData, that)
    })
  }, 
  // 初始化账号密码，并自动登录(VPN版)
  initAccount(){
    const accountCache = wx.getStorageSync('jwgl_account')
    if (accountCache){
      this.setData({
        username: accountCache.username, 
        password: accountCache.password, 
        saveCount: true
      })
      this.login_vpn()
    }
  },
  /*在VPN方式下的登录方法*/
  login_vpn() {
    // 获取VPN的token凭据
    const TOKEN = wx.getStorageSync('vpn_token')
    // 若未配置VPN，则重定向至vpn页
    if (!TOKEN){
      wx.showToast({
        title: '未配置VPN',
        icon: 'error'
      })
      setTimeout(()=>{
        wx.redirectTo({
          url: '/pages/vpn/index',
        })
      }, 700);
      return
    }
    // 登录前的信息准备
    const baseUrl = "https://webvpn.bupt.edu.cn"
    const url = baseUrl + "/https-443/77726476706e69737468656265737421fae0469069327d406a468ca88d1b203b/jsxsd/xk/LoginToXk"
    const postData = {
      userAccount: this.data.username, 
      userPassword: '',
      encoded: encodeInp(this.data.username) + "%%%" + encodeInp(this.data.password), 
    }
    // 让用户可感受到前后两次的登录问题
    this.setData({
      ['msg']: ''
    })
    //请求头加入TOKEN
    var header = {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
      'Cookie': TOKEN
    }
    //设置Loading
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    // 提交表单
    wx.request({
      url,
      method: 'POST', 
      data: postData, 
      timeout: 20000, 
      header, 
      success: (res)=>{
        wx.hideLoading()
        // 成功调用后，需要判断是否成功登录，并返回准确结果
        var response = getshowMsg(res.data)
        if (response.status){
          if(this.data.saveCount){
            wx.setStorageSync('jwgl_account', {
              username: this.data.username, 
              password: this.data.password, 
            })
          }
          else{
            wx.removeStorageSync('jwgl_account')
          }
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
        else{
          this.setData({
            ['msg']: response.msg
          })
        }
      }, 
    })
  },
  switchStatus(){
    this.setData({
      saveCount: !this.data.saveCount
    })
  }, 
  textCallback: function(){}, 
  ping_jwgl(){
    var header = {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 
    }
    const app = getApp()
    wx.request({
      url: 'https://jwgl.bupt.edu.cn',
      method: 'GET', 
      timeout: 2000,
      header: header, 
      success: (res) => {
        app.globalData.VPN_STATUS = false
      }, 
      fail() {
        console.log(false)
      }
    })
    return
  }
})