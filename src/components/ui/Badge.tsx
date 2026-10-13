import React from 'react'
import { cn } from '../../utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 
    | 'default'
    | 'active'
    | 'on-leave'
    | 'probation'
    | 'inactive'
    | 'present'
    | 'late'
    | 'absent'
    | 'half-day'
    | 'approved'
    | 'rejected'
    | 'pending'
    | 'paid'
    | 'processing'
    | 'terracotta'
    | 'plum'
    | 'sage'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'active':
      case 'present':
      case 'approved':
      case 'paid':
      case 'sage':
        return 'bg-[#EDF3EA] text-[#2F542A] border-[#DCE6D7]'

      case 'late':
      case 'probation':
      case 'terracotta':
        return 'bg-[#FAF0EB] text-[#AF5F41] border-[#F2D7CD]'

      case 'on-leave':
      case 'processing':
      case 'plum':
        return 'bg-[#F4EEF7] text-[#493653] border-[#E3D6E8]'

      case 'pending':
      case 'half-day':
        return 'bg-[#FFF9EB] text-[#8C6212] border-[#F5E6BF]'

      case 'absent':
      case 'rejected':
        return 'bg-[#FFF1F0] text-[#9B2C2C] border-[#FBD5D5]'

      case 'inactive':
        return 'bg-[#EFECE6] text-[#77786F] border-[#E0DCD4]'

      case 'default':
      default:
        return 'bg-[#F6F2E9] text-[#252923] border-[#E5E0D5]'
    }
  }

  const getDotColor = () => {
    switch (variant) {
      case 'active':
      case 'present':
      case 'approved':
      case 'paid':
      case 'sage':
        return 'bg-[#355E32]'

      case 'late':
      case 'probation':
      case 'terracotta':
        return 'bg-[#C87555]'

      case 'on-leave':
      case 'processing':
      case 'plum':
        return 'bg-[#493653]'

      case 'pending':
      case 'half-day':
        return 'bg-[#B47818]'

      case 'absent':
      case 'rejected':
        return 'bg-[#C83535]'

      case 'inactive':
        return 'bg-[#9E9F96]'

      default:
        return 'bg-[#77786F]'
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide whitespace-nowrap',
        getStyles(),
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', getDotColor())} />}
      {children}
    </span>
  )
}
