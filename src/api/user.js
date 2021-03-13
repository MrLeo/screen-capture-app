import { get, post } from '../utils/http'

export const getTokenByAccount = post(`${process.env.VUE_APP_PANGU}/sso/login`)
export const getUserByToken = get(`${process.env.VUE_APP_PANGU}/sso/get-user-by-token`)
