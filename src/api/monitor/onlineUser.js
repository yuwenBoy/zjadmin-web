import request from "@/utils/request";

/**
 * 获取在线用户列表
 * @param {*} params
 * @returns
 */
export function getOnlineUserList(params) {
  return request({
    url: "/log/online/list",
    method: "get",
    params
  });
}

/**
 * 获取统计数据（在线人数、今日登录、总记录数、历史峰值）
 * @param {*} params
 * @returns
 */
export function getOnlineStats(params) {
  return request({
    url: "/log/online/stats",
    method: "get",
    params
  });
}

/**
 * 强制用户下线
 * @param {*} params
 * @returns
 */
export function kickUser(params) {
  return request({
    url: "/log/online/kick",
    method: "post",
    data: params
  });
}

/**
 * 获取用户操作日志
 * @param {*} params
 * @returns
 */
export function getUserOperLog(params) {
  return request({
    url: "/log/online/operLog",
    method: "post",
    data:params
  });
}

/**
 * 强制多人下线
 * @param {*} params
 * @returns
 */
export function kickUsers(params) {
  return request({
    url: "/log/online/kickBatch",
    method: "post",
    data: params
  });
}

export default {
  getOnlineUserList,
  getOnlineStats,
  kickUser,
  getUserOperLog,
  kickUsers
};
