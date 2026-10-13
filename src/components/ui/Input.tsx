import React from 'react'
import { cn } from '../../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, startIcon, endIcon, id, ...props }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined)

    return (
      <div className="w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3 text-ink-secondary pointer-events-none flex items-center">
              {startIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full bg-[#FFFEFA] border border-edge rounded-lg px-3.5 py-2 text-sm text-ink-main placeholder:text-ink-secondary/50',
              'transition-all duration-150 focus:outline-none focus:border-plum focus:ring-2 focus:ring-plum/15',
              'disabled:bg-ivory-page disabled:text-ink-secondary disabled:cursor-not-allowed',
              startIcon && 'pl-9',
              endIcon && 'pr-9',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              className
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-3 text-ink-secondary flex items-center">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1 text-xs text-ink-secondary">{helperText}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
