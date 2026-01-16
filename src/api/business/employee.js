import request from "@/utils/request";
  export function add(params) {
    return request({
      url: "/employee/add",
      method: "post",
      data: params
    });
  }
  
  export function edit(params) {
    return request({
      url: "/employee/edit",
      method: "post",
      data: params
    });
  }
  
  export function del(params) {
    return request({
      url: "/employee/delete",
      method: "post",
      data: params
    });
  }

  export default {
    add,
    edit,
    del
  };