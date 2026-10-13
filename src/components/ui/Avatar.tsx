import React, { useState } from 'react'
import { getInitials } from '../../utils/formatters'
import { cn } from '../../utils/cn'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'offline' | 'busy' | 'away'
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(false)

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  }

  const initials = getInitials(name)

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)} {...props}>
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-semibold border border-edge/60',
          'bg-[#493653]/10 text-plum select-none',
          sizeClasses[size]
        )}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={name}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white',
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3',
            status === 'online' && 'bg-emerald-500',
            status === 'busy' && 'bg-red-500',
            status === 'away' && 'bg-amber-500',
            status === 'offline' && 'bg-gray-400'
          )}
        />
      )}
    </div>
  )
}
