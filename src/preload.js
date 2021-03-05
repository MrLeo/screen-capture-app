import { ipcRenderer, remote } from 'electron'

// https://github.com/megahertz/electron-log
const log = require('electron-log')
log.transports.file.level = 'silly'
log.transports.console.level = 'silly'
// Object.assign(console, log.functions)

window.ipcRenderer = ipcRenderer
window.remote = remote
window.console.log = log.log
window.console.info = log.info
window.console.error = log.error
