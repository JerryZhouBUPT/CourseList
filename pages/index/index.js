// index.js
import {
  getNowWeek
} from '../../utils/util.js'
import {
  getTotalWeek, getCourseData, getSemester, getStudentID, getCourseDetail, getCourseList
} from '../course/getCourseData.js'
const courseColorCacheKey = "courseColor"
Page({
  data: {
    navList: [
      {
        title: '课程计划表', 
        icon: '../../asset/imgs/planning.png', 
        path: '/pages/course/index'
      }, 
      {
        title: '成绩', 
        icon: '../../asset/imgs/grade.png', 
        path: '/pages/scores/index'
      }, 
      {
        title: '校历', 
        icon: '../../asset/imgs/calendar.png', 
        path: '/pages/calendar/index'
      }, 
    ], 
    startDate: "2024/02/26",  //开学日期
    totalWeek: getTotalWeek(), 
    semester: getSemester()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.loadFontFace({
      global: true, 
      family: 'SmileySans Oblique', 
      source: 'url("./SmileySans-Oblique.ttf")',
      success: (res) => {}
    }), 
    this.getTodayCourseList()
  }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    
  },
  //nav-list class-form button
  nav(e) {
    const index = e.currentTarget.dataset.index
    const path = this.data.navList[index].path
    if (path === '/pages/course/index'){
      wx.switchTab({
        url: path,
      })
    }
    else{
      wx.redirectTo({
        url: path,
      })
    }
  }, 
  getTodayCourseList() {
    const todayWeek = new Date().getDay()
    const todayWeeks = getNowWeek(this.data.startDate, this.data.totalWeek)
    var courseList = wx.getStorageSync('jwgl_courses')
    const app = getApp()
    if (!courseList) {
      wx.showLoading({
        title: '正在加载',
      })
      if (app.globalData.Login_Code === 0) {
        getCourseData(this.data.semester).then(res => {
          getStudentID(res).then(res => {
            if (res.code === 200) {
              getCourseDetail(res.content, this.data.semester).then(res => {
                if (res) {
                  getCourseList(res).then(res => {
                    wx.hideLoading()
                    wx.showToast({
                      title: '获取课表信息成功',
                      icon: 'none'
                    })
                    wx.setStorageSync('jwgl_courses', res.content)
                    courseList = wx.getStorageSync('jwgl_courses')
                    const todayCourseList = courseList.filter(item => {
                      if (item.Detail === null) {
                        return false
                      }
                      for (let i = 0; i < item.Detail.length; i++){
                        return item.Detail[i][0] === todayWeek && item.Detail[i][2].indexOf(todayWeeks) > -1
                      }
                    })
                    todayCourseList.sort((a, b) => {
                      var aDetailIndex = a.Detail.length - 1
                      var bDetailIndex = b.Detail.length - 1
                      if (aDetailIndex > 0) {
                        for (let i = 0; i < aDetailIndex; i++){
                          if (a.Detail[i][2].indexOf(todayWeeks) > -1) {
                            aDetailIndex = i
                            break
                          }
                        }
                      }
                      if (bDetailIndex > 0) {
                        for (let i = 0; i < bDetailIndex; i++){
                          if (b.Detail[i][2].indexOf(todayWeeks) > -1) {
                            bDetailIndex = i
                            break
                          }
                        }
                      }
                      return a.Detail[aDetailIndex][1][0] - b.Detail[bDetailIndex][1][0]
                    })
                    this.setData({
                      todayWeek, 
                      todayWeeks, 
                      todayCourseList
                    })
                  })
                }
                else {
                  wx.showToast({
                    title: '获取课表信息失败',
                    icon: 'none'
                  })
                }
              })
            }
            else{
              wx.showToast({
                title: '获取课表信息失败',
                icon: 'none'
              })
            }
          })
        })
      }
      else {
        getCourseData(this.data.semester).then(res => {
          wx.setStorageSync('jwgl_courses', res.content)
          courseList = wx.getStorageSync('jwgl_courses')
          const todayCourseList = courseList.filter(item => {
            if (item.Detail === null) {
              return false
            }
            for (let i = 0; i < item.Detail.length; i++){
              return item.Detail[i][0] === todayWeek && item.Detail[i][2].indexOf(todayWeeks) > -1
            }
          })
          todayCourseList.sort((a, b) => {
            var aDetailIndex = a.Detail.length - 1
            var bDetailIndex = b.Detail.length - 1
            if (aDetailIndex > 0) {
              for (let i = 0; i < aDetailIndex; i++){
                if (a.Detail[i][2].indexOf(todayWeeks) > -1) {
                  aDetailIndex = i
                  break
                }
              }
            }
            if (bDetailIndex > 0) {
              for (let i = 0; i < bDetailIndex; i++){
                if (b.Detail[i][2].indexOf(todayWeeks) > -1) {
                  bDetailIndex = i
                  break
                }
              }
            }
            return a.Detail[aDetailIndex][1][0] - b.Detail[bDetailIndex][1][0]
          })
          this.setData({
            todayWeek, 
            todayWeeks, 
            todayCourseList
          })
        })
        wx.hideLoading()
      }
    }
    else{
      const todayCourseList = courseList.filter(item => {
        if (item.Detail === null) {
          return false
        }
        for (let i = 0; i < item.Detail.length; i++){
          return item.Detail[i][0] === todayWeek && item.Detail[i][2].indexOf(todayWeeks) > -1
        }
      })
      todayCourseList.sort((a, b) => {
        var aDetailIndex = a.Detail.length - 1
        var bDetailIndex = b.Detail.length - 1
        if (aDetailIndex > 0) {
          for (let i = 0; i < aDetailIndex; i++){
            if (a.Detail[i][2].indexOf(todayWeeks) > -1) {
              aDetailIndex = i
              break
            }
          }
        }
        if (bDetailIndex > 0) {
          for (let i = 0; i < bDetailIndex; i++){
            if (b.Detail[i][2].indexOf(todayWeeks) > -1) {
              bDetailIndex = i
              break
            }
          }
        }
        return a.Detail[aDetailIndex][1][0] - b.Detail[bDetailIndex][1][0]
      })
      this.setData({
        todayWeek, 
        todayWeeks, 
        todayCourseList
      })
    }
  }, 
  navCourseDetail(e) {
    const index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `/pages/course-detail/index?info=${JSON.stringify(this.data.todayCourseList[index])}`,
    })
  }
})
