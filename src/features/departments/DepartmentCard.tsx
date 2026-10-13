import React from 'react'
import { Users, MoreHorizontal, Eye, Edit2, Trash2, Calendar, Shield } from 'lucide-react'
import { Department } from '../../types'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { formatDate } from '../../utils/formatters'

interface DepartmentCardProps {
  department: Department
  onView: (department: Department) => void
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
  isAdmin?: boolean
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  onView,
  onEdit,
  onDelete,
  isAdmin = true,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <Card className="hover:shadow-card transition-all flex flex-col justify-between relative group">
      <div>
        {/* Card Header */}
        <div className="p-5 pb-3 flex items-start justify-between border-b border-edge/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-plum/10 text-plum border border-plum/20">
                {department.code}
              </span>
              <span className="text-[11px] text-ink-secondary">
                Est. {formatDate(department.createdAt)}
              </span>
            </div>
            <h3 className="text-base font-bold text-ink-main mt-1.5 group-hover:text-plum transition-colors">
              {department.name}
            </h3>
          </div>

          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded text-ink-secondary hover:text-ink-main hover:bg-black/5"
              aria-label="Department actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-36 bg-[#FFFEFA] border border-edge rounded-xl shadow-modal py-1 z-30 text-xs">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      onView(department)
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-ink-main hover:bg-ivory-page text-left"
                  >
                    <Eye className="w-3.5 h-3.5 text-plum" />
                    <span>View Team</span>
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          onEdit(department)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-ink-main hover:bg-ivory-page text-left"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-terracotta" />
                        <span>Edit Dept</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          onDelete(department)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left border-t border-edge/60 mt-0.5 pt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 pt-3 space-y-3.5">
          <p className="text-xs text-ink-secondary leading-relaxed line-clamp-2">
            {department.description}
          </p>

          {/* Department Head */}
          <div className="p-2.5 rounded-xl bg-ivory-page/60 border border-edge/60 flex items-center gap-3">
            <Avatar
              src={department.headAvatar}
              name={department.head}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-ink-secondary tracking-wider block">
                Department Head
              </span>
              <span className="text-xs font-semibold text-ink-main truncate block">
                {department.head}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Stats */}
      <div className="px-5 py-3 border-t border-edge/60 bg-ivory-page/30 rounded-b-xl flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-ink-main">
          <Users className="w-3.5 h-3.5 text-plum" />
          <span>
            <strong className="font-bold">{department.employeeCount}</strong> members
          </span>
        </div>

        <button
          onClick={() => onView(department)}
          className="text-xs font-semibold text-plum hover:text-terracotta transition-colors"
        >
          View Team &rarr;
        </button>
      </div>
    </Card>
  )
}
