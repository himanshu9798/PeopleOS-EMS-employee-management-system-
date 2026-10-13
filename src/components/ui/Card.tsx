import React from 'react'
import { cn } from '../../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

export const Card: React.FC<CardProps> = ({ className, hoverable = false, children, ...props }) => {
  return (
    <div
      className={cn(
        'bg-[#FFFEFA] border border-edge rounded-xl shadow-soft transition-all duration-150',
        hoverable && 'hover:shadow-card hover:border-edge-dark cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('px-4 py-3.5 sm:px-5 sm:py-4 border-b border-edge/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <h3 className={cn('text-base font-semibold text-ink-main tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p className={cn('text-xs text-ink-secondary mt-0.5', className)} {...props}>
      {children}
    </p>
  )
}

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn('p-4 sm:p-5', className)} {...props}>
      {children}
    </div>
  )
}

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn('px-5 py-3 border-t border-edge/60 bg-ivory-page/30 rounded-b-xl flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  )
}
