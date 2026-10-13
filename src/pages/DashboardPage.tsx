import React, { useState, useEffect } from 'react'
import { Plus, Calendar, Users, UserCheck, CalendarOff, Briefcase } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { StatCard } from '../features/dashboard/StatCard'
import { HeadcountGrowthChart } from '../features/dashboard/HeadcountGrowthChart'
import { DepartmentDistributionChart } from '../features/dashboard/DepartmentDistributionChart'
import { TodayAttendanceWidget } from '../features/dashboard/TodayAttendanceWidget'
import { PeopleToKnowWidget } from '../features/dashboard/PeopleToKnowWidget'
import { UpcomingCelebrationsWidget } from '../features/dashboard/UpcomingCelebrationsWidget'
import { RecentActivityWidget } from '../features/dashboard/RecentActivityWidget'
import { EmployeeFormModal } from '../features/employees/EmployeeFormModal'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { storage, subscribeToStore } from '../services/storage'
import { employeeService } from '../services/employeeService'
import { Employee, Department, AttendanceRecord, ActivityEvent } from '../types'

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const toast = useToast()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))

  const loadAll = () => {
    setEmployees(storage.getEmployees())
    setDepartments(storage.getDepartments())
    setAttendance(storage.getAttendance())
    setActivities(storage.getActivities())
  }

  useEffect(() => {
    loadAll()
    const unsubscribe = subscribeToStore(loadAll)
    return () => unsubscribe()
  }, [])

  const handleAddEmployee = async (newEmpData: Omit<Employee, 'id'>) => {
    await employeeService.create(newEmpData)
    toast.success(`Successfully added ${newEmpData.fullName} to ${newEmpData.department}.`)
  }

  // Active people count
  const activeCount = employees.filter(e => e.status !== 'Inactive').length
  const onLeaveCount = employees.filter(e => e.status === 'On Leave').length
  const presentCount = attendance.filter(a => a.status === 'Present').length

  const greetingName = user?.name ? user.name.split(' ')[0] : 'Himanshu'

  return (
    <div className="space-y-6">
      {/* Executive Welcome Hero Banner with AI-Generated HQ Architecture Visual */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2B1F32] via-[#3B2943] to-[#24172B] text-white shadow-soft">
        <img
          src="/images/dashboard-banner.jpg"
          alt="PeopleOS HQ Overview"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#24172B]/90 via-[#3B2943]/60 to-transparent pointer-events-none" />

        <div className="relative z-10 p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-white/90 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Global Enterprise Operations • Live Workforce Pulse
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              Good morning, {greetingName}.
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-1 font-light">
              Here&apos;s your daily workforce intelligence, attendance trends, and key actions.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-sm">
              <Calendar className="w-4 h-4 text-white/80" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer [color-scheme:dark]"
              />
            </div>

            <Button
              variant="secondary"
              size="md"
              className="!bg-white !text-plum hover:!bg-[#F6F2E9] !border-0 font-semibold shadow-md"
              onClick={() => setIsAddModalOpen(true)}
              icon={<Plus className="w-4 h-4 text-plum" />}
            >
              Add employee
            </Button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total People */}
        <StatCard
          title="Total People"
          value={activeCount > 0 ? activeCount : 248}
          growthText="+2.4% this month"
          icon={<Users className="w-5 h-5" />}
          linkTo="/people"
        />

        {/* 2. Present Today */}
        <StatCard
          title="Present Today"
          value={presentCount > 0 ? presentCount : 216}
          growthText="94% attendance rate"
          icon={<UserCheck className="w-5 h-5 text-sage-dark" />}
          linkTo="/attendance"
        />

        {/* 3. On Leave */}
        <StatCard
          title="On Leave"
          value={onLeaveCount > 0 ? onLeaveCount : 18}
          badgeText="Active PTO"
          icon={<CalendarOff className="w-5 h-5 text-terracotta" />}
          linkTo="/leave"
        />

        {/* 4. Open Positions */}
        <StatCard
          title="Open Positions"
          value={7}
          badgeText="Hiring Sprint"
          icon={<Briefcase className="w-5 h-5 text-plum" />}
          linkTo="/analytics"
        />
      </div>

      {/* Row 2: Charts (Headcount growth & Department distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <HeadcountGrowthChart />
        </div>
        <div className="lg:col-span-5">
          <DepartmentDistributionChart departments={departments} />
        </div>
      </div>

      {/* Row 3: Widgets (Today's Attendance, People to Know, Celebrations) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TodayAttendanceWidget records={attendance} />
        <PeopleToKnowWidget employees={employees} />
        <UpcomingCelebrationsWidget />
      </div>

      {/* Row 4: Recent Activity */}
      <div>
        <RecentActivityWidget activities={activities} />
      </div>

      {/* Add Employee Modal */}
      <EmployeeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEmployee}
        title="Add New Employee to Workforce"
      />
    </div>
  )
}
