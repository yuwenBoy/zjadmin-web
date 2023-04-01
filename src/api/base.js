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
// // 上传用户头像
// export const uploadAvatar = (params) => {
//     return request({
//         url:'/basic-api/oss/uploadAvatar',
//         method:'post',
//         data:params
//     })
// }
