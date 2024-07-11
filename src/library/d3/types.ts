export interface D3ChartSettingsProps {
  width: number
  height: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export interface D3ChartSettings extends Required<D3ChartSettingsProps> {
  boundedWidth: number
  boundedHeight: number
}

export type CandlestickData = {
  date: number
  // volume: number;
  open: number
  close: number
  high: number
  low: number
}

export type Accessor<T> = (d: T) => number

export interface D3AxisTick {
  value: number
  offset: number
}

export interface D3AxisProps {
  ticks: D3AxisTick[]
  dms: D3ChartSettings
  formatter?: (value: number) => string | number
}

export type D3SimLegendEntry = 'ask' | 'bid' | 'price' | 'portfolio' | 'portion' | 'hodl'

export type D3LegendItem = {
  index: number
  label: string
  labelSecondary?: string
  color: string
  isDisabled: boolean
  isDashed?: boolean
}

export type D3SimLegendType = Record<D3SimLegendEntry, D3LegendItem>

export type SimulatorReturn = {
  data: Array<SimulatorData>
  bounds: SimulatorBounds
  roi?: number
  gains?: number
}

export type SimulatorData = {
  date: number
  price: number
  ask: number
  bid: number
  portfolioOverHodl: number
  portfolioValue: number
  hodlValue: number
  balanceCASH: number
  portionCASH: number
  balanceRISK: number
  portionRISK: number
}

export type SimulatorBounds = {
  askMin: number
  askMax: number
  bidMin: number
  bidMax: number
}

export interface D3ChartSettingsProps {
  width: number
  height: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
}

export interface D3ChartSettings extends Required<D3ChartSettingsProps> {
  boundedWidth: number
  boundedHeight: number
}

export interface D3AxisTick {
  value: number
  offset: number
}

export interface D3AxisProps {
  ticks: D3AxisTick[]
  dms: D3ChartSettings
  formatter?: (value: number) => string | number
}
