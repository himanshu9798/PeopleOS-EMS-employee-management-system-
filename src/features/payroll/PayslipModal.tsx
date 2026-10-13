import React from 'react'
import { Printer, Download, Building, ShieldCheck, CheckCircle } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { PayrollRecord } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface PayslipModalProps {
  isOpen: boolean
  onClose: () => void
  record: PayrollRecord | null
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!record) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={`Official Payslip — ${record.payPeriod}`}
      description="Confidential Compensation Statement"
      footer={
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full">
          <span className="text-[11px] text-ink-secondary italic text-center sm:text-left">
            * Generated for demonstration purposes only.
          </span>
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-3.5 h-3.5" />}
            >
              Print / Save PDF
            </Button>
          </div>
        </div>
      }
    >
      <div className="p-3.5 sm:p-6 bg-[#FFFEFA] border border-edge rounded-2xl shadow-soft space-y-6 text-xs text-ink-main print:border-none print:shadow-none">
        {/* Brand header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-edge/80 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-plum flex items-center justify-center text-terracotta font-serif text-xl font-bold flex-shrink-0">
              P
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight text-plum">
                PeopleOS India Technologies Pvt. Ltd.
              </h2>
              <p className="text-[11px] text-ink-secondary">
                Cyber City, Tower B, Phase 2, Gurugram, Haryana 122002
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="inline-block px-2.5 py-1 rounded bg-plum/10 text-plum font-bold font-mono text-xs">
              PAYSLIP #{record.id.toUpperCase()}
            </span>
            <p className="text-[11px] text-ink-secondary mt-1">
              Pay Period: <strong className="text-ink-main">{record.payPeriod}</strong>
            </p>
            <p className="text-[11px] text-ink-secondary">
              Disbursed: {record.paymentDate ? formatDate(record.paymentDate) : 'Pending'}
            </p>
          </div>
        </div>

        {/* Employee Details Grid */}
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-ivory-page/60 border border-edge/60">
          <div>
            <span className="text-[10px] uppercase font-bold text-ink-secondary block">
              Employee Name
            </span>
            <span className="font-bold text-sm text-ink-main block mt-0.5">
              {record.employeeName}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-ink-secondary block">
              Employee Code
            </span>
            <span className="font-mono font-semibold text-ink-main block mt-0.5">
              {record.employeeCode}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-ink-secondary block">
              Department
            </span>
            <span className="font-semibold text-ink-main block mt-0.5">
              {record.employeeDepartment}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-ink-secondary block">
              Designation
            </span>
            <span className="font-semibold text-ink-main block mt-0.5 truncate">
              {record.employeeDesignation}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-ink-secondary block">
              Disbursement Method
            </span>
            <span className="font-mono text-ink-main block mt-0.5">
              Direct Deposit
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-ink-secondary block">
              Account Mask
            </span>
            <span className="font-mono text-ink-main block mt-0.5">
              {record.bankAccountMasked || '•••• 8912 (HDFC Bank)'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-ink-secondary block">
              Tax ID / PAN
            </span>
            <span className="font-mono text-ink-main block mt-0.5">
              {record.taxId || 'BKRPK4821N'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-ink-secondary block">
              Status
            </span>
            <span className="font-bold text-sage-dark flex items-center gap-1 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{record.status}</span>
            </span>
          </div>
        </div>

        {/* Breakdown: Earnings vs Deductions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="space-y-2.5">
            <div className="font-bold text-xs uppercase tracking-wider text-plum border-b border-edge pb-1 flex justify-between">
              <span>Earnings</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">Base Monthly Salary</span>
              <span className="font-mono font-semibold text-ink-main">
                {formatCurrency(record.basicSalary)}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">House Rent Allowance (HRA)</span>
              <span className="font-mono font-semibold text-ink-main">
                {formatCurrency(Math.round(record.allowances * 0.6))}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">Special & Executive Allowance</span>
              <span className="font-mono font-semibold text-ink-main">
                {formatCurrency(Math.round(record.allowances * 0.4))}
              </span>
            </div>
            <div className="border-t border-edge/60 pt-2 flex justify-between font-bold text-ink-main">
              <span>Gross Earnings</span>
              <span className="font-mono text-sage-dark font-bold">
                {formatCurrency(record.basicSalary + record.allowances)}
              </span>
            </div>
          </div>

          {/* Deductions */}
          <div className="space-y-2.5">
            <div className="font-bold text-xs uppercase tracking-wider text-plum border-b border-edge pb-1 flex justify-between">
              <span>Deductions</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">Federal Income Tax Withholding</span>
              <span className="font-mono font-semibold text-ink-main">
                {formatCurrency(Math.round(record.deductions * 0.65))}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">State & Local Tax (NY)</span>
              <span className="font-mono font-semibold text-ink-main">
                {formatCurrency(Math.round(record.deductions * 0.2))}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-secondary">Health & Dental Insurance</span>
              <span className="font-mono font-semibold text-ink-main">
                {formatCurrency(Math.round(record.deductions * 0.15))}
              </span>
            </div>
            <div className="border-t border-edge/60 pt-2 flex justify-between font-bold text-ink-main">
              <span>Total Deductions</span>
              <span className="font-mono text-red-600 font-bold">
                -{formatCurrency(record.deductions)}
              </span>
            </div>
          </div>
        </div>

        {/* Net Take-Home Pay Banner */}
        <div className="p-4 rounded-xl bg-plum text-[#FFFEFA] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D5CFC2]">
              Net Take-Home Pay
            </span>
            <p className="text-xs text-[#D5CFC2]/80 mt-0.5">
              Transferred to verified account on {record.paymentDate ? formatDate(record.paymentDate) : 'cycle date'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              {formatCurrency(record.netSalary)}
            </span>
          </div>
        </div>

        {/* Footer legal disclaimer */}
        <div className="pt-2 text-[10px] text-ink-secondary/70 text-center leading-relaxed">
          This document is generated by PeopleOS Workforce Engine. For tax inquiries or verification, contact people-ops@peopleos.internal.
        </div>
      </div>
    </Modal>
  )
}
