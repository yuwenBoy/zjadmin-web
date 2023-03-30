import request from "@/utils/request";

/**
 * 新增用户
 * @param {*} params
 * @returns
 */
export function add(params) {
  return request({
    url: "/user/add",
    method: "post",
    data: params
  });
}

/**
 * 编辑用户
 * @param {*} params
 * @returns
 */
export function edit(params) {
  return request({
    url: "/user/edit",
    method: "post",
    data: params
  });
}

/**
 * 删除用户
 * @param {*} params
 * @returns
 */
export function del(params) {
  return request({
    url: "/user/delete",
    method: "post",
    data: params
  });
}

/**
 * 设置角色
 */
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

// 登录
export const login = params => {
  return request({
    url: "auth/login",
    method: "post",
    data: params
  });
};

// 获取用户信息
export const getUserInfo = params => {
  return request({
    url: "auth/getUserInfo",
    method: "get",
    data: params
  });
};

// 退出登录
export const logout = params => {
  return request({ url: "auth/logout", method: "get", data: params });
};

export default {
  login,
  getUserInfo,
  logout,
  add,
  edit,
  del,
  UpdateUserDisabled,
  updateUserPwd
};
