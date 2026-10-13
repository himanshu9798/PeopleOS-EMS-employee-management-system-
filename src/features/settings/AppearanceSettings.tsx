import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'

export const AppearanceSettings: React.FC = () => {
  const toast = useToast()
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable')
  const [sidebarPreference, setSidebarPreference] = useState<'expanded' | 'collapsed'>('expanded')
  const [colorMode, setColorMode] = useState<'muted-plum'>('muted-plum')

  const handleSave = () => {
    toast.success('Appearance preferences saved.')
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Appearance & Display Preferences</CardTitle>
          <CardDescription>Customize table density, default sidebar state, and interface feel.</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Table Density */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-main mb-2">
            Table Density
          </h4>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setDensity('comfortable')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                density === 'comfortable'
                  ? 'bg-plum/5 border-plum text-plum font-semibold ring-1 ring-plum'
                  : 'bg-ivory-page border-edge text-ink-main hover:border-edge-dark'
              }`}
            >
              <div className="text-sm font-bold">Comfortable</div>
              <div className="text-xs text-ink-secondary mt-0.5">
                Generous spacing with readable row heights (Default)
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDensity('compact')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                density === 'compact'
                  ? 'bg-plum/5 border-plum text-plum font-semibold ring-1 ring-plum'
                  : 'bg-ivory-page border-edge text-ink-main hover:border-edge-dark'
              }`}
            >
              <div className="text-sm font-bold">Compact</div>
              <div className="text-xs text-ink-secondary mt-0.5">
                Dense rows to fit maximum data records on desktop
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Preference */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink-main mb-2">
            Default Sidebar State
          </h4>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setSidebarPreference('expanded')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                sidebarPreference === 'expanded'
                  ? 'bg-plum/5 border-plum text-plum font-semibold ring-1 ring-plum'
                  : 'bg-ivory-page border-edge text-ink-main hover:border-edge-dark'
              }`}
            >
              <div className="text-sm font-bold">Always Expanded (250px)</div>
              <div className="text-xs text-ink-secondary mt-0.5">
                Full brand names, icons, and navigation sections
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSidebarPreference('collapsed')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                sidebarPreference === 'collapsed'
                  ? 'bg-plum/5 border-plum text-plum font-semibold ring-1 ring-plum'
                  : 'bg-ivory-page border-edge text-ink-main hover:border-edge-dark'
              }`}
            >
              <div className="text-sm font-bold">Icon-Only Collapsed</div>
              <div className="text-xs text-ink-secondary mt-0.5">
                Saves horizontal real estate for wider data tables
              </div>
            </button>
          </div>
        </div>

        {/* Theme Palette Banner */}
        <div className="p-4 rounded-xl bg-ivory-page/70 border border-edge">
          <div className="text-xs font-bold text-ink-main mb-1">
            Visual Identity — Muted Plum & Warm Ivory
          </div>
          <div className="text-xs text-ink-secondary leading-relaxed">
            PeopleOS uses an editorial color system: Primary Muted Plum (`#493653`), Deep Plum (`#33263B`), Warm Ivory workspace (`#F6F2E9`), Terracotta accents (`#C87555`), and Soft Sage (`#DCE6D7`).
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <span className="text-[11px] text-ink-secondary">
          Mock appearance preferences
        </span>
        <Button variant="primary" onClick={handleSave}>
          Apply Preferences
        </Button>
      </CardFooter>
    </Card>
  )
}
