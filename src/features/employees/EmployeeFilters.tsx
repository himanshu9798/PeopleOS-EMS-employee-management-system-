import React from 'react'
import {
  Search,
  Filter,
  Download,
  Plus,
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Department } from '../../types'

interface EmployeeFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  departmentFilter: string
  setDepartmentFilter: (dept: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  viewMode: 'table' | 'grid'
  setViewMode: (mode: 'table' | 'grid') => void
  onExportCsv: () => void
  onAddEmployee: () => void
  departments: Department[]
  totalResults: number
  canManage?: boolean
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  onClearFilters,
  hasActiveFilters,
  viewMode,
  setViewMode,
  onExportCsv,
  onAddEmployee,
  departments,
  totalResults,
  canManage = true,
}) => {
  return (
    <div className="bg-[#FFFEFA] border border-edge rounded-xl p-3 sm:p-4 shadow-soft space-y-3 mb-5">
      {/* Top row: Search, View Toggle, Export, Add */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="w-full md:max-w-md">
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, email, or designation..."
            startIcon={<Search className="w-4 h-4 text-ink-secondary" />}
            className="text-xs py-2 w-full"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-ivory-page rounded-lg border border-edge">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table'
                  ? 'bg-[#FFFEFA] text-plum shadow-soft font-bold'
                  : 'text-ink-secondary hover:text-ink-main'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#FFFEFA] text-plum shadow-soft font-bold'
                  : 'text-ink-secondary hover:text-ink-main'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Export to CSV */}
            <Button
              variant="secondary"
              size="sm"
              onClick={onExportCsv}
              icon={<Download className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              <span className="hidden sm:inline">Export</span> CSV
            </Button>

            {/* Add Employee (Admin & HR Manager only) */}
            {canManage && (
              <Button
                variant="primary"
                size="sm"
                onClick={onAddEmployee}
                icon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Add Employee
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="pt-2 border-t border-edge/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <div className="col-span-2 sm:w-auto flex items-center gap-1.5 text-ink-secondary font-semibold">
            <Filter className="w-3.5 h-3.5 text-plum" />
            <span>Filters:</span>
          </div>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="w-full sm:w-auto bg-ivory-page border border-edge rounded-lg px-2.5 py-1.5 text-xs text-ink-main focus:outline-none focus:border-plum"
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
            className="w-full sm:w-auto bg-ivory-page border border-edge rounded-lg px-2.5 py-1.5 text-xs text-ink-main focus:outline-none focus:border-plum"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Probation">Probation</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto bg-ivory-page border border-edge rounded-lg px-2.5 py-1.5 text-xs text-ink-main focus:outline-none focus:border-plum"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-terracotta hover:bg-terracotta-subtle transition-colors font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="text-ink-secondary text-[11px] self-end sm:self-center font-medium">
          Showing <span className="font-bold text-ink-main">{totalResults}</span> people
        </div>
      </div>
    </div>
  )
}
