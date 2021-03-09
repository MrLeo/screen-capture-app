import { desktopCapturer } from 'electron'
import _ from 'lodash'

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
 * @param {Array} types= ['window','screen']
 * @returns source
 */
export async function getSourcesStreams(types = [/* 'window', */ 'screen']) {
  try {
    const _sources = await desktopCapturer.getSources({ types })
    console.log(`[LOG] -> getSourcesStreams -> _sources`, _sources)
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
    return _.filter(_streams, { status: 'fulfilled' }).map(({ value }) => value)
  } catch (err) {
    console.log(`[LOG] -> getSources -> error`, err)
    errorHandler(err)
  }
}

/**
 * 获取摄像头和麦克源信息
 * @returns devices
 */
export async function getDevicesStreams() {
  try {
    const _devices = await navigator.mediaDevices.enumerateDevices()
    console.log(`[LOG] -> getDevicesStreams -> _devices`, _devices)
    const _streams = await Promise.allSettled(
      _.filter(_devices, device => device.kind === 'videoinput').map(async video => {
        const stream = await navigator.mediaDevices.getUserMedia({ video })

        // 加入麦克风音轨
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        const audioTracks = mediaStream.getAudioTracks()[0]
        stream.addTrack(audioTracks)

        return { stream, ..._.pick(video, ['deviceId', 'label']) }
      })
    )
    return _.filter(_streams, { status: 'fulfilled' }).map(({ value }) => value)
  } catch (err) {
    console.log(`[LOG] -> getDevices -> error`, err)
    errorHandler(err)
  }
}
