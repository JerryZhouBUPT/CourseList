export function getCourseData(semester) {
  const app = getApp()
  const loginCode = String(app.globalData.Login_Code)
  if (app.globalData.Login_Code === 1) {
    const Header = {
      'cookie': wx.getStorageSync('jwgl_cookie')
    }
    return new Promise((resolve) => {
      wx.request({
        url: 'https://fastapi.jerrychat.cn/CourseDetail?semester=' + semester + '&loginCode=' + loginCode,
        method: 'GET', 
        header: Header, 
        success: (res) => {
          return resolve(res.data)
        }
      })
    })
  }
  else {
    const Header = {
      'cookie': wx.getStorageSync('vpn_token')
    }
    return new Promise((resolve) => {
      wx.request({
        url: 'https://webvpn.bupt.edu.cn/https/77726476706e69737468656265737421fae0469069327d406a468ca88d1b203b/jsxsd/xskb/xskb_list.do',
        method: 'GET', 
        header: Header, 
        success: (res) => {
          return resolve(res.data)
        }
      })
    })
  }
}

export function getStudentID(content) {
  const Header = {
    'cookie': wx.getStorageSync('vpn_token')
  }
  const postData = {
    'CourseDetail': content
  }
  return new Promise((resolve) => {
    wx.request({
      url: 'https://fastapi.jerrychat.cn/vpnstudentid',
      method: 'POST', 
      header: Header, 
      data: postData,
      success: (res) => {
        return resolve(res.data)
      }
    })
  })
}

export function getCourseDetail(studentID, semester) {
  const Header = {
    'cookie': wx.getStorageSync('vpn_token')
  }
  return new Promise((resolve) => {
    const url = 'https://webvpn.bupt.edu.cn/https/77726476706e69737468656265737421fae0469069327d406a468ca88d1b203b/jsxsd/xskb/tzdkbcx_query_10013?&xs0101id=' + studentID + '&xnxq01id=' + semester
    wx.request({
      url, 
      method: 'GET', 
      header: Header, 
      success: (res) => {
        var Data = res.data
        var result = Data.match(/<table id="kbtable".*?style="margin-top: 20px">([\s\S]*?)<\/table>/)
        if (result === null) {
          return resolve('')
        }
        return resolve(result[1])
      }
    })
  })
}

export function getCourseList(courseList) {
  const Header = {
    'cookie': wx.getStorageSync('vpn_token')
  }
  const postData = {
    'CourseDetail': courseList
  }
  return new Promise((resolve) => {
    wx.request({
      url: 'https://fastapi.jerrychat.cn/vpncoursedetail',
      method: 'POST',
      header: Header, 
      data: postData, 
      success: (res) => {
        return resolve(res.data)
      } 
    })
  })
}

function nowSemester(nowYear) {
  var curDate = new Date()
  var beginDateStr = String(nowYear) + '/1/15'
  var endDateStr = String(nowYear) + '/7/15'
  var beginDate = new Date(beginDateStr)
  var endDate = new Date(endDateStr)
  if (curDate >= beginDate && curDate < endDate) {
    return String(nowYear - 1) + '-' + String(nowYear) + '-2';
  }
  else if (curDate < beginDate) {
    return String(nowYear - 1) + '-' + String(nowYear) + '-1'
  }
  else {
    return String(nowYear) + '-' + String(nowYear + 1) + '-1'
  }
}

export function getSemester() {
  const nowDate = new Date().getTime()
  const nowTime = new Date(nowDate)
  const nowYear = parseInt(nowTime.getFullYear())
  return nowSemester(nowYear)
}

export function getTotalWeek() {
  const nowDate = new Date().getTime()
  const nowTime = new Date(nowDate)
  const nowYear = parseInt(nowTime.getFullYear())
  var curDate = new Date()
  var beginDateStr = String(nowYear) + '/1/15'
  var endDateStr = String(nowYear) + '/7/15'
  var beginDate = new Date(beginDateStr)
  var endDate = new Date(endDateStr)
  if (curDate >= beginDate && curDate < endDate) {
    return 19
  }
  else {
    return 20
  }
}
