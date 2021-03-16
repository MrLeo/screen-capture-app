/* eslint-disable max-len */
/**
 * https://github.com/axios/axios
 */
import _ from 'lodash'
import { throwIfMiss } from '../error'
import { message } from 'ant-design-vue'

// #region response status: 请求已发出，但是不在2xx的范围
const statusCode = {
  404: '404,错误请求',
  401: '未授权，请重新登录',
  403: '禁止访问',
  408: '请求超时',
  500: '服务器内部错误',
  501: '功能未实现',
  502: '服务不可用',
  503: '服务不可用',
  504: '网关错误',
  510: '服务器内部错误'
}
// #endregion

const resHandler = res => {
  const errorInfo = res?.code !== 200 ? res?.message || statusCode[res?.code] : ''

  const errorHandler = {
    // 401: () => {
    //   jumpLogin()
    //   return true
    // }
  }

  if (errorHandler[res?.code]?.()) return null

  if (errorInfo) {
    throw new Error(errorInfo)
  }

  return res
}

async function send(config) {
  return resHandler(await window.ipcRenderer.invoke('http', config))
}

export const get = url => (params = {}) => send({ method: 'GET', url, params })
export const post = url => (data = {}) => send({ method: 'POST', url, data })

export const pass = (api = throwIfMiss('api @ pass.get')) => {
  return {
    get: (path = throwIfMiss('path @ pass.get')) => (params = {}) =>
      send({ method: 'GET', url: '/pass', params: { api, path, ...params } }),
    post: (path = throwIfMiss('path @ pass.post')) => (params = {}) =>
      send(_.merge({ method: 'POST', url: '/pass', data: { api, path, ...params } }))
  }
}

export const uploadFile = url => async (data = {}) => {
  try {
    return resHandler(await window.ipcRenderer.invoke('upload', data, url))
  } catch (err) {
    console.error(`[LOG] -> send -> err`, err)
    return null
  }
}

export const cookie = {
  get: async name => {
    const cookies = await window.ipcRenderer.invoke('cookies', 'get', {})
    const cookieItem = _.find(cookies, { name }) || {}
    return cookieItem.value || ''
  },
  set: async (name, value) => window.ipcRenderer.invoke('cookies', 'set', { url: 'http://zhaopin.com', name, value })
}
