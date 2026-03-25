import request from "@/utils/request";
export function add(params) {
  return request({
    url: "/store/add",
    method: "post",
    data: params
  });
}

export function edit(params) {
  return request({
    url: "/store/edit",
    method: "post",
    data: params
  });
}

/**
 * 修改门店营业时间
 */
export function updateShopServingTime(params) {
  return request({
    url: "/hours/updateShopServingTime",
    method: "post",
    data: params
  });
}

// 查询门店营业时间
export function queryShopServingTime(params) {
  return request({
    url: "/hours/queryShopServingTime",
    method: "post",
    data: params
  });
}

// 查询门店营业状态
export function queryShopStatusViewDetail(params) {
  return request({
    url: "/hours/queryShopStatusViewDetail",
    method: "post",
    data: params,
    showLoading: false
  });
}

// 修改门店信息并提交审核
export function updateStoreAndSubmitAudit(data) {
  return request({
    url: `/store/updateAndSubmitAudit`,
    method: "post",
    data
  });
}

// 修改门店头像申请
export function modifyShopAvatar(data) {
  return request({
    url: `/store/modifyShopAvatar`,
    method: "post",
    data
  });
}

export function del(params) {
  return request({
    url: "/store/delete",
    method: "post",
    data: params
  });
}

export function detail(data) {
  return request({
    url: "/store/getShopInfo",
    method: "post",
    data
  });
}

/**
 *获取门店列表
 * @param {*} params
 */
export function getStoreList(params) {
  return request({
    url: "/store/getStoreList",
    method: "get",
    params
  });
}


/**
 * 门店上线
 * case 1
 * @param {*} data 
 * @returns 
 */
export function onlineShop(data){
    return request({
        url: `/store/online`,
        method: "post",
        data
    });
}

/**
 * 5分钟后关店
 * case 2
 * @param {*} data 
 * @returns 
 */
export function closeShopDelay(data){
 return request({
        url: `/store/close-delay`,
        method: "post",
        data
    });
}

/**
 * 立即关店
 * case 3
 * @param {*} data 
 */
export function closeShopImmediate(data){
return request({
        url: `/store/close-immediate`,
        method: "post",
        data
    });
}

/**
 * 门店下线
 * case 4
 * @param {*} data 
 * @returns 
 */
export function offlineShop(data){
    return request({
        url: `/store/offline`,
        method: "post",
        data
    });
}


export default {
  add,
  edit,
  del,
  getStoreList,
  updateShopServingTime,
  queryShopServingTime,
  detail,
};
