import fs from 'fs'
import dayjs from 'dayjs'
import { ipcRenderer, shell } from 'electron'
import path from 'path'

const _folder = ipcRenderer.sendSync('getPath')
const folder = path.join(_folder, 'history')
console.log(`[LOG] -> writeFile -> folder`, folder)

if (fs.existsSync(folder)) fs.rmdirSync(folder, { recursive: true })
fs.mkdirSync(folder)
shell.showItemInFolder(folder)

function writeFile(filename) {
  const fullpath = path.join(folder, filename)
  let reader = new FileReader()
  reader.onerror = err => console.log(`[LOG] -> FileReader -> err`, err)
  reader.onload = () => {
    const buffer = new Buffer(reader.result)
    fs.writeFile(fullpath, buffer, { flag: 'a+' }, (err, res) => {
      if (err) {
        console.log(`[LOG] -> writeFile -> err, res`, err, res)
      } else {
        console.log(`[LOG] -> writeFile -> fullpath`, fullpath)
      }
    })
    fs.writeFile(path.join(folder, 'list.txt'), `${filename}\n`, { flag: 'a+' }, () => {})
  }
  return { reader, folder, filename, fullpath }
}

export function isCanvasBlank(canvas) {
  var blank = document.createElement('canvas') //系统获取一个空canvas对象
  blank.width = canvas.width
  blank.height = canvas.height
  return canvas.toDataURL() == blank.toDataURL() //比较值相等则为空
}

/**
 * 录像+截屏
 * @param {Object} source={stream,id,name}
 * @returns
 */
export function saveRecord(source) {
  console.log(`[LOG] -> saveRecord -> source`, source)

  let video // https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/readyState
  let recorder
  let videoReader
  let imageReader
  const fileList = []
  const getFilename = () => `${source.name}_${dayjs().format('YYYYMMDD_HHmmss.SSS')}`

  const init = () => {
    return new Promise(resolve => {
      video = document.createElement('video')
      video.autoplay = true
      video.srcObject = source.stream
      video.onloadeddata = () => {
        resolve(video)
      }
    })
  }
  const start = () => {
    if (!recorder) {
      const { reader, folder, filename, fullpath } = writeFile(`Record_${getFilename()}.mp4`)
      videoReader = reader
      fileList.push({ folder, filename, fullpath })

      recorder = new MediaRecorder(source.stream)
      recorder.onerror = err => console.log(`[LOG] -> MediaRecorder -> err`, err)
      recorder.ondataavailable = event => {
        let blob = new Blob([event.data], { type: event.data.type })
        videoReader.readAsArrayBuffer(blob)
      }
    }
    recorder.state !== 'recording' && recorder.start(5000)
  }
  const stop = () => recorder && recorder.stop()
  const screenshot = () =>
    new Promise(resolve => {
      const { reader, folder, filename, fullpath } = writeFile(`Screenshot_${getFilename()}.png`)
      imageReader = reader
      fileList.push({ folder, filename, fullpath })

      const { videoWidth, videoHeight } = video
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
      canvas.toBlob(blob => {
        imageReader.readAsArrayBuffer(blob)
        resolve(blob)
      }, 'image/png')
    })

  return {
    videoReader,
    imageReader,
    recorder,
    video,
    init,
    start,
    stop,
    screenshot
  }
}
