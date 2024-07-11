//@ts-nocheck
// Big Decimal class
interface BigDecimalToStringOptions {
  maxDecimalPlaces?: number
  decimalSeparator?: string
  thousandsSeparator?: string
  roundingMode?: number
  trimTrailingZeros?: boolean
  bigMode?: boolean
}

export class BigDecimal {
  private static readonly EXTENDED_SCALE = 18
  private static readonly MAX_DECIMALS = 18
  private static readonly MAX_DECIMALS_BI = BigInt(18)
  private static readonly ZERO = BigInt(0)
  private static readonly ONE = BigInt(1)
  private static readonly TEN = BigInt(10)

  public readonly _value: bigint
  public readonly _decimals: number

  constructor(value: bigint, decimals: number) {
    this._value = BigInt(value)
    this._decimals = Number(decimals)
  }

  // sign
  public get isNegative(): boolean {
    return this._value < BigDecimal.ZERO
  }

  // Get Value
  public GetValue(decimals: number): bigint {
    if (decimals < 0) {
      throw new Error('Decimals cannot be negative')
    }

    if (decimals === this._decimals) {
      return this._value
    }

    if (decimals > this._decimals) {
      return this._value * BigDecimal.TEN ** BigInt(decimals - this._decimals)
    }

    return this._value / BigDecimal.TEN ** BigInt(this._decimals - decimals)
  }

  public static fromBigInt(value: bigint, decimals: number): BigDecimal {
    return new BigDecimal(value, decimals)
  }

  public static fromStringExponential(value: string): BigDecimal {
    // parse the number with the exponential notation
    // ex: 7.993623073701469e-08

    // regex
    const regExp = new RegExp(/([0-9]+\.?[0-9]*)e(-?[0-9]+)/)
    const match = value.match(regExp)
    if (match) {
      let base = match[1]
      let exponent = BigInt(match[2])

      // if the exponent is negative ex: 1.123e-5
      if (exponent < 0) {
        // if it contains a dot
        if (base.includes('.')) {
          // 1.123e-5 => 1123e-8
          exponent -= BigInt(base.split('.')[1].length)
          base = base.replace('.', '')
        }
        // otherwise exponent remains the same

        return new BigDecimal(BigInt(base), Math.abs(Number(exponent)))
      }
      // if the exponent is positive ex: 1.123e5
      else {
        // if it contains a dot
        if (base.includes('.')) {
          // 1.123e5 => 1123e2
          exponent -= BigInt(base.split('.')[1].length)
          base = base.replace('.', '')
        }
        // otherwise exponent remains the same

        base += '0'.repeat(Number(exponent))
        return new BigDecimal(BigInt(base), 0)
      }
    }
    throw new Error('Invalid exponential number')
  }

  public static fromStringRaw(
    value: string,
    options: {
      decimalSeparator?: string
      thousandsSeparator?: string
      trimTrailingZeros?: boolean
      parseSign?: boolean
    } = {}
  ): BigDecimal {
    const decimalSeparator = options?.decimalSeparator ?? '.'
    const thousandsSeparator = options?.thousandsSeparator ?? ''
    const trimTrailingZeros = options?.trimTrailingZeros ?? false
    const parseSign = options?.parseSign ?? true

    let negative = false
    // valid separators
    if (decimalSeparator === thousandsSeparator) {
      throw new Error('Invalid separators')
    }
    if (decimalSeparator !== '.' && decimalSeparator !== ',') {
      throw new Error('Invalid decimal separator')
    }
    if (thousandsSeparator !== '' && thousandsSeparator !== '.' && thousandsSeparator !== ',') {
      throw new Error('Invalid thousands separator')
    }
    // Check if it is a valid number
    // check if the number contains an "e" (7.993623073701469e-08)
    if (value.toLowerCase().includes('e')) {
      // parse the number with the exponential notation
      return BigDecimal.fromStringExponential(value)
    }

    // with optional thousands separator
    // We escape the thousandsSeparator and decimalSeparator
    const escapedThousandsSeparator = thousandsSeparator ? '\\' + thousandsSeparator : ''
    const escapedDecimalSeparator = '\\' + decimalSeparator
    const regExp = new RegExp(
      `^-?(\\d+|\\d{1,3}(${escapedThousandsSeparator}\\d{3})*)((${escapedDecimalSeparator}\\d+)?)?$`
    )
    if (!regExp.test(value)) {
      throw new Error('Invalid number')
    }

    // Split the number into mantissa and exponent
    if (value.includes('-') && parseSign) {
      negative = true
    }
    let mantissa = BigInt(value.replace(/^-/, '').replace('.', ''))

    let decimals = BigInt(0)
    if (value.includes('.')) {
      decimals = BigInt(value.length - value.indexOf('.') - 1)
    }

    // Remove leading zeros
    if (trimTrailingZeros) {
      while (mantissa % 10n === 0n && decimals > 0n) {
        mantissa = mantissa / 10n
        decimals = decimals - 1n
      }
    }

    return new BigDecimal((negative ? -1n : 1n) * mantissa, Number(decimals))
  }

  public static fromString(value: string, decimals: number): BigDecimal {
    decimals = Number(decimals)
    const [integer, fractional] = value.split('.')
    let fractionalPartLength = 0
    const integerPart = BigInt(integer)
    let fractionalPart = BigDecimal.ZERO

    if (fractional) {
      fractionalPartLength = fractional.length
      fractionalPart = BigInt(fractional)
    }

    if (fractionalPartLength > decimals) {
      // strip the extra digits
      const difference = fractionalPartLength - decimals
      const divider = BigDecimal.TEN ** BigInt(difference)
      fractionalPart = fractionalPart / divider
      fractionalPartLength = fractionalPartLength - difference
      // throw new Error(`Fractional part length is greater than decimals: ${fractionalPartLength} > ${decimals}`);
    }

    if (fractionalPartLength < decimals) {
      const difference = decimals - fractionalPartLength
      const multiplier = BigDecimal.TEN ** BigInt(difference)
      fractionalPart *= multiplier
    }

    return new BigDecimal(integerPart * BigDecimal.TEN ** BigInt(decimals) + fractionalPart, decimals)
  }

  public static fromNumber(value: number, decimals: number): BigDecimal {
    return BigDecimal.fromString(value.toString(), decimals)
  }

  public static fromBigDecimal(value: BigDecimal): BigDecimal {
    return new BigDecimal(value._value, value._decimals)
  }

  // abs
  public abs(): BigDecimal {
    return new BigDecimal(this._value < BigDecimal.ZERO ? -this._value : this._value, this._decimals)
  }

  // +
  public add(value: BigDecimal): BigDecimal {
    if (this._decimals === value._decimals) {
      return new BigDecimal(this._value + value._value, this._decimals)
    } else if (this._decimals > value._decimals) {
      // add zeros to value
      const difference = this._decimals - value._decimals
      const multiplier = BigDecimal.TEN ** BigInt(difference)
      return new BigDecimal(this._value + value._value * multiplier, this._decimals)
    } else {
      // this._decimals < value._decimals
      // keep this._decimals (crop extra decimals from value)
      const difference = value._decimals - this._decimals
      const multiplier = BigDecimal.TEN ** BigInt(difference)
      return new BigDecimal(this._value + value._value / multiplier, this._decimals)
    }
  }

  // -
  public sub(value: BigDecimal): BigDecimal {
    if (this._decimals === value._decimals) {
      return new BigDecimal(this._value - value._value, this._decimals)
    } else if (this._decimals > value._decimals) {
      // add zeros to value
      const difference = this._decimals - value._decimals
      const multiplier = BigDecimal.TEN ** BigInt(difference)
      return new BigDecimal(this._value - value._value * multiplier, this._decimals)
    } else {
      // this._decimals < value._decimals
      // keep this._decimals (crop extra decimals from value)
      const difference = value._decimals - this._decimals
      const multiplier = BigDecimal.TEN ** BigInt(difference)
      return new BigDecimal(this._value - value._value / multiplier, this._decimals)
    }
  }

  // *
  public mul(value: BigDecimal): BigDecimal {
    // Step 1: Multiply the bigint values.
    let resultValue = this._value * value._value

    // Step 2: Calculate the new decimal precision.
    let resultDecimals = this._decimals + value._decimals

    // Step 3: Normalize the result to have the same decimal precision as `this`.
    if (resultDecimals > this._decimals) {
      const factor = BigInt(Math.pow(10, resultDecimals - this._decimals))
      resultValue = resultValue / factor
      resultDecimals = this._decimals
    }

    return new BigDecimal(resultValue, resultDecimals)
  }

  // * (number and float)
  public mulNumber(value: number): BigDecimal {
    const val = BigDecimal.fromStringRaw(value.toString())
    const bnn = new BigDecimal(this._value * val._value, this._decimals + val._decimals)
    // keep this._decimals (crop extra decimals from value)
    const difference = bnn._decimals - this._decimals
    const multiplier = BigDecimal.TEN ** BigInt(difference)
    return new BigDecimal(bnn._value / multiplier, this._decimals)
  }

  // /
  public div(value: BigDecimal): BigDecimal {
    if (value._value === 0n) {
      // throw new Error('Division by zero is not allowed');
      return new BigDecimal(0n, this._decimals)
    }

    let maxDecimals = Math.max(this._decimals, value._decimals)
    if (maxDecimals === 0) {
      return new BigDecimal(this._value / value._value, 0)
    }
    // use higher precision for the division
    maxDecimals = maxDecimals * 2

    const scaleFactor = 10n ** BigInt(maxDecimals)

    // Scale up the values before division
    const scaledThisValue = this._value * scaleFactor
    const scaledValue =
      value._value *
      (this._decimals >= value._decimals ? BigDecimal.TEN ** BigInt(this._decimals - value._decimals) : 1n)

    // Perform the division at the increased scale
    const res = new BigDecimal(scaledThisValue / scaledValue, maxDecimals)

    // Adjust the precision to keep original decimal precision
    let _temp = res.withDecimalPrecision(this._decimals)
    if (_temp._value === 0n && res._value !== 0n) {
      _temp = res
    }
    return _temp
  }

  public static div2BigInt(value1: bigint, value2: bigint, decimals: number): BigDecimal {
    // value1 / value2
    if (value2 === 0n) {
      new BigDecimal(0n, decimals)
    }
    const val1 = BigDecimal.fromBigInt(value1, decimals)
    const val2 = BigDecimal.fromBigInt(value2, decimals)
    return val1.div(val2)
  }

  // // %
  // public mod(number): BigDecimal {
  //   return new BigDecimal(this._value % value._value, this._decimals);
  // }

  // **
  public pow(value: number): BigDecimal {
    return new BigDecimal(this._value ** BigInt(value), this._decimals * value)
  }

  // <
  public lt(value: BigDecimal): boolean {
    if (this._decimals === value._decimals) {
      return this._value < value._value
    }

    // also handle different decimals
    const multiplier = BigDecimal.TEN ** BigInt(Math.abs(this._decimals - value._decimals))
    if (this._decimals > value._decimals) {
      return this._value < value._value * multiplier
    }

    return this._value * multiplier < value._value
  }

  // <=
  public lte(value: BigDecimal): boolean {
    if (this._decimals === value._decimals) {
      return this._value <= value._value
    }

    // also handle different decimals
    const multiplier = BigDecimal.TEN ** BigInt(Math.abs(this._decimals - value._decimals))
    if (this._decimals > value._decimals) {
      return this._value <= value._value * multiplier
    }

    return this._value * multiplier <= value._value
  }

  // >
  public gt(value: BigDecimal): boolean {
    if (this._decimals === value._decimals) {
      return this._value > value._value
    }

    // also handle different decimals
    const multiplier = BigDecimal.TEN ** BigInt(Math.abs(this._decimals - value._decimals))
    if (this._decimals > value._decimals) {
      return this._value > value._value * multiplier
    }

    return this._value * multiplier > value._value
  }

  // >=
  public gte(value: BigDecimal): boolean {
    if (this._decimals === value._decimals) {
      return this._value >= value._value
    }

    // also handle different decimals
    const multiplier = BigDecimal.TEN ** BigInt(Math.abs(this._decimals - value._decimals))
    if (this._decimals > value._decimals) {
      return this._value >= value._value * multiplier
    }

    return this._value * multiplier >= value._value
  }

  // get integer part
  public getIntegerPart(): bigint {
    return this._value / BigDecimal.TEN ** BigInt(this._decimals)
  }

  // get fractional part
  public getFractionalPart(): string {
    const fractionalPart = (this._value % BigDecimal.TEN ** BigInt(this._decimals)).toString()
    return fractionalPart.padStart(this._decimals, '0')
  }

  /**
   * Calculate n-th root of val
   * Parameters:
   * k: is n-th (default sqare root)
   * limit: is maximum number of iterations (default: -1 no limit)
   */
  public static rootNth(val: bigint, k = 2n, limit = -1) {
    let o = 0n // old approx value
    let x = val

    while (x ** k !== k && x !== o && --limit) {
      o = x
      x = ((k - 1n) * x + val / x ** (k - 1n)) / k
      if (limit < 0 && (x - o) ** 2n == 1n) break
    }

    if ((val - (x - 1n) ** k) ** 2n < (val - x ** k) ** 2n) x = x - 1n
    if ((val - (x + 1n) ** k) ** 2n < (val - x ** k) ** 2n) x = x + 1n
    return x
  }

  /**
   * Big Decimal to string
   * @param {number} [maxDecimalPlaces] - The number of decimal places to include (Default: All)
   * @param {string} [decimalSeparator] - The decimal separator to use (Default: '.')
   * @param {string} [thousandsSeparator] - The thousands separator to use (Default: None)
   * @param {number} [roundingMode] - The rounding mode to use (0: round down, 1: round up, 2: round to nearest) (Default: 0)
   * @param {boolean} [trimTrailingZeros] - Whether to trim trailing zeros or not (Default: true)
   * @param {boolean} [bigMode] - Whether to use big mode or not (Default: false)
   * @returns {string} The converted string
   */
  public toString(
    {
      maxDecimalPlaces,
      decimalSeparator,
      thousandsSeparator,
      roundingMode,
      trimTrailingZeros,
      bigMode,
    }: BigDecimalToStringOptions = {
      maxDecimalPlaces: Number.MAX_SAFE_INTEGER,
      decimalSeparator: '.',
      thousandsSeparator: '',
      roundingMode: 0,
      trimTrailingZeros: true,
      bigMode: false,
    }
  ): string {
    // Check if the value is a valid Big Decimal
    if (!this || (!this._value && this._value !== 0n)) {
      throw new Error(`Invalid Big Decimal {${this}}`)
    }
    if (this._decimals === 0) {
      return this._value.toString()
    }

    let negative = false
    if (this.isNegative) {
      negative = true
    }
    const value = this.abs()._value

    maxDecimalPlaces = maxDecimalPlaces === undefined ? Number.MAX_SAFE_INTEGER : maxDecimalPlaces
    decimalSeparator = decimalSeparator === undefined ? '.' : decimalSeparator
    thousandsSeparator = thousandsSeparator === undefined ? '' : thousandsSeparator
    roundingMode = roundingMode === undefined ? 0 : roundingMode
    trimTrailingZeros = trimTrailingZeros === undefined ? true : trimTrailingZeros

    // Check if the value is zero
    if (value === 0n) {
      return '0.00'
    }

    // Convert the value to a string
    let mantissa = value.toString()
    const decimals = Number(this._decimals)

    // add trailing zeros
    while (mantissa.length < decimals + 1) {
      mantissa = '0' + mantissa
    }

    // add decimal separator
    mantissa =
      mantissa.slice(0, mantissa.length - decimals) + decimalSeparator + mantissa.slice(mantissa.length - decimals)

    // trim extra decimal places
    if (
      maxDecimalPlaces !== Number.MAX_SAFE_INTEGER &&
      mantissa.includes(decimalSeparator) &&
      mantissa.length - mantissa.indexOf(decimalSeparator) - 1 > maxDecimalPlaces
    ) {
      // round the number
      if (roundingMode === 0) {
        mantissa = mantissa.slice(0, mantissa.indexOf(decimalSeparator) + maxDecimalPlaces + 1)
      } else if (roundingMode === 1) {
        mantissa = mantissa.slice(0, mantissa.indexOf(decimalSeparator) + maxDecimalPlaces + 1)
        if (mantissa[mantissa.indexOf(decimalSeparator) + maxDecimalPlaces] !== decimalSeparator) {
          mantissa = (BigInt(mantissa.replace(decimalSeparator, '')) + 1n).toString()
          mantissa =
            mantissa.slice(0, mantissa.length - maxDecimalPlaces) +
            decimalSeparator +
            mantissa.slice(mantissa.length - maxDecimalPlaces)
        }
      } else if (roundingMode === 2) {
        mantissa = mantissa.slice(0, mantissa.indexOf(decimalSeparator) + maxDecimalPlaces + 2)
        if (mantissa[mantissa.indexOf(decimalSeparator) + maxDecimalPlaces] !== decimalSeparator) {
          if (mantissa[mantissa.indexOf(decimalSeparator) + maxDecimalPlaces + 1] >= '5') {
            mantissa = mantissa.slice(0, mantissa.indexOf(decimalSeparator) + maxDecimalPlaces + 1)
            if (mantissa[mantissa.indexOf(decimalSeparator) + maxDecimalPlaces] !== decimalSeparator) {
              mantissa = (BigInt(mantissa.replace(decimalSeparator, '')) + 1n).toString()
              mantissa =
                mantissa.slice(0, mantissa.length - maxDecimalPlaces) +
                decimalSeparator +
                mantissa.slice(mantissa.length - maxDecimalPlaces)
            }
          } else {
            mantissa = mantissa.slice(0, mantissa.indexOf(decimalSeparator) + maxDecimalPlaces + 1)
          }
        }
      }
    }

    // trim trailing zeros (dont trim more than the decimal places)
    if (trimTrailingZeros && mantissa.includes(decimalSeparator) && mantissa[mantissa.length - 1] === '0') {
      const mantissaArray = mantissa.split(decimalSeparator)
      const mantissaInteger = mantissaArray[0]
      const mantissaDecimal = mantissaArray[1]
      const mantissaDecimalArray = mantissaDecimal.split('')
      const mantissaDecimalArrayReversed = mantissaDecimalArray.reverse()
      let mantissaDecimalArrayReversedTrimmed: string[] = []
      let mantissaDecimalArrayReversedTrimmedLength = 0
      for (let i = 0; i < mantissaDecimalArrayReversed.length; i++) {
        if (mantissaDecimalArrayReversed[i] === '0') {
          mantissaDecimalArrayReversedTrimmedLength++
        } else {
          break
        }
      }
      mantissaDecimalArrayReversedTrimmed = mantissaDecimalArrayReversed.slice(
        mantissaDecimalArrayReversedTrimmedLength,
        mantissaDecimalArrayReversed.length
      )
      const mantissaDecimalArrayTrimmed = mantissaDecimalArrayReversedTrimmed.reverse()
      mantissa = mantissaInteger + decimalSeparator + mantissaDecimalArrayTrimmed.join('')
    }

    // Big Mode
    // if (f < 1000) {
    //   return f.toFixed(2);
    // }
    // if (f < 1000000) {
    //   return (f / 1000).toFixed(2) + 'K';
    // }
    // if (f < 1000000000) {
    //   return (f / 1000000).toFixed(2) + 'M';
    // }

    // if (f < 1000000000000) {
    //   return (f / 1000000000).toFixed(2) + 'B';
    // }

    // return (f / 1000000000000).toFixed(2) + 'T';

    if (bigMode) {
      // 10000 -> 10K
      // 1000000 -> 1M
      // 1234567 -> 1.23M
      // 1234567890 -> 1.23B
      // 1235678901234 -> 1.23T

      // split the mantissa into an array
      const mantissaArray = mantissa.replace(thousandsSeparator, '').split(decimalSeparator)

      // Array of suffixes
      const suffixes = ['', 'K', 'M', 'B', 'T']

      // Get the suffix index, if the mantissa is 2000, the suffix index is 1 (K), if the mantissa is 2000000, the suffix index is 2 (M)
      const suffixIndex =
        mantissaArray[0].length % 3 === 0 ? mantissaArray[0].length / 3 - 1 : Math.floor(mantissaArray[0].length / 3)

      // Get the suffix
      const suffix = suffixes[suffixIndex] || ''

      // Get the mantissa integer
      const mantissaInteger = mantissaArray[0]

      // if the suffix is not empty, return the mantissa with the suffix
      if (suffix !== '') {
        // if the suffix is not empty, return the mantissa with the suffix
        // before the decimal separator
        const decLeft = mantissaInteger.slice(0, mantissaInteger.length - suffixIndex * 3)
        // after the decimal separator
        let decRight = mantissaArray[0].slice(
          mantissaInteger.length - suffixIndex * 3,
          mantissaInteger.length - suffixIndex * 3 + 2
        )

        // remove trailing zeros from the DECIMAL part of the mantissa
        if (decRight !== '') {
          const decRightArray = decRight.split('')
          const decRightArrayReversed = decRightArray.reverse()
          let decRightArrayReversedTrimmed: string[] = []
          let decRightArrayReversedTrimmedLength = 0
          for (let i = 0; i < decRightArrayReversed.length; i++) {
            if (decRightArrayReversed[i] === '0') {
              decRightArrayReversedTrimmedLength++
            } else {
              break
            }
          }
          decRightArrayReversedTrimmed = decRightArrayReversed.slice(
            decRightArrayReversedTrimmedLength,
            decRightArrayReversed.length
          )
          const decRightArrayTrimmed = decRightArrayReversedTrimmed.reverse()
          decRight = decRightArrayTrimmed.join('')
        }
        mantissa = decLeft + (decRight !== '' ? decimalSeparator + decRight : '') + suffix
      }
    }

    // add thousands separator
    if (
      !bigMode &&
      thousandsSeparator !== '' &&
      mantissa.includes(decimalSeparator) &&
      mantissa.indexOf(decimalSeparator) > 3
    ) {
      const mantissaArray = mantissa.split(decimalSeparator)
      const mantissaInteger = mantissaArray[0]
      const mantissaDecimal = mantissaArray[1]
      const mantissaIntegerArray = mantissaInteger.split('')
      const mantissaIntegerArrayReversed = mantissaIntegerArray.reverse()
      const mantissaIntegerArrayReversedWithThousandsSeparator: string[] = []
      for (let i = 0; i < mantissaIntegerArrayReversed.length; i++) {
        if (i % 3 === 0 && i !== 0) {
          mantissaIntegerArrayReversedWithThousandsSeparator.push(thousandsSeparator)
        }
        mantissaIntegerArrayReversedWithThousandsSeparator.push(mantissaIntegerArrayReversed[i])
      }
      const mantissaIntegerArrayWithThousandsSeparator = mantissaIntegerArrayReversedWithThousandsSeparator.reverse()
      mantissa = mantissaIntegerArrayWithThousandsSeparator.join('') + decimalSeparator + mantissaDecimal
    }

    // add negative sign
    if (negative) {
      mantissa = '-' + mantissa
    }

    // if last char is decimal separator, remove it
    if (mantissa[mantissa.length - 1] === decimalSeparator) {
      mantissa = mantissa.slice(0, mantissa.length - 1)
    }

    return mantissa
  }

  /**
   * Returns an approximation of the number as a float
   * @returns {number}
   * @memberof BigFloat
   * @example
   */
  toRoundedFloat(): number {
    // check if its less than number.MAX_SAFE_INTEGER
    const max = BigInt(Number.MAX_SAFE_INTEGER)
    const min = BigInt(Number.MIN_SAFE_INTEGER)
    if (this.getIntegerPart() > max) return Number.MAX_SAFE_INTEGER
    if (this.getIntegerPart() < min) return Number.MIN_SAFE_INTEGER

    // fractional part
    // ex: 1.123456789123456789 -> 1.1234567891234568
    // ex: 11.123456789123456789 -> 11.123456789123457

    const fractionalPart = this.getFractionalPart()
    const fractionalPartLength = fractionalPart.length
    const fractionalPartLengthMax = 16
    const fractionalPartLengthDiff = fractionalPartLengthMax - fractionalPartLength
    let fractionalPartRounded = fractionalPart
    if (fractionalPartLengthDiff > 0) {
      fractionalPartRounded += '0'.repeat(fractionalPartLengthDiff)
    }
    fractionalPartRounded = fractionalPartRounded.slice(0, fractionalPartLengthMax)

    // integer part (with the fractional part)
    const integerPart = this.getIntegerPart()
    const integerPartRounded = integerPart + fractionalPartRounded

    // return the rounded float
    const floatString =
      integerPartRounded.slice(0, -fractionalPartLengthMax) + '.' + integerPartRounded.slice(-fractionalPartLengthMax)
    return parseFloat(floatString)
  }

  /**
   * Returns another BigDecimals with the given decimal precision
   * @param {number} decimalPrecision
   * @returns {BigDecimal}
   * @memberof BigDecimal
   * @example
   * let a = new BigDecimal('1.123456789123456789');
   * let b = a.withDecimalPrecision(2);
   *
   */
  withDecimalPrecision(decimalPrecision: number): BigDecimal {
    // Check if the decimal precision is valid
    if (decimalPrecision < 0) {
      throw new Error('The decimal precision must be a positive integer')
    }

    // Check if the decimal precision is already the same
    if (decimalPrecision === this._decimals) {
      return this
    }

    const currentDecimals = this._decimals
    let value = this._value
    if (decimalPrecision < currentDecimals) {
      // If the new decimal precision is smaller than the current,
      // we need to reduce the number of decimals.
      const factor = 10n ** BigInt(currentDecimals - decimalPrecision)
      value = value / factor
    } else if (decimalPrecision > currentDecimals) {
      // If the new decimal precision is larger than the current,
      // we need to increase the number of decimals.
      const factor = 10n ** BigInt(decimalPrecision - currentDecimals)
      value = value * factor
    }
    // If the new decimal precision equals the current, no changes are needed.
    return new BigDecimal(value, decimalPrecision)
  }
}

// TESTS
if (import.meta.vitest) {
  const { it, expect, assert } = import.meta.vitest
  it('Parse string', () => {
    const a = BigDecimal.fromString('1.1', 1)
    expect(a.toString()).toBe('1.1')

    const b = BigDecimal.fromStringRaw('1870.8393925388436')
    expect(b.toString()).toBe('1870.8393925388436')
  })

  it('Add 2 BigDecimals', () => {
    let a = BigDecimal.fromString('1.1', 1)
    let b = BigDecimal.fromString('2.2', 1)
    let sum = a.add(b)
    expect(sum.toString()).toBe('3.3')

    // different decimals
    a = BigDecimal.fromString('1.1', 1)
    b = BigDecimal.fromString('2.2', 2)
    sum = a.add(b)
    expect(sum._decimals).toBe(1)
    expect(sum._value).toBe(33n)
    expect(sum.toString()).toBe('3.3')

    // different decimals
    a = BigDecimal.fromString('1.1', 2)
    b = BigDecimal.fromString('2.2', 1)
    sum = a.add(b)
    expect(sum._decimals).toBe(2)
    expect(sum._value).toBe(330n)
    expect(sum.toString()).toBe('3.3')

    a = new BigDecimal(0n, 3)
    b = BigDecimal.fromString('2.5', 18)
    sum = a.add(b)
    expect(sum._decimals).toBe(3)
    expect(sum._value).toBe(2500n)
    expect(sum.toString()).toBe('2.5')

    a = new BigDecimal(0n, 3)
    b = BigDecimal.fromString('746', 18)
    sum = a.add(b)
    expect(sum._decimals).toBe(3)
    expect(sum._value).toBe(746000n)
    expect(sum.toString()).toBe('746')
  })

  it('Subtract 2 BigDecimals', () => {
    const a = BigDecimal.fromString('1.1', 1)
    const b = BigDecimal.fromString('2.2', 1)
    expect(a.sub(b).toString()).toBe('-1.1')

    // different decimals
    const c = BigDecimal.fromString('1.1', 1)
    const d = BigDecimal.fromString('2.2', 2)
    expect(c.sub(d)._decimals).toBe(1)
    expect(c.sub(d)._value).toBe(-11n)
    expect(c.sub(d).toString()).toBe('-1.1')

    // different decimals
    const e = BigDecimal.fromString('1.1', 2)
    const f = BigDecimal.fromString('2.2', 1)
    expect(e.sub(f)._decimals).toBe(2)
    expect(e.sub(f)._value).toBe(-110n)
    expect(e.sub(f).toString()).toBe('-1.1')
  })

  it('Multiply 2 BigDecimals', () => {
    // const a = BigDecimal.fromString('1.1', 1);
    // const b = BigDecimal.fromString('2.2', 1);
    // expect(a.mul(b).toString()).toBe('2.4');

    // No decimals
    let a = new BigDecimal(2n, 0)
    let b = new BigDecimal(3n, 0)
    let result = a.mul(b)
    assert.equal(result._value, 6n)
    assert.equal(result._decimals, 0)

    // One number with decimals, the other without
    a = new BigDecimal(200n, 1) // 20.0
    b = new BigDecimal(3n, 0) // 3
    result = a.mul(b)
    assert.equal(result._value, 600n)
    assert.equal(result._decimals, 1) // 60.0

    // Both numbers with the same number of decimals
    a = new BigDecimal(200n, 1) // 20.0
    b = new BigDecimal(300n, 1) // 30.0
    result = a.mul(b)
    assert.equal(result._value, 6000n)
    assert.equal(result._decimals, 1) // 600.0

    // Both numbers with a different number of decimals
    a = new BigDecimal(200n, 1) // 20.0
    b = new BigDecimal(3000n, 2) // 30.00
    result = a.mul(b)
    assert.equal(result._value, 6000n)
    assert.equal(result._decimals, 1) // 600.0

    // Large number of decimals
    a = new BigDecimal(2000000000000000000n, 18) // 2.000000000000000000
    b = new BigDecimal(3000000000000000000n, 18) // 3.000000000000000000
    result = a.mul(b)
    assert.equal(result._value, 6000000000000000000n)
    assert.equal(result._decimals, 18) // 6.000000000000000000

    // Number with no units
    a = new BigDecimal(200000n, 5) // 2.00000
    b = new BigDecimal(300000n, 5) // 3.00000
    result = a.mul(b)
    assert.equal(result._value, 600000n)
    assert.equal(result._decimals, 5) // 6.00000
  })

  it('Divide 2 BigDecimals', () => {
    let a = BigDecimal.fromString('1.1', 1)
    let b = BigDecimal.fromString('2.2', 1)
    let res = a.div(b)
    assert.equal(res._value, 5n)
    assert.equal(res._decimals, 1)

    // No decimals
    a = new BigDecimal(6n, 0)
    b = new BigDecimal(3n, 0)
    res = a.div(b)
    assert.equal(res._value, 2n)
    assert.equal(res._decimals, 0)

    a = BigDecimal.fromString('0.5', 1)
    b = BigDecimal.fromString('0.5', 1)
    res = a.div(b)
    assert.equal(res.toString({ trimTrailingZeros: false }), '1.0')
  })

  it('multiply bigdecimal * number', () => {
    const a = BigDecimal.fromString('1.1', 1)
    expect(a.mulNumber(2).toString()).toBe('2.2')

    const b = BigDecimal.fromStringRaw('12.345678912345678912')
    expect(b.mulNumber(2).toString()).toBe('24.691357824691357824')

    expect(b.mulNumber(0.1).toString()).toBe('1.234567891234567891')
    expect(b.mulNumber(0.1)._decimals).toBe(18)
  })

  it('toRoundedFloat', () => {
    let a = BigDecimal.fromString('1.1', 1)
    expect(a.toRoundedFloat()).toBe(1.1)

    a = BigDecimal.fromString('1.123456789123456789', 18)
    expect(a.toRoundedFloat()).toBe(1.1234567891234566)

    a = BigDecimal.fromString('11.123456789123456789', 18)
    expect(a.toRoundedFloat()).toBe(11.123456789123457)
  })

  it('from Exponential String', () => {
    let a = BigDecimal.fromStringRaw('1.1e-18')
    expect(a.toString()).toBe('0.0000000000000000011')

    a = BigDecimal.fromStringRaw('1.2e-17')
    expect(a.toString()).toBe('0.000000000000000012')

    a = BigDecimal.fromStringRaw('1.3e-16')
    expect(a.toString()).toBe('0.00000000000000013')

    a = BigDecimal.fromStringRaw('1.234e-15')
    expect(a.toString()).toBe('0.000000000000001234')

    a = BigDecimal.fromStringRaw('2e-15')
    expect(a.toString()).toBe('0.000000000000002')

    a = BigDecimal.fromStringRaw('1.1123e-10')
    expect(a.toString()).toBe('0.00000000011123')

    a = BigDecimal.fromStringRaw('1.1123e9')
    expect(a.toString()).toBe('1112300000')
  })

  it('withDecimalPrecision', () => {
    // Reduce precision
    let a = new BigDecimal(1123456789123456789n, 18) // 1.123456789123456789
    let result = a.withDecimalPrecision(2)
    assert.equal(result._value, 112n)
    assert.equal(result._decimals, 2) // 1.12

    // Increase precision
    a = new BigDecimal(112n, 2)
    result = a.withDecimalPrecision(18)
    assert.equal(result._value, 1120000000000000000n)
    assert.equal(result._decimals, 18) // 1.120000000000000000

    // Precision remains the same
    a = new BigDecimal(112n, 2)
    result = a.withDecimalPrecision(2)
    assert.equal(result._value, 112n)
    assert.equal(result._decimals, 2) // 1.12

    // Precision is 0
    a = new BigDecimal(112n, 2)
    result = a.withDecimalPrecision(0)
    assert.equal(result._value, 1n)
    assert.equal(result._decimals, 0) // 1.12
  })
}
