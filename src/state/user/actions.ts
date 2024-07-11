import { createAction } from '@reduxjs/toolkit'

export const resetUser = createAction('user/resetUser')
export const updateSlippageTolerance = createAction<{ slippageTolerance: number | 'Auto' }>(
  'user/updateSlippageTolerance'
)
export const setChart = createAction<boolean>('user/setChart')

export const setCloseBanner = createAction<boolean>('user/setCloseBanner')

export const setActiveSubMenu = createAction<boolean>('user/setActiveSubMenu')
