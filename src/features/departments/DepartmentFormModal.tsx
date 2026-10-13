import React, { useState, useEffect } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Department, Employee } from '../../types'
import { employeeService } from '../../services/employeeService'

interface DepartmentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<Department, 'id' | 'employeeCount' | 'createdAt'>) => Promise<void>
  initialData?: Department | null
}

export const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [head, setHead] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    employeeService.getAll().then(setEmployees)
  }, [])

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setCode(initialData.code)
      setDescription(initialData.description)
      setHead(initialData.head)
    } else {
      setName('')
      setCode('')
      setDescription('')
      setHead('')
    }
    setError('')
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Department name is required.')
      return
    }
    if (!code.trim()) {
      setError('Department code is required.')
      return
    }
    if (!head.trim()) {
      setError('Department head is required.')
      return
    }

    setIsSubmitting(true)
    try {
      const selectedHead = employees.find(e => e.fullName === head)
      await onSave({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        head: head.trim(),
        headAvatar: selectedHead?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
      title={initialData ? 'Edit Department' : 'Create New Department'}
      description="Define the department name, functional code, strategic description, and appointed leader."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Department'}
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

        <Input
          label="Department Name *"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Platform Infrastructure"
        />

        <Input
          label="Department Code *"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. INF"
          helperText="Short 2-4 letter uppercase identifier"
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5">
            Department Head *
          </label>
          <select
            value={head}
            onChange={e => setHead(e.target.value)}
            className="w-full bg-[#FFFEFA] border border-edge rounded-lg px-3.5 py-2 text-sm text-ink-main focus:outline-none focus:border-plum"
          >
            <option value="">Select an employee...</option>
            {employees.map(e => (
              <option key={e.id} value={e.fullName}>
                {e.fullName} ({e.designation} — {e.department})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5">
            Mission & Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="Functional charter, core responsibilities, and team objectives..."
            className="w-full bg-[#FFFEFA] border border-edge rounded-lg px-3.5 py-2 text-sm text-ink-main placeholder:text-ink-secondary/50 focus:outline-none focus:border-plum focus:ring-2 focus:ring-plum/15"
          />
        </div>
      </form>
    </Modal>
  )
}
