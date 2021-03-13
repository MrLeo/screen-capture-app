<template>
  <router-view />
</template>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  height: 100vh;
  overflow: auto;
}
body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: transparent url(./assets/bg.png) center center/cover no-repeat;
  // filter: blur(5px) brightness(60%);
  z-index: -1;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
