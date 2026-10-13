import React, { useState, useEffect } from 'react'
import { Upload, X, Plus, Sparkles } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Avatar } from '../../components/ui/Avatar'
import { Employee, EmploymentStatus, EmploymentType, Department } from '../../types'
import { departmentService } from '../../services/departmentService'

interface EmployeeFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (employeeData: Omit<Employee, 'id'>) => Promise<void>
  initialData?: Employee | null
  title?: string
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
}) => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('1994-05-15')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Non-binary' | 'Prefer not to say'>('Prefer not to say')
  const [address, setAddress] = useState('')
  const [avatar, setAvatar] = useState('')

  const [department, setDepartment] = useState('Engineering')
  const [designation, setDesignation] = useState('')
  const [reportingManager, setReportingManager] = useState('Himanshu Kumar Barnawal')
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time')
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState<EmploymentStatus>('Active')
  const [workLocation, setWorkLocation] = useState('Bengaluru HQ')

  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyRelation, setEmergencyRelation] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')

  const [skillsInput, setSkillsInput] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    departmentService.getAll().then(setDepartments)
  }, [])

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || '')
      setLastName(initialData.lastName || '')
      setEmployeeId(initialData.employeeId || '')
      setWorkEmail(initialData.workEmail || '')
      setPhone(initialData.phone || '')
      setDateOfBirth(initialData.dateOfBirth || '1994-05-15')
      setGender(initialData.gender || 'Prefer not to say')
      setAddress(initialData.address || '')
      setAvatar(initialData.avatar || '')

      setDepartment(initialData.department || 'Engineering')
      setDesignation(initialData.designation || '')
      setReportingManager(initialData.reportingManager || 'Alex Mercer')
      setEmploymentType(initialData.employmentType || 'Full-time')
      setJoiningDate(initialData.joiningDate || new Date().toISOString().slice(0, 10))
      setStatus(initialData.status || 'Active')
      setWorkLocation(initialData.workLocation || 'New York HQ')

      setEmergencyName(initialData.emergencyContact?.name || '')
      setEmergencyRelation(initialData.emergencyContact?.relationship || '')
      setEmergencyPhone(initialData.emergencyContact?.phone || '')

      setSkills(initialData.skills || [])
      setNotes(initialData.notes || '')
    } else {
      // Defaults for new employee
      setFirstName('')
      setLastName('')
      setEmployeeId(`EMP-${Math.floor(1060 + Math.random() * 40)}`)
      setWorkEmail('')
      setPhone('+91 ')
      setDateOfBirth('1995-06-15')
      setGender('Prefer not to say')
      setAddress('Indiranagar, Bengaluru, Karnataka 560038')
      setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')

      setDepartment('Engineering')
      setDesignation('')
      setReportingManager('Himanshu Kumar Barnawal')
      setEmploymentType('Full-time')
      setJoiningDate(new Date().toISOString().slice(0, 10))
      setStatus('Active')
      setWorkLocation('Bengaluru HQ')

      setEmergencyName('')
      setEmergencyRelation('Family')
      setEmergencyPhone('')

      setSkills(['Problem Solving', 'Team Collaboration'])
      setNotes('')
    }
    setErrors({})
  }, [initialData, isOpen])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!firstName.trim()) newErrors.firstName = 'First name is required.'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required.'
    if (!employeeId.trim()) newErrors.employeeId = 'Employee ID is required.'

    if (!workEmail.trim()) {
      newErrors.workEmail = 'Work email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
      newErrors.workEmail = 'Enter a valid email address.'
    }

    if (!phone.trim() || phone.length < 7) {
      newErrors.phone = 'Valid phone number is required.'
    }

    if (!designation.trim()) newErrors.designation = 'Designation is required.'
    if (!department) newErrors.department = 'Department is required.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddSkill = () => {
    if (skillsInput.trim() && !skills.includes(skillsInput.trim())) {
      setSkills([...skills, skillsInput.trim()])
      setSkillsInput('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const payload: Omit<Employee, 'id'> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        employeeId: employeeId.trim(),
        workEmail: workEmail.trim(),
        phone: phone.trim(),
        dateOfBirth,
        gender,
        address: address.trim(),
        avatar: avatar.trim() || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        department,
        designation: designation.trim(),
        reportingManager: reportingManager.trim(),
        employmentType,
        joiningDate,
        status,
        workLocation,
        emergencyContact: {
          name: emergencyName.trim() || 'Not specified',
          relationship: emergencyRelation.trim() || 'Family',
          phone: emergencyPhone.trim() || phone.trim(),
        },
        skills,
        notes: notes.trim(),
      }

      await onSave(payload)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={title || (initialData ? 'Edit Employee Details' : 'Add New Employee')}
      description="Fill in the required information across personal, employment, and emergency contact sections."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            {initialData ? 'Save Changes' : 'Create Employee'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal Information */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-plum border-b border-edge pb-1.5 mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-plum" />
            Personal Information
          </h4>

          {/* Profile Photo preview & URL */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-ivory-page/50 rounded-xl border border-edge/60">
            <Avatar src={avatar} name={`${firstName} ${lastName}` || 'New User'} size="xl" />
            <div className="flex-1">
              <label className="block text-xs font-semibold text-ink-main mb-1">
                Profile Photo URL
              </label>
              <div className="flex gap-2">
                <Input
                  value={avatar}
                  onChange={e => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAvatar(
                      `https://images.unsplash.com/photo-${[
                        '1534528741775-53994a69daeb',
                        '1507003211169-0a1dd7228f2d',
                        '1573496359142-b8d87734a5a2',
                        '1500648767791-00dcc994a43e',
                        '1580489944761-15a19d654956',
                        '1506794778202-cad84cf45f1d',
                        '1544005313-94ddf0286df2',
                      ][Math.floor(Math.random() * 7)]}?w=150&auto=format&fit=crop&q=80`
                    )
                  }
                  title="Generate Random Photo"
                >
                  <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              label="First Name *"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              error={errors.firstName}
              placeholder="e.g. Himanshu"
            />
            <Input
              label="Last Name *"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              error={errors.lastName}
              placeholder="e.g. Barnawal"
            />
            <Input
              label="Employee ID *"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              error={errors.employeeId}
              placeholder="e.g. EMP-1042"
            />
            <Input
              label="Work Email *"
              type="email"
              value={workEmail}
              onChange={e => setWorkEmail(e.target.value)}
              error={errors.workEmail}
              placeholder="himanshu.barnawal@peopleos.in"
            />
            <Input
              label="Phone Number *"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              error={errors.phone}
              placeholder="+91 98201 23456"
            />
            <Input
              label="Date of Birth"
              type="date"
              value={dateOfBirth}
              onChange={e => setDateOfBirth(e.target.value)}
            />
            <Select
              label="Gender"
              value={gender}
              onChange={e => setGender(e.target.value as any)}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Non-binary', label: 'Non-binary' },
                { value: 'Prefer not to say', label: 'Prefer not to say' },
              ]}
            />
            <Input
              label="Home Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Street, City, State, ZIP"
            />
          </div>
        </div>

        {/* Section 2: Employment Details */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-plum border-b border-edge pb-1.5 mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-plum" />
            Employment Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              label="Department *"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              error={errors.department}
              options={departments.map(d => ({ value: d.name, label: d.name }))}
            />
            <Input
              label="Designation / Job Title *"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              error={errors.designation}
              placeholder="e.g. Senior Software Engineer"
            />
            <Input
              label="Reporting Manager"
              value={reportingManager}
              onChange={e => setReportingManager(e.target.value)}
              placeholder="e.g. Aarav Patel"
            />
            <Select
              label="Employment Type"
              value={employmentType}
              onChange={e => setEmploymentType(e.target.value as EmploymentType)}
              options={[
                { value: 'Full-time', label: 'Full-time' },
                { value: 'Part-time', label: 'Part-time' },
                { value: 'Contract', label: 'Contract' },
                { value: 'Intern', label: 'Intern' },
              ]}
            />
            <Input
              label="Joining Date"
              type="date"
              value={joiningDate}
              onChange={e => setJoiningDate(e.target.value)}
            />
            <Select
              label="Employment Status"
              value={status}
              onChange={e => setStatus(e.target.value as EmploymentStatus)}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'On Leave', label: 'On Leave' },
                { value: 'Probation', label: 'Probation' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
            <Select
              label="Work Location"
              value={workLocation}
              onChange={e => setWorkLocation(e.target.value)}
              options={[
                { value: 'Bengaluru HQ', label: 'Bengaluru HQ' },
                { value: 'Mumbai Tech Hub', label: 'Mumbai Tech Hub' },
                { value: 'Pune Tech Park', label: 'Pune Tech Park' },
                { value: 'Hyderabad Center', label: 'Hyderabad Center' },
              ]}
            />
          </div>
        </div>

        {/* Section 3: Emergency Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-plum border-b border-edge pb-1.5 mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-plum" />
            Emergency Contact
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Input
              label="Contact Name"
              value={emergencyName}
              onChange={e => setEmergencyName(e.target.value)}
              placeholder="Contact full name"
            />
            <Input
              label="Relationship"
              value={emergencyRelation}
              onChange={e => setEmergencyRelation(e.target.value)}
              placeholder="e.g. Spouse, Parent, Sibling"
            />
            <Input
              label="Emergency Phone"
              value={emergencyPhone}
              onChange={e => setEmergencyPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {/* Section 4: Additional Details */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-plum border-b border-edge pb-1.5 mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-plum" />
            Additional Details & Skills
          </h4>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5">
                Skills & Competencies
              </label>
              <div className="flex gap-2">
                <Input
                  value={skillsInput}
                  onChange={e => setSkillsInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                  placeholder="Type a skill and press Add or Enter (e.g. React, Financial Modeling)"
                  className="text-xs"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </Button>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map(s => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-plum/10 text-plum"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="hover:text-red-600 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5">
                Internal Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Operational notes, onboarding remarks, equipment assigned, etc."
                className="w-full bg-[#FFFEFA] border border-edge rounded-lg px-3.5 py-2 text-sm text-ink-main placeholder:text-ink-secondary/50 focus:outline-none focus:border-plum focus:ring-2 focus:ring-plum/15"
              />
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}
