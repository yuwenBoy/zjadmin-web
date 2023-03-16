import { getRequest, postRequest } from '@/utils/axios'
import request from '@/utils/request'

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
    return request({
        url: '/module/getMenuAll',
        method: 'get',
        data: params
      })
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
    return request({
        url:'/module/getModuleTreeAll',
        method:'get',
        params
    })
}

// 根据角色id获取模块id集合接口 
export const getModuleIdsByRoleId = (params) => {
    return request({
        url:'/module/findByRoleId',
        method:'get',
        params
    })
}

// 保存操作权限
export const saveOptionAuthority = (params) => {
    return request({
        url:'/authority/saveOptionAuthority',
        method:'post',
        data:params
    })
}


export default { add, edit, del, getModuleAll, getModulePager, getMenusTree, getMenuSuperior, getModuleTreeAll, getModuleIdsByRoleId, saveOptionAuthority }