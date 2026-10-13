import React from 'react'
import { ShieldCheck, Lock, Key, Users, Check, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { UserRole } from '../../types'

export const SecuritySettings: React.FC = () => {
  const { user, switchRole } = useAuth()
  const toast = useToast()

  const roles: {
    role: UserRole
    title: string
    description: string
    permissions: string[]
    restricted: string[]
  }[] = [
    {
      role: 'Admin',
      title: 'Global Administrator',
      description: 'Complete operational and administrative authority over all modules and records.',
      permissions: [
        'Add, edit, deactivate & delete employees',
        'Create & manage departments and budgets',
        'Approve & reject leave requests',
        'Full payroll access: view salaries, disburse payments, view payslips',
        'System settings & organization profile control',
      ],
      restricted: [],
    },
    {
      role: 'HR Manager',
      title: 'Human Resources Manager',
      description: 'Day-to-day employee lifecycle management, attendance adjustments, and leave approval.',
      permissions: [
        'Add, edit & deactivate employee records in directory',
        'View department roster and team members',
        'Mark and adjust attendance records',
        'Approve & reject leave applications with remarks',
      ],
      restricted: [
        'Restricted from System Settings & security administration (Admin Only)',
        'Restricted from Executive Payroll records & payouts (Admin Only)',
        'Restricted from Executive Workforce Analytics (Admin Only)',
        'Cannot create, edit or delete core departments',
      ],
    },
    {
      role: 'Employee',
      title: 'Standard Staff Member',
      description: 'Self-service portal access for personal details, attendance logs, and leave requests.',
      permissions: [
        'View personal profile and attendance history',
        'Apply for leave and view leave request status',
        'Browse public company directory (read-only)',
      ],
      restricted: [
        'Restricted from Payroll, Analytics, Settings & Departments',
        'Cannot add, edit, or deactivate employee records',
        'Cannot approve or reject leave applications',
        'Cannot modify attendance records',
      ],
    },
  ]

  const handleSwitch = (newRole: UserRole) => {
    switchRole(newRole)
    toast.info(`Switched active test role to ${newRole}.`)
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Role-Based Access Control (RBAC)</CardTitle>
          <CardDescription>
            Simulate and inspect permission boundaries across Admin, HR Manager, and Employee tiers.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="p-3.5 rounded-xl bg-ivory-page border border-edge text-xs leading-relaxed text-ink-main flex items-center justify-between">
          <div>
            <span className="font-bold">Currently Active Test Role: </span>
            <span className="px-2.5 py-0.5 rounded-full bg-plum text-white font-mono font-semibold">
              {user?.role}
            </span>
          </div>
          <span className="text-[11px] text-ink-secondary italic">
            Click any role below to test permission gates across Payroll and Management
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map(r => {
            const isCurrent = user?.role === r.role

            return (
              <div
                key={r.role}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-[#FFFEFA] border-plum shadow-soft ring-2 ring-plum/20'
                    : 'bg-ivory-page/40 border-edge hover:border-edge-dark'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-ink-main">{r.title}</span>
                    {isCurrent ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-terracotta text-white">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSwitch(r.role)}
                        className="text-[10px] font-semibold text-plum hover:text-terracotta underline cursor-pointer"
                      >
                        Switch Role
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-ink-secondary mb-3 leading-snug">
                    {r.description}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-secondary block">
                      Granted Privileges:
                    </span>
                    {r.permissions.map((p, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-ink-main">
                        <Check className="w-3.5 h-3.5 text-[#2F542A] flex-shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}

                    {r.restricted.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 block">
                          Restrictions:
                        </span>
                        {r.restricted.map((res, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-red-700">
                            <X className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span>{res}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-edge/60">
                  <button
                    onClick={() => handleSwitch(r.role)}
                    className={`w-full py-1.5 text-center text-xs font-semibold rounded-lg transition-colors ${
                      isCurrent
                        ? 'bg-plum text-white cursor-default'
                        : 'bg-ivory-page border border-edge text-plum hover:bg-plum hover:text-white'
                    }`}
                  >
                    {isCurrent ? 'Current Session Role' : `Switch to ${r.role}`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
