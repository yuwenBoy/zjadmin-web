
export const CategoryList = [
  {
    value: '设备仪器'
  },
  {
    value: '附件硬件'
  },
  {
    value: '工装'
  },
  {
    value: '刀具'
  },
  {
    value: '夹具'
  },
  {
    value: '量具'
  },
  {
    value: '工具'
  },
  {
    value: '终端'
  },
  {
    value: '物料'
  },
  {
    value: '零件/部件/组件'
  },
  {
    value: '型号产品'
  }
]

/**
* 获取当前年月日
*/
export function formatDate(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;
  var myweekday = date.getDate();

  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  if (myweekday < 10) {
    myweekday = "0" + myweekday;
  }
  return myyear + "-" + mymonth + "-0" + 1;
}

/**
* 获取当前月
*/
export function formatMonth(date) {
  var myyear = date.getFullYear();
  var mymonth = date.getMonth() + 1;

  if (mymonth < 10) {
    mymonth = "0" + mymonth;
  }
  return myyear + "-" + mymonth;
}

/**获取当前季度 */
export function formatQuarter(month) {
  if (month < 3) {
    return "年1季度";
  } else if (month < 6) {
    return "年2季度";
  } else if (month < 9) {
    return "年3季度";
  } else if (month <= 12) {
    return "年4季度";
  }
}
/**获取当年周 */
export function formatWeek(dt) {
  let d1 = new Date(dt);
  let d2 = new Date(dt);
  d2.setMonth(0);
  d2.setDate(1);
  let rq = d1 - d2;
  let days = Math.ceil(rq / (24 * 60 * 60 * 1000));
  let num = Math.ceil(days / 7);
  return num + 1;
}
export default { CategoryList }
