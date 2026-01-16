
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


/***
 * 门店状态
 */
const storeStatus = {
    0:'审核中',
    1:'营业中',
    2:'暂停营业',
    3:'被平台暂停'
}

/***
 * 员工状态
 */
const employeeStatus = {
    1:'正常',
    2:'禁用',
}

/***
 * 角色类型
 */
const roleTypeEnum = {
    0:'系统角色',
    1:'商家角色',
    2:'员工角色',
}

/**
 * 角色类型颜色
 */
const roleTypeEnumColor = {
    0:'#E6A23C',
    1:'#F56C6C',
    2:'#409EFF',
}


/***
 * 动态属性类型
 */
const attributeTypeEnum = {
    1:'文本',
    2:'级联',
    3:'下拉',
    4:'多选',
}

/**
 * 动态属性类型颜色
 */
const attributeTypeColor = {
    1:'',
    2:'success',
    3:'danger',
    4:'warning',
}


/***
 * 模块表：菜单类型
 */
const moduleMenuTypeEnum={
    1:'按钮',
    2:'菜单',
    3:'目录',
    4:'接口'
}

/***
 * 模块表：菜单类型 颜色
 */
const moduleMenuTypeEnumColor={
    1:'#E6A23C',
    2:'#F56C6C',
    3:'#409EFF',
    4:'#909399',
}
export default {
  noticeStatus,
  noticeTypeList,
  storeStatus,
  employeeStatus,
  roleTypeEnum,
  roleTypeEnumColor,
  moduleMenuTypeEnum,
  moduleMenuTypeEnumColor,
  attributeTypeEnum,
  attributeTypeColor,
}
