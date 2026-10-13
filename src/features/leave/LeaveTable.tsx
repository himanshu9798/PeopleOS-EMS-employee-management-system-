import React from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Eye, CalendarOff } from 'lucide-react'
import { LeaveRequest } from '../../types'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatters'

interface LeaveTableProps {
  leaves: LeaveRequest[]
  onView: (leave: LeaveRequest) => void
  onApprove: (leave: LeaveRequest) => void
  onReject: (leave: LeaveRequest) => void
  userRole?: string
}

export const LeaveTable: React.FC<LeaveTableProps> = ({
  leaves,
  onView,
  onApprove,
  onReject,
  userRole,
}) => {
  const isAuthorized = userRole === 'Admin' || userRole === 'HR Manager'

  return (
    <div className="w-full rounded-xl border border-edge bg-[#FFFEFA] shadow-soft overflow-hidden">
      {/* Mobile Card List (< sm: 640px) */}
      <div className="block sm:hidden divide-y divide-edge/70">
        {leaves.length === 0 ? (
          <div className="py-12 text-center text-ink-secondary p-4">
            <CalendarOff className="w-8 h-8 mx-auto text-ink-secondary/40 mb-2" />
            <p className="text-sm font-semibold text-ink-main">No leave requests found</p>
            <p className="text-xs text-ink-secondary mt-0.5">Try clearing filters or search terms.</p>
          </div>
        ) : (
          leaves.map(req => (
            <div key={req.id} className="p-4 space-y-3 hover:bg-ivory-page/30 transition-colors">
              {/* Header: Avatar, Name, Dept & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Link to={`/people/${req.employeeId}`} className="flex-shrink-0">
                    <Avatar src={req.employeeAvatar} name={req.employeeName} size="md" />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      to={`/people/${req.employeeId}`}
                      className="font-bold text-ink-main hover:text-plum transition-colors block text-sm truncate"
                    >
                      {req.employeeName}
                    </Link>
                    <span className="text-[11px] text-ink-secondary block">
                      {req.employeeDepartment}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={
                    req.status === 'Approved'
                      ? 'approved'
                      : req.status === 'Rejected'
                      ? 'rejected'
                      : 'pending'
                  }
                  dot
                  className="flex-shrink-0"
                >
                  {req.status}
                </Badge>
              </div>

              {/* Leave Type & Dates Grid */}
              <div className="bg-ivory-page/60 p-2.5 rounded-lg border border-edge/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-plum">{req.leaveType}</span>
                  <span className="font-mono font-bold text-ink-main bg-plum/10 px-2 py-0.5 rounded text-[11px]">
                    {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <div className="text-ink-secondary text-[11px]">
                  {formatDate(req.startDate)} &rarr; {formatDate(req.endDate)}
                </div>
                {req.reason && (
                  <p className="text-ink-secondary italic text-[11px] border-t border-edge/40 pt-1">
                    “{req.reason}”
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-edge/40">
                <button
                  onClick={() => onView(req)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-ink-main bg-ivory-page border border-edge hover:bg-edge/40 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-plum" />
                  <span>Details</span>
                </button>

                {req.status === 'Pending' && isAuthorized && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onApprove(req)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#2F542A] bg-[#EDF3EA] hover:bg-[#E0EBDC] transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onReject(req)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop & Tablet Table (>= sm: 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[780px]">
          <thead className="bg-ivory-page/80 border-b border-edge text-ink-secondary uppercase tracking-wider font-semibold select-none">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Leave Type</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Total Days</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Requested On</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/70">
            {leaves.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-ink-secondary">
                  <CalendarOff className="w-8 h-8 mx-auto text-ink-secondary/40 mb-2" />
                  <p className="text-sm font-semibold text-ink-main">No leave requests found</p>
                  <p className="text-xs text-ink-secondary mt-0.5">Try clearing filters or search terms.</p>
                </td>
              </tr>
            ) : (
              leaves.map(req => (
                <tr key={req.id} className="hover:bg-ivory-page/50 transition-colors">
                  {/* Employee */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/people/${req.employeeId}`}>
                        <Avatar src={req.employeeAvatar} name={req.employeeName} size="sm" />
                      </Link>
                      <div>
                        <Link
                          to={`/people/${req.employeeId}`}
                          className="font-semibold text-ink-main hover:text-plum transition-colors block text-sm"
                        >
                          {req.employeeName}
                        </Link>
                        <span className="text-[11px] text-ink-secondary">{req.employeeDepartment}</span>
                      </div>
                    </div>
                  </td>

                  {/* Leave Type */}
                  <td className="py-3.5 px-4 font-semibold text-ink-main">
                    {req.leaveType}
                  </td>

                  {/* Start Date – End Date */}
                  <td className="py-3.5 px-4 text-ink-secondary whitespace-nowrap">
                    {formatDate(req.startDate)} &rarr; {formatDate(req.endDate)}
                  </td>

                  {/* Total Days */}
                  <td className="py-3.5 px-4 font-bold text-ink-main font-mono">
                    {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                  </td>

                  {/* Reason */}
                  <td className="py-3.5 px-4 text-ink-secondary max-w-[180px] truncate">
                    {req.reason}
                  </td>

                  {/* Request Date */}
                  <td className="py-3.5 px-4 text-ink-secondary whitespace-nowrap">
                    {formatDate(req.requestDate)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        req.status === 'Approved'
                          ? 'approved'
                          : req.status === 'Rejected'
                          ? 'rejected'
                          : 'pending'
                      }
                      dot
                    >
                      {req.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(req)}
                        className="p-1.5 rounded-lg text-ink-secondary hover:text-plum hover:bg-black/5 transition-colors cursor-pointer"
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {req.status === 'Pending' && isAuthorized && (
                        <>
                          <button
                            onClick={() => onApprove(req)}
                            className="p-1.5 rounded-lg text-[#2F542A] hover:bg-[#EDF3EA] transition-colors cursor-pointer"
                            title="Approve Request"
                            aria-label="Approve Request"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => onReject(req)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Reject Request"
                            aria-label="Reject Request"
                          >
                            <X className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
