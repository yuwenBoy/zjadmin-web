import { getRequest, postRequest } from '@/utils/axios'


import request from '@/utils/request';

export function add(params) {
    return postRequest("/api/position/add", params)
}

export function edit(params) {
    return postRequest("/api/position/edit", params)
}

export function del(params) {
    return postRequest("/api/position/delete", params)
}


/**
 *获取职位列表 
 * @param {*} params 
 */
export function getPositionByDeptId(params) {
    return request({
        url: '/position/getPositionByDeptId',
        method: "get",
        params
    })
}


export default { add, edit, del,getPositionByDeptId }