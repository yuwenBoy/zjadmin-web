import request from "@/utils/request";

// 获取全部机构
export function getDeptTree(params) {
  return request({
    url: "/dept/getDeptTree",
    method: "get",
    params
  });
}

export const getByCondition = params => {
  return request({
    url: "/dept/getByCondition",
    method: "post",
    data: params
  });
};

export function add(params) {
  return request({
    url: "/dept/add",
    method: "post",
    data: params
  });
}

export function edit(params) {
  return request({
    url: "/dept/edit",
    method: "post",
    data: params
  });
}

export function del(params) {
  return request({
    url: "/dept/delete",
    method: "post",
    data: params
  });
}

export default {
  getByCondition,
  add,
  edit,
  del,
  getDeptTree
};
