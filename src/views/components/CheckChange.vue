<template>
  <div class="check-change">
    <template v-for="(item, index) in records" :key="index">
      <canvas :ref="setCanvas" :id="item.source.id"></canvas>
    </template>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { reactive, ref, watch, computed, onMounted } from 'vue'
import { getSourcesStreams } from '../../common/capture/getStreams'
import { saveRecord } from '../../common/capture/saveFile'

const canvases = reactive({})
const setCanvas = el => {
  if (!el) return
  canvases[el.id] = el
}

const records = ref(null)
;(async function getStreams() {
  const sourceStreams = await getSourcesStreams()
  records.value = await Promise.all(
    _.map(sourceStreams, async item => {
      const record = saveRecord(item)
      await record.init()
      return record
    })
  )
  console.log(`[LOG] CheckChange -> getStreams -> records.value`, records.value)

  const getScreenshots = () => {
    return _.mapValues(
      _.keyBy(records.value, record => `${record.source.id}-${record.source.name}`),
      record => {
        const canvas = canvases[record.source.id]
        const { video } = record
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(
          video,
          100,
          100,
          video.videoWidth - 200,
          video.videoHeight - 200,
          0,
          0,
          video.videoWidth,
          video.videoHeight
        )
        const base64 = canvas.toDataURL()
        return base64
      }
    )
  }

  let sourceImgs = {}
  setTimeout(() => (sourceImgs = getScreenshots()), 0)
  const diffStatus = () => {
    const targetImgs = getScreenshots()
    const status = _.map(targetImgs, (img, key) => img === sourceImgs[key])
    console.log(`[LOG] -> status -> status`, status)
    sourceImgs = targetImgs
  }
  setInterval(() => {
    diffStatus()
  }, 5000)
})()
</script>

<style lang="scss" scoped>
.check-change {
  width: 100%;
  display: flex;
  align-items: center;

  canvas {
    flex: 1;
    box-shadow: 1px 1px 0px 5px #fff;
  }
}
</style>
