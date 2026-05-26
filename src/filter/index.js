import Vue from 'vue'
/**
 * 根据出生日期算出年龄
 * str 出生日期
 */

Vue.filter('fmt_age', function getAge(str) {
  const r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/)
  if (r == null) return '__'

  const d = new Date(r[1], r[3] - 1, r[4])
  let returnStr = '输入的日期格式错误！'

  if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
    const date = new Date()
    const yearNow = date.getFullYear()
    const monthNow = date.getMonth() + 1
    const dayNow = date.getDate()

    const largeMonths = [1, 3, 5, 7, 8, 10, 12]
    const lastMonth = monthNow - 1 > 0 ? monthNow - 1 : 12
    let isLeapYear = false
    let daysOFMonth = 0

    if ((yearNow % 4 === 0 && yearNow % 100 !== 0) || yearNow % 400 === 0) {
      isLeapYear = true
    }

    if (largeMonths.indexOf(lastMonth) > -1) {
      daysOFMonth = 31
    } else if (lastMonth === 2) {
      daysOFMonth = isLeapYear ? 29 : 28
    } else {
      daysOFMonth = 30
    }

    let Y = yearNow - parseInt(r[1])
    let M = monthNow - parseInt(r[3])
    let D = dayNow - parseInt(r[4])
    if (D < 0) {
      D = D + daysOFMonth // 借一个月
      M--
    }
    if (M < 0) { // 借一年 12个月
      Y--
      M = M + 12 //
    }

    if (Y < 0) {
      returnStr = '出生日期有误！'
    } else if (Y === 0) {
      if (M === 0) {
        // returnStr = D + "D";
        returnStr = D
      } else {
        // returnStr = M + "M";
        // returnStr = M + "M";
        returnStr = ''
      }
    } else {
      if (M === 0) {
        returnStr = Y
      } else {
        returnStr = Y
      }
    }
  }
  return returnStr
})

// vue 过滤器做字数限制并显示省略号{{value | ellipsis(15)}}
Vue.filter('ellipsis', (value, num) => {
  const nums = num || '5'// 设置限定字数,默认为5
  if (!value) return ''
  if (value.length > nums) {
    return value.slice(0, nums) + '...'
  }
  return value
})

/**
手机号间隔显示
**/
Vue.filter('fmt_phone', function formatPhone(str) {
  return str.replace(/\s/g, '').replace(/(^\d{3})(?=\d)/g, '$1 ').replace(/(\d{4})(?=\d)/g, '$1 ')
})
