import { 
  Employee, 
  Department, 
  AttendanceRecord, 
  LeaveRequest, 
  PayrollRecord, 
  Notification, 
  ActivityEvent,
  OrganizationSettings
} from '../types'
import {
  INITIAL_EMPLOYEES,
  INITIAL_DEPARTMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_ORGANIZATION_SETTINGS
} from '../data/mockData'

const STORAGE_KEYS = {
  EMPLOYEES: 'peopleos_employees_v4',
  DEPARTMENTS: 'peopleos_departments_v4',
  ATTENDANCE: 'peopleos_attendance_v4',
  LEAVES: 'peopleos_leaves_v4',
  PAYROLL: 'peopleos_payroll_v4',
  NOTIFICATIONS: 'peopleos_notifications_v4',
  ACTIVITIES: 'peopleos_activities_v4',
  ORG_SETTINGS: 'peopleos_org_settings_v4',
}

type StorageListener = () => void
const listeners = new Set<StorageListener>()

function notifyListeners() {
  listeners.forEach(fn => {
    try {
      fn()
    } catch (e) {
      console.error('Storage listener error:', e)
    }
  })
}

export function subscribeToStore(listener: StorageListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    if (!item) return fallback
    return JSON.parse(item) as T
  } catch {
    return fallback
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('Could not save to localStorage:', e)
  }
  notifyListeners()
}

// Storage Accessors
export const storage = {
  getEmployees: (): Employee[] => getStored<Employee[]>(STORAGE_KEYS.EMPLOYEES, INITIAL_EMPLOYEES),
  saveEmployees: (data: Employee[]) => setStored(STORAGE_KEYS.EMPLOYEES, data),

  getDepartments: (): Department[] => getStored<Department[]>(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS),
  saveDepartments: (data: Department[]) => setStored(STORAGE_KEYS.DEPARTMENTS, data),

  getAttendance: (): AttendanceRecord[] => getStored<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
  saveAttendance: (data: AttendanceRecord[]) => setStored(STORAGE_KEYS.ATTENDANCE, data),

  getLeaves: (): LeaveRequest[] => getStored<LeaveRequest[]>(STORAGE_KEYS.LEAVES, INITIAL_LEAVES),
  saveLeaves: (data: LeaveRequest[]) => setStored(STORAGE_KEYS.LEAVES, data),

  getPayroll: (): PayrollRecord[] => getStored<PayrollRecord[]>(STORAGE_KEYS.PAYROLL, INITIAL_PAYROLL),
  savePayroll: (data: PayrollRecord[]) => setStored(STORAGE_KEYS.PAYROLL, data),

  getNotifications: (): Notification[] => getStored<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (data: Notification[]) => setStored(STORAGE_KEYS.NOTIFICATIONS, data),

  getActivities: (): ActivityEvent[] => getStored<ActivityEvent[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES),
  saveActivities: (data: ActivityEvent[]) => setStored(STORAGE_KEYS.ACTIVITIES, data),

  getOrgSettings: (): OrganizationSettings => getStored<OrganizationSettings>(STORAGE_KEYS.ORG_SETTINGS, INITIAL_ORGANIZATION_SETTINGS),
  saveOrgSettings: (data: OrganizationSettings) => setStored(STORAGE_KEYS.ORG_SETTINGS, data),

  // Reset to initial state helper
  resetAll: () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k))
    notifyListeners()
  }
}
