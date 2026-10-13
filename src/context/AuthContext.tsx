import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, UserRole, Employee } from '../types'
import { INITIAL_USER } from '../data/mockData'
import { storage } from '../services/storage'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, role?: UserRole) => Promise<boolean>
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'peopleos_auth_user_v7'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && parsed.name && parsed.email) {
          return parsed
        }
      }
    } catch (e) {
      console.error('Failed to parse saved user:', e)
    }
    return INITIAL_USER // default logged in as Himanshu Kumar Barnawal (Admin)
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [user])

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    const rawInput = (email || '').trim()
    const lowerInput = rawInput.toLowerCase()
    const emailPrefix = lowerInput.split('@')[0].trim()
    const employees: Employee[] = storage.getEmployees()

    // 1. Search for matching employee in the mock data
    const matched = employees.find((e: Employee) => {
      const workEmail = e.workEmail.toLowerCase()
      const empPrefix = workEmail.split('@')[0].trim()
      const fullName = e.fullName.toLowerCase()
      const firstName = e.firstName.toLowerCase()
      const lastName = e.lastName.toLowerCase()
      const empId = e.employeeId.toLowerCase()
      const id = e.id.toLowerCase()

      return (
        workEmail === lowerInput ||
        fullName === lowerInput ||
        firstName === lowerInput ||
        empId === lowerInput ||
        id === lowerInput ||
        (emailPrefix.length >= 3 && empPrefix === emailPrefix) ||
        (lowerInput.length >= 3 && fullName.includes(lowerInput)) ||
        (lowerInput.length >= 3 && lowerInput.includes(firstName) && firstName.length >= 3) ||
        (lowerInput.length >= 3 && workEmail.includes(lowerInput))
      )
    })

    if (matched) {
      let resolvedRole: UserRole = role || 'Employee'
      if (!role) {
        if (matched.id === 'emp-100' || matched.fullName.toLowerCase().includes('himanshu')) {
          resolvedRole = 'Admin'
        } else if (matched.department === 'Human Resources') {
          resolvedRole = 'HR Manager'
        } else {
          resolvedRole = 'Employee'
        }
      }

      setUser({
        id: matched.id,
        name: matched.fullName,
        email: matched.workEmail,
        avatar: matched.avatar,
        role: resolvedRole,
        department: matched.department,
        designation: matched.designation,
      })
      return true
    }

    // 2. If Himanshu or Admin explicitly requested
    if (lowerInput.includes('himanshu') || lowerInput.includes('admin') || role === 'Admin') {
      const adminEmp = employees.find((e: Employee) => e.id === 'emp-100')
      setUser({
        id: adminEmp?.id || 'emp-100',
        name: adminEmp?.fullName || 'Himanshu Kumar Barnawal',
        email: adminEmp?.workEmail || 'himanshu.barnawal@peopleos.in',
        avatar: adminEmp?.avatar || '/images/avatar-himanshu.jpg',
        role: 'Admin',
        department: adminEmp?.department || 'Human Resources',
        designation: adminEmp?.designation || 'VP of People Operations',
      })
      return true
    }

    // 3. If HR role requested
    if (role === 'HR Manager' || lowerInput.includes('priya') || lowerInput.includes('hr')) {
      const hrEmp =
        employees.find((e: Employee) => e.department === 'Human Resources' && e.id !== 'emp-100') ||
        employees[1]
      setUser({
        id: hrEmp.id,
        name: hrEmp.fullName,
        email: hrEmp.workEmail,
        avatar: hrEmp.avatar,
        role: 'HR Manager',
        department: hrEmp.department,
        designation: hrEmp.designation,
      })
      return true
    }

    // 4. If Employee role requested without match -> default to Sneha Kulkarni
    if (role === 'Employee') {
      const emp =
        employees.find((e: Employee) => e.id === 'emp-104') ||
        employees.find((e: Employee) => e.department !== 'Human Resources' && e.id !== 'emp-100') ||
        employees[3]
      setUser({
        id: emp.id,
        name: emp.fullName,
        email: emp.workEmail,
        avatar: emp.avatar,
        role: 'Employee',
        department: emp.department,
        designation: emp.designation,
      })
      return true
    }

    // 5. Custom email entered
    const namePart = rawInput.split('@')[0].replace(/[._-]/g, ' ')
    const formattedName = namePart
      .split(' ')
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    setUser({
      id: `usr-${Date.now()}`,
      name: formattedName || 'Team Member',
      email: rawInput,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: role || 'Employee',
      department: 'Engineering',
      designation: 'Staff Engineer',
    })
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const switchRole = (newRole: UserRole) => {
    const employees: Employee[] = storage.getEmployees()
    if (newRole === 'Admin') {
      const adminEmp =
        employees.find((e: Employee) => e.id === 'emp-100' || e.fullName.includes('Himanshu')) ||
        INITIAL_USER
      setUser({
        id: adminEmp.id,
        name: 'Himanshu Kumar Barnawal',
        email: 'himanshu.barnawal@peopleos.in',
        avatar: '/images/avatar-himanshu.jpg',
        role: 'Admin',
        department: adminEmp.department || 'Human Resources',
        designation: adminEmp.designation || 'VP of People Operations',
      })
    } else if (newRole === 'HR Manager') {
      const hrEmp =
        employees.find((e: Employee) => e.department === 'Human Resources' && e.id !== 'emp-100') ||
        employees[1]
      setUser({
        id: hrEmp.id,
        name: hrEmp.fullName,
        email: hrEmp.workEmail,
        avatar: hrEmp.avatar,
        role: 'HR Manager',
        department: hrEmp.department,
        designation: hrEmp.designation,
      })
    } else {
      // Employee role: Switch to Sneha Kulkarni
      const emp =
        employees.find((e: Employee) => e.id === 'emp-104') ||
        employees.find((e: Employee) => e.department !== 'Human Resources' && e.id !== 'emp-100') ||
        employees[3]
      setUser({
        id: emp.id,
        name: emp.fullName,
        email: emp.workEmail,
        avatar: emp.avatar,
        role: 'Employee',
        department: emp.department,
        designation: emp.designation,
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
