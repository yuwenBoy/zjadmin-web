import request from "@/utils/request";
  export function add(params) {
    return request({
      url: "/category/add",
      method: "post",
      data: params
    });
  }
  
  export function edit(params) {
    return request({
      url: "/category/edit",
      method: "post",
      data: params
    });
  }
  
  export function del(params) {
    return request({
      url: "/category/delete",
      method: "post",
      data: params
    });
  }


  /***
   * 获取全部品类
   * 
   */
  export function getCategoryAll(params){
    return request({
        url: "/category/getCategoryAll",
        method: "get",
        params
      });
  }

  export default {
    add,
    edit,
    del,
  };