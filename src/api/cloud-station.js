import { pass } from '../utils/http'

const post = pass.post('gighybridbusiness')

/** erp登录记录
 * {@link https://wiki.zhaopin.com/pages/viewpage.action?pageId=63525150}
 */
export const reportLogin = post('/cloud-station/login')

/** 上传状态
 * {@link https://wiki.zhaopin.com/pages/viewpage.action?pageId=63524601}
 */
export const reportStatus = post('/cloud-station/state')

/** 上传图片
 * {@link https://wiki.zhaopin.com/pages/viewpage.action?pageId=63524678}
 */
export const reportPictures = post('/cloud-station/saveImage')
