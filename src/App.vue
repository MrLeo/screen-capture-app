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
  background: transparent url(./assets/bg.jpeg) center center/cover no-repeat;
  -webkit-filter: blur(5px);
  -moz-filter: blur(5px);
  -ms-filter: blur(5px);
  -o-filter: blur(5px);
  filter: blur(5px);
  z-index: -1;
}
#app {
  display: flex;
  justify-content: space-around;
  padding: 100px 50px;
  color: #fff;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
