import { uploadFile } from '../utils/http'

// export const upload = uploadFile(`${process.env.VUE_APP_PANGU}/oss/upload`)
export const upload = uploadFile(`http://jianzhi-local.zhaopin.com:8100/api/oss/upload`)
