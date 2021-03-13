<template>
  <div class="workbench">
    <div class="column control">
      <p class="welcom">^_^ 你好，{{ userInfo.cnName }}</p>
      <p class="status">当前工作：{{ userInfo.jobName }}</p>
      <div class="timer" :class="{ working: workBtn }">
        <template v-if="workBtn">
          <p>已工作</p>
          <p>{{ timer }}</p>
        </template>
      </div>
      <div class="btn" @click="workBtn = !workBtn">{{ workBtnTxt }}</div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { saveRecord } from '../common/capture/saveFile'
import { useTimer } from '../common/timer'
import { getSourcesStreams } from '../common/capture/getStreams'

const userInfo = reactive(window.globalData.userInfo)

const { timer, workBtn } = useTimer()
const workBtnTxt = computed(() => (workBtn.value ? '结束办公' : '开始工作'))

const records = ref(null)
;(async function getStreams() {
  const sourceStreams = await getSourcesStreams()
  records.value = await Promise.all(
    _.map(sourceStreams, async item => {
      const record = await saveRecord(item)
      return record
    })
  )
  console.log(`[LOG] -> getStreams -> records.value`, records.value)
})()

// // 截屏
// const screenshots = () => {
//   _.forEach(records.value, record => record.screenshot())
//   if (workBtn.value) setTimeout(() => screenshots(), 5000)
// }
// watch(workBtn, () => screenshots())

// // 录屏
// watch(workBtn, () => _.forEach(records.value, record => (workBtn.value ? record.start() : record.stop())))

// 检查鼠标是否活跃
let sourceMousePos = reactive(window.ipcRenderer.sendSync('getMousePosition'))
const checkHasMove = () => {
  const targetMousePos = window.ipcRenderer.sendSync('getMousePosition')
  const hasMove = targetMousePos.x !== sourceMousePos.x || targetMousePos.y !== sourceMousePos.y
  sourceMousePos = targetMousePos
  return hasMove
}
setInterval(() => console.log(`[LOG] -> hasMove`, checkHasMove()), 60000)
</script>

<style lang="scss" scoped>
.workbench {
  padding: 0;
  margin: 0;
  height: 100vh;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #fff;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    background: transparent url(../assets/bg.png) center center/cover no-repeat;
    // filter: blur(5px) brightness(60%);
    z-index: -1;
  }

  .column {
    margin: 20px;
  }

  .control {
    display: flex;
    flex-direction: column;
    align-items: center;

    .welcom {
      font-family: FZLTZHK--GBK1-0;
      font-size: 36px;
      color: #ffffff;
      text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      margin-bottom: 26px;
    }

    .status {
      font-family: FZLTZHK--GBK1-0;
      font-size: 16px;
      color: #ffffff;
      text-shadow: 0 2px 5px rgba(0, 0, 0, 0.28);
      margin-bottom: 40px;
    }

    .timer {
      width: 270px;
      height: 270px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 70px;
      font-weight: bolder;
      background: url(../assets/clock.png) center center / contain no-repeat;
      font-family: PingFangSC-Semibold;
      font-size: 28px;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      p {
        margin: 0;
        padding: 0;
        &:first-child {
          font-family: PingFangSC-Regular;
          font-size: 16px;
        }
      }

      &.working {
        background-image: url(../assets/clock-working.png);
      }
    }
  }
  .btn {
    display: block;
    padding: 10px 20px;
    cursor: pointer;
    margin-top: 48px;
    text-decoration: none;

    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #252525;

    background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.92) 33%, #dddddd 100%);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.15);
    border-radius: 28px;
    border-radius: 28px;
  }
}
</style>
