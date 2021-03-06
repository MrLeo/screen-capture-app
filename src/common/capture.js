/**
 * 获取屏幕和摄像头视频流
 * @link https://www.electronjs.org/docs/api/desktop-capturer
 * @link https://www.cnblogs.com/olivers/p/12609427.html
 * @link https://github.com/skunight/desktop-recorder
 * @link https://cloud.tencent.com/developer/article/1524041
 */

import { ref, isRef, reactive, toRefs, toRef } from 'vue'
import _ from 'lodash'
import fs from 'fs'
import { desktopCapturer } from 'electron'
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
    const _sources = await desktopCapturer.getSources({ types })
    console.log(`[LOG] -> getSources -> _sources`, _sources)

    const _streams = await Promise.allSettled(
      _.map(_sources, async source => {
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

        return { stream, ..._.pick(source, ['id', 'name']) }
      })
    )
    console.log(`[LOG] -> getSources -> _streams`, _streams)

    return _.filter(_streams, stream => stream.status === 'fulfilled').map(({ value }) => value)
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
    const _devices = await navigator.mediaDevices.enumerateDevices()
    console.log(`[LOG] -> getDevices -> _devices ->`, _devices)

    const _streams = await Promise.allSettled(
      _.filter(_devices, device => device.kind === 'videoinput').map(async video => {
        const stream = await navigator.mediaDevices.getUserMedia({ video })

        // 加入麦克风音轨
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        const audioTracks = mediaStream.getAudioTracks()[0]
        stream.addTrack(audioTracks)

        return { stream, ..._.pick(video, ['id', 'name']) }
      })
    )

    return _.filter(_streams, stream => stream.status === 'fulfilled').map(({ value }) => value)
  } catch (err) {
    console.log(`[LOG] -> getDevices -> error`, err)
    errorHandler(err)
  }
}

export async function useRecord() {
  const sources = await getSources()
  console.log(`[LOG] -> useRecord -> sources`, sources)

  const source = sources[0]

  const name = dayjs().format('YYYYMMDD_HHmmss')

  let reader = new FileReader()
  reader.onerror = err => console.log(`[LOG] -> FileReader -> err`, err)
  reader.onload = () => {
    const filename = `${name}_${source.name}.zpfe.mp4`
    const buffer = new Buffer(reader.result)
    fs.writeFile(filename, buffer, { flag: 'a+' }, (err, res) =>
      console.log(`[LOG] -> useRecord -> fs.writeFile -> err, res`, err, res)
    )
  }

  const recorder = new MediaRecorder(source.stream)
  recorder.onerror = err => console.log(`[LOG] -> MediaRecorder -> err`, err)
  recorder.ondataavailable = event => {
    console.log(`[LOG] -> useRecord -> event`, event)
    let blob = new Blob([event.data], { type: event.data.type })
    reader.readAsArrayBuffer(blob)
  }
  recorder.start(5000)

  return { sources, recorder }
}

export async function useScreenshot() {
  const sources = await getSources()
  console.log(`[LOG] -> useScreenshot -> sources`, sources)

  const source = sources[0]

  const reader = new FileReader()
  reader.onerror = err => console.log(`[LOG] -> FileReader -> err`, err)
  reader.onload = () => {
    const name = dayjs().format('YYYYMMDD_HHmmss')
    const filename = `${name}_${source.name}.zpfe.png`
    const buffer = new Buffer(reader.result)
    fs.writeFile(filename, buffer, {}, (err, res) =>
      console.log(`[LOG] -> useScreenshot -> fs.writeFile -> err, res`, err, res)
    )
  }

  const video = document.createElement('video')
  video.srcObject = source.stream
  video.autoplay = true
  video.onloadedmetadata = () => video.play()

  const { videoWidth, videoHeight } = video
  const canvas = document.createElement('canvas')
  canvas.width = videoWidth
  canvas.height = videoHeight
  const ctx = canvas.getContext('2d')
  setInterval(() => {
    ctx.drawImage(video, 0, 0, videoWidth, videoHeight)
    canvas.toBlob(blob => reader.readAsArrayBuffer(blob), 'image/png')
  }, 2000)

  return { sources, video }
}
