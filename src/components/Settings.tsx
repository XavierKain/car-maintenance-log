import { useState, useRef } from 'react'
import { useApp } from '../context'
import { demoVehicles, demoEntries } from '../demoData'
import { loadVehicles, saveVehicles, loadEntries, saveEntries } from '../store'
import type { Vehicle, MaintenanceEntry } from '../types'

function generatePlaceholderPhoto(text: string, color: string): string {
  const canvas = document.createElement('canvas')
  canvas.width = 400
  canvas.height = 300
  const ctx = canvas.getContext('2d')!
  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 400, 300)
  grad.addColorStop(0, color)
  grad.addColorStop(1, '#1e293b')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 400, 300)
  // Icon
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.font = '80px serif'
  ctx.textAlign = 'center'
  ctx.fillText('🔧', 200, 140)
  // Text
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 18px system-ui, sans-serif'
  ctx.fillText(text, 200, 200)
  ctx.font = '13px system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.fillText('Demo photo', 200, 230)
  return canvas.toDataURL('image/jpeg', 0.6)
}

const DEMO_PHOTO_CONFIGS: Record<string, { text: string; color: string }> = {
  'Oil Change': { text: 'Oil Change', color: '#92400e' },
  'Tires': { text: 'New Tires', color: '#1e3a5f' },
  'Brakes': { text: 'Brake Service', color: '#7f1d1d' },
  'Battery': { text: 'Battery Replacement', color: '#14532d' },
  'Air Filter': { text: 'Air Filter', color: '#155e75' },
  'Cabin Filter': { text: 'Cabin Filter', color: '#115e59' },
  'Transmission': { text: 'Transmission Fluid', color: '#4c1d95' },
  'Coolant': { text: 'Coolant Flush', color: '#1e40af' },
  'Inspection': { text: 'Vehicle Inspection', color: '#374151' },
  'Wipers': { text: 'Wiper Blades', color: '#0369a1' },
  'Spark Plugs': { text: 'Spark Plugs', color: '#a16207' },
  'Belts': { text: 'Belt Replacement', color: '#78350f' },
  'Alignment': { text: 'Wheel Alignment', color: '#3730a3' },
}

export function Settings() {
  const { vehicles, entries, setVehicles, setEntries } = useApp()
  const [status, setStatus] = useState<string | null>(null)
  const importRef = useRef<HTMLInputElement>(null)

  const loadDemo = () => {
    const entriesWithPhotos = demoEntries.map(e => {
      const cfg = DEMO_PHOTO_CONFIGS[e.type] ?? { text: e.type, color: '#475569' }
      const photo = generatePlaceholderPhoto(cfg.text, cfg.color)
      return { ...e, photos: [photo] }
    })
    saveVehicles(demoVehicles)
    saveEntries(entriesWithPhotos)
    setVehicles(demoVehicles)
    setEntries(entriesWithPhotos)
    setStatus('Demo data loaded with photos!')
    setTimeout(() => setStatus(null), 3000)
  }

  const exportData = () => {
    const data = { vehicles: loadVehicles(), entries: loadEntries(), exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `carlog-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setStatus('Data exported!')
    setTimeout(() => setStatus(null), 3000)
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as { vehicles: Vehicle[]; entries: MaintenanceEntry[] }
        if (!Array.isArray(data.vehicles) || !Array.isArray(data.entries)) {
          throw new Error('Invalid format')
        }
        // Ensure photos field exists
        const entries = data.entries.map(en => ({ ...en, photos: en.photos ?? [] }))
        saveVehicles(data.vehicles)
        saveEntries(entries)
        setVehicles(data.vehicles)
        setEntries(entries)
        setStatus(`Imported ${data.vehicles.length} vehicles and ${entries.length} entries!`)
        setTimeout(() => setStatus(null), 3000)
      } catch {
        setStatus('Import failed — invalid file format.')
        setTimeout(() => setStatus(null), 3000)
      }
    }
    reader.readAsText(file)
    if (importRef.current) importRef.current.value = ''
  }

  const clearAll = () => {
    if (!confirm('Delete ALL data? This cannot be undone.')) return
    saveVehicles([])
    saveEntries([])
    setVehicles([])
    setEntries([])
    setStatus('All data cleared.')
    setTimeout(() => setStatus(null), 3000)
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      {status && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
          {status}
        </div>
      )}

      <div className="space-y-3">
        {/* Demo Data */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-1">Demo Data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Load 3 sample vehicles with 18 maintenance entries and placeholder photos. Replaces current data.
          </p>
          <button onClick={loadDemo}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm">
            Load Demo Data
          </button>
        </div>

        {/* Export */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-1">Export Data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Download all your vehicles and maintenance records as a JSON file (includes photos).
          </p>
          <button onClick={exportData} disabled={vehicles.length === 0 && entries.length === 0}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm">
            Export JSON
          </button>
        </div>

        {/* Import */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-1">Import Data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Load a previously exported JSON backup. Replaces current data.
          </p>
          <button onClick={() => importRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors text-sm">
            Import JSON
          </button>
          <input ref={importRef} type="file" accept=".json" onChange={importData} className="hidden" />
        </div>

        {/* Clear */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-1 text-red-600">Clear All Data</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Permanently delete all vehicles, entries, and photos.
          </p>
          <button onClick={clearAll}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm">
            Delete Everything
          </button>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-sm text-gray-500 dark:text-gray-400">
          <p>{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} · {entries.length} record{entries.length !== 1 ? 's' : ''} · {entries.filter(e => e.photos?.length).length} with photos</p>
        </div>
      </div>
    </div>
  )
}
