import { AttendanceRecord, AttendanceStatus } from '../types'
import { calculateWorkingHours } from '../utils/formatters'
import { storage } from './storage'

export const attendanceService = {
  async getByDate(date: string): Promise<AttendanceRecord[]> {
    const list = storage.getAttendance()
    return list.filter(a => a.date === date)
  },

  async getToday(): Promise<AttendanceRecord[]> {
    const today = new Date().toISOString().slice(0, 10)
    const list = storage.getAttendance()
    const records = list.filter(a => a.date === today)
    if (records.length > 0) return records
    // Return the latest date's records if today has none yet
    return list
  },

  async getForEmployee(employeeId: string): Promise<AttendanceRecord[]> {
    const list = storage.getAttendance()
    return list.filter(a => a.employeeId === employeeId)
  },

  async markAttendance(data: {
    employeeId: string
    date: string
    checkIn: string
    checkOut: string
    status: AttendanceStatus
    notes?: string
  }): Promise<AttendanceRecord> {
    const employees = storage.getEmployees()
    const targetEmp = employees.find(e => e.id === data.employeeId)
    if (!targetEmp) throw new Error('Employee not found')

    const list = storage.getAttendance()
    const existingIndex = list.findIndex(
      a => a.employeeId === data.employeeId && a.date === data.date
    )

    const workingHours = calculateWorkingHours(data.checkIn, data.checkOut)

    const record: AttendanceRecord = {
      id: existingIndex >= 0 ? list[existingIndex].id : `att-${Date.now()}`,
      employeeId: targetEmp.id,
      employeeName: targetEmp.fullName,
      employeeAvatar: targetEmp.avatar,
      employeeDepartment: targetEmp.department,
      date: data.date,
      checkIn: data.checkIn || '--',
      checkOut: data.checkOut || '--',
      workingHours,
      status: data.status,
      notes: data.notes,
    }

    if (existingIndex >= 0) {
      list[existingIndex] = record
    } else {
      list.unshift(record)
    }

    storage.saveAttendance([...list])

    // Log activity
    const activities = storage.getActivities()
    storage.saveActivities([
      {
        id: `act-${Date.now()}`,
        title: 'Attendance marked',
        description: `Marked ${data.status} for ${targetEmp.fullName} on ${data.date}`,
        timestamp: 'Just now',
        type: 'attendance_updated',
        user: 'Current User',
      },
      ...activities,
    ])

    return record
  },

  async updateRecord(
    id: string,
    updates: {
      checkIn: string
      checkOut: string
      status: AttendanceStatus
      notes?: string
    }
  ): Promise<AttendanceRecord> {
    const list = storage.getAttendance()
    const index = list.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Attendance record not found')

    const existing = list[index]
    const workingHours = calculateWorkingHours(updates.checkIn, updates.checkOut)

    const updated: AttendanceRecord = {
      ...existing,
      ...updates,
      workingHours,
    }

    list[index] = updated
    storage.saveAttendance([...list])

    return updated
  },
}
