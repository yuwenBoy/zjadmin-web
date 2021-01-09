import { getRequest, postRequest } from '@/utils/axios'

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
export function getPositionList(params) {
    return getRequest("/api/position/getPositionList", params)
}


export default { add, edit, del }