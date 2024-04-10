// 统一请求路径前缀在libs、axios.js中修改

import { getNoAuthRequest, postNoAuthRequest, getRequest } from '@/utils/axios'
import qs from 'qs'

// 初始化验证码
export const initCode = (params) => {
    return getNoAuthRequest("/common/captcha/code", params)
}

// 加载分页列表
export const initData = (url, params) => {
    return getRequest(url, params)
}

export const getDepts = (url, params) => {
    return getNoAuthRequest(url, params)
}

// 登录
export const login = (params) => {
    return postNoAuthRequest("/auth/login", params);
}

// 获取用户信息
export const getUserInfo = (params) => {
    return getRequest("/auth/getUserInfo", params)
}

// 退出登录
export const logout = (params) => {
    return getRequest("/auth/logout", params)
}

export function download(url, params) {
    console.log(qs.stringify(params, { indices: false }))
  return getRequest({
    url: url + '?' + qs.stringify(params, { indices: false }),
    method: 'get',
    responseType: 'blob'
  })
}

// 上传用户头像
export const uploadUrl = 'jxxqz/api/user/uploadAvatar'

// 修改用户头像
export const updateUploadUrl = 'jxxqz/api/user/updateUserAvatar'