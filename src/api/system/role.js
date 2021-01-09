import { getRequest, postRequest } from '@/utils/axios'
/**
 *获取职位列表 
 * @param {*} params 
 */
export function getRoleAllList(params) {
    return getRequest("/api/role/getRoleAll", params)
}

/**
 * 根据用户id获取角色id集合
 */
export function getRoleIdsByUserId(params) {
    return getRequest("/api/role/findByUserId", params)
}

export function add(params) {
    return postRequest("/api/role/add", params)
}

export function edit(params) {
    return postRequest("/api/role/edit", params)
}

export function del(params) {
    return postRequest("/api/role/delete", params)
}

export default { add, edit, del }