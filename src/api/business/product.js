import request from "@/utils/request";

  /***
   * 根据菜品分组id获取产品列表
   * 
   */
  export function productListPager(params){
    return request({
        url: "/product/productListPager",
        method: "post",
        data: params
      });
  }

  export function create(params) {
    return request({
      url: "/product/create",
      method: "post",
      data: params
    });
  }
  
  export function edit(params) {
    return request({
      url: "/productCategory/edit",
      method: "post",
      data: params
    });
  }

   
  export function add(params) {
    return request({
      url: "/productCategory/add",
      method: "post",
      data: params
    });
  }
  
  export function del(params) {
    return request({
      url: "/productCategory/delete",
      method: "post",
      data: params
    });
  }


  export function getProdctCategoryList(params){
    return request({
        url: "/productCategory/getByCondition",
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
        url: "/productCategory/getCategoryAll",
        method: "get",
        params
      });
  }

   /***
   * 获取商品总数、已下架、已售罄数量
   * 
   */
   export function getStatistics(params){
    return request({
        url: "/product/getStatistics",
        method: "get",
        params
      });
  }

  
   /***
   * 获取商品信息
   * 
   */
   export function detail(params){
    return request({
        url: "/product/detail",
        method: "get",
        params
      });
  }

  


  // 获取一级分类
export function fetchMainCategories() {
    return request({
      url: '/productCategory/main',
      method: 'get'
    });
  }
  
  // 获取子分类
  export function fetchSubCategories(parentId) {
    return request({
      url: `/productCategory/sub`,
      method: 'get',
      params: { parent_id: parentId }
    });
  }

    /***
   * 产品上下架
   * 
   */
    export function updateProductStatus(params){
        return request({
            url: "/product/updateProductStatus",
            method: "post",
            data:params
          });
      }

    /**
     * 批量改分组、描述
     * @returns 
     */  
    export function batchUpdateInfo(params){
        return request({
            url: "/product/batch_update_info",
            method: "post",
            data:params
        });   
    }  

   
    /**
     * 获取商家属性
     * @param {*} params 
     * @returns 
     */
    export function fetchProperties(params) {
         return request({
          url: `/product/fetch_properties`,
          method: 'get',
          params
    });
  }


    

  export default {
    productListPager,
    create,
    edit,
    add,
    del,
    fetchMainCategories,
    fetchSubCategories,
    getProdctCategoryList,
    getStatistics,
    detail,
    updateProductStatus,
    batchUpdateInfo,
    fetchProperties,
  };