import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Vehicle, MaintenanceEntry, Page } from './types'
import { loadVehicles, saveVehicles, loadEntries, saveEntries, generateId } from './store'
import { demoVehicles, demoEntries } from './demoData'

interface AppState {
  vehicles: Vehicle[]
  entries: MaintenanceEntry[]
  page: Page
  selectedVehicleId: string | null
  darkMode: boolean
  setPage: (page: Page) => void
  setSelectedVehicleId: (id: string | null) => void
  toggleDarkMode: () => void
  addVehicle: (v: Omit<Vehicle, 'id'>) => void
  updateVehicle: (v: Vehicle) => void
  deleteVehicle: (id: string) => void
  addEntry: (e: Omit<MaintenanceEntry, 'id'>) => void
  updateEntry: (e: MaintenanceEntry) => void
  deleteEntry: (id: string) => void
  loadDemoData: () => void
  setVehicles: (v: Vehicle[]) => void
  setEntries: (e: MaintenanceEntry[]) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState(loadVehicles)
  const [entries, setEntries] = useState(loadEntries)
  const [page, setPage] = useState<Page>('vehicles')
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('carlog_dark')
    return saved === 'true'
  })

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      localStorage.setItem('carlog_dark', String(!prev))
      return !prev
    })
  }, [])

  const addVehicle = useCallback((v: Omit<Vehicle, 'id'>) => {
    setVehicles(prev => {
      const next = [...prev, { ...v, id: generateId() }]
      saveVehicles(next)
      return next
    })
  }, [])

  const updateVehicle = useCallback((v: Vehicle) => {
    setVehicles(prev => {
      const next = prev.map(x => (x.id === v.id ? v : x))
      saveVehicles(next)
      return next
    })
  }, [])

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => {
      const next = prev.filter(x => x.id !== id)
      saveVehicles(next)
      return next
    })
    setEntries(prev => {
      const next = prev.filter(x => x.vehicleId !== id)
      saveEntries(next)
      return next
    })
  }, [])

  const addEntry = useCallback((e: Omit<MaintenanceEntry, 'id'>) => {
    setEntries(prev => {
      const next = [...prev, { ...e, id: generateId() }]
      saveEntries(next)
      return next
    })
  }, [])

  const updateEntry = useCallback((e: MaintenanceEntry) => {
    setEntries(prev => {
      const next = prev.map(x => (x.id === e.id ? e : x))
      saveEntries(next)
      return next
    })
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => {
      const next = prev.filter(x => x.id !== id)
      saveEntries(next)
      return next
    })
  }, [])

  const loadDemoData = useCallback(() => {
    setVehicles(() => {
      saveVehicles(demoVehicles)
      return demoVehicles
    })
    setEntries(() => {
      saveEntries(demoEntries)
      return demoEntries
    })
  }, [])

  return (
    <AppContext value={{
      vehicles, entries, page, selectedVehicleId, darkMode,
      setPage, setSelectedVehicleId, toggleDarkMode,
      addVehicle, updateVehicle, deleteVehicle,
      addEntry, updateEntry, deleteEntry, loadDemoData, setVehicles, setEntries,
    }}>
      {children}
    </AppContext>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
