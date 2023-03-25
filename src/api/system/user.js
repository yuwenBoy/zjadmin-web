import request from "@/utils/request";

export function add(params) {
  return request({
    url: "/user/add",
    method: "post",
    data: params
  });
}

export function edit(params) {
  return request({
    url: "/user/edit",
    method: "post",
    data: params
  });
}

export function del(params) {
  return request({
    url: "/user/delete",
    method: "post",
    data: params
  });
}

export function setRoles(params) {
  // return postRequest("/user/setRoles", params)
  return request({
    url: "/role/setRoles",
    method: "post",
    data: params
  });
}

/**
 * 设置用户状态
 * @param {*} params  用户id 状态
 * @returns
 */
export function UpdateUserDisabled(params) {
  return request({
    url: "/user/UpdateUserDisabled",
    method: "post",
    data: params
  });
}

/**
 * 设置用户状态
 * @param {*} params  用户id 状态
 * @returns
 */
export function updateUserPwd(params) {
    return request({
      url: "/user/updateUserPwd",
      method: "post",
      data: params
    });
  }

export default { add, edit, del, UpdateUserDisabled,updateUserPwd };
