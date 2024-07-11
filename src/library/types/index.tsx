import { FeeAmount } from '../constants/trade'

export type Address = `0x${string}` | undefined
export interface IToken {
  id?: number
  name: string
  symbol: string
  address: Address
  decimals: number
  img: string
  price: number
}
export interface ITokenMini {
  id?: number
  name: string
  symbol: string
  address: Address
  decimals: number
  img: string
  price: number
}
export interface IOption {
  label: string
  value: string
}

export interface IStep {
  description: string
  label?: string
  icon: string
  status?: string
}

export interface GammaPair {
  address: string
  title: string
  // type: Presets
  token0Address: string
  token1Address: string
  ableToFarm?: boolean
  pid?: number
  masterChefIndex?: number
  withdrawOnly?: boolean
  fee?: FeeAmount
}
