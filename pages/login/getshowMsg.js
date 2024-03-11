export function getshowMsg(data){
  const Parser = require('../../lib/dom-parser');
  const parser = new Parser.DOMParser();
  const doc = parser.parseFromString(data, 'text/html');
  var info = doc.getElementById('showMsg')
  if(!info){
    return {
      status: true, 
      msg: ''
    }
  }
  else{
    return {
      status: false, 
      msg: info.textContent.trim()
    }
  }
}