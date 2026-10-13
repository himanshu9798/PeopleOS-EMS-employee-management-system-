import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { employeeService } from '../../services/employeeService'

export const Breadcrumbs: React.FC = () => {
  const location = useLocation()
  const [employeeName, setEmployeeName] = useState<string | null>(null)

  const pathnames = location.pathname.split('/').filter(x => x)

  useEffect(() => {
    if (pathnames[0] === 'people' && pathnames[1]) {
      employeeService.getById(pathnames[1]).then(emp => {
        if (emp) setEmployeeName(emp.fullName)
        else setEmployeeName(pathnames[1])
      })
    } else {
      setEmployeeName(null)
    }
  }, [location.pathname])

  const routeNameMap: Record<string, string> = {
    people: 'People',
    departments: 'Departments',
    attendance: 'Attendance',
    leave: 'Leave',
    payroll: 'Payroll',
    analytics: 'Analytics',
    settings: 'Settings',
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-ink-secondary truncate">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-plum transition-colors font-medium flex-shrink-0"
      >
        <Home className="w-3.5 h-3.5 text-ink-secondary/70" />
        <span className="hidden sm:inline">PeopleOS</span>
      </Link>

      {pathnames.length === 0 && (
        <>
          <ChevronRight className="w-3.5 h-3.5 mx-1 text-edge-dark flex-shrink-0" />
          <span className="font-semibold text-ink-main truncate">Overview</span>
        </>
      )}

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`
        const isLast = index === pathnames.length - 1
        const displayName =
          index === 1 && pathnames[0] === 'people' && employeeName
            ? employeeName
            : routeNameMap[name] || name

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 mx-1 text-edge-dark flex-shrink-0" />
            {isLast ? (
              <span className="font-semibold text-ink-main truncate max-w-[120px] sm:max-w-[200px]">
                {displayName}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-plum transition-colors font-medium truncate max-w-[80px] sm:max-w-[120px]"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
