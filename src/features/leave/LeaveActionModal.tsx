import React, { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { LeaveRequest } from '../../types'
import { formatDate } from '../../utils/formatters'

interface LeaveActionModalProps {
  isOpen: boolean
  onClose: () => void
  leave: LeaveRequest | null
  action: 'approve' | 'reject'
  onConfirm: (leaveId: string, remarks: string) => Promise<void>
}

export const LeaveActionModal: React.FC<LeaveActionModalProps> = ({
  isOpen,
  onClose,
  leave,
  action,
  onConfirm,
}) => {
  const [remarks, setRemarks] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!leave) return null

  const isApprove = action === 'approve'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onConfirm(leave.id, remarks.trim())
      setRemarks('')
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={isApprove ? 'Approve Leave Request' : 'Reject Leave Request'}
      description={`Request from ${leave.employeeName} for ${leave.totalDays} day(s) of ${leave.leaveType}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant={isApprove ? 'primary' : 'danger'}
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            {isApprove ? 'Confirm Approval' : 'Confirm Rejection'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-ivory-page/60 border border-edge/60 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-ink-secondary">Dates:</span>
            <span className="font-semibold text-ink-main">
              {formatDate(leave.startDate)} – {formatDate(leave.endDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-secondary">Reason:</span>
            <span className="font-medium text-ink-main italic truncate max-w-xs">
              &ldquo;{leave.reason}&rdquo;
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5">
            {isApprove ? 'Approval Remarks (Optional)' : 'Rejection Reason / Remarks *'}
          </label>
          <textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            rows={2}
            placeholder={
              isApprove
                ? 'e.g. Approved. Coverage arranged with team.'
                : 'e.g. Team sprint delivery scheduled on these dates.'
            }
            className="w-full bg-[#FFFEFA] border border-edge rounded-lg px-3.5 py-2 text-sm text-ink-main placeholder:text-ink-secondary/50 focus:outline-none focus:border-plum focus:ring-2 focus:ring-plum/15"
          />
        </div>
      </form>
    </Modal>
  )
}
