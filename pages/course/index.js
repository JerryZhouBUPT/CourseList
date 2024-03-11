// pages/course/index.js
import {
  getTotalWeek, getCourseData, getSemester, getStudentID, getCourseDetail, getCourseList
} from '../course/getCourseData.js'
import {
  getNowWeek
} from '../../utils/util.js'
const courseCacheKey = "jwgl_courses"
const courseColorCacheKey = "courseColor"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    semester: getSemester(),
    nowWeek: 1,  //当前周
    totalWeek: getTotalWeek(),  //周总数
    showSwitchWeek: false,  //显示选择周数的弹窗
    weekDayCount: 7, 
    cuIcon_fold_status: "cuIcon-unfold", 
    startDate: "2024/02/26",  //开学日期
    nowMonth: 1,  //默认值，当前周的月份
    courseList: [], 
    colorList: [
      "#9195F6", 
      "#B7C9F2", 
      "#B784B7", 
      "#8E7AB5", 
      "#265073", 
      "#2D9596", 
      "#9AD0C2", 
      "#15F5BA", 
      "#59D5E0", 
      "#F5DD61", 
      "#FAA300", 
      "#6420AA", 
      "#19A7CE", 
      "#146C94", 
      "#618264", 
      "#79AC78", 
      "#B2A4FF", 
      "#30E3CA", 
      "#11999E", 
      "#0D7685", 
      "#084D68", 
      "#69C181", 
    ], 
    courseColor: {}, 
    weekCalendar: [1, 2, 3, 4, 5, 6, 7], 
    firstEntry: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {windowWidth} = wx.getSystemInfoSync()
    let pxTorpx = function(px, windowWidth) {
      let rpx = (750 / windowWidth) * Number(px)
      return Math.floor(rpx);
    }
    this.setData({
      windowWidth: pxTorpx(windowWidth, windowWidth)
    })
    wx.loadFontFace({
      global: true, 
      family: 'SmileySans Oblique', 
      source: 'url("../index/SmileySans-Oblique.ttf")',
      success: (res) => {}
    })
    this.getNowWeek()
    this.getData()
    this.getTodayDate()
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
  selectWeek() {
    if(this.data.showSwitchWeek){
      this.setData({
        showSwitchWeek: false, 
        cuIcon_fold_status: "cuIcon-unfold"
      })
    }
    else{
      this.setData({
        showSwitchWeek: true, 
        cuIcon_fold_status: "cuIcon-fold"
      })
    }
  }, 
  switchWeek(e) {
    const week = e.currentTarget.dataset.week
    this.setData({
      showSwitchWeek: false, 
      cuIcon_fold_status: "cuIcon-unfold"
    })
    this.switchWeekFn(week)
  }, 
  // 切换周数
  switchWeekFn(week) {
    this.setData({
      nowWeek: week
    })
    this.getWeekDates()
  }, 
  hideSwitchWeek() {
    this.setData({
      showSwitchWeek: false, 
      cuIcon_fold_status: "cuIcon-unfold"
    })
  }, 
  getWeekDates() {
    const startDate = new Date(this.data.startDate)  //时间戳
    const addTime = (this.data.nowWeek - 1) * 7 * 24 * 60 * 60 * 1000
    const firstDate = startDate.getTime() + addTime
    const {month: nowMonth} = this.getDataObject(new Date(firstDate))
    const weekCalendar = []
    for(let i = 0; i < this.data.weekDayCount; i++) {
      const date = new Date(firstDate + i * 24 * 60 * 60 * 1000)
      const {day} = this.getDataObject(date)
      weekCalendar.push(day)
    }
    this.setData({
      nowMonth, 
      weekCalendar
    })
  }, 
  getDataObject(date = new Date()) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return {
      year, 
      month, 
      day
    }
  }, 
  getNowWeek() {
    const nowWeek = getNowWeek(this.data.startDate, this.data.totalWeek)
    this.setData({
      nowWeek
    })
    this.getWeekDates()
  }, 
  getData() {
    const cache = wx.getStorageSync(courseCacheKey)
    const courseColorCache = wx.getStorageSync(courseColorCacheKey)
    if (cache) {
      this.setData({
        courseList: cache
      })
      if (!courseColorCache) {
        this.buildCourseColor()
      }
      else {
        this.setData({
          courseColor: courseColorCache
        })
      }
      return
    }
    this.update()
  }, 
  ping_jwgl() {
    const app = getApp()
    return new Promise((resolve) => {
      wx.request({
        url: 'https://jwgl.bupt.edu.cn',
        method: 'GET', 
        success(res) {
          app.globalData.Login_Code = 1
          return resolve('')
        }, 
        fail() {
          app.globalData.Login_Code = 0
          return resolve('')
        }
      })
    })
  }, 
  update() {
    const that = this
    const app = getApp()
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    this.ping_jwgl().then((res) => {
      if (app.globalData.Login_Code === 1) {
        if (!wx.getStorageSync('jwgl_cookie')) {
          wx.redirectTo({
            url: '/pages/login/index',
          })
          return
        }
        getCourseData(that.data.semester).then(res => {
          wx.hideLoading()
          if (res.code === 200){
            that.setData({
              courseList: res.content
            })
            that.buildCourseColor()
            wx.showToast({
              title: '更新成功',
              icon: 'success'
            })
            wx.setStorageSync(courseCacheKey, res.content)
          }
          else{
            wx.showToast({
              title: '更新失败',
              icon: 'error'
            })
          }
        })
      }
      else {
        if (!wx.getStorageSync('vpn_token')) {
          wx.redirectTo({
            url: '/pages/vpn/index',
          })
          return
        }
        getCourseData(this.data.semester).then(res => {
          getStudentID(res).then(res => {
            if (res.code === 200){
              getCourseDetail(res.content, this.data.semester).then((res) => {
                if (res) {
                  getCourseList(res).then(res => {
                    wx.hideLoading()
                    that.setData({
                      courseList: res.content
                    })
                    that.buildCourseColor()
                    wx.showToast({
                      title: '更新成功',
                      icon: 'success'
                    })
                    wx.setStorageSync(courseCacheKey, res.content)
                  })
                }
              })
            }
          })
        })
      }
    })
  }, 
  swiperSwitchWeek(e){
    if (e.detail.source === '') {
      this.setData({
        firstEntry: false
      })
      return
    }
    const index = e.detail.current
    this.switchWeekFn(index + 1)
  }, 
  buildCourseColor() {
    const courseColor = {}
    let colorIndex = parseInt(Math.random()*(22), 10);
    this.data.courseList.map(item => {
      if(courseColor[item.Course_name] === undefined){
        courseColor[item.Course_name] = this.data.colorList[colorIndex]
        colorIndex = (colorIndex + 1) % 22
      }
    })
    wx.setStorageSync(courseColorCacheKey, courseColor)
    this.setData({
      courseColor
    })
  }, 
  getTodayDate() {
    const {
      month: todayMonth, 
      day: todayDay
    } = this.getDataObject()
    this.setData({
      todayMonth, 
      todayDay
    })
  }, 
  navCourseDetail(e) {
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/course-detail/index?info=${JSON.stringify(this.data.courseList[index])}`,
    })
  }
})