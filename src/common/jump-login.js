export const zpsso = 'https://zpsso.zhaopin.com'

export default function jumpLogin() {
  const bkUrl = encodeURIComponent(window.location?.href)
  const redirectUrl = `${zpsso}/login?service=${encodeURIComponent(bkUrl)}`
  window.location.href = redirectUrl
}
