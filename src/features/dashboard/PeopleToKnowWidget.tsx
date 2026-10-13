import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { Employee } from '../../types'

interface PeopleToKnowWidgetProps {
  employees: Employee[]
}

export const PeopleToKnowWidget: React.FC<PeopleToKnowWidgetProps> = ({ employees }) => {
  // Pick active employees across various departments
  const selected = employees.filter(e => e.status === 'Active').slice(0, 4)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>People to Know</CardTitle>
        <Link
          to="/people"
          className="text-xs font-semibold text-plum hover:text-terracotta flex items-center gap-1 transition-colors"
        >
          <span>All directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {selected.map(emp => (
          <Link
            key={emp.id}
            to={`/people/${emp.id}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-ivory-page transition-colors group"
          >
            <Avatar src={emp.avatar} name={emp.fullName} size="md" status="online" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink-main group-hover:text-plum truncate transition-colors">
                {emp.fullName}
              </div>
              <div className="text-xs text-ink-secondary truncate">
                {emp.designation}
              </div>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-edge text-ink-secondary flex-shrink-0">
              {emp.department}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
