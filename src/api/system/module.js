import { getRequest, postRequest } from '@/utils/axios'


export function add(params) {
    return postRequest("/api/module/add", params)
}

export function edit(params) {
    return postRequest("/api/module/edit", params)
}

export function del(params) {
    return postRequest("/api/module/delete", params)
}

// 获取菜单
export const getModuleAll = (params) => {
    return getRequest("/api/module/buildAll", params)
}

export const getModulePager = (params) => {
    return getRequest('/api/module/getByCondition', params)
}

export const getMenusTree = (params) => {
    return getRequest('/api/module/getMenusTree', params)
}

export const getMenuSuperior = (params) => {
    return getRequest("/api/module/getMenuSuperior", params)
}

// 获取模块树接口
export const getModuleTreeAll = (params) => {
    return getRequest("/api/module/getModuleTreeAll", params)
}

// 根据角色id获取模块id集合接口 
export const getModuleIdsByRoleId = (params) => {
    return getRequest('/api/module/findByRoleId', params)
}

// 保存权限接口
export const saveRoleModuleId = (params) => {
    return postRequest('/api/module/saveRoleModuleId', params)
}


export default { add, edit, del, getModuleAll, getModulePager, getMenusTree, getMenuSuperior, getModuleTreeAll, getModuleIdsByRoleId, saveRoleModuleId }