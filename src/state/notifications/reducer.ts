import { createReducer } from '@reduxjs/toolkit'
import { addUnreadNotification, readOneNotification } from './actions'
import { NotificationDetails } from './types'

export interface NotificationState {
  unreadNotification: NotificationDetails[]
}

export const initialState: NotificationState = {
  unreadNotification: [],
}

export default createReducer(initialState, (builder) => {
  builder
    .addCase(addUnreadNotification, (state, action) => {
      const { unreadNotification } = state
      unreadNotification.push(action.payload.notification)
    })
    .addCase(readOneNotification, (state, action) => {
      const { unreadNotification } = state
      const updatedNotifications = unreadNotification.filter((notification) => notification.id !== action.payload.id)
      state.unreadNotification = updatedNotifications
    })
})
