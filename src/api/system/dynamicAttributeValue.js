import request from "@/utils/request";
/***
 * 动态属性值表接口
 */

export function add(params) {
  return request({
    url: "/dynamicAttributeValue/add",
    method: "post",
    data: params
  });
}

export function edit(params) {
  return request({
    url: "/dynamicAttributeValue/edit",
    method: "post",
    data: params
  });
}

export function del(params) {
  return request({
    url: "/dynamicAttributeValue/delete",
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
        url: "/dynamicAttributeValue/getCategoryAll",
        method: "get",
        params
      });
  }

export default { add, edit, del,getCategoryAll };
