//账号密码encoding策略
export function encoding(code) {
  const datastr = Encrypt_Code().then(result => {
    var dataStr = result.data
    var scode = dataStr.split("#")[0];
    var sxh = dataStr.split("#")[1];
    var encoded = "";
    for(var i = 0; i < code.length; i++){
      if(i < 20){
        encoded = encoded + code.substring(i, i + 1) + scode.substring(0, parseInt(sxh.substring(i , i + 1)));
          scode = scode.substring(parseInt(sxh.substring(i, i + 1)), scode.length);
      }
      else{
          encoded = encoded + code.substring(i, code.length);
          i = code.length;
      }
    }
    return encoded
  })
  return datastr
}
// 获取网站加密序列
function get_encrypt_code() {
  // 请求头加入token
  var header = {
    'Cookie': wx.getStorageSync('jwgl_cookie')
  }
  return new Promise((resolve) => {
    wx.request({
      url: 'https://jwgl.bupt.edu.cn/Logon.do?method=logon&flag=sess',
      method: 'GET', 
      timeout: 2000, 
      header, 
      success: (res) => {
        return resolve(res)
      }
    })
  })
  
}
// 调用ping_jwgl
async function Encrypt_Code() {
  const encrypt_code = await get_encrypt_code()
  return encrypt_code
}