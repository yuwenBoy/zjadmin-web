// 统一请求路径前缀在libs、axios.js中修改

import { getNoAuthRequest, postNoAuthRequest, getRequest } from '@/utils/axios'
import request from '@/utils/request'


// 初始化验证码
export const initCode = (params) => {
    return getNoAuthRequest("/auth/authcode", params)
}

// 加载分页列表
export const initData = (url, params) => {
    //return getRequest(url, params)
    return request({
        url: url,
        method: 'post',
        data: params
      })
}

export const getDepts = (url, params) => {
    return getNoAuthRequest(url, params)
}

// 登录
export const login = (params) => { 
    return request({
        url: 'auth/login',
        method: 'post',
        data: params
      })
}

// 获取用户信息
export const getUserInfo = (params) => {
    // return getRequest("/auth/getUserInfo", params)
    return request({
        url: 'auth/getUserInfo',
        method: 'get',
        data: params
      })
}

// 退出登录
export const logout = (params) => {
    return request({url:'auth/logout',method:'get',data:params})
}

// 上传用户头像
export const uploadAvatar = (params) => {
    return postNoAuthRequest("/api/user/uploadAvatar", params)
}