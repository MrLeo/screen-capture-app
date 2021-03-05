# screen-capture-app

# To start a Development Server
If you use Yarn (opens new window)(strongly recommended):

```
yarn electron:serve
```

or if you use NPM:

```
npm run electron:serve
```
# To Build Your App

With Yarn:

```
yarn electron:build
```

or with NPM:

```
npm run electron:build
```
# 配置参考

- [Vue 3](https://v3.cn.vuejs.org/api/)
- [Vue CLI](https://cli.vuejs.org/zh/config/)
- [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html)
- [Electron](https://www.electronjs.org/docs)

# 项目相关API

- [desktopCapturer](https://www.electronjs.org/docs/api/desktop-capturer)

Many issues can be solved by re-invoking the generator of Vue CLI Plugin Electron Builder. This allows it to add newer code to your project files. You may need to do this after upgrading the plugin.

```
# In the root dir of your project
vue invoke electron-builder
```
