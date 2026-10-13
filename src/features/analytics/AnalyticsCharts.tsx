import React from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { Employee, Department } from '../../types'

interface AnalyticsChartsProps {
  employees: Employee[]
  departments: Department[]
}

const PLUM_COLORS = ['#493653', '#C87555', '#4A7145', '#654C72', '#B26143', '#8E7599']

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  employees,
  departments,
}) => {
  // 1. Headcount trend data
  const headcountTrendData = [
    { month: 'Jan', total: 204, engineering: 80, sales: 28 },
    { month: 'Feb', total: 210, engineering: 83, sales: 29 },
    { month: 'Mar', total: 215, engineering: 85, sales: 30 },
    { month: 'Apr', total: 222, engineering: 88, sales: 31 },
    { month: 'May', total: 228, engineering: 89, sales: 32 },
    { month: 'Jun', total: 234, engineering: 90, sales: 33 },
    { month: 'Jul', total: 239, engineering: 91, sales: 34 },
    { month: 'Aug', total: 242, engineering: 92, sales: 34 },
    { month: 'Sep', total: 245, engineering: 93, sales: 35 },
    { month: 'Oct', total: 248, engineering: 94, sales: 35 },
  ]

  // 2. Attendance trends data (weekly)
  const attendanceTrendData = [
    { week: 'W36', presentRate: 95.2, lateRate: 2.8, absentRate: 2.0 },
    { week: 'W37', presentRate: 94.6, lateRate: 3.4, absentRate: 2.0 },
    { week: 'W38', presentRate: 93.8, lateRate: 4.1, absentRate: 2.1 },
    { week: 'W39', presentRate: 96.1, lateRate: 2.2, absentRate: 1.7 },
    { week: 'W40', presentRate: 95.0, lateRate: 3.0, absentRate: 2.0 },
    { week: 'W41', presentRate: 94.4, lateRate: 3.6, absentRate: 2.0 },
  ]

  // 3. Leave utilization by department
  const leaveUtilizationData = [
    { department: 'Engineering', daysTaken: 48, daysRemaining: 180 },
    { department: 'HR', daysTaken: 18, daysRemaining: 44 },
    { department: 'Finance', daysTaken: 22, daysRemaining: 62 },
    { department: 'Operations', daysTaken: 29, daysRemaining: 76 },
    { department: 'Marketing', daysTaken: 34, daysRemaining: 56 },
    { department: 'Sales', daysTaken: 31, daysRemaining: 70 },
  ]

  // 4. Employment type distribution
  const typeMap: Record<string, number> = {}
  employees.forEach(e => {
    typeMap[e.employmentType] = (typeMap[e.employmentType] || 0) + 1
  })
  const employmentTypeData = Object.entries(typeMap).map(([name, value]) => ({
    name,
    value,
  }))

  // 5. New Hires over time
  const newHiresData = [
    { month: 'May', hires: 8, departures: 2 },
    { month: 'Jun', hires: 7, departures: 1 },
    { month: 'Jul', hires: 6, departures: 1 },
    { month: 'Aug', hires: 5, departures: 2 },
    { month: 'Sep', hires: 4, departures: 1 },
    { month: 'Oct', hires: 5, departures: 0 },
  ]

  // 6. Employee status distribution
  const statusMap: Record<string, number> = {}
  employees.forEach(e => {
    statusMap[e.status] = (statusMap[e.status] || 0) + 1
  })
  const statusData = Object.entries(statusMap).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="space-y-6">
      {/* Row 1: Headcount trend & Attendance trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount trend */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Headcount Growth Trend</CardTitle>
              <CardDescription>Monthly headcount trajectory across all business departments</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={headcountTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#493653" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#493653" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0D5" />
                <XAxis dataKey="month" stroke="#77786F" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#77786F" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 15', 'dataMax + 10']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFEFA',
                    borderColor: '#E5E0D5',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="total" name="Total Headcount" stroke="#493653" strokeWidth={2.5} fill="url(#trendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance trends */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Weekly Attendance Rates</CardTitle>
              <CardDescription>Present vs late percentages by work week</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0D5" />
                <XAxis dataKey="week" stroke="#77786F" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#77786F" fontSize={11} tickLine={false} axisLine={false} domain={[90, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFEFA',
                    borderColor: '#E5E0D5',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}%`]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="presentRate" name="Present Rate (%)" stroke="#2F542A" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="lateRate" name="Late Rate (%)" stroke="#C87555" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Leave Utilization & New Hires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Utilization by Dept */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Leave Utilization by Department</CardTitle>
              <CardDescription>Annual PTO days consumed vs remaining pool</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveUtilizationData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0D5" />
                <XAxis dataKey="department" stroke="#77786F" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#77786F" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFEFA',
                    borderColor: '#E5E0D5',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="daysTaken" name="Days Consumed" fill="#493653" radius={[4, 4, 0, 0]} />
                <Bar dataKey="daysRemaining" name="Days Available" fill="#DCE6D7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* New Hires vs Departures */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Talent Acquisition Velocity</CardTitle>
              <CardDescription>Monthly hires vs departures</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newHiresData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0D5" />
                <XAxis dataKey="month" stroke="#77786F" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#77786F" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFEFA',
                    borderColor: '#E5E0D5',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="hires" name="New Hires" fill="#C87555" radius={[4, 4, 0, 0]} />
                <Bar dataKey="departures" name="Departures" fill="#77786F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Employment Type & Status Distributions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employment Type */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Employment Type Distribution</CardTitle>
              <CardDescription>Full-time, part-time, contractors, and interns</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[240px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFEFA',
                    borderColor: '#E5E0D5',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Pie data={employmentTypeData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                  {employmentTypeData.map((_, idx) => (
                    <Cell key={idx} fill={PLUM_COLORS[idx % PLUM_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Employee Status Distribution */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Workforce Status Distribution</CardTitle>
              <CardDescription>Active, on leave, probation, and inactive ratios</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[240px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFEFA',
                    borderColor: '#E5E0D5',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {statusData.map((_, idx) => (
                    <Cell key={idx} fill={['#355E32', '#493653', '#C87555', '#9E9F96'][idx % 4]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
