import React, { useState } from 'react'
import {
  Building,
  User,
  Sliders,
  Bell,
  Shield,
  Layers,
} from 'lucide-react'
import { Tabs } from '../components/ui/Tabs'
import { OrganizationSettings } from '../features/settings/OrganizationSettings'
import { UserProfileSettings } from '../features/settings/UserProfileSettings'
import { AppearanceSettings } from '../features/settings/AppearanceSettings'
import { NotificationSettings } from '../features/settings/NotificationSettings'
import { SecuritySettings } from '../features/settings/SecuritySettings'

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('organization')

  const tabs = [
    { id: 'organization', label: 'Organization', icon: <Building className="w-4 h-4" /> },
    { id: 'profile', label: 'User Profile', icon: <User className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Sliders className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Access', icon: <Shield className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink-main leading-tight">
          System Settings & Operations
        </h1>
        <p className="text-sm text-ink-secondary mt-0.5">
          Configure corporate entity profiles, role permissions, personal preferences, and alerts.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Panels */}
      <div>
        {activeTab === 'organization' && <OrganizationSettings />}
        {activeTab === 'profile' && <UserProfileSettings />}
        {activeTab === 'appearance' && <AppearanceSettings />}
        {activeTab === 'notifications' && <NotificationSettings />}
        {activeTab === 'security' && <SecuritySettings />}
      </div>
    </div>
  )
}
