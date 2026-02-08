const { contextBridge, ipcRenderer } = require('electron')

console.log('✅ preload.js 加载成功')

// 暴露安全的 Electron API
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  // 窗口控制
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  quitApp: () => ipcRenderer.send('quit-app'),
  openDevTools: () => ipcRenderer.send('open-devtools'),
  // 发送路由状态给主进程
  updateRouterState: (state) => ipcRenderer.send('router-state-update', state),
  // 监听主进程菜单命令
  onNavAction: (callback) => ipcRenderer.on('nav-action', (e, action) => callback(action)),
  // 移除监听（防止内存泄漏）
  removeNavListener: () => ipcRenderer.removeAllListeners('nav-action'),
  // Token 管理
  setToken: (token) => ipcRenderer.invoke('set-auth-token', token),
  removeToken: () => ipcRenderer.invoke('remove-auth-token'),
  // 异步获取配置
  getAppConfig: () => ipcRenderer.invoke('get-auth-config'),
   // ✅ 关键：添加 ipcRenderer！
  ipcRenderer: {
    // send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
  },
  // 统一通知接口
  notify: (type = 'message') => {
    ipcRenderer.send('notify', type)
  }
})

// 右键菜单事件处理
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    ipcRenderer.send('show-context-menu')
  })
})
