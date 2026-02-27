const STORAGE_KEY = 'ipe_exam_history'

export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveResult(result) {
  const history = getHistory()
  history.unshift(result) // 최신 기록이 앞에 오도록
  const limited = history.slice(0, 50) // 최대 50개로 제한
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited))
  } catch (e) {
    console.warn('saveResult: localStorage 저장 실패', e)
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}
