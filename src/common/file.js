/**
 * base64 转 file
 * @param {*} urlData
 * @param {*} filename
 * @returns
 */
export function dataURLtoFile(urlData, filename) {
  if (typeof urlData != 'string') {
    this.$toast('urlData不是字符串')
    return
  }
  let arr = urlData.split(',')
  let type = arr[0].match(/:(.*?);/)[1]
  let fileExt = type.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename + '.' + fileExt, { type })
}
