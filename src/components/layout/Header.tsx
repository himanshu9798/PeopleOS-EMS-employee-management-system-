import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  Calendar,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { notificationService } from '../../services/notificationService'
import { Notification } from '../../types'
import { Breadcrumbs } from './Breadcrumbs'
import { Avatar } from '../ui/Avatar'
import { NotificationDrawer } from './NotificationDrawer'

interface HeaderProps {
  onOpenMobileMenu: () => void
  onOpenSearch: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, onOpenSearch }) => {
  const { user, logout, switchRole } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const loadNotifications = () => {
    notificationService.getAll().then(setNotifications)
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  // Current formatted date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-[#FFFEFA]/90 backdrop-blur-md border-b border-edge px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side: Hamburger & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-ink-secondary hover:text-ink-main hover:bg-black/5 flex-shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 overflow-hidden">
            <Breadcrumbs />
          </div>
        </div>

        {/* Right side: Search, Date, Notifications, User Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Global Search trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-ivory-page border border-edge text-ink-secondary hover:border-edge-dark hover:text-ink-main transition-all text-xs"
            title="Global search (Ctrl + K)"
          >
            <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-bold text-ink-secondary bg-[#FFFEFA] border border-edge-dark/60 rounded">
              Ctrl+K
            </kbd>
          </button>

          {/* Current Date (hidden on mobile and tablet) */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-ink-secondary font-medium">
            <Calendar className="w-3.5 h-3.5 text-plum" />
            <span>{todayFormatted}</span>
          </div>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-lg text-ink-secondary hover:text-ink-main hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta ring-2 ring-[#FFFEFA]" />
            )}
          </button>

          {/* User Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
              aria-label="User profile menu"
            >
              <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
              <div className="hidden sm:block text-left max-w-[100px] md:max-w-none">
                <div className="text-xs font-semibold text-ink-main leading-none truncate">
                  {user?.name}
                </div>
                <div className="text-[10px] text-ink-secondary mt-0.5 truncate">
                  {user?.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-ink-secondary hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-[#FFFEFA] border border-edge rounded-xl shadow-modal py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-edge/60">
                    <div className="text-xs font-bold text-ink-main truncate">{user?.name}</div>
                    <div className="text-[11px] text-ink-secondary truncate">{user?.email}</div>
                    <div className="mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-plum/10 text-plum">
                      {user?.role} Mode
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/people/emp-101"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-ink-main hover:bg-ivory-page transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-ink-secondary" />
                      <span>View Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-ink-main hover:bg-ivory-page transition-colors"
                    >
                      <Settings className="w-4 h-4 text-ink-secondary" />
                      <span>Settings & Preferences</span>
                    </Link>
                  </div>

                  {/* Quick Role Switch for Testing Requirements */}
                  <div className="px-4 py-2 border-t border-edge/60 bg-ivory-page/30">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary mb-1">
                      Role Preview
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {(['Admin', 'HR Manager', 'Employee'] as const).map(role => (
                        <button
                          key={role}
                          onClick={() => {
                            switchRole(role)
                            setIsUserMenuOpen(false)
                          }}
                          className={`text-[10px] py-1 text-center rounded font-semibold transition-colors ${
                            user?.role === role
                              ? 'bg-plum text-white'
                              : 'bg-edge/60 text-ink-main hover:bg-edge'
                          }`}
                        >
                          {role === 'HR Manager' ? 'HR' : role}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 mt-1 border-t border-edge/60">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        logout()
                        navigate('/login')
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onRefresh={loadNotifications}
      />
    </>
  )
}
