import React from 'react'
import { Cake, Award, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Avatar } from '../../components/ui/Avatar'
import { INITIAL_CELEBRATIONS } from '../../data/mockData'

export const UpcomingCelebrationsWidget: React.FC = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Upcoming Celebrations</CardTitle>
          <Sparkles className="w-4 h-4 text-terracotta" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {INITIAL_CELEBRATIONS.map(item => {
          const isBirthday = item.type === 'birthday'

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-ivory-page/50 border border-edge/60 transition-colors"
            >
              <Avatar src={item.employeeAvatar} name={item.employeeName} size="md" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-sm font-semibold text-ink-main truncate">
                    {item.employeeName}
                  </span>
                  <span className="text-[11px] font-bold text-plum bg-plum/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {item.date}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-ink-secondary">
                  {isBirthday ? (
                    <Cake className="w-3.5 h-3.5 text-terracotta" />
                  ) : (
                    <Award className="w-3.5 h-3.5 text-[#355E32]" />
                  )}
                  <span className="truncate">{item.label}</span>
                  <span className="text-ink-secondary/50">•</span>
                  <span className="truncate">{item.department}</span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
