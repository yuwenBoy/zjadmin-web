/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "undefined" || time === null || time === "null") {
    return "";
  } else if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * 格式化时间戳为 QQ 风格
 * @param {number} timestamp - 毫秒时间戳
 * @returns {string} - 格式化后的时间字符串
 */
export function formatChatTimestamp(timestamp) {
  const targetDate = new Date(timestamp);
  const now = new Date();
  // Step 1: 计算基于 UTC 的天数差 (确保跨时区无误差)
  const dayDiff = Math.floor(
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
      Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate()
      )) /
      (1000 * 60 * 60 * 24)
  );
  // Step 2: 获取时间部分 (HH:mm)
  const timePart = targetDate.toTimeString().slice(0, 5); // "10:07"
  // Step 3: 根据天数差返回不同格式
  if (dayDiff === 0) {
    // 同一天
    return timePart;
  } else if (dayDiff === 1) {
    // 昨天
    return "昨天 " + timePart;
  } else if (dayDiff === 2) {
    // 前天
    return "前天 " + timePart;
  } else {
    // 其他情况返回完整日期
    const year = targetDate.getFullYear();
    const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
    const day = targetDate
      .getDate()
      .toString()
      .padStart(2, "0");
    const hour = targetDate
      .getHours()
      .toString()
      .padStart(2, "0");
    const minute = targetDate
      .getMinutes()
      .toString()
      .padStart(2, "0");
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length;
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i);
    if (code > 0x7f && code <= 0x7ff) s++;
    else if (code > 0x7ff && code <= 0xffff) s += 2;
    if (code >= 0xdc00 && code <= 0xdfff) i--;
  }
  return s;
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
      '"}'
  );
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];
    if (typeof sourceProperty === "object") {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "deepClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === "object") {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + "";
  const randomNum = parseInt((1 + Math.random()) * 65536) + "";
  return (+(randomNum + timestamp)).toString(32);
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/***
 * 根据文件路径获取文件名
 */
export function getFileName(path) {
  if (!path) return '';
  
  // 处理URL格式
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path);
      return url.pathname.split('/').pop() || '';
    } catch (e) {
      // 如果URL解析失败，回退到普通路径处理
    }
  }
  
  // 处理本地路径（支持正斜杠和反斜杠）
  const filePath = path;
  const lastIndex = Math.max(filePath.lastIndexOf("\\"), filePath.lastIndexOf("/"));
  return filePath.substr(lastIndex + 1);
}

/**
 * 获取完整的图片URL
 * @param {string} url - 图片路径或URL
 * @param {string} defaultUrl - 默认图片URL（可选）
 * @returns {string} - 完整的图片URL
 */
export function getFullImageUrl(url, defaultUrl = '') {
  if (!url || url === '') return defaultUrl;
  
  // 如果已经是完整URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果是相对路径，拼接图片服务器地址
  const baseUrl = 'http://image.jxxqz.com:3001/';
  return baseUrl + url.replace(/^\/*/, ''); // 移除开头的斜杠
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf("@") > 0) {
    const str = email.split("@");
    let _s = "";
    if (str[0].length > 3) {
      for (var i = 0; i < str[0].length - 3; i++) {
        _s += "*";
      }
    }
    var new_email = str[0].substr(0, 3) + _s + "@" + str[1];
  }
  return new_email;
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    var new_mobile = mobile.substr(0, 3) + "****" + mobile.substr(7);
  }
  return new_mobile;
}

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]));
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  const fileName = parseTime(new Date()) + "-" + name + "." + suffix;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/***
 * 普通数据转换成树结构
 */
export function arrayToTree(arr, pid) {
  return arr.reduce((res, current) => {
    if (current["parent_id"] == pid) {
      current["children"] = arrayToTree(arr, current["id"]);
      if (arr.filter(t => t.parent_id == current["id"]).length == 0) {
        current["children"] = undefined;
      }
      return res.concat(current);
    }
    return res;
  }, []);
}
// 对下载的流进行处理，直接从浏览器下载下来
export function excelDownload(res) {
  if (res.data.type === "application/json") {
    // 错误以及无权限
    const reader = new FileReader(res.data);
    reader.readAsText(res.data);
    reader.onload = () => {
      const result = JSON.parse(reader.result);
      message.error(result.msg);
    };
  } else {
    const contentDisposition = res.headers["content-disposition"];
    const patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
    const $link = document.createElement("a");
    const url = URL.createObjectURL(new Blob([res.data]));
    $link.href = url;
    $link.download = decodeURIComponent(patt.exec(contentDisposition)[1]);
    $link.click();
    document.body.appendChild($link);
    document.body.removeChild($link); // 下载完成移除元素
    window.URL.revokeObjectURL($link.href); // 释放掉blob对象
  }
}

/**
 * 验证数组对象某个属性是否重复
 * @param {*} array
 * @param {*} property
 * @returns
 */

export function hasDuplicateProperty(array, property) {
  const seenValues = new Set();

  for (const obj of array) {
    if (obj.hasOwnProperty(property)) {
      const value = obj[property];
      if (seenValues.has(value)) {
        return true; // 发现重复
      }
      seenValues.add(value);
    }
  }

  return false; // 没有发现重复
}


/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  var childrenListMap = {}
  var tree = []
  for (let d of data) {
    let id = d[config.id]
    childrenListMap[id] = d
    if (!d[config.childrenList]) {
      d[config.childrenList] = []
    }
  }

  for (let d of data) {
    let parentId = d[config.parentId]
    let parentObj = childrenListMap[parentId]
    if (!parentObj) {
      tree.push(d)
    } else {
      parentObj[config.childrenList].push(d)
    }
  }
  // 递归删除空的 children 属性
  const removeEmptyChildren = (nodes) => {
    nodes.forEach(node => {
      if (node[config.childrenList] && node[config.childrenList].length === 0) {
        delete node[config.childrenList]
      } else if (node[config.childrenList]) {
        removeEmptyChildren(node[config.childrenList])
      }
    })
  }
  
  removeEmptyChildren(tree)
  return tree
}
