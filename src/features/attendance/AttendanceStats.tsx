import React from 'react'
import { UserCheck, Clock, UserX, CalendarOff, Users } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { AttendanceRecord } from '../../types'

interface AttendanceStatsProps {
  records: AttendanceRecord[]
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ records }) => {
  const total = records.length || 1
  const present = records.filter(r => r.status === 'Present').length
  const late = records.filter(r => r.status === 'Late').length
  const absent = records.filter(r => r.status === 'Absent').length
  const onLeave = records.filter(r => r.status === 'On Leave').length
  const halfDay = records.filter(r => r.status === 'Half Day').length

  const stats = [
    {
      title: 'Total Logged',
      value: records.length,
      icon: Users,
      color: 'text-plum',
      bg: 'bg-plum/10',
    },
    {
      title: 'Present',
      value: present,
      rate: `${Math.round((present / total) * 100)}%`,
      icon: UserCheck,
      color: 'text-[#2F542A]',
      bg: 'bg-[#EDF3EA]',
    },
    {
      title: 'Late Arrival',
      value: late,
      rate: `${Math.round((late / total) * 100)}%`,
      icon: Clock,
      color: 'text-[#AF5F41]',
      bg: 'bg-[#FAF0EB]',
    },
    {
      title: 'On Leave / Half Day',
      value: onLeave + halfDay,
      rate: `${Math.round(((onLeave + halfDay) / total) * 100)}%`,
      icon: CalendarOff,
      color: 'text-[#493653]',
      bg: 'bg-[#F4EEF7]',
    },
    {
      title: 'Absent',
      value: absent,
      rate: `${Math.round((absent / total) * 100)}%`,
      icon: UserX,
      color: 'text-[#9B2C2C]',
      bg: 'bg-[#FFF1F0]',
    },
  ]

  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 mb-5">
      {stats.map(s => {
        const Icon = s.icon
        return (
          <Card key={s.title} className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color} flex-shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold text-ink-secondary block truncate">
                {s.title}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-ink-main font-serif sm:font-sans">
                  {s.value}
                </span>
                {s.rate && (
                  <span className="text-[10px] text-ink-secondary font-medium">
                    ({s.rate})
                  </span>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
