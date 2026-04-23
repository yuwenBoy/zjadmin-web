import request from "@/utils/request";

/**
 * 获取商家订单列表
 * @param {Object} params - 请求参数
 * @param {number} params.storeId - 门店ID
 * @param {number} [params.status] - 订单状态（可选）
 * @param {number} [params.page=1] - 页码
 * @param {number} [params.pageSize=20] - 每页数量
 * @returns {Promise}
 */
export function getOrderList(params) {
  return request({
    url: "/merchant/order/list",
    method: "post",
    data: params
  });
}

/**
 * 商家接单
 * @param {Object} params - 请求参数
 * @param {number} params.orderId - 订单ID
 * @param {number} params.storeId - 门店ID
 * @returns {Promise}
 */
export function acceptOrder(params) {
  return request({
    url: "/merchant/order/accept",
    method: "post",
    data: params
  });
}

/**
 * 商家拒绝接单
 * @param {Object} params - 请求参数
 * @param {number} params.orderId - 订单ID
 * @param {number} params.storeId - 门店ID
 * @param {string} params.cancelReason - 取消原因
 * @returns {Promise}
 */
export function rejectOrder(params) {
  return request({
    url: "/merchant/order/reject",
    method: "post",
    data: params
  });
}

/**
 * 备货完成
 * @param {Object} params - 请求参数
 * @param {number} params.orderId - 订单ID
 * @param {number} params.storeId - 门店ID
 * @returns {Promise}
 */
export function finishPreparation(params) {
  return request({
    url: "/merchant/order/finish-prepare",
    method: "post",
    data: params
  });
}

/**
 * 分配骑手
 * @param {Object} params - 请求参数
 * @param {number} params.orderId - 订单ID
 * @param {number} params.storeId - 门店ID
 * @param {number} params.riderId - 骑手ID
 * @param {string} params.riderName - 骑手姓名
 * @param {string} params.riderPhone - 骑手电话
 * @returns {Promise}
 */
export function assignRider(params) {
  return request({
    url: "/merchant/order/assign-rider",
    method: "post",
    data: params
  });
}

/**
 * 订单送达确认
 * @param {Object} params - 请求参数
 * @param {number} params.orderId - 订单ID
 * @param {number} params.storeId - 门店ID
 * @returns {Promise}
 */
export function completeDelivery(params) {
  return request({
    url: "/merchant/order/complete-delivery",
    method: "post",
    data: params
  });
}

/**
 * 获取订单统计
 * @param {Object} params - 请求参数
 * @param {number} params.storeId - 门店ID
 * @returns {Promise}
 */
export function getOrderStatistics(params) {
  return request({
    url: "/merchant/order/statistics",
    method: "post",
    data: params,
    showLoading: false
  });
}

export default {
  getOrderList,
  acceptOrder,
  rejectOrder,
  finishPreparation,
  assignRider,
  completeDelivery,
  getOrderStatistics
};
