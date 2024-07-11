import { createReducer } from '@reduxjs/toolkit'
import { UserState } from './types'
import { resetUser, updateSlippageTolerance, setChart, setCloseBanner, setActiveSubMenu } from './actions'

export const initialState: UserState = {
  userDarkMode: true,
  slippageTolerance: 0.5,
  showChart: false,
  closeBanner: false,
  activeSubMenu: false,
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(resetUser, (state) => {
      state = initialState
    })

    .addCase(updateSlippageTolerance, (state, action) => {
      state.slippageTolerance = action.payload.slippageTolerance
    })

    .addCase(setChart, (state, action) => {
      state.showChart = action.payload
    })

    .addCase(setCloseBanner, (state) => {
      state.closeBanner = true
    })

    .addCase(setActiveSubMenu, (state, action) => {
      state.activeSubMenu = action.payload
    })
})
