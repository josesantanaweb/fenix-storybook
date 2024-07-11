//@ts-ignore
//@ts-nocheck

import { BACKEND_URL } from '../Constants'
import { AvailableTokenData, TokenData } from '../structures/common/TokenData'
import { BigDecimal } from '../web3/common/BigDecimal'

export function getParsedTokenBalance(
  tokenBalance: number,
  tokenDecimals: number,
  showDecimals = 4,
  bigMode = false,
  dotMode = false
): string {
  if (isNaN(tokenBalance)) return '0'

  if (showDecimals > tokenDecimals) showDecimals = tokenDecimals

  const parsed = (Math.floor(tokenBalance * 10 ** tokenDecimals) / (10 ** tokenDecimals * 10 ** tokenDecimals)) // FIX TO AVOID MAX FLOATING POINT ERROR
    .toFixed(showDecimals)

  const decimalString = parsed.split('.')[1]
  // Check if decimalString is all 0s
  if (decimalString && decimalString.split('').every((char) => char === '0')) {
    return parsed.split('.')[0]
  }

  if (bigMode) {
    if (dotMode) {
      const f = parseFloat(parsed)

      // Put . for big numbers
      if (f < 1000) {
        return parsed
      }

      if (f < 10000) {
        return parsed.substring(0, 1) + '.' + parsed.substring(1, 4)
      }

      return parsed
    } else {
      const f = parseFloat(parsed)

      if (f < 1000) {
        return f.toFixed(2)
      }
      if (f < 1000000) {
        return (f / 1000).toFixed(2) + 'K'
      }
      if (f < 1000000000) {
        return (f / 1000000).toFixed(2) + 'M'
      }

      if (f < 1000000000000) {
        return (f / 1000000000).toFixed(2) + 'B'
      }

      return (f / 1000000000000).toFixed(2) + 'T'
    }
  } else {
    return parsed
  }
}

export function getLogoURIForToken(tokenSymbol: string) {
  // const developmentMode = process.env.NODE_ENV;

  return BACKEND_URL + '/tokens/' + tokenSymbol + '.png'

  // if (developmentMode === 'development') {
  //   return '/images/' + tokenSymbol + '.png';
  // } else {
  //   return BACKEND_URL + '/tokens/' + tokenSymbol + '.png';
  // }
}

export function updateParsedTokenValue(
  value: string,
  token: TokenData,
  setTokenFieldValue: (value: string) => void,
  setTokenValue: (value: bigint) => void
) {
  if (value.length === 0) {
    setTokenFieldValue('')
    setTokenValue(-1n)
    return
  }

  // Don't allow part before . to be longer than 15 characters
  if (value.includes('.')) {
    const split = value.split('.')
    if (split[0].length > 25) {
      return
    }

    if (split[1].length > token.decimals) {
      // return;
      // strip
      value = value.slice(0, value.length - (split[1].length - token!.decimals))
    }
  } else {
    if (value.length > token.decimals + 25) {
      return
    }
  }

  // Replace , for .
  value = value.replace(',', '.')
  // Remove all non-numeric characters
  value = value.replace(/[^0-9.]/g, '')
  // Remove all but the first dot
  value = value.replace(/(\..*)\./g, '$1')

  setTokenFieldValue(value)
  const parsed = parseFloat(value)

  if (!isNaN(parsed)) {
    //   setTokenValue(parsed * 10 ** token.decimals);
    const parsed1 = BigDecimal.fromString(value, token.decimals)
    setTokenValue(parsed1._value)
  }
}

// export function eToNumber(num, decimals = true) {
//   const t = () => {
//     let sign = ''
//     ;(num += '').charAt(0) == '-' && ((num = num.substring(1)), (sign = '-'))
//     arr = num.split(/[e]/gi)
//     if (arr.length < 2) return sign + num
//     const dot = (0.1).toLocaleString().substr(1, 1),
//       n = arr[0],
//       exp = +arr[1],
//       w = (n = n.replace(/^0+/, '')).replace(dot, ''),
//       pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp,
//       L = pos - w.length,
//       s = '' + BigInt(parseInt(w))
//     w = exp >= 0 ? (L >= 0 ? s + '0'.repeat(L) : r()) : pos <= 0 ? '0' + dot + '0'.repeat(Math.abs(pos)) + s : r()
//     L = w.split(dot)
//     if ((L[0] == 0 && L[1] == 0) || (+w == 0 && +s == 0)) w = 0 //** added 9/10/2021

//     return sign + w

//     function r() {
//       return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1`)
//     }
//   }

//   // Delete everything after the .
//   const result = t()
//   if (!decimals) {
//     if (result.includes('.')) {
//       return parseInt(result.split('.')[0]).toString()
//     }
//   }
//   return result
// }

import createKeccakHash from 'keccak'

export function toChecksumAddress(address) {
  address = address.toLowerCase().replace('0x', '')
  const hash = createKeccakHash('keccak256').update(address).digest('hex')
  let ret = '0x'

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }

  return ret
}

export function getTokenDetailsFromAddress(tokenData: AvailableTokenData, tokenAddress: string) {
  return tokenData.tokensDictionary[tokenAddress.toLowerCase()]
}
