import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '../utils/cn'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
  title?: string
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, title?: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    const newToast: ToastItem = { id, message, type, title }
    
    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      removeToast(id)
    }, 4500)
  }, [removeToast])

  const success = useCallback((message: string, title?: string) => addToast(message, 'success', title), [addToast])
  const error = useCallback((message: string, title?: string) => addToast(message, 'error', title), [addToast])
  const info = useCallback((message: string, title?: string) => addToast(message, 'info', title), [addToast])
  const warning = useCallback((message: string, title?: string) => addToast(message, 'warning', title), [addToast])

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
      {children}
      
      {/* Toast viewport */}
      <div 
        aria-live="polite" 
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map(t => {
          const isSuccess = t.type === 'success'
          const isError = t.type === 'error'
          const isWarning = t.type === 'warning'

          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-card transition-all transform animate-in slide-in-from-bottom-3 duration-200',
                isSuccess && 'bg-[#FFFEFA] border-sage-dark/30 text-ink-main shadow-soft',
                isError && 'bg-[#FFF8F7] border-red-200 text-[#591C17]',
                isWarning && 'bg-[#FFFDF5] border-amber-200 text-[#684B12]',
                !isSuccess && !isError && !isWarning && 'bg-[#FFFEFA] border-edge text-ink-main'
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#355E32]" />}
                {isError && <AlertCircle className="w-5 h-5 text-[#C83535]" />}
                {isWarning && <AlertTriangle className="w-5 h-5 text-[#C87555]" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-plum" />}
              </div>

              <div className="flex-1 text-sm">
                {t.title && <div className="font-semibold text-xs tracking-wide uppercase text-ink-secondary mb-0.5">{t.title}</div>}
                <div className="leading-snug text-ink-main font-medium">{t.message}</div>
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-ink-secondary hover:text-ink-main p-1 rounded transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
