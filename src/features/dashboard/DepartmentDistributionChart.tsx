import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { Department } from '../../types'

interface DepartmentDistributionChartProps {
  departments: Department[]
}

const COLORS = [
  '#493653', // Engineering (Muted Plum)
  '#C87555', // Operations / Sales (Terracotta)
  '#4A7145', // Finance (Sage Dark)
  '#654C72', // Marketing (Plum light)
  '#B26143', // Operations (Terracotta dark)
  '#8E7599', // Human Resources (Plum subtle)
]

export const DepartmentDistributionChart: React.FC<DepartmentDistributionChartProps> = ({
  departments,
}) => {
  const chartData = departments.map((d, index) => ({
    name: d.name,
    value: d.employeeCount,
    code: d.code,
    color: COLORS[index % COLORS.length],
  }))

  const totalEmployees = chartData.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Department Distribution</CardTitle>
          <CardDescription>Workforce headcount across core business units</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Donut container */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFEFA',
                  borderColor: '#E5E0D5',
                  borderRadius: '8px',
                  boxShadow: '0 4px 15px rgba(51, 38, 59, 0.08)',
                  fontSize: '12px',
                  color: '#252923',
                }}
                formatter={(value: any) => [`${value} people`, 'Headcount']}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map(entry => (
                  <Cell key={entry.name} fill={entry.color} stroke="#FFFEFA" strokeWidth={2} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Centered Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-semibold text-ink-secondary uppercase tracking-widest text-[10px]">
              Total
            </span>
            <span className="text-xl font-bold text-ink-main font-serif sm:font-sans">
              {totalEmployees}
            </span>
          </div>
        </div>

        {/* Legend list */}
        <div className="w-full flex-1 space-y-1.5 overflow-y-auto max-h-48 pr-1">
          {chartData.map(item => {
            const percentage = Math.round((item.value / (totalEmployees || 1)) * 100)
            return (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-ivory-page/50 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-ink-main font-medium truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-secondary font-mono flex-shrink-0">
                  <span className="font-semibold text-ink-main">{item.value}</span>
                  <span className="text-[11px] text-ink-secondary/70">({percentage}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
