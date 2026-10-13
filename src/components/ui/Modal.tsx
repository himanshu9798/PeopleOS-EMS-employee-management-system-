import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#33263B]/60 backdrop-blur-[2px] transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full max-w-[95vw] bg-[#FFFEFA] border border-edge rounded-2xl shadow-modal z-10 overflow-hidden flex flex-col max-h-[92dvh]',
          'animate-in zoom-in-95 duration-200',
          sizeClasses[size]
        )}
      >
        {/* Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-5 border-b border-edge/70 flex items-start justify-between bg-ivory-card">
          <div className="min-w-0 pr-2">
            {title && (
              <h2 className="text-base sm:text-lg font-semibold text-ink-main tracking-tight font-serif sm:font-sans truncate">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-[11px] sm:text-xs text-ink-secondary mt-0.5 leading-relaxed line-clamp-2">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-ink-secondary hover:text-ink-main hover:bg-black/5 p-1.5 rounded-lg transition-colors ml-2 -mt-1 cursor-pointer flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-edge/70 bg-ivory-page/40 flex items-center justify-end gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
