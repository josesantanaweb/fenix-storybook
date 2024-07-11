import axios from 'axios'

/** Check is a value is empty. Mostly used to determine if a value should be in the search params */
export const getCandles = async (pair: any, token: any) => {
  const url = 'https://graph.defined.fi/graphql'
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'aae7e8e3287aa41cd6a1a47b48089e100e66758e',
  }
  const now = Math.floor(Date.now() / 1000)
  const threeMonthsAgo = now - 90 * 24 * 60 * 60
  const query = `query {
        getBars(
          symbol: "${pair}:81457"
          from: ${threeMonthsAgo}
          to: ${now}
          resolution: "1D"
          quoteToken: ${token}
          currencyCode: "TOKEN"
        ) {
          o
          c
          h
          l
          t
        }
      }`
  const response = await axios.post(url, { query }, { headers: headers })

  const candles: any = []
  const bars = response.data.data.getBars
  bars.t.map((timestamp: any, i: any) => {
    if (Number(bars.o[i]) == 0 || Number(bars.c[i]) == 0 || Number(bars.l[i]) == 0 || Number(bars.h[i]) == 0) return
    candles.push({
      date: timestamp,
      open: Number(bars.o[i]),
      close: Number(bars.c[i]),
      high: Number(bars.h[i]),
      low: Number(bars.l[i]),
    })
  })

  return candles
}
