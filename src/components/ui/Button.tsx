import React from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'terracotta' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-plum/30 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer'

    const sizeStyles = {
      xs: 'text-xs px-2.5 py-1.5 gap-1.5',
      sm: 'text-sm px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
    }

    const variantStyles = {
      primary:
        'bg-[#493653] text-[#FFFEFA] hover:bg-[#3D2D46] shadow-sm hover:shadow active:bg-[#33263B]',
      secondary:
        'bg-[#FFFEFA] text-ink-main border border-edge hover:bg-ivory-hover hover:border-edge-dark shadow-soft',
      terracotta:
        'bg-[#C87555] text-white hover:bg-[#B26143] shadow-sm hover:shadow',
      outline:
        'bg-transparent text-ink-main border border-edge hover:bg-ivory-hover/60 hover:border-edge-dark',
      ghost:
        'bg-transparent text-ink-main hover:bg-black/5 active:bg-black/10',
      danger:
        'bg-red-600 text-white hover:bg-red-700 shadow-sm active:bg-red-800',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {!isLoading && icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
