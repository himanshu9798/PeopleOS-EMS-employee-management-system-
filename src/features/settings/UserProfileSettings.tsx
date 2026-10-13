import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Avatar } from '../../components/ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export const UserProfileSettings: React.FC = () => {
  const { user } = useAuth()
  const toast = useToast()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [designation, setDesignation] = useState(user?.designation || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Your profile preferences have been updated.')
    }, 400)
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>My User Profile</CardTitle>
          <CardDescription>Update your personal display name, avatar link, and job title.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-ivory-page/60 border border-edge/60">
          <Avatar src={avatar} name={name} size="xl" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-ink-main mb-1">
              Avatar Image URL
            </label>
            <Input
              value={avatar}
              onChange={e => setAvatar(e.target.value)}
              placeholder="https://..."
              className="text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            label="Account Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            label="Job Designation"
            value={designation}
            onChange={e => setDesignation(e.target.value)}
          />
          <Input
            label="User Role"
            value={user?.role || 'Admin'}
            disabled
            helperText="Role permissions are managed in the Security tab"
          />
        </div>
      </CardContent>

      <CardFooter>
        <span className="text-[11px] text-ink-secondary">
          Mock Profile Settings
        </span>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
          Save Profile
        </Button>
      </CardFooter>
    </Card>
  )
}
