import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Download, Search, RotateCcw } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { LeaveStats } from '../features/leave/LeaveStats'
import { LeaveTable } from '../features/leave/LeaveTable'
import { ApplyLeaveModal } from '../features/leave/ApplyLeaveModal'
import { LeaveActionModal } from '../features/leave/LeaveActionModal'
import { LeaveDetailModal } from '../features/leave/LeaveDetailModal'
import { leaveService } from '../services/leaveService'
import { departmentService } from '../services/departmentService'
import { employeeService } from '../services/employeeService'
import { subscribeToStore } from '../services/storage'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { exportToCsv } from '../utils/exportCsv'
import { LeaveRequest, Department, LeaveType } from '../types'

export const LeavePage: React.FC = () => {
  const { user } = useAuth()
  const toast = useToast()
  const isEmployeeRole = user?.role === 'Employee'

  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [activeEmployeesOnLeave, setActiveEmployeesOnLeave] = useState(0)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [viewingLeave, setViewingLeave] = useState<LeaveRequest | null>(null)
  const [actionLeave, setActionLeave] = useState<{
    leave: LeaveRequest
    action: 'approve' | 'reject'
  } | null>(null)

  const loadData = () => {
    leaveService.getAll().then(setLeaves)
    departmentService.getAll().then(setDepartments)
    employeeService.getAll().then(all => {
      setActiveEmployeesOnLeave(all.filter(e => e.status === 'On Leave').length)
    })
  }

  useEffect(() => {
    loadData()
    const unsubscribe = subscribeToStore(loadData)
    return () => unsubscribe()
  }, [])

  // Scope leaves strictly for logged-in employee when role is Employee
  const scopedLeaves = useMemo(() => {
    if (isEmployeeRole && user) {
      return leaves.filter(l => {
        const matchesId = user.id && l.employeeId.toLowerCase() === user.id.toLowerCase()
        const matchesName =
          user.name &&
          (l.employeeName.toLowerCase() === user.name.toLowerCase() ||
            l.employeeName.toLowerCase().includes(user.name.toLowerCase()) ||
            user.name.toLowerCase().includes(l.employeeName.toLowerCase()))
        return matchesId || matchesName
      })
    }
    return leaves
  }, [leaves, user, isEmployeeRole])

  const filteredLeaves = useMemo(() => {
    return scopedLeaves.filter(l => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        l.employeeName.toLowerCase().includes(q) ||
        l.employeeDepartment.toLowerCase().includes(q) ||
        l.reason.toLowerCase().includes(q)

      const matchesDept = !deptFilter || l.employeeDepartment === deptFilter
      const matchesStatus = !statusFilter || l.status === statusFilter
      const matchesType = !typeFilter || l.leaveType === typeFilter

      return matchesSearch && matchesDept && matchesStatus && matchesType
    })
  }, [scopedLeaves, searchQuery, deptFilter, statusFilter, typeFilter])

  const handleApplyLeave = async (data: {
    employeeId: string
    leaveType: LeaveType
    startDate: string
    endDate: string
    reason: string
  }) => {
    await leaveService.apply(data)
    toast.success('Leave application submitted for approval.')
    loadData()
  }

  const handleConfirmAction = async (leaveId: string, remarks: string) => {
    if (!actionLeave) return
    const approverName = user?.name || 'Himanshu Kumar Barnawal'

    if (actionLeave.action === 'approve') {
      await leaveService.approve(leaveId, approverName, remarks)
      toast.success(`Approved leave request for ${actionLeave.leave.employeeName}.`)
    } else {
      await leaveService.reject(leaveId, approverName, remarks)
      toast.info(`Rejected leave request for ${actionLeave.leave.employeeName}.`)
    }
    setActionLeave(null)
    loadData()
  }

  const handleExportCsv = () => {
    const headers = [
      'Employee Name',
      'Department',
      'Leave Type',
      'Start Date',
      'End Date',
      'Total Days',
      'Reason',
      'Status',
      'Requested Date',
      'Approver Remarks',
    ]

    const rows = filteredLeaves.map(l => [
      l.employeeName,
      l.employeeDepartment,
      l.leaveType,
      l.startDate,
      l.endDate,
      l.totalDays,
      l.reason,
      l.status,
      l.requestDate,
      l.approverRemarks || '',
    ])

    exportToCsv(
      isEmployeeRole ? `PeopleOS_My_Leave_${user?.name?.replace(/\s+/g, '_')}` : 'PeopleOS_Leave_Requests',
      headers,
      rows
    )
    toast.success(`Exported ${filteredLeaves.length} leave records to CSV.`)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDeptFilter('')
    setStatusFilter('')
    setTypeFilter('')
  }

  const hasActiveFilters = !!(searchQuery || deptFilter || statusFilter || typeFilter)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink-main leading-tight">
            {isEmployeeRole ? 'My Leave & Time-Off' : 'Leave & Time-Off Management'}
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            {isEmployeeRole
              ? `Personal leave portal for ${user?.name || 'employee'} — view records and submit time-off.`
              : 'Process annual leave applications, sick days, parental leaves, and remote sprints.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsApplyModalOpen(true)}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            {isEmployeeRole ? 'Apply for Leave' : 'Add Leave Request'}
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <LeaveStats
        leaves={scopedLeaves}
        onLeaveTodayCount={activeEmployeesOnLeave}
        isEmployeeView={isEmployeeRole}
      />

      {/* Filters Toolbar */}
      <div className="bg-[#FFFEFA] border border-edge rounded-xl p-4 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isEmployeeRole ? 'Search reasons or leave types...' : 'Search by employee, department, or reason...'}
              startIcon={<Search className="w-4 h-4 text-ink-secondary" />}
              className="text-xs py-2"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Department Filter (Hidden for Employee since scoped to them) */}
            {!isEmployeeRole && (
              <select
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="bg-ivory-page border border-edge rounded-lg px-2.5 py-1.5 text-xs text-ink-main focus:outline-none focus:border-plum"
              >
                <option value="">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-ivory-page border border-edge rounded-lg px-2.5 py-1.5 text-xs text-ink-main focus:outline-none focus:border-plum"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-ivory-page border border-edge rounded-lg px-2.5 py-1.5 text-xs text-ink-main focus:outline-none focus:border-plum"
            >
              <option value="">All Leave Types</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave</option>
              <option value="Work From Home">Work From Home</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-terracotta hover:bg-terracotta-subtle transition-colors font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            <span className="text-ink-secondary ml-auto text-[11px]">
              Showing <strong className="text-ink-main">{filteredLeaves.length}</strong> {isEmployeeRole ? 'of your requests' : 'requests'}
            </span>
          </div>
        </div>
      </div>

      {/* Leave Table */}
      <LeaveTable
        leaves={filteredLeaves}
        onView={l => setViewingLeave(l)}
        onApprove={l => setActionLeave({ leave: l, action: 'approve' })}
        onReject={l => setActionLeave({ leave: l, action: 'reject' })}
        userRole={user?.role}
      />

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSave={handleApplyLeave}
      />

      {/* Leave Action Modal (Approve or Reject with remarks) */}
      {actionLeave && (
        <LeaveActionModal
          isOpen={!!actionLeave}
          onClose={() => setActionLeave(null)}
          leave={actionLeave.leave}
          action={actionLeave.action}
          onConfirm={handleConfirmAction}
        />
      )}

      {/* Leave Detail Modal */}
      {viewingLeave && (
        <LeaveDetailModal
          isOpen={!!viewingLeave}
          onClose={() => setViewingLeave(null)}
          leave={viewingLeave}
          onApprove={l => setActionLeave({ leave: l, action: 'approve' })}
          onReject={l => setActionLeave({ leave: l, action: 'reject' })}
          canManage={user?.role === 'Admin' || user?.role === 'HR Manager'}
        />
      )}
    </div>
  )
}
