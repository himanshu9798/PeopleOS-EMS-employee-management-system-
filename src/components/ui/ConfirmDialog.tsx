import React from 'react'
import { AlertTriangle, AlertCircle, Info } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

export interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean
  isLoading?: boolean
  iconType?: 'danger' | 'warning' | 'info'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  iconType = 'danger',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 py-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isDestructive
              ? 'bg-red-50 text-red-600'
              : iconType === 'warning'
              ? 'bg-amber-50 text-terracotta'
              : 'bg-plum/10 text-plum'
          }`}
        >
          {isDestructive ? (
            <AlertCircle className="w-5 h-5" />
          ) : iconType === 'warning' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>
        <div>
          <h4 className="text-base font-semibold text-ink-main leading-tight mb-1.5">{title}</h4>
          <p className="text-sm text-ink-secondary leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  )
}
