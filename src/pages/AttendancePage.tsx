import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Download, Calendar, Search, Filter, RotateCcw } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { AttendanceStats } from '../features/attendance/AttendanceStats'
import { AttendanceTable } from '../features/attendance/AttendanceTable'
import { MarkAttendanceModal } from '../features/attendance/MarkAttendanceModal'
import { EditAttendanceModal } from '../features/attendance/EditAttendanceModal'
import { attendanceService } from '../services/attendanceService'
import { departmentService } from '../services/departmentService'
import { subscribeToStore } from '../services/storage'
import { exportToCsv } from '../utils/exportCsv'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { AttendanceRecord, Department, AttendanceStatus } from '../types'

export const AttendancePage: React.FC = () => {
  const { user } = useAuth()
  const toast = useToast()
  const canManage = user?.role === 'Admin' || user?.role === 'HR Manager'

  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))

  const [searchQuery, setSearchQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null)

  const loadData = () => {
    attendanceService.getByDate(selectedDate).then(data => {
      // If none found on selected date, load all or today
      if (data.length === 0) {
        attendanceService.getToday().then(setRecords)
      } else {
        setRecords(data)
      }
    })
    departmentService.getAll().then(setDepartments)
  }

  useEffect(() => {
    loadData()
    const unsubscribe = subscribeToStore(loadData)
    return () => unsubscribe()
  }, [selectedDate])

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeDepartment.toLowerCase().includes(q)

      const matchesDept = !deptFilter || r.employeeDepartment === deptFilter
      const matchesStatus = !statusFilter || r.status === statusFilter

      return matchesSearch && matchesDept && matchesStatus
    })
  }, [records, searchQuery, deptFilter, statusFilter])

  const handleMarkAttendance = async (data: {
    employeeId: string
    date: string
    checkIn: string
    checkOut: string
    status: AttendanceStatus
    notes?: string
  }) => {
    await attendanceService.markAttendance(data)
    toast.success('Attendance recorded successfully.')
    loadData()
  }

  const handleSaveEdit = async (
    id: string,
    updates: {
      checkIn: string
      checkOut: string
      status: AttendanceStatus
      notes?: string
    }
  ) => {
    await attendanceService.updateRecord(id, updates)
    toast.success('Attendance record updated and hours recalculated.')
    setEditingRecord(null)
    loadData()
  }

  const handleExportCsv = () => {
    const headers = [
      'Employee Name',
      'Department',
      'Date',
      'Check-In',
      'Check-Out',
      'Working Hours',
      'Status',
      'Notes',
    ]

    const rows = filteredRecords.map(r => [
      r.employeeName,
      r.employeeDepartment,
      r.date,
      r.checkIn,
      r.checkOut,
      r.workingHours,
      r.status,
      r.notes || '',
    ])

    exportToCsv('PeopleOS_Attendance', headers, rows)
    toast.success(`Exported ${filteredRecords.length} attendance logs to CSV.`)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDeptFilter('')
    setStatusFilter('')
  }

  const hasActiveFilters = !!(searchQuery || deptFilter || statusFilter)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink-main leading-tight">
            Attendance Operations
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Monitor daily check-ins, calculate working hours, verify timestamps, and track absences.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFEFA] border border-edge text-xs font-semibold text-ink-main shadow-soft">
            <Calendar className="w-3.5 h-3.5 text-plum" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs text-ink-main focus:outline-none cursor-pointer"
            />
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>

          {canManage && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsMarkModalOpen(true)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Mark Attendance
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Stats */}
      <AttendanceStats records={records} />

      {/* Filter Toolbar */}
      <div className="bg-[#FFFEFA] border border-edge rounded-xl p-4 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by employee name or department..."
              startIcon={<Search className="w-4 h-4 text-ink-secondary" />}
              className="text-xs py-2"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Department Filter */}
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

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-ivory-page border border-edge rounded-lg px-2.5 py-1.5 text-xs text-ink-main focus:outline-none focus:border-plum"
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Half Day">Half Day</option>
              <option value="On Leave">On Leave</option>
              <option value="Absent">Absent</option>
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
              Showing <strong className="text-ink-main">{filteredRecords.length}</strong> logs
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <AttendanceTable
        records={filteredRecords}
        onEdit={rec => setEditingRecord(rec)}
        canManage={canManage}
      />

      {/* Mark Attendance Modal */}
      <MarkAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        onSave={handleMarkAttendance}
        initialDate={selectedDate}
      />

      {/* Edit Attendance Record Modal */}
      {editingRecord && (
        <EditAttendanceModal
          isOpen={!!editingRecord}
          onClose={() => setEditingRecord(null)}
          record={editingRecord}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}
