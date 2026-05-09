import request from "@/utils/request";

/**
 * 获取异常日志列表
 * @param {*} params
 * @returns
 */
export function getErrorLogList(params) {
  return request({
    url: "/log/error/list",
    method: "get",
    params
  });
}

/**
 * 获取异常日志详情
 * @param {*} id
 * @returns
 */
export function getErrorLogDetail(id) {
  return request({
    url: `/log/error/${id}`,
    method: "get"
  });
}

/**
 * 删除异常日志
 * @param {*} params
 * @returns
 */
export function delErrorLog(params) {
  return request({
    url: "/log/error/delete",
    method: "post",
    data: params
  });
}

/**
 * 清空异常日志
 * @returns
 */
export function clearErrorLog() {
  return request({
    url: "/log/error/clear",
    method: "post"
  });
}

/**
 * 导出异常日志
 * @param {*} params
 * @returns
 */
export function exportErrorLog(params) {
  return request({
    url: "/log/error/export",
    method: "post",
    data: params,
    responseType: "blob"
  });
}

export default {
  getErrorLogList,
  getErrorLogDetail,
  delErrorLog,
  clearErrorLog,
  exportErrorLog
};
