import { ref, isRef, reactive, toRefs } from 'vue'
import _ from 'lodash'
const { desktopCapturer } = require('electron')

/**
 * 获取屏幕和摄像头视频流
 */
export function useMediaDevices() {
  const desktop = ref(document.createElement('video'))
  const camera = ref(document.createElement('video'))
  desktop.value.autoplay = true
  camera.value.autoplay = true

  async function capturerDesktop() {
    try {
      const sources = desktopCapturer.getSources({ types: ['window', 'screen'] })
      console.log(`[LOG] -> capturerDesktop -> sources`, sources)
      for (const source of sources) {
        if (source.name === 'Electron') {
          try {
            const stream = await navigator.mediaDevices.capturerCamera({
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
            desktop.value.srcObject = stream
          } catch (error) {
            console.log(`[LOG] -> desktopCapturer.getSources -> error`, error)
          }
          return
        }
      }
    } catch (err) {
      console.log(`[LOG] -> capturerDesktop -> err`, err)
      // _.forEach(
      //   [
      //     [/AbortError/, '屏幕共享意外终止'],
      //     [/InvalidStateError/, '屏幕共享加载失败'],
      //     [/NotAllowedError/, '用户拒绝授予访问屏幕区域的权限，或者不允许当前浏览实例访问屏幕共享'],
      //     [/NotFoundError/, '没有可用于捕获的屏幕视频源'],
      //     [/NotReadableError/, '无法读取: 屏幕共享被其他资源占用'],
      //     [/OverconstrainedError/, '转换错误: 视频流解析失败'],
      //     [/TypeError/, '类型错误'],
      //     [/./, '浏览器不支持webrtc']
      //   ],
      //   val => {
      //     if (val[0].test('' + err)) {
      //       alert(val[1])
      //       return false
      //     }
      //   }
      // )
    }
  }

  async function capturerCamera() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      console.log(`[LOG] -> capturerCamera -> devices`, devices)

      // .then(devices => devices.filter(d => d.kind === 'videoinput'))
      // .then(devices => console.log(devices) // devices 为摄像头数组);

      //     const captureStream = await navigator.mediaDevices.capturerCamera({
      //       audio: false,
      //       video: { width: 1280, height: 720 }
      //     })
      //     camera.value.srcObject = captureStream
      //     console.log(`[LOG] -> capturerCamera ->`, captureStream, camera)
      //     captureStream.addEventListener('removetrack', event => {
      //       console.log(`${event.track.kind} track removed`)
      //     })
      //     captureStream.onremovetrack = () => console.log('capturerCamera onremovetrack')
      //     captureStream.onaddtrack = () => console.log('capturerCamera onaddtrack')
      //     captureStream.onactive = () => console.log('capturerCamera onactive')
      //     captureStream.oninactive = () => console.log('capturerCamera oninactive')
    } catch (err) {
      console.log(`[LOG] -> capturerCamera -> err`, err)
    }
  }

  function stopCapture(source) {
    console.log(`[LOG] -> stopCapture -> source`, source)
    try {
      // const target = isRef(source) ? source.value : source
      // const desktopSrcObject = target && target.srcObject
      // if (desktopSrcObject && 'getTracks' in desktopSrcObject) {
      //   const tracks = desktopSrcObject.getTracks()
      //   tracks.forEach(track => track.stop())
      //   target.srcObject = null
      // }
    } catch (err) {
      console.error(`[error] -> stopCapture -> `, err)
    }
  }

  function startCapture() {
    if (!desktop.value.srcObject) capturerDesktop()
    if (!camera.value.srcObject) capturerCamera()
  }

  return {
    desktop,
    camera,
    stopCapture,
    startCapture
  }
}

export function useCapture() {
  const { desktop, camera, stopCapture, startCapture } = useMediaDevices()

  const canvas = reactive({
    desktopCature: document.createElement('canvas'),
    cameraCature: document.createElement('canvas'),
    preview: document.createElement('canvas')
  })
  _.forEach(canvas, val => (val.width = window.screen.width) && (val.height = window.screen.height))

  function drawCature(name, source) {
    const target = isRef(source) ? source.value : source
    if (!_.get(target, 'srcObject.active')) return

    const cvs = canvas[name]
    const ctx = cvs.getContext('2d')

    cvs.width = target.videoWidth
    cvs.height = target.videoHeight

    ctx.drawImage(target, 0, 0, cvs.width, cvs.height)

    return ctx
  }

  function drawImg() {
    drawCature('desktopCature', desktop)
    drawCature('cameraCature', camera)

    if (!_.get(desktop, 'value.srcObject.active')) return
    const ctx = drawCature('preview', desktop)
    if (!ctx) throw new Error('error in canvas.getContext')

    if (!_.get(camera, 'value.srcObject.active')) return
    // 矩形摄像头
    const cameraW = 200
    const cameraH = cameraW / (camera.value.videoWidth / camera.value.videoHeight)
    ctx.drawImage(camera.value, 0, 0, cameraW, cameraH)

    // 圆形摄像头
    // ctx.save()
    // const r = 200
    // ctx.arc(r, r, r, 0, 2 * Math.PI)
    // ctx.clip()
    // ctx.drawImage(camera.value, 0, 0, r * 2, r * 2)
    // ctx.restore()
  }

  function isCanvasBlank(canvas) {
    var blank = document.createElement('canvas') //系统获取一个空canvas对象
    blank.width = canvas.width
    blank.height = canvas.height
    return canvas.toDataURL() == blank.toDataURL() //比较值相等则为空
  }

  return { stopCapture, startCapture, drawImg, isCanvasBlank, ...toRefs({ canvas, desktop, camera }) }
}
