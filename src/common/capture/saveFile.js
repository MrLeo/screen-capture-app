import fs from 'fs'
import dayjs from 'dayjs'
import { ipcRenderer, shell } from 'electron'
import path from 'path'
import { ref } from 'vue'

const _folder = ipcRenderer.sendSync('getPath')
const folder = path.join(_folder, 'history')
console.log(`[LOG] -> writeFile -> folder`, folder)

if (fs.existsSync(folder)) fs.rmdirSync(folder, { recursive: true })
fs.mkdirSync(folder)
// shell.showItemInFolder(folder)

function writeFile(filename) {
  const fullpath = path.join(folder, filename)
  let reader = new FileReader()
  reader.onerror = err => console.log(`[LOG] -> FileReader -> err`, err)
  reader.onload = () => {
    const buffer = new Buffer(reader.result)
    if (!fs.existsSync(folder)) fs.writeFile(path.join(folder, 'list.txt'), `${filename}\n`, { flag: 'a+' }, () => {})
    fs.writeFile(fullpath, buffer, { flag: 'a+' }, (err, res) => {
      if (err) {
        console.log(`[LOG] -> writeFile -> err, res`, err, res)
      } else {
        console.log(`[LOG] -> writeFile -> fullpath`, fullpath)
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

  // const ctx = canvas.getContext('2d')

  return false
}

/**
 * 录像+截屏
 * @param {Object} source={stream,id,name}
 * @returns
 */
export function saveRecord(source) {
  console.log(`[LOG] -> saveRecord -> source`, source)

  let video = ref(null) // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/readyState
  let recorder = ref(null)
  const fileList = []
  const getFilename = () => `${source.name}_${dayjs().format('YYYYMMDD_HHmmss.SSS')}`

  const init = () => {
    return new Promise(resolve => {
      video.value = document.createElement('video')
      video.value.autoplay = true
      video.value.srcObject = source.stream
      video.value.onloadeddata = () => resolve()
    })
  }
  const start = () => {
    if (!recorder.value) {
      const { reader, folder, filename, fullpath } = writeFile(`Record_${getFilename()}.mp4`)
      fileList.push({ folder, filename, fullpath })

      recorder.value = new MediaRecorder(source.stream)
      console.log(`[LOG] -> start -> recorder.value`, recorder.value)
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
  const screenshot = () =>
    new Promise(resolve => {
      const { reader, folder, filename, fullpath } = writeFile(`Screenshot_${getFilename()}.png`)
      fileList.push({ folder, filename, fullpath })

      const { videoWidth, videoHeight } = video.value
      const canvas = document.createElement('canvas')
      canvas.width = video.value.videoWidth
      canvas.height = video.value.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video.value, 0, 0, videoWidth, videoHeight)
      canvas.toBlob(blob => {
        reader.readAsArrayBuffer(blob)
        resolve(blob)
      }, 'image/png')
    })

  return {
    source,
    recorder,
    video,
    init,
    start,
    stop,
    screenshot
  }
}
