import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '..'
import { NotificationDetails } from './types'
import { addUnreadNotification, readOneNotification } from './actions'

export function useNotificationAdderCallback(): (notification: NotificationDetails) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (notification: NotificationDetails) => {
      dispatch(addUnreadNotification({ notification }))
    },
    [dispatch]
  )
}

export function useUnreadNotifications(): NotificationDetails[] {
  const unreadNotification = useAppSelector((state) => state.notifications.unreadNotification)
  return unreadNotification
}

export function useReadNotificationCallback(): (id: string) => void {
  const dispatch = useAppDispatch()
  return useCallback(
    (id: string) => {
      dispatch(readOneNotification({ id }))
    },
    [dispatch]
  )
}
