import request from "@/utils/request";
export function add(params) {
  return request({
    url: "/product_group/add",
    method: "post",
    data: params
  });
}

export function edit(params) {
  return request({
    url: "/product_group/edit",
    method: "post",
    data: params
  });
}

export function del(params) {
  return request({
    url: "/product_group/delete",
    method: "post",
    data: params
  });
}

/**
 * 获取产品全部类目
 * @returns
 */
export function fetchMainProductCategories() {
  return request({
    url: "/productCategory/category",
    method: "get"
  });
}

export function fetchProductGroup() {
  return request({
    url: "/product_group/fetchProductGroup",
    method: "get"
  });
}

export default {
  add,
  edit,
  del,
  fetchMainProductCategories,
  fetchProductGroup
};
