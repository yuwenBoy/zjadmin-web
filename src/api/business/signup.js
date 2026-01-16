import request from "@/utils/request";


/**
 * 商家入驻申请接口
 * @param {*} params 
 * @returns 
 */
export function create(params) {
    return request({
      url: "/business/create",
      method: "post",
      data: params
    })
}

/**
 * 系统审核商家入驻信息
 * @param {*} params 
 * @returns 
 */
export function apply(params) {
    return request({
      url: "/business/apply",
      method: "post",
      data: params
    })
}

export default {create,apply}
    