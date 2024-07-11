'use client'
import { useUnreadNotifications } from '@/src/state/notifications/hooks'
import Notification from '.'
// import { NotificationType, NotificationDuration } from '@/src/state/notifications/types'


const NotificationFeed = () => {
  const notifications = useUnreadNotifications()
  const visibleNotifications = notifications.slice(-7).reverse()
  /* const visibleNotifications = [
    {
      id: '1',
      createTime: '2022-01-01T00:00:00Z',
      message: 'This is a test notification',
      notificationType: NotificationType.DEFAULT,
      txHash: '0x1234567890',
      timeToShow: 3000,
      notificationDuration: 4000,
    },
    {
      id: '1',
      createTime: '2022-01-01T00:00:00Z',
      message: 'This is a test notification',
      notificationType: NotificationType.SUCCESS,
      txHash: '0x1234567890',
      timeToShow: 3000,
      notificationDuration: 4000,
    },
    {
      id: '1',
      createTime: '2022-01-01T00:00:00Z',
      message: 'This is a test notification',
      notificationType: NotificationType.ERROR,
      txHash: '0x1234567890',
      timeToShow: 3000,
      notificationDuration: 4000,
    },
    {
      id: '1',
      createTime: '2022-01-01T00:00:00Z',
      message: 'This is a test notification',
      notificationType: NotificationType.WARNING,
      txHash: '0x1234567890',
      timeToShow: 3000,
      notificationDuration: 4000,
    },
  ] */
  return (
    <div className="fixed top-[150px] right-5 flex flex-col space-y-2 z-[50]">
      {visibleNotifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          createTime={notification?.createTime}
          message={notification?.message}
          notificationType={notification?.notificationType}
          txHash={notification?.txHash}
          timeToShow={notification?.timeToShow}
          notificationDuration={notification?.notificationDuration}
        />
      ))}
    </div>
  )
}

export default NotificationFeed
