import React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options?: SelectOption[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, children, id, ...props }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-[#FFFEFA] border border-edge rounded-lg px-3.5 py-2 pr-10 text-sm text-ink-main appearance-none',
              'transition-all duration-150 focus:outline-none focus:border-plum focus:ring-2 focus:ring-plum/15',
              'disabled:bg-ivory-page disabled:text-ink-secondary disabled:cursor-not-allowed cursor-pointer',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              className
            )}
            {...props}
          >
            {options
              ? options.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-secondary">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-ink-secondary">{helperText}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
