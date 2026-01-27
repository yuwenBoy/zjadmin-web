// 项目根目录创建，内容先留空即可
// 后续如需调用系统API（如文件读写）再配置
const { contextBridge, ipcRenderer } = require('electron')

// 直接暴露，不要等待 DOMContentLoaded
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  openDevTools: () => ipcRenderer.send('open-devtools'),
  apiBase: process.argv.find(arg => arg.startsWith('--api-base')).split('=')[1],
  // 窗口控制 API
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  quitApp: () => ipcRenderer.send('quit-app')
})

// 右键菜单逻辑保留
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    ipcRenderer.send('show-context-menu')
  })
})

