/* eslint-disable indent */
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, dialog, Tray, nativeImage, shell } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const Store = require('electron-store')
const sound = require('sound-play')
const store = new Store()

let mainWindow
let tray = null
let flashTimer = null
const isDev = process.env.NODE_ENV === 'development'

const staticPath = isDev
  ? path.join(process.cwd(), 'public')
  : path.join(process.resourcesPath, 'public')

const normalIcon = nativeImage.createFromPath(path.join(staticPath, 'icons', 'tray-icon.png'))
const emptyIcon = nativeImage.createFromPath(path.join(staticPath, 'icons', 'empty-icon.png'))

// ✅ 声音类型映射
const soundMap = {
  message: 'msg.mp3',
  newOrder: 'new-order.mp3',
  orderTimeout: 'timeout.mp3',
  call: 'call.mp3',
  warning: 'warning.mp3',
  success: 'success.mp3'
}

// ✅ 全局音频锁：防止连续播放导致声音消失
let isPlaying = false

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

  if (isDev) {
    console.log('🚀 开发环境加载本地页面')
    win.loadURL(url || 'http://localhost:3500')
    win.webContents.openDevTools()
  } else {
    win.loadURL(url || `file://${path.join(staticPath, 'dist/index.html')}`)
  }

  win.on('close', (event) => {
    event.preventDefault()
    win.hide()
  })

  return win
}

// 创建托盘
function createTray() {
  try {
    tray = new Tray(normalIcon.resize({ width: 16, height: 16 }))
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
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })
  } catch (error) {
    console.error('托盘创建失败:', error.message)
  }
}

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

// =========================
// ✅ 修复：稳定播放声音（永远不会断）
// =========================
async function playSound(type) {
  try {
    if (isPlaying) {
      setTimeout(() => playSound(type), 300)
      return
    }

    isPlaying = true
    const fileName = soundMap[type] || 'msg.mp3'
    const soundPath = path.join(staticPath, 'sounds', fileName)

    console.log('🔊 播放声音:', soundPath)
    await sound.play(soundPath)

    setTimeout(() => {
      isPlaying = false
    }, 800)
  } catch (err) {
    console.error('❌ 声音播放失败', err)
    shell.beep()
    isPlaying = false
  }
}

// 监听通知
ipcMain.on('notify', (event, type) => {
  console.log('📢 收到通知:', type)

  startFlash()
  setTimeout(stopFlash, 3000)
  playSound(type)
})

// IPC 事件
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

ipcMain.handle('set-auth-token', async(event, token) => {
  try {
    store.set('authToken', token)
    return { success: true, token }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('remove-auth-token', () => {
  try {
    store.delete('authToken')
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// 应用启动
app.whenReady().then(() => {
  mainWindow = createWindow()

  ipcMain.on('show-context-menu', (event) => {
    const template = [
      { label: '返回', click: () => mainWindow.webContents.send('nav-action', 'back') },
      { label: '前进', click: () => mainWindow.webContents.send('nav-action', 'forward') },
      { label: '刷新', click: () => mainWindow.reload() },
      { type: 'separator' },
      { label: '复制', click: () => mainWindow.webContents.copy() },
      { label: '粘贴', click: () => mainWindow.webContents.paste() },
      { type: 'separator' },
      { label: '检查', click: () => mainWindow.webContents.openDevTools() }
    ]
    const menu = Menu.buildFromTemplate(template)
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win && !win.isDestroyed()) menu.popup(win)
  })

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
  if (process.platform !== 'darwin') {
    // app.quit()
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
