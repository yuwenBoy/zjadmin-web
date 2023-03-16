import { getRequest, postRequest } from "@/utils/axios";

import request from "@/utils/request";

/**
 *获取角色权限
 * @param {*} params
 */
export function getRoleAllList(params) {
  return request({
    url: "/role/getRoleAll",
    method: "get",
    params
  });
}


export function add(params) {
  return request({
    url: "/role/add",
    method: "post",
    data: params
  });
}

export function edit(params) {
  return request({
    url: "/role/edit",
    method: "post",
    data: params
  });
}

export function del(params) {
  return request({
    url: "/role/delete",
    method: "post",
    data: params
  });
}

export default { add, edit, del, getRoleAllList };
