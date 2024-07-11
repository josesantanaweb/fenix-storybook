export default function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const day = date.getDate()
  const month = date.getMonth() + 1 // Months are 0-based, so add 1
  const year = date.getFullYear()
  const formattedDay = String(day).padStart(2, '0')
  const formattedMonth = String(month).padStart(2, '0')
  const formattedDate = `${formattedDay}/${formattedMonth}/${year.toString().slice(-2)}`
  return formattedDate
}
