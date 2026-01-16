import request from "@/utils/request";
  export function add(params) {
    return request({
      url: "/businesscategory/add",
      method: "post",
      data: params
    });
  }
  
  export function edit(params) {
    return request({
      url: "/businesscategory/edit",
      method: "post",
      data: params
    });
  }
  
  export function del(params) {
    return request({
      url: "/businesscategory/delete",
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
        url: "/businesscategory/getCategoryAll",
        method: "get",
        params
      });
  }
// 获取一级分类
export function fetchMainCategories() {
    return request({
      url: '/businesscategory/main',
      method: 'get'
    });
  }
  
  // 获取子分类
  export function fetchSubCategories(parentId) {
    return request({
      url: `/businesscategory/sub`,
      method: 'get',
      params: { parent_id: parentId }
    });
  }

  export default {
    add,
    edit,
    del,
    fetchMainCategories,
    fetchSubCategories,
  };