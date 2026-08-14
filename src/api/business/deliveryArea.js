import request from '@/utils/request'

// =========================
// 商家配送区域管理
// 后端接口尚未开发，下方路径为约定，后续按实际接口调整
// =========================

/**
 * 分页查询配送区域列表
 * @param {*} params { storeId, areaName, status, page, size }
 * @returns
 */
export function getDeliveryAreaList(params) {
  return request({
    url: '/deliveryArea/getByCondition',
    method: 'post',
    data: params
  })
}

/**
 * 新增配送区域
 * @param {*} params { storeId, areaName, shape, radius, centerLng, centerLat, polygonPath, deliveryFee, minOrderAmount, estimatedTime, status, remark }
 * @returns
 */
export function addDeliveryArea(params) {
  return request({
    url: '/deliveryArea/add',
    method: 'post',
    data: params
  })
}

/**
 * 编辑配送区域
 * @param {*} params
 * @returns
 */
export function editDeliveryArea(params) {
  return request({
    url: '/deliveryArea/edit',
    method: 'post',
    data: params
  })
}

/**
 * 删除配送区域
 * @param {*} params { id }
 * @returns
 */
export function delDeliveryArea(params) {
  return request({
    url: '/deliveryArea/delete',
    method: 'post',
    data: params
  })
}

/**
 * 切换配送区域状态（启用/禁用）
 * @param {*} params { id, status }
 * @returns
 */
export function toggleDeliveryAreaStatus(params) {
  return request({
    url: '/deliveryArea/toggleStatus',
    method: 'post',
    data: params
  })
}

export default {
  getDeliveryAreaList,
  addDeliveryArea,
  editDeliveryArea,
  delDeliveryArea,
  toggleDeliveryAreaStatus
}
