export const getEpochStart = (epoch: number) => {
  const EPOCH_0_START = 1711584000

  return EPOCH_0_START + epoch * 604800
}

export const getClosestEpoch = (timestamp: number) => {
  const epoch0 = getEpochStart(0)
  const epoch = Math.floor((timestamp - epoch0) / 604800)

  return epoch
}

export function getCurrentEpoch() {
  return getClosestEpoch(Math.floor(Date.now() / 1000))
}
export const getParsedTimeLeft = (activePeriod: number) => {
  const currentTimestamp = new Date().getTime()
  const diff = (activePeriod + 24 * 60 * 60 * 7) * 1000 - currentTimestamp
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return `${days}d ${hours}h ${minutes}m`
}
export function timeLeftUntilNextThursday() {
  // Set reference time
  const referenceDate = new Date(1711584000000)

  // Find the next Thursday
  while (referenceDate.getDay() !== 4) {
    referenceDate.setDate(referenceDate.getDate() + 1)
  }

  // Set the next Thursday 00:00:00
  referenceDate.setHours(0, 0, 0, 0)

  // Get the current time
  const currentTime = new Date()

  // Calculate the time difference in milliseconds
  let timeDiff = referenceDate.getTime() - currentTime.getTime()

  if (timeDiff < 0) {
    // If the next Thursday has passed, calculate for the next week
    timeDiff += 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  }

  // Convert milliseconds to days, hours, and minutes
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

  return `${days} days, ${hours} hours, ${minutes} minutes left until next Thursday 00:00:00 GMT.`
}
