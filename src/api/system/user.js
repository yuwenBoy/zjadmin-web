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

export default { add, edit, del };
