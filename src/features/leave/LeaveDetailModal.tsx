import React from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { LeaveRequest } from '../../types'
import { formatDate } from '../../utils/formatters'

interface LeaveDetailModalProps {
  isOpen: boolean
  onClose: () => void
  leave: LeaveRequest | null
  onApprove?: (leave: LeaveRequest) => void
  onReject?: (leave: LeaveRequest) => void
  canManage?: boolean
}

export const LeaveDetailModal: React.FC<LeaveDetailModalProps> = ({
  isOpen,
  onClose,
  leave,
  onApprove,
  onReject,
  canManage,
}) => {
  if (!leave) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Leave Request Details"
      description={`Reference ID: ${leave.id}`}
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            {leave.status === 'Pending' && canManage && onReject && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onClose()
                  onReject(leave)
                }}
              >
                Reject Request
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            {leave.status === 'Pending' && canManage && onApprove && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose()
                  onApprove(leave)
                }}
              >
                Approve Request
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Employee Header */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-ivory-page/60 border border-edge/60">
          <Avatar src={leave.employeeAvatar} name={leave.employeeName} size="md" />
          <div className="flex-1 min-w-0">
            <Link
              to={`/people/${leave.employeeId}`}
              className="font-bold text-sm text-ink-main hover:text-plum truncate block"
            >
              {leave.employeeName}
            </Link>
            <span className="text-xs text-ink-secondary truncate block">
              {leave.employeeDepartment}
            </span>
          </div>
          <Badge
            variant={
              leave.status === 'Approved'
                ? 'approved'
                : leave.status === 'Rejected'
                ? 'rejected'
                : 'pending'
            }
            dot
          >
            {leave.status}
          </Badge>
        </div>

        {/* Request details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-ivory-card border border-edge">
            <span className="text-ink-secondary text-[11px] block">Leave Category</span>
            <span className="font-bold text-ink-main text-sm mt-0.5 block">
              {leave.leaveType}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-ivory-card border border-edge">
            <span className="text-ink-secondary text-[11px] block">Total Duration</span>
            <span className="font-bold text-plum text-sm mt-0.5 block font-mono">
              {leave.totalDays} day(s)
            </span>
          </div>

          <div className="p-3 rounded-lg bg-ivory-card border border-edge">
            <span className="text-ink-secondary text-[11px] block">Start Date</span>
            <span className="font-semibold text-ink-main mt-0.5 block">
              {formatDate(leave.startDate)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-ivory-card border border-edge">
            <span className="text-ink-secondary text-[11px] block">End Date</span>
            <span className="font-semibold text-ink-main mt-0.5 block">
              {formatDate(leave.endDate)}
            </span>
          </div>
        </div>

        {/* Reason */}
        <div className="p-3 rounded-lg bg-ivory-card border border-edge text-xs">
          <span className="text-ink-secondary text-[11px] block font-semibold mb-1">
            Reason for Absence
          </span>
          <p className="text-ink-main leading-relaxed italic bg-ivory-page/40 p-2.5 rounded border border-edge/60">
            &ldquo;{leave.reason}&rdquo;
          </p>
        </div>

        {/* Approver remarks if any */}
        {leave.approverRemarks && (
          <div className="p-3 rounded-lg bg-[#FAF9F6] border border-edge text-xs">
            <span className="text-ink-secondary text-[11px] block font-semibold mb-1">
              Supervisor Notes & Decision Remarks
            </span>
            <p className="text-ink-main font-medium leading-relaxed">
              {leave.approverRemarks}
            </p>
            {leave.approvedBy && (
              <span className="text-[10px] text-ink-secondary mt-1 block">
                Reviewed by {leave.approvedBy} on {leave.updatedAt ? formatDate(leave.updatedAt) : 'recently'}
              </span>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
