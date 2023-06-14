import request from "@/utils/request";
  export function add(params) {
    return request({
      url: "/spu/add",
      method: "post",
      data: params
    });
  }
  
  export function edit(params) {
    return request({
      url: "/spu/edit",
      method: "post",
      data: params
    });
  }
  
  export function del(params) {
    return request({
      url: "/spu/delete",
      method: "post",
      data: params
    });
  }


  /***
   * 获取全部品类
   * 
   */
  export function getspuAll(params){
    return request({
        url: "/spu/getspuAll",
        method: "get",
        params
      });
  }

  export default {
    add,
    edit,
    del,
  };