import axios from "axios";
import jwtDecode from "jwt-decode";
import router from "@/router/routers";
import { Notification, MessageBox, Loading } from "element-ui";
import store from "../store";
import {
  getToken,
  setToken,
  getRTExp,
  getRefreshToken
} from "@/utils/storage";
import Config from "@/settings";
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
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASEURL,
  timeout: Config.timeout // 请求超时时间
});

// request拦截器
instance.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
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
instance.interceptors.response.use(
  response => {
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
    const response = error.response;
    const config = response.config;
    let code = response.status;
    try {
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
        // 如果刷新的过期时间小于当前时间，刷新token再请求一次获取新token
        if (getRTExp() <= Date.now()) {
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
              config.baseURL = "";
              config.headers = {
                ...config.headers,
                Authorization: data.accessToken
              };
              return await request(config);
            }
          } catch (error) {
            console.log(error);
          } finally {
            isRefreshing = false;
          }
        } else {
          // 刷新 token 期间，将其他请求存入队列，刷新成功之后重新请求一次
          return new Promise((resolve, reject) => {
            config.baseURL = "";
            retryReqs.push(token => {
              config.headers = { ...config.headers, Authorization: token };
              resolve(request(config));
            });
          });
        }
      } else if (code === 403) {
        router.push({ path: "/401" });
      } else {
        const errorMsg = error.response.result.message;
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
  return instance.request(req);
}

export default instance;
