
import request from "@/utils/request";
// 获取消息历史记录
export const getMessageHistory = params => {
  return request({
    url: "/messages/MessageHistory",
    method: "post",
    data: params,
    showLoading:false,
  });
};

// 获取chat联系人列表
export const getChatContactList = params => {
  return request({
    url: "/user/getChatContactList",
    method: "post",
    data: params
  });
};