# [screen-capture-app](https://github.com/MrLeo/screen-capture-app/releases)

[![release-build](https://github.com/MrLeo/screen-capture-app/actions/workflows/main.yml/badge.svg)](https://github.com/MrLeo/screen-capture-app/actions/workflows/main.yml) / [![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/MrLeo/screen-capture-app?include_prereleases)](https://api.github.com/repos/MrLeo/screen-capture-app/releases/latest) / [![GitHub all releases](https://img.shields.io/github/downloads/MrLeo/screen-capture-app/total)](https://github.com/MrLeo/screen-capture-app/releases)

# 添加远程仓库

```bash
# 添加远程仓库
git remote rm origin
git remote set-url --add origin https://github.com/MrLeo/screen-capture-app.git
git remote set-url --add origin https://gitlab.dev.zhaopin.com/innovation/screen-capture-app.git

git remote add github https://github.com/MrLeo/screen-capture-app.git
git remote add zhaopin https://gitlab.dev.zhaopin.com/innovation/screen-capture-app.git

# 查看远程仓库情况 (.git/config)
git remote -v
```

经以上步骤添加完远程仓库会在`.git/config`看到如下配置示例

```yaml
[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
  logallrefupdates = true
  ignorecase = true
  precomposeunicode = true
[remote "origin"]
  fetch = +refs/heads/*:refs/remotes/origin/*
  url = https://github.com/MrLeo/screen-capture-app.git
  url = https://gitlab.dev.zhaopin.com/innovation/screen-capture-app.git
[branch "master"]
  remote = github
  merge = refs/heads/master
[remote "github"]
  url = https://github.com/MrLeo/screen-capture-app.git
  fetch = +refs/heads/*:refs/remotes/github/*
[remote "zhaopin"]
  fetch = +refs/heads/*:refs/remotes/zhaopin/*
  url = https://gitlab.dev.zhaopin.com/innovation/screen-capture-app.git
```

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

Many issues can be solved by re-invoking the generator of Vue CLI Plugin Electron Builder. This allows it to add newer code to your project files. You may need to do this after upgrading the plugin.

```
# In the root dir of your project
vue invoke electron-builder
```

## Set NPM Version

[npm-version](https://docs.npmjs.com/cli/version.html)

```shell
npm version major|minor|patch
```

## GitHub Personal Access Token


```shell
# On Linux/MacOS:
export GH_TOKEN=TOKEN-GOES-HERE

# On Windows:
set GH_TOKEN=TOKEN-GOES-HERE
```

## Upload Release to GitHub

```shell
# With Yarn:
yarn electron:build -mwl -p always

# or with NPM:
npm run electron:build -- -mwl -p always
```

<div style="display:none"><span>99535869a43f5a9eed</span></div>
<div style="display:none"><span>197d3ab40a459d1d4e8df5</span></div>

# 日志位置

```
~/Library/Logs/screen-capture-app

%USERPROFILE%\AppData\Roaming\screen-capture-app\logs
```
# 其他参考链接

- [解决Github访问速度慢以及图片加载慢的问题](https://segmentfault.com/a/1190000039694021) / [GitHub Hosts](https://github.com/521xueweihan/GitHub520)
- [Electron](https://www.electronjs.org/docs)
- [Vue CLI](https://cli.vuejs.org/zh/guide/)
- [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/)
- [Auto Update](https://www.electron.build/auto-update) / [Electron自动更新](https://wangdaodao.com/20210204/electron-updater.html) / [electron-release-server](https://github.com/ArekSredzki/electron-release-server)


- [Vue 3](https://v3.vuejs.org) / ~~[Vue.js](https://cn.vuejs.org)~~
  - [Composition API RFC](https://composition-api.vuejs.org/api.html)
  - [&lt;script setup&gt;：在 SFC 内使用 Composition API 的语法糖](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md)
  - [&lt;style vars&gt;：在 SFC 中支持将状态作为 CSS 变量注入到样式中](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-style-variables.md)
- [Vue-devtools-beta](https://chrome.google.com/webstore/detail/ljjemllljcmogpfapbkkighbhhppjdbg) / ~~[Vue-devtools](https://github.com/vuejs/vue-devtools)~~
- [Next Vue Router](https://next.router.vuejs.org/) / ~~[Vue Router](https://router.vuejs.org/zh/)~~
- [Next Vuex](https://next.vuex.vuejs.org/) / ~~[Vuex](https://vuex.vuejs.org/zh/)~~

- [Awesome Vue.js](https://github.com/vuejs/awesome-vue)
- [Vue Curated](https://curated.vuejs.org)
- [Ant Design 2](https://2x.antdv.com/docs/vue/introduce-cn/) / ~~[Ant Design](https://www.antdv.com/docs/vue/introduce-cn/)~~


- [Vue3+ & Vue-CLI3+ 开发生态圈资讯](https://github.com/vue3/vue3-News#目录)
- [Vue3新特性](https://juejin.im/post/6844904084512718861)
- [Electron API 演示](https://github.com/demopark/electron-api-demos-Zh_CN)
- [一个项目push到多个远程Git仓库](https://segmentfault.com/a/1190000011294144)
- [手把手教你使用Electron5+vue-cli3开发跨平台桌面应用](https://juejin.im/post/6844903878429769742)
- [electron-vue](https://simulatedgreg.gitbooks.io/electron-vue/content/cn/)
- [electron-log: 为Electron程序添加运行时日志](https://newsn.net/say/electron-log.html)
- [Monaco Editor: VSCode 编辑器](https://microsoft.github.io/monaco-editor/)
- [electron写一个简单host切换工具](https://juejin.im/post/6844903670924967949)
- [LightProxy](https://lightproxy.org/)
- [whistle: HTTP, HTTP2, HTTPS, Websocket debugging proxy](https://github.com/avwo/whistle)
- [LAN Settings: 设置操作系统局域网配置](https://github.com/imweb/lan-settings)
- [nohost的PC客户端，帮助PC用户设置nohost环境，安装后打开即可接入nohost](https://github.com/nohosts/client)
- [如何用Vue开发Electron桌面程序 - Vue CLI Plugin Electron Builder](https://juejin.cn/post/6913829610748641287)
- [desktopCapturer](https://www.electronjs.org/docs/api/desktop-capturer) / [如何使用 electron 屏幕或摄像头录制并保存到本地](https://www.cnblogs.com/olivers/p/12609427.html) / [Desktop Recorder - A dead simple cross platform desktop recorder.](https://github.com/skunight/desktop-recorder) / [screenshot-desktop](https://www.npmjs.com/package/screenshot-desktop)


- [axios](https://github.com/axios/axios)
- [robotjs - 操作鼠标和键盘](https://github.com/octalmage/robotjs)
- [iohook - 监听鼠标和键盘事件](https://github.com/wilix-team/iohook)
- [node-ffi - 调用系统API](https://github.com/node-ffi/node-ffi)
- [Node.js 实现远程桌面监控的方法步骤](https://www.zhangshengrong.com/p/9Oab7Vp3Nd/)

![Vue3-CheatSheet02](https://raw.githubusercontent.com/vue3/vue3-News/master/asset/Vue3-CheatSheet02.jpeg)
