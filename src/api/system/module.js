import { getRequest, postRequest } from '@/utils/axios'
import request from '@/utils/request'

export function add(params) {
    return request({
      url: "/module/add",
      method: "post",
      data: params
    });
  }
  
  export function edit(params) {
    return request({
      url: "/module/edit",
      method: "post",
      data: params
    });
  }
  
  export function del(params) {
    return request({
      url: "/module/delete",
      method: "post",
      data: params
    });
  }

// 获取菜单
export const getModuleAll = (params) => {
    return request({
        url: '/module/getMenuAll',
        method: 'get',
        data: params
      })
}

// 获取全部机构
export function getMenuAllList(params) {
    return request({
      url: "/module/getMenuAllList",
      method: "get",
      params
    });
  }

export const getByCondition = (params) => {
    return request({
        url: "/module/getByCondition",
        method: "post",
        data: params
      });
}

// export const getMenusTree = (params) => {
//     return getRequest('/api/module/getMenusTree', params)
// }

// export const getMenuSuperior = (params) => {
//     return getRequest("/api/module/getMenuSuperior", params)
// }

// 获取模块树接口
export const getModuleList = (params) => {
    return request({
        url:'/module/getModuleList',
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


export default { add, edit, del,getMenuAllList, getModuleAll, getByCondition, getModuleList, getModuleIdsByRoleId, saveOptionAuthority }