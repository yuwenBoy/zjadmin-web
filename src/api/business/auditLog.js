import request from "@/utils/request";

// 获取审核记录详情
export function getAuditLogDetail(id) {
  return request({
    url: `/auditLog/detail/${id}`,
    method: "get"
  })
}


// 审核驳回
export function auditReject(data) {
  return request({
    url: '/auditLog/reject',
    method: 'post',
    data
  })
}

// 批量通过
export function auditPass(data) {
  return request({
    url: '/auditLog/batchPass',
    method: 'post',
    data
  })
}

// 批量驳回
export function batchAuditReject(data) {
  return request({
    url: '/auditLog/batchReject',
    method: 'post',
    data
  })
}
