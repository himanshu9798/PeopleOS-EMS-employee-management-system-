import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarOff,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Building,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { cn } from '../../utils/cn'
import { UserRole } from '../../types'

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}

interface NavItem {
  name: string
  path: string
  icon: React.ElementType
  badge?: string
  allowedRoles?: UserRole[]
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { user, logout, switchRole } = useAuth()
  const location = useLocation()
  const [showRoleMenu, setShowRoleMenu] = useState(false)
  const [currentWorkspace, setCurrentWorkspace] = useState('India HQ - Bengaluru')
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)

  const workspaces = ['India HQ - Bengaluru', 'Mumbai Tech Hub', 'Delhi NCR Operations']

  const workspaceNav: NavItem[] = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'People', path: '/people', icon: Users },
    { name: 'Departments', path: '/departments', icon: Building2, allowedRoles: ['Admin', 'HR Manager'] },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { name: 'Leave Management', path: '/leave', icon: CalendarOff },
  ]

  const managementNav: NavItem[] = [
    { name: 'Payroll', path: '/payroll', icon: CreditCard, allowedRoles: ['Admin'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, allowedRoles: ['Admin'] },
  ]

  const systemNav: NavItem[] = [
    { name: 'Settings', path: '/settings', icon: Settings, allowedRoles: ['Admin'] },
  ]

  const renderNavGroup = (title: string, items: NavItem[]) => {
    const visibleItems = items.filter(
      item => !item.allowedRoles || (user?.role && item.allowedRoles.includes(user.role))
    )

    if (visibleItems.length === 0) return null

    return (
      <div className="mb-6">
        {!isCollapsed && (
          <h4 className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#D5CFC2]/60 select-none">
            {title}
          </h4>
        )}
        <div className="space-y-1">
          {visibleItems.map(item => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path)

            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive: active }) =>
                  cn(
                    'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all select-none',
                    active || isActive
                      ? 'bg-[#3D2D46] text-[#FFFEFA] font-semibold shadow-sm'
                      : 'text-[#D5CFC2] hover:bg-[#3D2D46]/60 hover:text-white',
                    isCollapsed && 'justify-center px-2'
                  )
                }
                title={isCollapsed ? item.name : undefined}
              >
                {/* Slim terracotta indicator for active link */}
                {(isActive || (item.path === '/' && location.pathname === '/')) && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-terracotta rounded-r-md" />
                )}
                <Icon
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-colors',
                    isActive ? 'text-terracotta-light' : 'text-[#D5CFC2] group-hover:text-white'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
                {!isCollapsed && item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-semibold bg-terracotta/20 text-terracotta-light">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#33263B] text-[#F6F2E9] select-none border-r border-[#493653]/40">
      {/* Brand & Collapse Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#493653]/60">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#493653] to-[#271C2E] border border-terracotta/40 flex items-center justify-center shadow-soft">
              <span className="font-serif text-lg font-bold text-terracotta">P</span>
            </div>
            <div>
              <div className="font-serif text-lg font-semibold tracking-tight leading-none text-[#FFFEFA]">
                PeopleOS
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-terracotta mt-0.5">
                PEOPLE OPERATIONS
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-8 h-8 rounded-lg bg-[#493653] border border-terracotta/40 flex items-center justify-center">
            <span className="font-serif text-lg font-bold text-terracotta">P</span>
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-[#D5CFC2] hover:text-white hover:bg-[#493653] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-[#D5CFC2] hover:text-white hover:bg-[#493653]"
          aria-label="Close mobile sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Workspace Selector */}
      {!isCollapsed && (
        <div className="p-3 border-b border-[#493653]/40 relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="w-full flex items-center justify-between gap-2 p-2 rounded-lg bg-[#271C2E]/60 border border-[#493653]/50 hover:border-terracotta/40 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Building className="w-3.5 h-3.5 text-terracotta flex-shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-[#D5CFC2]/70 uppercase font-semibold tracking-wider">
                  Workspace
                </div>
                <div className="text-xs font-medium text-[#FFFEFA] truncate">
                  {currentWorkspace}
                </div>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#D5CFC2] flex-shrink-0" />
          </button>

          {showWorkspaceMenu && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-[#271C2E] border border-[#493653] rounded-lg shadow-dropdown p-1 z-30">
              {workspaces.map(w => (
                <button
                  key={w}
                  onClick={() => {
                    setCurrentWorkspace(w)
                    setShowWorkspaceMenu(false)
                  }}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-xs rounded transition-colors',
                    w === currentWorkspace ? 'bg-[#3D2D46] text-white font-medium' : 'text-[#D5CFC2] hover:bg-[#3D2D46]/60'
                  )}
                >
                  {w}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {renderNavGroup('WORKSPACE', workspaceNav)}
        {renderNavGroup('MANAGEMENT', managementNav)}
        {renderNavGroup('SYSTEM', systemNav)}
      </div>

      {/* User Profile Section at Bottom */}
      <div className="p-3 border-t border-[#493653]/60 bg-[#271C2E]/80 relative">
        <div
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg hover:bg-[#3D2D46] transition-colors cursor-pointer',
            isCollapsed && 'justify-center p-1'
          )}
        >
          <Avatar
            src={user?.avatar}
            name={user?.name || 'User'}
            size={isCollapsed ? 'sm' : 'md'}
            status="online"
          />
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#FFFEFA] truncate">
                  {user?.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-terracotta/20 text-terracotta-light font-bold">
                  {user?.role}
                </span>
              </div>
              <div className="text-[11px] text-[#D5CFC2]/80 truncate">
                {user?.designation}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher & Profile Dropdown */}
        {showRoleMenu && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-[#271C2E] border border-[#493653] rounded-xl shadow-modal p-2 z-40">
            <div className="px-2 py-1.5 border-b border-[#493653]/60 text-[11px] font-semibold text-[#D5CFC2] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
              <span>Switch Demo Role</span>
            </div>
            <div className="py-1 space-y-0.5">
              {(['Admin', 'HR Manager', 'Employee'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role)
                    setShowRoleMenu(false)
                  }}
                  className={cn(
                    'w-full text-left px-2 py-1.5 text-xs rounded flex items-center justify-between transition-colors',
                    user?.role === role
                      ? 'bg-plum text-white font-semibold'
                      : 'text-[#D5CFC2] hover:bg-[#3D2D46]'
                  )}
                >
                  <span>{role}</span>
                  {user?.role === role && <span className="text-[10px] text-terracotta">Active</span>}
                </button>
              ))}
            </div>

            <div className="pt-1 mt-1 border-t border-[#493653]/60">
              <button
                onClick={() => {
                  setShowRoleMenu(false)
                  logout()
                }}
                className="w-full text-left px-2 py-1.5 text-xs text-red-300 hover:bg-red-950/40 rounded flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (persistent approx 250px or collapsed) */}
      <aside
        className={cn(
          'hidden md:block transition-all duration-200 z-30 h-screen sticky top-0 flex-shrink-0',
          isCollapsed ? 'w-20' : 'w-[250px]'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-[270px] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
