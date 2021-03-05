// https://cli.vuejs.org/zh/
// Vue.js CLI4 Vue.config.js标准配置注解 https://juejin.im/post/6844904125885317133

module.exports = {
  lintOnSave: true, // process.env.NODE_ENV !== 'production',

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },

  chainWebpack: config => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
  },

  /** Electron Builder Configuration
   *
   * {@link https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html "Vue CLI Plugin Electron Builder Configuration"}
   *
   * {@link https://www.electron.build/configuration/configuration "Electron Builder Configuration Options"}
   */
  pluginOptions: {
    electronBuilder: {
      // Node Integration
      // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
      // nodeIntegration: true,

      // chainWebpackMainProcess: (config) => {
      //   // Chain webpack config for electron main process only
      // },

      // chainWebpackRendererProcess: (config) => {
      //   // Chain webpack config for electron renderer process only
      //   // The following example will set IS_ELECTRON to true in your app
      //   config.plugin('define').tap((args) => {
      //     args[0]['IS_ELECTRON'] = true
      //     return args
      //   })
      // },

      // Use this to change the entrypoint of your app's main process
      // mainProcessFile: 'background.js',

      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      // mainProcessWatch: ['src/myFile1', 'src/myFile2'],

      // Provide a list of arguments that Electron will be launched with during "electron:serve",
      // which can be accessed from the main process (src/background.js).
      // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
      // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
      // mainProcessArgs: ['--arg-name', 'arg-value']

      // Preload Files
      // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/guide.html#preload-files
      preload: 'src/preload.js',

      builderOptions: {
        publish: ['github'],
        productName: 'Screen Capture App'
      },

      removeElectronJunk: false
    }
  }
}
