/* eslint-disable indent */
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, dialog, Tray, nativeImage,shell } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const Store = require('electron-store')
const audioPlay = require('audio-play')
const audioLoader = require('audio-loader')

const store = new Store()
let mainWindow
let tray = null
let flashTimer = null
let normalIcon = null
const isDev = process.env.NODE_ENV === 'development'

const staticPath = isDev 
? path.join(process.cwd(), 'public')           // 开发：项目根目录/public
: path.join(process.resourcesPath, 'public')   // 生产：安装目录/resources/public

// ✅ 声音类型映射（以后在这里加）
const soundMap = {
  message: 'msg.mp3',           // 普通消息
  newOrder: 'new-order.mp3',    // 新订单："您有新的订单"
  orderTimeout: 'timeout.mp3',  // 订单超时："订单即将超时"
  call: 'call.mp3',             // 语音来电
  warning: 'warning.mp3',       // 系统警告
  success: 'success.mp3'        // 操作成功
}

// 创建窗口
function createWindow(url = null, options = {}) {
  const win = new BrowserWindow({
    width: options.width || 1200,
    height: options.height || 800,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#F5F5F5',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    ...options
  })

  // 加载页面
  if (isDev) {
        console.log('🚀 ）开发环境，加载本地页面')
        win.loadURL(url || 'http://localhost:3500')
        win.webContents.openDevTools()
  } else {
    win.loadURL(url || `file://${path.join(staticPath, 'dist/index.html')}`)
  }

  // 窗口关闭时隐藏
  win.on('close', (event) => {
    event.preventDefault()
    win.hide()
  })

  return win
}

// 创建托盘
function createTray() {
  try {
    const iconPath = path.join(staticPath, 'icons','tray-icon.png')
    const icon = nativeImage.createFromPath(iconPath)
    tray = new Tray(icon.resize({ width: 16, height: 16 }))
    tray.setToolTip('商家版')
    const contextMenu = Menu.buildFromTemplate([
      {
        label: '显示',
        click: () => {
          mainWindow.show()
          mainWindow.focus()
        }
      },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
      stopFlash()
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })
  } catch (error) {
    console.error('托盘创建失败:', error.message)
  }
}

const emptyIcon = nativeImage.createFromPath(
  path.join(staticPath, 'icons','tray-icon.png')
)

// 开始闪烁
function startFlash() {
  if (flashTimer) return
  let toggle = false
  flashTimer = setInterval(() => {
    tray.setImage(toggle ? emptyIcon : normalIcon)
    toggle = !toggle
  }, 500)
}

// 停止闪烁
function stopFlash() {
  if (!flashTimer) return
  clearInterval(flashTimer)
  flashTimer = null
  tray.setImage(normalIcon)
}

// 播放声音
async function playSound(type) {
  try {
    const fileName = soundMap[type] || 'msg.mp3'
    const soundPath = path.join(staticPath, 'sounds', fileName)
    
    console.log('🎵 播放:', type, soundPath)
    const buffer = await audioLoader(soundPath)
    audioPlay(buffer, { start: 0, end: 3 }) // 最多3秒
    
  } catch (err) {
    console.log('❌ 播放失败，用系统蜂鸣:', err.message)
    shell.beep()
  }
}

// 监听通知
ipcMain.on('notify', (event, type) => {
  // 1. 托盘闪烁
  startFlash()
  setTimeout(stopFlash, 3000)
  
  // 2. 播放对应声音
  playSound(type)
})

// IPC 事件监听
ipcMain.on('window-minimize', () => mainWindow.minimize())
ipcMain.on('window-maximize', () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
})
ipcMain.on('window-close', () => mainWindow.close())
ipcMain.on('quit-app', () => app.quit())
ipcMain.on('open-devtools', (event) => {
  BrowserWindow.fromWebContents(event.sender).webContents.openDevTools()
})

// Token 管理
ipcMain.handle('get-auth-config', () => {
  return {
    apiBase: isDev ? 'http://localhost:9000' : 'https://your-api.com',
    token: store.get('authToken') || ''
  }
})

// 登录成功后设置 Token
ipcMain.handle('set-auth-token', async(event, token) => {
  try {
    console.log('📥 [main.js] 收到 set-auth-token:', token ? token.substring(0, 10) + '...' : '空')
    // 存储 Token
    store.set('authToken', token)
    // 立即验证（确保写入成功）
    const savedToken = store.get('authToken')
    const success = savedToken === token
    console.log('✅ [main.js] Token 存储验证:', success ? '成功' : '失败')
    console.log('📁 [main.js] 当前 Store 文件内容:', JSON.stringify(store.store, null, 2))
    return { success, token: savedToken }
  } catch (error) {
    console.error('❌ [main.js] Token 存储失败:', error)
    return { success: false, error: error.message }
  }
})

ipcMain.handle('remove-auth-token', () => {
  try {
    store.delete('authToken')
    // 验证是否清除成功
    const remainingToken = store.get('authToken')
    const success = remainingToken === undefined
    return { success }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// 应用生命周期
app.whenReady().then(() => {
  // 创建主窗口
  mainWindow = createWindow()

  // 修复：右键菜单报错问题
  ipcMain.on('show-context-menu', (event) => {
    console.log('🖱️ [main.js] 收到右键菜单请求')
    const template = [
      {
        label: '返回',
        click: () => {
          mainWindow.webContents.send('nav-action', 'back')
        }
      },
      {
        label: '前进',
        click: () => {
          mainWindow.webContents.send('nav-action', 'forward')
        }
      },
      { label: '刷新',
        click: () => mainWindow.reload()
      },
      { type: 'separator' },
      { label: '复制',
        click: () => mainWindow.webContents.copy()
      },
       { label: '粘贴',
        click: () => mainWindow.webContents.paste()
      },
      { type: 'separator' },
      { label: '检查',
        click: () => mainWindow.webContents.openDevTools()
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    const win = BrowserWindow.fromWebContents(event.sender)
    // 修复点：添加空值判断并使用兼容的 popup 调用
    if (win && !win.isDestroyed()) {
      // Electron 13+ 推荐用法
      menu.popup(win)
    } else {
      console.error('无法找到有效的窗口对象')
    }
  })

  // 初始化托盘
  createTray()

  globalShortcut.register('F12', () => mainWindow.webContents.openDevTools())
  globalShortcut.register('F5', () => mainWindow.reload())

  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify()
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // 有托盘时不退出
  if (process.platform !== 'darwin') {
    // app.quit()  // 注释掉，托盘保持运行
  }
})

app.on('before-quit', () => {
  globalShortcut.unregisterAll()
  mainWindow.removeAllListeners('close')
})

app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault()
    createWindow(navigationUrl, { width: 800, height: 600 })
  })
})

// 自动更新
autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: '更新提示',
    message: '新版本已下载完成，重启应用后生效',
    buttons: ['立即重启', '稍后']
  }).then(result => {
    if (result.response === 0) autoUpdater.quitAndInstall()
  })
})
