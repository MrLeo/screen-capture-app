<template>
  <div class="column welcome">
    <h1>早安，沈卿仪</h1>
    <p>当前工作：兼职UI设计师</p>
  </div>
  <div class="column control">
    <p class="status">已工作</p>
    <div class="timer">{{ timer }}</div>
    <div class="btn" @click="workBtn = !workBtn">{{ workBtnTxt }}</div>
    <a class="btn btn__leave" href="./admin/">离开工作</a>
  </div>
</template>

<script>
// import _ from 'lodash'
import { /* ref, watch, */ computed } from 'vue'
import { useTimer } from '../common/timer'
// import { useCapture } from '../common/capture'
// import { saveLeancloud } from '../common/leancloud'

export default {
  setup() {
    const { timer, workBtn } = useTimer()
    const workBtnTxt = computed(() => (workBtn.value ? '休息一下' : '开始工作'))

    // const { startCapture, stopCapture, desktop, camera, canvas, drawImg, isCanvasBlank } = useCapture()
    // function saveImg() {
    //   if (!(_.get(desktop.value, 'srcObject.active') && _.get(camera.value, 'srcObject.active'))) return
    //   drawImg()
    //   const name = `${+new Date()}_${_.random(10, true)}`
    //   !isCanvasBlank(canvas.desktopCature) &&
    //     saveLeancloud({ base64: canvas.desktopCature.toDataURL(), prefix: 'desktop', name })
    //   !isCanvasBlank(canvas.cameraCature) &&
    //     saveLeancloud({ base64: canvas.cameraCature.toDataURL(), prefix: 'camera', name })
    // }

    // const captureTim = ref(null)
    // watch(workBtn, working => {
    //   if (working) {
    //     startCapture()
    //     captureTim.value = setInterval(() => saveImg, 1000)
    //   } else {
    //     clearInterval(captureTim.value)
    //     stopCapture()
    //   }
    // })

    return {
      timer,
      workBtn,
      workBtnTxt
    }
  }
}
</script>

<style lang="scss" scoped>
.control {
  display: flex;
  flex-direction: column;
  align-items: center;

  .timer {
    width: 250px;
    height: 250px;
    border-radius: 50%;
    border: 1px solid #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 70px;
    font-weight: bolder;
  }

  .status {
    font-size: 24px;
  }
}
.btn {
  display: block;
  padding: 10px 20px;
  cursor: pointer;
  border: 1px solid #fff;
  margin-top: 40px;
  text-decoration: none;
  color: #fff;

  .btn__leave {
    position: absolute;
    top: 30px;
    right: 30px;
  }
}
</style>
