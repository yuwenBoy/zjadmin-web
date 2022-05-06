
// 公告审核状态
const noticeStatus = {
  '0': '未提交',
  '1': '待审核',
  '2': '审核不通过',
  '3': '已发布' //  已发布、已审核
}

// 公告类型
const noticeTypeList = [
  { id: 1, name: '公司制度' },
  { id: 2, name: '公司新规定' },
  { id: 3, name: '员工奖惩' }
]

export default {
  noticeStatus,
  noticeTypeList
}
