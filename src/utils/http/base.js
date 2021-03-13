/**
 **************************************************************
 *                                                            *
 *   .=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-.       *
 *    |                     ______                     |      *
 *    |                  .-"      "-.                  |      *
 *    |                 /            \                 |      *
 *    |     _          |              |          _     |      *
 *    |    ( \         |,  .-.  .-.  ,|         / )    |      *
 *    |     > "=._     | )(__/  \__)( |     _.=" <     |      *
 *    |    (_/"=._"=._ |/     /\     \| _.="_.="\_)    |      *
 *    |           "=._"(_     ^^     _)"_.="           |      *
 *    |               "=\__|IIIIII|__/="               |      *
 *    |              _.="| \IIIIII/ |"=._              |      *
 *    |    _     _.="_.="\          /"=._"=._     _    |      *
 *    |   ( \_.="_.="     `--------`     "=._"=._/ )   |      *
 *    |    > _.="                            "=._ <    |      *
 *    |   (_/                                    \_)   |      *
 *    |                                                |      *
 *    '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-='      *
 *                                                            *
 *           LASCIATE OGNI SPERANZA, VOI CH'ENTRATE           *
 *                （译文：进来的人，放弃一切希望）                  *
 **************************************************************
 */

import _ from 'lodash'
import axios from 'axios' // https://github.com/axios/axios
// import qs from 'qs' // 参数工具：https://github.com/ljharb/qs
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

/**
 * Http
 * @export
 * @class Http
 */
export class Http {
  constructor(option = { headers: {} }, ctx) {
    this.ctx = ctx
    this.logger = ctx?.log || console

    this.config = _.merge(
      {
        baseURL: '',
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      },
      option
    )

    ctx && (this.config.headers.Cookie = ctx?.request?.headers?.get('cookie') || '')

    // this.config.transformRequest = [
    //   function(data, headers) {
    //     if (/x-www-form-urlencoded/.test(headers['Content-Type'])) {
    //       return qs.stringify(data) // 把一个参数对象格式化为一个字符串
    //     } else if (/form-data/.test(headers['Content-Type'])) {
    //       return data
    //     }
    //     return JSON.stringify(data)
    //   }
    // ]

    this.instance = axios.create(this.config)

    this.interceptors = { request: null, response: null } // https://github.com/axios/axios#interceptors
    this.requestUse()
    this.responseUse()
  }

  get get() {
    return this.instance.get
  }

  get post() {
    return this.instance.post
  }

  get request() {
    return this.instance.request
  }

  requestUse(onFulfilled, onRejected) {
    this.interceptors.request = this.instance.interceptors.request.use(
      config => {
        // #region URL 参数
        if (!config.params) config.params = {}
        // #endregion

        // #region post body 参数
        if (config.method.toLowerCase() === 'post') {
          if (Object.prototype.toString.call(config.data) === '[object String]') {
            config.data = JSON.parse(config.data || '{}')
          }
          config.data.innerAuthentication = Cookies.get(TOKEN_KEY)
        }
        // #endregion

        !process.browser && this.logger.info(`🔊 【请求拦截器】 -> ${config?.url}`, config)
        return onFulfilled?.() || config
      },
      error => {
        !process.browser && this.logger.info('🔊 【请求拦截器】 -> error', error)
        return onRejected?.() || error
      }
    )
  }

  responseUse(onFulfilled, onRejected) {
    this.interceptors.response = this.instance.interceptors.response.use(
      res => {
        !process.browser && this.logger.info(`🔊 【响应拦截器】 -> ${res?.config?.url}`, res)
        return onFulfilled?.() || this.resHandler(res)
      },
      res => {
        !process.browser && this.logger.info(`🔊 【响应拦截器】 -> error -> ${res?.config?.url}`, res)
        return onRejected?.() || this.resHandler(res)
      }
    )
  }

  // eslint-disable-next-line class-methods-use-this
  resHandler(res) {
    const status = res?.data?.code || res?.status || res?.response?.status || res?.request?.status
    const message = res?.data?.message || res?.message || res?.response?.message || res?.request?.message
    const errorInfo = status !== 200 ? message || statusCode[status] : ''

    const errorHandler = {
      // 401: () => {
      //   jumpLogin()
      //   return true
      // }
    }

    return errorHandler[status]?.() || (errorInfo && (Promise.reject(new Error(errorInfo)))) || res?.data || res // eslint-disable-line
    // return res?.data || (errorInfo && { code: status, data: null, message: errorInfo }) || res
  }
}
