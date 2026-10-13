import React, { useState, useEffect } from 'react'
import { Download, Calendar, BarChart3, TrendingUp, Filter } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { AnalyticsKPIs } from '../features/analytics/AnalyticsKPIs'
import { AnalyticsCharts } from '../features/analytics/AnalyticsCharts'
import { employeeService } from '../services/employeeService'
import { departmentService } from '../services/departmentService'
import { subscribeToStore } from '../services/storage'
import { exportToCsv } from '../utils/exportCsv'
import { useToast } from '../context/ToastContext'
import { Employee, Department } from '../types'

export const AnalyticsPage: React.FC = () => {
  const toast = useToast()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [dateRange, setDateRange] = useState('Last 6 Months')

  const loadData = () => {
    employeeService.getAll().then(setEmployees)
    departmentService.getAll().then(setDepartments)
  }

  useEffect(() => {
    loadData()
    const unsubscribe = subscribeToStore(loadData)
    return () => unsubscribe()
  }, [])

  const handleExportReport = () => {
    const headers = [
      'Department',
      'Employee Count',
      'Department Code',
      'Department Head',
      'Budget',
    ]

    const rows = departments.map(d => [
      d.name,
      d.employeeCount,
      d.code,
      d.head,
      d.budget || '₹1,00,00,000',
    ])

    exportToCsv(`PeopleOS_Workforce_Report_${dateRange.replace(/\s+/g, '_')}`, headers, rows)
    toast.success('Workforce intelligence metrics exported to CSV.')
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink-main leading-tight">
            Workforce Intelligence & Analytics
          </h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            Key demographic indicators, retention benchmarks, capacity planning, and headcount growth.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Date range filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFEFA] border border-edge text-xs font-semibold text-ink-main shadow-soft">
            <Calendar className="w-3.5 h-3.5 text-plum" />
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="bg-transparent text-xs text-ink-main focus:outline-none cursor-pointer font-semibold"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 3 Months">Last 3 Months</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Year to Date">Year to Date (2026)</option>
              <option value="Full Year 2025-2026">Full Year 2025–2026</option>
            </select>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportReport}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Full Report CSV
          </Button>
        </div>
      </div>

      {/* KPI Summaries */}
      <AnalyticsKPIs />

      {/* Visual Analytics Charts System */}
      <AnalyticsCharts
        employees={employees}
        departments={departments}
      />
    </div>
  )
}
