import { Notification } from '../types'
import { storage } from './storage'

export const notificationService = {
  async getAll(): Promise<Notification[]> {
    return storage.getNotifications()
  },

  async markAsRead(id: string): Promise<void> {
    const list = storage.getNotifications()
    const updated = list.map(n => (n.id === id ? { ...n, read: true } : n))
    storage.saveNotifications(updated)
  },

  async markAllAsRead(): Promise<void> {
    const list = storage.getNotifications()
    const updated = list.map(n => ({ ...n, read: true }))
    storage.saveNotifications(updated)
  },

  async clearAll(): Promise<void> {
    storage.saveNotifications([])
  },
}
