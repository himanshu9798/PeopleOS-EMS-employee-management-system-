import { Department } from '../types'
import { storage } from './storage'

export const departmentService = {
  async getAll(): Promise<Department[]> {
    const departments = storage.getDepartments()
    const employees = storage.getEmployees()

    // Recalculate real-time active employee count per department
    return departments.map(d => ({
      ...d,
      employeeCount: employees.filter(e => e.department.toLowerCase() === d.name.toLowerCase() && e.status !== 'Inactive').length,
    }))
  },

  async getById(id: string): Promise<Department | null> {
    const list = await this.getAll()
    return list.find(d => d.id === id || d.code.toLowerCase() === id.toLowerCase()) || null
  },

  async create(data: Omit<Department, 'id' | 'employeeCount' | 'createdAt'>): Promise<Department> {
    const list = storage.getDepartments()
    const newDept: Department = {
      ...data,
      id: `dept-${Date.now().toString().slice(-4)}`,
      employeeCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    }

    storage.saveDepartments([newDept, ...list])

    // Log activity
    const activities = storage.getActivities()
    storage.saveActivities([
      {
        id: `act-${Date.now()}`,
        title: 'Department created',
        description: `Created new department: ${data.name} (${data.code})`,
        timestamp: 'Just now',
        type: 'department_modified',
        user: 'Current User',
      },
      ...activities,
    ])

    return newDept
  },

  async update(id: string, changes: Partial<Department>): Promise<Department> {
    const list = storage.getDepartments()
    const index = list.findIndex(d => d.id === id)
    if (index === -1) throw new Error('Department not found')

    const updated = { ...list[index], ...changes }
    list[index] = updated
    storage.saveDepartments([...list])

    // Log activity
    const activities = storage.getActivities()
    storage.saveActivities([
      {
        id: `act-${Date.now()}`,
        title: 'Department updated',
        description: `Updated details for ${updated.name}`,
        timestamp: 'Just now',
        type: 'department_modified',
        user: 'Current User',
      },
      ...activities,
    ])

    return updated
  },

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const list = storage.getDepartments()
    const target = list.find(d => d.id === id)
    if (!target) {
      return { success: false, message: 'Department does not exist.' }
    }

    const employees = storage.getEmployees()
    const assignedEmployees = employees.filter(
      e => e.department.toLowerCase() === target.name.toLowerCase() && e.status !== 'Inactive'
    )

    if (assignedEmployees.length > 0) {
      return {
        success: false,
        message: `Cannot delete "${target.name}" because it still has ${assignedEmployees.length} active employee(s) assigned. Please reassign them before deleting this department.`,
      }
    }

    const filtered = list.filter(d => d.id !== id)
    storage.saveDepartments(filtered)

    const activities = storage.getActivities()
    storage.saveActivities([
      {
        id: `act-${Date.now()}`,
        title: 'Department deleted',
        description: `Removed department: ${target.name}`,
        timestamp: 'Just now',
        type: 'department_modified',
        user: 'Current User',
      },
      ...activities,
    ])

    return { success: true, message: `Department "${target.name}" was successfully deleted.` }
  },
}
