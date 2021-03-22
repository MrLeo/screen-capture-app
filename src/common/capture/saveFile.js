import fs from 'fs'
import dayjs from 'dayjs'
import { ipcRenderer, shell } from 'electron'
import path from 'path'
import { ref } from 'vue'
import _ from 'lodash'
import { sleep } from '../../utils/sleep'
import { v4 as uuid } from 'uuid'

const _folder = ipcRenderer.sendSync('getPath')
console.log(`[LOG] -> 应用数据`, _folder)
const folder = path.join(_folder, 'history')
console.log(`[LOG] -> 截屏数据`, folder)

if (fs.existsSync(folder)) fs.rmdirSync(folder, { recursive: true })
fs.mkdirSync(folder)
// shell.showItemInFolder(folder)

const file = {
  read: () =>
    new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onerror = err => reject(err)
      reader.onload = () => resolve({ buffer: new Buffer(reader.result), reader })
    }),

  write: (buffer, filename, options = { flag: 'a+' }) =>
    new Promise((resolve, reject) => {
      const fullpath = path.join(folder, filename)
      fs.writeFile(fullpath, buffer, options, (err, res) => {
        if (err) {
          console.log(`[LOG] -> writeFile -> err, res`, err, res)
          reject(err)
        } else {
          // console.log(`[LOG] -> writeFile -> fullpath`, fullpath)
          resolve({ folder, filename, fullpath })
        }
      })
    })
}

function writeFile(filename, callback = () => {}) {
  const fullpath = path.join(folder, filename)
  let reader = new FileReader()
  reader.onerror = err => console.log(`[LOG] -> FileReader -> err`, err)
  reader.onload = () => {
    const buffer = new Buffer(reader.result)
    // if (!fs.existsSync(folder)) fs.writeFile(path.join(folder, 'list.txt'), `${filename}\n`, { flag: 'a+' }, () => {})
    fs.writeFile(fullpath, buffer, { flag: 'a+' }, (err, res) => {
      if (err) {
        console.log(`[LOG] -> writeFile -> err, res`, err, res)
      } else {
        // console.log(`[LOG] -> writeFile -> fullpath`, fullpath)
        callback()
      }
    })
  }
  return { reader, folder, filename, fullpath }
}

export function isCanvasBlank(canvas) {
  var blank = document.createElement('canvas') //系统获取一个空canvas对象
  blank.width = canvas.width
  blank.height = canvas.height

  //比较值相等则为空
  if (canvas.toDataURL() == blank.toDataURL()) {
    return true
  }

  return false
}

/**
 * 录像+截屏
 * @param {Object} source={stream,id,name}
 * @returns
 */
export async function saveRecord(source) {
  // console.log(`[LOG] -> saveRecord -> source`, source)

  let video = ref(null) // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/readyState
  let recorder = ref(null)
  const getFilename = () => `${source.name}_${dayjs().format('YYMMDD_HHmmss')}_${uuid()}`

  await (async function() {
    return new Promise(resolve => {
      video.value = document.createElement('video')
      video.value.autoplay = true
      video.value.srcObject = source.stream
      video.value.onloadeddata = () => resolve()
    })
  })()

  const start = callback => {
    const { reader, folder, filename, fullpath } = writeFile(`Record_${getFilename()}.mp4`, callback)
    if (!recorder.value) {
      recorder.value = new MediaRecorder(source.stream)
      // recorder.value.setVideoSize(640, 480)
      recorder.value.onerror = err => console.log(`[LOG] -> MediaRecorder -> err`, err)
      recorder.value.ondataavailable = event => {
        let blob = new Blob([event.data], { type: event.data.type })
        reader.readAsArrayBuffer(blob)
      }
    }
    recorder.value.state !== 'recording' && recorder.value.start(5000)
  }
  const stop = () => recorder.value && recorder.value.stop()

  const getScreenshotCanvas = () => {
    const { videoWidth, videoHeight } = video.value
    const canvas = document.createElement('canvas')
    canvas.width = video.value.videoWidth
    canvas.height = video.value.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video.value, 0, 0, videoWidth, videoHeight)
    return canvas
  }
  const screenshot = async () => {
    const canvas = getScreenshotCanvas()
    await sleep(100)
    const base64 = canvas.toDataURL()
    var data = base64.replace(/^data:image\/\w+;base64,/, '')
    var buffer = new Buffer(data, 'base64')
    return await file.write(buffer, `Screenshot_${getFilename()}.png`, { flag: 'w' })
  }

  return {
    source,
    recorder,
    video,
    start,
    stop,
    screenshot,
    getScreenshotCanvas
  }
}
