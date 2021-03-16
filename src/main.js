import { createApp, reactive } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Antd, { message } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(Antd)

app.mount('#app')

window.globalData = reactive({
  userInfo: {}
})

window.ipcRenderer.on('update', (event, obj) => {
  console.log(`[LOG] -> update`, obj)
  message.info(obj.msg)
})

// #region 全局监控 JS 异常
window.onerror = function errorHandler(msg, url, lineNo, columnNo, error) {
  console.error(
    `[LOG]: window.onerror -> 捕获到异常:
  错误信息: ${msg}
  发生错误的脚本URL: ${url}
  发生错误的行号: ${lineNo}
  发生错误的列号: ${columnNo}
  Error对象: `,
    error
  )
  const string = msg.toLowerCase()
  const substring = 'script error'
  if (string.indexOf(substring) > -1) {
    // eslint-disable-next-line no-alert
    // alert('Script Error: See Browser Console for Detail')
  } else {
    const description = `Message: ${msg}
      URL: ${url}
      Line: ${lineNo}
      Column: ${columnNo}
      Error object: ${JSON.stringify(error)}`

    // notification.error({
    //   message: '出错了，请稍后重试',
    //   description
    // })
  }
  return true
}
// #endregion

// #region 全局监控静态资源异常
window.addEventListener(
  'error',
  event => {
    console.error(`[LOG]: window.addEventListener(error) -> 捕获到异常:`, event)
    return true
  },
  true
)
// #endregion

// // #region 捕获没有 Catch 的 Promise 异常
// window.addEventListener('unhandledrejection', e => {
//   e.preventDefault()
//   console.error(
//     `[LOG]: unhandledrejection -> 捕获到异常:
//   错误信息: ${e.reason}
//   Error对象: `,
//     e
//   )
//   return true
// })
// // #endregion

// // #region VUE errorHandler 和 React componentDidCatch
// Vue.config.errorHandler = (error, vm, info) => {
//   try {
//     const vmName = vm && vm.$options && vm.$options.name
//     const vmTag = vm && vm.$vnode && vm.$vnode.tag
//     // eslint-disable-next-line no-underscore-dangle
//     const vmUid = vm && vm._uid
//     const description = `[Vue渲染错误]：组件为 name: ${vmName}，tag: ${vmTag}, uid: ${vmUid}，位置为 ${info}。`
//     console.error(description)
//     if (typeof window === 'undefined' || !window.zpStat || !window.zpStat.error) return
//     window.zpStat.error(error, description) // 神策埋点
//   } catch (err) {
//     // eslint-disable-next-line no-console
//     console.error('[Vue渲染错误]处理失败')
//   }
// }
// // #endregion
