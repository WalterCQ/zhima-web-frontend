// 轻量自动保存工具

export function createAutosave(storageKey, loadFn, saveFn, { intervalMs = 30000 } = {}) {
  let timerId = null

  const start = () => {
    stop()
    timerId = setInterval(async () => {
      try {
        await saveFn()
      } catch (e) {
        // 忽略自动保存错误
      }
    }, intervalMs)
  }

  const stop = () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }

  const clear = () => {
    try {
      localStorage.removeItem(storageKey)
    } catch {}
  }

  const load = () => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return null
      const data = JSON.parse(saved)
      loadFn(data)
      return data
    } catch {
      return null
    }
  }

  const save = (dataProducer) => {
    try {
      const data = typeof dataProducer === 'function' ? dataProducer() : dataProducer
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch {}
  }

  return { start, stop, load, save, clear }
}


