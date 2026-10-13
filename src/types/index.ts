export type EmploymentStatus = 'Active' | 'On Leave' | 'Probation' | 'Inactive'
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern'
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'On Leave' | 'Half Day'
export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Unpaid Leave' | 'Work From Home'
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected'
export type PayrollStatus = 'Paid' | 'Processing' | 'Pending'
export type UserRole = 'Admin' | 'HR Manager' | 'Employee'

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface Employee {
  id: string
  employeeId: string // e.g. "EMP-1042"
  firstName: string
  lastName: string
  fullName: string
  avatar: string
  workEmail: string
  phone: string
  dateOfBirth: string
  gender?: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say'
  address: string
  
  // Employment details
  department: string
  designation: string
  reportingManager: string
  employmentType: EmploymentType
  joiningDate: string
  status: EmploymentStatus
  workLocation: string // e.g. "New York HQ", "San Francisco", "Remote - EMEA"
  
  // Emergency contact
  emergencyContact: EmergencyContact
  
  // Additional details
  skills: string[]
  notes?: string
}

export interface Department {
  id: string
  name: string
  code: string // e.g. "ENG", "HR", "FIN"
  description: string
  head: string
  headAvatar?: string
  employeeCount: number
  budget?: string
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeName: string
  employeeAvatar: string
  employeeDepartment: string
  date: string // YYYY-MM-DD
  checkIn: string // HH:mm or "--"
  checkOut: string // HH:mm or "--"
  workingHours: number // e.g. 8.5
  status: AttendanceStatus
  notes?: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  employeeAvatar: string
  employeeDepartment: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  requestDate: string
  status: LeaveStatus
  approverRemarks?: string
  approvedBy?: string
  updatedAt?: string
}

export interface PayrollRecord {
  id: string
  employeeId: string
  employeeCode: string
  employeeName: string
  employeeAvatar: string
  employeeDepartment: string
  employeeDesignation: string
  payPeriod: string // e.g. "October 2026"
  basicSalary: number
  allowances: number
  deductions: number
  netSalary: number
  status: PayrollStatus
  paymentDate?: string
  bankAccountMasked?: string
  taxId?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'leave' | 'employee' | 'attendance' | 'payroll' | 'system'
  actionUrl?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  department: string
  designation: string
}

export interface ActivityEvent {
  id: string
  title: string
  description: string
  timestamp: string
  type: 'employee_added' | 'leave_approved' | 'leave_rejected' | 'attendance_updated' | 'department_modified' | 'payroll_processed'
  user: string
  userAvatar?: string
}

export interface Celebration {
  id: string
  employeeId: string
  employeeName: string
  employeeAvatar: string
  department: string
  type: 'birthday' | 'anniversary'
  date: string // e.g. "Tomorrow, Oct 14"
  label: string // e.g. "Turning 29" or "3rd Work Anniversary"
}

export interface OrganizationSettings {
  companyName: string
  legalName: string
  companyLogo: string
  contactEmail: string
  contactPhone: string
  website: string
  headquarters: string
  workLocations: string[]
  timezone: string
  fiscalYearStart: string
}

export interface UserPreferences {
  tableDensity: 'compact' | 'comfortable'
  sidebarCollapsed: boolean
  emailNotifications: {
    leaveRequests: boolean
    payrollAlerts: boolean
    newAnnouncements: boolean
    attendanceAlerts: boolean
  }
  inAppNotifications: {
    browserPopups: boolean
    soundEffects: boolean
    activityDigest: boolean
  }
}
