import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Mail, Phone, ExternalLink } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Department, Employee } from '../../types'
import { employeeService } from '../../services/employeeService'
import { formatDate } from '../../utils/formatters'

interface DepartmentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  department: Department | null
}

export const DepartmentDetailModal: React.FC<DepartmentDetailModalProps> = ({
  isOpen,
  onClose,
  department,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    if (department && isOpen) {
      employeeService.getAll().then(all => {
        setEmployees(
          all.filter(
            e => e.department.toLowerCase() === department.name.toLowerCase()
          )
        )
      })
    }
  }, [department, isOpen])

  if (!department) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          <span>{department.name}</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-plum/10 text-plum font-bold">
            {department.code}
          </span>
        </div>
      }
      description={`Established ${formatDate(department.createdAt)} • Headed by ${department.head}`}
      footer={
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-5">
        {/* Description & Overview */}
        <div className="p-3.5 rounded-xl bg-ivory-page border border-edge text-xs leading-relaxed text-ink-main">
          {department.description}
        </div>

        {/* Department Members List */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-main flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-plum" />
              <span>Assigned Team Members ({employees.length})</span>
            </h4>
          </div>

          {employees.length === 0 ? (
            <div className="py-8 text-center text-ink-secondary text-xs bg-ivory-page/40 rounded-xl border border-edge/60">
              No employees currently assigned to this department.
            </div>
          ) : (
            <div className="divide-y divide-edge/60 border border-edge rounded-xl overflow-hidden bg-[#FFFEFA]">
              {employees.map(emp => (
                <div
                  key={emp.id}
                  className="p-3 flex items-center justify-between hover:bg-ivory-page/50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={emp.avatar} name={emp.fullName} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/people/${emp.id}`}
                          onClick={onClose}
                          className="font-semibold text-xs text-ink-main hover:text-plum truncate"
                        >
                          {emp.fullName}
                        </Link>
                        {emp.fullName === department.head && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-terracotta/20 text-terracotta">
                            Head
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-ink-secondary truncate block">
                        {emp.designation} • {emp.employeeId}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={emp.status === 'Active' ? 'active' : 'inactive'} dot>
                      {emp.status}
                    </Badge>
                    <Link
                      to={`/people/${emp.id}`}
                      onClick={onClose}
                      className="p-1.5 rounded-lg text-ink-secondary hover:text-plum hover:bg-black/5"
                      title="View Profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
