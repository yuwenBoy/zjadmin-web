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
  // Token 管理
  setToken: (token) => ipcRenderer.invoke('set-auth-token', token),
  removeToken: () => ipcRenderer.invoke('remove-auth-token'),
  // 异步获取配置
  getAppConfig: () => ipcRenderer.invoke('get-auth-config')
})

// 右键菜单事件处理
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    ipcRenderer.send('show-context-menu')
  })
})
