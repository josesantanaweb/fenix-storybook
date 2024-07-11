import { createAction } from '@reduxjs/toolkit'
import { NotificationDetails } from './types'

export const addUnreadNotification = createAction<{ notification: NotificationDetails }>(
  'notifications/addUnreadNotification'
)
export const readOneNotification = createAction<{ id: string }>('notifications/readOneNotification')
