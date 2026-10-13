import React from 'react'
import { Link } from 'react-router-dom'
import {
  MoreHorizontal,
  Eye,
  Edit2,
  UserX,
  ArrowUpDown,
  Trash2,
  Calendar,
} from 'lucide-react'
import { Employee } from '../../types'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatters'
import { cn } from '../../utils/cn'

interface EmployeeTableProps {
  employees: Employee[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onToggleSelectAll: () => void
  onEdit: (employee: Employee) => void
  onDeactivate: (employee: Employee) => void
  sortField: keyof Employee
  sortDirection: 'asc' | 'desc'
  onSort: (field: keyof Employee) => void
  canManage?: boolean
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDeactivate,
  sortField,
  sortDirection,
  onSort,
  canManage = true,
}) => {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)

  const isAllSelected =
    employees.length > 0 && selectedIds.length === employees.length

  const getStatusBadgeVariant = (status: Employee['status']) => {
    switch (status) {
      case 'Active':
        return 'active'
      case 'On Leave':
        return 'on-leave'
      case 'Probation':
        return 'probation'
      case 'Inactive':
        return 'inactive'
      default:
        return 'default'
    }
  }

  return (
    <div className="w-full rounded-xl border border-edge bg-[#FFFEFA] shadow-soft overflow-hidden">
      {/* Mobile Card List (< sm: 640px) */}
      <div className="block sm:hidden divide-y divide-edge/70">
        {employees.length === 0 ? (
          <div className="py-12 text-center text-ink-secondary p-4">
            <p className="text-sm font-semibold text-ink-main">No employees found</p>
            <p className="text-xs text-ink-secondary mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          employees.map(emp => {
            const isSelected = selectedIds.includes(emp.id)

            return (
              <div
                key={emp.id}
                className={cn(
                  'p-4 transition-colors space-y-3',
                  isSelected && 'bg-plum/5'
                )}
              >
                {/* Top Row: Select, Avatar, Name & Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {canManage && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(emp.id)}
                        className="rounded border-edge text-plum focus:ring-plum/30 cursor-pointer flex-shrink-0"
                        aria-label={`Select ${emp.fullName}`}
                      />
                    )}
                    <Link to={`/people/${emp.id}`} className="flex-shrink-0">
                      <Avatar src={emp.avatar} name={emp.fullName} size="md" />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        to={`/people/${emp.id}`}
                        className="font-bold text-ink-main hover:text-plum transition-colors block text-sm truncate"
                      >
                        {emp.fullName}
                      </Link>
                      <span className="text-[11px] font-mono text-ink-secondary block">
                        {emp.employeeId} • {emp.department}
                      </span>
                    </div>
                  </div>

                  <Badge variant={getStatusBadgeVariant(emp.status)} dot className="flex-shrink-0">
                    {emp.status}
                  </Badge>
                </div>

                {/* Role and Details */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-ivory-page/60 p-2.5 rounded-lg border border-edge/60">
                  <div>
                    <span className="text-[10px] text-ink-secondary uppercase font-semibold block">Designation</span>
                    <span className="font-medium text-ink-main truncate block">{emp.designation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-secondary uppercase font-semibold block">Employment</span>
                    <span className="font-medium text-ink-main">{emp.employmentType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-secondary uppercase font-semibold block">Joined Date</span>
                    <span className="text-ink-secondary">{formatDate(emp.joiningDate)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-secondary uppercase font-semibold block">Work Email</span>
                    <span className="text-ink-secondary truncate block">{emp.workEmail}</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-edge/40">
                  <Link
                    to={`/people/${emp.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-plum bg-plum/10 hover:bg-plum/15 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Profile</span>
                  </Link>

                  {canManage && (
                    <>
                      <button
                        onClick={() => onEdit(emp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-ink-main bg-ivory-page border border-edge hover:bg-edge/40 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-terracotta" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => onDeactivate(emp)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        <span>{emp.status === 'Inactive' ? 'Delete' : 'Deactivate'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Desktop & Tablet Table (>= sm: 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[820px]">
          {/* Table Head */}
          <thead className="bg-ivory-page/80 border-b border-edge text-ink-secondary uppercase tracking-wider font-semibold select-none">
            <tr>
              {canManage && (
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                    className="rounded border-edge text-plum focus:ring-plum/30 cursor-pointer"
                    aria-label="Select all employees"
                  />
                </th>
              )}
              <th
                className="py-3 px-4 cursor-pointer hover:text-ink-main"
                onClick={() => onSort('fullName')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Employee</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-ink-secondary/60" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-ink-main"
                onClick={() => onSort('employeeId')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Employee ID</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-ink-secondary/60" />
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-ink-main"
                onClick={() => onSort('department')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Department</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-ink-secondary/60" />
                </div>
              </th>
              <th className="py-3 px-4">Designation</th>
              <th className="py-3 px-4">Employment Type</th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-ink-main"
                onClick={() => onSort('joiningDate')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Joined</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-ink-secondary/60" />
                </div>
              </th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-edge/70">
            {employees.map(emp => {
              const isSelected = selectedIds.includes(emp.id)

              return (
                <tr
                  key={emp.id}
                  className={cn(
                    'group hover:bg-ivory-page/50 transition-colors',
                    isSelected && 'bg-plum/5'
                  )}
                >
                  {/* Checkbox (Admin & HR Manager only) */}
                  {canManage && (
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(emp.id)}
                        className="rounded border-edge text-plum focus:ring-plum/30 cursor-pointer"
                        aria-label={`Select ${emp.fullName}`}
                      />
                    </td>
                  )}

                  {/* Employee Name & Email */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/people/${emp.id}`}>
                        <Avatar src={emp.avatar} name={emp.fullName} size="md" />
                      </Link>
                      <div>
                        <Link
                          to={`/people/${emp.id}`}
                          className="font-semibold text-ink-main hover:text-plum transition-colors block text-sm"
                        >
                          {emp.fullName}
                        </Link>
                        <span className="text-[11px] text-ink-secondary">{emp.workEmail}</span>
                      </div>
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="py-3.5 px-4 font-mono font-medium text-ink-main">
                    {emp.employeeId}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 font-medium text-ink-main">
                    {emp.department}
                  </td>

                  {/* Designation */}
                  <td className="py-3.5 px-4 text-ink-secondary font-medium truncate max-w-[150px]">
                    {emp.designation}
                  </td>

                  {/* Employment Type */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-ivory-page border border-edge text-ink-main">
                      {emp.employmentType}
                    </span>
                  </td>

                  {/* Joining Date */}
                  <td className="py-3.5 px-4 text-ink-secondary whitespace-nowrap">
                    {formatDate(emp.joiningDate)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={getStatusBadgeVariant(emp.status)} dot>
                      {emp.status}
                    </Badge>
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3.5 px-4 text-right relative">
                    {!canManage ? (
                      <Link
                        to={`/people/${emp.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-plum hover:bg-plum/10 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    ) : (
                      <div className="inline-block text-left">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === emp.id ? null : emp.id)
                          }
                          className="p-1.5 rounded-lg text-ink-secondary hover:text-ink-main hover:bg-black/5 transition-colors cursor-pointer"
                          aria-label="Actions menu"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuId === emp.id && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setActiveMenuId(null)}
                            />
                            <div className="absolute right-4 mt-1 w-36 bg-[#FFFEFA] border border-edge rounded-xl shadow-modal py-1 z-30 text-xs">
                              <Link
                                to={`/people/${emp.id}`}
                                onClick={() => setActiveMenuId(null)}
                                className="flex items-center gap-2 px-3 py-1.5 text-ink-main hover:bg-ivory-page"
                              >
                                <Eye className="w-3.5 h-3.5 text-plum" />
                                <span>View Profile</span>
                              </Link>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null)
                                  onEdit(emp)
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-ink-main hover:bg-ivory-page text-left"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-terracotta" />
                                <span>Edit Details</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveMenuId(null)
                                  onDeactivate(emp)
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left border-t border-edge/60 mt-0.5 pt-1"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span>{emp.status === 'Inactive' ? 'Delete Record' : 'Deactivate'}</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
