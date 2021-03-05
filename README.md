# screen-capture-app

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

# 配置参考

- [Vue 3](https://v3.cn.vuejs.org/api/)
- [Vue CLI](https://cli.vuejs.org/zh/config/)
- [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html)
- [Electron](https://www.electronjs.org/docs)

# 项目相关API

- [desktopCapturer](https://www.electronjs.org/docs/api/desktop-capturer)

# 参考链接

- [Electron](https://www.electronjs.org/docs)
- [Vue CLI](https://cli.vuejs.org/zh/guide/)
- [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/)
- [Vue 3](https://v3.vuejs.org) / ~~[Vue.js](https://cn.vuejs.org)~~
- [Composition API RFC](https://composition-api.vuejs.org/api.html)
- [&lt;script setup&gt;：在 SFC 内使用 Composition API 的语法糖](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md)
- [&lt;style vars&gt;：在 SFC 中支持将状态作为 CSS 变量注入到样式中](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-style-variables.md)
- ~~[Vue-devtools](https://github.com/vuejs/vue-devtools)~~ / [Vue-devtools-beta](https://chrome.google.com/webstore/detail/ljjemllljcmogpfapbkkighbhhppjdbg)
- ~~[Vue Router](https://router.vuejs.org/zh/)~~
- ~~[Vuex](https://vuex.vuejs.org/zh/)~~
- [Awesome Vue.js](https://github.com/vuejs/awesome-vue)
- [Vue Curated](https://curated.vuejs.org)
- [Ant Design 2](https://2x.antdv.com/docs/vue/introduce-cn/) / [Support Vue 3 from 2.0.0-beta.2](https://github.com/vueComponent/ant-design-vue/issues/1913) / ~~[Ant Design](https://www.antdv.com/docs/vue/introduce-cn/)~~
- [Vue3+ & Vue-CLI3+ 开发生态圈资讯](https://github.com/vue3/vue3-News#目录)
- [Vue3新特性](https://juejin.im/post/6844904084512718861)
- [LightProxy](https://lightproxy.org/)
- [Electron API 演示](https://github.com/demopark/electron-api-demos-Zh_CN)
- [手把手教你使用Electron5+vue-cli3开发跨平台桌面应用](https://juejin.im/post/6844903878429769742)
- [electron-vue](https://simulatedgreg.gitbooks.io/electron-vue/content/cn/)
- [electron-log: 为Electron程序添加运行时日志](https://newsn.net/say/electron-log.html)
- [Monaco Editor: VSCode 编辑器](https://microsoft.github.io/monaco-editor/)
- [electron写一个简单host切换工具](https://juejin.im/post/6844903670924967949)
- [whistle: HTTP, HTTP2, HTTPS, Websocket debugging proxy](https://github.com/avwo/whistle)
- [LAN Settings: 设置操作系统局域网配置](https://github.com/imweb/lan-settings)
- [nohost的PC客户端，帮助PC用户设置nohost环境，安装后打开即可接入nohost](https://github.com/nohosts/client)
- [一个项目push到多个远程Git仓库](https://segmentfault.com/a/1190000011294144)
- [如何用Vue开发Electron桌面程序 - Vue CLI Plugin Electron Builder](https://juejin.cn/post/6913829610748641287)

![Vue3-CheatSheet02](https://raw.githubusercontent.com/vue3/vue3-News/master/asset/Vue3-CheatSheet02.jpeg)
