import AV from 'leancloud-storage'

AV.init({
  appId: '7qjY0VDwGw02BmgMqqGfDFO0-gzGzoHsz',
  appKey: 'eYX7CBXn2T7iUGa9LAUnIt9q',
  serverURL: 'https://7qjy0vdw.lc-cn-n1-shared.com'
})

/** 保存文件
 * @wiki https://leancloud.cn/docs/leanstorage_guide-js.html#hash632374954
 * @param {*} param0
 */
export function saveLeancloud({ base64, prefix, name }) {
  return new Promise((resolve, reject) => {
    const fileData = new AV.File(`${prefix}_${name}.png`, { base64 })
    fileData.save().then(
      file => {
        window.removeEventListener('beforeunload')
        // console.log(`desktopFile 文件保存完成。objectId：${file.id}`,file);
        resolve(file)
      },
      error => {
        // console.log(`[LOG] -> file.save -> error`, error)
        reject(error)
      }
    )
  })
}

export function getLeancloud() {
  return new Promise(resolve => {
    const query = new AV.Query('_File')
    query.limit(1000)
    query.descending('createdAt')
    query.find().then(res => resolve(res))
  })
}
