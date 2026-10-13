import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'

const data = [
  { month: 'May 2026', headcount: 218, newHires: 12 },
  { month: 'Jun 2026', headcount: 226, newHires: 10 },
  { month: 'Jul 2026', headcount: 231, newHires: 8 },
  { month: 'Aug 2026', headcount: 238, newHires: 9 },
  { month: 'Sep 2026', headcount: 242, newHires: 6 },
  { month: 'Oct 2026', headcount: 248, newHires: 7 },
]

export const HeadcountGrowthChart: React.FC = () => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Employee Growth</CardTitle>
          <CardDescription>Monthly active headcount trajectory over last 6 months</CardDescription>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-ink-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-plum" />
            Total Headcount
          </span>
          <span className="flex items-center gap-1.5 font-medium text-ink-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
            New Hires
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-[280px]">
        <div className="h-full w-full min-h-[260px]">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="headcountGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#493653" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#493653" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="hiresGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C87555" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C87555" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0D5" />
              <XAxis
                dataKey="month"
                stroke="#77786F"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#77786F"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 20', 'dataMax + 10']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFEFA',
                  borderColor: '#E5E0D5',
                  borderRadius: '10px',
                  boxShadow: '0 4px 15px rgba(51, 38, 59, 0.08)',
                  fontSize: '12px',
                  color: '#252923',
                }}
              />
              <Area
                type="monotone"
                dataKey="headcount"
                name="Headcount"
                stroke="#493653"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#headcountGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
