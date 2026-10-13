import React, { useState, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Avatar } from '../../components/ui/Avatar'
import { LeaveType, Employee } from '../../types'
import { employeeService } from '../../services/employeeService'
import { useAuth } from '../../context/AuthContext'

interface ApplyLeaveModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    employeeId: string
    leaveType: LeaveType
    startDate: string
    endDate: string
    reason: string
  }) => Promise<void>
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { user } = useAuth()
  const isEmployeeRole = user?.role === 'Employee'

  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeId, setEmployeeId] = useState(user?.id || '')
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return

    employeeService.getAll().then(all => {
      const active = all.filter(e => e.status !== 'Inactive')
      setEmployees(active)

      if (isEmployeeRole && user?.id) {
        // Locked to logged-in employee
        setEmployeeId(user.id)
      } else if (!employeeId && active.length > 0) {
        // Default to logged-in user if present in list, else first active employee
        const selfMatch = active.find(e => e.id === user?.id)
        setEmployeeId(selfMatch ? selfMatch.id : active[0].id)
      }
    })
  }, [isOpen, user, isEmployeeRole])

  // Calculate day count
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const daysCount = isNaN(diffDays) || diffDays < 1 ? 1 : diffDays

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetEmployeeId = isEmployeeRole && user?.id ? user.id : employeeId

    if (!targetEmployeeId) {
      setError('Please select an employee.')
      return
    }
    if (!reason.trim()) {
      setError('Please provide a reason for the leave.')
      return
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot precede the start date.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSave({
        employeeId: targetEmployeeId,
        leaveType,
        startDate,
        endDate,
        reason: reason.trim(),
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={isEmployeeRole ? 'Submit Leave Request' : 'Apply for Leave'}
      description={
        isEmployeeRole
          ? 'Submit your time-off or remote work request for manager approval.'
          : 'Submit a formal time-off request for employee review.'
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            Submit Request
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5">
            Applicant Employee *
          </label>

          {isEmployeeRole ? (
            /* Locked Employee Card - Cannot pick anyone else */
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ivory-page/80 border border-edge">
              <Avatar src={user?.avatar} name={user?.name || 'Employee'} size="md" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-ink-main truncate">
                  {user?.name} <span className="text-xs font-normal text-ink-secondary">(You)</span>
                </div>
                <div className="text-xs text-ink-secondary truncate">
                  {user?.designation} • {user?.department}
                </div>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-plum/10 text-plum text-[11px] font-semibold border border-plum/15">
                <Lock className="w-3 h-3 text-plum" />
                <span>Self</span>
              </div>
            </div>
          ) : (
            /* Admin / HR Manager Dropdown */
            <select
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              className="w-full bg-[#FFFEFA] border border-edge rounded-lg px-3.5 py-2 text-sm text-ink-main focus:outline-none focus:border-plum"
            >
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.fullName} ({e.designation} — {e.department})
                </option>
              ))}
            </select>
          )}
        </div>

        <Select
          label="Leave Type *"
          value={leaveType}
          onChange={e => setLeaveType(e.target.value as LeaveType)}
          options={[
            { value: 'Casual Leave', label: 'Casual Leave' },
            { value: 'Sick Leave', label: 'Sick Leave' },
            { value: 'Earned Leave', label: 'Earned Leave' },
            { value: 'Work From Home', label: 'Work From Home' },
            { value: 'Unpaid Leave', label: 'Unpaid Leave' },
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date *"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <Input
            label="End Date *"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <div className="p-3 rounded-xl bg-ivory-page/60 border border-edge/60 flex items-center justify-between text-xs">
          <span className="text-ink-secondary">Requested Leave Period:</span>
          <span className="font-bold text-plum font-mono text-sm">
            {daysCount} {daysCount === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5">
            Reason / Justification *
          </label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="Explain reason for request and coverage arrangement..."
            className="w-full bg-[#FFFEFA] border border-edge rounded-lg px-3.5 py-2 text-sm text-ink-main placeholder:text-ink-secondary/50 focus:outline-none focus:border-plum focus:ring-2 focus:ring-plum/15"
          />
        </div>
      </form>
    </Modal>
  )
}
