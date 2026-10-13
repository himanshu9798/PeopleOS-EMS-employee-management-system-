import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { storage } from '../../services/storage'
import { OrganizationSettings as OrgSettingsType } from '../../types'
import { useToast } from '../../context/ToastContext'

export const OrganizationSettings: React.FC = () => {
  const toast = useToast()
  const [settings, setSettings] = useState<OrgSettingsType>(() => storage.getOrgSettings())
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      storage.saveOrgSettings(settings)
      setIsSaving(false)
      toast.success('Organization profile updated successfully.')
    }, 400)
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Organization Profile</CardTitle>
          <CardDescription>Manage your corporate legal details, brand information, and official headquarters.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company Brand Name"
            value={settings.companyName}
            onChange={e => setSettings({ ...settings, companyName: e.target.value })}
          />
          <Input
            label="Legal Entity Name"
            value={settings.legalName}
            onChange={e => setSettings({ ...settings, legalName: e.target.value })}
          />
          <Input
            label="Corporate Contact Email"
            type="email"
            value={settings.contactEmail}
            onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
          />
          <Input
            label="Contact Phone"
            value={settings.contactPhone}
            onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
          />
          <Input
            label="Official Website"
            value={settings.website}
            onChange={e => setSettings({ ...settings, website: e.target.value })}
          />
          <Input
            label="Corporate Timezone"
            value={settings.timezone}
            onChange={e => setSettings({ ...settings, timezone: e.target.value })}
          />
        </div>

        <Input
          label="Global Headquarters Address"
          value={settings.headquarters}
          onChange={e => setSettings({ ...settings, headquarters: e.target.value })}
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-main mb-1.5">
            Active Office Locations
          </label>
          <div className="flex flex-wrap gap-2">
            {settings.workLocations.map(loc => (
              <span
                key={loc}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-ivory-page border border-edge text-ink-main"
              >
                {loc}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-ink-secondary mt-1 block">
            Locations configured for staff attendance and payroll compliance.
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <span className="text-[11px] text-ink-secondary italic">
          Changes will persist in your browser local cache.
        </span>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
          Save Organization Settings
        </Button>
      </CardFooter>
    </Card>
  )
}
