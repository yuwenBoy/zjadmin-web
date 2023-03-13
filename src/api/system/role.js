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
  return postRequest("/api/role/add", params);
}

export function edit(params) {
  return postRequest("/api/role/edit", params);
}

export function del(params) {
  return postRequest("/api/role/delete", params);
}

export default { add, edit, del, getRoleAllList };
