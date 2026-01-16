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
     * 获取产品分类一级类目
     * @returns 
     */
    export function fetchMainProductCategories() {
        return request({
          url: '/productCategory/main',
          method: 'get'
        });
      }
      
      // 获取产品分类子级类目
      export function fetchSubProductCategories(parentId) {
        return request({
          url: `/productCategory/sub`,
          method: 'get',
          params: { parent_id: parentId }
        });
      }

      export function fetchProductGroup(){
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
    fetchSubProductCategories,
    fetchProductGroup,
  };