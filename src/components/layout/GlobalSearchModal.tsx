import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Users, Compass, ArrowRight, CornerDownLeft, X } from 'lucide-react'
import { employeeService } from '../../services/employeeService'
import { Employee, UserRole } from '../../types'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../utils/cn'

interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResultItem {
  id: string
  title: string
  subtitle: string
  category: 'page' | 'employee'
  path: string
  avatar?: string
  badge?: string
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const allPages: { title: string; subtitle: string; path: string; allowedRoles?: UserRole[] }[] = [
    { title: 'Overview Dashboard', subtitle: 'Workforce KPIs & daily metrics', path: '/' },
    { title: 'Employee Directory', subtitle: 'Search and manage all team members', path: '/people' },
    { title: 'Departments', subtitle: 'Company structure and team leads', path: '/departments', allowedRoles: ['Admin', 'HR Manager'] },
    { title: 'Attendance Management', subtitle: 'Daily check-ins, logs, and hours', path: '/attendance' },
    { title: 'Leave Management', subtitle: 'Review and approve time-off requests', path: '/leave' },
    { title: 'Payroll Records', subtitle: 'Salary batches, earnings, and payslips', path: '/payroll', allowedRoles: ['Admin'] },
    { title: 'Workforce Analytics', subtitle: 'Headcount trends and department charts', path: '/analytics', allowedRoles: ['Admin'] },
    { title: 'System Settings', subtitle: 'Organization info, roles, and preferences', path: '/settings', allowedRoles: ['Admin'] },
  ]

  const pages = allPages.filter(p => !p.allowedRoles || (user?.role && p.allowedRoles.includes(user.role)))

  useEffect(() => {
    if (isOpen) {
      employeeService.getAll().then(setEmployees)
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Filter results
  const results: SearchResultItem[] = []
  const cleanQuery = query.toLowerCase().trim()

  if (cleanQuery.length === 0) {
    // Show quick navigation
    pages.slice(0, 4).forEach(p => {
      results.push({
        id: `page-${p.path}`,
        title: p.title,
        subtitle: p.subtitle,
        category: 'page',
        path: p.path,
      })
    })
    // And first few employees
    employees.slice(0, 3).forEach(e => {
      results.push({
        id: `emp-${e.id}`,
        title: e.fullName,
        subtitle: `${e.designation} • ${e.department}`,
        category: 'employee',
        path: `/people/${e.id}`,
        avatar: e.avatar,
        badge: e.employeeId,
      })
    })
  } else {
    // Match pages
    pages.forEach(p => {
      if (p.title.toLowerCase().includes(cleanQuery) || p.subtitle.toLowerCase().includes(cleanQuery)) {
        results.push({
          id: `page-${p.path}`,
          title: p.title,
          subtitle: p.subtitle,
          category: 'page',
          path: p.path,
        })
      }
    })

    // Match employees
    employees.forEach(e => {
      if (
        e.fullName.toLowerCase().includes(cleanQuery) ||
        e.employeeId.toLowerCase().includes(cleanQuery) ||
        e.workEmail.toLowerCase().includes(cleanQuery) ||
        e.department.toLowerCase().includes(cleanQuery) ||
        e.designation.toLowerCase().includes(cleanQuery)
      ) {
        results.push({
          id: `emp-${e.id}`,
          title: e.fullName,
          subtitle: `${e.designation} • ${e.department} (${e.employeeId})`,
          category: 'employee',
          path: `/people/${e.id}`,
          avatar: e.avatar,
          badge: e.status,
        })
      }
    })
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleSelect = (item: SearchResultItem) => {
    navigate(item.path)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#33263B]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search dialog */}
      <div
        className="relative w-full max-w-xl bg-[#FFFEFA] border border-edge rounded-2xl shadow-modal overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-edge bg-ivory-card">
          <Search className="w-5 h-5 text-plum flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search employees, departments, or navigate... (e.g. 'Aarav', 'Payroll', 'ENG')"
            className="w-full bg-transparent border-0 px-3 py-1 text-sm text-ink-main placeholder:text-ink-secondary/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-ink-secondary hover:text-ink-main p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="ml-2 hidden sm:inline-block text-[10px] font-bold text-ink-secondary bg-edge px-1.5 py-0.5 rounded border border-edge-dark/60">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-ink-secondary">
              <Search className="w-8 h-8 mx-auto text-ink-secondary/40 mb-2" />
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-ink-secondary/70 mt-1">
                Try searching by employee name, role, department or page title.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-secondary">
                {query ? 'Matching Results' : 'Suggestions'}
              </div>

              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors',
                      isSelected
                        ? 'bg-[#493653]/10 text-plum'
                        : 'hover:bg-ivory-page/70 text-ink-main'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.category === 'employee' ? (
                        <Avatar src={item.avatar} name={item.title} size="sm" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-plum/10 text-plum flex items-center justify-center flex-shrink-0">
                          <Compass className="w-4 h-4" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold truncate leading-tight">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-edge text-ink-secondary">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ink-secondary truncate leading-tight mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-edge text-ink-secondary">
                        {item.category}
                      </span>
                      {isSelected && (
                        <CornerDownLeft className="w-3.5 h-3.5 text-terracotta" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-edge bg-ivory-page/40 flex items-center justify-between text-[11px] text-ink-secondary">
          <div className="flex items-center gap-3">
            <span>
              Use <kbd className="px-1 py-0.5 bg-[#FFFEFA] border rounded text-[10px]">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 bg-[#FFFEFA] border rounded text-[10px]">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#FFFEFA] border rounded text-[10px]">↵</kbd> to select
            </span>
          </div>
          <span className="text-plum font-semibold">PeopleOS Search</span>
        </div>
      </div>
    </div>
  )
}
