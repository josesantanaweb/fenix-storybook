// src/utils/notificationService.ts

export interface NotificationService {
  sendNotification(message: string): Promise<void>
}
