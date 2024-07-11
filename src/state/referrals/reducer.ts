import { createReducer } from '@reduxjs/toolkit'
import { setReferralCode, setReferralSystemInitialized, setReferrerBy } from './actions'
import { ReferralState } from './types'

export const initialState: ReferralState = {
  isReferralSystemInitialized: false,
  referralCode: '',
  referrerBy: '',
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(setReferralCode, (state, action) => {
      state.referralCode = action.payload.referralCode
    })
    .addCase(setReferralSystemInitialized, (state, action) => {
      state.isReferralSystemInitialized = action.payload.isReferralSystemInitialized
    })
    .addCase(setReferrerBy, (state, action) => {
      state.referrerBy = action.payload.referrerBy
    })
})
