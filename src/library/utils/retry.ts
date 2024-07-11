export function autoRefresh(callback: () => void, seconds: number, instantCall = true): () => void {
  if (instantCall) callback()
  const interval = setInterval(() => {
    callback()
  }, seconds * 1000)
  return () => clearInterval(interval)
}
