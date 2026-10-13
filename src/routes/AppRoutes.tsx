import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { PeoplePage } from '../pages/PeoplePage'
import { EmployeeProfilePage } from '../pages/EmployeeProfilePage'
import { DepartmentsPage } from '../pages/DepartmentsPage'
import { AttendancePage } from '../pages/AttendancePage'
import { LeavePage } from '../pages/LeavePage'
import { PayrollPage } from '../pages/PayrollPage'
import { AnalyticsPage } from '../pages/AnalyticsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { useAuth } from '../context/AuthContext'
import { RoleGuard } from './RoleGuard'

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Main app layout with persistent sidebar & header */}
      <Route
        path="/"
        element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="people/:id" element={<EmployeeProfilePage />} />
        <Route
          path="departments"
          element={
            <RoleGuard allowedRoles={['Admin', 'HR Manager']}>
              <DepartmentsPage />
            </RoleGuard>
          }
        />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leave" element={<LeavePage />} />
        <Route
          path="payroll"
          element={
            <RoleGuard allowedRoles={['Admin']}>
              <PayrollPage />
            </RoleGuard>
          }
        />
        <Route
          path="analytics"
          element={
            <RoleGuard allowedRoles={['Admin']}>
              <AnalyticsPage />
            </RoleGuard>
          }
        />
        <Route
          path="settings"
          element={
            <RoleGuard allowedRoles={['Admin']}>
              <SettingsPage />
            </RoleGuard>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
