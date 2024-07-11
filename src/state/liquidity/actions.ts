import { Address } from '@/src/library/types'
import { ClmProvider } from '@/src/library/types/liquidity'
import { createAction } from '@reduxjs/toolkit'

export const updateToken0 = createAction<Address>('liquidity/updateToken0')
export const updateToken0TypedValue = createAction<string>('liquidity/updateToken0TypedValue')
export const updateToken1 = createAction<Address>('liquidity/updateToken1')
export const updateToken1TypedValue = createAction<string>('liquidity/updateToken1TypedValue')
export const updateClmProvider = createAction<ClmProvider>('liquidity/updateClmProvider')
