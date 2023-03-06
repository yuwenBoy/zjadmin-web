import axios from 'axios'
import { Notification, Loading } from 'element-ui'
// import router from '../router/index'
import { getToken } from '@/utils/auth'
import Config from '@/settings'
// 统一请求路径前缀
const baseUrl = '/basic-api'
console.log(process.env);

// 超时设定
axios.defaults.timeout = Config.timeout
axios.interceptors.request.use(config => {
  console.log(Config.isLoading)
  startLoading()
  return config
}, err => {
  Notification.error({
    title: '请求超时',
    duration: 5000
  })
  return Promise.resolve(err)
})

// http response 拦截器
axios.interceptors.response.use(response => {
  const data = response.data
  endLoading()
  // 根据返回的code值来做不同的处理（和后端约定）
  switch (data.code) {
    case 401:
      // Cookies.set('userInfo', '');
      // Cookies.set('accesstoken', '');
      // if (router.history.current.name != "login") {
      if (data.message !== null) {
        Notification.error({
          title: data.message,
          duration: 5000
        })
      } else {
        Notification.error({
          title: '未知错误，请重新登录',
          duration: 5000
        })
      }
      router.push('/login')
      // }
      break
    case 403:
      // 没有权限
      if (data.message !== null) {
        Notification.error({
          title: data.message,
          duration: 5000
        })
      } else {
        Notification.error({
          title: '未知错误',
          duration: 5000
        })
      }
      break
    case 500:
      if (data.message !== null) {
        Notification.error({
          title: data.message,
          duration: 5000
        })
      } else {
        Notification.error({
          title: '未知错误',
          duration: 5000
        })
      }
      break
    default:
      return data
  }
  return data
}, (err) => {
  // // 返回状态码不为200时候的错误处理
  // Message.error(err.response.data.message)
  // return Promise.resolve(err)
  endLoading()
  let code = 0
  try {
    code = err.response.data.status
  } catch (e) {
    if (err.toString().indexOf('Error: timeout') !== -1) {
      Notification.error({
        title: '网络请求超时',
        duration: 5000
      })
      return Promise.reject(err)
    }
  }
  if (code) {
    const errorMsg = err.response.data.message
    if (code === 401) {
      // store.dispatch('LogOut').then(() => {
      //     // 用户登录界面提示
      //     Cookies.set('point', 401)
      //     location.reload()
      // })
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 5000
        })
      }
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else {
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 5000
        })
      }
    }
  } else {
    Notification.error({
      title: '接口请求失败',
      duration: 5000
    })
  }
  return Promise.reject(err)
})

export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${baseUrl}${url}`,
    params: params,
    headers: {
      'Authorization': getToken()
    }
  })
}

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${baseUrl}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;',
      'Authorization': getToken()
    }
  })
}

export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${baseUrl}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': accessToken
    }
  })
}

export const postBodyRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${baseUrl}${url}`,
    data: params,
    headers: {
      'accessToken': getToken()
    }
  })
}
/**
 * 无需token验证的GET请求 避免旧token过期导致请求失败
 * @param {*} url
 * @param {*} params
 */
export const getNoAuthRequest = (url, param) => {
  return axios({
    method: 'get',
    url: `${baseUrl}${url}`,
    params: param
  })
}

export const postNoAuthRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${baseUrl}${url}`,
    data: params,
    headers: {
      'Content-Type': 'application/json;'
    }
  })
}

var loading
// 全局loading加载开始
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '资源加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

// 全局loading加载完毕
function endLoading() {
  loading.close()
}

export const uploadUrl = `${baseUrl}/api/user/uploadAvatar`
