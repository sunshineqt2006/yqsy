import Vue from 'vue'
import md5 from './md5'
import sha1 from './sha1'
const BASE_URL = '/api'

function alertError (error) {
  window.$vue && window.$vue.$message.error(error)
}
function getError (content) {
  return {
    status: 1,
    content: content || '未知异常',
    data: ''
  }
}

function utf16to8 (str) {
  var out, i, len, c
  out = ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}

function isJson (obj) {
  return typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
}

function sign (params) {
  let newkey = Object.keys(params).sort()
  let str = ''
  newkey.forEach((key) => {
    var val = ''
    if (!Array.isArray(params[key]) && !isJson(params[key]) && params[key] != null) {
      val = params[key]
    }
    str += key + val
  })
  let sign = md5.hexMd5(sha1.hexSha1(utf16to8(str))).toLocaleLowerCase().substring(8, 24)
  console.log('SIGN', str, sign)
  return sign
}

async function fetchData (url, method, params, body) {
  params = params ? Object.assign({}, params) : {}
  if (window.$vue && window.$vue.$root.userInfo && window.$vue.$root.userInfo.token) {
    params.token = window.$vue.$root.userInfo.token
  } else if (window.sessionStorage.getItem('_USER_INFO')) {
    params.token = JSON.parse(window.sessionStorage.getItem('_USER_INFO')).token
  }
  if (!params.NOSIGN) {
    let signParams = {}
    Object.assign(signParams, params)
    Object.assign(signParams, body)
    params.verifyInfo = sign(signParams)
  }
  if (params) {
    let paramsArray = []
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
    } else {
      url += '&' + paramsArray.join('&')
    }
  }
  if (body) {
    try {
      body = JSON.stringify(body)
    } catch (error) {

    }
  }
  let response = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })
  // console.log('response', response)
  if (response.ok) {
    try {
      let json = await response.json()
      if (json.status === 0) {
        return json
      } else if (json.status === 400 || json.status === 404) {
        window.sessionStorage.removeItem('_USER_INFO')
        window.$vue && (window.$vue.$root.userInfo = null)
        window.$vue && window.$vue.$router.push('/login')
      } else {
        alertError(json.content)
        return Promise.reject(json)
      }
    } catch (error) {
      return {}
    }
  } else {
    if (response.status === 500) {
      alertError('服务器异常')
      return Promise.reject(getError('服务器异常'))
    } else if (response.status === 400) {
      alertError('请求失败')
      return Promise.reject(getError('请求失败'))
    }
  }
}
function post (url, body) {
  return fetchData(url, 'POST', null, body)
}
function get (url, params) {
  return fetchData(url, 'GET', params, null)
}
// function _delete (url, params) {
//   return fetchData(url, 'DELETE', params, null)
// }
Vue.prototype.$post = post
Vue.prototype.$get = get
export default {
  post,
  get
}
