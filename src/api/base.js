import request from "@/utils/request";

/**
 * 获取验证码
 * @param {*} params
 * @returns
 */
export const getCodeData = async params => {
  return request({
    url: "auth/authcode",
    method: "get",
    params
  });
};

/**
 * crud.js 统一请求接口【加载分页列表】
 * @param {*} url
 * @param {*} params
 * @returns
 */
export const getTableData = (url, params) => {
  return request({
    url: url,
    method: "post",
    data: params
  });
};

// export const getDepts = (url, params) => {
//     return getNoAuthRequest(url, params)
// }

// // 登录
// export const login = (params) => {
//     return request({
//         url: 'auth/login',
//         method: 'post',
//         data: params
//       })
// }

// // 获取用户信息
// export const getUserInfo = (params) => {
//     // return getRequest("/auth/getUserInfo", params)
//     return request({
//         url: 'auth/getUserInfo',
//         method: 'get',
//         data: params
//       })
// }

// // 退出登录
// export const logout = (params) => {
//     return request({url:'auth/logout',method:'get',data:params})
// }

// // 上传用户头像
// export const uploadAvatar = (params) => {
//     return postNoAuthRequest("/api/user/uploadAvatar", params)
// }
