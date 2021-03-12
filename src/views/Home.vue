<template>
  <div class="workbench">
    <Preview class="column"></Preview>
    <div class="column control">
      <p class="status">已工作</p>
      <div class="timer">{{ timer }}</div>
      <div class="btn" @click="workBtn = !workBtn">{{ workBtnTxt }}</div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { saveRecord } from '../common/capture/saveFile'
import { useTimer } from '../common/timer'
import Preview from './components/Preview.vue'
import { getSourcesStreams } from '../common/capture/getStreams'

const { timer, workBtn } = useTimer()
const workBtnTxt = computed(() => (workBtn.value ? '休息一下' : '开始工作'))

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

// 截屏
const screenshots = () => {
  _.forEach(records.value, record => record.screenshot())
  if (workBtn.value) setTimeout(() => screenshots(), 5000)
}
watch(workBtn, () => screenshots())

// 录屏
watch(workBtn, () => _.forEach(records.value, record => (workBtn.value ? record.start() : record.stop())))

// 检查鼠标是否活跃
let sourceMousePos = reactive(window.ipcRenderer.sendSync('getMousePosition'))
const checkHasMove = () => {
  const targetMousePos = window.ipcRenderer.sendSync('getMousePosition')
  const hasMove = targetMousePos.x !== sourceMousePos.x || targetMousePos.y !== sourceMousePos.y
  sourceMousePos = targetMousePos
  return hasMove
}
setInterval(() => console.log(`[LOG] -> hasMove`, checkHasMove()), 5000)
</script>

<style lang="scss" scoped>
.workbench {
  display: flex;
  justify-content: space-around;
  color: #fff;

  .column {
    margin: 20px;
  }

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
}
</style>
