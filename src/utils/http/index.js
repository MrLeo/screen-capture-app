/* eslint-disable max-len */
/**
 * https://github.com/axios/axios
 */
import _ from 'lodash'
import { throwIfMiss } from '../error'
import Cookies from 'js-cookie'
import { Http } from './base'
import { TOKEN_KEY } from '../../common/config'

export const http = ctx => new Http({ baseURL: `` }, ctx)
export const get = url => (params = {}, ctx) => http(ctx).request(_.merge({ method: 'GET', url, params }))
export const post = url => (data = {}, ctx) => http(ctx).request(_.merge({ method: 'POST', url, data }))

export const pass = {
  get: (api = throwIfMiss('api @ pass.get')) => (path = throwIfMiss('path @ pass.get')) => (params = {}, ctx) =>
    http(ctx).request(
      _.merge({
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
  post: (api = throwIfMiss('api @ pass.post')) => (path = throwIfMiss('path @ pass.post')) => (params = {}, ctx) =>
    http(ctx).request(
      _.merge({
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
