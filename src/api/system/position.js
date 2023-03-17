import request from "@/utils/request";

export function add(params) {
  return request({
    url: "/position/add",
    method: "post",
    data: params
  });
}

export function edit(params) {
  return request({
    url: "/position/edit",
    method: "post",
    data: params
  });
}

export function del(params) {
  return request({
    url: "/position/delete",
    method: "post",
    data: params
  });
}

/**
 *获取职位列表
 * @param {*} params
 */
export function getPositionByDeptId(params) {
  return request({
    url: "/position/getPositionByDeptId",
    method: "get",
    params
  });
}

export default { add, edit, del, getPositionByDeptId };
