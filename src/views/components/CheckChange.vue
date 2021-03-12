<script setup>
import _ from 'lodash'
import { reactive, ref, watch, computed, onMounted } from 'vue'
import { getSourcesStreams } from '../../common/capture/getStreams'
import { saveRecord } from '../../common/capture/saveFile'

async function getStreams() {
  const canvases = reactive({})
  const records = ref(null)
  const sourceStreams = await getSourcesStreams()

  records.value = await Promise.all(
    _.map(sourceStreams, async item => {
      const record = await saveRecord(item)

      canvases[record.source.id] = document.createElement('canvas')
      canvases.id = record.source.id

      return record
    })
  )

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
          150,
          150,
          video.videoWidth - 300,
          video.videoHeight - 300,
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

  let sourceImgs = getScreenshots()
  const diffStatus = () => {
    const targetImgs = getScreenshots()
    const status = _.map(targetImgs, (img, key) => img !== sourceImgs[key])
    sourceImgs = targetImgs
    return status
  }

  return diffStatus
}

getStreams().then(doDiff => {
  setInterval(() => {
    console.log(`[LOG] -> setInterval -> diffStatus()`, doDiff())
  }, 5000)
})
</script>
