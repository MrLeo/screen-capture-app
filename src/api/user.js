import { get, post } from '../utils/ipc'

export const getTokenByAccount = post(`/sso/login`)
export const getUserByToken = get(`/sso/get-user-by-token`)
