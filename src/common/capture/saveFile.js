import fs from 'fs'
import dayjs from 'dayjs'

function writeFile(filename) {
  let reader = new FileReader()
  reader.onerror = err => console.log(`[LOG] -> FileReader -> err`, err)
  reader.onload = () => {
    const buffer = new Buffer(reader.result)
    fs.writeFile(filename, buffer, { flag: 'a+' }, (err, res) =>
      console.log(`[LOG] -> fs.writeFile -> err, res`, err, res)
    )
  }
  return reader
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
  const getFilename = () => `${source.name}_${dayjs().format('YYYYMMDD_HHmmss.SSS')}`

  const init = () => {
    return new Promise(resolve => {
      video = document.createElement('video')
      video.autoplay = true
      video.srcObject = source.stream
      video.onloadeddata = event => {
        console.log(`[LOG] -> initVideo -> event`, event)
        resolve(video)
      }
    })
  }
  const start = () => {
    if (!recorder) {
      videoReader = writeFile(`Record_${getFilename()}.mp4`)
      recorder = new MediaRecorder(source.stream)
      recorder.onerror = err => console.log(`[LOG] -> MediaRecorder -> err`, err)
      recorder.ondataavailable = event => {
        let blob = new Blob([event.data], { type: event.data.type })
        videoReader.readAsArrayBuffer(blob)
        console.log(`[LOG] -> initRecorder -> event`, event, blob)
      }
    }
    recorder.state !== 'recording' && recorder.start(5000)
  }
  const stop = () => recorder && recorder.stop()
  const screenshot = () =>
    new Promise(resolve => {
      imageReader = writeFile(`Screenshot_${getFilename()}.png`)
      const { videoWidth, videoHeight } = video
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
      canvas.toBlob(blob => {
        console.log(`[LOG] -> screenshot -> blob`, blob)
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
