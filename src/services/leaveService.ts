import { LeaveRequest, LeaveType } from '../types'
import { storage } from './storage'

export const leaveService = {
  async getAll(): Promise<LeaveRequest[]> {
    return storage.getLeaves()
  },

  async getForEmployee(employeeId: string): Promise<LeaveRequest[]> {
    const list = storage.getLeaves()
    return list.filter(l => l.employeeId === employeeId)
  },

  async apply(data: {
    employeeId: string
    leaveType: LeaveType
    startDate: string
    endDate: string
    reason: string
  }): Promise<LeaveRequest> {
    const employees = storage.getEmployees()
    const targetEmp = employees.find(e => e.id === data.employeeId)
    if (!targetEmp) throw new Error('Employee not found')

    // calculate total days between start and end date inclusive
    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: targetEmp.id,
      employeeName: targetEmp.fullName,
      employeeAvatar: targetEmp.avatar,
      employeeDepartment: targetEmp.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays: isNaN(totalDays) ? 1 : totalDays,
      reason: data.reason,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    }

    const list = storage.getLeaves()
    storage.saveLeaves([newRequest, ...list])

    // Create notification
    const notifications = storage.getNotifications()
    storage.saveNotifications([
      {
        id: `notif-${Date.now()}`,
        title: 'New Leave Request',
        message: `${targetEmp.fullName} applied for ${newRequest.totalDays} day(s) of ${data.leaveType}.`,
        timestamp: 'Just now',
        read: false,
        type: 'leave',
        actionUrl: '/leave',
      },
      ...notifications,
    ])

    return newRequest
  },

  async approve(id: string, approverName: string, remarks?: string): Promise<LeaveRequest> {
    const list = storage.getLeaves()
    const index = list.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Leave request not found')

    const existing = list[index]
    const updated: LeaveRequest = {
      ...existing,
      status: 'Approved',
      approvedBy: approverName,
      approverRemarks: remarks || 'Approved by supervisor.',
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    list[index] = updated
    storage.saveLeaves([...list])

    // If leave starts on or before today and ends on or after today, set employee to 'On Leave'
    const today = new Date().toISOString().slice(0, 10)
    if (existing.startDate <= today && existing.endDate >= today) {
      const employees = storage.getEmployees()
      const empIndex = employees.findIndex(e => e.id === existing.employeeId)
      if (empIndex >= 0) {
        employees[empIndex].status = 'On Leave'
        storage.saveEmployees([...employees])
      }
    }

    // Add activity
    const activities = storage.getActivities()
    storage.saveActivities([
      {
        id: `act-${Date.now()}`,
        title: 'Leave request approved',
        description: `Approved ${existing.totalDays}d ${existing.leaveType} for ${existing.employeeName}`,
        timestamp: 'Just now',
        type: 'leave_approved',
        user: approverName,
      },
      ...activities,
    ])

    return updated
  },

  async reject(id: string, approverName: string, remarks?: string): Promise<LeaveRequest> {
    const list = storage.getLeaves()
    const index = list.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Leave request not found')

    const existing = list[index]
    const updated: LeaveRequest = {
      ...existing,
      status: 'Rejected',
      approvedBy: approverName,
      approverRemarks: remarks || 'Declined due to operational scheduling.',
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    list[index] = updated
    storage.saveLeaves([...list])

    // Add activity
    const activities = storage.getActivities()
    storage.saveActivities([
      {
        id: `act-${Date.now()}`,
        title: 'Leave request rejected',
        description: `Rejected ${existing.leaveType} for ${existing.employeeName}`,
        timestamp: 'Just now',
        type: 'leave_rejected',
        user: approverName,
      },
      ...activities,
    ])

    return updated
  },
}
