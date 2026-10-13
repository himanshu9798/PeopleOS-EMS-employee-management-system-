import React from 'react'
import { Clock, CheckCircle, XCircle, CalendarOff, CalendarCheck } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { LeaveRequest } from '../../types'

interface LeaveStatsProps {
  leaves: LeaveRequest[]
  onLeaveTodayCount: number
  isEmployeeView?: boolean
}

export const LeaveStats: React.FC<LeaveStatsProps> = ({
  leaves,
  onLeaveTodayCount,
  isEmployeeView = false,
}) => {
  const pending = leaves.filter(l => l.status === 'Pending').length
  const approvedLeaves = leaves.filter(l => l.status === 'Approved')
  const approved = approvedLeaves.length
  const rejected = leaves.filter(l => l.status === 'Rejected').length

  const myApprovedDays = approvedLeaves.reduce((acc, curr) => acc + (curr.totalDays || 0), 0)

  const stats = [
    {
      title: isEmployeeView ? 'My Pending Requests' : 'Pending Requests',
      value: pending,
      icon: Clock,
      color: 'text-[#8C6212]',
      bg: 'bg-[#FFF9EB]',
      badge:
        pending > 0
          ? isEmployeeView
            ? `${pending} awaiting review`
            : `${pending} action needed`
          : 'All cleared',
    },
    {
      title: isEmployeeView ? 'My Approved Leaves' : 'Approved Requests',
      value: approved,
      icon: CheckCircle,
      color: 'text-[#2F542A]',
      bg: 'bg-[#EDF3EA]',
      badge: isEmployeeView ? 'Sanctioned requests' : 'Active & upcoming',
    },
    {
      title: isEmployeeView ? 'My Rejected Requests' : 'Rejected Requests',
      value: rejected,
      icon: XCircle,
      color: 'text-[#9B2C2C]',
      bg: 'bg-[#FFF1F0]',
      badge: isEmployeeView ? 'Declined by manager' : 'Archived records',
    },
    {
      title: isEmployeeView ? 'My Days Taken (Approved)' : 'Employees on Leave Today',
      value: isEmployeeView ? `${myApprovedDays}d` : onLeaveTodayCount,
      icon: isEmployeeView ? CalendarCheck : CalendarOff,
      color: 'text-plum',
      bg: 'bg-plum/10',
      badge: isEmployeeView ? 'Current year total' : 'Active today',
    },
  ]

  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
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
              <span className="text-[10px] font-medium text-ink-secondary mt-1 block">
                {s.badge}
              </span>
            </div>
            <div
              className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center ${s.color} flex-shrink-0 shadow-soft`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
