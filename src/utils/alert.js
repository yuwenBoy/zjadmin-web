import { Notification, Message, MessageBox } from "element-ui";

const success = function(title = "设置成功", timeout = 2000) {
  Notification.success({
    title: title,
    duration: timeout
  });
};

const error = function(title = "设置", timeout = 2000) {
  Notification.error({
    title: title,
    duration: timeout
  });
};

/***
 * 消息框提示
 */
function alert(msg, type = "success") {
  Message({
    message: msg,
    type: type
  });
}

/***
 *
 * 确认提示消息框
 */
function confirm(msg, options, type = "warnging") {
  return MessageBox.confirm(msg, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: type
  })
    .then(() => {
      if (options.hasOwnProperty("ok") && typeof options.ok === 'function') {
        options.ok();
      }
    })
    .catch(() => {
      if (options.hasOwnProperty("cancel") && typeof options.cancel === "function") {
        options.cancel();
      }
    });
}

export default {
  success,
  error,
  alert,
  confirm
};
