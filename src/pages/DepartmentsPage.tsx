import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Search, LayoutGrid, List, Building2, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DepartmentCard } from '../features/departments/DepartmentCard'
import { DepartmentTable } from '../features/departments/DepartmentTable'
import { DepartmentFormModal } from '../features/departments/DepartmentFormModal'
import { DepartmentDetailModal } from '../features/departments/DepartmentDetailModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { departmentService } from '../services/departmentService'
import { subscribeToStore } from '../services/storage'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { Department } from '../types'

export const DepartmentsPage: React.FC = () => {
  const { user } = useAuth()
  const toast = useToast()
  const isAdmin = user?.role === 'Admin'

  const [departments, setDepartments] = useState<Department[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [viewingDepartment, setViewingDepartment] = useState<Department | null>(null)
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null)
  const [deletionWarning, setDeletionWarning] = useState<string | null>(null)

  const loadDepartments = () => {
    departmentService.getAll().then(setDepartments)
  }

  useEffect(() => {
    loadDepartments()
    const unsubscribe = subscribeToStore(loadDepartments)
    return () => unsubscribe()
  }, [])

  const filteredDepartments = useMemo(() => {
    return departments.filter(d => {
      const q = searchQuery.toLowerCase().trim()
      return !q || d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || d.head.toLowerCase().includes(q)
    })
  }, [departments, searchQuery])

  const handleSaveDepartment = async (data: Omit<Department, 'id' | 'employeeCount' | 'createdAt'>) => {
    if (editingDepartment) {
      await departmentService.update(editingDepartment.id, data)
      toast.success(`Updated department: ${data.name}.`)
      setEditingDepartment(null)
    } else {
      await departmentService.create(data)
      toast.success(`Created department: ${data.name}.`)
      setIsAddModalOpen(false)
    }
  }

  const handleDeleteClick = (dept: Department) => {
    if (dept.employeeCount > 0) {
      setDeletionWarning(
        `Cannot delete "${dept.name}" because it currently has ${dept.employeeCount} active employee(s) assigned. Please reassign those employees in the People Directory first.`
      )
    } else {
      setDeletionWarning(null)
      setDeletingDepartment(dept)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingDepartment) return
    const res = await departmentService.delete(deletingDepartment.id)
    if (res.success) {
      toast.info(res.message)
      setDeletingDepartment(null)
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink-main leading-tight">
            Departments & Teams
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Organize operational units, appointed department heads, budgets, and team allocations.
          </p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Department
          </Button>
        )}
      </div>

      {/* Filter and view control bar */}
      <div className="bg-[#FFFEFA] border border-edge rounded-xl p-4 shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:max-w-sm">
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by department name, code, or head..."
            startIcon={<Search className="w-4 h-4 text-ink-secondary" />}
            className="text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-ink-secondary font-medium mr-2">
            {filteredDepartments.length} departments
          </span>

          <div className="flex items-center p-1 bg-ivory-page rounded-lg border border-edge">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#FFFEFA] text-plum shadow-soft font-bold'
                  : 'text-ink-secondary hover:text-ink-main'
              }`}
              title="Card view"
              aria-label="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
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
          </div>
        </div>
      </div>

      {/* Departments view */}
      {filteredDepartments.length === 0 ? (
        <div className="py-20 text-center bg-[#FFFEFA] border border-edge rounded-xl shadow-soft">
          <Building2 className="w-12 h-12 mx-auto text-ink-secondary/40 mb-3" />
          <h3 className="text-base font-bold text-ink-main">No departments found</h3>
          <p className="text-xs text-ink-secondary max-w-sm mx-auto mt-1">
            No departments match your query &ldquo;{searchQuery}&rdquo;.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map(dept => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              onView={d => setViewingDepartment(d)}
              onEdit={d => setEditingDepartment(d)}
              onDelete={d => handleDeleteClick(d)}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        <DepartmentTable
          departments={filteredDepartments}
          onView={d => setViewingDepartment(d)}
          onEdit={d => setEditingDepartment(d)}
          onDelete={d => handleDeleteClick(d)}
          isAdmin={isAdmin}
        />
      )}

      {/* Add Department Modal */}
      <DepartmentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveDepartment}
      />

      {/* Edit Department Modal */}
      {editingDepartment && (
        <DepartmentFormModal
          isOpen={!!editingDepartment}
          onClose={() => setEditingDepartment(null)}
          onSave={handleSaveDepartment}
          initialData={editingDepartment}
        />
      )}

      {/* Department Team Members Detail Modal */}
      <DepartmentDetailModal
        isOpen={!!viewingDepartment}
        onClose={() => setViewingDepartment(null)}
        department={viewingDepartment}
      />

      {/* Deletion Prevention Warning Dialog */}
      <ConfirmDialog
        isOpen={!!deletionWarning}
        onClose={() => setDeletionWarning(null)}
        onConfirm={() => setDeletionWarning(null)}
        title="Deletion Restricted"
        message={deletionWarning || ''}
        confirmText="Understood"
        cancelText="Close"
        iconType="warning"
      />

      {/* Delete Department Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingDepartment}
        onClose={() => setDeletingDepartment(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Department "${deletingDepartment?.name}"?`}
        message={`Are you sure you want to permanently delete the ${deletingDepartment?.name} department? This action cannot be reversed.`}
        confirmText="Delete Department"
        isDestructive
      />
    </div>
  )
}
