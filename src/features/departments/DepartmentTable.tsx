import React from 'react'
import { MoreHorizontal, Eye, Edit2, Trash2, Users } from 'lucide-react'
import { Department } from '../../types'
import { Avatar } from '../../components/ui/Avatar'
import { formatDate } from '../../utils/formatters'

interface DepartmentTableProps {
  departments: Department[]
  onView: (department: Department) => void
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
  isAdmin?: boolean
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  onView,
  onEdit,
  onDelete,
  isAdmin = true,
}) => {
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)

  return (
    <div className="w-full rounded-xl border border-edge bg-[#FFFEFA] shadow-soft overflow-hidden">
      {/* Mobile Card List (< sm: 640px) */}
      <div className="block sm:hidden divide-y divide-edge/70">
        {departments.map(dept => (
          <div key={dept.id} className="p-4 space-y-3 hover:bg-ivory-page/30 transition-colors">
            {/* Header: Code & Name */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono font-bold text-xs text-plum bg-plum/10 px-2 py-0.5 rounded">
                  {dept.code}
                </span>
                <h3 className="font-bold text-sm text-ink-main mt-1.5">{dept.name}</h3>
                <p className="text-xs text-ink-secondary mt-0.5 line-clamp-2">
                  {dept.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-ivory-page px-2 py-1 rounded-lg border border-edge text-xs font-bold text-ink-main flex-shrink-0">
                <Users className="w-3.5 h-3.5 text-plum" />
                <span>{dept.employeeCount}</span>
              </div>
            </div>

            {/* Department Head */}
            <div className="flex items-center justify-between text-xs bg-ivory-page/60 p-2.5 rounded-lg border border-edge/60">
              <span className="text-[10px] uppercase font-semibold text-ink-secondary">Dept Head</span>
              <div className="flex items-center gap-2">
                <Avatar src={dept.headAvatar} name={dept.head} size="xs" />
                <span className="font-semibold text-ink-main">{dept.head}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-edge/40">
              <button
                onClick={() => onView(dept)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-plum bg-plum/10 hover:bg-plum/15 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Team</span>
              </button>
              {isAdmin && (
                <>
                  <button
                    onClick={() => onEdit(dept)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-ink-main bg-ivory-page border border-edge hover:bg-edge/40 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-terracotta" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(dept)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop & Tablet Table (>= sm: 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[650px]">
          <thead className="bg-ivory-page/80 border-b border-edge text-ink-secondary uppercase tracking-wider font-semibold select-none">
            <tr>
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Department Name</th>
              <th className="py-3 px-4">Department Head</th>
              <th className="py-3 px-4">Employees</th>
              <th className="py-3 px-4">Established</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/70">
            {departments.map(dept => (
              <tr key={dept.id} className="hover:bg-ivory-page/50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-plum">{dept.code}</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-ink-main block text-sm">{dept.name}</span>
                  <span className="text-[11px] text-ink-secondary truncate max-w-xs block">
                    {dept.description}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <Avatar src={dept.headAvatar} name={dept.head} size="xs" />
                    <span className="font-medium text-ink-main">{dept.head}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-bold text-ink-main">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-plum" />
                    <span>{dept.employeeCount}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-ink-secondary">{formatDate(dept.createdAt)}</td>
                <td className="py-3.5 px-4 text-right relative">
                  {!isAdmin ? (
                    <button
                      onClick={() => onView(dept)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-plum hover:bg-plum/10 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Team</span>
                    </button>
                  ) : (
                    <div className="inline-block text-left">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === dept.id ? null : dept.id)}
                        className="p-1.5 rounded-lg text-ink-secondary hover:text-ink-main hover:bg-black/5 cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {activeMenuId === dept.id && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setActiveMenuId(null)} />
                          <div className="absolute right-4 mt-1 w-36 bg-[#FFFEFA] border border-edge rounded-xl shadow-modal py-1 z-30 text-xs">
                            <button
                              onClick={() => {
                                setActiveMenuId(null)
                                onView(dept)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-ink-main hover:bg-ivory-page text-left cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-plum" />
                              <span>View Team</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null)
                                onEdit(dept)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-ink-main hover:bg-ivory-page text-left cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-terracotta" />
                              <span>Edit Details</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null)
                                onDelete(dept)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 text-left border-t border-edge/60 mt-0.5 pt-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
