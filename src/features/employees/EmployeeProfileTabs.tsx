import React from 'react'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  UserCheck,
  Shield,
  Clock,
  Heart,
  FileText,
} from 'lucide-react'
import { Employee, AttendanceRecord, LeaveRequest } from '../../types'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatDate } from '../../utils/formatters'

interface EmployeeProfileTabsProps {
  employee: Employee
  attendance: AttendanceRecord[]
  leaves: LeaveRequest[]
  activeTab: string
}

export const EmployeeProfileTabs: React.FC<EmployeeProfileTabsProps> = ({
  employee,
  attendance,
  leaves,
  activeTab,
}) => {
  if (activeTab === 'employment') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Role & Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-edge/60">
              <span className="text-ink-secondary">Employee ID</span>
              <span className="font-mono font-bold text-ink-main">{employee.employeeId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-edge/60">
              <span className="text-ink-secondary">Department</span>
              <span className="font-semibold text-ink-main">{employee.department}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-edge/60">
              <span className="text-ink-secondary">Job Title</span>
              <span className="font-semibold text-ink-main">{employee.designation}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-edge/60">
              <span className="text-ink-secondary">Reporting Manager</span>
              <span className="font-semibold text-plum">{employee.reportingManager}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-ink-secondary">Employment Type</span>
              <span className="font-semibold text-ink-main">{employee.employmentType}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenure & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="flex justify-between py-2 border-b border-edge/60">
              <span className="text-ink-secondary">Joining Date</span>
              <span className="font-semibold text-ink-main">{formatDate(employee.joiningDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-edge/60">
              <span className="text-ink-secondary">Work Location</span>
              <span className="font-semibold text-ink-main">{employee.workLocation}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-edge/60">
              <span className="text-ink-secondary">Employment Status</span>
              <Badge variant="active" dot>{employee.status}</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-ink-secondary">Security Clearance</span>
              <span className="font-semibold text-ink-main">Standard Employee (Level 2)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activeTab === 'attendance') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <span className="text-xs text-ink-secondary">Logged check-ins and working hours</span>
        </CardHeader>
        <CardContent>
          {attendance.length === 0 ? (
            <div className="py-12 text-center text-ink-secondary">
              <Clock className="w-8 h-8 mx-auto text-ink-secondary/40 mb-2" />
              <p className="text-sm font-medium">No attendance logs available for this period.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead className="bg-ivory-page border-b border-edge text-ink-secondary uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Check-In</th>
                    <th className="py-2.5 px-3">Check-Out</th>
                    <th className="py-2.5 px-3">Working Hours</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge/60">
                  {attendance.map(att => (
                    <tr key={att.id} className="hover:bg-ivory-page/50">
                      <td className="py-3 px-3 font-medium text-ink-main">{formatDate(att.date)}</td>
                      <td className="py-3 px-3 font-mono">{att.checkIn}</td>
                      <td className="py-3 px-3 font-mono">{att.checkOut}</td>
                      <td className="py-3 px-3 font-semibold text-ink-main">{att.workingHours} hrs</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            att.status === 'Present'
                              ? 'present'
                              : att.status === 'Late'
                              ? 'late'
                              : att.status === 'On Leave'
                              ? 'on-leave'
                              : 'absent'
                          }
                          dot
                        >
                          {att.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-ink-secondary">{att.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (activeTab === 'leave') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests & History</CardTitle>
          <span className="text-xs text-ink-secondary">Record of requested and approved time off</span>
        </CardHeader>
        <CardContent>
          {leaves.length === 0 ? (
            <div className="py-12 text-center text-ink-secondary">
              <Calendar className="w-8 h-8 mx-auto text-ink-secondary/40 mb-2" />
              <p className="text-sm font-medium">No leave requests logged for this employee.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead className="bg-ivory-page border-b border-edge text-ink-secondary uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Leave Type</th>
                    <th className="py-2.5 px-3">Dates</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Approver Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-edge/60">
                  {leaves.map(l => (
                    <tr key={l.id} className="hover:bg-ivory-page/50">
                      <td className="py-3 px-3 font-semibold text-ink-main">{l.leaveType}</td>
                      <td className="py-3 px-3 text-ink-secondary">
                        {formatDate(l.startDate)} – {formatDate(l.endDate)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-ink-main">{l.totalDays} day(s)</td>
                      <td className="py-3 px-3 text-ink-secondary max-w-xs truncate">{l.reason}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            l.status === 'Approved'
                              ? 'approved'
                              : l.status === 'Rejected'
                              ? 'rejected'
                              : 'pending'
                          }
                          dot
                        >
                          {l.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-ink-secondary text-[11px]">
                        {l.approverRemarks || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Default: Overview Tab
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Left 2 cols: Contact & Skills */}
      <div className="lg:col-span-2 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Personal & Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-ivory-page/60 border border-edge/60">
              <span className="text-[10px] uppercase font-bold text-ink-secondary flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-plum" />
                Work Email
              </span>
              <span className="font-semibold text-ink-main text-sm">{employee.workEmail}</span>
            </div>

            <div className="p-3 rounded-xl bg-ivory-page/60 border border-edge/60">
              <span className="text-[10px] uppercase font-bold text-ink-secondary flex items-center gap-1.5 mb-1">
                <Phone className="w-3.5 h-3.5 text-plum" />
                Phone Number
              </span>
              <span className="font-semibold text-ink-main text-sm">{employee.phone}</span>
            </div>

            <div className="p-3 rounded-xl bg-ivory-page/60 border border-edge/60">
              <span className="text-[10px] uppercase font-bold text-ink-secondary flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-plum" />
                Work Location
              </span>
              <span className="font-semibold text-ink-main text-sm">{employee.workLocation}</span>
            </div>

            <div className="p-3 rounded-xl bg-ivory-page/60 border border-edge/60">
              <span className="text-[10px] uppercase font-bold text-ink-secondary flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-plum" />
                Date of Birth
              </span>
              <span className="font-semibold text-ink-main text-sm">
                {formatDate(employee.dateOfBirth)}
              </span>
            </div>

            <div className="sm:col-span-2 p-3 rounded-xl bg-ivory-page/60 border border-edge/60">
              <span className="text-[10px] uppercase font-bold text-ink-secondary flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-plum" />
                Home Address
              </span>
              <span className="font-semibold text-ink-main">{employee.address}</span>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Core Competencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-plum/10 text-plum border border-plum/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right col: Emergency contact & Notes */}
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-terracotta" />
              <CardTitle>Emergency Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-ink-secondary text-[11px]">Contact Person</span>
              <p className="font-bold text-ink-main text-sm mt-0.5">
                {employee.emergencyContact?.name || 'Not provided'}
              </p>
            </div>
            <div>
              <span className="text-ink-secondary text-[11px]">Relationship</span>
              <p className="font-semibold text-ink-main mt-0.5">
                {employee.emergencyContact?.relationship || 'Family'}
              </p>
            </div>
            <div>
              <span className="text-ink-secondary text-[11px]">Emergency Phone</span>
              <p className="font-mono font-semibold text-plum mt-0.5">
                {employee.emergencyContact?.phone || employee.phone}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Internal notes */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-ink-secondary" />
              <CardTitle>Operational Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-ink-secondary leading-relaxed italic bg-ivory-page/50 p-3 rounded-lg border border-edge/60">
              {employee.notes || 'No internal remarks or disciplinary notes recorded.'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
