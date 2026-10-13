import React from 'react'
import { UserPlus, CheckCircle, Clock, Building, CreditCard, Activity } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { ActivityEvent } from '../../types'

interface RecentActivityWidgetProps {
  activities: ActivityEvent[]
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ activities }) => {
  const getIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'employee_added':
        return <UserPlus className="w-4 h-4 text-plum" />
      case 'leave_approved':
        return <CheckCircle className="w-4 h-4 text-[#355E32]" />
      case 'attendance_updated':
        return <Clock className="w-4 h-4 text-terracotta" />
      case 'department_modified':
        return <Building className="w-4 h-4 text-plum-light" />
      case 'payroll_processed':
        return <CreditCard className="w-4 h-4 text-[#2F542A]" />
      default:
        return <Activity className="w-4 h-4 text-ink-secondary" />
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <span className="text-xs text-ink-secondary">Operations audit feed</span>
      </CardHeader>

      <CardContent className="space-y-4">
        {activities.slice(0, 5).map(event => (
          <div key={event.id} className="flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-ivory-page border border-edge flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft">
              {getIcon(event.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="font-semibold text-ink-main truncate leading-tight">
                  {event.title}
                </span>
                <span className="text-[10px] text-ink-secondary whitespace-nowrap">
                  {event.timestamp}
                </span>
              </div>
              <p className="text-ink-secondary mt-0.5 leading-snug">
                {event.description}
              </p>
              {event.user && (
                <span className="text-[10px] text-ink-secondary/70 font-medium">
                  Triggered by {event.user}
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
