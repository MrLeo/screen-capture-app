<template>
  <div class="preview">
    <template v-for="item in streams" :key="item.id">
      <video autoplay :ref="setVideos" :id="item.id" :name="item.name"></video>
    </template>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { reactive, ref, nextTick, watch } from 'vue'
import { getSourcesStreams } from '../../common/capture/getStreams'

const streams = ref([])
const videos = reactive({})
const setVideos = el => {
  el && (videos[el.id] = el)
}

;(async function getStreams() {
  const sourceStreams = await getSourcesStreams()
  streams.value = [...sourceStreams]
})()

watch(streams, async obj => {
  await nextTick()
  _.map(obj, item => {
    videos[item.id].srcObject = item.stream
  })
})
</script>

<style lang="scss" scoped>
.preview {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;

  video {
    flex: 1;
    max-width: 300px;
  }
}
</style>
