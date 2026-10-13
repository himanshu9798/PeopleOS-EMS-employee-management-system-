import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, KeyRound, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, switchRole } = useAuth()
  const navigate = useNavigate()

  const currentRole = user?.role || 'Employee'
  const isAuthorized = allowedRoles.includes(currentRole)

  if (isAuthorized) {
    return <>{children}</>
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full text-center p-6 sm:p-8 border-terracotta/30 bg-[#FFFEFA] shadow-modal animate-in zoom-in-95 duration-200">
        <CardContent className="space-y-6 p-0">
          {/* Visual Icon Badge */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-terracotta-subtle border border-terracotta/30 flex items-center justify-center text-terracotta shadow-soft">
            <ShieldAlert className="w-8 h-8" />
          </div>

          {/* Heading & Explanation */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-terracotta/15 text-terracotta">
              Access Restricted • 403 Forbidden
            </div>
            <h2 className="font-serif text-2xl font-bold text-ink-main">
              Administrative Privilege Required
            </h2>
            <p className="text-sm text-ink-secondary leading-relaxed max-w-md mx-auto">
              This section is restricted to{' '}
              <strong className="text-ink-main font-semibold">
                {allowedRoles.join(' or ')}
              </strong>{' '}
              personnel. Your active session role is currently set to{' '}
              <span className="px-2 py-0.5 rounded bg-plum text-white font-mono text-xs font-semibold">
                {currentRole}
              </span>
              .
            </p>
          </div>

          {/* Role Boundary Card */}
          <div className="p-4 rounded-xl bg-ivory-page border border-edge text-left space-y-2 text-xs">
            <div className="font-semibold text-ink-main flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-plum" />
              <span>Permission Security Boundary</span>
            </div>
            <p className="text-ink-secondary leading-normal">
              Payroll, Workforce Analytics, and System Settings require explicit administrative credentials.
              In this demo environment, you can switch your active role below to inspect and test the full feature suite.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              icon={<ArrowLeft className="w-4 h-4" />}
              className="w-full sm:w-auto text-xs"
            >
              Return to Overview
            </Button>

            <Button
              variant="primary"
              onClick={() => switchRole('Admin')}
              icon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto text-xs"
            >
              Switch to Admin Role
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
