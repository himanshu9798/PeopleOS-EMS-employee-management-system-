import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, CheckCheck, Trash2, CalendarOff, Users, Clock, CreditCard, Bell } from 'lucide-react'
import { Notification } from '../../types'
import { notificationService } from '../../services/notificationService'
import { cn } from '../../utils/cn'

interface NotificationDrawerProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onRefresh: () => void
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh,
}) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    await notificationService.markAsRead(id)
    onRefresh()
  }

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead()
    onRefresh()
  }

  const handleClearAll = async () => {
    await notificationService.clearAll()
    onRefresh()
  }

  const handleItemClick = async (notif: Notification) => {
    if (!notif.read) {
      await notificationService.markAsRead(notif.id)
      onRefresh()
    }
    if (notif.actionUrl) {
      navigate(notif.actionUrl)
      onClose()
    }
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'leave':
        return <CalendarOff className="w-4 h-4 text-terracotta" />
      case 'employee':
        return <Users className="w-4 h-4 text-plum" />
      case 'attendance':
        return <Clock className="w-4 h-4 text-[#8C6212]" />
      case 'payroll':
        return <CreditCard className="w-4 h-4 text-[#355E32]" />
      default:
        return <Bell className="w-4 h-4 text-ink-secondary" />
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[88vw] sm:max-w-md bg-[#FFFEFA] border-l border-edge shadow-modal z-10 flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-edge flex items-center justify-between bg-ivory-card">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-ink-main">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-terracotta text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-ink-secondary hover:text-ink-main p-1.5 rounded-lg hover:bg-black/5"
            aria-label="Close notifications panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        {notifications.length > 0 && (
          <div className="px-5 py-2.5 bg-ivory-page/50 border-b border-edge flex items-center justify-between text-xs text-ink-secondary">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 hover:text-plum font-medium transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto divide-y divide-edge/60">
          {notifications.length === 0 ? (
            <div className="py-20 text-center text-ink-secondary px-6">
              <Bell className="w-8 h-8 mx-auto text-ink-secondary/40 mb-3" />
              <p className="text-sm font-semibold text-ink-main">You&apos;re all caught up!</p>
              <p className="text-xs text-ink-secondary mt-1">
                No active notifications or action items at this moment.
              </p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={cn(
                  'p-4 flex items-start gap-3.5 transition-colors cursor-pointer',
                  !n.read ? 'bg-terracotta-subtle/30 hover:bg-terracotta-subtle/50' : 'hover:bg-ivory-page/50'
                )}
              >
                <div className="p-2 rounded-xl bg-ivory-card border border-edge flex-shrink-0 shadow-soft">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-semibold text-ink-main truncate leading-tight">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-ink-secondary whitespace-nowrap">
                      {n.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-ink-secondary leading-relaxed mt-1">
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <span
                    className="w-2 h-2 rounded-full bg-terracotta flex-shrink-0 mt-1"
                    title="Unread"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
