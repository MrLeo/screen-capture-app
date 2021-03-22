/**
 * 同步版本
 * @example const fun = () => sleepSync(500)
 */
export const sleepSync = ms => {
  const end = new Date().getTime() + ms
  while (new Date().getTime() < end) {
    /* do nothing */
  }
}

/**
 * 异步版本
 * @example const fun = async () => sleep(500)
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export class Sleep {
  constructor(timeout) {
    this.timeout = timeout
  }

  then(resolve, reject) {
    const startTime = Date.now()
    setTimeout(() => resolve(Date.now() - startTime), this.timeout)
  }
}
