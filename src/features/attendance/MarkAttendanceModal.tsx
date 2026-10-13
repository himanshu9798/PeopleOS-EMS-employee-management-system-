import React, { useState, useEffect } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Employee, AttendanceStatus } from '../../types'
import { employeeService } from '../../services/employeeService'
import { calculateWorkingHours } from '../../utils/formatters'

interface MarkAttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    employeeId: string
    date: string
    checkIn: string
    checkOut: string
    status: AttendanceStatus
    notes?: string
  }) => Promise<void>
  initialDate?: string
}

export const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeId, setEmployeeId] = useState('')
  const [date, setDate] = useState(initialDate || new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState<AttendanceStatus>('Present')
  const [checkIn, setCheckIn] = useState('09:00')
  const [checkOut, setCheckOut] = useState('18:00')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    employeeService.getAll().then(all => {
      const active = all.filter(e => e.status !== 'Inactive')
      setEmployees(active)
      if (active.length > 0 && !employeeId) {
        setEmployeeId(active[0].id)
      }
    })
  }, [isOpen])

  useEffect(() => {
    if (status === 'Absent' || status === 'On Leave') {
      setCheckIn('--')
      setCheckOut('--')
    } else if (checkIn === '--') {
      setCheckIn('09:00')
      setCheckOut('18:00')
    }
  }, [status])

  const calculatedHours = calculateWorkingHours(checkIn, checkOut)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!employeeId) {
      setError('Please select an employee.')
      return
    }

    setIsSubmitting(true)
    try {
      await onSave({
        employeeId,
        date,
        checkIn,
        checkOut,
        status,
        notes: notes.trim(),
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
      title="Mark Employee Attendance"
      description="Record or update the daily attendance log and working hours."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            Save Record
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
            Select Employee *
          </label>
          <select
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            className="w-full bg-[#FFFEFA] border border-edge rounded-lg px-3.5 py-2 text-sm text-ink-main focus:outline-none focus:border-plum"
          >
            {employees.map(e => (
              <option key={e.id} value={e.id}>
                {e.fullName} ({e.department} — {e.employeeId})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date *"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <Select
            label="Attendance Status *"
            value={status}
            onChange={e => setStatus(e.target.value as AttendanceStatus)}
            options={[
              { value: 'Present', label: 'Present' },
              { value: 'Late', label: 'Late' },
              { value: 'Half Day', label: 'Half Day' },
              { value: 'On Leave', label: 'On Leave' },
              { value: 'Absent', label: 'Absent' },
            ]}
          />
        </div>

        {status !== 'Absent' && status !== 'On Leave' && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-ivory-page/50 rounded-xl border border-edge/60">
            <Input
              label="Check-In Time"
              type="time"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
            />
            <Input
              label="Check-Out Time"
              type="time"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
            />
            <div className="col-span-2 text-xs text-ink-secondary flex items-center justify-between pt-1">
              <span>Calculated Working Hours:</span>
              <span className="font-bold text-plum font-mono text-sm">
                {calculatedHours} hrs
              </span>
            </div>
          </div>
        )}

        <Input
          label="Notes / Remarks"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. Remote work, Client site, Transit delay"
        />
      </form>
    </Modal>
  )
}
