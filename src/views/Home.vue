<template>
  <div class="workbench">
    <div class="column control">
      <p class="welcom">^_^ 你好，{{ userInfo.cnName }}</p>
      <p class="status">当前工作：{{ userInfo.jobName }}</p>
      <div class="timer" :class="{ working: working }">
        <div v-if="workRest" class="rest">
          <h1 class="c-red">休息中</h1>
          <p>休息状态将影响你的活跃度</p>
          <p>请合理安排时间</p>
        </div>
        <template v-else-if="working">
          <p>已工作</p>
          <p>{{ timer }}</p>
        </template>
      </div>
      <div v-if="working" class="btns">
        <div class="btn" :class="[workRest ? 'start' : 'rest']" @click="workRest = !workRest">&nbsp;</div>
        <div class="btn end" @click="workFinish = !workFinish">&nbsp;</div>
      </div>
      <div v-else class="btn start" @click="working = !working">&nbsp;</div>
    </div>
  </div>
  <FinishWorkAlert v-if="workFinish"></FinishWorkAlert>
</template>

<script setup>
import _ from 'lodash'
import dayjs from 'dayjs'
import { ref, reactive, watch } from 'vue'
import { saveRecord } from '../common/capture/saveFile'
import { useTimer } from '../common/timer'
import { getSourcesStreams } from '../common/capture/getStreams'
import { dataURLtoFile } from '../common/file'
import FinishWorkAlert from './components/FinishWorkAlert.vue'
import { upload } from '../api/file'
import { reportStatus, reportPictures } from '../api/cloud-station'

const userInfo = reactive(window.globalData.userInfo)

const working = ref(false) // 开始工作
const workRest = ref(false) // 休息一下
const workFinish = ref(false) // 结束办公

const { timing, timer, totalSecondsHistory, startDate, nowDate } = useTimer()

// // 到第二天自动结束计时
// watch(nowDate, now => {
//   const startDay = startDate.value.getDate()
//   const nowDay = now.getDate()
//   if (startDay !== nowDay) timing.value = false
// })

// 初始化屏幕信息
const records = ref(null)
;(async function getStreams() {
  try {
    const sourceStreams = await getSourcesStreams()
    records.value = await Promise.all(
      _.map(sourceStreams, async item => {
        const record = await saveRecord(item)
        return record
      })
    )
    console.log(`[LOG] -> getStreams -> records.value`, records.value)
  } catch (err) {
    console.error(`[LOG] getStreams -> err`, err)
  }
})()

// 录屏
// watch(timing, () => _.forEach(records.value, record => (timing.value ? record.start() : record.stop())))

// 截屏
const screenshots = async () => {
  if (!timing.value) return
  setTimeout(() => screenshots(), 600000)

  try {
    const files = await Promise.all(_.map(records.value, record => record.screenshot()))
    const uploadRes = await upload(files)
    const fileUrl = _.map(uploadRes?.data || [], 'fileUrl')
    if (fileUrl.length === 0) throw new Error('未获取到截屏')
    reportPictures({ fileUrl })
  } catch (err) {
    console.error(`[LOG] screenshots -> err`, err)
  }
}

// 检查鼠标是否活跃
let sourceMousePos = reactive(window.ipcRenderer.sendSync('getMousePosition'))
const checkUserState = () => {
  if (!timing.value) return
  setTimeout(() => checkUserState(), 60000)

  try {
    const targetMousePos = window.ipcRenderer.sendSync('getMousePosition')
    const hasMove = targetMousePos.x !== sourceMousePos.x || targetMousePos.y !== sourceMousePos.y
    sourceMousePos = targetMousePos
    if (hasMove) reportStatus({ state: ~~hasMove })
  } catch (err) {
    console.error(`[LOG] checkUserState -> err`, err)
  }
}

// 监听计时状态改变
watch(timing, val => {
  try {
    setTimeout(() => {
      if (val) {
        // // 重置计时器
        // totalSecondsHistory.value = 0

        // 开始监听是否活跃
        checkUserState()
        // 截屏
        screenshots()
      }
    }, 1000)
  } catch (err) {
    console.error(`[LOG] watch -> timing -> err`, err)
  }
})

// 监听工作状态改变
watch(working, val => (timing.value = val))
// 监听休息状态改变
watch(workRest, val => (timing.value = !val))
// 监听结束状态改变
watch(workFinish, val => {
  timing.value = !val
  working.value = !val
})
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

      &.working {
        background-image: url(../assets/clock-working.png);
      }

      p {
        margin: 0;
        padding: 0;
        &:first-child {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          font-weight: 100;
        }
      }

      .rest {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        h1 {
          font-size: 28px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          line-height: 40px;
        }
        .c-red {
          color: red;
        }
        p {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 20px;
        }
      }
    }
  }
  .btns {
    display: flex;
  }
  .btn {
    width: 192px;
    height: 56px;
    padding: 10px 20px;
    margin: 48px 30px 0;
    cursor: pointer;
    margin-top: 48px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    &.start {
      background-image: url(../assets/btn_start.png);
    }
    &.rest {
      background-image: url(../assets/btn_rest.png);
    }
    &.end {
      background-image: url(../assets/btn_end.png);
    }
  }
}
</style>
