import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, MoreHorizontal, Eye, Edit2, UserX } from 'lucide-react'
import { Employee } from '../../types'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'
import { cn } from '../../utils/cn'

interface EmployeeGridProps {
  employees: Employee[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onEdit: (employee: Employee) => void
  onDeactivate: (employee: Employee) => void
  canManage?: boolean
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({
  employees,
  selectedIds,
  onToggleSelect,
  onEdit,
  onDeactivate,
  canManage = true,
}) => {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {employees.map(emp => {
        const isSelected = selectedIds.includes(emp.id)

        return (
          <Card
            key={emp.id}
            className={cn(
              'p-5 relative flex flex-col justify-between hover:shadow-card transition-all',
              isSelected && 'ring-2 ring-plum/40 bg-plum/5'
            )}
          >
            {/* Top row: Checkbox, Badge & Actions */}
            <div className="flex items-center justify-between gap-2 mb-3">
              {canManage && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(emp.id)}
                  className="rounded border-edge text-plum focus:ring-plum/30 cursor-pointer"
                  aria-label={`Select ${emp.fullName}`}
                />
              )}

              <div className="flex items-center gap-1.5 ml-auto">
                <Badge variant={getStatusBadgeVariant(emp.status)} dot>
                  {emp.status}
                </Badge>

                {/* Dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenuId(activeMenuId === emp.id ? null : emp.id)
                    }
                    className="p-1 rounded text-ink-secondary hover:text-ink-main hover:bg-black/5"
                    aria-label="Actions"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {activeMenuId === emp.id && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setActiveMenuId(null)}
                      />
                      <div className="absolute right-0 mt-1 w-36 bg-[#FFFEFA] border border-edge rounded-xl shadow-modal py-1 z-30 text-xs">
                        <Link
                          to={`/people/${emp.id}`}
                          onClick={() => setActiveMenuId(null)}
                          className="flex items-center gap-2 px-3 py-1.5 text-ink-main hover:bg-ivory-page"
                        >
                          <Eye className="w-3.5 h-3.5 text-plum" />
                          <span>View Profile</span>
                        </Link>
                        {canManage && (
                          <>
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
                              <span>Deactivate</span>
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center text-center my-2">
              <Link to={`/people/${emp.id}`}>
                <Avatar
                  src={emp.avatar}
                  name={emp.fullName}
                  size="xl"
                  className="mb-3 hover:scale-105 transition-transform"
                />
              </Link>
              <Link
                to={`/people/${emp.id}`}
                className="text-base font-bold text-ink-main hover:text-plum transition-colors"
              >
                {emp.fullName}
              </Link>
              <p className="text-xs font-semibold text-terracotta mt-0.5">
                {emp.designation}
              </p>
              <span className="text-[11px] font-medium text-ink-secondary mt-1 px-2.5 py-0.5 rounded-full bg-ivory-page border border-edge">
                {emp.department} • {emp.employeeId}
              </span>
            </div>

            {/* Contact details & meta */}
            <div className="mt-4 pt-3 border-t border-edge/60 space-y-1.5 text-xs text-ink-secondary">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-plum flex-shrink-0" />
                <span className="truncate">{emp.workEmail}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Phone className="w-3.5 h-3.5 text-plum flex-shrink-0" />
                <span className="truncate">{emp.phone}</span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-plum flex-shrink-0" />
                <span className="truncate">{emp.workLocation}</span>
              </div>
            </div>

            {/* View profile button */}
            <Link
              to={`/people/${emp.id}`}
              className="mt-4 w-full py-1.5 text-center text-xs font-semibold rounded-lg bg-ivory-page border border-edge text-plum hover:bg-plum hover:text-white transition-all block"
            >
              View Full Profile
            </Link>
          </Card>
        )
      })}
    </div>
  )
}
