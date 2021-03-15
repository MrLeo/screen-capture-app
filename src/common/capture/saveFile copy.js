import fs from 'fs'
import dayjs from 'dayjs'
import { ipcRenderer, shell } from 'electron'
import path from 'path'
import { ref } from 'vue'
import _ from 'lodash'

const _folder = ipcRenderer.sendSync('getPath')
const folder = path.join(_folder, 'history')
console.log(`[LOG] -> writeFile -> folder`, folder)

if (fs.existsSync(folder)) fs.rmdirSync(folder, { recursive: true })
fs.mkdirSync(folder)
// shell.showItemInFolder(folder)

const file = {
  read: () =>
    new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.onerror = err => reject(err)
      reader.onload = () => resolve({ reader, buffer: new Buffer(reader.result) })
    }),
  write: (buffer, filename) =>
    new Promise((resolve, reject) => {
      const fullpath = path.join(folder, filename)
      if (!fs.existsSync(folder)) fs.writeFile(path.join(folder, 'list.txt'), `${filename}\n`, { flag: 'a+' }, () => {})
      fs.writeFile(fullpath, buffer, { flag: 'a+' }, (err, res) => {
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

async function writeFile(filename) {
  const { reader, buffer } = await file.read()
  const { folder, fullpath } = await file.write(buffer, filename)
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
  const fileList = []
  const getFilename = () => `${source.name}_${dayjs().format('YYYYMMDD_HHmmss.SSS')}`

  await (async function() {
    return new Promise(resolve => {
      video.value = document.createElement('video')
      video.value.autoplay = true
      video.value.srcObject = source.stream
      video.value.onloadeddata = () => resolve()
    })
  })()

  const start = async () => {
    if (!recorder.value) {
      const { reader, folder, filename, fullpath } = await writeFile(`Record_${getFilename()}.mp4`)
      fileList.push({ folder, filename, fullpath })

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
    const { reader, folder, filename, fullpath } = await writeFile(`Screenshot_${getFilename()}.png`)
    fileList.push({ folder, filename, fullpath })
    const base64 = getScreenshotCanvas().toDataURL()
    new Promise(resolve => {
      getScreenshotCanvas().toBlob(blob => {
        reader.readAsArrayBuffer(blob)
        resolve(fullpath)
      }, 'image/png')
    })
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
