/**
 * 获取屏幕和摄像头视频流
 * @link https://www.electronjs.org/docs/api/desktop-capturer
 * @link https://www.cnblogs.com/olivers/p/12609427.html
 * @link https://github.com/skunight/desktop-recorder
 */

import { ref, isRef, reactive, toRefs, toRef } from 'vue'
import _ from 'lodash'
import fs from 'fs'
import { app, desktopCapturer } from 'electron'
import dayjs from 'dayjs'

const errorHandler = err => {
  _.forEach(
    [
      [/AbortError/, '意外终止'],
      [/InvalidStateError/, '加载失败'],
      [/NotAllowedError/, '用户拒绝授予访问屏幕区域的权限，或者不允许当前浏览实例访问屏幕共享'],
      [/NotFoundError/, '没有可用于捕获的屏幕视频源'],
      [/NotReadableError/, '无法读取: 被其他资源占用'],
      [/OverconstrainedError/, '转换错误: 视频流解析失败'],
      [/TypeError/, '类型错误'],
      [/./, '浏览器不支持webrtc']
    ],
    val => {
      if (val[0].test('' + err)) {
        alert(val[1])
        return false
      }
    }
  )
}

/**
 * 获取当前屏幕和应用窗口源信息
 * @returns sources
 */
async function getSources(types = [/* 'window', */ 'screen']) {
  try {
    const sources = reactive({})

    const _sources = await desktopCapturer.getSources({ types })
    console.log(`[LOG] -> getSources -> _sources`, _sources)

    await Promise.allSettled(
      _.map(_sources, async source => {
        console.log(`[LOG] -> source ->`, source)
        const video = document.createElement('video')

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720
            }
          }
        })

        video.srcObject = stream
        video.onloadedmetadata = () => video.play()

        sources[source.id] = { video, source }
      })
    )

    return sources
  } catch (err) {
    console.log(`[LOG] -> getSources -> error`, err)
    errorHandler(err)
  }
}

/**
 * 获取摄像头和麦克源信息
 * @returns devices
 */
async function getDevices() {
  try {
    const devices = reactive({})

    const _devices = await navigator.mediaDevices.enumerateDevices()
    console.log(`[LOG] -> getDevices -> _devices`, _devices)

    await Promise.allSettled(
      _.filter(_devices, device => device.kind === 'videoinput').map(async device => {
        console.log(`[LOG] -> device ->`, device)
        const video = document.createElement('video')

        const stream = await navigator.mediaDevices.getUserMedia({ video: device })

        video.srcObject = stream
        video.onloadedmetadata = () => video.play()

        devices[device.id] = { video, device }
      })
    )

    return devices
  } catch (err) {
    console.log(`[LOG] -> getDevices -> error`, err)
    errorHandler(err)
  }
}

/**
 * 初始化录制
 * @param {*} stream
 * @returns
 */
function createRecorder(stream) {
  let blob = ref(null)
  let recorder = ref(new MediaRecorder(stream))

  // 如果 start 没设置 timeslice，ondataavailable 在 stop 时会触发
  recorder.value.ondataavailable = event => (blob.value = new Blob([event.data], { type: 'video/mp4' }))
  recorder.value.onerror = err => console.log(`[LOG] -> MediaRecorder -> err`, err)

  recorder.value.start()

  return { blob, recorder, stop: () => recorder.value.stop() }
}

/**
 * 保存至本地 mp4 文件
 * @param {*} blob
 */
function saveMedia(blob, filename) {
  const reader = initFileReader(filename)
  reader.value.readAsArrayBuffer(blob)
}
function initFileReader(filename) {
  let reader = ref(new FileReader())
  reader.value.onload = () => {
    fs.writeFile(
      `${filename || dayjs().format('YYYY-MM-DD_HH:mm:ss')}.zpfe.mp4`,
      new Buffer(reader.value.result),
      {},
      (err, res) => console.log(`[LOG] -> fs.writeFile -> err, res`, err, res)
    )
  }
  reader.value.onerror = err => console.log(`[LOG] -> FileReader -> err`, err)
  return reader
}

export async function useMediaDevices() {
  const reader = initFileReader()
  const [sources, devices] = await Promise.all([getSources(), getDevices()])
  console.log(`[LOG] -> start -> sources, devices`, sources, devices)

  const start = async () => {
    console.log(`[LOG] -> start -> Object.keys(sources)`, Object.keys(sources))
    const stream = sources[Object.keys(sources)[0]].video.srcObject
    console.log(`[LOG] -> start -> stream`, stream)
    const desktop = createRecorder(stream)
    reader.readAsArrayBuffer(desktop.blob)
  }

  const save = (...args) => saveMedia(...args)

  console.log(`[LOG] -> useMediaDevices -> app.getPath('userData')`, app.getPath('userData'))
  return { start, save }
}

// export async function useCapture() {
//   const { sources, devices } = await useMediaDevices()

//   const desktop = sources[Object.keys(sources)[0]].video.srcObject
//   const camera = devices[Object.keys(devices)[0]].video.srcObject

//   const canvas = reactive({
//     desktopCature: document.createElement('canvas'),
//     cameraCature: document.createElement('canvas'),
//     preview: document.createElement('canvas')
//   })
//   _.forEach(canvas, val => (val.width = window.screen.width) && (val.height = window.screen.height))

//   function drawCature(name, source) {
//     const target = isRef(source) ? source.value : source
//     if (!_.get(target, 'srcObject.active')) return

//     const cvs = canvas[name]
//     const ctx = cvs.getContext('2d')

//     cvs.width = target.videoWidth
//     cvs.height = target.videoHeight

//     ctx.drawImage(target, 0, 0, cvs.width, cvs.height)

//     return ctx
//   }

//   function drawImg() {
//     drawCature('desktopCature', desktop)
//     drawCature('cameraCature', camera)

//     if (!_.get(isRef(desktop) ? desktop.value : desktop, 'srcObject.active')) return
//     const ctx = drawCature('preview', desktop)
//     if (!ctx) throw new Error('error in canvas.getContext')

//     const _camera = isRef(camera) ? camera.value : camera
//     if (!_.get(_camera, 'srcObject.active')) return

//     // 矩形摄像头
//     const cameraW = 200
//     const cameraH = cameraW / (_camera.videoWidth / _camera.videoHeight)
//     ctx.drawImage(_camera, 0, 0, cameraW, cameraH)

//     // 圆形摄像头
//     // ctx.save()
//     // const r = 200
//     // ctx.arc(r, r, r, 0, 2 * Math.PI)
//     // ctx.clip()
//     // ctx.drawImage(_camera, 0, 0, r * 2, r * 2)
//     // ctx.restore()
//   }

//   function isCanvasBlank(canvas) {
//     var blank = document.createElement('canvas') //系统获取一个空canvas对象
//     blank.width = canvas.width
//     blank.height = canvas.height
//     return canvas.toDataURL() == blank.toDataURL() //比较值相等则为空
//   }

//   return { drawImg, isCanvasBlank, ...toRefs({ canvas, desktop, camera }) }
// }
