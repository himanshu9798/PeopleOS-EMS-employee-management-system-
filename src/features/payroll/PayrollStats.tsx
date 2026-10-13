import React from 'react'
import { DollarSign, CheckCircle2, Clock, Calendar } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { PayrollRecord } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface PayrollStatsProps {
  records: PayrollRecord[]
}

export const PayrollStats: React.FC<PayrollStatsProps> = ({ records }) => {
  const totalNet = records.reduce((sum, r) => sum + r.netSalary, 0)
  const paidCount = records.filter(r => r.status === 'Paid').length
  const pendingCount = records.filter(r => r.status === 'Pending' || r.status === 'Processing').length

  const stats = [
    {
      title: 'Total Monthly Payroll',
      value: formatCurrency(totalNet),
      subtitle: `${records.length} total staff records`,
      icon: DollarSign,
      color: 'text-plum',
      bg: 'bg-plum/10',
    },
    {
      title: 'Employees Processed',
      value: paidCount,
      subtitle: `${Math.round((paidCount / (records.length || 1)) * 100)}% of monthly cycle`,
      icon: CheckCircle2,
      color: 'text-[#2F542A]',
      bg: 'bg-[#EDF3EA]',
    },
    {
      title: 'Pending Payroll',
      value: pendingCount,
      subtitle: 'Awaiting executive sign-off',
      icon: Clock,
      color: 'text-[#8C6212]',
      bg: 'bg-[#FFF9EB]',
    },
    {
      title: 'Last Payroll Date',
      value: 'Oct 01, 2026',
      subtitle: 'Disbursed via Direct Deposit',
      icon: Calendar,
      color: 'text-terracotta',
      bg: 'bg-terracotta/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {stats.map(s => {
        const Icon = s.icon
        return (
          <Card key={s.title} className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-ink-secondary block">
                {s.title}
              </span>
              <div className="text-2xl font-bold text-ink-main mt-0.5 font-serif sm:font-sans">
                {s.value}
              </div>
              <span className="text-[11px] text-ink-secondary mt-1 block">
                {s.subtitle}
              </span>
            </div>
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center ${s.color} flex-shrink-0 shadow-soft`}>
              <Icon className="w-5 h-5" />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
