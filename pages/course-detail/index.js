// pages/course-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoRef: [
      {
        key: "Course_number", 
        title: "课程编号"
      }, 
      {
        key: "Course_name", 
        title: "课程名称"
      }, 
      {
        key: "Credit", 
        title: "课程学分"
      }, 
      {
        key: "Course_property", 
        title: "课程性质"
      }, 
      {
        key: "Course_attribute", 
        title: "课程属性"
      }, 
      {
        key: "Teacher", 
        title: "授课教师"
      }, 
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let info = options.info || ''
    if (info === '') {
      wx.showToast({
        title: '页面不存在',
        icon: 'error'
      })
      setTimeout(()=> {
        wx.navigateBack({
          delta: 1
        })
      }, 800)
      return
    }
    info = JSON.parse(info)
    this.setData({
      info
    })
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

  }
})