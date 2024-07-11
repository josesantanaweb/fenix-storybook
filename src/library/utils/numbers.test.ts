import { getPositiveBalance } from './numbers'

describe('getPositiveBalance', () => {
  test('returns 0 if the withdrawn amount is greater than the deposited amount', () => {
    const result = getPositiveBalance(100, 200)
    expect(result).toBe(0)
  })

  test('returns the correct balance if the withdrawn amount is less than the deposited amount', () => {
    const result = getPositiveBalance(200, 100)
    expect(result).toBe(100)
  })

  test('returns 0 if the deposited amount is equal to the withdrawn amount', () => {
    const result = getPositiveBalance(100, 100)
    expect(result).toBe(0)
  })
  test('handles negative numbers correctly', () => {
    expect(getPositiveBalance(-100, -150)).toBe(0)
    expect(getPositiveBalance(-100, -50)).toBe(50)
  })
  test('handles decimals numbers correctly', () => {
    expect(getPositiveBalance(100.5, 100)).toBe(0.5)
    expect(getPositiveBalance(100.4234898919183, 50.23111991191)).toBe(50.192369980008294)
  })
  test('returns the deposited amount if no amount has been withdrawn', () => {
    expect(getPositiveBalance(100, 0)).toBe(100)
  })
  test('handles undefined values correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getPositiveBalance(undefined as any, 100)).toBe(0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getPositiveBalance(100, undefined as any)).toBe(100)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getPositiveBalance(undefined as any, undefined as any)).toBe(0)
  })
  test('handles null values correctly', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getPositiveBalance(null as any, 100)).toBe(0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getPositiveBalance(100, null as any)).toBe(100)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(getPositiveBalance(null as any, null as any)).toBe(0)
  })
})
