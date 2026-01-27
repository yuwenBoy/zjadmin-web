const { app, BrowserWindow, Menu, globalShortcut, ipcMain, dialog, Tray, nativeImage } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
console.log('🔍 preload 绝对路径:', path.join(__dirname, 'preload.js'))
let mainWindow
let tray // 托盘示例

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frames: false, // 隐藏默认窗口边框，自定义标题栏
    titleBarStyle: 'hidden', // 隐藏默认标题栏
    backgroundColor: '#F5F5F5', // 背景色
    // icon: path.join(__dirname, 'icon.png'), // 应用图标
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // 确保加载 preload
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: [
        `--api-base=${process.env.NODE_ENV === 'development'
          ? 'http://localhost:9000'
          : 'https://your-api.com'}`] // 生成环境接口地址修改
    }
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3500')
    // 开发环境自动打开开发者工具
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile('dist/index.html')
  }
  // 窗口关闭时不退出应用，而是隐藏到托盘
  mainWindow.on('close', (event) => {
    event.preventDefault() // 阻止默认关闭行为
    mainWindow.hide() // 隐藏窗口
  })
}

function createTray() {
  // 加载托盘图标
  const iconPath = path.join(__dirname, 'src/assets/tray-icon.png')
  const icon = nativeImage.createFromPath(iconPath)
  // 创建托盘
  tray = new Tray(icon.resize({ width: 16, height: 16 }))
  // 设置托盘提示文字
  tray.setToolTip('商家管理端')
  // 创建托盘右键菜单
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        mainWindow.show()
        mainWindow.focus()
      }
    },
    {
      label: '退出应用',
      click: () => {
        app.quit() // 真正退出
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  // 点击托盘图标显示/隐藏窗口
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
}

// 监听窗口控制事件
ipcMain.on('window-minimize', () => {
  mainWindow.minimize()
})

ipcMain.on('window-maximize', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.on('window-close', () => {
  mainWindow.close()
})

ipcMain.on('quit-app', () => {
  app.quit() // 真正应用退出
})

// 注册全局快捷键
app.whenReady().then(() => {
//   createWindow()

})

// 处理打开开发者工具的 IPC
ipcMain.on('open-devtools', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  win.webContents.openDevTools()
})

app.on('window-all-closed', (event) => {
//   if (process.platform !== 'darwin') app.quit()
  event.preventDefault()
})

// 注册自动更新事件监听
app.on('ready', () => {
  // 注册窗口创建事件
  createWindow()
  // 注册托盘
  createTray()
  // 仅生产环境检查更新
  if (process.env.NODE_ENV !== 'development') {
    autoUpdater.checkForUpdatesAndNotify() // 自动检查并提示
  }
  // F12 打开开发者工具
  globalShortcut.register('F12', () => {
    mainWindow.webContents.openDevTools()
  })

  // F5 刷新页面
  globalShortcut.register('F5', () => {
    mainWindow.reload()
  })

  // 处理来自渲染进程的右键菜单请求
  ipcMain.on('show-context-menu', (event) => {
    const template = [
      {
        label: '刷新',
        click: () => { mainWindow.reload() }
      },
      {
        label: '开发者工具',
        click: () => { mainWindow.webContents.openDevTools() }
      },
      { type: 'separator' },
      {
        label: '退出',
        click: () => { app.quit() }
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    menu.popup(BrowserWindow.fromWebContents(event.sender))
  })
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: '更新提示',
    message: '新版本已下载完成，重启应用后生效',
    buttons: ['立即重启', '稍后']
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})
