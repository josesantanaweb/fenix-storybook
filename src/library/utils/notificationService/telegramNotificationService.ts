// src/utils/telegramNotificationService.ts

import { NotificationService } from './notificationService'

export class TelegramNotificationService implements NotificationService {
  private botToken: string
  private chatId: string

  constructor(botToken: string, chatId: string) {
    this.botToken = botToken
    this.chatId = chatId
  }

  async sendNotification(message: string): Promise<void> {
    const telegramApiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`

    await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: this.chatId,
        text: message,
      }),
    })
  }
}
