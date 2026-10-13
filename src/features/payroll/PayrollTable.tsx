import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle2 } from 'lucide-react'
import { PayrollRecord } from '../../types'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatters'

interface PayrollTableProps {
  records: PayrollRecord[]
  onViewPayslip: (record: PayrollRecord) => void
  onUpdateStatus: (record: PayrollRecord, status: 'Paid') => void
}

export const PayrollTable: React.FC<PayrollTableProps> = ({
  records,
  onViewPayslip,
  onUpdateStatus,
}) => {
  return (
    <div className="w-full rounded-xl border border-edge bg-[#FFFEFA] shadow-soft overflow-hidden">
      {/* Mobile Card List (< sm: 640px) */}
      <div className="block sm:hidden divide-y divide-edge/70">
        {records.length === 0 ? (
          <div className="py-12 text-center text-ink-secondary p-4">
            <FileText className="w-8 h-8 mx-auto text-ink-secondary/40 mb-2" />
            <p className="text-sm font-semibold text-ink-main">No payroll records match your search</p>
            <p className="text-xs text-ink-secondary mt-0.5">Try altering the pay period or filter parameters.</p>
          </div>
        ) : (
          records.map(rec => (
            <div key={rec.id} className="p-4 space-y-3 hover:bg-ivory-page/30 transition-colors">
              {/* Header: Employee & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Link to={`/people/${rec.employeeId}`} className="flex-shrink-0">
                    <Avatar src={rec.employeeAvatar} name={rec.employeeName} size="md" />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      to={`/people/${rec.employeeId}`}
                      className="font-bold text-ink-main hover:text-plum transition-colors block text-sm truncate"
                    >
                      {rec.employeeName}
                    </Link>
                    <span className="text-[11px] font-mono text-ink-secondary block">
                      {rec.employeeCode} • {rec.employeeDepartment}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={
                    rec.status === 'Paid'
                      ? 'paid'
                      : rec.status === 'Processing'
                      ? 'processing'
                      : 'pending'
                  }
                  dot
                  className="flex-shrink-0"
                >
                  {rec.status}
                </Badge>
              </div>

              {/* Salary Breakdown Box */}
              <div className="bg-ivory-page/60 p-3 rounded-xl border border-edge/60 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-ink-secondary">Net Disbursed:</span>
                  <span className="font-mono text-base font-bold text-plum">
                    {formatCurrency(rec.netSalary)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1 border-t border-edge/60 text-[11px]">
                  <div>
                    <span className="text-ink-secondary block">Basic</span>
                    <span className="font-mono font-medium text-ink-main">{formatCurrency(rec.basicSalary)}</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Allowances</span>
                    <span className="font-mono font-medium text-sage-dark">+{formatCurrency(rec.allowances)}</span>
                  </div>
                  <div>
                    <span className="text-ink-secondary block">Deductions</span>
                    <span className="font-mono font-medium text-red-600">-{formatCurrency(rec.deductions)}</span>
                  </div>
                </div>
              </div>

              {/* Footer: Pay period & actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-edge/40">
                <span className="text-xs font-semibold text-ink-secondary">
                  Period: {rec.payPeriod}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onViewPayslip(rec)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-plum bg-plum/10 hover:bg-plum/15 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Payslip</span>
                  </button>

                  {rec.status !== 'Paid' && (
                    <button
                      onClick={() => onUpdateStatus(rec, 'Paid')}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#2F542A] bg-[#EDF3EA] hover:bg-[#E0EBDC] transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Disburse</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop & Tablet Table (>= sm: 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[880px]">
          <thead className="bg-ivory-page/80 border-b border-edge text-ink-secondary uppercase tracking-wider font-semibold select-none">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Employee ID</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Pay Period</th>
              <th className="py-3 px-4 text-right">Basic Salary</th>
              <th className="py-3 px-4 text-right">Allowances</th>
              <th className="py-3 px-4 text-right">Deductions</th>
              <th className="py-3 px-4 text-right font-bold text-plum">Net Salary</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge/70">
            {records.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-ink-secondary">
                  <FileText className="w-8 h-8 mx-auto text-ink-secondary/40 mb-2" />
                  <p className="text-sm font-semibold text-ink-main">No payroll records match your search</p>
                  <p className="text-xs text-ink-secondary mt-0.5">Try altering the pay period or filter parameters.</p>
                </td>
              </tr>
            ) : (
              records.map(rec => (
                <tr key={rec.id} className="hover:bg-ivory-page/50 transition-colors">
                  {/* Employee */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Link to={`/people/${rec.employeeId}`}>
                        <Avatar src={rec.employeeAvatar} name={rec.employeeName} size="sm" />
                      </Link>
                      <div>
                        <Link
                          to={`/people/${rec.employeeId}`}
                          className="font-semibold text-ink-main hover:text-plum transition-colors block text-sm"
                        >
                          {rec.employeeName}
                        </Link>
                        <span className="text-[11px] text-ink-secondary truncate max-w-[150px] block">
                          {rec.employeeDesignation}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Employee Code */}
                  <td className="py-3.5 px-4 font-mono font-medium text-ink-main">
                    {rec.employeeCode}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 font-medium text-ink-main">
                    {rec.employeeDepartment}
                  </td>

                  {/* Pay Period */}
                  <td className="py-3.5 px-4 text-ink-secondary whitespace-nowrap">
                    {rec.payPeriod}
                  </td>

                  {/* Basic Salary */}
                  <td className="py-3.5 px-4 text-right font-mono text-ink-main">
                    {formatCurrency(rec.basicSalary)}
                  </td>

                  {/* Allowances */}
                  <td className="py-3.5 px-4 text-right font-mono text-sage-dark font-medium">
                    +{formatCurrency(rec.allowances)}
                  </td>

                  {/* Deductions */}
                  <td className="py-3.5 px-4 text-right font-mono text-red-600 font-medium">
                    -{formatCurrency(rec.deductions)}
                  </td>

                  {/* Net Salary */}
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-plum text-sm">
                    {formatCurrency(rec.netSalary)}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <Badge
                      variant={
                        rec.status === 'Paid'
                          ? 'paid'
                          : rec.status === 'Processing'
                          ? 'processing'
                          : 'pending'
                      }
                      dot
                    >
                      {rec.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewPayslip(rec)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-plum hover:bg-plum/10 transition-colors cursor-pointer"
                        title="Generate Payslip"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Payslip</span>
                      </button>

                      {rec.status !== 'Paid' && (
                        <button
                          onClick={() => onUpdateStatus(rec, 'Paid')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-[#2F542A] hover:bg-[#EDF3EA] transition-colors cursor-pointer"
                          title="Mark as Disbursed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Disburse</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
