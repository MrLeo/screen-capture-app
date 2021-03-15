'use strict'

/* global __static */
import path from 'path'
import { app, ipcMain, protocol, BrowserWindow, shell, crashReporter, screen } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { autoUpdater } from 'electron-updater'
import * as Sentry from '@sentry/electron' // 崩溃报告
import axios from 'axios'

const isDevelopment = process.env.NODE_ENV !== 'production'

process.on('unhandledRejection', error => {
  console.log(`[LOG]: unhandledRejection`, error)
})

// 报告常规错误
Sentry.init({ dsn: 'https://053cb408cd62410db3d631aac50e9522@o452378.ingest.sentry.io/5439637' })
// 报告系统错误
crashReporter.start({
  companyName: 'ztc',
  productName: 'inno-tools',
  // ignoreSystemCrashHandler: true,
  submitURL: 'https://053cb408cd62410db3d631aac50e9522@o452378.ingest.sentry.io/5439637'
})

// https://github.com/megahertz/electron-log
const log = require('electron-log')
log.transports.file.level = 'silly'
log.transports.console.level = 'silly'
Object.assign(console, log.functions)

app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.showExitPrompt = true

// --- CONTEXT MENU -----
const contextMenu = require('electron-context-menu')
contextMenu({
  // eslint-disable-next-line no-unused-vars
  prepend: (defaultActions, params, browserWindow) => [
    {
      label: 'Rainbow',
      // Only show it when right-clicking images
      visible: params.mediaType === 'image'
    },
    {
      label: 'Search Google for “{selection}”',
      // Only show it when right-clicking text
      visible: params.selectionText.trim().length > 0,
      click: () => {
        shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`)
      }
    }
  ]
})

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      webSecurity: false // 禁用同源策略
    },
    icon: path.join(__static, 'icon.png') // 应用图标
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')

    autoUpdater.checkForUpdatesAndNotify()
  }

  // win.on('close', e => {
  //   console.log(`[LOG]: createWindow -> close`)
  //   dialog.showMessageBox(
  //     {
  //       defaultId: 0,
  //       type: 'info',
  //       buttons: ['取消', '最小化', '直接退出'],
  //       title: 'Confirm',
  //       message: '确定要关闭吗？'
  //     },
  //     index => {
  //       if (index === 0) {
  //         e.preventDefault() //阻止默认行为，一定要有
  //       } else if (index === 1) {
  //         e.preventDefault() //阻止默认行为，一定要有
  //         win.minimize() //调用 最小化实例方法
  //       } else {
  //         win = null
  //         //app.quit();	//不要用quit();试了会弹两次
  //         app.exit(0) //exit()直接关闭客户端，不会执行quit();
  //       }
  //       // if (response===0) {
  //       //   if (win.isDestroyed()) {
  //       //     app.relaunch()
  //       //     app.exit(0)
  //       //   } else {
  //       //     BrowserWindow.getAllWindows().forEach(w => {
  //       //       if (w.id !== win.id) w.destroy()
  //       //     })
  //       //     win.reload()
  //       //   }
  //       // } else {
  //       //   app.quit()
  //       // }
  //     }
  //   )
  // })

  // win.on('closed', () => {
  //   console.log(`[LOG]: createWindow -> closed`)
  //   win = null
  // })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      // Install Vue Devtools
      // await installExtension(VUEJS_DEVTOOLS)
      await installExtension('ljjemllljcmogpfapbkkighbhhppjdbg')
      console.log(`[LOG]: VUEJS_DEVTOOLS`, VUEJS_DEVTOOLS, '\n开发版: ljjemllljcmogpfapbkkighbhhppjdbg' ) // eslint-disable-line prettier/prettier
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  initIpc()
  createWindow()
})

function initIpc() {
  ipcMain.on('set_proxy', (event, { http_proxy }) => {
    console.log(`[LOG]: initIpc -> set_proxy`, http_proxy)
    win.webContents.session.setProxy({ proxyRules: http_proxy }, () => console.log(`[LOG]: initIpc -> 代理设置完毕`))
  })

  ipcMain.on('getPath', (event, name = 'userData') => (event.returnValue = app.getPath(name)))
  ipcMain.on('getMousePosition', event => (event.returnValue = screen.getCursorScreenPoint()))

  ipcMain.handle('http', async (event, config) => {
    try {
      const { data: result } = await axios(config)
      console.log(`[LOG] -> ipcMain.http -> result`, result)
      return safeData(result)
    } catch (err) {
      console.error(`[LOG] -> ipcMain.http -> error`, err)
      throw new Error(err)
    }
  })
}

// 数据中可能存在函数，ipc 传输时报错，进行一定的处理
// https://github.com/electron/electron/pull/20214
function safeData(data) {
  if (typeof data === 'object') {
    return JSON.parse(JSON.stringify(data))
  }
  return data
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
