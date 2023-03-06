// 统一请求路径前缀在libs、axios.js中修改

import { getNoAuthRequest, postNoAuthRequest, getRequest } from '@/utils/axios'


// 初始化验证码
export const initCode = (params) => {
    return getNoAuthRequest("/auth/authcode", params)
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

// 上传用户头像
export const uploadAvatar = (params) => {
    return postNoAuthRequest("/api/user/uploadAvatar", params)
}