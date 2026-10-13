import { PayrollRecord, PayrollStatus } from '../types'
import { storage } from './storage'

export const payrollService = {
  async getAll(): Promise<PayrollRecord[]> {
    return storage.getPayroll()
  },

  async getByPeriod(period: string): Promise<PayrollRecord[]> {
    const list = storage.getPayroll()
    return list.filter(p => p.payPeriod.toLowerCase() === period.toLowerCase())
  },

  async getForEmployee(employeeId: string): Promise<PayrollRecord[]> {
    const list = storage.getPayroll()
    return list.filter(p => p.employeeId === employeeId)
  },

  async updateStatus(id: string, status: PayrollStatus): Promise<PayrollRecord> {
    const list = storage.getPayroll()
    const index = list.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Payroll record not found')

    const updated: PayrollRecord = {
      ...list[index],
      status,
      paymentDate: status === 'Paid' ? new Date().toISOString().slice(0, 10) : list[index].paymentDate,
    }

    list[index] = updated
    storage.savePayroll([...list])

    return updated
  },

  async generatePayrollBatch(period: string): Promise<PayrollRecord[]> {
    const employees = storage.getEmployees().filter(e => e.status !== 'Inactive')
    const currentPayroll = storage.getPayroll()
    
    const newRecords: PayrollRecord[] = employees.map(emp => {
      // Approximate salary based on designation/department
      const base = emp.employmentType === 'Intern' ? 4200 :
                   emp.designation.includes('VP') || emp.designation.includes('Director') ? 14500 :
                   emp.designation.includes('Lead') || emp.designation.includes('Staff') ? 12000 : 9500
      const allowances = Math.round(base * 0.12)
      const deductions = Math.round(base * 0.24)
      const netSalary = base + allowances - deductions

      return {
        id: `pay-${emp.id}-${period.replace(/\s+/g, '-').toLowerCase()}`,
        employeeId: emp.id,
        employeeCode: emp.employeeId,
        employeeName: emp.fullName,
        employeeAvatar: emp.avatar,
        employeeDepartment: emp.department,
        employeeDesignation: emp.designation,
        payPeriod: period,
        basicSalary: base,
        allowances,
        deductions,
        netSalary,
        status: 'Pending',
        bankAccountMasked: '•••• ' + Math.floor(1000 + Math.random() * 9000),
        taxId: `US-TAX-${emp.employeeId.slice(-4)}`,
      }
    })

    const merged = [...newRecords, ...currentPayroll]
    storage.savePayroll(merged)
    return newRecords
  }
}
