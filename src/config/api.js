const isElectron = window.electronAPI && window.electronAPI.isElectron;

// 开发环境：/basic-api/...
// 生产环境（Electron）：https://your-api.com/basic-api/...
export const BASE_API = isElectron 
  ? 'http://localhost:9000/basic-api'  // ← 改成你的后端域名
  : '/basic-api';

// 使用示例
export function request(url, data) {
  return uni.request({
    url: BASE_API + url,
    method: 'POST',
    data: data
  });
}
