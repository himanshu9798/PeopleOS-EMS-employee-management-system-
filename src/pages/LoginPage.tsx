import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, Users } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { UserRole, Employee } from '../types'
import { storage } from '../services/storage'

interface RoleShowcase {
  image: string
  alt: string
  badge: string
  title: string
  description: string
  stats: { value: string; label: string; highlight?: boolean }[]
}

const ROLE_SHOWCASES: Record<string, RoleShowcase> = {
  Admin: {
    image: '/images/login-hero.jpg',
    alt: 'PeopleOS Executive Headquarters & Boardroom',
    badge: 'Enterprise Executive Intelligence',
    title: 'High-velocity clarity for your entire organization.',
    description: 'From strategic headcount planning to automated payroll disbursement and board-level analytics — PeopleOS empowers leadership to execute with confidence.',
    stats: [
      { value: '1,420+', label: 'Employees', highlight: true },
      { value: '99.4%', label: 'Attendance' },
      { value: '100%', label: 'Compliance', highlight: true },
    ],
  },
  'HR Manager': {
    image: '/images/login-hr.jpg',
    alt: 'People Operations Team Talent Strategy Session',
    badge: 'People Operations & Talent Strategy',
    title: 'Empowering every step of your employee lifecycle.',
    description: 'Streamline talent acquisition, manage employee onboarding, track leave approvals, and curate workplace culture from an intuitive command center.',
    stats: [
      { value: '45+', label: 'Hires in H1', highlight: true },
      { value: '98.2%', label: 'Retention' },
      { value: '12', label: 'Active Roles', highlight: true },
    ],
  },
  Employee: {
    image: '/images/login-employee.jpg',
    alt: 'Employees Sitting and Working in Modern Office',
    badge: 'Collaborative Workforce Portal',
    title: 'Your daily workspace for seamless productivity.',
    description: 'Clock attendance with a click, check your PTO balance, connect with cross-functional teammates, and access self-service benefits anywhere.',
    stats: [
      { value: '24', label: 'Leave Days', highlight: true },
      { value: '100%', label: 'On Time' },
      { value: '4.9★', label: 'Pulse Score', highlight: true },
    ],
  },
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()

  const [email, setEmail] = useState('himanshu.barnawal@peopleos.in')
  const [password, setPassword] = useState('••••••••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [role, setRole] = useState<UserRole>('Admin')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Load mock employees for quick picker
  const mockEmployees: Employee[] = storage.getEmployees().filter(e => e.status !== 'Inactive')

  const showcase = ROLE_SHOWCASES[role] || ROLE_SHOWCASES.Admin

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Please provide your work email address or employee name.')
      return
    }

    setIsLoading(true)
    setError('')

    setTimeout(async () => {
      await login(email, role)
      toast.success(`Welcome back! Signed in to PeopleOS.`)
      setIsLoading(false)
      navigate('/')
    }, 400)
  }

  const handleQuickFill = (roleName: UserRole, demoEmail: string) => {
    setRole(roleName)
    setEmail(demoEmail)
    setPassword('secret-demo-pass')
    setError('')
  }

  const handleSelectMockEmployee = (empId: string) => {
    const emp = mockEmployees.find(e => e.id === empId)
    if (!emp) return

    let empRole: UserRole = 'Employee'
    if (emp.id === 'emp-100' || emp.fullName.toLowerCase().includes('himanshu')) {
      empRole = 'Admin'
    } else if (emp.department === 'Human Resources') {
      empRole = 'HR Manager'
    }

    setRole(empRole)
    setEmail(emp.workEmail)
    setPassword('secret-demo-pass')
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#F6F2E9] flex flex-col lg:flex-row selection:bg-terracotta/20 selection:text-plum">
      {/* Left Column: AI-Generated Editorial Showcase (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#271C2E] text-white flex-col justify-between p-12 select-none">
        {/* Background Image with Muted Plum Gradient Overlay & Crossfade */}
        <img
          key={showcase.image}
          src={showcase.image}
          alt={showcase.alt}
          className="absolute inset-0 w-full h-full object-cover object-center animate-hero-fade"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#271C2E] via-[#33263B]/70 to-[#271C2E]/40 backdrop-blur-[1px]" />

        {/* Top Branding Pill */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#493653] to-[#271C2E] border border-terracotta/40 flex items-center justify-center shadow-card">
            <span className="font-serif text-xl font-bold text-terracotta">P</span>
          </div>
          <div>
            <div className="font-serif text-xl font-bold tracking-tight text-white leading-none">
              PeopleOS
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-terracotta mt-0.5">
              WORKFORCE INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Center / Bottom Editorial Content */}
        <div className="relative z-10 space-y-6 max-w-lg mt-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-terracotta-light">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            <span>{showcase.badge}</span>
          </div>

          <h1 className="font-serif text-3xl xl:text-4xl font-bold text-[#FFFEFA] leading-tight transition-all duration-300">
            {showcase.title}
          </h1>

          <p className="text-sm text-[#D5CFC2] leading-relaxed transition-all duration-300">
            {showcase.description}
          </p>

          {/* Floating Key Performance Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/15">
            {showcase.stats.map((stat, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#271C2E]/80 backdrop-blur-md border border-white/10 transition-all">
                <div className={`font-serif text-xl font-bold ${stat.highlight ? 'text-terracotta' : 'text-white'}`}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-[#D5CFC2]/80 uppercase font-semibold mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="relative z-10 text-[11px] text-[#D5CFC2]/60 pt-6">
          © {new Date().getFullYear()} PeopleOS Global Enterprise Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="flex-1 flex flex-col justify-center items-center py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-md mx-auto">
          {/* Brand header on mobile (< lg) */}
          <div className="flex flex-col items-center text-center mb-6 lg:mb-8">
            <div className="lg:hidden w-12 h-12 rounded-2xl bg-[#33263B] border border-terracotta/40 flex items-center justify-center shadow-card mb-3">
              <span className="font-serif text-2xl font-bold text-terracotta">P</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink-main">
              Sign In to PeopleOS
            </h2>
            <p className="mt-1.5 text-xs text-ink-secondary">
              Enter any employee's work email or select a profile below.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#FFFEFA] border border-edge py-6 px-4 sm:py-8 sm:px-8 shadow-modal rounded-2xl">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <Input
                  label="Work Email or Employee Name"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. sneha.kulkarni@peopleos.in or Sneha"
                  startIcon={<Mail className="w-4 h-4" />}
                  autoComplete="username"
                />
                <p className="text-[10px] text-ink-secondary mt-1">
                  * Enter any mock employee's name, email, or Gmail to log in as them.
                </p>
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  startIcon={<Lock className="w-4 h-4" />}
                  endIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 hover:text-ink-main text-ink-secondary"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-edge text-plum focus:ring-plum/20"
                  />
                  <span className="text-ink-secondary">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => toast.info('Password reset instructions sent to your work email (Demo).')}
                  className="text-plum hover:text-terracotta font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Sign In to Workspace
              </Button>
            </form>

            {/* Quick-fill by Role Presets */}
            <div className="mt-6 pt-5 border-t border-edge/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                  <span>Fast Demo Sign-In:</span>
                </span>
                <span className="text-[10px] text-ink-secondary font-medium">Click to prefill</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('Admin', 'himanshu.barnawal@peopleos.in')}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all ${
                    role === 'Admin'
                      ? 'bg-plum text-white border-plum shadow-soft'
                      : 'bg-ivory-page border-edge text-ink-main hover:bg-ivory-hover'
                  }`}
                >
                  Admin (Himanshu)
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('HR Manager', 'priya.sharma@peopleos.in')}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all ${
                    role === 'HR Manager'
                      ? 'bg-plum text-white border-plum shadow-soft'
                      : 'bg-ivory-page border-edge text-ink-main hover:bg-ivory-hover'
                  }`}
                >
                  HR Lead (Priya)
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickFill('Employee', 'sneha.kulkarni@peopleos.in')}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold transition-all ${
                    role === 'Employee'
                      ? 'bg-plum text-white border-plum shadow-soft'
                      : 'bg-ivory-page border-edge text-ink-main hover:bg-ivory-hover'
                  }`}
                >
                  Employee (Sneha)
                </button>
              </div>

              {/* Quick Dropdown: Log in as ANY mock employee */}
              <div className="mt-4 pt-3 border-t border-edge/40">
                <label className="text-[11px] font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-1.5 mb-1.5">
                  <Users className="w-3.5 h-3.5 text-plum" />
                  <span>Or Pick Any Employee from Mock Data:</span>
                </label>
                <select
                  onChange={e => handleSelectMockEmployee(e.target.value)}
                  defaultValue=""
                  className="w-full bg-ivory-page border border-edge rounded-lg px-2.5 py-1.5 text-xs text-ink-main focus:outline-none focus:border-plum"
                >
                  <option value="" disabled>
                    -- Select any employee to sign in --
                  </option>
                  {mockEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.designation} — {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-[10px] text-ink-secondary text-center mt-3">
                * Simulated enterprise environment with full role-based access control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
