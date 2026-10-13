import { Employee } from '../types'
import { storage } from './storage'

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return storage.getEmployees()
  },

  async getById(id: string): Promise<Employee | null> {
    const list = storage.getEmployees()
    return list.find(e => e.id === id || e.employeeId === id) || null
  },

  async create(data: Omit<Employee, 'id'>): Promise<Employee> {
    const list = storage.getEmployees()
    const newId = `emp-${Date.now().toString().slice(-4)}`
    
    // ensure full name is set
    const fullName = data.fullName || `${data.firstName} ${data.lastName}`.trim()
    const newEmployee: Employee = {
      ...data,
      id: newId,
      fullName,
    }

    const updated = [newEmployee, ...list]
    storage.saveEmployees(updated)

    // Add activity
    const activities = storage.getActivities()
    storage.saveActivities([
      {
        id: `act-${Date.now()}`,
        title: 'New employee added',
        description: `${fullName} joined as ${data.designation} in ${data.department}`,
        timestamp: 'Just now',
        type: 'employee_added',
        user: 'Current User',
      },
      ...activities,
    ])

    // Update department count
    const depts = storage.getDepartments()
    const targetDept = depts.find(d => d.name === data.department)
    if (targetDept) {
      targetDept.employeeCount += 1
      storage.saveDepartments([...depts])
    }

    return newEmployee
  },

  async update(id: string, changes: Partial<Employee>): Promise<Employee> {
    const list = storage.getEmployees()
    const index = list.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Employee not found')

    const existing = list[index]
    const updatedEmployee: Employee = {
      ...existing,
      ...changes,
      fullName: changes.firstName || changes.lastName 
        ? `${changes.firstName || existing.firstName} ${changes.lastName || existing.lastName}`.trim() 
        : existing.fullName,
    }

    list[index] = updatedEmployee
    storage.saveEmployees([...list])
    return updatedEmployee
  },

  async deactivate(id: string): Promise<Employee> {
    return this.update(id, { status: 'Inactive' })
  },

  async delete(id: string): Promise<boolean> {
    const list = storage.getEmployees()
    const target = list.find(e => e.id === id)
    if (!target) return false

    const filtered = list.filter(e => e.id !== id)
    storage.saveEmployees(filtered)

    // Update department count if active
    if (target.status !== 'Inactive') {
      const depts = storage.getDepartments()
      const d = depts.find(dept => dept.name === target.department)
      if (d && d.employeeCount > 0) {
        d.employeeCount -= 1
        storage.saveDepartments([...depts])
      }
    }

    return true
  },
}
