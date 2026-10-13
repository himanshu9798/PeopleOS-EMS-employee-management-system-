import React from 'react'
import { Link } from 'react-router-dom'
import { Edit2, Clock } from 'lucide-react'
import { AttendanceRecord } from '../../types'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { formatTime } from '../../utils/formatters'

interface AttendanceTableProps {
  records: AttendanceRecord[]
  onEdit: (record: AttendanceRecord) => void
  canManage?: boolean
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  onEdit,
  canManage = true,
}) => {
  const getBadgeVariant = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'Present':
        return 'present'
      case 'Late':
        return 'late'
      case 'Absent':
        return 'absent'
      case 'On Leave':
        return 'on-leave'
      case 'Half Day':
        return 'half-day'
      default:
        return 'default'
    }
  }

  return (
    <div className="w-full rounded-xl border border-edge bg-[#FFFEFA] shadow-soft overflow-hidden">
      {/* Mobile Card List (< sm: 640px) */}
      <div className="block sm:hidden divide-y divide-edge/70">
        {records.length === 0 ? (
          <div className="py-12 text-center text-ink-secondary p-4">
            <Clock className="w-8 h-8 mx-auto text-ink-secondary/40 mb-2" />
            <p className="text-sm font-semibold text-ink-main">No attendance records found</p>
            <p className="text-xs text-ink-secondary mt-0.5">Try adjusting your filters or date selection.</p>
          </div>
        ) : (
          records.map(rec => (
            <div key={rec.id} className="p-4 space-y-3 hover:bg-ivory-page/30 transition-colors">
              {/* Header: Avatar, Name, Dept & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Link to={`/people/${rec.employeeId}`} className="flex-shrink-0">
                    <Avatar src={rec.employeeAvatar} name={rec.employeeName} size="md" />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      to={`/people/${rec.employeeId}`}
                      className="font-bold text-ink-main hover:text-plum transition-colors block text-sm truncate"
                    >
                      {rec.employeeName}
                    </Link>
                    <span className="text-[11px] text-ink-secondary block">
                      {rec.employeeDepartment}
                    </span>
                  </div>
                </div>

                <Badge variant={getBadgeVariant(rec.status)} dot className="flex-shrink-0">
                  {rec.status}
                </Badge>
              </div>

              {/* Times & Hours Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs bg-ivory-page/60 p-2.5 rounded-lg border border-edge/60 text-center">
                <div>
                  <span className="text-[10px] text-ink-secondary uppercase font-semibold block">Check-in</span>
                  <span className="font-mono font-medium text-ink-main">{formatTime(rec.checkIn)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-secondary uppercase font-semibold block">Check-out</span>
                  <span className="font-mono font-medium text-ink-main">{formatTime(rec.checkOut)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-secondary uppercase font-semibold block">Working</span>
                  <span className="font-mono font-bold text-plum">{rec.workingHours > 0 ? `${rec.workingHours}h` : '—'}</span>
                </div>
              </div>

              {/* Notes & Edit Action */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-edge/40">
                <span className="text-xs text-ink-secondary truncate flex-1 italic">
                  {rec.notes ? `“${rec.notes}”` : 'No notes'}
                </span>
                {canManage && (
                  <button
                    onClick={() => onEdit(rec)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-plum bg-plum/10 hover:bg-plum/15 transition-colors flex-shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Record</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop & Tablet Table (>= sm: 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[720px]">
          <thead className="bg-ivory-page/80 border-b border-edge text-ink-secondary uppercase tracking-wider font-semibold select-none">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Check-in</th>
              <th className="py-3 px-4">Check-out</th>
              <th className="py-3 px-4">Working Hours</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Notes</th>
              {canManage && <th className="py-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/70">
            {records.length === 0 ? (
              <tr>
                <td colSpan={canManage ? 8 : 7} className="py-12 text-center text-ink-secondary">
                  <Clock className="w-8 h-8 mx-auto text-ink-secondary/40 mb-2" />
                  <p className="text-sm font-semibold text-ink-main">No attendance records found</p>
                  <p className="text-xs text-ink-secondary mt-0.5">Try adjusting your filters or date selection.</p>
                </td>
              </tr>
            ) : (
              records.map(rec => (
                <tr key={rec.id} className="hover:bg-ivory-page/50 transition-colors">
                  {/* Employee */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/people/${rec.employeeId}`}>
                        <Avatar src={rec.employeeAvatar} name={rec.employeeName} size="sm" />
                      </Link>
                      <div>
                        <Link
                          to={`/people/${rec.employeeId}`}
                          className="font-semibold text-ink-main hover:text-plum transition-colors block text-sm"
                        >
                          {rec.employeeName}
                        </Link>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 font-medium text-ink-main">
                    {rec.employeeDepartment}
                  </td>

                  {/* Check In */}
                  <td className="py-3.5 px-4 font-mono font-medium text-ink-main">
                    {formatTime(rec.checkIn)}
                  </td>

                  {/* Check Out */}
                  <td className="py-3.5 px-4 font-mono font-medium text-ink-main">
                    {formatTime(rec.checkOut)}
                  </td>

                  {/* Working Hours */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-ink-main font-mono">
                      {rec.workingHours > 0 ? `${rec.workingHours} hrs` : '—'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <Badge variant={getBadgeVariant(rec.status)} dot>
                      {rec.status}
                    </Badge>
                  </td>

                  {/* Notes */}
                  <td className="py-3.5 px-4 text-ink-secondary text-[11px] max-w-[200px] truncate">
                    {rec.notes || '—'}
                  </td>

                  {/* Actions */}
                  {canManage && (
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onEdit(rec)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-plum hover:bg-plum/10 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
