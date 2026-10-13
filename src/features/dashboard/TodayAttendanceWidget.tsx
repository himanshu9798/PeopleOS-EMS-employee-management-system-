import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, UserCheck, Clock, UserX, CalendarOff } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { AttendanceRecord } from '../../types'

interface TodayAttendanceWidgetProps {
  records: AttendanceRecord[]
}

export const TodayAttendanceWidget: React.FC<TodayAttendanceWidgetProps> = ({ records }) => {
  const total = records.length || 15
  const presentCount = records.filter(r => r.status === 'Present').length
  const lateCount = records.filter(r => r.status === 'Late').length
  const absentCount = records.filter(r => r.status === 'Absent').length
  const onLeaveCount = records.filter(r => r.status === 'On Leave').length

  const items = [
    {
      label: 'Present',
      count: presentCount,
      percentage: Math.round((presentCount / total) * 100),
      colorBg: 'bg-[#355E32]',
      colorText: 'text-[#2F542A]',
      icon: UserCheck,
    },
    {
      label: 'Late',
      count: lateCount,
      percentage: Math.round((lateCount / total) * 100),
      colorBg: 'bg-[#C87555]',
      colorText: 'text-[#AF5F41]',
      icon: Clock,
    },
    {
      label: 'Absent',
      count: absentCount,
      percentage: Math.round((absentCount / total) * 100),
      colorBg: 'bg-[#C83535]',
      colorText: 'text-[#9B2C2C]',
      icon: UserX,
    },
    {
      label: 'On Leave',
      count: onLeaveCount,
      percentage: Math.round((onLeaveCount / total) * 100),
      colorBg: 'bg-[#493653]',
      colorText: 'text-[#493653]',
      icon: CalendarOff,
    },
  ]

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Today&apos;s Attendance</CardTitle>
        <Link
          to="/attendance"
          className="text-xs font-semibold text-plum hover:text-terracotta flex items-center gap-1 transition-colors"
        >
          <span>Attendance logs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-4">
        {items.map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${item.colorText}`} />
                  <span className="font-semibold text-ink-main">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5 text-ink-secondary">
                  <span className="font-bold text-ink-main">{item.count}</span>
                  <span>({item.percentage}%)</span>
                </div>
              </div>

              {/* Compact progress bar */}
              <div className="w-full h-2 rounded-full bg-ivory-page border border-edge/60 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${item.colorBg}`}
                  style={{ width: `${Math.min(100, Math.max(2, item.percentage))}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
