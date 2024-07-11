export interface NotificationDetails {
  id: string
  createTime: string
  message: string
  notificationType: NotificationType
  txHash?: string
  timeToShow?: number
  notificationDuration?: NotificationDuration
}
export enum NotificationType {
  DEFAULT = 'Default',
  SUCCESS = 'Success',
  ERROR = 'Error',
  WARNING = 'Warning',
}

export enum NotificationDuration {
  DURATION_3000 = 3000,
  DURATION_4000 = 4000,
  DURATION_5000 = 5000,
  DURATION_10000 = 10000,
  DURATION_15000 = 15000,
  DURATION_25000 = 25000,
}
