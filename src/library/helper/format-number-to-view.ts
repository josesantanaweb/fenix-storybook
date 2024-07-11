export default function formatNumberToView(value: string | number, n = 6): string {
  let val = value.toString()

  if (val.startsWith('.')) {
    val = `0${val}`
  }
  if (val.endsWith('.')) {
    val = val.slice(0, -1)
  }

  return val
    .replace(`(\d*\.\d{0,${n}})\d*`, '')
    .replace(/(\.\d*?[1-9])0+$/, '$1')
    .replace(/(^0+)?(\d+)/, '$2')
}
