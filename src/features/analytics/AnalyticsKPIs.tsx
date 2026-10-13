import React from 'react'
import { TrendingUp, Users, CalendarCheck, Award } from 'lucide-react'
import { Card } from '../../components/ui/Card'

export const AnalyticsKPIs: React.FC = () => {
  const kpis = [
    {
      title: 'Retention Rate',
      value: '96.4%',
      change: '+1.8% vs last quarter',
      icon: Award,
      color: 'text-plum',
      bg: 'bg-plum/10',
    },
    {
      title: 'Average Attendance Rate',
      value: '94.2%',
      change: '+0.5% vs target',
      icon: CalendarCheck,
      color: 'text-[#2F542A]',
      bg: 'bg-[#EDF3EA]',
    },
    {
      title: 'Time-to-Hire',
      value: '22 days',
      change: '-4 days from benchmark',
      icon: Users,
      color: 'text-terracotta',
      bg: 'bg-terracotta/10',
    },
    {
      title: 'Monthly Turnover',
      value: '1.2%',
      change: '-0.3% industry baseline',
      icon: TrendingUp,
      color: 'text-sage-dark',
      bg: 'bg-sage/40',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map(kpi => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.title} className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-ink-secondary block">
                {kpi.title}
              </span>
              <div className="text-2xl font-bold text-ink-main mt-0.5 font-serif sm:font-sans">
                {kpi.value}
              </div>
              <span className="text-[11px] font-medium text-sage-dark mt-1 block">
                {kpi.change}
              </span>
            </div>
            <div className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} flex-shrink-0 shadow-soft`}>
              <Icon className="w-5 h-5" />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
