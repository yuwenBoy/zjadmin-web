import request from "@/utils/request";

export function add(params) {
  return request({
    url: "/dynamicAttribute/add",
    method: "post",
    data: params
  });
}

export function edit(params) {
  return request({
    url: "/dynamicAttribute/edit",
    method: "post",
    data: params
  });
}

export function del(params) {
  return request({
    url: "/dynamicAttribute/delete",
    method: "post",
    data: params
  });
}

/**
 * 动态属性批量关联产品分类
 * @returns 
 */
export function relevanceProductCategory(params){
    return request({
        url: "/dynamicAttribute/relevanceProductCategory",
        method: "post",
        data: params
      });
}

/**
 * 动态属性批量移除产品分类
 * @returns 
 */
export function batchRemove(params){
    return request({
        url: "/dynamicAttribute/batchRemove",
        method: "post",
        data: params
      });
}

/**
 * 根据分类获取动态属性
 * @returns 
 */
export function getDynamicAttributeByCategoryId(params){
    return request({
        url: "/dynamicAttribute/getDynamicAttributeByCategoryId",
        method: "post",
        data: params
      });
}


export default { add, edit, del};
