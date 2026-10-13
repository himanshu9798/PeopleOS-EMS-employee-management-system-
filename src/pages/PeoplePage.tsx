import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Download, ChevronLeft, ChevronRight, Users, Trash2 } from 'lucide-react'
import { EmployeeFilters } from '../features/employees/EmployeeFilters'
import { EmployeeTable } from '../features/employees/EmployeeTable'
import { EmployeeGrid } from '../features/employees/EmployeeGrid'
import { EmployeeFormModal } from '../features/employees/EmployeeFormModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Button } from '../components/ui/Button'
import { storage, subscribeToStore } from '../services/storage'
import { employeeService } from '../services/employeeService'
import { departmentService } from '../services/departmentService'
import { exportToCsv } from '../utils/exportCsv'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { Employee, Department } from '../types'

export const PeoplePage: React.FC = () => {
  const { user } = useAuth()
  const toast = useToast()
  const canManage = user?.role === 'Admin' || user?.role === 'HR Manager'

  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Sorting
  const [sortField, setSortField] = useState<keyof Employee>('fullName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deactivatingEmployee, setDeactivatingEmployee] = useState<Employee | null>(null)

  const loadData = () => {
    employeeService.getAll().then(setEmployees)
    departmentService.getAll().then(setDepartments)
  }

  useEffect(() => {
    loadData()
    const unsubscribe = subscribeToStore(loadData)
    return () => unsubscribe()
  }, [])

  // Filtering
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        emp.fullName.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.workEmail.toLowerCase().includes(q) ||
        emp.designation.toLowerCase().includes(q)

      const matchesDept = !departmentFilter || emp.department === departmentFilter
      const matchesStatus = !statusFilter || emp.status === statusFilter
      const matchesType = !typeFilter || emp.employmentType === typeFilter

      return matchesSearch && matchesDept && matchesStatus && matchesType
    })
  }, [employees, searchQuery, departmentFilter, statusFilter, typeFilter])

  // Sorting
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const aVal = String(a[sortField] || '').toLowerCase()
      const bVal = String(b[sortField] || '').toLowerCase()

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredEmployees, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sortedEmployees.length / pageSize) || 1
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedEmployees.slice(start, start + pageSize)
  }, [sortedEmployees, currentPage, pageSize])

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedEmployees.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedEmployees.map(e => e.id))
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setDepartmentFilter('')
    setStatusFilter('')
    setTypeFilter('')
    setCurrentPage(1)
  }

  const hasActiveFilters = !!(searchQuery || departmentFilter || statusFilter || typeFilter)

  // Export filtered to CSV
  const handleExportCsv = () => {
    const headers = [
      'Employee ID',
      'Full Name',
      'Work Email',
      'Phone',
      'Department',
      'Designation',
      'Employment Type',
      'Status',
      'Joining Date',
      'Work Location',
    ]

    const rows = filteredEmployees.map(e => [
      e.employeeId,
      e.fullName,
      e.workEmail,
      e.phone,
      e.department,
      e.designation,
      e.employmentType,
      e.status,
      e.joiningDate,
      e.workLocation,
    ])

    exportToCsv('PeopleOS_Employees', headers, rows)
    toast.success(`Exported ${filteredEmployees.length} employee records to CSV.`)
  }

  // Add or Edit Employee
  const handleSaveEmployee = async (data: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      await employeeService.update(editingEmployee.id, data)
      toast.success(`Updated details for ${data.fullName}.`)
      setEditingEmployee(null)
    } else {
      await employeeService.create(data)
      toast.success(`Added ${data.fullName} to the directory.`)
      setIsAddModalOpen(false)
    }
  }

  // Deactivate or Delete Employee
  const handleConfirmDeactivate = async () => {
    if (!deactivatingEmployee) return
    if (deactivatingEmployee.status === 'Inactive') {
      await employeeService.delete(deactivatingEmployee.id)
      toast.info(`Deleted employee record for ${deactivatingEmployee.fullName}.`)
    } else {
      await employeeService.deactivate(deactivatingEmployee.id)
      toast.info(`Deactivated ${deactivatingEmployee.fullName}. Status changed to Inactive.`)
    }
    setDeactivatingEmployee(null)
  }

  // Bulk deactivation
  const handleBulkDeactivate = async () => {
    for (const id of selectedIds) {
      await employeeService.deactivate(id)
    }
    toast.info(`Deactivated ${selectedIds.length} selected employees.`)
    setSelectedIds([])
  }

  return (
    <div className="space-y-4">
      {/* Page Title & Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink-main leading-tight">
            People Directory
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Manage employee rosters, profiles, organizational assignments, and employment status.
          </p>
        </div>

        {canManage && selectedIds.length > 0 && (
          <div className="flex items-center gap-2 bg-plum text-white px-3 py-1.5 rounded-lg text-xs font-semibold animate-in fade-in">
            <span>{selectedIds.length} selected</span>
            <button
              onClick={handleBulkDeactivate}
              className="underline text-terracotta-light hover:text-white ml-2 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Deactivate Selected</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <EmployeeFilters
        searchQuery={searchQuery}
        setSearchQuery={q => {
          setSearchQuery(q)
          setCurrentPage(1)
        }}
        departmentFilter={departmentFilter}
        setDepartmentFilter={d => {
          setDepartmentFilter(d)
          setCurrentPage(1)
        }}
        statusFilter={statusFilter}
        setStatusFilter={s => {
          setStatusFilter(s)
          setCurrentPage(1)
        }}
        typeFilter={typeFilter}
        setTypeFilter={t => {
          setTypeFilter(t)
          setCurrentPage(1)
        }}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onExportCsv={handleExportCsv}
        onAddEmployee={() => setIsAddModalOpen(true)}
        departments={departments}
        totalResults={filteredEmployees.length}
        canManage={canManage}
      />

      {/* Directory Content (Table or Grid) */}
      {filteredEmployees.length === 0 ? (
        <div className="py-20 text-center bg-[#FFFEFA] border border-edge rounded-xl shadow-soft">
          <Users className="w-12 h-12 mx-auto text-ink-secondary/40 mb-3" />
          <h3 className="text-base font-bold text-ink-main">No employees found</h3>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto mt-1">
            No employee records matched your filter criteria. Try adjusting or clearing search terms.
          </p>
          <Button variant="secondary" size="sm" onClick={handleClearFilters} className="mt-4">
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'table' ? (
        <EmployeeTable
          employees={paginatedEmployees}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onEdit={emp => setEditingEmployee(emp)}
          onDeactivate={emp => setDeactivatingEmployee(emp)}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          canManage={canManage}
        />
      ) : (
        <EmployeeGrid
          employees={paginatedEmployees}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onEdit={emp => setEditingEmployee(emp)}
          onDeactivate={emp => setDeactivatingEmployee(emp)}
          canManage={canManage}
        />
      )}

      {/* Pagination Footer */}
      {filteredEmployees.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 px-1 text-xs text-ink-secondary">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="bg-[#FFFEFA] border border-edge rounded px-2 py-1 text-xs text-ink-main font-semibold"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-ink-secondary/70">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredEmployees.length)} of{' '}
              {filteredEmployees.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <span className="px-3 font-semibold text-ink-main">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              icon={<ChevronRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      <EmployeeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveEmployee}
      />

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <EmployeeFormModal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          onSave={handleSaveEmployee}
          initialData={editingEmployee}
        />
      )}

      {/* Deactivate / Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deactivatingEmployee}
        onClose={() => setDeactivatingEmployee(null)}
        onConfirm={handleConfirmDeactivate}
        title={
          deactivatingEmployee?.status === 'Inactive'
            ? `Delete ${deactivatingEmployee?.fullName}?`
            : `Deactivate ${deactivatingEmployee?.fullName}?`
        }
        message={
          deactivatingEmployee?.status === 'Inactive'
            ? 'This will permanently remove the employee record from the directory and operations database.'
            : 'This employee will be marked Inactive and access will be revoked. Their historical records will remain for audit purposes.'
        }
        confirmText={
          deactivatingEmployee?.status === 'Inactive'
            ? 'Delete Record'
            : 'Deactivate Employee'
        }
        isDestructive
      />
    </div>
  )
}
