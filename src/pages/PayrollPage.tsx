import React, { useState, useEffect, useMemo } from 'react'
import { Download, Search, ShieldAlert, KeyRound, Filter, RotateCcw, CreditCard } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { PayrollStats } from '../features/payroll/PayrollStats'
import { PayrollTable } from '../features/payroll/PayrollTable'
import { PayslipModal } from '../features/payroll/PayslipModal'
import { payrollService } from '../services/payrollService'
import { departmentService } from '../services/departmentService'
import { subscribeToStore } from '../services/storage'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { exportToCsv } from '../utils/exportCsv'
import { PayrollRecord, Department } from '../types'

export const PayrollPage: React.FC = () => {
  const { user, switchRole } = useAuth()
  const toast = useToast()

  const [records, setRecords] = useState<PayrollRecord[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [periodFilter, setPeriodFilter] = useState('October 2026')

  // Payslip modal
  const [viewingRecord, setViewingRecord] = useState<PayrollRecord | null>(null)

  const loadData = () => {
    payrollService.getAll().then(setRecords)
    departmentService.getAll().then(setDepartments)
  }

  useEffect(() => {
    loadData()
    const unsubscribe = subscribeToStore(loadData)
    return () => unsubscribe()
  }, [])

  // Check authorization (Admin or HR Manager)
  const isAuthorized = user?.role === 'Admin' || user?.role === 'HR Manager'

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeCode.toLowerCase().includes(q) ||
        r.employeeDepartment.toLowerCase().includes(q)

      const matchesDept = !deptFilter || r.employeeDepartment === deptFilter
      const matchesStatus = !statusFilter || r.status === statusFilter
      const matchesPeriod = !periodFilter || r.payPeriod === periodFilter

      return matchesSearch && matchesDept && matchesStatus && matchesPeriod
    })
  }, [records, searchQuery, deptFilter, statusFilter, periodFilter])

  const handleUpdateStatus = async (record: PayrollRecord, status: 'Paid') => {
    await payrollService.updateStatus(record.id, status)
    toast.success(`Disbursed salary for ${record.employeeName}.`)
    loadData()
  }

  const handleExportCsv = () => {
    const headers = [
      'Employee Name',
      'Employee Code',
      'Department',
      'Pay Period',
      'Basic Salary',
      'Allowances',
      'Deductions',
      'Net Salary',
      'Status',
      'Disbursement Date',
    ]

    const rows = filteredRecords.map(r => [
      r.employeeName,
      r.employeeCode,
      r.employeeDepartment,
      r.payPeriod,
      r.basicSalary,
      r.allowances,
      r.deductions,
      r.netSalary,
      r.status,
      r.paymentDate || 'Pending',
    ])

    exportToCsv('PeopleOS_Payroll_Batch', headers, rows)
    toast.success(`Exported ${filteredRecords.length} payroll records to CSV.`)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDeptFilter('')
    setStatusFilter('')
  }

  // Access Denied state for non-authorized roles (Section 11 requirement)
  if (!isAuthorized) {
    return (
      <div className="py-16 max-w-xl mx-auto">
        <Card className="p-8 text-center border-edge-dark/60 shadow-modal bg-[#FFFEFA]">
          <div className="w-14 h-14 rounded-2xl bg-plum/10 text-plum flex items-center justify-center mx-auto mb-4 shadow-soft">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
            Restricted Module Access
          </span>

          <h2 className="font-serif text-2xl font-bold text-ink-main mt-3">
            Confidential Compensation Engine
          </h2>

          <p className="text-xs text-ink-secondary leading-relaxed mt-2 max-w-md mx-auto">
            You are currently signed in as an <strong>Employee</strong>. Company compensation policies restrict access to salary disbursement batches and executive payslip records to <strong>HR Managers</strong> and <strong>System Administrators</strong>.
          </p>

          <div className="mt-6 pt-5 border-t border-edge/60">
            <span className="text-xs font-semibold text-ink-secondary block mb-2">
              Switch role to preview the Payroll management interface:
            </span>
            <div className="flex justify-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => switchRole('Admin')}
                icon={<KeyRound className="w-3.5 h-3.5" />}
              >
                Switch to Admin
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => switchRole('HR Manager')}
              >
                Switch to HR Manager
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const hasActiveFilters = !!(searchQuery || deptFilter || statusFilter)

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink-main leading-tight">
            Payroll & Compensation
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Manage staff salaries, deductions, taxes, disbursement approvals, and payslips.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCsv}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Payroll CSV
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <PayrollStats records={records} />

      {/* Filter and Period Selection Toolbar */}
      <div className="bg-[#FFFEFA] border border-edge rounded-xl p-4 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by employee name or code..."
              startIcon={<Search className="w-4 h-4 text-ink-secondary" />}
              className="text-xs py-2"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Pay Period Selection */}
            <select
              value={periodFilter}
              onChange={e => setPeriodFilter(e.target.value)}
              className="bg-ivory-page border border-edge rounded-lg px-2.5 py-1.5 text-xs text-ink-main font-semibold focus:outline-none focus:border-plum"
            >
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
            </select>

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
              <option value="Paid">Paid</option>
              <option value="Processing">Processing</option>
              <option value="Pending">Pending</option>
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
              Showing <strong className="text-ink-main">{filteredRecords.length}</strong> records
            </span>
          </div>
        </div>
      </div>

      {/* Payroll Records Table */}
      <PayrollTable
        records={filteredRecords}
        onViewPayslip={rec => setViewingRecord(rec)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Sample Payslip Preview Modal */}
      <PayslipModal
        isOpen={!!viewingRecord}
        onClose={() => setViewingRecord(null)}
        record={viewingRecord}
      />
    </div>
  )
}
