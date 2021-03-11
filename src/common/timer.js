import { computed, ref, watch } from 'vue'
import _ from 'lodash'

/**
 * 累计计时
 */
export function useTimeDiff() {
  //开始时间
  const startDate = ref(new Date())
  //当前时间
  const nowDate = ref(new Date())
  // 历史合计工时缓存（相差的总秒数）
  const totalSecondsHistory = ref(0)
  // 总合计工时（相差的总秒数）
  const totalSeconds = computed(() => {
    let currentTotalSeconds = parseInt((nowDate.value - startDate.value) / 1000)
    if (currentTotalSeconds < 0) currentTotalSeconds = 0
    return currentTotalSeconds + totalSecondsHistory.value
  })
  //天数
  const days = computed(() => Math.floor(totalSeconds.value / (60 * 60 * 24)))
  //小时数
  const hours = computed(() => Math.floor((totalSeconds.value % (60 * 60 * 24)) / (60 * 60)))
  //分钟
  const minutes = computed(() => Math.floor(((totalSeconds.value % (60 * 60 * 24)) % (60 * 60)) / 60))
  //秒
  const seconds = computed(() => ((totalSeconds.value % (60 * 60 * 24)) % (60 * 60)) % 60)
  // 页面显示
  const timer = computed(() => {
    const hour = _.padStart(hours.value, 2, 0)
    const minute = _.padStart(minutes.value, 2, 0)
    const second = _.padStart(seconds.value, 2, 0)
    if (~~hour) return [hour, minute, second].join(':')
    return [minute, second].join(':')
  })

  return {
    startDate,
    nowDate,
    totalSeconds,
    totalSecondsHistory,
    days,
    hours,
    minutes,
    seconds,
    timer
  }
}

export function useTimer() {
  const workBtn = ref(false)
  const tim = ref(null)

  const { startDate, nowDate, totalSeconds, totalSecondsHistory, ...clock } = useTimeDiff()

  watch(workBtn, working => {
    if (working) {
      nowDate.value = startDate.value = new Date()
      tim.value = setInterval(() => (nowDate.value = new Date()), 1000)
    } else {
      clearInterval(tim.value)
      totalSecondsHistory.value = totalSeconds.value
    }
  })

  return { workBtn, startDate, nowDate, totalSeconds, totalSecondsHistory, ...clock }
}
