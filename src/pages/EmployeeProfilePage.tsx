import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  UserX,
  Mail,
  Phone,
  Calendar,
  Building,
  UserCheck,
  Shield,
  Clock,
  CalendarOff,
  User,
  Briefcase,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { Badge } from '../components/ui/Badge'
import { Tabs } from '../components/ui/Tabs'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmployeeProfileTabs } from '../features/employees/EmployeeProfileTabs'
import { EmployeeFormModal } from '../features/employees/EmployeeFormModal'
import { employeeService } from '../services/employeeService'
import { attendanceService } from '../services/attendanceService'
import { leaveService } from '../services/leaveService'
import { subscribeToStore } from '../services/storage'
import { useToast } from '../context/ToastContext'
import { Employee, AttendanceRecord, LeaveRequest } from '../types'
import { formatDate } from '../utils/formatters'

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false)

  const loadEmployeeData = () => {
    if (!id) return
    employeeService.getById(id).then(emp => {
      if (emp) {
        setEmployee(emp)
        attendanceService.getForEmployee(emp.id).then(setAttendance)
        leaveService.getForEmployee(emp.id).then(setLeaves)
      } else {
        setEmployee(null)
      }
    })
  }

  useEffect(() => {
    loadEmployeeData()
    const unsubscribe = subscribeToStore(loadEmployeeData)
    return () => unsubscribe()
  }, [id])

  if (!employee) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold text-ink-main">Employee not found</h2>
        <p className="text-sm text-ink-secondary mt-1">
          The requested profile does not exist or has been removed.
        </p>
        <Link to="/people" className="mt-4 inline-block">
          <Button variant="primary" size="sm">
            Back to Directory
          </Button>
        </Link>
      </div>
    )
  }

  const handleSaveEdit = async (data: Omit<Employee, 'id'>) => {
    await employeeService.update(employee.id, data)
    toast.success('Employee profile updated successfully.')
    setIsEditModalOpen(false)
  }

  const handleConfirmDeactivate = async () => {
    await employeeService.deactivate(employee.id)
    toast.info(`${employee.fullName} is now marked as Inactive.`)
    setIsDeactivateOpen(false)
  }

  const profileTabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'employment', label: 'Employment', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', count: attendance.length, icon: <Clock className="w-4 h-4" /> },
    { id: 'leave', label: 'Leave History', count: leaves.length, icon: <CalendarOff className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/people"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-secondary hover:text-plum transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to People Directory</span>
        </Link>
      </div>

      {/* Hero Header Card with AI-Generated Corporate Panoramic Cover */}
      <div className="bg-[#FFFEFA] border border-edge rounded-2xl shadow-soft relative overflow-hidden">
        {/* Cover Photo Banner - Fully Visible AI Architecture Artwork */}
        <div className="h-56 sm:h-72 w-full relative overflow-hidden bg-[#2B1F32]">
          <img
            src="/images/dashboard-banner.jpg"
            alt="PeopleOS Corporate Overview"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-[11px] font-semibold text-white/95 border border-white/20 shadow-sm">
            Enterprise HQ • Manhattan
          </div>
        </div>

        <div className="px-6 pb-6 pt-0 bg-[#FFFEFA]">
          {/* Identity & Actions row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-14 sm:-mt-16 mb-4 relative z-10">
            {/* Avatar & Employee Details with solid background card */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="flex-shrink-0">
                <Avatar
                  src={employee.avatar}
                  name={employee.fullName}
                  size="2xl"
                  className="ring-4 ring-[#FFFEFA] shadow-md bg-[#FFFEFA]"
                  status="online"
                />
              </div>

              {/* Data box with dedicated background color for perfect legibility */}
              <div className="bg-[#F8F5EE] border border-edge rounded-2xl p-4 sm:p-5 shadow-xs">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink-main leading-tight">
                    {employee.fullName}
                  </h1>
                  <Badge
                    variant={
                      employee.status === 'Active'
                        ? 'active'
                        : employee.status === 'On Leave'
                        ? 'on-leave'
                        : employee.status === 'Probation'
                        ? 'probation'
                        : 'inactive'
                    }
                    dot
                  >
                    {employee.status}
                  </Badge>
                </div>

                <p className="text-sm font-semibold text-terracotta mt-0.5">
                  {employee.designation}
                </p>

                {/* Meta pills with clean pill backgrounds */}
                <div className="flex items-center gap-2.5 mt-2.5 text-xs text-ink-secondary flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium text-ink-main bg-[#FFFEFA] px-2.5 py-1 rounded-lg border border-edge/60 shadow-xs">
                    <Building className="w-3.5 h-3.5 text-plum" />
                    {employee.department}
                  </span>
                  <span className="font-mono font-semibold text-ink-main bg-[#FFFEFA] px-2.5 py-1 rounded-lg border border-edge/60 shadow-xs">
                    {employee.employeeId}
                  </span>
                  <span className="bg-[#FFFEFA] px-2.5 py-1 rounded-lg border border-edge/60 shadow-xs text-ink-secondary">
                    Reports to <strong className="text-ink-main">{employee.reportingManager}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons with dedicated background color container */}
            <div className="flex items-center gap-2.5 flex-wrap bg-[#F8F5EE] border border-edge p-2.5 rounded-2xl shadow-xs self-start lg:self-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsEditModalOpen(true)}
                icon={<Edit2 className="w-4 h-4 text-white" />}
                className="!bg-plum hover:!bg-[#3B2943] !text-white shadow-xs font-semibold"
              >
                Edit Employee
              </Button>

              {employee.status !== 'Inactive' && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setIsDeactivateOpen(true)}
                  icon={<UserX className="w-4 h-4 text-rose-600" />}
                  className="!bg-rose-50 !border-rose-200 !text-rose-700 hover:!bg-rose-100 font-semibold shadow-xs"
                >
                  Deactivate
                </Button>
              )}
            </div>
          </div>

          {/* Tab switcher */}
          <div className="mt-6 border-t border-edge/60 pt-2">
            <Tabs
              tabs={profileTabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* Tab Content Display */}
      <EmployeeProfileTabs
        employee={employee}
        attendance={attendance}
        leaves={leaves}
        activeTab={activeTab}
      />

      {/* Edit Employee Modal */}
      <EmployeeFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        initialData={employee}
        title={`Edit Profile — ${employee.fullName}`}
      />

      {/* Deactivate confirmation dialog */}
      <ConfirmDialog
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={handleConfirmDeactivate}
        title={`Deactivate ${employee.fullName}?`}
        message="This employee will be placed on Inactive status. Their system access will be revoked immediately."
        confirmText="Deactivate"
        isDestructive
      />
    </div>
  )
}
