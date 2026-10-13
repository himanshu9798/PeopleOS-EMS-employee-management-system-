import React from 'react'
import { cn } from '../../utils/cn'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number | string
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
  variant?: 'underline' | 'pill'
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
}) => {
  if (variant === 'pill') {
    return (
      <div className={cn('flex items-center gap-1.5 p-1 bg-ivory-page rounded-xl border border-edge overflow-x-auto no-scrollbar max-w-full flex-nowrap', className)}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none whitespace-nowrap flex-shrink-0',
                isActive
                  ? 'bg-[#FFFEFA] text-plum shadow-soft font-bold'
                  : 'text-ink-secondary hover:text-ink-main hover:bg-black/5'
              )}
            >
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px]',
                    isActive ? 'bg-plum/10 text-plum' : 'bg-edge text-ink-secondary'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn('border-b border-edge flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar max-w-full flex-nowrap', className)}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'group relative flex items-center gap-2 pb-3 pt-1 text-xs sm:text-sm font-medium transition-colors cursor-pointer select-none whitespace-nowrap flex-shrink-0',
              isActive ? 'text-plum font-semibold' : 'text-ink-secondary hover:text-ink-main'
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold',
                  isActive ? 'bg-plum/10 text-plum' : 'bg-edge/80 text-ink-secondary'
                )}
              >
                {tab.count}
              </span>
            )}
            {/* Slim terracotta indicator */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta rounded-t-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
