import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'

export const NotificationSettings: React.FC = () => {
  const toast = useToast()
  const [emailLeaves, setEmailLeaves] = useState(true)
  const [emailPayroll, setEmailPayroll] = useState(true)
  const [emailAnnounce, setEmailAnnounce] = useState(false)
  const [inAppPopups, setInAppPopups] = useState(true)
  const [inAppSound, setInAppSound] = useState(false)

  const handleSave = () => {
    toast.success('Notification preferences updated.')
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Notification Channels & Alerts</CardTitle>
          <CardDescription>Configure which events trigger email alerts and in-app updates.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Email Alerts */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-main mb-3">
            Email Notifications
          </h4>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailLeaves}
                onChange={e => setEmailLeaves(e.target.checked)}
                className="mt-1 rounded border-edge text-plum focus:ring-plum/20"
              />
              <div>
                <span className="text-xs font-semibold text-ink-main block">
                  Leave & Time-Off Requests
                </span>
                <span className="text-[11px] text-ink-secondary">
                  Receive an immediate email when a team member submits or updates a leave application.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailPayroll}
                onChange={e => setEmailPayroll(e.target.checked)}
                className="mt-1 rounded border-edge text-plum focus:ring-plum/20"
              />
              <div>
                <span className="text-xs font-semibold text-ink-main block">
                  Payroll & Compensation Batch Alerts
                </span>
                <span className="text-[11px] text-ink-secondary">
                  Notifies when monthly payroll has been finalized, approved, or disbursed.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAnnounce}
                onChange={e => setEmailAnnounce(e.target.checked)}
                className="mt-1 rounded border-edge text-plum focus:ring-plum/20"
              />
              <div>
                <span className="text-xs font-semibold text-ink-main block">
                  Company Announcements & Celebrations
                </span>
                <span className="text-[11px] text-ink-secondary">
                  Weekly digests for team birthdays, work anniversaries, and company news.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* In-app Alerts */}
        <div className="pt-4 border-t border-edge/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-main mb-3">
            In-App Desktop Notifications
          </h4>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inAppPopups}
                onChange={e => setInAppPopups(e.target.checked)}
                className="mt-1 rounded border-edge text-plum focus:ring-plum/20"
              />
              <div>
                <span className="text-xs font-semibold text-ink-main block">
                  Toast Notifications for System Actions
                </span>
                <span className="text-[11px] text-ink-secondary">
                  Display subtle alert cards on the lower right corner upon create, edit, or delete actions.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inAppSound}
                onChange={e => setInAppSound(e.target.checked)}
                className="mt-1 rounded border-edge text-plum focus:ring-plum/20"
              />
              <div>
                <span className="text-xs font-semibold text-ink-main block">
                  Audio Cue for New Incoming Approvals
                </span>
                <span className="text-[11px] text-ink-secondary">
                  Play a gentle chime when a high-priority leave request is submitted.
                </span>
              </div>
            </label>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <span className="text-[11px] text-ink-secondary">Mock Notification Settings</span>
        <Button variant="primary" onClick={handleSave}>
          Save Notifications
        </Button>
      </CardFooter>
    </Card>
  )
}
