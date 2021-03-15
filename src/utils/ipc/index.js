/* eslint-disable max-len */
/**
 * https://github.com/axios/axios
 */
import _ from 'lodash'
import { throwIfMiss } from '../error'
import Cookies from 'js-cookie'
import { TOKEN_KEY } from '../../common/config'

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

  if (errorInfo) return Promise.reject(new Error(errorInfo))

  return res
}

const send = async config => resHandler(await window.ipcRenderer.invoke('http', config))

const defaultConfig = () => ({
  baseURL: '',
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  data: {
    innerAuthentication: Cookies.get(TOKEN_KEY)
  }
})

export const get = url => (params = {}) => send(_.merge({}, defaultConfig(), { method: 'GET', url, params }))
export const post = url => (data = {}) => send(_.merge({}, defaultConfig(), { method: 'POST', url, data }))

export const pass = (api = throwIfMiss('api @ pass.get')) => {
  return {
    get: (path = throwIfMiss('path @ pass.get')) => (params = {}) =>
      send(
        _.merge({}, defaultConfig(), {
          method: 'GET',
          url: '/pass',
          params: {
            api,
            path,
            ...params,
            innerAuthentication: Cookies.get(TOKEN_KEY)
          }
        })
      ),
    post: (path = throwIfMiss('path @ pass.post')) => (params = {}) =>
      send(
        _.merge({}, defaultConfig(), {
          method: 'POST',
          url: '/pass',
          data: {
            api,
            path,
            ...params,
            innerAuthentication: Cookies.get(TOKEN_KEY)
          }
        })
      )
  }
}

export const uploadFile = url => (data = {}) =>
  send(
    _.merge(
      {},
      defaultConfig(),
      { headers: { 'Content-Type': 'multipart/form-data;charset=UTF-8' } },
      { method: 'POST', url, data }
    )
  )
