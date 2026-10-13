import React, { useState, useEffect } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { AttendanceRecord, AttendanceStatus } from '../../types'
import { calculateWorkingHours } from '../../utils/formatters'

interface EditAttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  record: AttendanceRecord | null
  onSave: (
    id: string,
    updates: {
      checkIn: string
      checkOut: string
      status: AttendanceStatus
      notes?: string
    }
  ) => Promise<void>
}

export const EditAttendanceModal: React.FC<EditAttendanceModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [checkIn, setCheckIn] = useState('09:00')
  const [checkOut, setCheckOut] = useState('18:00')
  const [status, setStatus] = useState<AttendanceStatus>('Present')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (record) {
      setCheckIn(record.checkIn === '--' ? '' : record.checkIn)
      setCheckOut(record.checkOut === '--' ? '' : record.checkOut)
      setStatus(record.status)
      setNotes(record.notes || '')
    }
  }, [record, isOpen])

  if (!record) return null

  const calculatedHours = calculateWorkingHours(checkIn, checkOut)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave(record.id, {
        checkIn: checkIn || '--',
        checkOut: checkOut || '--',
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
      title={`Edit Attendance for ${record.employeeName}`}
      description={`Date: ${record.date} • Department: ${record.employeeDepartment}`}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            Update Record
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <span>Recalculated Working Hours:</span>
            <span className="font-bold text-plum font-mono text-sm">
              {calculatedHours} hrs
            </span>
          </div>
        </div>

        <Input
          label="Notes / Explanation"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. Corrected timestamp per security badge entry"
        />
      </form>
    </Modal>
  )
}
