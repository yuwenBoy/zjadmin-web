import axios from "axios";
import jwtDecode from "jwt-decode";
import router from "@/router/routers";
import { Notification, MessageBox, Loading } from "element-ui";
import store from "../store";
import { getToken, getRTExp, getRefreshToken } from "@/utils/storage";
import Config from "@/settings";
import { updateToken } from "@/api/system/user";
import { setToken } from "./auth";

var loading,
  isRefreshing = false,
  retryReqs = [];
// 全局loading加载开始
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: "资源加载中……",
    background: "rgba(0, 0, 0, 0.7)"
  });
}

// 全局loading加载完毕
function endLoading() {
  loading.close();
}

// 创建axios实例
const service = axios.create({
  baseURL: "basic-api", // process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    } else {
      config.headers["Authorization"] = getRefreshToken();
    }
    config.headers["Content-Type"] = "application/json";
    startLoading();
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    debugger;
    const code = response.data.code;
    endLoading();
    if (code != 0) {
      Notification.error({
        title: response.data.message
      });
      return Promise.reject("error");
    } else {
      return response.data;
    }
  },
  async error => {
    let code = 0;
    try {
      code = error.response.status;
    } catch (e) {
      if (error.toString().indexOf("Error: timeout") !== -1) {
        Notification.error({
          title: "网络请求超时",
          duration: 5000
        });
        return Promise.reject(error);
      }
    }
    if (code) {
      if (code === 401) {
        console.log(getRTExp());
        if (getRTExp() <= Date.now()) {
          debugger;
          MessageBox.confirm(
            "登录状态已过期，您可以继续留在该页面，或者重新登录",
            "系统提示",
            {
              confirmButtonText: "重新登录",
              cancelButtonText: "取消",
              type: "warning"
            }
          ).then(() => {
            store.dispatch("LogOut").then(() => {
              location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
          });
        } else if (!isRefreshing) {
          try {
            isRefreshing = true;
            let user = jwtDecode(getRefreshToken());
            const res = await request({
              url: "/auth/updateToken",
              method: "post",
              data: { id: user.id, username: user.username }
            });
            if (res.code === 0) {
              const data = res.result;
              setToken(data.accessToken, data.refreshToken);
              // 队列中的请求刷新成功后，再请求一次
              for (let i = 0, len = retryReqs.length; i < len; i++) {
                retryReqs[i](data.accessToken);
              }
              // 队列请求完成，清空
              retryReqs = [];
              // 返回触发 401 接口正常结果
              error.response.config.headers = {
                ...error.response.config.headers,
                Authorization: data.accessToken
              };
              return await request(error.response.config);
            }
          } catch (error) {
            console.log(error);
          } finally {
            isRefreshing = false;
          }
        } else {
          // 刷新 token 期间，将其他请求存入队列，刷新成功之后重新请求一次
          return new Promise((resolve, reject) => {
            retryReqs.push(token => {
              error.response.config.headers = {
                ...error.response.config.headers,
                Authorization: token
              };
              error.response.config.baseURL = '';
              console.log(error.response.config);
              resolve(request(error.response.config));
            });
          });
        }
      } else if (code === 403) {
        router.push({ path: "/401" });
      } else {
        const errorMsg = error.response.data.message;
        if (errorMsg !== undefined) {
          Notification.error({
            title: errorMsg,
            duration: 5000
          });
        }
      }
    } else {
      Notification.error({
        title: "接口请求失败",
        duration: 5000
      });
    }
    return Promise.reject(error);
  }
);

async function request(req) {
  return service.request(req);
}

export default service;
